// ... (all imports stay the same)
import { useEffect, useState, useRef } from 'react';
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
  FaBars,
} from 'react-icons/fa';
import API from '../../services/api';
import CustomerProductCard from '../../components/CustomerProductCard';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const scrollRef = useRef(null);

  const handleScrolls = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth / 5;
    if (direction === 'left') container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    else container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    API.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down and passed a threshold
      } else {
        setShowNavbar(true); // scrolling up or near top
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-l from-white to-gray-500 flex flex-col">
      {/* Top Nav */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="bg-gradient-to-l from-purple-950 via-fuchsia-500 to-purple-950 shadow px-4 py-6 flex items-center justify-between relative">
          {/* Logout Button */}
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={handleLogout}
              className="text-white text-2xl hover:text transition transform hover:scale-120 duration-300 ease-in-out"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-0">
            <span className="text-2xl sm:text-4xl font-[fantasy] font-extrabold text-white tracking-widest select-none">
              SwiftCart
            </span>
          </div>

          {/* Right Controls / Hamburger */}
          <div className="flex items-center gap-4 text-white z-10">
            {/* Mobile Hamburger */}
            <div className="sm:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white text-2xl hover:text transition transform hover:scale-110 duration-300 ease-in-out "
              >
                <FaBars />
              </button>
            </div>

            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center gap-7">
              {showSearch ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="px-3 py-1 rounded-md border border-gray-300 text-white bg-transparent"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm('');
                    }}
                    className="absolute right-1 top-2 text-black"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="text-white text-xl transition transform hover:text transition transform hover:scale-120 duration-300 ease-in-out"
                  >
                    <FaSearch />
                  </button>

                  <button
                    onClick={() => navigate('/customer/wishlist')}
                    className="text-white text-xl transition transform hover:text transition transform hover:scale-120 duration-300 ease-in-out"
                  >
                    <FaHeart />
                  </button>

                  <button
                    onClick={() => navigate('/customer/cart')}
                    className="text-white text-xl transition transform hover:text transition transform hover:scale-120 duration-300 ease-in-out"
                  >
                    <FaShoppingCart />
                  </button>

                  <button
                    onClick={() => navigate('/customer/orders')}
                    className="text-white text-xl transition transform hover:text transition transform hover:scale-120 duration-300 ease-in-out"
                  >
                    <FaBoxOpen />
                  </button>

                  <button
                    onClick={() => navigate('/customer/profile')}
                    className="text-white text-xl transition transform hover:text transition transform hover:scale-120 duration-300 ease-in-out"
                  >
                    <FaIdBadge />
                  </button>

                  {user ? (
                    <span className="ml-2 font-bold text-white hidden lg:block">
                      Hello, {user.name.split(' ')[0]}
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="text-white text-xl transition transform hover:scale-110 hover:text-red-400"
                    >
                      <FaUser />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>


        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-gray-300 shadow-lg rounded-md z-50 px-4 py-3 flex flex-col gap-3 sm:hidden">
            <button onClick={() => navigate('/customer/wishlist')} className="text-left hover:text-purple-950"><FaHeart className="inline mr-2" /> Wishlist</button>
            <button onClick={() => navigate('/customer/cart')} className="text-left hover:text-purple-950"><FaShoppingCart className="inline mr-2" /> Cart</button>
            <button onClick={() => navigate('/customer/orders')} className="text-left hover:text-purple-950"><FaBoxOpen className="inline mr-2" /> Orders</button>
            <button onClick={() => navigate('/customer/profile')} className="text-left hover:text-purple-950"><FaIdBadge className="inline mr-2" /> Profile</button>
            {user ? (
              <span className="font-semibold text-left">Hello, {user.name.split(' ')[0]}</span>
            ) : (
              <button onClick={() => navigate('/login')} className="text-left"><FaUser className="inline mr-2" /> Login</button>
            )}
          </div>
        )}

        {/* Category Nav */}
        <div className="mt-0.5 bg-gray-200 bg-opacity-95 text-black px-2 py-3 shadow">
          <div className="flex justify-center flex-wrap gap-15 text-sm sm:text-lg font-semibold">
            <Link to="/customer/category/laptops" className="hover:text transition transform hover:scale-110 duration-300 ease-in-out">Laptops</Link>
            <Link to="/customer/category/mobiles" className="hover:text transition transform hover:scale-110 duration-300 ease-in-out">Mobiles</Link>
            <Link to="/customer/category/watches" className="hover:text transition transform hover:scale-110 duration-300 ease-in-out">Watches</Link>
            <Link to="/customer/category/television" className="hover:text transition transform hover:scale-110 duration-300 ease-in-out">Television</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-32 flex-grow w-full max-w-8xl mx-auto px-4 py-6">
        <section>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-8 text-center uppercase tracking-widest drop-shadow-lg bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(270deg,rgb(126, 34, 206),rgb(192, 38, 211),rgb(126, 34, 206))',
              backgroundSize: '200% auto',
              animation: 'gradient-x 5s linear infinite',
            }}
            >
            FEATURED PRODUCTS
          </h1>
        </section>

        <section className="mb-12">
          <Slider {...bannerSettings} className="rounded-lg shadow-lg">
            <div>
              <img
                src="https://i.ytimg.com/vi/N6cFknYffdI/maxresdefault.jpg"
                alt="Banner"
                className="w-full h-64 md:h-96 xl:h-[30rem] 2xl:h-[36rem] object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src="https://i3.ytimg.com/vi/1aqI7EnfbVM/maxresdefault.jpg"
                alt="Banner"
                className="w-full h-64 md:h-96 xl:h-[30rem] 2xl:h-[36rem] object-cover rounded-lg"
              />
            </div>
          </Slider>
        </section>


        {/* Best Deals */}
        <section className="bg-white py-4 px-4 mb-10 relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Best Deals on Smartphones</h2>

          <button onClick={() => handleScrolls('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded w-8 h-12 flex items-center justify-center">‹</button>
          <button onClick={() => handleScrolls('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded w-8 h-12 flex items-center justify-center">›</button>

          <div
            ref={scrollRef}
            className="flex overflow-hidden gap-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {filteredProducts
              .filter(p => p.category?.toLowerCase() === 'mobiles' && p.price <= 20000)
              .sort((a, b) => a.price - b.price)
              .slice(0, 10)
              .map(product => (
                <Link
                  key={product._id}
                  to={`/customer/product/${product._id}`}
                  className="flex flex-col items-center text-center"
                  style={{
                    flex: '0 0 20%',
                  }}
                >
                  <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} className="w-32 h-32 object-contain mb-2" />
                  <span className="text-sm font-medium text-gray-700 truncate">{product.name}</span>
                  <span className="text-sm text-black font-semibold">₹{product.price}</span>
                </Link>
              ))}
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <CustomerProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

export default CustomerHome;