import { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Login successful');

      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.data.user.role === 'vendor') navigate('/vendor/dashboard/homepage');
      else if (res.data.user.role === 'agent') navigate('/agent/orders');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 via-red-900 to-black">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-red-700 mb-6">
           Swift Cart
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome back! Please log in to continue your shopping.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded font-semibold hover:bg-red-800 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to <strong>Swift_Cart</strong>?{' '}
          <a href="/register" className="text-red-600 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
