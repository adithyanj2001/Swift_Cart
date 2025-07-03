import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Login successful');

      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard/homepage');
      else if (role === 'agent') navigate('/agent/orders');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async (decoded) => {
    try {
      const res = await API.post('/auth/google', {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard/homepage');
      else if (role === 'agent') navigate('/agent/orders');
      else navigate('/');
    } catch (err) {
      alert('Google login error');
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/16/1a/61/161a61774b7e35ca9e443a977a6038dd.jpg')",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="w-full h-full min-h-screen bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center px-4">
        {/* ✨ Stylized Header */}
        <div className="text-center mb-10 mt-8">
          <p className="text-sm uppercase tracking-widest text-gray-700">welcome back</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-700 animate-pulse drop-shadow-sm mt-2">
            SWIFT CART
          </h1>
        </div>

        {/* Form Container */}
        <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-2xl">
          {/* Left Illustration */}
          <div className="md:w-1/2 w-full h-80 md:h-auto">
            <img
              src="https://img.freepik.com/free-vector/no-time-concept-illustration_114360-4290.jpg?semt=ais_hybrid&w=740"
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 w-full flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-700 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-700 font-medium">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Min 8 Characters"
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-fuchsia-600 transition duration-300"
                >
                  LOGIN
                </button>
              </form>

              {/* Google Login Button */}
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);

                    handleGoogleLogin(decoded);
                  }}
                  onError={() => {
                    alert('Google login failed');
                  }}
                />
              </div>

              <p className="text-sm text-gray-600 mt-6 text-center">
                Don’t have an account?{' '}
                <a href="/register" className="text-purple-600 font-medium hover:underline">
                  SignUp
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;