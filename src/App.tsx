
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/shop/ProductsPage";
import ProductDetail from "./pages/shop/ProductDetail";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";
import OrderSuccess from "./pages/shop/OrderSuccess";
import Orders from "./pages/dashboard/Orders";
import OrderDetail from "./pages/dashboard/OrderDetail";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Categories from "./pages/admin/Categories";
import Coupons from "./pages/admin/Coupons";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CategoryPage from "./pages/shop/CategoryPage";
import Wishlist from "./pages/dashboard/Wishlist";
import Addresses from "./pages/dashboard/Addresses";
import PaymentMethods from "./pages/dashboard/PaymentMethods";
import Settings from "./pages/dashboard/Settings";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";
import ShippingPolicy from "./pages/policies/ShippingPolicy";
import ReturnPolicy from "./pages/policies/ReturnPolicy";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminContactSubmissions from "./pages/admin/ContactSubmissions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<ProductsPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
              
              {/* Policy Pages */}
              <Route path="/policies/privacy" element={<PrivacyPolicy />} />
              <Route path="/policies/terms" element={<TermsConditions />} />
              <Route path="/policies/shipping" element={<ShippingPolicy />} />
              <Route path="/policies/returns" element={<ReturnPolicy />} />

              {/* Protected User Routes */}
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/order-success/:id" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
              <Route path="/dashboard/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/dashboard/order/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
              <Route path="/dashboard/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
              <Route path="/dashboard/addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
              <Route path="/dashboard/payment-methods" element={<PrivateRoute><PaymentMethods /></PrivateRoute>} />
              <Route path="/dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
              <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><Coupons /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
              <Route path="/admin/subscribers" element={<AdminRoute><AdminSubscribers /></AdminRoute>} />
              <Route path="/admin/contact-submissions" element={<AdminRoute><AdminContactSubmissions /></AdminRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
