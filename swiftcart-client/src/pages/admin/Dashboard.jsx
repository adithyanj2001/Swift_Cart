import { useEffect, useState } from 'react';
import API from '../../services/api';
import { FaUsers, FaStore, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify'; 

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    API.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Failed to fetch users'));

    API.get('/admin/vendors')
      .then((res) => setVendors(res.data))
      .catch(() => toast.error('Failed to fetch vendors'));

    API.get('/admin/agents')
      .then((res) => setAgents(res.data))
      .catch(() => toast.error('Failed to fetch agents'));
  }, []);

  return (
    <div className="p-6 min-h-screen via-yellow-200 to-yellow-300 text-gray-900">
      <h1 className="text-3xl font-extrabold mb-6 text-yellow-800">ADMIN DASHBOARD</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-4 shadow-md rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-yellow-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg border-l-4 border-yellow-600">
          <div className="flex items-center space-x-4">
            <FaStore className="text-yellow-700 text-2xl" />
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-xl font-bold">{vendors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg border-l-4 border-yellow-700">
          <div className="flex items-center space-x-4">
            <FaUserTie className="text-yellow-800 text-2xl" />
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-xl font-bold">{agents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-800">ALL USERS</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded bg-white">
            <thead className="bg-yellow-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-yellow-50 transition">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vendors Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-800">VENDORS</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded bg-white">
            <thead className="bg-yellow-700 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-t hover:bg-yellow-50 transition">
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Agents Table */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-800">DELIVERY AGENTS</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded bg-white">
            <thead className="bg-yellow-800 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Region</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a._id} className="border-t hover:bg-yellow-50 transition">
                  <td className="p-3">{a.name}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3">{a.phone}</td>
                  <td className="p-3">{a.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
