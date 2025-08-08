import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Electronics from './components/Electronics';
import Clothing from './components/Clothing';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';


function App() {
 return (
   <Router>
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/electronics" element={<Electronics />} />
       <Route path="/clothing" element={<Clothing />} />
       <Route path="/new-arrivals" element={<NewArrivals />} />
       <Route path="/best-sellers" element={<BestSellers />} />
       <Route path="/" element={<HomePage />} />
     </Routes>
   </Router>
 );
}


export default App;














