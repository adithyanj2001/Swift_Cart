import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';

export default function VendorSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await API.get('/orders/vendor/sales-summary');
        setSales(res.data);
      } catch (err) {
        alert('Failed to fetch sales summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-red-600 to-black text-transparent bg-clip-text"
      >
        Sales Summary
      </motion.h1>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading sales data...</div>
        ) : sales.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No sales recorded yet.</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-red-100 text-gray-900">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6 text-right">Units Sold</th>
                <th className="py-4 px-6 text-right">Total Revenue (₹)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((item, index) => (
                <tr
                  key={item.productId}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-3 px-6">{item.productName}</td>
                  <td className="py-3 px-6 text-right">{item.unitsSold}</td>
                  <td className="py-3 px-6 text-right font-semibold text-green-600">
                    ₹{item.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-red-200 font-bold text-red-800">
                <td className="py-4 px-6">Total</td>
                <td className="py-4 px-6 text-right">
                  {sales.reduce((acc, curr) => acc + curr.unitsSold, 0)}
                </td>
                <td className="py-4 px-6 text-right">
                  ₹{sales.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
