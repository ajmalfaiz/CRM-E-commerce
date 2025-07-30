import React, { useState } from 'react';

const TABS = [
  { id: 'ready', label: 'Ready to Buy', count: 10 },
  { id: 'payment', label: 'Payment Received', count: 5 },
  { id: 'invoice', label: 'Invoice Sent', count: 8 },
  { id: 'admin', label: 'Admin Verified', count: 10 },
  { id: 'dispatched', label: 'Dispatched', count: 8 },
  { id: 'delivered', label: 'Delivered', count: 4 },
  { id: 'feedback', label: 'Feedback Collected', count: 3 },
];

const ORDERS = {
  ready: [
    { id: 'ORD12345', customer: 'Sophia Clark', product: 'Laptop', amount: '$1200', date: '2024-01-15', status: 'Ready to Buy' },
    { id: 'ORD12346', customer: 'Ethan Harris', product: 'Tablet', amount: '$300', date: '2024-01-16', status: 'Ready to Buy' },
    { id: 'ORD12347', customer: 'Olivia Turner', product: 'Smartphone', amount: '$800', date: '2024-01-17', status: 'Ready to Buy' },
    { id: 'ORD12348', customer: 'Liam Foster', product: 'Headphones', amount: '$150', date: '2024-01-18', status: 'Ready to Buy' },
    { id: 'ORD12349', customer: 'Ava Bennett', product: 'Keyboard', amount: '$75', date: '2024-01-19', status: 'Ready to Buy' },
    { id: 'ORD12350', customer: 'Noah Carter', product: 'Mouse', amount: '$25', date: '2024-01-20', status: 'Ready to Buy' },
    { id: 'ORD12351', customer: 'Isabella Reed', product: 'Monitor', amount: '$250', date: '2024-01-21', status: 'Ready to Buy' },
    { id: 'ORD12352', customer: 'Jackson Cole', product: 'Webcam', amount: '$100', date: '2024-01-22', status: 'Ready to Buy' },
    { id: 'ORD12353', customer: 'Mia Hughes', product: 'Microphone', amount: '$50', date: '2024-01-23', status: 'Ready to Buy' },
    { id: 'ORD12354', customer: 'Aiden Cooper', product: 'Speakers', amount: '$100', date: '2024-01-24', status: 'Ready to Buy' },
  ],
  payment: [
    { id: 'ORD12345', customer: 'John Wake', product: 'Laptop', amount: '$1900', date: '2024-01-15', status: 'Payment Received' },
    { id: 'ORD12346', customer: 'Julie Harris', product: 'Monitor', amount: '$300', date: '2024-01-16', status: 'Payment Received' },
    { id: 'ORD12347', customer: 'Olivia Turner', product: 'Smartphone', amount: '$800', date: '2024-01-17', status: 'Payment Received' },
    { id: 'ORD12348', customer: 'Liam Foster', product: 'Headphones', amount: '$150', date: '2024-01-18', status: 'Payment Received' },
    { id: 'ORD12349', customer: 'Neo Bennett', product: 'Keyboard', amount: '$75', date: '2024-01-19', status: 'Payment Received' },
  ],
};

const statusClass = (status) => {
  if (status === 'Ready to Buy') return 'bg-gray-100 text-gray-800';
  if (status === 'Payment Received') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

const SalesOrders = () => {
  const [activeTab, setActiveTab] = useState('ready');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales and Orders</h1>
      <div className="flex space-x-6 border-b border-gray-200 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(ORDERS[activeTab] || []).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesOrders;
