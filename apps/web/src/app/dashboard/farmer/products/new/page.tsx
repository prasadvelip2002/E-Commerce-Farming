'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetable');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  
  // Origin Details
  const [farmLocation, setFarmLocation] = useState('');
  const [soilType, setSoilType] = useState('Alluvial');
  const [acresGrown, setAcresGrown] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // AI Pricing State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedPrice: number; marginPercentage: number; reasoning: string; priceRangeMin: number; priceRangeMax: number } | null>(null);

  const handleGetAiPricing = async () => {
    if (!name || !stockQuantity || !basePrice) {
      setError('Please fill in Crop Name, Base Price, and Stock Quantity before requesting AI suggestions.');
      return;
    }
    
    setIsAiLoading(true);
    setError('');
    setAiSuggestion(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/Ai/pricing-suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: name,
          basePrice: parseFloat(basePrice),
          category: category,
          stockQuantity: parseInt(stockQuantity),
          season: "Kharif", // Hardcoded for demo
          demandIndex: 0.8
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get AI pricing suggestion');
      }

      const data = await res.json();
      setAiSuggestion({
        suggestedPrice: data.suggested_price,
        marginPercentage: data.margin_percentage,
        reasoning: data.reasoning,
        priceRangeMin: data.price_range_min,
        priceRangeMax: data.price_range_max,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name,
          category,
          description,
          basePrice: parseFloat(basePrice),
          stockQuantity: parseInt(stockQuantity),
          unitOfMeasure: unit,
          farmLocation,
          soilType,
          acresGrown: parseFloat(acresGrown),
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to list product');
      }

      router.push('/dashboard/farmer/products');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List New Crop</h1>
        <p className="text-gray-500">Provide accurate details to attract B2B and B2C buyers.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Name</label>
            <input 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]" 
              placeholder="e.g. Organic Nashik Onions" 
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59] bg-white"
            >
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Grain">Grain</option>
              <option value="Spice">Spice</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
          <textarea 
            required 
            rows={4}
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]" 
            placeholder="Describe the quality, farm location, and harvest details..." 
          />
        </div>

        <div className="grid grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="col-span-3 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price (₹)</label>
            <input 
              required 
              type="number" 
              step="0.01"
              value={basePrice} 
              onChange={e => setBasePrice(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]" 
              placeholder="0.00" 
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Stock</label>
            <input 
              required 
              type="number" 
              value={stockQuantity} 
              onChange={e => setStockQuantity(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]" 
              placeholder="100" 
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
            <select 
              value={unit} 
              onChange={e => setUnit(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59] bg-white"
            >
              <option value="kg">KG</option>
              <option value="ton">Tons</option>
              <option value="dozen">Dozen</option>
            </select>
          </div>
        </div>

        {/* AI Pricing UI */}
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-10 select-none pointer-events-none">🤖</div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h3 className="font-bold text-blue-900 flex items-center gap-2 text-lg">
                <span>✨</span> AI Price Optimizer
              </h3>
              <p className="text-sm text-blue-700/80 mt-1">Get dynamic pricing suggestions based on market demand, season, and stock.</p>
            </div>
            <Button type="button" onClick={handleGetAiPricing} disabled={isAiLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-sm border-0">
              {isAiLoading ? 'Analyzing...' : 'Get Suggestion'}
            </Button>
          </div>
          
          {aiSuggestion && (
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Suggested Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-green-600">₹{aiSuggestion.suggestedPrice}</span>
                    <span className="text-gray-400 text-sm font-medium">/{unit}</span>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md">+{aiSuggestion.marginPercentage}% Margin</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-md">Range: ₹{aiSuggestion.priceRangeMin} - ₹{aiSuggestion.priceRangeMax}</span>
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={() => setBasePrice(aiSuggestion.suggestedPrice.toString())}
                  className="bg-green-100 text-green-700 hover:bg-green-200 border-none font-bold"
                >
                  Apply Price
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                <span className="font-semibold text-blue-800">AI Reasoning:</span> {aiSuggestion.reasoning}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
          <div className="col-span-3 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Location</label>
            <input 
              required 
              type="text" 
              value={farmLocation} 
              onChange={e => setFarmLocation(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]" 
              placeholder="e.g. Nashik, Maharashtra" 
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
            <select 
              value={soilType} 
              onChange={e => setSoilType(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59] bg-white"
            >
              <option value="Alluvial">Alluvial</option>
              <option value="Black Cotton">Black Cotton</option>
              <option value="Red/Yellow">Red/Yellow</option>
              <option value="Laterite">Laterite</option>
              <option value="Arid/Desert">Arid/Desert</option>
            </select>
          </div>
          <div className="col-span-3 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Acres Grown</label>
            <input 
              required 
              type="number" 
              step="0.1"
              value={acresGrown} 
              onChange={e => setAcresGrown(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]" 
              placeholder="e.g. 2.5" 
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="px-8 bg-[#4A7C59] text-white hover:bg-[#3a6347] shadow-lg shadow-green-900/20">
            {isSubmitting ? 'Listing...' : 'Submit Listing'}
          </Button>
        </div>
      </form>
    </div>
  );
}
