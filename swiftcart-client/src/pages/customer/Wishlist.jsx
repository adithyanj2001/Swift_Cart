import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    API.get('/wishlist')
      .then((res) => setWishlist(res.data))
      .catch(() => alert('Failed to load wishlist'));
  };

  const addToCart = async (productId, wishlistId) => {
    try {
      await API.post('/cart', { productId, qty: 1 });
      await API.delete(`/wishlist/${wishlistId}`);
      setWishlist(prev => prev.filter(item => item._id !== wishlistId));
      alert('Moved to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error moving to cart');
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await API.delete(`/wishlist/${wishlistId}`);
      setWishlist(prev => prev.filter(item => item._id !== wishlistId));
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div key={item._id} className="border rounded-xl shadow-md bg-white hover:shadow-lg transition p-4 flex flex-col">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <p className="text-md font-bold text-green-700">₹{product.price}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => addToCart(product._id, item._id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="bg-red-500 text-white px-3 rounded hover:bg-red-600 text-sm"
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