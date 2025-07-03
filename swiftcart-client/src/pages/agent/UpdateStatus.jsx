import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';

const statusOptions = ['Assigned', 'Dispatched', 'In Transit', 'Delivered'];

function UpdateStatus() {
  const [deliveries, setDeliveries] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const fetchData = () => {
    API.get('/delivery')
      .then((res) => setDeliveries(res.data))
      .catch(() => toast.error('Failed to fetch deliveries'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id) => {
    const status = statusMap[id];
    if (!status) return toast.error('Select a status');
    try {
      await API.put(`/delivery/${id}/status`, { status });
      toast.success('Status updated successfully');
      fetchData();
    } catch {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-transparent bg-clip-text">
        UPDATE DELIVERY STATUS
      </h1>

      {deliveries.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded text-center border border-yellow-200 shadow-sm">
          No deliveries assigned.
        </div>
      ) : (
        <div className="overflow-x-auto rounded shadow border border-gray-200">
          <table className="min-w-full text-sm bg-white text-gray-800">
            <thead className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
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
                    <td className="p-3 border text-center font-medium">{d.orderId?._id || 'N/A'}</td>
                    <td className="p-3 border text-center">{d.customer?.name || 'N/A'}</td>
                    <td className="p-3 border text-center">{d.customer?.email || 'N/A'}</td>
                    <td className="p-3 border text-center text-blue-700 font-semibold">{latest}</td>
                    <td className="p-3 border text-center">
                      <select
                        onChange={(e) =>
                          setStatusMap({ ...statusMap, [d._id]: e.target.value })
                        }
                        value={statusMap[d._id] || ''}
                        className="border rounded p-1 text-sm focus:ring-yellow-400 focus:outline-none"
                      >
                        <option value="">Select</option>
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleUpdate(d._id)}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 py-1 rounded shadow"
                      >
                        Update
                      </button>
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
