import { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';

export default function VendorAddProduct() {
  const [imageFile, setImageFile] = useState(null);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    imageUrl: '',
  });
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('stock', product.stock);
      formData.append('description', product.description);
      formData.append('category', product.category);
      if (imageFile) formData.append('image', imageFile);

      const res = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Product added:', res.data);
      setMessage('Product added successfully!');
      setProduct({
        name: '',
        price: '',
        stock: '',
        description: '',
        category: ''
      });
      setImageFile(null);
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage('Failed to add product.');
    }
  };

  return (
    <div className="w-full  px-4 py-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-white text-black rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-transparent bg-clip-text drop-shadow">
          Add New Product
        </h2>

        {message && (
          <p className="text-center mb-4 font-semibold text-red-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
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
            <label className="block font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Add Product
          </button>
        </form>
      </motion.div>
    </div>
  );
}
