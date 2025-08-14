import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiCode, FiFileText } from 'react-icons/fi';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

const tagColors = {
  array: 'bg-blue-100 text-blue-800',
  linkedList: 'bg-purple-100 text-purple-800',
  graph: 'bg-pink-100 text-pink-800',
  dp: 'bg-indigo-100 text-indigo-800'
};

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
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

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      navigate('/admin');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Watch form values for real-time preview
  const formValues = watch();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  const cardVariants = {
    hover: {
      y: -3,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
    }
  };

  const collapseVariants = {
    open: { 
      opacity: 1,
      height: "auto",
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 30 
      }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 30 
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Panel - only visible on larger screens */}
        <div className="hidden lg:block lg:col-span-1">
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-8 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gray-800 px-5 py-4">
              <h2 className="text-lg font-bold text-white">Problem Preview</h2>
            </div>
            <div className="p-5 space-y-4">
              {formValues.title ? (
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{formValues.title}</h3>
                  {formValues.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[formValues.difficulty]}`}>
                      {formValues.difficulty.charAt(0).toUpperCase() + formValues.difficulty.slice(1)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              )}

              {formValues.tags && (
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${tagColors[formValues.tags]}`}>
                    {formValues.tags.split(/(?=[A-Z])/).join(' ')}
                  </span>
                </div>
              )}

              {formValues.description ? (
                <div className="prose max-w-none text-sm text-gray-600">
                  <p className="line-clamp-4">{formValues.description}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Test Cases</h4>
                {formValues.visibleTestCases?.length > 0 ? (
                  <div className="space-y-3">
                    {formValues.visibleTestCases.slice(0, 2).map((testCase, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 block">Input:</span>
                            <code className="text-xs line-clamp-2">{testCase.input}</code>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Output:</span>
                            <code className="text-xs line-clamp-2">{testCase.output}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                    {formValues.visibleTestCases.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">
                        + {formValues.visibleTestCases.length - 2} more test cases
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-center text-sm text-gray-500">
                    No test cases added yet
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            variants={itemVariants}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Create New Problem</h1>
                  <p className="text-blue-100 mt-1">Add a new coding challenge to the platform</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[formValues.difficulty] || 'bg-gray-200 text-gray-800'}`}>
                    {formValues.difficulty ? formValues.difficulty.charAt(0).toUpperCase() + formValues.difficulty.slice(1) : 'Difficulty'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[formValues.tags] || 'bg-gray-200 text-gray-800'}`}>
                    {formValues.tags ? formValues.tags.split(/(?=[A-Z])/).join(' ') : 'Tag'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
              {/* Basic Information */}
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-xs border border-gray-200"
                variants={itemVariants}
                whileHover={cardVariants.hover}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    <FiFileText className="inline mr-2 text-blue-600" />
                    Basic Information
                  </h2>
                  <div className="text-sm text-gray-500">
                    Required fields
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('title')}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="Problem title"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('description')}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="Detailed problem description with examples"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Markdown is supported
                    </div>
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('difficulty')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.difficulty ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent`}
                      >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('tags')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.tags ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent`}
                      >
                        <option value="">Select category</option>
                        <option value="array">Array</option>
                        <option value="linkedList">Linked List</option>
                        <option value="graph">Graph</option>
                        <option value="dp">Dynamic Programming</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Test Cases */}
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-xs border border-gray-200"
                variants={itemVariants}
                whileHover={cardVariants.hover}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    <FiCode className="inline mr-2 text-blue-600" />
                    Test Cases
                  </h2>
                  <div className="text-sm text-gray-500">
                    At least one of each required
                  </div>
                </div>
                
                {/* Visible Test Cases */}
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">Visible Test Cases</h3>
                    <motion.button
                      type="button"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiPlus className="mr-1" /> Add Case
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {visibleFields.map((field, index) => (
                      <motion.div 
                        key={field.id} 
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4"
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Test Case #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVisible(index)}
                            className="text-sm text-red-600 hover:text-red-800 inline-flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Remove
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Input <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            placeholder="e.g., [1,2,3]"
                            rows={2}
                            className={`w-full px-3 py-2 rounded border ${errors.visibleTestCases?.[index]?.input ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                          />
                          {errors.visibleTestCases?.[index]?.input && (
                            <p className="mt-1 text-xs text-red-600">{errors.visibleTestCases[index].input.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Output <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.output`)}
                            placeholder="e.g., 6"
                            rows={2}
                            className={`w-full px-3 py-2 rounded border ${errors.visibleTestCases?.[index]?.output ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                          />
                          {errors.visibleTestCases?.[index]?.output && (
                            <p className="mt-1 text-xs text-red-600">{errors.visibleTestCases[index].output.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explanation <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            placeholder="Explain why this output is expected"
                            rows={3}
                            className={`w-full px-3 py-2 rounded border ${errors.visibleTestCases?.[index]?.explanation ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                          />
                          {errors.visibleTestCases?.[index]?.explanation && (
                            <p className="mt-1 text-xs text-red-600">{errors.visibleTestCases[index].explanation.message}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Hidden Test Cases */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">Hidden Test Cases</h3>
                    <motion.button
                      type="button"
                      onClick={() => appendHidden({ input: '', output: '' })}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiPlus className="mr-1" /> Add Case
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {hiddenFields.map((field, index) => (
                      <motion.div 
                        key={field.id} 
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4"
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Hidden Case #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeHidden(index)}
                            className="text-sm text-red-600 hover:text-red-800 inline-flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Remove
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Input <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            placeholder="e.g., [1,2,3]"
                            rows={2}
                            className={`w-full px-3 py-2 rounded border ${errors.hiddenTestCases?.[index]?.input ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                          />
                          {errors.hiddenTestCases?.[index]?.input && (
                            <p className="mt-1 text-xs text-red-600">{errors.hiddenTestCases[index].input.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Output <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.output`)}
                            placeholder="e.g., 6"
                            rows={2}
                            className={`w-full px-3 py-2 rounded border ${errors.hiddenTestCases?.[index]?.output ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                          />
                          {errors.hiddenTestCases?.[index]?.output && (
                            <p className="mt-1 text-xs text-red-600">{errors.hiddenTestCases[index].output.message}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Code Templates */}
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-xs border border-gray-200"
                variants={itemVariants}
                whileHover={cardVariants.hover}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    <FiCode className="inline mr-2 text-blue-600" />
                    Code Templates
                  </h2>
                  <div className="text-sm text-gray-500">
                    All languages required
                  </div>
                </div>
                
                <div className="space-y-8">
                  {[0, 1, 2].map((index) => (
                    <motion.div 
                      key={index} 
                      className="space-y-4"
                      variants={itemVariants}
                    >
                      <div className="border-b border-gray-200 pb-2">
                        <h3 className="text-lg font-medium text-gray-700">
                          {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} Templates
                        </h3>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Starter Code <span className="text-red-500">*</span>
                        </label>
                        <div className={`rounded-lg border ${errors.startCode?.[index]?.initialCode ? 'border-red-300' : 'border-gray-300'} overflow-hidden`}>
                          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-300">
                              {index === 0 ? 'main.cpp' : index === 1 ? 'Main.java' : 'solution.js'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                            </span>
                          </div>
                          <textarea
                            {...register(`startCode.${index}.initialCode`)}
                            className="w-full bg-gray-50 font-mono text-gray-800 p-4 focus:outline-none resize-none"
                            rows={8}
                            spellCheck="false"
                          />
                        </div>
                        {errors.startCode?.[index]?.initialCode && (
                          <p className="mt-1 text-xs text-red-600">{errors.startCode[index].initialCode.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reference Solution <span className="text-red-500">*</span>
                        </label>
                        <div className={`rounded-lg border ${errors.referenceSolution?.[index]?.completeCode ? 'border-red-300' : 'border-gray-300'} overflow-hidden`}>
                          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-300">
                              {index === 0 ? 'solution.cpp' : index === 1 ? 'Solution.java' : 'solution.js'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                            </span>
                          </div>
                          <textarea
                            {...register(`referenceSolution.${index}.completeCode`)}
                            className="w-full bg-gray-50 font-mono text-gray-800 p-4 focus:outline-none resize-none"
                            rows={8}
                            spellCheck="false"
                          />
                        </div>
                        {errors.referenceSolution?.[index]?.completeCode && (
                          <p className="mt-1 text-xs text-red-600">{errors.referenceSolution[index].completeCode.message}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="pt-4 border-t border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {Object.keys(errors).length > 0 ? (
                      <span className="text-red-600">
                        Please fix {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? 's' : ''} before submitting
                      </span>
                    ) : (
                      <span>All required fields completed</span>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Problem"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminPanel;