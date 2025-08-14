import { motion, AnimatePresence } from "framer-motion";
import logo1 from "../assets/logo1.png";
import { logoutUser } from "../authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronDown,
  FiCheck,
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useEffect, useState } from "react";

const Discuss = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    navigate("/");
  };

  return (
    <>
     
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
                    className={`px-3 py-2 rounded-md text-xl font-medium ${
                      location.pathname === "/home"
                        ? "bg-orange-100 text-white dark:bg-Blue-900/30 dark:text-orange-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Problems
                  </NavLink>
                  <NavLink
                    to="/discuss"
                    className={`px-3 py-2 rounded-md text-xl font-medium ${
                      location.pathname === "/discuss"
                        ? "bg-orange-100 text-yellow-600 dark:bg-orange-900/30 dark:text-orange-400"
                        : "text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Discuss
                  </NavLink>
                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className={`px-3 py-2 rounded-md text-xl font-medium ${
                        location.pathname === "/admin"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
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
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
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
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavLink
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Problems
                </NavLink>
                <NavLink
                  to="/discuss"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/discuss"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Discuss
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === "/admin"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
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
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
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
       <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">
         "🛠This feature is currently in development. It will be available in the next update."
      </h1>
    </>
  );
};

export default Discuss;
