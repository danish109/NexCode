import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { registerUser } from '../authSlice';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          </motion.div>

          <motion.h2 
            className="text-3xl font-bold text-center text-gray-100 mb-2"
            variants={itemVariants}
          >
            Join LeetCode
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-center mb-8"
            variants={itemVariants}
          >
            Start your coding journey today
          </motion.p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-red-400 text-sm mt-1 block">{errors.firstName.message}</span>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="emailId" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="emailId"
                type="email"
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${errors.emailId ? 'border-red-500' : 'border-gray-600'} text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-red-400 text-sm mt-1 block">{errors.emailId.message}</span>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition pr-12`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-sm mt-1 block">{errors.password.message}</span>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-lg transition ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                disabled={loading}
                variants={buttonVariants}
                whileHover={!loading ? "hover" : {}}
                whileTap={!loading ? "tap" : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-6 text-sm text-gray-400"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <NavLink 
              to="/login" 
              className="text-yellow-500 hover:text-yellow-400 font-medium hover:underline transition"
            >
              Log in
            </NavLink>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Signup;