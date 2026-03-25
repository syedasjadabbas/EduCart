import { Lock, ShieldCheck, Truck, CheckCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';
import { fetchApi } from '../utils/api';


const Checkout = () => {
    const { cartItems, emptyCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [isPlaced, setIsPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('easypaisa');
    const [screenshotFile, setScreenshotFile] = useState(null);
    const [isMockLoading, setIsMockLoading] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0); // in percentage
    const [couponError, setCouponError] = useState('');

    const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = cartItems.length > 0 ? 200 : 0;

    // First apply student discount, then apply coupon discount if valid
    const studentDiscountAmount = user?.isStudentVerified ? rawSubtotal * 0.15 : 0;
    let tempSubtotal = rawSubtotal - studentDiscountAmount;

    const couponDiscountAmount = (tempSubtotal * appliedDiscount) / 100;
    const subtotal = tempSubtotal - couponDiscountAmount;
    const total = subtotal + shipping;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (cartItems.length === 0 && !isPlaced) {
        return <Navigate to="/shop" replace />;
    }

    const handleApplyPromo = async () => {
        setCouponError('');
        if (!promoCode.trim()) return;
        try {
            const res = await fetchApi('/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ code: promoCode })
            });
            const data = await res.json();
            if (res.ok) {
                setAppliedDiscount(data.discount);
                toast.success(`Promo code applied! ${data.discount}% off.`);
            } else {
                setAppliedDiscount(0);
                setCouponError(data.message || 'Invalid promo code');
            }
        } catch (error) {
            setAppliedDiscount(0);
            setCouponError('Error verifying promo code');
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const contactInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };
        const shippingAddress = {
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: 'Pakistan'
        };

        // Build multipart form — JSON fields as strings, file as binary
        const data = new FormData();
        data.append('orderItems', JSON.stringify(cartItems.map(item => ({
            name: item.name, qty: item.qty, image: item.image,
            price: item.price, product: item._id
        }))));
        data.append('shippingAddress', JSON.stringify(shippingAddress));
        data.append('contactInfo', JSON.stringify(contactInfo));
        data.append('paymentMethod', paymentMethod);
        data.append('itemsPrice', subtotal);
        data.append('taxPrice', 0);
        data.append('shippingPrice', shipping);
        data.append('totalPrice', total);
        if (screenshotFile) {
            data.append('transactionScreenshot', screenshotFile);
        }

        try {
            const res = await fetchApi('/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    // Do NOT set Content-Type — browser sets it with boundary for FormData
                },
                body: data,
            });
            if (res.ok) {
                emptyCart();
                setIsPlaced(true);
            } else {
                const err = await res.json();
                toast.error(err.message || 'Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error. Please check your connection and try again.');
        }
    };

    const handleMockPayPal = () => {
        const form = document.getElementById('checkout-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        setIsMockLoading(true);
        toast.loading('Processing Sandbox Payment...', { id: 'mock-paypal' });
        setTimeout(() => {
            toast.dismiss('mock-paypal');
            toast.success('Sandbox Payment Successful!');
            const mockDetails = {
                id: 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                payer: {
                    email_address: 'sandbox-buyer@paypal.com'
                }
            };
            handlePayPalSuccess(mockDetails);
            setIsMockLoading(false);
        }, 1500);
    };

    const handlePayPalSuccess = async (details) => {
        const formData = new FormData(document.getElementById('checkout-form'));
        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.name, qty: item.qty, image: item.image,
                price: item.price, product: item._id
            })),
            shippingAddress: {
                address: formData.get('address'), city: formData.get('city'), postalCode: formData.get('postalCode'), country: 'Pakistan'
            },
            contactInfo: {
                name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone')
            },
            paymentMethod: 'PayPal',
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: shipping,
            totalPrice: total
        };

        try {
            const res = await fetchApi('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(orderData),
            });
            if (res.ok) {
                const createdOrder = await res.json();
                await fetchApi(`/api/orders/${createdOrder._id}/pay`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify(details),
                });
                emptyCart();
                setIsPlaced(true);
            } else {
                toast.error('Failed to create order on server.');
            }
        } catch (err) {
            toast.error('Network error during PayPal order processing.');
        }
    };

    if (isPlaced) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in-up">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-16 w-16" />
                </div>
                <h1 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-4">Order Placed Successfully!</h1>
                <p className="text-lg text-[var(--color-text-muted)] max-w-lg mb-8">
                    Your student essentials are on the way. We've sent a confirmation email with your order details.
                </p>
                <Link to="/shop" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Your cart is empty</h2>
                <Link to="/shop" className="text-blue-600 font-medium hover:underline">Go to Shop</Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Lock className="h-6 w-6 text-slate-400" />
                    <h1 className="text-2xl font-extrabold text-[var(--color-text-main)]">Secure Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-7 space-y-6">
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">

                            {/* Contact */}
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Contact Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Full Name</label>
                                        <input required name="name" type="text" className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email address</label>
                                        <input required name="email" type="email" className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none" placeholder="student@university.edu" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Phone Number</label>
                                        <input name="phone" required type="tel" className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Shipping Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Address (Dorm/Apt/Street)</label>
                                        <input name="address" required type="text" className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">City</label>
                                        <input name="city" required type="text" className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Postal Code</label>
                                        <input name="postalCode" required type="text" className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Payment</h2>
                                <div className="bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">

                                    {/* Payment Method Radios */}
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                        {/* EasyPaisa */}
                                        <label htmlFor="easypaisa" className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${paymentMethod === 'easypaisa' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'border-slate-200 dark:border-slate-700 text-[var(--color-text-muted)] hover:border-slate-300'}`}>
                                            <input type="radio" id="easypaisa" name="payment" className="sr-only" checked={paymentMethod === 'easypaisa'} onChange={() => { setPaymentMethod('easypaisa'); setScreenshotFile(null); }} />
                                            EasyPaisa
                                        </label>
                                        {/* JazzCash */}
                                        <label htmlFor="jazzcash" className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${paymentMethod === 'jazzcash' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'border-slate-200 dark:border-slate-700 text-[var(--color-text-muted)] hover:border-slate-300'}`}>
                                            <input type="radio" id="jazzcash" name="payment" className="sr-only" checked={paymentMethod === 'jazzcash'} onChange={() => { setPaymentMethod('jazzcash'); setScreenshotFile(null); }} />
                                            JazzCash
                                        </label>
                                        {/* SadaPay */}
                                        <label htmlFor="sadapay" className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${paymentMethod === 'sadapay' ? 'border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100' : 'border-slate-200 dark:border-slate-700 text-[var(--color-text-muted)] hover:border-slate-300'}`}>
                                            <input type="radio" id="sadapay" name="payment" className="sr-only" checked={paymentMethod === 'sadapay'} onChange={() => { setPaymentMethod('sadapay'); setScreenshotFile(null); }} />
                                            SadaPay
                                        </label>
                                        {/* NayaPay */}
                                        <label htmlFor="nayapay" className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${paymentMethod === 'nayapay' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' : 'border-slate-200 dark:border-slate-700 text-[var(--color-text-muted)] hover:border-slate-300'}`}>
                                            <input type="radio" id="nayapay" name="payment" className="sr-only" checked={paymentMethod === 'nayapay'} onChange={() => { setPaymentMethod('nayapay'); setScreenshotFile(null); }} />
                                            NayaPay
                                        </label>
                                        {/* Meezan Bank */}
                                        <label htmlFor="meezanbank" className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${paymentMethod === 'meezanbank' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700 text-[var(--color-text-muted)] hover:border-slate-300'}`}>
                                            <input type="radio" id="meezanbank" name="payment" className="sr-only" checked={paymentMethod === 'meezanbank'} onChange={() => { setPaymentMethod('meezanbank'); setScreenshotFile(null); }} />
                                            Meezan
                                        </label>
                                        {/* PayPal */}
                                        <label htmlFor="paypal" className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-[var(--color-text-muted)] hover:border-slate-300'}`}>
                                            <input type="radio" id="paypal" name="payment" className="sr-only" checked={paymentMethod === 'paypal'} onChange={() => { setPaymentMethod('paypal'); setScreenshotFile(null); }} />
                                            PayPal
                                        </label>
                                    </div>

                                    {/* EasyPaisa */}
                                    {paymentMethod === 'easypaisa' && (
                                        <div className="mt-4 animate-fade-in bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30 space-y-3">
                                            <p className="text-sm text-[var(--color-text-main)]">Please send your total payment to this EasyPaisa number:</p>
                                            <p className="text-2xl font-bold tracking-wider text-green-600 dark:text-green-400">03033236878</p>
                                            <p className="text-sm font-medium text-[var(--color-text-main)]">Account Name: <strong>Syed Muhammad Asjad Abbas Zaidi</strong></p>
                                            <div className="pt-1">
                                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Upload Transaction Screenshot *</label>
                                                <input required type="file" accept="image/*"
                                                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400" />
                                                {screenshotFile && <p className="text-xs text-green-600 mt-1">✅ {screenshotFile.name} selected</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* JazzCash */}
                                    {paymentMethod === 'jazzcash' && (
                                        <div className="mt-4 animate-fade-in bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-800/30 space-y-3">
                                            <p className="text-sm text-[var(--color-text-main)]">Please send your total payment to this JazzCash number:</p>
                                            <p className="text-2xl font-bold tracking-wider text-red-600 dark:text-red-400">03033236878</p>
                                            <p className="text-sm font-medium text-[var(--color-text-main)]">Account Name: <strong>Syed Muhammad Asjad Abbas Zaidi</strong></p>
                                            <div className="pt-1">
                                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Upload Transaction Screenshot *</label>
                                                <input required type="file" accept="image/*"
                                                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-400" />
                                                {screenshotFile && <p className="text-xs text-green-600 mt-1">✅ {screenshotFile.name} selected</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* SadaPay */}
                                    {paymentMethod === 'sadapay' && (
                                        <div className="mt-4 animate-fade-in bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-300 dark:border-slate-600 space-y-3">
                                            <p className="text-sm text-[var(--color-text-main)]">Please send your total payment to this SadaPay number:</p>
                                            <p className="text-2xl font-bold tracking-wider text-slate-800 dark:text-slate-100">03033236878</p>
                                            <p className="text-sm font-medium text-[var(--color-text-main)]">Account Name: <strong>Syed Muhammad Asjad Abbas Zaidi</strong></p>
                                            <div className="pt-1">
                                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Upload Transaction Screenshot *</label>
                                                <input required type="file" accept="image/*"
                                                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-slate-300" />
                                                {screenshotFile && <p className="text-xs text-green-600 mt-1">✅ {screenshotFile.name} selected</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* NayaPay */}
                                    {paymentMethod === 'nayapay' && (
                                        <div className="mt-4 animate-fade-in bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 space-y-3">
                                            <p className="text-sm text-[var(--color-text-main)]">Please send your total payment to this NayaPay number:</p>
                                            <p className="text-2xl font-bold tracking-wider text-orange-600 dark:text-orange-400">03033236878</p>
                                            <p className="text-sm font-medium text-[var(--color-text-main)]">Account Name: <strong>Syed Muhammad Asjad Abbas Zaidi</strong></p>
                                            <div className="pt-1">
                                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Upload Transaction Screenshot *</label>
                                                <input required type="file" accept="image/*"
                                                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/30 dark:file:text-orange-400" />
                                                {screenshotFile && <p className="text-xs text-green-600 mt-1">✅ {screenshotFile.name} selected</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Meezan Bank */}
                                    {paymentMethod === 'meezanbank' && (
                                        <div className="mt-4 animate-fade-in bg-teal-50 dark:bg-teal-900/10 p-4 rounded-xl border border-teal-100 dark:border-teal-800/30 space-y-3">
                                            <p className="text-sm text-[var(--color-text-main)]">Please transfer your total payment to the following Meezan Bank account:</p>
                                            <p className="text-sm font-medium text-[var(--color-text-main)]">Account Holder: <strong>SYED MUHAMMAD ASJAD ABBAS ZAIDI</strong></p>
                                            <p className="text-sm font-medium text-[var(--color-text-main)]">Branch: <strong>Meezan Bank - MAIN BR ABBOTTABAD</strong></p>
                                            <div>
                                                <p className="text-xs text-[var(--color-text-muted)] mb-0.5">Account Number</p>
                                                <p className="text-xl font-bold tracking-wider text-teal-600 dark:text-teal-400">15010108945490</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--color-text-muted)] mb-0.5">IBAN</p>
                                                <p className="text-base font-bold tracking-wider text-teal-600 dark:text-teal-400">PK79MEZN0015010108945490</p>
                                            </div>
                                            <div className="pt-1">
                                                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Upload Transaction Screenshot *</label>
                                                <input required type="file" accept="image/*"
                                                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900/30 dark:file:text-teal-400" />
                                                {screenshotFile && <p className="text-xs text-green-600 mt-1">✅ {screenshotFile.name} selected</p>}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sm:sticky sm:top-24">
                            <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                            <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.qty}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-[var(--color-text-main)] truncate">{item.name}</h3>
                                        </div>
                                        <div className="text-right shrink-0 font-medium text-[var(--color-text-main)]">
                                            {formatCurrency(item.price * item.qty)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-4 border-y border-slate-100 dark:border-slate-800 mb-6 text-sm">
                                <div className="flex justify-between text-[var(--color-text-muted)]">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[var(--color-text-main)]">{formatCurrency(rawSubtotal)}</span>
                                </div>
                                {user?.isStudentVerified && (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span>Student Discount (15%)</span>
                                        <span>-{formatCurrency(studentDiscountAmount)}</span>
                                    </div>
                                )}
                                {appliedDiscount > 0 && (
                                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-medium">
                                        <span>Promo Code ({appliedDiscount}%)</span>
                                        <span>-{formatCurrency(couponDiscountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[var(--color-text-muted)]">
                                    <span>Shipping</span>
                                    <span className="font-medium text-[var(--color-text-main)]">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                                </div>

                                {/* Promo Code Input */}
                                <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
                                    <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Have a promo code?</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            placeholder="Enter Code"
                                            className="flex-1 bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyPromo}
                                            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition active:scale-95"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                                    {appliedDiscount > 0 && <p className="text-emerald-500 text-xs mt-2 font-medium">✨ Promo Applied Successfully!</p>}
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-bold text-[var(--color-text-main)]">Total</span>
                                <span className="text-2xl font-black text-blue-600">{formatCurrency(total)}</span>
                            </div>

                            {paymentMethod === 'paypal' ? (
                                <button
                                    type="button"
                                    onClick={handleMockPayPal}
                                    disabled={isMockLoading}
                                    className="w-full py-4 px-4 bg-[#ffc439] hover:bg-[#fbd055] text-slate-800 font-extrabold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isMockLoading ? 'Processing...' : `Pay ${formatCurrency(total)} with Sandbox PayPal`}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                                >
                                    Pay {formatCurrency(total)}
                                </button>
                            )}

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                    <span>256-bit secure SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <Truck className="h-4 w-4 text-blue-500" />
                                    <span>Fast shipping tracking provided</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
