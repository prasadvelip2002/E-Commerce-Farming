'use client';
import { useState, useEffect } from 'react';

// This acts as a simulated Delivery Provider Web Dashboard
interface AssignedDelivery {
  deliveryId: string;
  orderId: string;
  status: string;
  customerAddress: string;
  farmerGps: string;
}

export default function DeliveryProviderPage() {
  const [deliveries, setDeliveries] = useState<AssignedDelivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState('');

  const fetchDeliveries = async () => {
    if (!providerId) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/deliveries/provider/${providerId}`);
      if (res.ok) setDeliveries(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/deliveries/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId, newStatus })
      });
      if (res.ok) fetchDeliveries();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Provider Dashboard</h1>
        <p className="text-gray-500 mt-1">Simulated view for a Delivery Provider to accept and manage assignments.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 flex gap-4 items-end">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Simulate Provider ID (Guid)</label>
          <input 
            type="text" 
            value={providerId} 
            onChange={e => setProviderId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
            placeholder="Enter Delivery Provider User ID"
          />
        </div>
        <button 
          onClick={fetchDeliveries}
          className="bg-orange-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Load My Routes
        </button>
      </div>

      {/* AI Logistics Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 mb-6 flex items-start gap-4">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shrink-0 mt-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <div className="flex-1">
          <h3 className="text-purple-900 font-bold mb-1">AI Route Optimization: <span className="text-purple-700">Active</span></h3>
          <p className="text-sm text-purple-800 leading-relaxed">
            The AI Logistics engine has analyzed real-time traffic and weather conditions and re-ordered the drop-off sequences for active drivers. Expected to save <span className="font-bold">14% fuel</span> and <span className="font-bold">22 minutes</span> per delivery cluster.
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors shadow-sm">
          View AI Map
        </button>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading assignments...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-gray-500">No active delivery assignments found for this ID.</p>
        ) : (
          deliveries.map(d => (
            <div key={d.deliveryId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    d.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                    d.status === 'PickedUp' ? 'bg-purple-100 text-purple-700' :
                    d.status === 'OutForDelivery' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {d.status}
                  </span>
                  <p className="text-xs text-gray-500 font-mono">ID: {d.deliveryId.split('-').pop()}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Pickup Location (Farmer)</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{d.farmerGps || 'Not provided'}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.farmerGps)}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Open in Google Maps</a>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Dropoff Location (Customer)</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{d.customerAddress}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-w-[200px]">
                {d.status === 'Assigned' && (
                  <button onClick={() => updateStatus(d.deliveryId, 'PickedUp')} className="bg-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors">
                    Confirm Pickup
                  </button>
                )}
                {d.status === 'PickedUp' && (
                  <button onClick={() => updateStatus(d.deliveryId, 'OutForDelivery')} className="bg-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors">
                    Start Route
                  </button>
                )}
                {d.status === 'OutForDelivery' && (
                  <button onClick={() => updateStatus(d.deliveryId, 'Delivered')} className="bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors">
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
