import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axiosClient from '../utils/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, AlertTriangle, Plus, Trash2, ChevronDown, X, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedLanguages, setExpandedLanguages] = useState({
    'C++': true,
    'Java': false,
    'JavaScript': false
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [],
      hiddenTestCases: [],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axiosClient.get(`/problem/getProblem/${id}`);
        
        reset({
          ...data,
          tags: data.tags[0], // Assuming single tag for simplicity
          visibleTestCases: data.visibleTestCases || [],
          hiddenTestCases: data.hiddenTestCases || []
        });

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch problem details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(null);

      const formattedData = {
        ...data,
        tags: [data.tags], // Convert back to array format
        problemCreator: 'admin' // Or get from auth context
      };

      await axiosClient.put(`/problem/update/${id}`, formattedData);
      
      setSuccess('Problem updated successfully!');
      setTimeout(() => navigate('/admin'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem');
      console.error(err);
    }
  };

  const toggleLanguage = (language) => {
    setExpandedLanguages(prev => ({
      ...prev,
      [language]: !prev[language]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
         
        <div className="flex flex-col items-center">
          
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Loading problem details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl mx-auto">
       <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">
         "🛠This feature is currently in development. It will be available in the next update."
      </h1>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Update Problem</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Edit the coding problem details below
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              form="problem-form"
              disabled={isSubmitting || !isDirty}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-start"
            >
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded-lg flex items-start"
            >
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <nav className="space-y-1 p-2">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'basic' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span>Basic Information</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTab('test-cases')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'test-cases' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span>Test Cases</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTab('code-templates')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'code-templates' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span>Code Templates</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Problem Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Public
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Easy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <form id="problem-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: activeTab === 'basic' ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${activeTab !== 'basic' ? 'pointer-events-none opacity-30' : ''}`}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Problem Title*
                    </label>
                    <input
                      id="title"
                      {...register('title', { required: 'Title is required' })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="Enter problem title"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      rows={8}
                      {...register('description', { required: 'Description is required' })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="Write a detailed problem description with examples"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty*
                      </label>
                      <select
                        id="difficulty"
                        {...register('difficulty')}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category*
                      </label>
                      <select
                        id="tags"
                        {...register('tags')}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="array">Array</option>
                        <option value="linkedList">Linked List</option>
                        <option value="graph">Graph</option>
                        <option value="dp">Dynamic Programming</option>
                        <option value="string">String</option>
                        <option value="tree">Tree</option>
                        <option value="hashTable">Hash Table</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Test Cases */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: activeTab === 'test-cases' ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${activeTab !== 'test-cases' ? 'pointer-events-none opacity-30' : ''}`}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Test Cases</h2>
                
                {/* Visible Test Cases */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visible Test Cases</h3>
                    <button
                      type="button"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Visible Case
                    </button>
                  </div>
                  
                  {visibleFields.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <p className="text-gray-500 dark:text-gray-400">No visible test cases added</p>
                      <button
                        type="button"
                        onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                        className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add First Test Case
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visibleFields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
                        >
                          <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Test Case {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVisible(index)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1"
                              aria-label="Remove test case"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Input*
                              </label>
                              <textarea
                                {...register(`visibleTestCases.${index}.input`, { required: 'Input is required' })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={4}
                                placeholder="e.g., [1,2,3]"
                              />
                              {errors.visibleTestCases?.[index]?.input && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                  {errors.visibleTestCases[index].input.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Output*
                              </label>
                              <textarea
                                {...register(`visibleTestCases.${index}.output`, { required: 'Output is required' })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={4}
                                placeholder="e.g., 6"
                              />
                              {errors.visibleTestCases?.[index]?.output && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                  {errors.visibleTestCases[index].output.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Explanation*
                              </label>
                              <textarea
                                {...register(`visibleTestCases.${index}.explanation`, { required: 'Explanation is required' })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={4}
                                placeholder="Describe the test case"
                              />
                              {errors.visibleTestCases?.[index]?.explanation && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                  {errors.visibleTestCases[index].explanation.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hidden Test Cases */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hidden Test Cases</h3>
                    <button
                      type="button"
                      onClick={() => appendHidden({ input: '', output: '' })}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Hidden Case
                    </button>
                  </div>
                  
                  {hiddenFields.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <p className="text-gray-500 dark:text-gray-400">No hidden test cases added</p>
                      <button
                        type="button"
                        onClick={() => appendHidden({ input: '', output: '' })}
                        className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add First Test Case
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hiddenFields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
                        >
                          <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Test Case {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeHidden(index)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1"
                              aria-label="Remove test case"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Input*
                              </label>
                              <textarea
                                {...register(`hiddenTestCases.${index}.input`, { required: 'Input is required' })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={4}
                                placeholder="e.g., [1,2,3]"
                              />
                              {errors.hiddenTestCases?.[index]?.input && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                  {errors.hiddenTestCases[index].input.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Output*
                              </label>
                              <textarea
                                {...register(`hiddenTestCases.${index}.output`, { required: 'Output is required' })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={4}
                                placeholder="e.g., 6"
                              />
                              {errors.hiddenTestCases?.[index]?.output && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                  {errors.hiddenTestCases[index].output.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Code Templates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: activeTab === 'code-templates' ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${activeTab !== 'code-templates' ? 'pointer-events-none opacity-30' : ''}`}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Code Templates</h2>
                
                <div className="space-y-6">
                  {['C++', 'Java', 'JavaScript'].map((language, index) => (
                    <div key={language} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleLanguage(language)}
                        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {language}
                        </h3>
                        <ChevronDown 
                          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedLanguages[language] ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {expandedLanguages[language] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Initial Code*
                            </label>
                            <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                              <textarea
                                {...register(`startCode.${index}.initialCode`, { required: 'Initial code is required' })}
                                className="w-full h-48 font-mono text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none resize-none"
                                spellCheck="false"
                              />
                              {errors.startCode?.[index]?.initialCode && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                  {errors.startCode[index].initialCode.message}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Reference Solution*
                            </label>
                            <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                              <textarea
                                {...register(`referenceSolution.${index}.completeCode`, { required: 'Complete code is required' })}
                                className="w-full h-48 font-mono text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none resize-none"
                                spellCheck="false"
                              />
                              {errors.referenceSolution?.[index]?.completeCode && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                  {errors.referenceSolution[index].completeCode.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateProblem;