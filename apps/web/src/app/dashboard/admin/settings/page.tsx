"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    acceptNewFarmers: true,
    acceptNewCustomers: true,
    maintenanceMode: false,
    autoApproveHighQuality: true,
    emailNotifications: true,
  });

  const notifications = [
    { id: 1, type: "Alert", title: "High Traffic", message: "Platform is experiencing 200% higher traffic than usual.", time: "10 mins ago" },
    { id: 2, type: "Approval", title: "New Farmer", message: "Sunita Devi submitted KYC documents for review.", time: "1 hour ago" },
    { id: 3, type: "System", title: "AI Model Updated", message: "Yield prediction algorithm successfully retrained.", time: "3 hours ago" },
  ];

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings & Notifications</h1>
        <p className="text-gray-500 mt-1">Manage global system configurations and view alerts</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Platform Settings */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Global Configurations</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Accept New Farmers</h3>
                <p className="text-sm text-gray-500">Allow new farmer registrations on the mobile app.</p>
              </div>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.acceptNewFarmers ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={() => toggleSetting('acceptNewFarmers')}
              >
                <div className={`w-4 h-4 bg-white shadow-sm rounded-full transition-transform ${settings.acceptNewFarmers ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Auto-Approve High Quality</h3>
                <p className="text-sm text-gray-500">If AI Quality Scanner score &gt; 90, skip manual review.</p>
              </div>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.autoApproveHighQuality ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={() => toggleSetting('autoApproveHighQuality')}
              >
                <div className={`w-4 h-4 bg-white shadow-sm rounded-full transition-transform ${settings.autoApproveHighQuality ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-red-600">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Take the web and mobile apps offline for updates.</p>
              </div>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
                onClick={() => toggleSetting('maintenanceMode')}
              >
                <div className={`w-4 h-4 bg-white shadow-sm rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Centre */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Notification Centre</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-semibold">Mark all read</button>
          </div>
          
          <div className="space-y-4">
            {notifications.map(notif => (
              <div key={notif.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex gap-4">
                <div className="pt-1 text-lg">
                  {notif.type === 'Alert' ? '⚠️' : notif.type === 'Approval' ? '📝' : '⚙️'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900">{notif.title}</h3>
                    <span className="text-xs text-gray-500 font-medium">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-700 rounded-xl transition-colors">
            View Older Notifications
          </button>
        </div>

      </div>
    </div>
  );
}
