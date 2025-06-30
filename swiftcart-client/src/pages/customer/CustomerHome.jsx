import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaSignOutAlt,
  FaBoxOpen,
  FaIdBadge,
} from 'react-icons/fa';
import API from '../../services/api';
import ProductCard from '../../components/ProductCard';

// Carousel dependencies
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNavbar, setShowNavbar] = useState(true); // scroll toggle state
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post('/cart', { productId, qty: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Cart error');
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await API.post('/wishlist', { productId });
      alert('Added to wishlist!');
    } catch (err) {
      alert(err.response?.data?.message || 'Wishlist error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // scroll handler
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

  // Banner carousel 
  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true,
  };

  // Filter products 
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Scroll-aware wrapper for navbar */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="bg-gradient-to-r from-red-700 via-black to-red-900 shadow px-6 py-3 flex items-center relative">
          {/* Left: Logout Button */}
          <div className="flex items-center flex-shrink-0 mr-4">
            <button
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="text-white text-2xl hover:text-red-500 transition"
            >
              <FaSignOutAlt />
            </button>
          </div>

          {/* Brand Logo */}
          {!showSearch && (
            <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none select-none">
              <span
                className="text-4xl font-[fantasy] font-extrabold text-white tracking-widest drop-shadow-lg"
                aria-label="SwiftCart Logo"
              >
                SwiftCart
              </span>
            </div>
          )}

          {/*  Search and User Controls */}
          <div className="flex items-center gap-5 ml-auto text-white">
            {showSearch ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-3 py-1 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-red-600"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchTerm('');
                  }}
                  className="absolute right-1 top-1 text-black hover:text-red-600"
                  aria-label="Close Search"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowSearch(true)}
                  aria-label="Open Search"
                  className="text-2xl hover:text-red-400 transition"
                >
                  <FaSearch />
                </button>

                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/customer/wishlist')}
                      aria-label="Wishlist"
                      className="text-2xl hover:text-red-400 transition"
                    >
                      <FaHeart />
                    </button>

                    <button
                      onClick={() => navigate('/customer/cart')}
                      aria-label="Cart"
                      className="text-2xl hover:text-red-400 transition"
                    >
                      <FaShoppingCart />
                    </button>

                    <button
                      onClick={() => navigate('/customer/orders')}
                      aria-label="My Orders"
                      className="text-2xl hover:text-red-400 transition"
                    >
                      <FaBoxOpen />
                    </button>

                    <button
                      onClick={() => navigate('/customer/profile')}
                      aria-label="Profile"
                      className="text-2xl hover:text-red-400 transition"
                    >
                      <FaIdBadge />
                    </button>

                    <span className="hidden sm:block ml-3 font-semibold text-white select-none">
                      Hello, {user.name.split(' ')[0]}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    aria-label="Login"
                    className="text-2xl hover:text-red-400 transition"
                  >
                    <FaUser />
                  </button>
                )}
              </>
            )}
          </div>
        </nav>

        {/* Category Navbar */}
        <div className="bg-black bg-opacity-95 text-white px-6 py-3 shadow">
          <div className="max-w-6xl mx-auto flex justify-center flex-wrap gap-20 text-lg font-semibold">
            <Link to="/customer/category/laptops" className="hover:text-red-500 transition">Laptops</Link>
            <Link to="/customer/category/mobiles" className="hover:text-red-500 transition">Mobiles</Link>
            <Link to="/customer/category/watches" className="hover:text-red-500 transition">Watches</Link>
            <Link to="/customer/category/television" className="hover:text-red-500 transition">Television</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-32 flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Featured Products Heading */}
        <section>
          <h1
            className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest drop-shadow-lg bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(270deg, #b91c1c, #000000, #b91c1c)',
              backgroundSize: '200% auto',
              animation: 'gradient-x 5s linear infinite',
            }}
          >
            FEATURED PRODUCTS
          </h1>
        </section>

        {/* Banner Carousel */}
        <section className="mb-12">
          <Slider {...bannerSettings} className="rounded-lg shadow-lg">
            <div>
              <img
                src="https://i.ytimg.com/vi/N6cFknYffdI/maxresdefault.jpg"
                alt="Promotional Banner 1"
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div>
              <img
                src="https://i3.ytimg.com/vi/1aqI7EnfbVM/maxresdefault.jpg"
                alt="Promotional Banner 2"
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </Slider>
        </section>

        {/* Product Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-600">No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdd={addToCart}
                  onWishlist={addToWishlist}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Gradient */}
      <style>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
}

export default CustomerHome;
