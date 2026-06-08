'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { Card, Button } from '@agri/shared-ui';
import Link from 'next/link';

export default function FarmerProductsPage() {
  const { user } = useAuthStore();

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['farmer-products', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`http://${hostname}:5153/api/products/farmer?email=${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    enabled: !!user?.email
  });

  const handleEditStock = async (productId: string, currentStock: number) => {
    const newStockStr = window.prompt('Enter new stock quantity:', currentStock.toString());
    if (newStockStr === null) return;
    
    const newStock = parseInt(newStockStr, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Invalid stock quantity');
      return;
    }

    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`http://${hostname}:5153/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock, email: user?.email })
      });
      if (!res.ok) throw new Error('Failed to update stock');
      refetch();
    } catch (err) {
      alert('Error updating stock');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Product Listings</h1>
          <p className="text-gray-500">Manage your farm's available produce and stock levels.</p>
        </div>
        <Link href="/dashboard/farmer/products/new">
          <Button variant="primary" className="shadow-lg shadow-green-900/20 px-6 py-3 font-semibold">+ List New Crop</Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading your listings...</p>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 border-dashed">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Listings</h3>
          <p className="text-gray-500 mb-6">You haven't listed any crops for sale yet.</p>
          <Link href="/dashboard/farmer/products/new">
            <Button variant="primary">Add Your First Crop</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {products.map((product: any) => (
            <Card key={product.id} title={product.name}>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Price:</span>
                  <span className="font-bold text-[#4A7C59]">₹{product.basePrice.toFixed(2)} /{product.unitOfMeasure}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock:</span>
                  <span className="font-medium text-gray-900">{product.stockQuantity} {product.unitOfMeasure}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                <Button variant="outline" className="w-full" onClick={() => handleEditStock(product.id, product.stockQuantity)}>Edit Stock</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
