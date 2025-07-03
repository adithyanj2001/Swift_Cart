import { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify'; 

function StockTracker() {
  const [products, setProducts] = useState([]);
  const [previousStock, setPreviousStock] = useState({});

  const fetchStockData = () => {
    API.get('/products/my')
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to fetch stock data'));
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleMarkEmpty = async (product) => {
    if (!window.confirm("Mark this product as empty?")) return;

    try {
      setPreviousStock((prev) => ({ ...prev, [product._id]: product.stock }));
      await API.put(`/products/${product._id}`, { stock: 0 });
      toast.success("Marked as empty");
      fetchStockData();
    } catch {
      toast.error("Failed to update stock.");
    }
  };

  const handleRestoreStock = async (productId) => {
    const oldStock = previousStock[productId];
    if (oldStock === undefined) {
      toast.error("No previous stock data available.");
      return;
    }

    try {
      await API.put(`/products/${productId}`, { stock: oldStock });
      toast.success("Stock restored");
      fetchStockData();
    } catch {
      toast.error("Failed to restore stock.");
    }
  };

  const lowStockThreshold = 5;

  return (
    <div className="min-h-screen w-full  p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-transparent bg-clip-text">
        Stock Tracker
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-purple-200 text-purple-900 font-semibold">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Price (₹)</th>
              <th className="p-4 text-right">Stock</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => {
              const isLowStock = product.stock <= lowStockThreshold;
              const isEmpty = product.stock === 0;

              return (
                <tr
                  key={product._id}
                  className={idx % 2 === 0 ? 'bg-purple-50' : 'bg-purple-100/60'}
                >
                  <td className="p-4 text-gray-800">{product.name}</td>
                  <td className="p-4 text-gray-700">{product.category}</td>
                  <td className="p-4 text-right text-gray-700">₹{product.price}</td>
                  <td className="p-4 text-right text-gray-700">{product.stock}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                        isEmpty
                          ? 'bg-gray-500'
                          : isLowStock
                          ? 'bg-red-500'
                          : 'bg-green-600'
                      }`}
                    >
                      {isEmpty ? 'Empty' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {isEmpty && previousStock[product._id] !== undefined ? (
                      <button
                        onClick={() => handleRestoreStock(product._id)}
                        className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded transition"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkEmpty(product)}
                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                      >
                        Mark Empty
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockTracker;
