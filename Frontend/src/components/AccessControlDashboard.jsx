import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('jwtToken');

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch admins');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAccessChange = async (adminId, accessType, isChecked) => {
    try {
      const admin = admins.find(a => a.id === adminId);
      const newAccess = isChecked
        ? [...admin.access, accessType]
        : admin.access.filter(a => a !== accessType);

      const response = await axios.put(
        `http://localhost:3000/api/admins/${adminId}/access`,
        { access: newAccess },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmins(admins.map(a => 
        a.id === adminId ? response.data : a
      ));
      
      setSuccess('Access updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update access');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className="text-center p-8">Loading admins...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Access Management</h1>
      <p className="text-gray-600 mb-6">Super Admin Dashboard - Manage admin dashboard access</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
          {success}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anganwadi
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Registration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.email}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {admin.role}
                </td>
                
                {['anganwadi', 'district', 'state', 'student_registration'].map(accessType => (
                  <td key={accessType} className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={admin.access.includes(accessType)}
                      onChange={(e) => 
                        handleAccessChange(admin.id, accessType, e.target.checked)
                      }
                      disabled={
                        (admin.role === 'viewer' && accessType !== 'anganwadi') ||
                        (admin.role === 'registrar' && accessType !== 'student_registration')
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;