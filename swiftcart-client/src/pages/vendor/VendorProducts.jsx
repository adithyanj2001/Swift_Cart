import { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify'; 

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
      .catch(() => toast.error('Failed to load products'));
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
      toast.success('Product updated');
      setForm({ name: '', price: '', stock: '', category: '', imageUrl: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 text-transparent bg-clip-text drop-shadow">
        Your Products
      </h1>

      {/* Blur background when modal is open */}
      <div className={editId ? 'filter blur-sm pointer-events-none select-none' : ''}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-purple-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="h-40 w-full bg-purple-50 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full object-contain"
                />
              </div>
              <div className="p-4 space-y-2 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-purple-900">{product.name}</h3>
                <p className="text-sm text-purple-700">Category: {product.category}</p>
                <p className="text-md font-semibold text-purple-800">₹{product.price}</p>
                <p className="text-sm text-purple-600">Stock: {product.stock}</p>

                <div className="flex justify-between pt-3 mt-auto">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-purple-800 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
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
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-purple-300">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="w-full p-2 border border-purple-300 rounded"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-2 border border-purple-300 rounded"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="w-full p-2 border border-purple-300 rounded"
                value={form.stock}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="w-full p-2 border border-purple-300 rounded"
                value={form.category}
                onChange={handleChange}
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                className="w-full p-2 border border-purple-300 rounded"
                value={form.imageUrl}
                onChange={handleChange}
              />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: '', price: '', stock: '', category: '', imageUrl: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
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
