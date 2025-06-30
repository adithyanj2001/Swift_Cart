import { useEffect, useState } from 'react';
import API from '../../services/api';

function AssignedOrders() {
  const [deliveries, setDeliveries] = useState([]);

  const fetchDeliveries = () => {
    API.get('/delivery')
      .then((res) => setDeliveries(res.data))
      .catch(() => alert('Failed to load deliveries'));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/delivery/${id}/status`, { status });
      alert(`Status updated to ${status}`);
      fetchDeliveries();
    } catch {
      alert('Update failed');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Assigned': return '📦';
      case 'Dispatched': return '🚚';
      case 'In Transit': return '🛣️';
      case 'Delivered': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-black to-red-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🚚 Assigned Orders</h1>

      {deliveries.length === 0 ? (
        <div className="bg-red-100 text-red-800 p-4 rounded text-center">
          ❗ No deliveries assigned currently.
        </div>
      ) : (
        <div className="space-y-6">
          {deliveries.map((d) => {
            const orderId = d?.orderId?._id;
            return (
              <div key={d._id} className="bg-white text-gray-800 p-5 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">
                  🧾 Order ID: <span className="text-red-700">{orderId || 'N/A'}</span>
                </h2>
                <p className="mb-2 font-medium">
                  📍 Customer: {d.customer?.name || 'N/A'}
                </p>
                <div className="mb-2">
                  <p className="font-semibold">📜 Status Timeline:</p>
                  <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
                    {d.statusUpdates.map((s, i) => (
                      <li key={i}>
                        <span className="mr-1">{getStatusIcon(s.status)}</span>
                        <span className="font-medium">{s.status}</span> — {new Date(s.timestamp).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(d._id, 'Dispatched')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    🚚 Mark Dispatched
                  </button>
                  <button
                    onClick={() => updateStatus(d._id, 'Delivered')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    ✅ Mark Delivered
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssignedOrders;
