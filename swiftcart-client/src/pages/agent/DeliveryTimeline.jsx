import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function DeliveryTimeline() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    API.get('/delivery')
      .then((res) => setDeliveries(res.data))
      .catch(() => alert('Failed to load delivery timeline'));
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">📍 Delivery Timeline</h1>
      {deliveries.length === 0 ? (
        <div className="bg-red-100 text-red-800 p-4 rounded text-center">🕒 No deliveries to display.</div>
      ) : (
        <div className="space-y-6">
          {deliveries.map((delivery) => (
            <div key={delivery._id} className="bg-white text-gray-900 rounded shadow-md p-5">
              <h2 className="text-xl font-bold text-red-700 mb-2">🧾 Order ID: {delivery.orderId?._id || 'N/A'}</h2>
              <p className="text-sm mb-1">👤 Customer: <span className="font-medium">{delivery.customer?.name || 'N/A'}</span></p>
              <p className="text-sm mb-4 text-gray-600">✉️ Email: {delivery.customer?.email || 'N/A'}</p>
              <ul className="border-l-2 border-red-600 pl-4">
                {delivery.statusUpdates.map((update, idx) => (
                  <li key={idx} className="mb-3 relative">
                    <span className="absolute w-3 h-3 bg-red-600 rounded-full -left-2 top-1" />
                    <div className="ml-2">
                      <p className="font-semibold text-gray-800">{getStatusIcon(update.status)} {update.status}</p>
                      <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeliveryTimeline;