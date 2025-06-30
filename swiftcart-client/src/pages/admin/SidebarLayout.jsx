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
      {/*  Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-black to-red-800 text-white flex flex-col justify-between p-6 shadow-xl h-screen fixed left-0 top-0">
        <div>
          <h2 className="text-2xl font-extrabold mb-8 tracking-wide">Swift Cart</h2>
          <nav className="flex flex-col gap-3">
            <SidebarLink to="/admin/dashboard" label="Dashboard" icon={<FaHome />} current={location.pathname} />
            <SidebarLink to="/admin/vendors" label="Vendors" icon={<FaStore />} current={location.pathname} />
            <SidebarLink to="/admin/agents" label="Agents" icon={<FaUserShield />} current={location.pathname} />
            <SidebarLink to="/admin/users" label="Customers" icon={<FaUsers />} current={location.pathname} />
            <SidebarLink to="/admin/sales-chart" label="Sales Chart" icon={<FaChartLine />} current={location.pathname} />
          </nav>
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content  */}
      <main className="ml-64 w-full overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

// Sidebar Link 
const SidebarLink = ({ to, label, icon, current }) => {
  const isActive = current === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition ${
        isActive
          ? 'bg-white text-red-700 font-bold shadow'
          : 'hover:bg-red-700 hover:text-white text-gray-200'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
};

export default SidebarLayout;
