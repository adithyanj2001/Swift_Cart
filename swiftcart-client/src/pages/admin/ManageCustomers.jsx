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
    <div className="min-h-screen bg-gradient-to-br from-white px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-yellow-700 text-center mb-8 tracking-wide">
          MANAGE CUSTOMERS
        </h2>

        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full border-collapse text-sm text-gray-800">
            <thead className="bg-yellow-100 text-yellow-800 uppercase tracking-wide">
              <tr>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-yellow-50 transition border-b">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4 text-center">
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
