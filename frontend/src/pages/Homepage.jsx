
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import logo1 from "../assets/logo1.png"
import { FiChevronDown, FiCheck, FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
    search: ''
  });
  const [searchInput, setSearchInput] = useState(''); // Separate state for search input
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          user ? axiosClient.get('/problem/problemSolvedByUser') : Promise.resolve({ data: [] })
        ]);
        
        setProblems(problemsRes.data);
        setSolvedProblems(solvedRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    navigate('/');
  };

  const handleSearch = () => {
    // Update filters with the search input and reset to first page
    setFilters(prev => ({
      ...prev,
      search: searchInput
    }));
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty.toLowerCase() === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags.toLowerCase() === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id)) ||
                      (filters.status === 'unsolved' && !solvedProblems.some(sp => sp._id === problem._id));
    const searchMatch = filters.search === '' || 
                       problem.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                       problem.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  // Pagination logic
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
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
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const DifficultyPill = ({ difficulty }) => {
    const colors = {
      easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const TagPill = ({ tag }) => (
    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
      {tag}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className=" top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                     <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ type: "spring", stiffness: 260, damping: 20 }}
                       className="rounded"
                     >
                       <img
                         src={logo1}
                         alt="Nexcode Logo"
                         className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-xl"
                       />
                     </motion.div>
                     <motion.span
                       className="ml-2 md:ml-3 text-2xl md:text-4xl lg:text-5xl font-bold text-white"
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.1 }}
                     >
                       NexCode
                     </motion.span>
                   </div>

              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <NavLink
                    to="/home"
                    className={`px-3 py-2 rounded-md text-xl font-medium ${location.pathname === '/home' ? 'bg-orange-100 text-white dark:bg-Blue-900/30 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Problems
                  </NavLink>
                  <NavLink
                    to="/discuss"
                    className={`px-3 py-2 rounded-md text-xl font-medium ${location.pathname === '/discuss' ? 'bg-orange-100 text-yellow-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Discuss
                  </NavLink>
                  {user?.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      className={`px-3 py-2 rounded-md text-xl font-medium ${location.pathname === '/admin' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      Admin
                    </NavLink>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="relative ml-3">
                    <div className="flex items-center space-x-4">
                      <div className="relative group">
                        <button className="flex items-center text-sm rounded-full focus:outline-none">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-yellow-300 flex items-center justify-center text-black font-medium">
                            {user.firstName.charAt(0).toUpperCase()}
                          </div>
                          <FiChevronDown className="ml-1 text-gray-500 dark:text-gray-400" />
                        </button>

                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                          >
                            <FiLogOut className="mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavLink
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Problems
                </NavLink>
                <NavLink
                  to="/discuss"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/discuss' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Discuss
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/admin' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Admin
                  </NavLink>
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {user.firstName}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-auto bg-gray-100 dark:bg-gray-700 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Sign out</span>
                      <FiLogOut className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-1 px-2">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header and Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Problems</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filters.tag}
              onChange={(e) => setFilters({...filters, tag: e.target.value})}
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="linkedlist">Linked List</option>
              <option value="tree">Tree</option>
              <option value="graph">Graph</option>
              <option value="dp">Dynamic Programming</option>
              <option value="backtracking">Backtracking</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <motion.div 
          className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentProblems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {filters.search ? 
                        `No problems found matching "${filters.search}"` : 
                        'No problems found matching your criteria'}
                    </td>
                  </tr>
                ) : (
                  currentProblems.map((problem, idx) => (
                    <motion.tr 
                      key={problem._id}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.05)' }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {solvedProblems.some(sp => sp._id === problem._id) ? (
                          <FiCheck className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <div className="h-5 w-5"></div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <NavLink
                          to={`/problem/${problem._id}`}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {problem.title}
                        </NavLink>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DifficultyPill difficulty={problem.difficulty.toLowerCase()} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <TagPill tag={problem.tags} />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {!loading && filteredProblems.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{indexOfFirstProblem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastProblem, filteredProblems.length)}
              </span> of{' '}
              <span className="font-medium">{filteredProblems.length}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? 'bg-orange-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-orange-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Homepage;
