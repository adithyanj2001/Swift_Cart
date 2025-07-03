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
        

        const filtered = res.data;

        const labels = filtered.map((item) => item.productName);
        const revenue = filtered.map((item) => item.revenue);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Revenue (₹)',
              data: revenue,
              backgroundColor: 'rgba(107, 33, 168, 0.7)',
              borderColor: 'rgba(107, 33, 168, 1)',
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
    <div className="min-h-screen w-full  px-1 md:px-5 py-6 flex justify-center items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-transparent bg-clip-text drop-shadow">
          Revenue Chart
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-6 justify-center">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Month</label>
            <select
              className="px-4 py-2 rounded-md bg-white border border-purple-400 text-black shadow-sm"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              className="px-4 py-2 rounded-md bg-white border border-purple-400 text-black shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500">Loading chart...</p>
          ) : !chartData || chartData.labels.length === 0 ? (
            <p className="text-center text-gray-500">No revenue data available for the selected filter.</p>
          ) : (
            <div className="h-[500px] w-full">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
                        size: 18,
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
      </div>
    </div>
  );
}
