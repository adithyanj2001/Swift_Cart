import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const statusOptions = ['Assigned', 'Dispatched', 'In Transit', 'Delivered'];

function UpdateStatus() {
  const [deliveries, setDeliveries] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const fetchData = () => {
    API.get('/delivery')
      .then((res) => setDeliveries(res.data))
      .catch(() => alert('Failed to fetch deliveries'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id) => {
    const status = statusMap[id];
    if (!status) return alert('Select a status');
    try {
      await API.put(`/delivery/${id}/status`, { status });
      alert('✅ Status updated successfully');
      fetchData();
    } catch {
      alert('❌ Status update failed');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-black to-red-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">🔄 Update Delivery Status</h1>
      {deliveries.length === 0 ? (
        <div className="bg-red-100 text-red-800 p-4 rounded text-center">🚫 No deliveries assigned.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm bg-white text-gray-800 rounded shadow-lg">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Customer Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Current Status</th>
                <th className="p-3 border">New Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => {
                const latest = d.statusUpdates[d.statusUpdates.length - 1]?.status || 'N/A';
                return (
                  <tr key={d._id} className="hover:bg-gray-100 transition">
                    <td className="p-3 border text-center">{d.orderId?._id || 'N/A'}</td>
                    <td className="p-3 border text-center">{d.customer?.name || 'N/A'}</td>
                    <td className="p-3 border text-center">{d.customer?.email || 'N/A'}</td>
                    <td className="p-3 border text-center text-blue-700 font-semibold">{latest}</td>
                    <td className="p-3 border text-center">
                      <select onChange={(e) => setStatusMap({ ...statusMap, [d._id]: e.target.value })} value={statusMap[d._id] || ''} className="border rounded p-1 text-sm">
                        <option value="">Select</option>
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 border text-center">
                      <button onClick={() => handleUpdate(d._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Update</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UpdateStatus;
