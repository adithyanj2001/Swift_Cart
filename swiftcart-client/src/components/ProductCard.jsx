import React from 'react';
import API from "../services/api";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

function ProductCard({ product }) {
  const navigate = useNavigate();
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x200';

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await API.post('/cart', { productId: product._id, qty: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (!product._id) return  toast.error("Product ID not found");

      await API.post('/wishlist', { productId: product._id });
      toast.success('Added to wishlist!');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Already in wishlist') {
        toast.error('Item already in wishlist.');
      } else if (msg === 'Already in cart') {
        toast.error('Item already in cart.');
      } else {
        toast.error(msg || 'Failed to add to wishlist');
      }
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col"
      onClick={() => navigate(`/product/${product._id}`)}
      title={product.name}
    >
      {/* Image Container */}
      <div className="w-full h-64 flex items-center justify-center overflow-hidden rounded-t-lg bg-white">
        <img
          src={imageUrl}
          alt={product.name || 'Product'}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-auto font-bold text-red-700 text-lg">₹{product.price}</p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-red-700 text-white py-2 rounded hover:bg-red-800 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
