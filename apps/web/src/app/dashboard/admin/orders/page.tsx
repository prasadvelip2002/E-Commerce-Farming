'use client';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerLocation: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  fraudRiskScore?: number;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Processing: 'bg-blue-100 text-blue-800 border-blue-200',
  Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  Delivered: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_FLOW: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryProviders, setDeliveryProviders] = useState<{userId: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryProviders();
  }, []);

  const fetchDeliveryProviders = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/roles/users`);
      if (res.ok) {
        const users = await res.json();
        // Filter users who have the 'DeliveryProvider' role
        const providers = users.filter((u: any) => u.roles.includes('DeliveryProvider')).map((u: any) => ({
          userId: u.userId,
          name: u.email.split('@')[0]
        }));
        setDeliveryProviders(providers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/orders/all`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.orderId,
        customerName: o.customerName,
        customerLocation: o.customerLocation,
        items: o.items,
        totalAmount: o.totalAmount,
        orderDate: o.orderDate,
        status: o.status as OrderStatus,
        fraudRiskScore: Math.floor(Math.random() * 100), // Mocked AI Risk
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'Cancelled') return;
    
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return;
    
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  const assignDelivery = async (orderId: string, providerId: string) => {
    if (!providerId) return;
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/deliveries/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, deliveryProviderId: providerId })
      });
      if (!res.ok) throw new Error('Failed to assign delivery');
      alert('Delivery Provider assigned successfully!');
      fetchOrders();
    } catch (err) {
      alert('Failed to assign delivery provider.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Monitor consumer purchases and manage fulfillment statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">AI Risk Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-10 bg-gray-200 rounded w-full"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-28 ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-[#4A7C59]">{order.id}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{order.orderDate}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerLocation}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600 max-w-[200px]">
                      {order.items.map((item, i) => (
                        <div key={i} className="truncate">
                          <span className="font-semibold text-gray-800">{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.fraudRiskScore !== undefined && (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.fraudRiskScore > 80 ? 'bg-red-100 text-red-700 border border-red-200' :
                        order.fraudRiskScore > 50 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {order.fraudRiskScore}/100
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col justify-end items-end gap-2">
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => advanceStatus(order.id)}
                          className="text-xs font-bold bg-[#4A7C59] text-white px-3 py-1.5 rounded-lg hover:bg-[#3a6347] transition-colors shadow-sm"
                        >
                          Mark Processing
                        </button>
                      )}
                      
                      {order.status === 'Processing' && deliveryProviders.length > 0 && (
                        <div className="flex items-center gap-2">
                          <select 
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            onChange={(e) => assignDelivery(order.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Assign Provider...</option>
                            {deliveryProviders.map(p => (
                              <option key={p.userId} value={p.userId}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium flex justify-between items-center">
          <span>Showing {orders.length} total orders.</span>
        </div>
      </div>
    </div>
  );
}
