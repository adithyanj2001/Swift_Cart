import { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';

function AssignedOrders() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await API.get('/delivery');
      setDeliveries(res.data);
    } catch (err) {
      toast.error(' Failed to load deliveries');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/delivery/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchDeliveries();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Assigned':
        return ;
      case 'Dispatched':
        return ;
      case 'In Transit':
        return ;
      case 'Delivered':
        return ;
      default:
        return ;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-gray-900">
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-transparent bg-clip-text">
        ASSIGNED ORDERS
      </h1>

      {deliveries.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded text-center border border-yellow-200 shadow-sm">
          No deliveries assigned currently.
        </div>
      ) : (
        <div className="space-y-6">
          {deliveries.map((d) => {
            const orderId = d?.orderId?._id;
            const shipping = d?.shippingInfo || {};
            const customerName = d?.customer?.name || 'N/A';
            const fullAddress = `${shipping.address || ''}, ${shipping.pin || ''}, ${shipping.state || ''}`;
            const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

            return (
              <div
                key={d._id}
                className="bg-white text-gray-800 p-5 rounded shadow border border-gray-200 hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold mb-2">
                  🧾 Order ID:{' '}
                  <span className="text-yellow-700 font-bold">{orderId || 'N/A'}</span>
                </h2>

                <p className="mb-1 font-medium">📍 Customer: {customerName}</p>
                <p className="mb-2 text-sm">📦 Address: {fullAddress}</p>

                {/* Google Map Embed */}
                <div className="mb-3">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded"
                    title={`Map for ${orderId}`}
                  />
                </div>

                {/* Status Timeline */}
                <div className="mb-2">
                  <p className="font-semibold">📜 Status Timeline:</p>
                  <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
                    {d.statusUpdates.map((s, i) => (
                      <li key={i}>
                        <span className="mr-1">{getStatusIcon(s.status)}</span>
                        <span className="font-medium">{s.status}</span> —{' '}
                        {new Date(s.timestamp).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(d._id, 'Dispatched')}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded shadow-sm font-semibold"
                  >
                    Mark Dispatched
                  </button>
                  <button
                    onClick={() => updateStatus(d._id, 'Delivered')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded shadow-sm font-semibold"
                  >
                    Mark Delivered
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
