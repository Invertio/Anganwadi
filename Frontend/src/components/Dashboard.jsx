import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AccessControlDashboard from './AccessControlDashboard';
import AnganwadiDashboard from './AnganwadiDashboard';
import StudentDashboard    from './StudentRegistration';
import { DistrictDashboard } from './DistrictDashboard';
import { StateDashboard } from './StateDashboard';

const Dashboard = () => {
  const [activeDashboard, setActiveDashboard] = useState('');
  const [availableDashboards, setAvailableDashboards] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Get user's accessible dashboards from localStorage
    const accessData = localStorage.getItem('access');
    if (accessData) {
      let dashboards = accessData.split(',').map(item => {
        const trimmedItem = item.trim().toLowerCase();
        if (trimmedItem === 'student_registration') return 'studentRegistration';
        if (trimmedItem === 'accesscontrol') return 'accessControl'; // Normalize keys
        return trimmedItem;
      }).filter(Boolean);

      // Sort dashboards
      dashboards = dashboards.sort((a, b) => {
        if (a === 'accessControl') return -1;
        if (b === 'accessControl') return 1;
        if (a === 'studentRegistration') return -1;
        if (b === 'studentRegistration') return 1;
        return 0;
      });

      setAvailableDashboards(dashboards);
      if (dashboards.length > 0) {
        setActiveDashboard(dashboards[0]);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear all authentication-related items
   localStorage.clear()
    
    // Navigate to login page
    navigate('/login');
  };

  // Dashboard components mapping
  const dashboardComponents = {
    accessControl: <AccessControlDashboard />,
    studentRegistration: <StudentDashboard />,
    anganwadi: <AnganwadiDashboard />,
    district: <DistrictDashboard />,
    state: <StateDashboard />
  };

  // Dashboard display names mapping
  const dashboardNames = {
    accessControl: 'Access Control',
    studentRegistration: 'Student Registration',
    anganwadi: 'Anganwadi',
    district: 'District',
    state: 'State'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Dashboards</h2>
            <button 
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </div>
          
          {availableDashboards.length > 0 ? (
            <ul className="space-y-2">
              {availableDashboards.map(dashboardKey => (
                <li
                  key={dashboardKey}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    activeDashboard === dashboardKey
                      ? 'bg-blue-500 font-medium'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveDashboard(dashboardKey)}
                >
                  {dashboardNames[dashboardKey]} Dashboard
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No dashboards available</p>
          )}
        </div>
        
        {/* User info at bottom (optional) */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm">
            Logged in as: {localStorage.getItem('name')}
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeDashboard && dashboardComponents[activeDashboard] ? (
          dashboardComponents[activeDashboard]
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">No Dashboard Selected</h2>
            <p>Please select a dashboard from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;