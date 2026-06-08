"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SmartSubscriptionPage() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a3a28] mb-4">
          Smart Farm Subscription
        </h1>
        <p className="text-lg text-gray-600">
          Let our AI analyze seasonal yields, dynamic prices, and your taste preferences to curate the perfect weekly box of fresh farm produce.
        </p>
      </div>

      {!subscribed ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">How it works</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg">AI Demand Matching</h3>
                  <p className="text-gray-500 text-sm mt-1">We match your budget with the highest quality seasonal crops currently available from local farmers.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg">Dynamic Pricing</h3>
                  <p className="text-gray-500 text-sm mt-1">Our AI negotiates bulk rates directly with farmers when they have surplus, passing the savings to you.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg">Doorstep Delivery</h3>
                  <p className="text-gray-500 text-sm mt-1">Fresh boxes arrive every Sunday morning.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#1a3a28] text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Most Popular</span>
              <h2 className="text-3xl font-bold mb-2">The AI Curated Box</h2>
              <div className="text-5xl font-extrabold text-emerald-400 mb-6">₹999<span className="text-lg text-emerald-500/50 font-normal">/week</span></div>
              
              <p className="text-gray-300 mb-6">
                Expect 5-7 kg of assorted premium vegetables and fruits, dynamically selected based on peak freshness.
              </p>
            </div>
            
            <button 
              onClick={() => setSubscribed(true)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#1a3a28] font-bold text-lg rounded-xl transition-all"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-50 border border-emerald-100 rounded-3xl p-12 text-center shadow-lg">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            🎉
          </div>
          <h2 className="text-3xl font-bold text-[#1a3a28] mb-4">Subscription Activated!</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Your first AI-curated Smart Box will be delivered this Sunday. We've notified local farmers to begin harvesting your order.
          </p>
          <Link href="/" className="px-8 py-3 bg-[#1a3a28] hover:bg-[#2d5c3f] text-white font-bold rounded-xl transition-colors inline-block">
            Return to Market
          </Link>
        </motion.div>
      )}
    </div>
  );
}
