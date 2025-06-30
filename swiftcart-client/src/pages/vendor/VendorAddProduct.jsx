import { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';

export default function VendorAddProduct() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    imageUrl: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      };

      const res = await API.post('/products', payload);
      console.log('Product added:', res.data);
      setMessage('Product added successfully!');
      setProduct({
        name: '',
        price: '',
        stock: '',
        description: '',
        category: '',
        imageUrl: '',
      });
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage('Failed to add product.');
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black to-red-900 text-white overflow-auto px-4 py-8 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-white text-black rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-black to-red-600 text-transparent bg-clip-text">
          Add New Product
        </h2>

        {message && (
          <p className="text-center mb-4 font-semibold text-red-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            >
              <option value="">Select category</option>
              <option value="laptops">Laptops</option>
              <option value="mobiles">Mobiles</option>
              <option value="watches">Watches</option>
              <option value="television">Television</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-black to-red-700 text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Add Product 
          </button>
        </form>
      </motion.div>
    </div>
  );
}
