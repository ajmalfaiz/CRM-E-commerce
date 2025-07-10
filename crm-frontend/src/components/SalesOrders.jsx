import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  PrinterIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  TruckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Order stages
const orderStages = [
  { id: 'ready_to_buy', title: 'Ready to Buy', icon: CurrencyDollarIcon },
  { id: 'payment_received', title: 'Payment Received', icon: CheckCircleIcon },
  { id: 'invoice_sent', title: 'Invoice Sent', icon: DocumentTextIcon },
  { id: 'admin_verified', title: 'Admin Verified', icon: ShieldCheckIcon },
  { id: 'dispatched', title: 'Dispatched', icon: TruckIcon },
  { id: 'delivered', title: 'Delivered', icon: CheckCircleIcon },
  { id: 'feedback_collected', title: 'Feedback Collected', icon: ChatBubbleLeftRightIcon },
];

// Sample data with updated statuses
const initialOrders = [
  {
    id: '124578',
    date: '2023-06-12',
    customer: 'John Doe',
    status: 'feedback_collected',
    total: 561.57,
    items: 3,
    payment: 'Credit Card',
    shipping: 'Delivered',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    products: [
      { id: 'p1', name: 'Product 1', price: 187.19, quantity: 3 }
    ]
  },
  {
    id: '124577',
    date: '2023-06-11',
    customer: 'Jane Smith',
    status: 'delivered',
    total: 129.99,
    items: 1,
    payment: 'PayPal',
    shipping: 'Shipped',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    products: [
      { id: 'p2', name: 'Product 2', price: 129.99, quantity: 1 }
    ]
  },
  {
    id: '124576',
    date: '2023-06-10',
    customer: 'Robert Johnson',
    status: 'admin_verified',
    total: 89.99,
    items: 2,
    payment: 'Credit Card',
    shipping: 'Processing',
    email: 'robert.j@example.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine St, Nowhere, USA',
    products: [
      { id: 'p3', name: 'Product 3', price: 44.99, quantity: 2 }
    ]
  },
  {
    id: '124575',
    date: '2023-06-09',
    customer: 'Emily Davis',
    status: 'Cancelled',
    total: 210.50,
    items: 4,
    payment: 'Bank Transfer',
    shipping: 'Cancelled'
  },
  {
    id: '124574',
    date: '2023-06-08',
    customer: 'Michael Brown',
    status: 'Completed',
    total: 75.25,
    items: 1,
    payment: 'Credit Card',
    shipping: 'Delivered'
  }
];

// Order details component (moved from SalesOrder.jsx)
const OrderDetails = ({ order, onBack }) => {
  if (!order) return null;

  const statusBadgeClass = {
    'Completed': 'bg-green-100 text-green-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  // Sample order data (in a real app, this would come from an API)
  const orderData = {
    orderNumber: `#${order.id}`,
    date: new Date(order.date).toLocaleDateString(),
    status: order.status,
    customer: {
      name: order.customer,
      email: `${order.customer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '+1 234 567 890',
      address: '123 Main St, New York, NY 10001',
      shippingAddress: '123 Main St, New York, NY 10001'
    },
    items: [
      {
        id: 1,
        product: 'Sample Product 1',
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        price: order.total * 0.7,
        quantity: 1,
        total: order.total * 0.7,
        image: 'https://via.placeholder.com/80'
      },
      {
        id: 2,
        product: 'Sample Product 2',
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        price: order.total * 0.3,
        quantity: 1,
        total: order.total * 0.3,
        image: 'https://via.placeholder.com/80/0000FF/FFFFFF?text=Product'
      }
    ],
    subtotal: order.total * 0.9,
    shipping: 0.00,
    tax: order.total * 0.1,
    total: order.total,
    paymentMethod: `${order.payment} (ending in 4242)`
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order {orderData.orderNumber}</h1>
              <p className="text-sm text-gray-500">
                {orderData.date} • 
                <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass[orderData.status]}`}>
                  {orderData.status}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Update Status
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Email
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Customer</h2>
              </div>
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {orderData.customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{orderData.customer.name}</h3>
                    <p className="text-sm text-gray-500">{orderData.customer.email}</p>
                    <p className="text-sm text-gray-500">{orderData.customer.phone}</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    View Profile
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Billing Address</h4>
                    <p className="text-sm text-gray-900">{orderData.customer.address}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-900">{orderData.customer.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-md" src={item.image} alt={item.product} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.product}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Shipping</span>
                  <span>${orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tax</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Number</span>
                  <span className="font-medium">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span>{orderData.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusBadgeClass[orderData.status]}`}>
                    {orderData.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span>{orderData.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Customer Note */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Customer Note</h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600">Please deliver after 5 PM. Leave at the front door if no one is home.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Draggable Order Card
const OrderCard = ({ order, onViewOrder, onStatusChange }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ORDER',
    item: { id: order.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => onViewOrder(order)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900">#{order.id}</h3>
        <span className="text-xs text-gray-500">
          {new Date(order.date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">{order.customer}</p>
      <p className="text-xs text-gray-500 mb-2">{order.items} item{order.items > 1 ? 's' : ''}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {order.payment}
        </span>
      </div>
    </div>
  );
};

// Drop Zone for Order Stages
const DropZone = ({ status, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ORDER',
    drop: (item) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`h-full min-h-[500px] ${isOver ? 'bg-blue-50' : 'bg-gray-50'}`}
    >
      {children}
    </div>
  );
};

// Orders Kanban Board
const OrdersKanban = ({ orders, onViewOrder, onStatusChange }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Order Flow</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {orderStages.map((stage) => {
          const stageOrders = orders.filter(order => order.status === stage.id);
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Icon className="h-4 w-4 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">{stage.title}</h3>
                  <span className="ml-auto bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stageOrders.length}
                  </span>
                </div>
              </div>
              <DropZone status={stage.id} onDrop={onStatusChange}>
                <div className="p-2">
                  {stageOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onViewOrder={onViewOrder}
                    />
                  ))}
                  {stageOrders.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No orders in this stage
                    </div>
                  )}
                </div>
              </DropZone>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Orders list component (table view - kept as fallback)
const OrdersList = ({ orders, onViewOrder }) => {

  const statusBadgeClass = {
    'Completed': 'bg-green-100 text-green-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const currentItems = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Sales & Orders</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Processing</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              id="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>All Time</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              id="customer"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>All Customers</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Robert Johnson</option>
              <option>Emily Davis</option>
              <option>Michael Brown</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Order
                    {sortConfig.key === 'id' && (
                      sortConfig.direction === 'asc' ? 
                      <ArrowUpIcon className="ml-1 h-3 w-3" /> : 
                      <ArrowDownIcon className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'asc' ? 
                      <ArrowUpIcon className="ml-1 h-3 w-3" /> : 
                      <ArrowDownIcon className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center justify-end">
                    Total
                    {sortConfig.key === 'total' && (
                      sortConfig.direction === 'asc' ? 
                      <ArrowUpIcon className="ml-1 h-3 w-3" /> : 
                      <ArrowDownIcon className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    <button 
                      onClick={() => onViewOrder(order)}
                      className="hover:underline"
                    >
                      #{order.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusBadgeClass[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, sortedOrders.length)}
                </span>{' '}
                of <span className="font-medium">{sortedOrders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const SalesOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {selectedOrder ? (
        <OrderDetails 
          order={selectedOrder} 
          onBack={handleBackToList} 
        />
      ) : viewMode === 'kanban' ? (
        <OrdersKanban 
          orders={orders} 
          onViewOrder={handleViewOrder}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <OrdersList 
          orders={orders} 
          onViewOrder={handleViewOrder} 
        />
      )}
    </DndProvider>
  );
};

export default SalesOrders;
