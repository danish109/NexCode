import React, { Fragment } from "react";
import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, AlertTriangle, Loader2, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProblems = [...problems].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredProblems = sortedProblems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch problems. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (problem) => {
    setSelectedProblem(problem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProblem) return;
    
    try {
      setDeletingId(selectedProblem._id);
      await axiosClient.delete(`/problem/delete/${selectedProblem._id}`);
      setProblems(problems.filter(problem => problem._id !== selectedProblem._id));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete problem. Please try again.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setSelectedProblem(null);
    }
  };

  const DifficultyBadge = ({ difficulty }) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (difficulty === 'Easy') {
      return <span className={`${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300`}>{difficulty}</span>;
    } else if (difficulty === 'Medium') {
      return <span className={`${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`}>{difficulty}</span>;
    } else {
      return <span className={`${baseClasses} bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300`}>{difficulty}</span>;
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="ml-1 w-4 h-4" /> 
      : <ChevronDown className="ml-1 w-4 h-4" />;
  };

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading problems...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 text-red-800 dark:text-red-200">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchProblems}
            className="mt-2 text-sm bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 px-3 py-1 rounded transition text-red-700 dark:text-red-200"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Problem Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Delete problems from the platform</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search problems..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => requestSort('_id')}
                >
                  <div className="flex items-center group">
                    #
                    <SortIcon columnKey="_id" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => requestSort('title')}
                >
                  <div className="flex items-center group">
                    Title
                    <SortIcon columnKey="title" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => requestSort('difficulty')}
                >
                  <div className="flex items-center group">
                    Difficulty
                    <SortIcon columnKey="difficulty" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <React.Fragment key={problem._id}>
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleRowExpand(problem._id)}
                            className="mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {expandedRows[problem._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {problem.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.split(',').slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {tag.trim()}
                            </span>
                          ))}
                          {problem.tags.split(',').length > 2 && (
                            <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              +{problem.tags.split(',').length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClick(problem)}
                          disabled={deletingId === problem._id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {deletingId === problem._id ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-1.5 h-3 w-3" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </motion.tr>
                    {expandedRows[problem._id] && (
                      <tr className="bg-gray-50 dark:bg-gray-700/10">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-1">Description</h4>
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                                  {problem.description || 'No description available'}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">All Tags</h4>
                                <div className="flex flex-wrap gap-1">
                                  {problem.tags.split(',').map((tag, i) => (
                                    <span key={i} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No problems match your search' : 'No problems found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProblems.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProblems.length} of {problems.length} problems
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProblem && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-500/20 mr-3">
                    <AlertTriangle className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
                  disabled={deletingId === selectedProblem._id}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center"
                  disabled={deletingId === selectedProblem._id}
                >
                  {deletingId === selectedProblem._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Problem
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDelete;