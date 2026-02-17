// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";
import UserProfile from "./pages/UserProfile";
import Tracking from "./pages/Tracking";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import AddEditProduct from "./pages/admin/AddEditProduct";
import DeleteProduct from "./pages/admin/DeleteProduct";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageMessages from "./pages/admin/ManageMessages";
import ViewCustomers from "./pages/admin/ViewCustomers";
import AdminHistory from "./pages/admin/AdminHistory";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-slate-200">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* User Routes (Now Public/Optional) */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Protected User Routes */}
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/order/:id/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="/order/:id/track" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
          <Route path="/payment/success/:id" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>} />
          <Route path="/admin/product/new" element={<ProtectedRoute adminOnly><AddEditProduct /></ProtectedRoute>} />
          <Route path="/admin/product/edit/:id" element={<ProtectedRoute adminOnly><AddEditProduct /></ProtectedRoute>} />
          <Route path="/admin/product/delete/:id" element={<ProtectedRoute adminOnly><DeleteProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute adminOnly><ManageMessages /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute adminOnly><ViewCustomers /></ProtectedRoute>} />
          <Route path="/admin/history" element={<ProtectedRoute adminOnly><AdminHistory /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
