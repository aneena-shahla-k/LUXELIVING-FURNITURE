import './App.css';
import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import AOS from 'aos';
 
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Project from './Pages/Project';
import Contact from './Pages/Contact';
import ScrollToHash from './Components/ScrollToHash';
import SignUpModal from './Components/SignUpModal/SignUpModal';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import CartPage from './Components/Cart-One/CartPage';
import Collection from './Pages/Collection';

import Chair from './Components/Collections/Collection-Category/CategoryCollection';

// 🔄 HERE: Import our new premium dynamic component instead of the old static one
import DynamicShopTheLook from './Components/Collections/ShopTheLook/DynamicShopTheLook';

// 🔄 UPDATED: Premium Shop the Decor components
import DecorPage from './Components/Collections/ShopDecor/DecorPage';
import AdminDecor from './Components/Admin/AdminDecor';

import AdminLayout from './Components/Admin/AdminLayout';
import AdminShopTheLook from './Components/Admin/AdminShopTheLook';
import AdminAddProduct from './Components/Admin/AdminAddProduct';
import AdminDecorDetail from './Components/Admin/AdminDecorDetail';
import DecorDetailPage from './Components/Collections/ShopDecor/DecorDetailPage';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminViewProducts from './Components/Admin/AdminViewProducts';
import AdminViewShopLook from './Components/Admin/AdminViewShopLook';
import AdminViewShopDecor from './Components/Admin/AdminViewShopDecor';
import AdminViewDecorDetails from './Components/Admin/AdminViewDecorDetails';
import ManageUsers from './Components/Admin/ManageUsers';
import PaymentPage from './Components/Cart-One/PaymentPage';
import OrderSuccess from './Components/Cart-One/OrderSuccess';
import ManageOrders from './Components/Admin/ManageOrders';



const ClientLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000, 
      once: false,    
    });
    AOS.refresh(); 
  }, []);

  return (
    <>
      <ScrollToHash />
      
      <Routes>
        
        {/* 1. 🟢 CLIENT ROUTES SECTION */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="project" element={<Project />} />
          <Route path="contact" element={<Contact />} />
          
          {/* 🛠️ SINGULAR ROUTES (collection/...) */}
          <Route path="collection" element={<Collection />} />
          <Route path="collection/:categoryName" element={<Chair />} />
          <Route path="collection/shop-the-look/:roomType" element={<DynamicShopTheLook />} /> 
          <Route path="decor/:slug" element={<DecorDetailPage />} />

          <Route path="collection/shop-the-decor" element={<DecorPage />} />
          <Route path="collection/shop-the-decor/:slug" element={<DecorDetailPage />} />



          
          {/* 🛠️ PLURAL ROUTES (collections/...) */}
          <Route path="collections" element={<Collection />} />
          <Route path="collections/:categoryName" element={<Chair />} />
          <Route path="collections/shop-the-look/:roomType" element={<DynamicShopTheLook />} /> 
          <Route path="collections/shop-the-decor" element={<DecorPage />} />  
          <Route path="collections/shop-the-look/:roomType" element={<DynamicShopTheLook />} /> 
          <Route path="collection/shop-the-decor/:slug" element={<DecorDetailPage />} />

          
          
          {/* 🛒 Cart Page */}
<Route path="cart" element={
  <ProtectedRoute>
    <CartPage />
  </ProtectedRoute>
} />

          {/* 💳 Checkout / Payment Page (ProtectedRoute-ലേക്ക് മാറ്റി) */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />

          {/* 🎉 Order Success Page (ProtectedRoute-ലേക്ക് മാറ്റി) */}
          <Route path="order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />

          {/* Modal Route */}
          <Route path="signup-modal" element={<SignUpModal />} />
          </Route>


        {/* 2. 🟢 CORRECTED ADMIN ROUTES */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="add-product" element={<AdminAddProduct />} />
            <Route path="view-products" element={<AdminViewProducts />} />
            
            <Route path="shop-the-look" element={<AdminShopTheLook />} />
            <Route path="view-shop-the-look" element={<AdminViewShopLook />} />
            
            <Route path="shop-the-decor" element={<AdminDecor />} />
            <Route path="view-shop-the-decor" element={<AdminViewShopDecor />} />
            
            <Route path="decor-details" element={<AdminDecorDetail />}/>
            <Route path="view-decor-details" element={<AdminViewDecorDetails />} />
            
            {/* ── ユーザー MANAGE USERS ROUTE INSIDE THE LAYOUT ── */}
            <Route path="users" element={<ManageUsers />} />
            <Route path="orders" element={<ManageOrders />} />

          </Route>


      </Routes>
    </>
  );
}

export default App;