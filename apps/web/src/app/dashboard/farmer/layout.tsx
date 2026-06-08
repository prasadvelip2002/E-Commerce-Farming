import Link from 'next/link';
import { Leaf, Wheat, PackageOpen, Sparkles, FileText } from 'lucide-react';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen bg-[#F4F1EA] text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#3E2723] text-white flex flex-col flex-shrink-0">
        <div className="p-4 md:p-6 hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight text-[#E8F5E9] flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[#81C784]" />
            Agri<span className="text-[#81C784]">Mart</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Farmer Portal</p>
        </div>
        <nav className="flex flex-row md:flex-col overflow-x-auto px-2 md:px-4 py-2 md:py-0 md:space-y-2 md:mt-4 gap-2 md:gap-0 no-scrollbar whitespace-nowrap">
          <Link href="/dashboard/farmer/products" className="flex items-center gap-3 px-4 py-3 bg-[#4E342E] rounded-xl font-medium text-white transition-colors">
            <Wheat className="w-5 h-5" /> My Crops
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-[#4E342E]/50 transition-colors">
            <PackageOpen className="w-5 h-5" /> Orders
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-[#4E342E]/50 transition-colors">
            <Sparkles className="w-5 h-5" /> AI Insights
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-[#4E342E]/50 transition-colors">
            <FileText className="w-5 h-5" /> KYC Status
          </a>
        </nav>
        <div className="p-4 border-t border-[#4E342E] hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5D4037] flex items-center justify-center font-bold">R</div>
            <div>
              <p className="text-sm font-semibold text-white">Ramesh Farms</p>
              <p className="text-xs text-green-400">Verified</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
