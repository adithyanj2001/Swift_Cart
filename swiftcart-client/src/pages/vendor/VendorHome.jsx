import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register chart components
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-2xl p-4 text-center border hover:shadow-lg transition">
    <h3 className="text-base text-gray-600 font-medium">{title}</h3>
    <p className="text-2xl font-extrabold text-red-700 mt-1">{value}</p>
  </div>
);

export default function VendorHome() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    itemsSold: 0,
    totalRevenue: 0,
    deliveredCount: 0,
    monthlyOrderStats: [],
    orderStatusDistribution: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/orders/vendor/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch vendor stats', err);
      }
    };
    fetchStats();
  }, []);

  // Monthly Revenue Bar Chart
  const barData = {
    labels: stats.monthlyOrderStats.map(item => item.month),
    datasets: [{
      label: 'Monthly Revenue (₹)',
      data: stats.monthlyOrderStats.map(item => item.revenue || 0),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderRadius: 6,
    }]
  };

  // Order Status Pie Chart
  const pieData = {
    labels: Object.keys(stats.orderStatusDistribution),
    datasets: [{
      label: 'Order Status',
      data: Object.values(stats.orderStatusDistribution),
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'], // Assigned, Dispatched, In Transit, Delivered
      borderWidth: 1,
    }]
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 md:px-8 pt-4 pb-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-black via-red-700 to-black text-transparent bg-clip-text drop-shadow mb-8"
      >
        Welcome to Vendor Dashboard
      </motion.h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard title="Products" value={stats.productCount} />
        <StatCard title="Orders" value={stats.orderCount} />
        <StatCard title="Items Sold" value={stats.itemsSold} />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} />
        <StatCard title="Delivered" value={stats.deliveredCount} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue (Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-5 shadow-lg rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-red-700">Monthly Revenue</h2>
          {barData.labels.length > 0 ? (
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : (
            <p className="text-sm text-gray-500 text-center">No revenue data available</p>
          )}
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-5 shadow-lg rounded-2xl h-fit">
          <h2 className="text-lg font-semibold mb-4 text-red-700">Order Status Distribution</h2>
          {pieData.labels.length > 0 ? (
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
          ) : (
            <p className="text-sm text-gray-500 text-center">No status data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
