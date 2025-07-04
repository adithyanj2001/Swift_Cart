import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCreditCard,
  FaStore
} from 'react-icons/fa';

const CustomerFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-l from-gray-500 to-gray-700 text-white py-6 px-4 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left: Become a Seller */}
        <div
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 cursor-pointer text-sm hover:text transition transform hover:scale-105 duration-300 ease-in-out"
        >
          <FaStore className="text-yellow-400" />
          <span>Become a Seller</span>
        </div>

        {/* Center: Copyright */}
        <div className="text-sm text-center">&copy; 2025 SwiftCart</div>

        {/* Right: Payment Card Icons */}
        <div className="flex gap-4 text-2xl text-white">
          <FaCcVisa className="hover:text-blue-500" title="Visa" />
          <FaCcMastercard className="hover:text-red-500" title="Mastercard" />
          <FaCcAmex className="hover:text-indigo-400" title="Amex" />
          <FaCcPaypal className="hover:text-blue-400" title="PayPal" />
          <FaCreditCard className="hover:text-gray-400" title="Rupay (Generic)" />
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;