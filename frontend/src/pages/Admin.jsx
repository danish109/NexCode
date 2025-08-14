
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Video, Settings, Shield, Database, Users, FileText, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronDown, FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi';
import logo1 from "../assets/logo1.png";
import { logoutUser } from '../authSlice';
import axios from 'axios';

function Admin() {
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    problems: 0,
    videos: 0,
    admins: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, replace these with actual API calls
        const [problemsRes, videosRes, adminsRes] = await Promise.all([
          axios.get('/api/problems/count'),
          axios.get('/api/videos/count'),
          axios.get('/api/admins/count')
        ]);
        
        setStats({
          problems: problemsRes.data.count || 1248,
          videos: videosRes.data.count || 326,
          admins: adminsRes.data.count || 8,
          activeUsers: 5423 // This would come from another endpoint
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Fallback to default values
        setStats({
          problems: 1248,
          videos: 326,
          admins: 8,
          activeUsers: 5423
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'from-emerald-500 to-emerald-600',
      iconColor: 'text-emerald-500',
      route: '/admin/create'
    },
    {
      id: 'manage',
      title: 'Manage Content',
      description: 'Edit, organize, and update platform content',
      icon: Edit,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
      route: '/admin/update'
    },
    {
      id: 'media',
      title: 'Media Library',
      description: 'Upload and manage video tutorials',
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
      route: '/admin/video'
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      color: 'from-amber-500 to-amber-600',
      iconColor: 'text-amber-500',
      route: '/admin/users'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'bg-rose-500',
      hoverColor: 'hover:bg-rose-600',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
      iconColor: 'text-rose-600 dark:text-rose-400',
      route: '/admin/delete'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure platform-wide settings',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      iconColor: 'text-gray-500',
      route: '/admin/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Enhanced Navigation Bar */}
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.firstName}. Here's what's happening with your platform today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none">
                Quick Action
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Problems Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-md p-3">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Problems
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {loading ? (
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          new Intl.NumberFormat().format(stats.problems)
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
              <div className="text-sm">
                <NavLink
                  to="/home"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  View all
                </NavLink>
              </div>
            </div>
          </div>

          {/* Videos Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-md p-3">
                  <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Video Tutorials
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {loading ? (
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          new Intl.NumberFormat().format(stats.videos)
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
              <div className="text-sm">
                <NavLink
                  to="/admin/video"
                  className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500"
                >
                  Manage media
                </NavLink>
              </div>
            </div>
          </div>

          {/* Admins Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-md p-3">
                  <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Admin Users
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {loading ? (
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          new Intl.NumberFormat().format(stats.admins)
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
              <div className="text-sm">
                <NavLink
                  to="/admin/users"
                  className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500"
                >
                  Manage admins
                </NavLink>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Users
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {loading ? (
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          new Intl.NumberFormat().format(stats.activeUsers)
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
              <div className="text-sm">
                <NavLink
                  to="/admin/analytics"
                  className="font-medium text-green-600 dark:text-green-400 hover:text-green-500"
                >
                  View analytics
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <NavLink
                key={option.id}
                to={option.route}
                className="group"
              >
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg h-full border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 bg-gradient-to-r ${option.color} p-3 rounded-md`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {option.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </NavLink>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Activity items would go here */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity. Check back later.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4">
            <NavLink
              to="/admin/activity"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              View all activity
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;