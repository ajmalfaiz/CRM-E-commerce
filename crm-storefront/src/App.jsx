import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Electronics from './components/Electronics';
import Clothing from './components/Clothing';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import SearchResults from './pages/SearchResults';
import Header from './components/Header';


// Layout component for pages with header
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">{children}</main>
  </div>
);

// Pages that should include the header
const routesWithHeader = [
  { path: "/", element: <HomePage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/electronics", element: <Electronics /> },
  { path: "/clothing", element: <Clothing /> },
  { path: "/new-arrivals", element: <NewArrivals /> },
  { path: "/best-sellers", element: <BestSellers /> },
  { path: "/search", element: <SearchResults /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/wishlist", element: <WishlistPage /> },
];

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
      <Router>
        <Routes>
          {/* Routes without header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes with header */}
          {routesWithHeader.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Layout>{route.element}</Layout>}
            />
          ))}
        </Routes>
      </Router>
      </WishlistProvider>
    </CartProvider>
  );
}


export default App;














