"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";

export default function AiShopperPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      setResponse({
        message: "Here's a great recipe for " + query + " along with the fresh ingredients you'll need from our farmers:",
        ingredients: [
          { id: "ai-1", name: "Organic Tomatoes", price: 40, unit: "kg" },
          { id: "ai-2", name: "Fresh Basil", price: 15, unit: "bunch" },
          { id: "ai-3", name: "Garlic Bulbs", price: 20, unit: "250g" }
        ],
        recipe: "1. Chop the tomatoes.\n2. Sauté garlic in olive oil.\n3. Add tomatoes and simmer for 20 mins.\n4. Garnish with fresh basil."
      });
      setLoading(false);
    }, 1500);
  };

  const addAllToCart = () => {
    if (response?.ingredients) {
      response.ingredients.forEach((item: any) => {
        addItem({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: `https://placehold.co/100x100/e2e8f0/1e293b?text=${item.name.replace(' ', '+')}`
        });
      });
      alert("All ingredients added to cart!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-xl">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 flex items-center gap-3">
          <span>🤖</span> AI Personal Shopper
        </h1>
        <p className="text-indigo-700/80 mb-8">
          Tell me what you want to cook, and I'll generate a recipe and build your shopping list with the freshest farm ingredients!
        </p>

        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'I want to make a healthy pasta sauce'"
            className="flex-1 px-6 py-4 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {response && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50">
            <p className="text-lg font-medium text-gray-800 mb-6">{response.message}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-indigo-900 mb-4 border-b pb-2">🛒 Ingredients Needed</h3>
                <ul className="space-y-3 mb-6">
                  {response.ingredients.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-green-600 font-bold">₹{item.price}/{item.unit}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={addAllToCart} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors">
                  Add All to Cart
                </button>
              </div>
              
              <div>
                <h3 className="font-bold text-indigo-900 mb-4 border-b pb-2">👨‍🍳 AI Recipe</h3>
                <div className="bg-orange-50 text-orange-900 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line">
                  {response.recipe}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/" className="text-indigo-600 font-medium hover:underline">
          &larr; Back to Market
        </Link>
      </div>
    </div>
  );
}
