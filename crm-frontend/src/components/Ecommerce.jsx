import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  TagIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Sample product data
const sampleProducts = [
  {
    id: 1,
    title: 'Wireless Earbuds Pro',
    price: 129.99,
    description: 'High-quality wireless earbuds with noise cancellation and 24-hour battery life.',
    category: 'electronics',
    stock: 45,
    featured: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2023-06-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Premium Cotton T-Shirt',
    price: 29.99,
    description: 'Comfortable cotton t-shirt available in multiple colors and sizes.',
    category: 'clothing',
    stock: 120,
    featured: false,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2023-06-20T14:15:00Z'
  },
  {
    id: 3,
    title: 'Stainless Steel Water Bottle',
    price: 24.95,
    description: 'Keep your drinks hot or cold for hours with this durable stainless steel water bottle.',
    category: 'home',
    stock: 0,
    featured: true,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2023-06-10T09:45:00Z'
  },
  {
    id: 4,
    title: 'Wireless Charging Pad',
    price: 39.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'electronics',
    stock: 32,
    featured: false,
    image: 'https://images.unsplash.com/photo-1587033411394-98a59a93e5a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2023-06-18T16:20:00Z'
  }
];

// Product List Component
const ProductList = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    // Default: featured first, then by name
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
            <option value="beauty">Beauty</option>
          </select>
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setSortBy('featured');
            }}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <li key={product.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={product.image || 'https://via.placeholder.com/150'}
                      alt={product.title}
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.title}
                      {product.featured && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <StarIcon className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 focus:outline-none"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 focus:outline-none"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Main Ecommerce Component
const Ecommerce = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(sampleProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsAddingProduct(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsAddingProduct(false);
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p));
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        createdAt: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
    }
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">E-commerce Manager</h1>
        {activeTab === 'products' && !isAddingProduct && (
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`${activeTab === 'products' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Product List
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`${activeTab === 'add' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Add New Product
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${activeTab === 'categories' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Category Management
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`${activeTab === 'payment' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Payment Gateway Setup
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`${activeTab === 'invoice' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Auto-invoice Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'products' && (
          <ProductList 
            products={products} 
            onEdit={handleEditProduct} 
            onDelete={handleDeleteProduct} 
          />
        )}
        
        {activeTab === 'add' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
              <p className="mt-1 text-sm text-gray-500">Fill in the details below to add a new product to your store.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-500">Product form will be implemented in the next step.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Category Management</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your product categories and subcategories.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-500">Category management will be implemented in the next step.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Gateway Setup</h3>
              <p className="mt-1 text-sm text-gray-500">Configure your payment gateways and settings.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-500">Payment gateway setup will be implemented in the next step.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'invoice' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Auto-invoice Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Configure automatic invoice generation and settings.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-500">Auto-invoice settings will be implemented in the next step.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ecommerce;
