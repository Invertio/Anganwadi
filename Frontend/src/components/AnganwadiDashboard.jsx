import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { FaChild, FaUtensils, FaSyringe, FaUserCheck } from 'react-icons/fa';

const AnganwadiDashboard = () => {
  const cards = [
    { title: 'Children Enrolled', count: 32, icon: <FaChild className="text-blue-500 text-2xl" /> },
    { title: 'Meals Served Today', count: 29, icon: <FaUtensils className="text-green-500 text-2xl" /> },
    { title: 'Vaccinations', count: 5, icon: <FaSyringe className="text-yellow-500 text-2xl" /> },
    { title: 'Present Today', count: 27, icon: <FaUserCheck className="text-indigo-500 text-2xl" /> },
  ];

  const children = [
    { id: 1, name: 'Rani', age: 3, weight: '12kg', height: '88cm', status: 'Healthy' },
    { id: 2, name: 'Amit', age: 4, weight: '13kg', height: '92cm', status: 'Underweight' },
    { id: 3, name: 'Rahul', age: 2, weight: '11kg', height: '78cm', status: 'Healthy' },
    { id: 4, name: 'Priya', age: 5, weight: '14kg', height: '95cm', status: 'Malnourished' },
  ];

  const ageGroups = [
    { age: '2 yrs', count: 8 },
    { age: '3 yrs', count: 12 },
    { age: '4 yrs', count: 7 },
    { age: '5 yrs', count: 5 },
  ];

  const nutritionStatus = [
    { name: 'Healthy', value: 20 },
    { name: 'Underweight', value: 8 },
    { name: 'Malnourished', value: 4 },
  ];

  const COLORS = ['#34D399', '#F59E0B', '#EF4444']; // green, yellow, red

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Anganwadi Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition"
          >
            <div>{card.icon}</div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h3 className="text-xl font-bold">{card.count}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Age Group Bar Chart */}
        <div className="bg-white p-4 rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Children by Age</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageGroups}>
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nutrition Pie Chart */}
        <div className="bg-white p-4 rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Nutrition Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={nutritionStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {nutritionStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-200" />

      {/* Child Records Table */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Child Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Height</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {children.map((child, i) => (
                <tr
                  key={child.id}
                  className={`hover:bg-gray-50 transition duration-150 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{child.name}</td>
                  <td className="px-4 py-3">{child.age} yrs</td>
                  <td className="px-4 py-3">{child.weight}</td>
                  <td className="px-4 py-3">{child.height}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        child.status === 'Healthy'
                          ? 'bg-green-100 text-green-700'
                          : child.status === 'Underweight'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {child.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnganwadiDashboard;
