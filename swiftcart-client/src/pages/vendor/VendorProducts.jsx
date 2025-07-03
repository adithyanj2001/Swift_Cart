import { useEffect, useState } from 'react';
import API from '../../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  const fetchProducts = () => {
    API.get('/products/my')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editId}`, form);
      alert('Product updated');
      setForm({ name: '', price: '', stock: '', category: '', imageUrl: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      alert('Product deleted');
      fetchProducts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Your Products</h1>

      {/* Blur background when modal is open */}
      <div className={editId ? 'filter blur-sm pointer-events-none select-none' : ''}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-violet-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-700">Category: {product.category}</p>
              <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          ))}
        </div>
      </div>

      {editId && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="w-full p-2 border rounded"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-2 border rounded"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="w-full p-2 border rounded"
                value={form.stock}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="w-full p-2 border rounded"
                value={form.category}
                onChange={handleChange}
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                className="w-full p-2 border rounded"
                value={form.imageUrl}
                onChange={handleChange}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: '', price: '', stock: '', category: '', imageUrl: '' });
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
