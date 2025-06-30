import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/vendor');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch vendor orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">📦 Vendor Orders</h1>

      {loading ? (
        <div className="text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400">No orders found.</div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-gradient-to-r from-black to-red-900 rounded-lg">
            <thead>
              <tr className="text-left text-red-200 border-b border-red-800">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Products & Delivery</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={index % 2 === 0 ? 'bg-black/60' : 'bg-black/40'}
                >
                  <td className="py-3 px-4">
                    <div>{order.userId?.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-400">
                      {order.userId?.email || 'No email'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <ul className="list-disc pl-4 mb-2">
                      {order.items.map((item) => (
                        <li key={item.productId?._id}>
                          {item.productId?.name || 'Unknown Product'} × {item.qty}
                        </li>
                      ))}
                    </ul>

                    {/* Delivery Agent Info */}
                    {order.deliveryAgent ? (
                      <div className="text-sm text-green-400">
                        Agent: {order.deliveryAgent.name} ({order.deliveryAgent.email})
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-400">Agent not assigned</div>
                    )}

                    {/* Delivery Timeline */}
                    {order.deliveryTimeline?.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-300 space-y-1 pl-2 border-l border-red-500">
                        {order.deliveryTimeline.map((status, i) => (
                          <li key={i}>
                             {status.status} –{' '}
                            {new Date(status.timestamp).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right font-semibold text-green-400">
                    ₹{order.total?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
