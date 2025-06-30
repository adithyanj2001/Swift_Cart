import { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    region: '',         // agent-specific
    address: '',        // vendor-specific
    place: '',          // vendor-specific
    category: ''        // vendor-specific
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      alert('Registered successfully. Now login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const isVendor = form.role === 'vendor';
  const isAgent = form.role === 'agent';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 via-red-900 to-black">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-red-700 mb-6">
          Join Swift Cart
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create your account and start shopping smarter!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Registering as</label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          {/* Vendor-Specific Fields */}
          {isVendor && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <select
                  name="category"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">-- Select a category --</option>
                  <option value="laptops">Laptops</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="watches">Watches</option>
                  <option value="television">Television</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Place</label>
                <input
                  type="text"
                  name="place"
                  placeholder="Business location"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Full address"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </>
          )}

          {/* Agent-Specific Fields */}
          {isAgent && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">Region</label>
              <input
                type="text"
                name="region"
                placeholder="Delivery region (e.g., Kochi)"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded font-semibold hover:bg-red-800 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-red-600 hover:underline">
            Log in to Swift Cart
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
