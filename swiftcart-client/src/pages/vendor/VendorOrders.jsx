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
    <div className="min-h-screen  px-6 py-10">
      {/* Page Heading */}
      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-transparent bg-clip-text">
        Vendor Orders
      </h1>

      {/* Content */}
      {loading ? (
        <div className="text-gray-500 text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-center">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="text-left bg-purple-200 text-purple-900 font-semibold text-sm">
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
                  className={index % 2 === 0 ? 'bg-purple-50' : 'bg-purple-100/60'}
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="font-medium">{order.userId?.name || 'Unknown User'}</div>
                    <div className="text-xs text-gray-500">{order.userId?.email || 'No email'}</div>
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-800">
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      {order.items.map((item) => (
                        <li key={item.productId?._id}>
                          {item.productId?.name || 'Unknown Product'} × {item.qty}
                        </li>
                      ))}
                    </ul>

                    {order.deliveryAgent ? (
                      <div className="text-xs text-green-600">
                        Agent: {order.deliveryAgent.name} ({order.deliveryAgent.email})
                      </div>
                    ) : (
                      <div className="text-xs text-yellow-600">Agent not assigned</div>
                    )}

                    {order.deliveryTimeline?.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-600 border-l-2 border-purple-400 pl-3 space-y-1">
                        {order.deliveryTimeline.map((status, i) => (
                          <li key={i}>
                            {status.status} – {new Date(status.timestamp).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right text-green-700 font-semibold text-sm">
                    ₹{order.total?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
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
