import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';

function AdminUpload() {
  const { problemId } = useParams();
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); // Reset form after successful upload
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700 relative overflow-hidden"
        variants={itemVariants}
      >
        {/* Animated background effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-10 blur-lg"></div>
        
        <div className="relative z-10">
          <motion.div className="flex justify-center mb-6" variants={itemVariants}>
            <div className="bg-yellow-500 p-3 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </motion.div>

          <motion.h2 
            className="text-3xl font-bold text-center text-gray-100 mb-2"
            variants={itemVariants}
          >
            Upload Video Solution
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-center mb-8"
            variants={itemVariants}
          >
            Problem ID: {problemId}
          </motion.p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* File Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="videoFile" className="block text-sm font-medium text-gray-300 mb-1">
                Choose video file
              </label>
              <div className="relative">
                <input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  {...register('videoFile', {
                    required: 'Please select a video file',
                    validate: {
                      isVideo: (files) => {
                        if (!files || !files[0]) return 'Please select a video file';
                        const file = files[0];
                        return file.type.startsWith('video/') || 'Please select a valid video file';
                      },
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        const file = files[0];
                        const maxSize = 100 * 1024 * 1024; // 100MB
                        return file.size <= maxSize || 'File size must be less than 100MB';
                      }
                    }
                  })}
                  className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer`}
                  disabled={uploading}
                />
                <div className={`flex items-center justify-between px-4 py-3 rounded-lg bg-gray-700 border ${errors.videoFile ? 'border-red-500' : 'border-gray-600'} text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}>
                  <span className="truncate mr-2">
                    {selectedFile ? selectedFile.name : 'Select a video file...'}
                  </span>
                  <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                    Browse
                  </span>
                </div>
              </div>
              {errors.videoFile && (
                <span className="text-red-400 text-sm mt-1 block">{errors.videoFile.message}</span>
              )}
            </motion.div>

            {/* Selected File Info */}
            {selectedFile && (
              <motion.div 
                className="p-4 rounded-lg bg-gray-700 border border-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-bold text-gray-200 mb-2">Selected File Details:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="truncate">{selectedFile.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <p>{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <p>{selectedFile.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Modified:</span>
                    <p>{new Date(selectedFile.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {errors.root && (
              <motion.div 
                className="p-4 rounded-lg bg-red-900/30 border border-red-500 text-red-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.root.message}</span>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {uploadedVideo && (
              <motion.div 
                className="p-4 rounded-lg bg-green-900/30 border border-green-500 text-green-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Upload Successful!</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-1">
                      <div>
                        <span className="text-green-300">Duration:</span>
                        <p>{formatDuration(uploadedVideo.duration)}</p>
                      </div>
                      <div>
                        <span className="text-green-300">Uploaded:</span>
                        <p>{new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-green-300">URL:</span>
                        <p className="truncate">{uploadedVideo.secureUrl}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upload Button */}
            <motion.div 
              className="pt-2"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-lg transition ${uploading ? 'opacity-80 cursor-not-allowed' : ''}`}
                disabled={uploading}
                variants={buttonVariants}
                whileHover={!uploading ? "hover" : {}}
                whileTap={!uploading ? "tap" : {}}
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Video"
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminUpload;