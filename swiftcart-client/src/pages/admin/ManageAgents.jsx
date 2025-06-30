import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ManageAgents = () => {
  const [agent, setAgent] = useState({
    name: '', email: '', phone: '', region: '', password: ''
  });
  const [agents, setAgents] = useState([]);
  const [showAgents, setShowAgents] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (showAgents) fetchAgents();
  }, [showAgents]);

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const fetchAgents = async () => {
    try {
      const res = await API.get('/admin/agents');
      setAgents(res.data);
    } catch {
      alert('Failed to fetch agents');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/agents', agent);
      alert('Agent added successfully!');
      setAgent({ name: '', email: '', phone: '', region: '', password: '' });
      if (showAgents) fetchAgents();
    } catch {
      alert('Error adding agent');
    }
  };

  const handleEdit = (agent) => {
    setEditId(agent._id);
    setEditData(agent);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await API.put(`/admin/agents/${id}`, editData);
      alert('Agent updated!');
      setEditId(null);
      fetchAgents();
    } catch {
      alert('Error updating agent');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      await API.delete(`/admin/agents/${id}`);
      alert('Agent deleted!');
      fetchAgents();
    } catch {
      alert('Failed to delete agent');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {/* Form Section */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-6 tracking-wide">
          Add Delivery Agent
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {['name', 'email', 'phone', 'region', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={agent[field]}
              onChange={handleChange}
              required
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded shadow transition"
          >
            Add Agent
          </button>
        </form>

        <button
          onClick={() => setShowAgents(!showAgents)}
          className="mt-4 w-full py-2 bg-gray-800 hover:bg-black text-white font-semibold rounded shadow transition"
        >
          {showAgents ? 'Hide Agent List' : 'View Agent List'}
        </button>
      </div>

      {/* Table Section */}
      {showAgents && (
        <div className="max-w-6xl mx-auto mt-10 bg-white border shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-700">All Agents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 border">Name</th>
                  <th className="px-6 py-3 border">Email</th>
                  <th className="px-6 py-3 border">Phone</th>
                  <th className="px-6 py-3 border">Region</th>
                  <th className="px-6 py-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.length > 0 ? agents.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 transition border-t">
                    {editId === a._id ? (
                      <>
                        <td className="p-3 border">
                          <input name="name" value={editData.name} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="p-3 border">
                          <input name="email" value={editData.email} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="p-3 border">
                          <input name="phone" value={editData.phone} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="p-3 border">
                          <input name="region" value={editData.region} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="p-3 border text-center space-x-2">
                          <button
                            onClick={() => handleEditSubmit(a._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 border">{a.name}</td>
                        <td className="p-3 border">{a.email}</td>
                        <td className="p-3 border">{a.phone}</td>
                        <td className="p-3 border">{a.region}</td>
                        <td className="p-3 border text-center space-x-2">
                          <button
                            onClick={() => handleEdit(a)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">No agents available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgents;
