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
      case 'Assigned': return ;
      case 'Dispatched': return ;
      case 'In Transit': return ;
      case 'Delivered': return ;
      default: return ;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-gray-900">
      <h1 className="text-3xl font-extrabold text-yellow-600 mb-8">DELIVERY TIMELINE</h1>

      {deliveries.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded text-center shadow">
          No deliveries to display.
        </div>
      ) : (
        <div className="space-y-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white border border-gray-200 text-gray-900 rounded-lg shadow p-5"
            >
              <h2 className="text-xl font-bold text-yellow-700 mb-2">
                🧾 Order ID: {delivery.orderId?._id || 'N/A'}
              </h2>
              <p className="text-sm mb-1">
                👤 Customer: <span className="font-medium">{delivery.customer?.name || 'N/A'}</span>
              </p>
              <p className="text-sm mb-4 text-gray-600">
                ✉️ Email: {delivery.customer?.email || 'N/A'}
              </p>

              <ul className="relative border-l-4 border-yellow-600 pl-6 ml-1 space-y-4">
                {delivery.statusUpdates.map((update, idx) => (
                  <li key={idx} className="relative pl-6">
                    {/* Yellow Dot */}
                    <span className="absolute left-0 top-2.5 w-3 h-3 bg-yellow-600 rounded-full border-2 border-white shadow" />

                    {/* Status Text */}
                    <div className="text-gray-800">
                      <p className="font-semibold">
                        {getStatusIcon(update.status)} {update.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
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
