import { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    region: '',
    address: '',
    place: '',
    phone: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers for phone
    if (name === 'phone') {
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { role, phone } = form;

    // Validate 10-digit phone for vendor and agent
    if ((role === 'vendor' || role === 'agent') && !/^\d{10}$/.test(phone)) {
      return toast.error('Please enter a valid 10-digit phone number');
    }

    try {
      await API.post('/auth/register', form);
      toast.success('Registered successfully. Now login ');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed ');
    }
  };

  const isVendor = form.role === 'vendor';
  const isAgent = form.role === 'agent';

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-vector/online-shopping-concept-consumerism-people-young-people-women-men-make-purchases-using-smartphone-laptop_110633-494.jpg?semt=ais_hybrid&w=740')",
      }}
    >
      <div className="w-full h-full min-h-screen bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center px-4">
        <div className="text-center mt-8 mb-10">
          <p className="text-sm uppercase tracking-widest text-gray-700">join</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-700 animate-pulse drop-shadow-sm mt-2">
            SWIFT CART
          </h1>
        </div>

        <div className="w-full max-w-2xl bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-8 mb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Registering as</label>
              <select
                name="role"
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
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
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Place</label>
                  <input
                    type="text"
                    name="place"
                    placeholder="Business location"
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Full address"
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
                  />
                </div>
              </>
            )}

            {/* Agent-Specific Fields */}
            {isAgent && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Region</label>
                  <input
                    type="text"
                    name="region"
                    placeholder="Delivery region (e.g., Kochi)"
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-md"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white py-2 rounded-lg font-semibold hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-purple-600 font-medium hover:underline">
              Log in to Swift Cart
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
