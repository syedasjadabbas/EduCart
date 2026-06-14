import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Chatbot from './components/Chatbot';
import AuthContext from './context/AuthContext';

// Lazy load non-homepage page components to reduce initial bundle size
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Shop = lazy(() => import('./pages/Shop'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const VerifyStudent = lazy(() => import('./pages/VerifyStudent'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Careers = lazy(() => import('./pages/Careers'));
const StudentDiscount = lazy(() => import('./pages/StudentDiscount'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

function App() {
  return (
    <HelmetProvider>
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
                  <Suspense fallback={
                    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[var(--color-background)]">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">Loading Page...</p>
                    </div>
                  }>
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
                      <Route path="/wishlist" element={<Wishlist />} />
                    </Routes>
                  </Suspense>
                </PageTransition>
              </main>
              <Footer />
              <AuthContext.Consumer>
                {({ user }) => (user && user.role !== 'admin' ? <Chatbot /> : null)}
              </AuthContext.Consumer>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
