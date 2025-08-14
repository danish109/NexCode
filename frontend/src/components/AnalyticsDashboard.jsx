import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, BarChart2, Clock } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dummy data
  const [stats, setStats] = useState({
    activeUsers: 0,
    newSignups: 0,
    sessions: 0,
    avgSessionTime: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setStats({
        activeUsers: 1243,
        newSignups: 87,
        sessions: 3452,
        avgSessionTime: 4.7
      });
      
      setRecentActivity([
        { id: 1, user: 'alice123', action: 'Solved "Two Sum"', time: '2 mins ago' },
        { id: 2, user: 'bob_dev', action: 'Completed Python Course', time: '15 mins ago' },
        { id: 3, user: 'charlie_ng', action: 'Submitted Project', time: '32 mins ago' },
        { id: 4, user: 'diana_k', action: 'Started "React Basics"', time: '1 hour ago' },
        { id: 5, user: 'emma_s', action: 'Earned Gold Badge', time: '2 hours ago' }
      ]);
      
      setUserGrowthData([
        { day: 'Mon', users: 800 },
        { day: 'Tue', users: 950 },
        { day: 'Wed', users: 1100 },
        { day: 'Thu', users: 1050 },
        { day: 'Fri', users: 1200 },
        { day: 'Sat', users: 1400 },
        { day: 'Sun', users: 1243 }
      ]);
      
      setLoading(false);
    }, 1200);
  }, []);

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-amber-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Loading analytics...</p>
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

        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500 text-red-200">
        
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded transition"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500  top-5 px-40 py-20">
        "🛠This feature is currently in development. It will be available in the next update."
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform usage and activity metrics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Active Users */}
        <motion.div 
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-100 mt-1">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <span className="inline-block mr-1">↑</span>
                12% from yesterday
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* New Signups */}
        <motion.div 
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">New Signups</p>
              <p className="text-2xl font-bold text-gray-100 mt-1">{stats.newSignups.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <span className="inline-block mr-1">↑</span>
                5% from yesterday
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* Sessions */}
        <motion.div 
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Sessions</p>
              <p className="text-2xl font-bold text-gray-100 mt-1">{stats.sessions.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <span className="inline-block mr-1">↑</span>
                8% from yesterday
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Avg. Session Time */}
        <motion.div 
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-100 mt-1">{stats.avgSessionTime} mins</p>
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <span className="inline-block mr-1">↓</span>
                2% from yesterday
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <motion.div 
          className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-200">User Growth</h2>
            <div className="flex items-center text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Last 7 days
            </div>
          </div>
          
          <div className="h-64">
            <div className="flex items-end h-full space-x-1">
              {userGrowthData.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-sm"
                    style={{ height: `${(day.users / 1500) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-1">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-200">Recent Activity</h2>
            <button className="text-sm text-amber-500 hover:text-amber-400">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs text-gray-300">
                    {activity.user.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-400">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;