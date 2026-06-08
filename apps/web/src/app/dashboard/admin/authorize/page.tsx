"use client";
import { useState } from "react";
import Link from "next/link";

export default function AuthorizeRolesPage() {
  const [roles] = useState([
    { id: "R-01", name: "Super Admin", description: "Full access to all modules and system configurations", users: 1 },
    { id: "R-02", name: "Quality Inspector", description: "Access to KYC Approvals and Product Quality Control", users: 4 },
    { id: "R-03", name: "Support Agent", description: "Read-only access to Orders and Farmer profiles", users: 12 },
    { id: "R-04", name: "Finance Manager", description: "Access to Pricing & Margin controls and Revenue reports", users: 2 },
  ]);

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authorize Roles</h1>
          <p className="text-gray-500 mt-1">Manage platform roles and module access</p>
        </div>
        <button className="px-6 py-3 bg-[#4A7C59] text-white hover:bg-[#3a6347] font-bold rounded-xl transition-colors shadow-sm">
          + Create New Role
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto content-start">
        {roles.map(role => (
          <div key={role.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col hover:border-[#4A7C59] transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#4A7C59] transition-colors">{role.name}</h2>
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{role.id}</span>
            </div>
            <p className="text-gray-600 text-sm mb-6 flex-1">{role.description}</p>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {role.users}
                </span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Users</span>
              </div>
              <button className="text-sm font-semibold text-[#4A7C59] hover:underline">
                Edit Permissions &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
