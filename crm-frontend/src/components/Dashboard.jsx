const Dashboard = () => {
  const metrics = {
    totalCustomers: 1250,
    totalOrders: 3500,
    revenue: '$250,000',
    conversionRate: '25%',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(metrics).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
          >
              <div>
                <h3 className="text-gray-500 font-semibold">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
            </div>
          ))}
        </div>
  
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">New Customer Registration</h3>
                <p className="text-sm text-gray-500">John Doe registered</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                New
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Order Placed</h3>
                <p className="text-sm text-gray-500">Order #123456</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  