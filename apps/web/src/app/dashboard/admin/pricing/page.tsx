"use client";
import { useState } from "react";

export default function PricingControlPage() {
  const [margin, setMargin] = useState(15);
  const [maxProfit, setMaxProfit] = useState(50);
  const [minPriceCap, setMinPriceCap] = useState(10);
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing & Margin Control</h1>
          <p className="text-gray-500 mt-1">Configure global AI pricing algorithms and platform cuts</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-8 py-3 font-bold rounded-xl transition-all ${
            isSaved ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isSaved ? '✓ Saved Successfully' : 'Save Rules'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-lg text-gray-900">Base Platform Margin (%)</label>
              <span className="text-2xl font-black text-green-600">{margin}%</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">The default percentage taken by the platform on every sale.</p>
            <input 
              type="range" min="0" max="30" step="0.5" 
              value={margin} onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full accent-green-600"
            />
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-lg text-gray-900">AI Max Profit Cap (%)</label>
              <span className="text-2xl font-black text-blue-600">{maxProfit}%</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">The maximum markup the AI can apply during high-demand surges to prevent price gouging.</p>
            <input 
              type="range" min="10" max="100" step="5" 
              value={maxProfit} onChange={(e) => setMaxProfit(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-lg text-gray-900">Minimum Price Cap (₹)</label>
              <span className="text-2xl font-black text-orange-500">₹{minPriceCap}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">The absolute minimum price for any product to ensure farmers don't sell at a loss during oversupply.</p>
            <input 
              type="range" min="1" max="100" step="1" 
              value={minPriceCap} onChange={(e) => setMinPriceCap(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 h-fit sticky top-8">
          <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <span>🧮</span> Preview Calculator
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span className="text-gray-600">Farmer Base Price (Example)</span>
              <span className="font-medium text-lg text-gray-900">₹100.00</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span className="text-gray-600">Platform Margin (+{margin}%)</span>
              <span className="font-medium text-green-600">+ ₹{(100 * (margin/100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span className="text-gray-600">Standard Retail Price</span>
              <span className="font-medium text-gray-900">₹{(100 * (1 + margin/100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-gray-800 font-bold">Max Surge Price (High Demand)</span>
              <span className="font-black text-2xl text-blue-600">₹{(100 * (1 + maxProfit/100)).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-bold">Info:</span> The AI Pricing Engine dynamically adjusts the final customer price between the Standard Retail Price and the Max Surge Price based on real-time supply and demand data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
