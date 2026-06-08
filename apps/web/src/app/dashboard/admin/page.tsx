'use client';
import Link from 'next/link';

const STATS = [
  { label: 'Total Revenue',     value: '₹12,48,350',  change: '+18.2%', up: true,  icon: '💰', color: 'from-green-500 to-emerald-600' },
  { label: 'Active Orders',     value: '1,284',        change: '+5.4%',  up: true,  icon: '📦', color: 'from-blue-500 to-blue-700' },
  { label: 'Verified Farmers',  value: '847',          change: '+23',    up: true,  icon: '👨‍🌾', color: 'from-amber-500 to-orange-600' },
  { label: 'Pending Approvals', value: '36',           change: '-12',    up: false, icon: '⏳', color: 'from-rose-500 to-red-600' },
];

const RECENT_ORDERS = [
  { id: 'ORD-7841', customer: 'Priya Sharma',   product: 'Organic Tomatoes',  amount: '₹2,490', status: 'Delivered', statusColor: 'bg-green-100 text-green-800' },
  { id: 'ORD-7840', customer: 'Raj Malhotra',   product: 'Basmati Rice 50kg', amount: '₹4,750', status: 'Shipped',   statusColor: 'bg-blue-100 text-blue-800' },
  { id: 'ORD-7839', customer: 'Meena Iyer',     product: 'Alphonso Mangoes',  amount: '₹1,200', status: 'Processing',statusColor: 'bg-yellow-100 text-yellow-800' },
  { id: 'ORD-7838', customer: 'Arjun Patel',    product: 'Wheat Grains 100kg',amount: '₹8,500', status: 'Pending',   statusColor: 'bg-gray-100 text-gray-700' },
  { id: 'ORD-7837', customer: 'Sunita Nair',    product: 'Turmeric Powder',   amount: '₹960',   status: 'Delivered', statusColor: 'bg-green-100 text-green-800' },
];

const TOP_FARMERS = [
  { name: 'Ramesh Farms',    location: 'Nashik, MH',   sales: '₹1,24,500', products: 12, verified: true },
  { name: 'Singh & Sons',    location: 'Bhopal, MP',   sales: '₹98,200',  products: 8,  verified: true },
  { name: 'Konkan Orchards', location: 'Ratnagiri, MH',sales: '₹87,600',  products: 5,  verified: true },
  { name: 'Devi Agro',       location: 'Pune, MH',     sales: '₹65,400',  products: 15, verified: true },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening on AgriMart today.</p>
      </div>

      {/* AI Smart Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div>
          <h3 className="text-blue-900 font-bold mb-1">AI Recommendation: Margin Adjustment</h3>
          <p className="text-sm text-blue-800">
            The AI engine predicts a 20% shortage in <span className="font-bold">Tomato</span> supply next week due to heavy rains in Nashik. 
            We recommend increasing the max profit cap to <span className="font-bold cursor-pointer underline">18%</span> to optimize revenue.
          </p>
        </div>
        <button className="ml-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors">
          Apply AI Pricing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-white/20' : 'bg-black/20'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-white/80 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders + Farmers Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link href="/dashboard/admin/orders" className="text-sm text-[#4A7C59] font-semibold hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Farmers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Top Farmers</h2>
            <Link href="/dashboard/admin/approvals" className="text-sm text-[#4A7C59] font-semibold hover:underline">Approvals →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_FARMERS.map((farmer, i) => (
              <div key={farmer.name} className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A7C59] to-[#2d5c3f] flex items-center justify-center text-white font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-gray-800 truncate">{farmer.name}</p>
                    {farmer.verified && <span className="text-blue-500 text-sm">✓</span>}
                  </div>
                  <p className="text-xs text-gray-500">{farmer.location} · {farmer.products} products</p>
                </div>
                <p className="text-sm font-bold text-[#4A7C59] flex-shrink-0">{farmer.sales}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
