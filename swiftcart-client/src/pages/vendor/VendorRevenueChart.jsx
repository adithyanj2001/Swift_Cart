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

export default function VendorRevenueChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [],
        backgroundColor: 'rgba(107, 33, 168, 0.7)',
        borderColor: 'rgba(107, 33, 168, 1)',
        borderWidth: 1,
        fill: true,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('All');

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (month !== 'All') params.month = month;

        const res = await API.get('/orders/vendor/sales-summary', { params });
        const labels = res.data.map((item) => item.productName);
        const revenue = res.data.map((item) => item.revenue);

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
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Revenue (₹)',
              data: [],
              backgroundColor: 'rgba(107, 33, 168, 0.7)',
              borderColor: 'rgba(107, 33, 168, 1)',
              borderWidth: 1,
              fill: true,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [month]);

  return (
    <div className="h-screen w-full px-2 py-4 flex justify-center items-start overflow-auto">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-transparent bg-clip-text drop-shadow">
          Revenue Chart
        </h1>

        {/* Month Filter */}
        <div className="mb-4 flex justify-center">
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
        </div>

        {/* Chart Display */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500">Loading chart...</p>
          ) : (
            <div className="h-[400px] w-full">
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
                        size: 16,
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
                      beginAtZero: true,
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
