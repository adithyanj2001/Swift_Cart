import { useEffect, useState } from 'react';
import API from '../../services/api';
import { FaUsers, FaStore, FaUserTie } from 'react-icons/fa'; //  agents icon 

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    API.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => alert('Failed to fetch users'));

    API.get('/admin/vendors')
      .then((res) => setVendors(res.data))
      .catch(() => alert('Failed to fetch vendors'));

    API.get('/admin/agents')
      .then((res) => setAgents(res.data))
      .catch(() => alert('Failed to fetch agents'));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-6 text-red-700">Admin Dashboard - Swift Cart</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-4 shadow rounded-lg border-l-4 border-red-600">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-red-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p> 
              <p className="text-xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg border-l-4 border-black">
          <div className="flex items-center space-x-4">
            <FaStore className="text-black text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Total Vendors</p>
              <p className="text-xl font-bold">{vendors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg border-l-4 border-blue-600">
          <div className="flex items-center space-x-4">
            <FaUserTie className="text-blue-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Total Agents</p>
              <p className="text-xl font-bold">{agents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded bg-white">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-red-50 transition"
                >
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Vendors</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded bg-white">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v._id}
                  className="border-t hover:bg-gray-100 transition"
                >
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Delivery Agents</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Region</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr
                  key={a._id}
                  className="border-t hover:bg-blue-50 transition"
                >
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
