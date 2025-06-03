import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const dummyDistricts = [
  {
    id: 1,
    name: 'District 1',
    childrenServed: 455,
    genderDistribution: { male: 220, female: 220, other: 15 },
  },
  {
    id: 2,
    name: 'District 2',
    childrenServed: 390,
    genderDistribution: { male: 190, female: 180, other: 20 },
  },
  {
    id: 3,
    name: 'District 3',
    childrenServed: 520,
    genderDistribution: { male: 250, female: 260, other: 10 },
  },
  {
    id: 4,
    name: 'District 4',
    childrenServed: 360,
    genderDistribution: { male: 160, female: 190, other: 10 },
  },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

export function StateDashboard() {
  const [districts] = useState(dummyDistricts);

  const totalGenderData = districts.reduce(
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
      <h1 className="text-3xl font-bold text-center text-blue-700">🏛️ State Angawadi Dashboard</h1>

      {/* Districts Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Districts in State</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-700 text-xs uppercase tracking-wider">
                <th className="px-4 py-3">District Name</th>
                <th className="px-4 py-3">Total Children Served</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {districts.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium">{d.name}</td>
                  <td className="px-4 py-2">{d.childrenServed}</td>
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
          <h3 className="text-lg font-semibold mb-4 text-gray-700">👶 Children Served by District</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districts} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="childrenServed" fill="#3b82f6" />
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
                fill="#82ca9d"
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
