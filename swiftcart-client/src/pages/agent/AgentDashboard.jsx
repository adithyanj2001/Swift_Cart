import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { FaBox, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';

const statusColors = {
  Assigned: 'bg-yellow-100 text-yellow-800',
  Dispatched: 'bg-yellow-200 text-yellow-900',
  'In Transit': 'bg-yellow-300 text-yellow-900',
  Delivered: 'bg-green-200 text-green-800',
};

export default function AgentDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deliveryRes, userRes] = await Promise.all([
          API.get('/delivery'),
          API.get('/auth/me'),
        ]);
        setDeliveries(deliveryRes.data);
        setFiltered(deliveryRes.data);
        setAgent(userRes.data);
      } catch (err) {
        alert('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = deliveries;
    if (filterStatus) {
      data = data.filter(
        (d) =>
          d.statusUpdates[d.statusUpdates.length - 1]?.status === filterStatus
      );
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.orderId?._id?.toLowerCase().includes(s) ||
          d.customer?.name?.toLowerCase().includes(s) ||
          d.customer?.email?.toLowerCase().includes(s)
      );
    }
    setFiltered(data);
  }, [search, filterStatus, deliveries]);

  const countByStatus = (status) =>
    deliveries.filter(
      (d) => d.statusUpdates[d.statusUpdates.length - 1]?.status === status
    ).length;

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-transparent bg-clip-text">
        AGENT DASHBOARD
      </h1>

      {agent && (
        <div className="mb-6 p-4 rounded border border-yellow-200 bg-yellow-50 shadow">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <FaUser className="text-yellow-700" /> {agent.name} ({agent.email})
          </h2>
          <p className="text-sm text-yellow-800">
             
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-yellow-100 text-gray-900 p-5 rounded shadow flex items-center gap-4">
          <FaBox className="text-3xl text-yellow-600" />
          <div>
            <p className="text-2xl font-bold">{deliveries.length}</p>
            <p className="text-sm">Total Deliveries</p>
          </div>
        </div>
        <div className="bg-white border border-yellow-100 text-gray-900 p-5 rounded shadow flex items-center gap-4">
          <FaClock className="text-3xl text-yellow-600" />
          <div>
            <p className="text-2xl font-bold">
              {countByStatus('Assigned') + countByStatus('Dispatched') + countByStatus('In Transit')}
            </p>
            <p className="text-sm">Pending Deliveries</p>
          </div>
        </div>
        <div className="bg-white border border-yellow-100 text-gray-900 p-5 rounded shadow flex items-center gap-4">
          <FaCheckCircle className="text-3xl text-green-600" />
          <div>
            <p className="text-2xl font-bold">{countByStatus('Delivered')}</p>
            <p className="text-sm">Delivered</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID / Name / Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded w-full md:w-1/2 bg-white text-gray-800 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 rounded bg-white text-gray-800 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="Dispatched">Dispatched</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Delivery List */}
      <div className="space-y-4">
        {filtered.map((d) => {
          const latest = d.statusUpdates[d.statusUpdates.length - 1];
          return (
            <div
              key={d._id}
              className="bg-white border border-gray-200 text-gray-900 p-4 rounded shadow hover:shadow-md transition"
            >
              <p className="text-lg font-semibold mb-1">
                Order ID:{' '}
                <span className="text-yellow-700 font-bold">
                  {d.orderId?._id || 'N/A'}
                </span>
              </p>
              <p className="text-sm mb-1">
                Customer: {d.customer?.name || 'N/A'} ({d.customer?.email || 'N/A'})
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${statusColors[latest?.status] || 'bg-gray-100 text-gray-800'}`}
              >
                {latest?.status || 'Unknown'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
