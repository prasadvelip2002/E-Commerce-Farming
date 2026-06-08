"use client";
import { useState } from "react";
import { TrendingUp, AlertTriangle, Activity, PackageSearch } from "lucide-react";

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState("demand");

  const demandForecast = [
    { crop: "Tomatoes", currentDemand: 80, predictedDemand: 95, supply: 40, risk: "High Shortage" },
    { crop: "Onions", currentDemand: 60, predictedDemand: 65, supply: 80, risk: "Oversupply" },
    { crop: "Wheat", currentDemand: 70, predictedDemand: 72, supply: 75, risk: "Stable" },
    { crop: "Mangoes", currentDemand: 90, predictedDemand: 100, supply: 30, risk: "Severe Shortage" },
  ];

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          AI Insights Hub
        </h1>
        <p className="text-gray-500 mt-1">Real-time predictive analytics and platform intelligence.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Market Sentiment</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-gray-900">Bullish</span>
            <span className="text-sm font-semibold text-green-600 mb-1">+14% Growth Expected</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Supply Chain Risk</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-orange-600">Elevated</span>
            <span className="text-sm font-semibold text-orange-600 mb-1">Monsoon Delays in MH</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Fraud Anomalies</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-gray-900">12</span>
            <span className="text-sm font-semibold text-purple-600 mb-1">Flagged today</span>
          </div>
        </div>
      </div>

      {/* Main AI Module */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col flex-1 min-h-[500px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4 gap-6">
          <button 
            className={`pb-4 px-2 font-bold transition-colors ${activeTab === 'demand' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('demand')}
          >
            Predictive Demand
          </button>
          <button 
            className={`pb-4 px-2 font-bold transition-colors ${activeTab === 'logistics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab('logistics')}
          >
            Logistics Bottlenecks
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {activeTab === 'demand' && (
            <div>
              <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold text-lg">
                <TrendingUp className="text-blue-500" />
                30-Day Crop Demand Forecast
              </div>
              <p className="text-sm text-gray-500 mb-8 max-w-2xl">
                The AI model predicts future demand based on historical purchasing patterns, upcoming festivals, and regional weather forecasts. Use this to alert farmers on what to plant or harvest.
              </p>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Visual Chart */}
                <div className="h-64 flex items-end gap-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
                  {demandForecast.map(item => (
                    <div key={item.crop} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold py-1 px-3 rounded shadow-xl whitespace-nowrap z-10 pointer-events-none">
                        Supply: {item.supply}% | Demand: {item.predictedDemand}%
                      </div>
                      
                      {/* Bars */}
                      <div className="w-full h-48 bg-gray-200 rounded-t-md relative flex items-end justify-center">
                        {/* Supply Bar (Background) */}
                        <div className="absolute bottom-0 w-full bg-blue-100 rounded-t-md" style={{ height: `${item.supply}%` }}></div>
                        {/* Demand Bar (Foreground) */}
                        <div className={`absolute bottom-0 w-3/4 rounded-t-md transition-all duration-1000 ${
                          item.predictedDemand > item.supply + 20 ? 'bg-red-400' : 
                          item.supply > item.predictedDemand + 20 ? 'bg-orange-400' : 'bg-green-400'
                        }`} style={{ height: `${item.predictedDemand}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600">{item.crop}</span>
                    </div>
                  ))}
                </div>

                {/* Data Table */}
                <div className="overflow-auto bg-white border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                      <tr>
                        <th className="p-3 font-semibold">Commodity</th>
                        <th className="p-3 font-semibold">Predicted Demand</th>
                        <th className="p-3 font-semibold">AI Risk Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {demandForecast.map(item => (
                        <tr key={item.crop}>
                          <td className="p-3 font-bold text-gray-900">{item.crop}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{item.predictedDemand}%</span>
                              {item.predictedDemand > item.currentDemand ? 
                                <TrendingUp className="w-4 h-4 text-red-500" /> : 
                                <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
                              }
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              item.risk.includes('Shortage') ? 'bg-red-100 text-red-700' :
                              item.risk === 'Oversupply' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {item.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <PackageSearch className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Logistics AI Scanning...</h3>
              <p className="max-w-md text-center text-sm">The AI is currently analyzing active delivery routes across India to identify potential weather delays or traffic anomalies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
