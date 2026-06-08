"use client";
import { useState } from "react";

export default function SubAdminsPage() {
  const [admins, setAdmins] = useState([
    { id: "SA-01", name: "Alice Johnson", email: "alice@agri.com", role: "Support Agent", status: "Active" },
    { id: "SA-02", name: "Bob Smith", email: "bob@agri.com", role: "Quality Inspector", status: "Suspended" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatus = (id: string) => {
    setAdmins(admins.map(a => 
      a.id === id ? { ...a, status: a.status === "Active" ? "Suspended" : "Active" } : a
    ));
  };

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sub-Admin Management</h1>
          <p className="text-gray-500 mt-1">Manage team access and roles</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl transition-colors shadow-sm"
        >
          + Add Sub-Admin
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{admin.name}</td>
                <td className="p-4 text-gray-600">{admin.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">{admin.role}</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    admin.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  <button className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">Edit</button>
                  <button 
                    onClick={() => toggleStatus(admin.id)}
                    className={`text-sm font-semibold transition-colors ${admin.status === 'Active' ? 'text-orange-500 hover:text-orange-600' : 'text-green-600 hover:text-green-700'}`}
                  >
                    {admin.status === 'Active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-xl rounded-3xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Sub-Admin</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="john@agri.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Role</label>
                <select className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500">
                  <option>Support Agent</option>
                  <option>Quality Inspector</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Invitation sent!");
                  setIsModalOpen(false);
                }}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors shadow-sm"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
