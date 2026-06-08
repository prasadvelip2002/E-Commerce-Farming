"use client";
import { useState } from "react";

export default function QualityControlPage() {
  const [batches, setBatches] = useState([
    { id: "BATCH-402", product: "Organic Tomatoes", farmer: "Ramesh Farms", aiScore: 92, aiGrade: "A", status: "Auto-Approved" },
    { id: "BATCH-403", product: "Alphonso Mangoes", farmer: "Konkan Orchards", aiScore: 74, aiGrade: "B", status: "Flagged for Review" },
    { id: "BATCH-404", product: "Basmati Rice", farmer: "Singh & Sons", aiScore: 88, aiGrade: "A", status: "Pending" },
  ]);

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
        <p className="text-gray-500 mt-1">Review AI-assigned quality scores and manage flagged product batches.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Batch ID</th>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Farmer</th>
              <th className="p-4 font-semibold">AI Score</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {batches.map(batch => (
              <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm">{batch.id}</td>
                <td className="p-4 font-semibold text-gray-900">{batch.product}</td>
                <td className="p-4 text-gray-600">{batch.farmer}</td>
                <td className="p-4">
                  <span className={`font-black ${batch.aiScore >= 90 ? 'text-green-600' : batch.aiScore >= 80 ? 'text-blue-600' : 'text-orange-500'}`}>
                    {batch.aiScore}/100
                  </span>
                  <span className="text-gray-400 text-xs ml-2">Grade {batch.aiGrade}</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    batch.status === 'Auto-Approved' ? 'bg-green-100 text-green-700' : 
                    batch.status === 'Flagged for Review' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {batch.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
