import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaSignOutAlt,
  FaBoxOpen,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import CustomerFooter from '../../pages/customer/CustomerFooter';

function CustomerLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-l from-white to-fuchsia-30 flex flex-col">
      {/* Sticky Navbar */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="relative bg-gradient-to-l from-purple-950 via-fuchsia-500 to-purple-950 shadow px-4 py-5 flex items-center justify-between">
          {/* Left: Home */}
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Link
              to="/"
              className="flex items-center gap-2 hover:text transition transform hover:scale-120 duration-300 ease-in-out transition"
            >
              <FaHome />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          {/* Center: Categories (always centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-white font-semibold text-sm sm:text-base md:text-lg">
            <Link to="/customer/category/laptops" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out">Laptops</Link>
            <Link to="/customer/category/mobiles" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out">Mobiles</Link>
            <Link to="/customer/category/watches" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out">Watches</Link>
            <Link to="/customer/category/television" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out">Television</Link>
          </div>

          {/* Right: Icons or Hamburger */}
          <div className="flex items-center gap-4 text-white">
            {/* Desktop icons */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="font-bold hidden xl:block">
                Hello, {user?.name?.split(' ')[0] || 'User'}
              </div>
              <Link to="/customer/profile" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out" title="Profile"><FaUser size={20} /></Link>
              <Link to="/customer/wishlist" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out" title="Wishlist"><FaHeart size={20} /></Link>
              <Link to="/customer/cart" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out" title="Cart"><FaShoppingCart size={20} /></Link>
              <Link to="/customer/orders" className="hover:text transition transform hover:scale-120 duration-300 ease-in-out" title="Orders"><FaBoxOpen size={20} /></Link>
              <button onClick={handleLogout} className="hover:text transition transform hover:scale-120 duration-300 ease-in-out" title="Logout"><FaSignOutAlt size={20} /></button>
            </div>

            {/* Hamburger menu for sm/md */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white"
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Slide-Out Menu */}
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-4 z-50 lg:hidden">
              <div className="font-bold mb-2">
                Hello, {user?.name?.split(' ')[0] || 'User'}
              </div>
              <Link to="/customer/profile" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-red-500">Profile</Link>
              <Link to="/customer/wishlist" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-red-500">Wishlist</Link>
              <Link to="/customer/cart" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-red-500">Cart</Link>
              <Link to="/customer/orders" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-red-500">Orders</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block text-left w-full py-2 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-grow p-4 sm:p-6 mt-28">
        <Outlet />
      </main>
      <div>
        <CustomerFooter />
      </div>
    </div>
  );
}

export default CustomerLayout;
