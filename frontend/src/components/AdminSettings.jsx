import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: "CodeMaster",
    maintenanceMode: false,
    registrationEnabled: true,
    darkMode: true,
    analyticsEnabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading settings
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaving(false);
    } catch (err) {
      setError("Failed to save settings");
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-gray-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-400">Loading settings...</p>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
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
      className="max-w-4xl mx-auto p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">
         "🛠This feature is currently in development. It will be available in the next update."
      </h1>
      <div className="flex items-center mb-8">
        <div className="p-3 rounded-lg bg-gray-500/10 mr-4">
          <Settings className="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Configure platform-wide settings</p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="divide-y divide-gray-700">
            {/* General Settings */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">
                General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="siteTitle"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Site Title
                  </label>
                  <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">
                System Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="maintenanceMode"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Maintenance Mode
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Disable public access to the platform
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                      className="h-4 w-4 text-gray-500 rounded border-gray-700 focus:ring-gray-500 bg-gray-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="registrationEnabled"
                      className="block text-sm font-medium text-gray-300"
                    >
                      User Registration
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Allow new users to register
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="registrationEnabled"
                      name="registrationEnabled"
                      checked={settings.registrationEnabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-gray-500 rounded border-gray-700 focus:ring-gray-500 bg-gray-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="darkMode"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Dark Mode
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Enable dark theme by default
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      name="darkMode"
                      checked={settings.darkMode}
                      onChange={handleChange}
                      className="h-4 w-4 text-gray-500 rounded border-gray-700 focus:ring-gray-500 bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">
                Analytics
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="analyticsEnabled"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Enable Analytics
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Collect usage statistics and metrics
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="analyticsEnabled"
                    name="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-500 rounded border-gray-700 focus:ring-gray-500 bg-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-700/20 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
