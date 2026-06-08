'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';

type Product = {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  finalPrice: number;
  stockQuantity: number;
  unitOfMeasure: string;
  status: string;
};

type ScanResult = {
  disease_detected: boolean;
  disease_name: string;
  confidence: number;
  affected_area_percent: number;
  treatments: string[];
  prevention_tips: string[];
  severity: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { user } = useAuthStore();

  const handleScanCrop = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`http://${hostname}:8000/disease/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: 'demo.jpg', crop_type: 'Tomato' })
      });
      if (!res.ok) throw new Error('Failed to scan crop');
      const data = await res.json();
      
      // Simulate AI processing delay for UX
      setTimeout(() => {
        setScanResult(data);
        setIsScanning(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user?.email) return;
      try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const res = await fetch(`http://${hostname}:5153/api/products/farmer?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [user]);
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back, {user?.email?.split('@')[0] || 'Farmer'}! Here is a summary of your farm&apos;s performance.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-2xl">🌱</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Crops</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl">📦</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-2xl">💰</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹45,200</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">My Inventory</h3>
            <Link href="/dashboard/farmer/products/new">
              <button className="bg-[#4A7C59] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#3a6347] transition-colors">
                + Add Crop
              </button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl w-full"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No crops listed yet. Start adding your inventory!
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                      {product.category === 'Vegetable' ? '🥬' : '🍎'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stockQuantity} {product.unitOfMeasure}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{product.finalPrice.toFixed(2)} / {product.unitOfMeasure}</p>
                    <p className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">{product.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Suggestions Side Panel */}
        <div className="bg-[#4A7C59] rounded-2xl shadow-sm border border-[#3a6347] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-xl"></div>
          
          <h3 className="text-xl font-bold mb-2 relative z-10 flex items-center gap-2">
            <span>✨</span> AI Insights
          </h3>
          <p className="text-green-100 text-sm mb-6 relative z-10">Smart suggestions to maximize your yield.</p>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="font-bold text-sm mb-1">Pricing Alert</p>
              <p className="text-xs text-green-50">Demand for Organic Tomatoes is high in Mumbai. Consider raising your base price by ₹0.50/kg.</p>
              <button className="mt-3 text-xs font-bold text-[#4A7C59] bg-white px-3 py-1.5 rounded-md hover:bg-gray-100 w-full transition-colors">
                Update Price
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="font-bold text-sm mb-1">Disease Detection</p>
              
              {!isScanning && !scanResult && (
                <>
                  <p className="text-xs text-green-50 mb-3">Upload a photo of your crops for instant disease diagnosis and treatment plans.</p>
                  <button onClick={handleScanCrop} className="text-xs font-bold text-white border border-white/30 px-3 py-1.5 rounded-md hover:bg-white/20 w-full transition-colors flex items-center justify-center gap-2">
                    <span>📷</span> Scan Tomato Crop
                  </button>
                </>
              )}

              {isScanning && (
                <div className="py-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-2"></div>
                  <p className="text-xs font-mono text-green-100">AI Model Analyzing...</p>
                </div>
              )}

              {scanResult && !isScanning && (
                <div className="mt-2 space-y-3">
                  <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                    scanResult.severity === 'Critical' ? 'bg-red-500/20 border-red-500/50 text-red-100' :
                    scanResult.severity === 'High' ? 'bg-orange-500/20 border-orange-500/50 text-orange-100' :
                    'bg-yellow-500/20 border-yellow-500/50 text-yellow-100'
                  }`}>
                    <span className="text-lg">🦠</span>
                    <div>
                      <p className="text-xs font-bold">{scanResult.disease_name}</p>
                      <p className="text-[10px] uppercase tracking-wider">{scanResult.severity} SEVERITY • {(scanResult.confidence * 100).toFixed(0)}% CONFIDENCE</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-white mb-1">Recommended Action:</p>
                    <ul className="text-xs text-green-50 list-disc pl-4 space-y-1">
                      {scanResult.treatments.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>

                  <button onClick={() => setScanResult(null)} className="text-xs font-semibold text-white/70 hover:text-white underline text-center w-full mt-2">
                    Clear Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
