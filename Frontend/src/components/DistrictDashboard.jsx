import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const dummyAngawadis = [
  {
    id: 1,
    name: 'Angawadi A',
    location: 'Village 1',
    childrenServed: 120,
    genderDistribution: { male: 60, female: 55, other: 5 },
  },
  {
    id: 2,
    name: 'Angawadi B',
    location: 'Village 2',
    childrenServed: 95,
    genderDistribution: { male: 40, female: 50, other: 5 },
  },
  {
    id: 3,
    name: 'Angawadi C',
    location: 'Village 3',
    childrenServed: 130,
    genderDistribution: { male: 70, female: 55, other: 5 },
  },
  {
    id: 4,
    name: 'Angawadi D',
    location: 'Village 4',
    childrenServed: 110,
    genderDistribution: { male: 50, female: 55, other: 5 },
  },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F']; // Blue, Orange, Teal

export function DistrictDashboard() {
  const [angawadis] = useState(dummyAngawadis);

  const totalGenderData = angawadis.reduce(
    (acc, cur) => {
      acc.male += cur.genderDistribution.male;
      acc.female += cur.genderDistribution.female;
      acc.other += cur.genderDistribution.other;
      return acc;
    },
    { male: 0, female: 0, other: 0 }
  );

  const pieData = [
    { name: 'Male', value: totalGenderData.male },
    { name: 'Female', value: totalGenderData.female },
    { name: 'Other', value: totalGenderData.other },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-blue-700">🌾 District Angawadi Dashboard</h1>

      {/* Angawadi Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Angawadis in District</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-700 text-xs uppercase tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Children Served</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {angawadis.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium">{a.name}</td>
                  <td className="px-4 py-2">{a.location}</td>
                  <td className="px-4 py-2">{a.childrenServed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Bar Chart for Children Served */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">👶 Children Served by Angawadi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={angawadis} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="childrenServed" fill="#3b82f6" /> {/* Blue instead of green */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Gender Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">⚧ Gender Distribution of Children</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
