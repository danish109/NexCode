import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCode,
  FiCpu,
  FiDatabase,
  FiLayers,
  FiLock,
  FiServer,
  FiUsers,
} from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router";
import logo1 from "../assets/logo1.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
     {/* Navigation Bar */}
<nav className="sticky top-0 z-50 bg-gray-900 backdrop-blur-md border-b border-gray-700 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 md:h-20 py-2">
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center"
      >
        <button
          onClick={() => handleLogin()}
          className="px-4 py-1 md:px-6 md:py-2 rounded-lg md:rounded-xl text-sm md:text-lg lg:text-xl font-medium bg-white text-black hover:bg-yellow-600 transition-colors whitespace-nowrap"
        >
          Sign In
        </button>
      </motion.div>
    </div>
  </div>
</nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Master Coding Interviews
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
                The ultimate platform to prepare for your next technical
                interview with real-world coding challenges.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg text-lg hover:bg-yellow-600 transition-colors"
                onClick={() => handleLogin()}
              >
                Get Started <FiArrowRight className="inline ml-2" />
              </motion.button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative w-full max-w-4xl h-96 bg-gray-700/50 rounded-xl border border-gray-600 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/70"></div>
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-gray-600/50 rounded-lg overflow-hidden">
                {/* Code editor mockup */}
                <div className="h-full bg-gray-900 p-4">
                  <div className="flex space-x-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="font-mono text-sm">
                    <div className="text-yellow-400">function</div>
                    <div className="text-purple-400 ml-4">twoSum</div>
                    <div className="text-gray-400">(nums, target)</div>
                    <div className="text-gray-400">{"{"}</div>
                    <div className="text-blue-400 ml-4">const</div>
                    <div className="text-gray-300"> map = </div>
                    <div className="text-blue-400">new</div>
                    <div className="text-gray-300"> Map();</div>
                    <div className="text-purple-400 ml-4">for</div>
                    <div className="text-gray-300">
                      {" "}
                      (let i = 0; i {"<"} nums.length; i++) {"{"}
                    </div>
                    <div className="text-blue-400 ml-8">const</div>
                    <div className="text-gray-300">
                      {" "}
                      complement = target - nums[i];
                    </div>
                    <div className="text-purple-400 ml-8">if</div>
                    <div className="text-gray-300">
                      {" "}
                      (map.has(complement)) {"{"}
                    </div>
                    <div className="text-purple-400 ml-12">return</div>
                    <div className="text-gray-300">
                      {" "}
                      [map.get(complement), i];
                    </div>
                    <div className="text-gray-400 ml-8">{"}"}</div>
                    <div className="text-gray-300 ml-8">
                      map.set(nums[i], i);
                    </div>
                    <div className="text-gray-400 ml-4">{"}"}</div>
                    <div className="text-purple-400 ml-4">return</div>
                    <div className="text-gray-300"> [];</div>
                    <div className="text-gray-400">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                Why Choose NexCode?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to crack your next coding interview
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-600 hover:border-yellow-500 transition-colors"
              >
                <div className="text-yellow-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from developers who landed their dream jobs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-600"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to ace your next interview?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of developers who improved their coding skills with
              NexCode
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg text-lg hover:bg-yellow-600 transition-colors"
              onClick={() => handleLogin()}
            >
              Start Practicing Now <FiArrowRight className="inline ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Data for features
const features = [
  {
    icon: <FiCpu size={24} />,
    title: "Real Interview Questions",
    description:
      "Practice with questions asked by top tech companies like Google, Amazon, and Facebook.",
  },
  {
    icon: <FiDatabase size={24} />,
    title: "Detailed Solutions",
    description:
      "Learn from comprehensive explanations and optimized solutions for each problem.",
  },
  {
    icon: <FiLayers size={24} />,
    title: "Multiple Languages",
    description:
      "Solve problems in your preferred language with support for 10+ programming languages.",
  },
  {
    icon: <FiServer size={24} />,
    title: "Performance Analysis",
    description:
      "Get detailed runtime and memory usage metrics for your solutions.",
  },
  {
    icon: <FiUsers size={24} />,
    title: "Community Support",
    description:
      "Join discussions with thousands of developers to share knowledge and tips.",
  },
  {
    icon: <FiLock size={24} />,
    title: "Premium Content",
    description:
      "Access exclusive problems and company-specific question banks.",
  },
];

// Data for testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    quote:
      "NexCode helped me land my dream job at Google. The problems are very similar to actual interview questions.",
  },
  {
    name: "Michael Chen",
    role: "Frontend Developer at Facebook",
    quote:
      "The detailed solutions and explanations helped me understand patterns I was missing in my approach.",
  },
  {
    name: "David Wilson",
    role: "Backend Engineer at Amazon",
    quote:
      "I went through all the system design problems and they were incredibly helpful for my onsite interviews.",
  },
];

export default LandingPage;
