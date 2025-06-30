import { useEffect, useState } from 'react';
import API from '../../services/api';

function StockTracker() {
  const [products, setProducts] = useState([]);
  const [previousStock, setPreviousStock] = useState({}); // store previous stock per product

  const fetchStockData = () => {
    API.get('/products/my')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to fetch stock data'));
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleMarkEmpty = async (product) => {
    if (!window.confirm("Mark this product as empty?")) return;

    try {
      // Store current stock
      setPreviousStock((prev) => ({ ...prev, [product._id]: product.stock }));

      await API.put(`/products/${product._id}`, { stock: 0 });
      alert("Marked as empty");
      fetchStockData();
    } catch {
      alert("Failed to update stock.");
    }
  };

  const handleRestoreStock = async (productId) => {
    const oldStock = previousStock[productId];
    if (oldStock === undefined) {
      alert("No previous stock data available.");
      return;
    }

    try {
      await API.put(`/products/${productId}`, { stock: oldStock });
      alert("Stock restored");
      fetchStockData();
    } catch {
      alert("Failed to restore stock.");
    }
  };

  const lowStockThreshold = 5;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Tracker</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Price (₹)</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLowStock = product.stock <= lowStockThreshold;
              const isEmpty = product.stock === 0;

              return (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 text-right">₹{product.price}</td>
                  <td className="p-3 text-right">{product.stock}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        isEmpty ? 'bg-gray-500' : isLowStock ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      {isEmpty ? 'Empty' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {isEmpty && previousStock[product._id] !== undefined ? (
                      <button
                        onClick={() => handleRestoreStock(product._id)}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Restore Stock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkEmpty(product)}
                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
