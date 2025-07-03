import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function AgentSidebarLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 2.5 }}
        className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-purple-700 via-fuchsia-500 to-purple-700 p-6 flex flex-col justify-between text-white shadow-xl z-50"
      >
        <div>
          {/* 🟣 Single-line Animated Title */}
          <h2 className="text-2xl font-extrabold tracking-wide mb-6 whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-300 to-white animate-pulse">
            AGENT PANEL
          </h2>

          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link
              to="/agent/orders"
              className="hover:text-yellow-300 transition duration-300"
            >
               HOME
            </Link>
            <Link
              to="/agent/assigned-orders"
              className="hover:text-yellow-300 transition duration-300"
            >
              ASSIGNED ORDERS
            </Link>
            <Link
              to="/agent/update-status"
              className="hover:text-yellow-300 transition duration-300"
            >
              UPDATE STATUS
            </Link>
            <Link
              to="/agent/delivery-timeline"
              className="hover:text-yellow-300 transition duration-300"
            >
              DELIVERY TIMELINE
            </Link>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-white text-black hover:bg-gray-100 transition duration-300 py-2 rounded shadow font-semibold"
          >
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="ml-64 flex-1 p-8 min-h-screen bg-white/30 backdrop-blur-sm text-gray-900"
      >
        {children}
      </motion.main>
    </div>
  );
}

export default AgentSidebarLayout;
