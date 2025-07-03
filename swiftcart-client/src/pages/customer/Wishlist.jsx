import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-toastify'; 

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    API.get('/wishlist')
      .then((res) => setWishlist(res.data))
      .catch(() => toast.error('Failed to load wishlist'));
  };

  const addToCart = async (productId, wishlistId) => {
    try {
      await API.post('/cart', { productId, qty: 1 });
      await API.delete(`/wishlist/${wishlistId}`);
      setWishlist(prev => prev.filter(item => item._id !== wishlistId));
      toast.success('Moved to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error moving to cart');
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await API.delete(`/wishlist/${wishlistId}`);
      setWishlist(prev => prev.filter(item => item._id !== wishlistId));
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-l from-white to-gray-500">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-3 flex flex-col max-w-xs sm:max-w-sm mx-auto w-full"
              >
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-40 sm:h-44 md:h-48 object-contain bg-gray-100 rounded mb-3"
                />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <p className="text-sm sm:text-md font-bold text-green-700">₹{product.price}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => addToCart(product._id, item._id)}
                    className="flex-1 bg-purple-800 text-white py-1.5 rounded hover:bg-purple-700 text-xs sm:text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="bg-red-500 text-white px-3 rounded hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
