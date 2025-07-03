import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ManageVendors = () => {
  const [vendor, setVendor] = useState({
    name: '', email: '', phone: '', address: '', city: '',
  });
  const [vendors, setVendors] = useState([]);
  const [showVendors, setShowVendors] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (showVendors) fetchVendors();
  }, [showVendors]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const fetchVendors = async () => {
    try {
      const res = await API.get('/admin/vendors');
      setVendors(res.data);
    } catch (err) {
      alert('Failed to fetch vendors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/vendors', vendor);
      alert('Vendor added successfully!');
      setVendor({ name: '', email: '', phone: '', address: '', city: '' });
      if (showVendors) fetchVendors();
    } catch (err) {
      alert('Error adding vendor');
    }
  };

  const handleEdit = (vendor) => {
    setEditId(vendor._id);
    setEditData(vendor);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await API.put(`/admin/vendors/${id}`, editData);
      alert('Vendor updated successfully!');
      setEditId(null);
      fetchVendors();
    } catch {
      alert('Error updating vendor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await API.delete(`/admin/vendors/${id}`);
      alert('Vendor deleted!');
      fetchVendors();
    } catch {
      alert('Failed to delete vendor');
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br">
      {/* Add Vendor Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6 tracking-wide">Add New Vendor</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {['name', 'email', 'phone', 'address', 'city'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={vendor[field]}
              onChange={handleChange}
              required
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="px-4 py-2 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded shadow transition"
          >
            Add Vendor
          </button>
        </form>

        <button
          onClick={() => setShowVendors(!showVendors)}
          className="mt-4 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded shadow transition"
        >
          {showVendors ? 'Hide Vendor List' : ' View Vendor List'}
        </button>
      </div>

      {/* Vendor Table */}
      {showVendors && (
        <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-yellow-700">Vendor List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-yellow-100 text-yellow-800 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 border">Name</th>
                  <th className="px-6 py-3 border">Email</th>
                  <th className="px-6 py-3 border">Phone</th>
                  <th className="px-6 py-3 border">City</th>
                  <th className="px-6 py-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length > 0 ? vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-yellow-50 transition border-t">
                    {editId === v._id ? (
                      <>
                        <td className="px-6 py-3 border">
                          <input name="name" value={editData.name} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3 border">
                          <input name="email" value={editData.email} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3 border">
                          <input name="phone" value={editData.phone} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3 border">
                          <input name="city" value={editData.city} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                        </td>
                        <td className="px-6 py-3 border text-center space-x-2">
                          <button onClick={() => handleEditSubmit(v._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Save
                          </button>
                          <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-3 border">{v.name}</td>
                        <td className="px-6 py-3 border">{v.email}</td>
                        <td className="px-6 py-3 border">{v.phone}</td>
                        <td className="px-6 py-3 border">{v.city}</td>
                        <td className="px-6 py-3 border text-center space-x-2">
                          <button onClick={() => handleEdit(v)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(v._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-6">No vendors found.</td>
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

export default ManageVendors;
