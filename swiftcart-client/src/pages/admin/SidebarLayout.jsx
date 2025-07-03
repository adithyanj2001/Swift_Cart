import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUserShield,
  FaUsers,
  FaChartLine,
  FaStore,
  FaSignOutAlt,
} from 'react-icons/fa';

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-800 via-fuchsia-600 to-pink-500 text-white flex flex-col justify-between p-6 shadow-2xl fixed top-0 left-0 h-screen">
        <div>
          <h2 className="text-2xl font-extrabold mb-8 tracking-wide bg-gradient-to-r from-white via-yellow-100 to-white text-transparent bg-clip-text">
            SWIFT CART
          </h2>
          <nav className="flex flex-col gap-3">
            <SidebarLink to="/admin/dashboard" label="Dashboard" icon={<FaHome />} current={location.pathname} />
            <SidebarLink to="/admin/vendors" label="Vendors" icon={<FaStore />} current={location.pathname} />
            <SidebarLink to="/admin/agents" label="Agents" icon={<FaUserShield />} current={location.pathname} />
            <SidebarLink to="/admin/users" label="Customers" icon={<FaUsers />} current={location.pathname} />
            <SidebarLink to="/admin/sales-chart" label="Sales Chart" icon={<FaChartLine />} current={location.pathname} />
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-white text-pink-600 hover:bg-gray-100 font-semibold py-2 rounded transition"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full overflow-y-auto p-8 bg-gradient-to-br from-white via-gray-50 to-white min-h-screen">
        {children}
      </main>
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ to, label, icon, current }) => {
  const isActive = current === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition ${
        isActive
          ? 'bg-white text-pink-600 font-bold shadow'
          : 'hover:bg-pink-500 hover:text-white text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
};

export default SidebarLayout;
