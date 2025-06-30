import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-gray-700 text-lg mb-6">Your order has been placed successfully.</p>
      <Link
        to="/customer/orders"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default PaymentSuccess;
