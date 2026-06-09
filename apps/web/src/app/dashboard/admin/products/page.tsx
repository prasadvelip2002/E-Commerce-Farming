'use client';

interface Product {
  id: string;
  name: string;
  category: string;
  farmer: string;
  basePrice: number;
  adminMargin: number;
  stock: number;
  status: 'Active' | 'Pending' | 'OutOfStock' | 'Rejected';
}

interface AiResult {
  productId: string;
  suggestedMargin: number;
  reasoning: string;
}

const STATUS_STYLES: Record<string, string> = {
  Active:     'bg-green-100 text-green-800',
  Pending:    'bg-yellow-100 text-yellow-800',
  OutOfStock: 'bg-red-100 text-red-800',
  Rejected:   'bg-gray-100 text-gray-600',
};

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingMargin, setEditingMargin] = useState<string | null>(null);
  const [marginValue, setMarginValue] = useState('');
  
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      
      const mappedProducts: Product[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'Unknown',
        farmer: p.farmerName ? p.farmerName.split('@')[0] : 'Unknown',
        basePrice: p.basePrice || p.finalPrice,
        adminMargin: (p.finalPrice - (p.basePrice || p.finalPrice)) || 0,
        stock: p.stockQuantity,
        status: p.status === 'Active' ? 'Active' : 'Pending',
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMargin = async (id: string, customMargin?: number) => {
    const newMargin = customMargin !== undefined ? customMargin : parseFloat(marginValue);
    if (isNaN(newMargin)) {
      setEditingMargin(null);
      setAiResult(null);
      return;
    }

    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/products/${id}/margin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ margin: newMargin })
      });
      
      if (!res.ok) throw new Error('Failed to update margin');
      
      // Refresh products table to show new Final Price
      fetchProducts();
    } catch (err) {
      alert('Failed to update margin. Ensure backend is running.');
    } finally {
      setEditingMargin(null);
      setAiResult(null);
    }
  };

  const getAiSuggestion = async (product: Product) => {
    setAiLoadingId(product.id);
    setAiResult(null);
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/ai/pricing-suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          basePrice: product.basePrice,
          category: product.category,
          stockQuantity: product.stock,
          season: 'Kharif', // Mocking season for now
          demandIndex: 0.8
        })
      });
      if (!res.ok) throw new Error('AI service failed');
      const data = await res.json();
      
      const suggestedMargin = data.suggested_price - product.basePrice;
      
      setAiResult({
        productId: product.id,
        suggestedMargin: Number(suggestedMargin.toFixed(2)),
        reasoning: data.reasoning
      });
    } catch (err) {
      alert("AI Service is currently unavailable. Ensure the backend and AI containers are running.");
    } finally {
      setAiLoadingId(null);
    }
  };

  const cycleStatus = (id: string) => {
    const cycle: Product['status'][] = ['Pending', 'Active', 'Rejected'];
    setProducts(p => p.map(prod => {
      if (prod.id !== id) return prod;
      const next = cycle[(cycle.indexOf(prod.status as any) + 1) % cycle.length];
      return { ...prod, status: next };
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage listings, margins, and approval status.</p>
        </div>
        <button className="bg-[#4A7C59] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a6347] transition-colors">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['ID', 'Product', 'Category', 'Farmer', 'Base Price', 'Admin Margin', 'Final Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded-lg w-20"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  </tr>
                ))
              ) : (
                products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{product.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-5 py-4 text-gray-600">{product.category}</td>
                  <td className="px-5 py-4 text-gray-600">{product.farmer}</td>
                  <td className="px-5 py-4 font-medium text-gray-700">₹{product.basePrice.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {editingMargin === product.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={product.adminMargin}
                            onChange={e => setMarginValue(e.target.value)}
                            className="w-20 border border-[#4A7C59] rounded px-2 py-1 text-sm focus:outline-none"
                            autoFocus
                          />
                          <button onClick={() => saveMargin(product.id)} className="text-green-600 font-bold text-lg">✓</button>
                          <button onClick={() => setEditingMargin(null)} className="text-red-400 font-bold text-lg">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingMargin(product.id); setMarginValue(String(product.adminMargin)); }}
                          className="flex items-center gap-1 text-[#6D4C41] font-semibold hover:text-[#4A7C59] transition-colors"
                        >
                          ₹{product.adminMargin.toFixed(2)}
                          <span className="text-xs">✏️</span>
                        </button>
                      )}
                      <button 
                        onClick={() => getAiSuggestion(product)}
                        disabled={aiLoadingId === product.id}
                        className={`text-xs ml-2 px-2 py-1 rounded-md border font-semibold transition-all flex items-center gap-1 ${
                          aiLoadingId === product.id 
                            ? 'bg-gray-100 text-gray-400 border-gray-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        }`}
                        title="Get AI Pricing Suggestion"
                      >
                        {aiLoadingId === product.id ? '⏳' : '✨ AI'}
                      </button>
                    </div>

                    {/* AI Result Inline Popup */}
                    {aiResult?.productId === product.id && (
                      <div className="absolute z-10 mt-2 p-3 bg-white border border-purple-200 shadow-xl rounded-xl w-72 text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-purple-800">✨ AI Suggestion</p>
                          <button onClick={() => setAiResult(null)} className="text-gray-400 hover:text-gray-700">✕</button>
                        </div>
                        <p className="text-gray-600 text-xs mb-3 leading-relaxed">{aiResult.reasoning}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Suggested Margin</p>
                            <p className="font-bold text-lg text-purple-700">₹{aiResult.suggestedMargin}</p>
                          </div>
                          <button 
                            onClick={() => saveMargin(product.id, aiResult.suggestedMargin)}
                            className="bg-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-xs"
                          >
                            Apply Margin
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#4A7C59]">
                    ₹{(product.basePrice + product.adminMargin).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stock.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => cycleStatus(product.id)}
                      className="text-xs text-gray-500 hover:text-[#4A7C59] font-medium underline"
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {products.length} products · Click margin ✏️ to edit · Click status to cycle
        </div>
      </div>
    </div>
  );
}
