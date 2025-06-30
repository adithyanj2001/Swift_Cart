import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'block w-full text-left px-4 py-2 bg-red-700 text-white rounded-md'
      : 'block w-full text-left px-4 py-2 text-white hover:bg-red-700 rounded-md transition';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-black via-red-800 to-black text-white px-4 md:px-6 py-4 flex items-center justify-between shadow-lg">
        {/*  Logo swift cart*/}
        <div className="text-2xl font-extrabold tracking-wide">
          <NavLink to="/vendor/dashboard/homepage" className="hover:text-red-300">
            SwiftCart
          </NavLink>
        </div>

        {/* Center - Nav Links  */}
        <div className="hidden md:flex gap-4">
          <NavLink to="/vendor/dashboard/add-products" className={linkClass}>
            Add Products
          </NavLink>
          <NavLink to="/vendor/dashboard/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/vendor/dashboard/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/vendor/dashboard/stock-tracker" className={linkClass}>
            Stock Tracker
          </NavLink>
          <NavLink to="/vendor/dashboard/sales" className={linkClass}>
            Sales
          </NavLink>
          <NavLink to="/vendor/dashboard/revenue-chart" className={linkClass}>
            Revenue Chart
          </NavLink>
        </div>

        {/* Right - Buttons */}
        <div className="flex items-center gap-3">
        
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logout Button (Desktop) */}
          <button
            onClick={handleLogout}
            className="hidden md:inline-block px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white px-4 py-4 flex flex-col gap-2 shadow-lg z-40">
          <NavLink to="/vendor/dashboard/add-products" className={linkClass} onClick={() => setMenuOpen(false)}>
            Add Products
          </NavLink>
          <NavLink to="/vendor/dashboard/products" className={linkClass} onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/vendor/dashboard/orders" className={linkClass} onClick={() => setMenuOpen(false)}>
            Orders
          </NavLink>
          <NavLink to="/vendor/dashboard/stock-tracker" className={linkClass} onClick={() => setMenuOpen(false)}>
            Stock Tracker
          </NavLink>
          <NavLink to="/vendor/dashboard/sales" className={linkClass} onClick={() => setMenuOpen(false)}>
            Sales
          </NavLink>
          <NavLink to="/vendor/dashboard/revenue-chart" className={linkClass} onClick={() => setMenuOpen(false)}>
            Revenue Chart
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
