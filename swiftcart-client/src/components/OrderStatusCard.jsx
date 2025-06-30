import React from 'react';

const OrderStatusCard = ({ order }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
      <h3 className="font-semibold mb-2">Order #{order._id}</h3>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Payment:</strong> {order.paymentMethod}</p>
      <p><strong>Total:</strong> ₹{order.total}</p>

      <div className="mt-3">
        <h4 className="font-medium">Items:</h4>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.productId._id}>
              {item.productId.name} × {item.qty}
            </li>
          ))}
        </ul>
      </div>

      {order.deliveryTimeline?.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium">Delivery Timeline:</h4>
          <ul className="list-inside text-sm text-gray-600">
            {order.deliveryTimeline.map((step, idx) => (
              <li key={idx}>• {step.status} ({new Date(step.date).toLocaleString()})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderStatusCard;
