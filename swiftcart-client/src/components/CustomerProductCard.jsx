
import React from 'react';

function CustomerProductCard({ product }) {
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x200';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 cursor-pointer">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-40 object-contain rounded-xl mb-3 bg-gray-100"
      />
      <h3 className="text-base font-semibold text-gray-800 truncate">{product.name}</h3>
      <p className="text-black font-bold text-sm mt-1">₹{product.price}</p>
    </div>
  );
}

export default CustomerProductCard;
