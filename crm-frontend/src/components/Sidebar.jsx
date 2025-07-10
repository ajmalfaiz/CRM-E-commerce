import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: '🧲 Leads', href: '/leads', icon: null },
    { name: '🤖 AI Center', href: '/ai-center', icon: null },
    { name: '🛒 E-commerce', href: '/ecommerce', icon: null },
    { name: '📦 Sales & Orders', href: '/sales-orders', icon: null },
    { name: '🛠️ Support & Tickets', href: '/support', icon: null },
    { name: '⚙️ Automation Settings', href: '/automation-settings', icon: null },
    { name: '📊 Dashboard', href: '/dashboard', icon: null },
  ];

  return (
    <div className="fixed left-0 top-0 h-full bg-gray-900 text-white w-64 p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-md mr-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Ecom CRM</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon ? <item.icon className="h-5 w-5 mr-3" /> : null}
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <button className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
