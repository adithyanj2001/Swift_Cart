import React from 'react';

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-2">Your Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default ProfileCard;
