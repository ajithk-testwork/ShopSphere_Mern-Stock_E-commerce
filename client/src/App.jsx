import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import About from "./pages/About";

import Dashboard from "./Admin/pages/Dashboard";
import AdminLogin from "./Admin/components/AdminLogin";
import { AuthProvider } from "./Admin/context/AuthContext";
import AdminRoute from "./Admin/components/AdminRoute";
import AdminLayout from "./Admin/layouts/AdminLayout";
import AdminProducts from "./Admin/pages/AdminProducts";
import AddProductFlow from "./Admin/pages/AddProductFlow";

import SubCategoryProducts from "./components/SubCategoryProducts";
import ScrollToTop from "./utils/ScrollToTop";

import ShippingAddress from "./components/ShippingAddress";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";

function AppContent() {
  const location = useLocation();

  // ✅ Routes where Navbar/Footer should be hidden
  const hiddenRoutes = [
    "/cart",
    "/shipping",
    "/payment",
    "/payment-success",
    "/payment-cancel",
    "/admin",
  ];

  const hideLayout = hiddenRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {/* ✅ Navbar */}
      {!hideLayout && <Navbar />}

      <ScrollToTop />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sub-category" element={<SubCategoryProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />

        {/* Checkout */}
        <Route path="/shipping" element={<ShippingAddress />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProductFlow />} />
          <Route path="admin-products" element={<AdminProducts />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ✅ Footer */}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;