'use client';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  farmer: string;
  badge?: string;
  primaryImageUrl?: string;
  farmLocation?: string;
  soilType?: string;
}

const BADGE_COLORS: Record<string, string> = {
  Organic: 'bg-green-100 text-green-800',
  Premium: 'bg-amber-100 text-amber-800',
  'GI Tagged': 'bg-blue-100 text-blue-800',
  'High Curcumin': 'bg-yellow-100 text-yellow-800',
};

const ProductCard = ({ product, isAdded, onAddToCart }: { product: Product, isAdded: boolean, onAddToCart: (p: Product, imgUrl: string) => void }) => {
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();

  // Normalize the name so "apple" and "Apple" generate the same consistent image.
  const formattedName = product.name.trim().charAt(0).toUpperCase() + product.name.trim().slice(1).toLowerCase();
  
  const aiSearchName = formattedName.toLowerCase().replace("drum stick", "moringa vegetable").replace("drumstick", "moringa vegetable").replace("apple", "apple fruit");

  // Primary AI Image Generator
  const aiGeneratedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiSearchName + " " + (product.category || 'vegetable') + " raw vegetable fruit agricultural crop field harvest")}?width=800&height=600&nologo=true&seed=${product.id}`;

  // Highly reliable fallback image search
  const backupImageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(aiSearchName + " " + product.category)}&w=400&h=300&c=7&rs=1&p=0`;

  const [imgSrc, setImgSrc] = useState(product.primaryImageUrl || aiGeneratedImageUrl);
  const [imgError, setImgError] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/products/${product.id}`} className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer block h-full relative">
      <div className="bg-gradient-to-br from-green-50/50 to-emerald-100/50 h-28 md:h-40 flex items-center justify-center text-6xl select-none relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => {
              if (fallbackLevel === 0) {
                setImgSrc(backupImageUrl);
                setFallbackLevel(1);
              } else if (fallbackLevel === 1) {
                setImgSrc(`https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`);
                setFallbackLevel(2);
                setImgError(true);
              }
            }}
          />
        ) : (
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
        )}

        {/* Heart Icon Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              productId: product.id,
              name: product.name,
              price: product.price,
              unit: product.unit,
              category: product.category,
              farmer: product.farmer
            });
          }}
          className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-sm hover:scale-110 active:scale-95"
        >
          <Heart 
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${wishlistItems.some(i => i.productId === product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
            strokeWidth={2}
          />
        </button>
      </div>
      <div className="p-3 md:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1 mb-1 flex-col sm:flex-row">
          <h3 className="font-bold text-gray-800 text-sm md:text-lg leading-tight line-clamp-1">{product.name}</h3>
          {product.badge && (
            <span className={`text-[9px] md:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${BADGE_COLORS[product.badge] ?? 'bg-gray-100 text-gray-600'}`}>
              {product.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[#6D4C41] font-bold mb-1">by {product.farmer}</p>

        {(product.farmLocation || product.soilType) && (
          <p className="text-[10px] text-gray-500 font-semibold mb-2 uppercase tracking-wide flex items-center gap-1.5">
            {product.farmLocation && <span>📍 {product.farmLocation}</span>}
            {(product.farmLocation && product.soilType) && <span>•</span>}
            {product.soilType && <span>🌍 {product.soilType} Soil</span>}
          </p>
        )}

        <p className="text-gray-500 text-[11px] md:text-sm leading-relaxed flex-1 line-clamp-2 mt-1">{product.description}</p>
        <div className="flex items-center justify-between mt-2 md:mt-4 flex-wrap gap-2">
          <div>
            <span className="text-lg md:text-2xl font-bold text-[#4A7C59]">₹{product.price}</span>
            <span className="text-gray-400 text-xs md:text-sm ml-1">/{product.unit}</span>
          </div>
          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product, imgSrc);
            }}
            className={`px-2 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all w-full sm:w-auto ${isAdded
                ? 'bg-green-500 text-white scale-95'
                : 'bg-[#4A7C59] hover:bg-[#3a6347] text-white hover:scale-105'
              }`}
          >
            {isAdded ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
    </motion.div>
  );
};

export default function Home() {
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const [products, setProducts] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommended = async (userId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153';
      const res = await fetch(`${baseUrl}/api/products/recommended?customerId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.recommendations) {
          setRecommended(data.recommendations.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: data.reasoning,
            price: p.price,
            unit: 'kg',
            category: p.category,
            farmer: 'AI Preferred Farm',
            badge: 'AI Pick'
          })));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153';
      const res = await fetch(`${baseUrl}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedProducts: Product[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.finalPrice > 0 ? p.finalPrice : p.basePrice,
        unit: p.unitOfMeasure || 'kg',
        category: p.category,
        farmer: p.farmerName.split('@')[0], // Mocking farmer display name from email
        primaryImageUrl: p.primaryImageUrl,
        farmLocation: p.farmLocation,
        soilType: p.soilType,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    fetchProducts();
    fetchRecommended(user?.id || 'guest');

    // Read category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      setActiveCategory(catParam);
    }
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: Product, imageUrl: string) => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, imageUrl });
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(product.id); return s; }), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-[#1a3a28] via-[#2d5c3f] to-[#4A7C59] rounded-xl md:rounded-3xl p-6 md:p-12 mb-6 md:mb-10 overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/20 to-transparent"></div>
        
        <div className="relative z-10 md:max-w-xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4"
          >
            Direct from Farm
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-[1.1] tracking-tight"
          >
            Fresh. Verified.<br className="hidden md:block"/> Delivered.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-green-50/80 max-w-lg text-sm md:text-lg leading-relaxed mb-6 md:mb-8"
          >
            Shop directly from 5,000+ verified Indian farmers. No middlemen. Best prices guaranteed.
          </motion.p>
          {mounted && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-[#1a3a28] font-bold px-5 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base hover:bg-emerald-50 hover:scale-105 transition-all shadow-[0_8px_30px_rgb(255,255,255,0.12)]"
              >
                Join AgriMart <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute right-[-20px] bottom-[-20px] text-8xl md:right-4 md:top-1/2 md:-translate-y-1/2 md:text-[200px] opacity-[0.07] select-none"
        >
          🌾
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === cat
                ? 'bg-[#4A7C59] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#4A7C59] hover:text-[#4A7C59]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AI Recommended Section */}
      {recommended.length > 0 && activeCategory === 'All' && (
        <div className="mb-12">
          <h3 className="text-2xl font-extrabold text-[#1a3a28] mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">✨ Recommended for You</span>
          </h3>
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {recommended.map(product => {
              const isAdded = addedIds.has(product.id);
              return <ProductCard key={product.id} product={product} isAdded={isAdded} onAddToCart={handleAddToCart} />;
            })}
          </motion.div>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-80 animate-pulse flex flex-col">
              <div className="bg-gray-200 h-36"></div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
        >
          {filtered.map(product => {
            const isAdded = addedIds.has(product.id);
            return (
              <ProductCard key={product.id} product={product} isAdded={isAdded} onAddToCart={handleAddToCart} />
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
