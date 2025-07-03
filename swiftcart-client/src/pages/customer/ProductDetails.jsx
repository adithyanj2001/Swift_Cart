import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [wishlistClicked, setWishlistClicked] = useState(false);

  useEffect(() => {
    API.get(`/products`)
      .then((res) => {
        const found = res.data.find((p) => p._id === id);
        if (found) {
          setProduct(found);
        } else {
          setError('Product not found');
        }
      })
      .catch(() => {
        setError('Failed to fetch product details');
      });
  }, [id]);

  const handleWishlistClick = async () => {
    if (!product?._id) return;
    try {
      await API.post('/wishlist', { productId: product._id });
      setWishlistClicked(true);
      navigate('/customer/wishlist'); // Redirect after adding
    } catch (err) {
      const msg = err.response?.data?.message;
      alert(msg || 'Failed to add to wishlist');
    }
  };

  const handleAddToCart = async () => {
    try {
      await API.post('/cart', { productId: product._id, qty: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await API.post('/cart', { productId: product._id, qty: 1 });
      navigate('/customer/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-white rounded-lg shadow-lg mt-6 relative">
      
      {/* Wishlist Icon */}
      <motion.div
        whileTap={{ scale: 1.2 }}
        onClick={handleWishlistClick}
        className="absolute top-4 right-4 cursor-pointer z-10"
      >
        <FaHeart
          className={`text-2xl transition-colors duration-300 ${
            wishlistClicked ? 'text-red-600' : 'text-gray-400'
          }`}
        />
      </motion.div>

       {/* Left: Product Image */}
        <div className="flex-1">
          <div className="w-full h-[400px] bg-white flex items-center justify-center overflow-hidden rounded-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1 space-y-4 overflow-hidden max-h-[400px]">
          <h1 className="text-3xl font-bold text-gray-900 truncate">{product.name}</h1>
          <p className="text-gray-600 text-lg truncate">Category: {product.category}</p>
          <p className="text-2xl font-semibold text-red-700">₹{product.price}</p>
          <div className="text-gray-700 max-h-[100px] overflow-y-auto pr-1">
            {product.description || 'No description available.'}
          </div>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Buy Now
            </button>
          </div>
        </div>

    </div>
  );
}
