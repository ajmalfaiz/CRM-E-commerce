import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Ecommerce from './components/Ecommerce';
import SalesOrders from './components/SalesOrders';
import Support from './components/Support';
import AutomationSettings from './components/AutomationSettings';
import AICenter from './components/AICenter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="ai-center" element={<AICenter />} />
          <Route path="ecommerce" element={<Ecommerce />} />
          <Route path="sales-orders" element={<SalesOrders />} />
          <Route path="support" element={<Support />} />
          <Route path="automation-settings" element={<AutomationSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
