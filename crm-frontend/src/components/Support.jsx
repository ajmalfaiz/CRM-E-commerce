import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Support = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('support');

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'tickets') {
      setActiveTab('tickets');
    } else {
      setActiveTab('support');
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'tickets') {
      setSearchParams({ tab: 'tickets' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Center</h1>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('support')}
            className={`${
              activeTab === 'support'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Support
          </button>
          <button
            onClick={() => handleTabChange('tickets')}
            className={`${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Tickets
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'support' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Support</h2>
            <p className="mb-4">Welcome to the Support Center. How can we help you today?</p>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600 mt-2">Find answers to common questions in our knowledge base.</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Contact Support</h3>
                <p className="text-sm text-gray-600 mt-2">Can't find what you're looking for? Reach out to our support team.</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tickets</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Create New Ticket
              </button>
            </div>
            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">No tickets found. Create a new ticket to get started.</p>
                {/* Ticket list would go here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
