import axios from 'axios';
import React, { useEffect, useState } from 'react';

const STATUS_TABS = ['All', 'Completed', 'Processed', 'Returned', 'Canceled'];
const STATUS_COLORS = {
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Processed: 'bg-yellow-100 text-yellow-700',
  Returned: 'bg-red-100 text-red-700',
  Canceled: 'bg-gray-200 text-gray-700',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    // Fetch orders from backend
    axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filtered orders
  const filtered = orders.filter(order => {
    const matchesSearch =
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusTab === 'All' || order.status === statusTab;
    const matchesStatusFilter = !statusFilter || order.status === statusFilter;
    const matchesCategory = !categoryFilter || order.type === categoryFilter;
    return matchesSearch && matchesStatus && matchesStatusFilter && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Order List</h2>
      {/* Status Tabs */}
      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${statusTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search orders"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Status</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Processed">Processed</option>
          <option value="Returned">Returned</option>
          <option value="Canceled">Canceled</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Category</option>
          <option value="Online">Online</option>
          <option value="In-Store">In-Store</option>
        </select>
      </div>
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(order => (
              <tr key={order._id}>
                <td className="px-4 py-2 font-mono">#{order.orderId}</td>
                <td className="px-4 py-2">{order.product}</td>
                <td className="px-4 py-2 text-blue-600">${order.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-blue-700 underline cursor-pointer">{order.customer}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${order.type === 'Online' ? 'bg-gray-200 text-gray-900' : 'bg-blue-100 text-blue-700'}`}>{order.type}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList; 