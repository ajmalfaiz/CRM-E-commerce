import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';


const Electronics = () => {
 const [user, setUser] = useState(null);
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const { addToCart } = useCart();


 useEffect(() => {
   // Check if user is logged in
   const token = localStorage.getItem('token');
   if (token) {
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       setUser(payload);
     } catch (error) {
       console.error('Error decoding token:', error);
       localStorage.removeItem('token');
     }
   }


   // Fetch products from backend
   const fetchProducts = async () => {
     try {
       setLoading(true);
       // Use the same endpoint as crm-frontend but with authentication
       const token = localStorage.getItem('token');
       const headers = token ? { Authorization: `Bearer ${token}` } : {};
       headers['x-storefront'] = 'true'; // Indicate this is a storefront request
      
       const response = await axios.get('/api/products', { headers });
       console.log('Fetched products:', response.data);
       console.log('Products count:', response.data.length);
       console.log('Sample product:', response.data[0]);
       console.log('Featured products in response:', response.data.filter(p => p.featured === true));
       console.log('API call successful, setting products...');
      
       // Set all products first
       setProducts(response.data);
      
       // Log all categories for debugging
       const categories = [...new Set(response.data.map(p => p.category))];
       console.log('All categories in response:', categories);
      
       // Filter for electronics products
       const electronicsProducts = response.data.filter(
         product => product.category && product.category.toLowerCase() === 'electronics'
       );
      
       console.log('Filtered electronics products:', electronicsProducts);
       setProducts(electronicsProducts);
     } catch (error) {
       console.error('Error fetching products:', error);
       setProducts([]);
     } finally {
       setLoading(false);
     }
   };


   fetchProducts();
 }, []);


 const handleLogout = () => {
   localStorage.removeItem('token');
   setUser(null);
 };


 // Process products for different sections
 const electronicsProducts = products.filter(
   product => product.category && product.category.toLowerCase() === 'electronics'
 );
 const featuredProducts = electronicsProducts.filter(p => p.featured === true).slice(0, 6);
 const bestSellers = electronicsProducts.slice(0, 8);
 const newArrivals = electronicsProducts.slice(-8);


 const ProductCard = ({ product }) => {
    // Ensure product has a proper ID
    const productWithId = {
      ...product,
      id: product.id || `product-${product.title || product.name}-${Math.random().toString(36).substr(2, 9)}`
    };

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
       <div className="aspect-square overflow-hidden">
         <img
           src={
             product.image
               ? (product.image.startsWith('/uploads')
                   ? product.image // Use relative path for uploaded images
                   : product.image) // Use URL directly for external images
               : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center'
           }
           alt={product.title || product.name}
           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
           onError={(e) => {
             console.log('Image failed to load:', product.image);
             e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center';
           }}
         />
       </div>
       <div className="p-4">
         <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title || product.name}</h3>
         <p className="text-xl font-bold text-blue-600">${product.price || '0.00'}</p>
         <button 
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             console.log('Adding product to cart:', productWithId);
             addToCart(productWithId);
           }}
           className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
         >
           Add to Cart
         </button>
       </div>
     </div>
   );
 };


 return (
   <div className="min-h-screen bg-gray-50">


     {/* Main Banner */}
     <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-6xl font-bold text-white mb-4">ELECTRONIC AND Accessories</h2>
         <p className="text-xl text-white mb-8">Discover the latest in technology</p>
         <button className="bg-white text-purple-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors">
           Shop Now
         </button>
       </div>
     </div>


     {/* Product Sections */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       {/* Featured Products */}
       <section className="mb-16">
         <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {products.filter(product => product.featured).map(product => (
             <ProductCard key={product._id || product.id} product={product} />
           ))}
         </div>
       </section>


       {/* Best Sellers */}
       <section className="mb-16">
         <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>
         {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
           </div>
         ) : featuredProducts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {featuredProducts.map((product) => (
               <ProductCard key={product._id || product.id} product={product} />
             ))}
             {featuredProducts.length === 0 && !loading && (
               <div className="text-center py-12 col-span-full">
                 <p className="text-gray-500">No featured electronics products found.</p>
               </div>
             )}
           </div>
         ) : (
           <div className="text-center py-12">
             <p className="text-gray-500">No electronics products found.</p>
           </div>
         )}
       </section>


       {/* Best Sellers */}
       <section className="mb-16">
         <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {bestSellers.map((product) => (
             <ProductCard key={product._id || product.id} product={product} />
           ))}
           {bestSellers.length === 0 && !loading && (
             <div className="text-center py-12 col-span-full">
               <p className="text-gray-500">No best sellers found.</p>
             </div>
           )}
         </div>
       </section>


       {/* New Arrivals */}
       <section className="mb-16">
         <h2 className="text-3xl font-bold text-gray-900 mb-8">New Arrivals</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {newArrivals.map(product => (
             <ProductCard key={product._id || product.id} product={product} />
           ))}
           {newArrivals.length === 0 && (
             <div className="text-center py-12 col-span-full">
               <p className="text-gray-500">No new arrivals found.</p>
             </div>
           )}
         </div>
       </section>
     </div>


     {/* Footer */}
     <footer className="bg-gray-800 text-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {/* About */}
           <div>
             <h3 className="text-lg font-semibold mb-4">ABOUT</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">ShopOnline Stories</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
             </ul>
           </div>


           {/* Help */}
           <div>
             <h3 className="text-lg font-semibold mb-4">HELP</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Payments</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Shipping</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Cancellation & Returns</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
             </ul>
           </div>


           {/* Consumer Policy */}
           <div>
             <h3 className="text-lg font-semibold mb-4">Consumer Policy</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Terms of Use</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Sitemap</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Grievance Redressal</a></li>
             </ul>
           </div>


           {/* Let us help You */}
           <div>
             <h3 className="text-lg font-semibold mb-4">Let us help You</h3>
             <ul className="space-y-2">
               <li><a href="#" className="text-gray-300 hover:text-white">Your Account</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Return Center</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">ShopOnline App Download</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">100% Purchase Protection</a></li>
               <li><a href="#" className="text-gray-300 hover:text-white">Recalls and Product Safety Alert</a></li>
             </ul>
           </div>
         </div>


         {/* Bottom line */}
         <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
           <p className="text-gray-300">©2025 ShopOnline. All rights reserved.</p>
           <div className="flex space-x-4 mt-4 md:mt-0">
             <a href="#" className="text-gray-300 hover:text-white">
               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
               </svg>
             </a>
             <a href="#" className="text-gray-300 hover:text-white">
               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
               </svg>
             </a>
             <a href="#" className="text-gray-300 hover:text-white">
               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
               </svg>
             </a>
           </div>
         </div>
       </div>
     </footer>
   </div>
 );
};


export default Electronics;

