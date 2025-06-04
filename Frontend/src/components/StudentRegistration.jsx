import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';

function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    mother_name: '',
    gender: '',
    dob: '',
    area: '',
    pincode: '',
    district: '', 
    state: '',     
  });
  const [showForm, setShowForm] = useState(false);
  const [qrModal, setQrModal] = useState({
    open: false,
    student: null,
  });

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axios.get('http://localhost:3000/api/students');
        setStudents(res.data);
      } catch (error) {
        alert('Failed to fetch students');
      }
    }
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.father_name ||
      !formData.mother_name ||
      !formData.gender ||
      !formData.dob ||
      !formData.area ||
      !formData.pincode ||
      !formData.district ||  // New validation
      !formData.state       // New validation
    ) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/register-students', formData);
      const newStudent = res.data;
      setStudents((prev) => [...prev, newStudent]);
      setFormData({
        name: '',
        father_name: '',
        mother_name: '',
        gender: '',
        dob: '',
        area: '',
        pincode: '',
        district: '',  // Reset new field
        state: '',     // Reset new field
      });
      setShowForm(false);
    } catch (error) {
      alert('Failed to register student');
      console.error(error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleGenerateQrCode = (student) => {
    setQrModal({
      open: true,
      student,
    });
  };

  const downloadQRCode = () => {
    if (!qrModal.student) return;
    
    const svg = document.getElementById('qr-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    saveAs(blob, `${qrModal.student.name.replace(/\s+/g, '_')}_QR.svg`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Student Registration Dashboard
        </h1>
        <button
          onClick={toggleForm}
          className={`px-4 py-2 text-sm rounded-md font-medium ${
            showForm 
              ? 'bg-gray-500 hover:bg-gray-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {showForm ? 'Cancel' : '+ New Student'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 mb-6"
        >
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Father's Name</label>
            <input
              type="text"
              name="father_name"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.father_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Mother's Name</label>
            <input
              type="text"
              name="mother_name"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.mother_name}
              onChange={handleChange}
              required
            />
          </div>
          
          
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Gender</label>
            <select
              name="gender"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Area/Locality</label>
            <input
              type="text"
              name="area"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.pincode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">District</label>
            <input
              type="text"
              name="district"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">State</label>
            <input
              type="text"
              name="state"
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={toggleForm}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              Register
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Registered Students</h2>
        </div>

        {students.length === 0 ? (
          <p className="text-sm text-gray-500 p-4 text-center">No students registered yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Father</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">District</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">State</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Qr code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{student.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{student.father_name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{student.gender}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{student.area}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{student.district}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{student.state}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                      <button 
                        onClick={() => handleGenerateQrCode(student)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {qrModal.student.name}'s QR Code
              </h3>
              <button
                onClick={() => setQrModal({ open: false, student: null })}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="border-2 border-dashed border-gray-300 p-4 bg-white rounded-lg">
                <QRCodeSVG
                  id="qr-svg"
                  value={qrModal.student.hash}
                  size={256}
                  level="H"
                  includeMargin={true}
                  fgColor="#1e40af"
                  bgColor="#ffffff"
                />
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Download SVG
                </button>
                <button
                  onClick={() => setQrModal({ open: false, student: null })}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
                Scan this QR code with the mobile app to view student details
              </p>
              <p className="mt-1 text-xs text-gray-500 text-center max-w-xs">
                Student ID: {qrModal.student.student_id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;