import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import AdminUpdate from "./components/AdminUpdate";
import UserManagement from "./components/usermanagement";
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import LandingPage from "./pages/landing";
import AdminSettings from "./components/AdminSettings";
import Discuss from "./components/Discuss";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import RecentActivity   from "./components/RecentActivity"

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  // Footer component
  const Footer = () => (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-500">NexCode</h3>
            <p className="text-sm   text-yellow-500" >
              Level up your coding skills and quickly land a job.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-500 hover:text-blue-400 transition">
                <FaLinkedin size={30} />
              </a>
              <a href="#" className="text-white hover:text-yellow-100 transition">
                <FaGithub size={30} />
              </a>
              <a href="#" className="text-blue-300 hover:text-blue-100 transition">
                <FaTwitter size={30} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Premium</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Questions</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Interview</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Contest</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">About</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Privacy</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Terms</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Discussion</a></li>
              <li><a href="#" className="text-sm hover:text-yellow-500 transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright and Credits */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-white mb-4 md:mb-0">
            © {new Date().getFullYear()} NexCode. All rights reserved.
          </div>
          <div className="text-xs text-white">
            Created by Mohammad Danish • <a href="mailto:danishhma651@gmail.com" className="hover:text-yellow-500 transition">danishhma651@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
           <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={isAuthenticated ? <Homepage /> : <Navigate to="/" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
          <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
          <Route path="/discuss" element={isAuthenticated  ? <Discuss /> : <Navigate to="/discuss" />} />
          <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
          <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
          <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={isAuthenticated && user?.role === 'admin' ? <UserManagement /> : <Navigate to="/" />} />
          <Route path="/admin/activity" element={isAuthenticated && user?.role === 'admin' ? <RecentActivity /> : <Navigate to="/" />} />
          <Route path="/admin/analytics" element={isAuthenticated && user?.role === 'admin' ? <AnalyticsDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/settings" element={isAuthenticated && user?.role === 'admin' ? <AdminSettings /> : <Navigate to="/" />} />
          <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
          <Route path="/problem/:problemId" element={<ProblemPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;