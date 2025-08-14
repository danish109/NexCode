// import { useState, useEffect } from 'react';
// import axiosClient from '../utils/axiosClient';
// import { Code, Clock, Cpu, HardDrive, CheckCircle, XCircle, Loader2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const SubmissionHistory = ({ problemId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
//         setSubmissions(response.data);
//         setError(null);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch submission history');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubmissions();
//   }, [problemId]);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'accepted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
//       case 'wrong answer': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
//       case 'error': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
//       case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status.toLowerCase()) {
//       case 'accepted': return <CheckCircle size={16} />;
//       case 'wrong answer': return <XCircle size={16} />;
//       case 'error': return <XCircle size={16} />;
//       case 'pending': return <Loader2 size={16} className="animate-spin" />;
//       default: return null;
//     }
//   };

//   const formatMemory = (memory) => {
//     if (!memory) return 'N/A';
//     if (memory < 1024) return `${memory} KB`;
//     return `${(memory / 1024).toFixed(2)} MB`;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString([], {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 rounded-lg bg-red-900/20 border border-red-500 text-red-200">
//         <div className="flex items-center">
//           <XCircle className="h-5 w-5 mr-2" />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-xl font-bold flex items-center gap-2">
//           <Code size={20} />
//           Submission History
//         </h2>
//       </div>

//       <div className="p-4">
//         {submissions.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12"
//           >
//             <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
//               <Code size={40} className="text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
//             <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
//               You haven't submitted any solutions for this problem yet. Solve the problem to see your submission history here.
//             </p>
//           </motion.div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-800">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       #
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Language
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Runtime
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Memory
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Test Cases
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Submitted
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//                   {submissions.map((sub, index) => (
//                     <motion.tr
//                       key={sub._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.2, delay: index * 0.05 }}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
//                         {sub.language}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(sub.status)}`}>
//                           {getStatusIcon(sub.status)}
//                           {sub.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
//                         {sub.runtime}s
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
//                         {formatMemory(sub.memory)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
//                         {sub.testCasesPassed}/{sub.testCasesTotal}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                         {formatDate(sub.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => setSelectedSubmission(sub)}
//                           className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-medium"
//                         >
//                           View Code
//                         </button>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//               Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Submission Details Modal */}
//       <AnimatePresence>
//         {selectedSubmission && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
//             >
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                 <h3 className="font-bold text-lg">
//                   Submission Details: {selectedSubmission.language}
//                 </h3>
//                 <button
//                   onClick={() => setSelectedSubmission(null)}
//                   className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedSubmission.status)}`}>
//                     {getStatusIcon(selectedSubmission.status)}
//                     {selectedSubmission.status}
//                   </span>
//                   <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center gap-1">
//                     <Clock size={12} />
//                     {selectedSubmission.runtime}s
//                   </span>
//                   <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center gap-1">
//                     <HardDrive size={12} />
//                     {formatMemory(selectedSubmission.memory)}
//                   </span>
//                   <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center gap-1">
//                     <Cpu size={12} />
//                     {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal} passed
//                   </span>
//                 </div>

//                 {selectedSubmission.errorMessage && (
//                   <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
//                     {selectedSubmission.errorMessage}
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1 overflow-auto">
//                 <pre className="p-4 text-sm bg-gray-900 text-gray-100 font-mono overflow-x-auto">
//                   <code>{selectedSubmission.code}</code>
//                 </pre>
//               </div>

//               <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
//                 <button
//                   onClick={() => setSelectedSubmission(null)}
//                   className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default SubmissionHistory;


import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Code, Clock, Cpu, HardDrive, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [hasSolved, setHasSolved] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        
        // Check if user has at least one accepted submission
        const solved = response.data.some(sub => 
          sub.status.toLowerCase() === 'accepted'
        );
        setHasSolved(solved);
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'wrong answer': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      case 'error': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted': return <CheckCircle size={16} />;
      case 'wrong answer': return <XCircle size={16} />;
      case 'error': return <XCircle size={16} />;
      case 'pending': return <Loader2 size={16} className="animate-spin" />;
      default: return null;
    }
  };

  const formatMemory = (memory) => {
    if (!memory) return 'N/A';
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
        <p className="text-gray-500 dark:text-gray-400">Loading your submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-900/20 border border-red-500 text-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Error loading submissions</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Code className="text-yellow-500" size={20} />
          <span>Your Submissions</span>
          {hasSolved && (
            <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle size={14} />
              Problem Solved
            </span>
          )}
        </h2>
      </div>

      <div className="p-4">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Code size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {hasSolved ? 
                "You haven't submitted any additional solutions yet." : 
                "You haven't solved this problem yet. Submit your first solution to see it here."}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Language
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Runtime
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Memory
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Test Cases
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {submissions.map((sub, index) => (
                    <motion.tr
                      key={sub._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                        {sub.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(sub.status)}`}>
                          {getStatusIcon(sub.status)}
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                        {sub.runtime}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                        {formatMemory(sub.memory)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                        {sub.testCasesPassed}/{sub.testCasesTotal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(sub.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-medium"
                        >
                          View Code
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
              <span>
                Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </span>
              {hasSolved && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={16} />
                  You've successfully solved this problem
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Submission Details Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-lg">
                  Submission Details: {selectedSubmission.language}
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    {selectedSubmission.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center gap-1">
                    <Clock size={12} />
                    {selectedSubmission.runtime}s
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center gap-1">
                    <HardDrive size={12} />
                    {formatMemory(selectedSubmission.memory)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 flex items-center gap-1">
                    <Cpu size={12} />
                    {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal} passed
                  </span>
                </div>

                {selectedSubmission.errorMessage && (
                  <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                    {selectedSubmission.errorMessage}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm bg-gray-900 text-gray-100 font-mono overflow-x-auto">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionHistory;