import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify'; 

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
      toast.error('Failed to fetch agents');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/agents', agent);
      toast.success(' Agent added successfully!');
      setAgent({ name: '', email: '', phone: '', region: '', password: '' });
      if (showAgents) fetchAgents();
    } catch {
      toast.error('Error adding agent');
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
      toast.success('Agent updated!');
      setEditId(null);
      fetchAgents();
    } catch {
      toast.error('Error updating agent');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      await API.delete(`/admin/agents/${id}`);
      toast.success('Agent deleted!');
      fetchAgents();
    } catch {
      toast.error('Failed to delete agent');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white px-4 py-10">
      {/* Add Agent Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6 tracking-wide">
          Add New Agent
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
              className="px-4 py-2 border border-yellow-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded shadow"
          >
            Add Agent
          </button>
        </form>

        <button
          onClick={() => setShowAgents(!showAgents)}
          className="mt-4 w-full py-2 bg-yellow-700 hover:bg-yellow-800 text-white font-semibold rounded shadow"
        >
          {showAgents ? 'Hide Agent List' : 'View Agent List'}
        </button>
      </div>

      {/* Agent Table */}
      {showAgents && (
        <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-yellow-700">Agent List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-yellow-100 text-yellow-800 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Region</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.length > 0 ? agents.map((a) => (
                  <tr key={a._id} className="hover:bg-yellow-50 transition border-t">
                    {editId === a._id ? (
                      <>
                        <td className="px-6 py-3">
                          <input name="name" value={editData.name} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3">
                          <input name="email" value={editData.email} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3">
                          <input name="phone" value={editData.phone} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3">
                          <input name="region" value={editData.region} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3 text-center space-x-2">
                          <button onClick={() => handleEditSubmit(a._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Save
                          </button>
                          <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-3">{a.name}</td>
                        <td className="px-6 py-3">{a.email}</td>
                        <td className="px-6 py-3">{a.phone}</td>
                        <td className="px-6 py-3">{a.region}</td>
                        <td className="px-6 py-3 text-center space-x-2">
                          <button onClick={() => handleEdit(a)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(a._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">No agents found.</td>
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
