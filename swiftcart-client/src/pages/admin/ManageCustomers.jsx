import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get('/admin/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load customers');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this customer?')) {
      try {
        await API.delete(`/admin/customers/${id}`);
        setCustomers(customers.filter((c) => c._id !== id));
        alert('Customer removed successfully');
      } catch (err) {
        console.error(err);
        alert('Error removing customer');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Manage Customers</h2>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border">Name</th>
                <th className="p-4 border">Email</th>
                <th className="p-4 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 border">{c.name}</td>
                  <td className="p-4 border">{c.email}</td>
                  <td className="p-4 border text-center">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
