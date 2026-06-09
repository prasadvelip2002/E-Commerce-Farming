'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import Link from 'next/link';

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
  stockQuantity?: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  
  // Image state
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState(0);
  
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState('');
  const [backupImageUrl, setBackupImageUrl] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const p = await res.json();
        
        const mappedProduct: Product = {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.finalPrice > 0 ? p.finalPrice : p.basePrice,
          unit: p.unitOfMeasure || 'kg',
          category: p.category,
          farmer: p.farmerName.split('@')[0],
          primaryImageUrl: p.primaryImageUrl,
          farmLocation: p.farmLocation,
          soilType: p.soilType,
          stockQuantity: p.stockQuantity,
        };
        
        setProduct(mappedProduct);
        
        // Setup image URLs
        const formattedName = mappedProduct.name.trim().charAt(0).toUpperCase() + mappedProduct.name.trim().slice(1).toLowerCase();
        const aiSearchName = formattedName.toLowerCase().replace("drum stick", "moringa vegetable").replace("drumstick", "moringa vegetable").replace("apple", "apple fruit");
        const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiSearchName + " " + (mappedProduct.category || 'vegetable') + " raw vegetable fruit agricultural crop field harvest")}?width=800&height=600&nologo=true&seed=${mappedProduct.id}`;
        const backupUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(aiSearchName + " " + mappedProduct.category)}&w=800&h=600&c=7&rs=1&p=0`;
        
        setAiGeneratedImageUrl(aiUrl);
        setBackupImageUrl(backupUrl);
        setImgSrc(mappedProduct.primaryImageUrl || aiUrl);
        
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ 
      productId: product.id, 
      name: product.name, 
      price: product.price, 
      quantity: 1, 
      imageUrl: imgSrc 
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (loading) {
    return <div className="min-h-screen pt-28 pb-20 flex justify-center items-center"><p className="text-xl font-semibold text-gray-500">Loading product details...</p></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/" className="text-[#4A7C59] font-bold hover:underline">← Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-gray-500 font-semibold hover:text-[#4A7C59] mb-8 inline-block transition-colors">
          ← Back to Marketplace
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[400px] flex items-center justify-center">
              {!imgError ? (
                <img 
                  src={imgSrc} 
                  alt={product.name} 
                  className="w-full h-full object-cover absolute inset-0" 
                  onError={() => {
                    if (fallbackLevel === 0) {
                      setImgSrc(backupImageUrl);
                      setFallbackLevel(1);
                    } else if (fallbackLevel === 1) {
                      setImgSrc(`https://placehold.co/800x600/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`);
                      setFallbackLevel(2);
                      setImgError(true);
                    }
                  }}
                />
              ) : (
                <img src={imgSrc} alt={product.name} className="w-full h-full object-cover absolute inset-0" />
              )}
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    unit: product.unit,
                    category: product.category,
                    farmer: product.farmer
                  });
                }}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-md z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${wishlistItems.some(i => i.productId === product.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} viewBox="0 0 24 24" stroke="currentColor" fill={wishlistItems.some(i => i.productId === product.id) ? "currentColor" : "none"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            {/* Right Column: Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A7C59] bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    {product.category}
                  </span>
                  {product.stockQuantity !== undefined && product.stockQuantity > 0 ? (
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Out of Stock
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-[#4A7C59]">₹{product.price.toFixed(2)}</span>
                  <span className="text-xl text-gray-500 font-medium">/ {product.unit}</span>
                </div>
                
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "Fresh, high-quality produce sourced directly from verified farmers."}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Farmer</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">👨‍🌾 {product.farmer}</p>
                    </div>
                    {(product.farmLocation || product.soilType) && (
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Origin</p>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          📍 {product.farmLocation || 'India'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                    isAdded
                      ? 'bg-green-500 text-white scale-[0.98]'
                      : product.stockQuantity === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {isAdded ? '✓ Added to Cart!' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                  <span>🛡️ Secure payment</span>
                  <span>•</span>
                  <span>🌱 Fresh guarantee</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
