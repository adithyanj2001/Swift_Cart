import React, { useEffect, useRef, useState } from 'react';
import API from '../../services/api';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loadingPDF, setLoadingPDF] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    API.get('/admin/transactions')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Error fetching transactions:', err));
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const date = new Date(tx.date);
    const yearMatch = selectedYear ? date.getFullYear().toString() === selectedYear : true;
    const monthMatch = selectedMonth
      ? (date.getMonth() + 1).toString().padStart(2, '0') === selectedMonth
      : true;
    return yearMatch && monthMatch;
  });

  const monthlyData = filteredTransactions.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Sales',
        data: Object.values(monthlyData),
        backgroundColor: '#3B82F6', // graph color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Sales Overview' },
    },
  };

  const uniqueYears = [...new Set(transactions.map(tx => new Date(tx.date).getFullYear().toString()))];

  const handleDownloadPDF = async () => {
    try {
      const original = reportRef.current;
      if (!original) return alert('No content found');
  
      const clone = original.cloneNode(true);
  
      // Style override to avoid oklch/Tailwind
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#000';
      clone.querySelectorAll('*').forEach((el) => {
        el.style.backgroundColor = '#fff';
        el.style.color = '#000';
        el.style.boxShadow = 'none';
        el.style.border = '1px solid #ddd';
      });
  
      // Create an off-screen container
      const hiddenContainer = document.createElement('div');
      hiddenContainer.style.position = 'fixed';
      hiddenContainer.style.top = '-10000px';
      hiddenContainer.appendChild(clone);
      document.body.appendChild(hiddenContainer);
  
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Sales_Report_${selectedYear || 'All'}_${selectedMonth || 'All'}.pdf`);
  
      
      document.body.removeChild(hiddenContainer);
    } catch (error) {
      alert('PDF export failed.');
      console.error('PDF Error:', error);
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sales Chart</h1>

      <div className="flex items-center gap-4 flex-wrap mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 p-2 rounded shadow"
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 p-2 rounded shadow"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, '0');
            return <option key={month} value={month}>{month}</option>;
          })}
        </select>

        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loadingPDF}
        >
          {loadingPDF ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div ref={reportRef}>
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <Bar data={chartData} options={chartOptions} />

          <div className="mt-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">All Transactions</h2>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border text-left">Date</th>
                  <th className="p-3 border text-left">Time</th>
                  <th className="p-3 border text-left">Customer</th>
                  <th className="p-3 border text-left">Amount</th>
                  <th className="p-3 border text-left">Payment</th>
                  <th className="p-3 border text-left">Vendor</th>
                  <th className="p-3 border text-left">Agent</th>
                  <th className="p-3 border text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 border">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-3 border">{tx.time}</td>
                      <td className="p-3 border">{tx.customerName}</td>
                      <td className="p-3 border">₹{tx.amount}</td>
                      <td className="p-3 border">{tx.paymentMethod}</td>
                      <td className="p-3 border">{tx.vendorName}</td>
                      <td className="p-3 border">{tx.agentName}</td>
                      <td className="p-3 border">{tx.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-gray-500 p-6">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
