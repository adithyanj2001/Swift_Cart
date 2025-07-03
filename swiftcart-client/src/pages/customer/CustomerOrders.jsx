import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify'; 

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    API.get('/orders/my')
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (search.trim()) {
      filtered = filtered.filter(order =>
        order.items.some(item =>
          item.productId?.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (fromDate) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt) <= new Date(toDate)
      );
    }

    setFilteredOrders(filtered);
  }, [search, fromDate, toDate, orders]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token'); // token 
      const response = await fetch(`http://localhost:5050/api/orders/invoice/${orderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || 'Error downloading invoice');
    }
  };

  if (loading) return <div className="p-6">Loading your orders...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders match your criteria.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold mb-2">Order ID: {order._id}</h3>

              {/* Status color */}
              <p className="text-sm text-gray-600 mb-2">
                Status:{' '}
                {order.deliveryTimeline?.some(update => update.status === 'Delivered') ? (
                  <span className="font-bold text-green-600">Delivered</span>
                ) : (
                  <span className="font-bold text-blue-600">Ordered</span>
                )}
                {' '}| Payment: {order.paymentMethod}
              </p>

              <p className="text-sm text-gray-600 mb-2">Total: ₹{order.total}</p>
              <p className="text-sm text-gray-500 mb-2">Placed on: {new Date(order.createdAt).toLocaleString()}</p>

              {/* Product List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border p-2 rounded">
                    <img
                      src={item.productId?.imageUrl}
                      alt={item.productId?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-sm">{item.productId?.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => handleDownloadInvoice(order._id)}
                  className="bg-purple-900 text-white px-4 py-1 rounded hover:bg-purple-700"
                >
                  Download Invoice
                </button>

                <button
                  onClick={() =>
                    setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                  }
                  className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-500"
                >
                  {expandedOrderId === order._id ? 'Hide Delivery Status' : 'View Delivery Status'}
                </button>
              </div>

              {/* Delivery Timeline */}
              {expandedOrderId === order._id && (
                <div className="mt-4 p-3 bg-gray-50 border rounded">
                  {order.deliveryAgent ? (
                    <>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Agent:</strong> {order.deliveryAgent.name}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Phone:</strong> {order.deliveryAgent.phone}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No delivery agent assigned yet.</p>
                  )}

                  {order.deliveryTimeline?.length > 0 ? (
                    <ul className="list-disc pl-4 text-sm text-gray-600">
                      {order.deliveryTimeline.map((step, idx) => (
                        <li key={idx}>
                          {step.status} - {new Date(step.timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No delivery updates yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
