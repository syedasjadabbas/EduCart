import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import VerifyStudent from './pages/VerifyStudent';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import StudentDiscount from './pages/StudentDiscount';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import OrderDetail from './pages/OrderDetail';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <BackToTop />
            <Toaster position="bottom-right" toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white',
              style: { borderRadius: '16px', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
              success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
              error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
            }} />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-16 flex flex-col">
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/categories" element={<Shop />} />
                    <Route path="/deals" element={<Shop />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/verify" element={<VerifyStudent />} />
                    <Route path="/admin/orders" element={<AdminDashboard />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/student-discount" element={<StudentDiscount />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                  </Routes>
                </PageTransition>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
