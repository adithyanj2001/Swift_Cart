import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaSignOutAlt,
  FaClipboardList,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

function CustomerLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Scroll behavior
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setShowNavbar(true); // scrolling up
      } else {
        setShowNavbar(false); // scrolling down
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scroll-sensitive wrapper */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav
          className="px-6 py-4 flex items-center justify-between flex-wrap gap-y-2"
          style={{
            background: 'linear-gradient(90deg, #ff0000, #000000)',
          }}
        >
          {/* Left: Home , Orders */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-1 text-white font-bold text-xl hover:text-gray-300"
              aria-label="Home"
            >
              <FaHome />
              Home
            </Link>
            <Link
              to="/customer/orders"
              className="flex items-center gap-1 text-white font-bold text-xl hover:text-gray-300"
              aria-label="Orders"
            >
              <FaClipboardList />
              Orders
            </Link>
          </div>

          {/* Center: Categories */}
          <div className="flex items-center gap-12 text-white font-semibold text-lg">
            <Link to="/customer/category/laptops" className="hover:text-red-300 transition">Laptops</Link>
            <Link to="/customer/category/mobiles" className="hover:text-red-300 transition">Mobiles</Link>
            <Link to="/customer/category/watches" className="hover:text-red-300 transition">Watches</Link>
            <Link to="/customer/category/television" className="hover:text-red-300 transition">Television</Link>
          </div>

          {/* Right: User Info , Actions */}
          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-white font-medium">
              Hello, {user?.name?.split(' ')[0] || 'User'}
            </span>

            <Link to="/customer/profile" className="text-white hover:text-gray-300" title="Profile">
              <FaUser size={20} />
            </Link>

            <Link to="/customer/wishlist" className="text-white hover:text-gray-300" title="Wishlist">
              <FaHeart size={20} />
            </Link>

            <Link to="/customer/cart" className="text-white hover:text-gray-300" title="Cart">
              <FaShoppingCart size={20} />
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="text-white hover:text-red-600"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Push down content to avodi overlaps */}
      <main className="flex-grow p-6 bg-gray-50 mt-28">
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
