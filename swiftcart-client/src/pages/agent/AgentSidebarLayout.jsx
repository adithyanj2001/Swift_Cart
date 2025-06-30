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
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-red-800 to-black p-6 flex flex-col justify-between text-white shadow-xl z-50"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-wide mb-6">AGENT PANEL</h2>
          <nav className="flex flex-col gap-4 text-base">
            <Link to="/agent/orders" className="hover:text-yellow-400 transition duration-300">Home</Link>
            <Link to="/agent/assigned-orders" className="hover:text-yellow-400 transition duration-300">Assigned Orders</Link>
            <Link to="/agent/update-status" className="hover:text-yellow-400 transition duration-300">Update Status</Link>
            <Link to="/agent/delivery-timeline" className="hover:text-yellow-400 transition duration-300">Delivery Timeline</Link>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300 py-2 rounded shadow-md font-semibold"
          >
            Logout
          </button>
        </div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen overflow-y-auto"
      >
        {children}
      </motion.main>
    </div>
  );
}

export default AgentSidebarLayout;