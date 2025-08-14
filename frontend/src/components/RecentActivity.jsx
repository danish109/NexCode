import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, User } from 'lucide-react';

const RecentActivity = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setActivities([
        { 
          id: 1, 
          user: 'alice_coder', 
          action: 'Solved "Two Sum" problem', 
          time: '2 mins ago',
          avatar: 'A',
          type: 'problem'
        },
        { 
          id: 2, 
          user: 'bob_dev', 
          action: 'Completed Python Fundamentals course', 
          time: '15 mins ago',
          avatar: 'B',
          type: 'course'
        },
        { 
          id: 3, 
          user: 'charlie_ng', 
          action: 'Submitted final project for review', 
          time: '32 mins ago',
          avatar: 'C',
          type: 'project'
        },
        { 
          id: 4, 
          user: 'diana_k', 
          action: 'Started "React Basics" tutorial', 
          time: '1 hour ago',
          avatar: 'D',
          type: 'tutorial'
        },
        { 
          id: 5, 
          user: 'emma_s', 
          action: 'Earned Gold Badge in Algorithms', 
          time: '2 hours ago',
          avatar: 'E',
          type: 'achievement'
        },
        { 
          id: 6, 
          user: 'frank_l', 
          action: 'Joined the platform', 
          time: '3 hours ago',
          avatar: 'F',
          type: 'signup'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityColor = (type) => {
    switch (type) {
      case 'problem': return 'bg-green-500/10 text-green-500';
      case 'course': return 'bg-blue-500/10 text-blue-500';
      case 'project': return 'bg-purple-500/10 text-purple-500';
      case 'tutorial': return 'bg-amber-500/10 text-amber-500';
      case 'achievement': return 'bg-pink-500/10 text-pink-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-[200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-amber-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400 text-sm">Loading activity...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="p-4 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className=" p-2 rounded-lg bg-red-900/30 border border-red-500 text-red-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500  px-5 py-4">
         "🛠This feature is currently in development. It will be available in the next update."
      </h1>
      <div className="px-4 py-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-200 flex items-center">
            <Activity className="h-15 w-20 text-amber-500 mr-2" />
            Recent Activity
          </h2>
          <button className="text-2xl text-amber-500 hover:text-amber-400">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-900 px-20 py-20">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="px-5 py-5 hover:bg-gray-700/30 transition bg-gray-900 border-white rounded-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center mr-3`}>
                  <span className="text-xs font-medium">{activity.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {activity.action}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-400">No recent activity found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;