import React from 'react';

const CustomerProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <div className="p-6">User not logged in</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="space-y-2 text-gray-700">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
      </div>
    </div>
  );
};

export default CustomerProfile;
