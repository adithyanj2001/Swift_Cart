import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function DeliveryCardWithMap({ delivery, onUpdateStatus }) {
  const orderId = delivery?.orderId?._id;
  const mapId = `map-${delivery._id}`;
  const lat = delivery?.shippingInfo?.latitude || 10.8505;
  const lng = delivery?.shippingInfo?.longitude || 76.2711;

  useEffect(() => {
    const map = L.map(mapId).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup('Delivery Location').openPopup();

    return () => {
      map.remove(); // Clean up map instance
    };
  }, [mapId, lat, lng]);

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
    <div className="bg-white text-gray-800 p-5 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        🧾 Order ID: <span className="text-red-700">{orderId || 'N/A'}</span>
      </h2>
      <p className="mb-2 font-medium">📍 Customer: {delivery.customer?.name || 'N/A'}</p>

      <div id={mapId} className="w-full h-64 mb-4 rounded shadow border" />

      <div className="mb-2">
        <p className="font-semibold">📜 Status Timeline:</p>
        <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
          {delivery.statusUpdates.map((s, i) => (
            <li key={i}>
              <span className="mr-1">{getStatusIcon(s.status)}</span>
              <span className="font-medium">{s.status}</span> — {new Date(s.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => onUpdateStatus(delivery._id, 'Dispatched')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Mark Dispatched
        </button>
        <button
          onClick={() => onUpdateStatus(delivery._id, 'Delivered')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Mark Delivered
        </button>
      </div>
    </div>
  );
}
