import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import API from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const months = [
  'All',
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categories = ['All', 'Laptops', 'Mobiles', 'Watches', 'Televisions'];

export default function VendorRevenueChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('All');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (month !== 'All') params.month = month;
        if (category !== 'All') params.category = category;

        const res = await API.get('/orders/vendor/sales-summary', { params });

        const filtered = res.data.filter((item) => {
          return category === 'All' || item.category === category;
        });

        const labels = filtered.map((item) => item.productName);
        const revenue = filtered.map((item) => item.revenue);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Revenue (₹)',
              data: revenue,
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: 'rgba(239, 68, 68, 1)',
              borderWidth: 1,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error('Failed to fetch revenue data:', err);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [month, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-red-900 p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-black animate-pulse">
        Revenue Chart
      </h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-semibold mb-1">Month</label>
          <select
            className="p-2 rounded bg-black text-white border border-red-500"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select
            className="p-2 rounded bg-black text-white border border-red-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading chart...</p>
      ) : !chartData || chartData.labels.length === 0 ? (
        <p className="text-gray-400">No revenue data available.</p>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#000',
                    font: { weight: 'bold' },
                  },
                },
                title: {
                  display: true,
                  text: 'Revenue per Product',
                  color: '#111',
                  font: {
                    size: 20,
                    weight: 'bold',
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: '#000' },
                  grid: { color: '#eee' },
                },
                y: {
                  ticks: { color: '#000' },
                  grid: { color: '#eee' },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
