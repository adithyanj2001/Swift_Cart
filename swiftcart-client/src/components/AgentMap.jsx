import { useEffect } from 'react';
import L from 'leaflet';

export default function AgentMap({ lat = 10.8505, lng = 76.2711 }) {
  useEffect(() => {
    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup('Delivery Location').openPopup();

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return (
    <div
      id="map"
      className="w-full h-[400px] rounded-xl border shadow-md"
    />
  );
}
