import { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Minus, Plus, X, Package, CheckCircle, Truck, Clock, AlertCircle, Star, Inbox, RotateCcw } from 'lucide-react';
import { OrderSkeleton, EmptyState } from '../components/Skeletons';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';


const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myOrders, setMyOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [confirmingId, setConfirmingId] = useState(null);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    const fetchMyOrders = useCallback(() => {
        if (user) {
            console.log(`[DEBUG FRONTEND] Fetching orders for ${user.email}. Token present: ${!!user.token}`);
            setLoadingOrders(true);
            fetch(`/api/orders/myorders?email=${encodeURIComponent(user.email || '')}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            })
                .then(res => {
                    console.log(`[DEBUG FRONTEND] Response status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    console.log(`[DEBUG FRONTEND] Orders received:`, data);
                    setMyOrders(Array.isArray(data) ? data : []);
                })
                .catch(err => {
                    console.error('[DEBUG FRONTEND] Order fetch error:', err);
                    toast.error('Failed to load orders. Please check your connection.');
                })
                .finally(() => setLoadingOrders(false));
        } else {
            console.log('[DEBUG FRONTEND] User not logged in, skipping order fetch.');
        }
    }, [user]);

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    const handleNotReceived = async (orderId) => {
        // Immediate feedback
        toast.loading('Notifying admin...', { id: 'not-received-toast' });
        console.log("Starting handleNotReceived for:", orderId);

        setConfirmingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/not-received`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ reason: "User reported not received via dashboard" })
            });

            if (res.ok) {
                toast.success('Report submitted. Admin has been notified.', { id: 'not-received-toast' });
                // Close modal ONLY on success
                setSelectedOrderDetails(null);
                fetchMyOrders();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(`Error: ${err.message || 'Unknown error'}`);
                fetchMyOrders();
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error. Please try again.');
        } finally {
            setConfirmingId(null);
        }
    };

    const handleConfirmReceived = async (orderId) => {
        const orderToReview = myOrders.find(o => o._id === orderId);
        
        setConfirmingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/received`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });

            if (res.ok) {
                toast.success('Order confirmed!');
                if (orderToReview) {
                    setReviewOrder(orderToReview);
                }
                // Close modal ONLY on success
                setSelectedOrderDetails(null);
                fetchMyOrders();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(`Could not confirm receipt: ${err.message || 'Unknown error'}`);
                fetchMyOrders();
            }
        } catch (err) {
            console.error('Network error confirming receipt:', err);
            toast.error('Network error. Please check your connection and try again.');
            fetchMyOrders();
        } finally {
            setConfirmingId(null);
        }
    };

    const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = cartItems.length > 0 ? 200 : 0;
    const discountAmount = (user?.isStudentVerified) ? rawSubtotal * 0.15 : 0;
    const subtotal = rawSubtotal - discountAmount;

    // Active = in progress (not received AND not rejected) OR refund requested/approved
    const activeOrders = myOrders
        .filter(o => !o.isReceivedByUser && o.paymentStatus !== 'rejected' || (o.refundStatus && o.refundStatus !== 'none' && o.refundStatus !== 'rejected'))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // History = received OR rejected, newest first
    const historyOrders = myOrders
        .filter(o => o.isReceivedByUser || o.paymentStatus === 'rejected')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const getStatusBadge = (order) => {
        if (order.refundStatus === 'requested') return (
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-md text-xs">
                <RotateCcw className="w-3 h-3 animate-spin-slow" /> Refund Requested
            </span>
        );
        if (order.refundStatus === 'approved') return (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-md text-xs">
                <CheckCircle className="w-3 h-3" /> Refunded
            </span>
        );
        if (order.refundStatus === 'rejected') return (
            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs">
                <X className="w-3 h-3" /> Refund Rejected
            </span>
        );
        if (order.paymentStatus === 'rejected') return (
            <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 font-semibold bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-md text-xs">
                <AlertCircle className="w-3 h-3" /> Payment Rejected
            </span>
        );
        if (order.notReceivedCount > 0 && !order.isShipped) return (
            <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-md text-xs border border-red-100 dark:border-red-900/30 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Reported Missing
            </span>
        );
        if (order.isShipped) return (
            <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 font-semibold bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-md text-xs">
                <Truck className="w-3 h-3" /> Shipped
            </span>
        );
        if (order.paymentStatus === 'approved') return (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md text-xs">
                <CheckCircle className="w-3 h-3" /> Payment Verified
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 text-yellow-700 dark:text-yellow-300 font-semibold bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-md text-xs">
                <Clock className="w-3 h-3" /> Processing
            </span>
        );
    };

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-8 flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    My Cart
                </h1>

                {cartItems.length === 0 ? (
                    <EmptyState
                        icon={ShoppingBag}
                        title="Your cart is empty"
                        description="Discover our premium student essentials and start adding items to your cart."
                        action={
                            <Link to="/shop" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-8 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5">
                                Start Shopping <ArrowRight className="h-5 w-5" />
                            </Link>
                        }
                        compact
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-[var(--color-surface)] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex gap-5 items-center group hover:shadow-md transition-shadow">
                                    <Link to={`/product/${item._id}`} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm">
                                        <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item._id}`} className="font-bold text-[var(--color-text-main)] hover:text-blue-600 transition-colors line-clamp-1">{item.name}</Link>
                                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{item.category}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-[var(--color-background)] p-0.5 shrink-0">
                                        <button onClick={() => addToCart(item, item.qty - 1)} disabled={item.qty <= 1} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-50"><Minus className="h-4 w-4 text-slate-500" /></button>
                                        <span className="w-8 text-center font-semibold text-[var(--color-text-main)] text-sm">{item.qty}</span>
                                        <button onClick={() => addToCart(item, item.qty + 1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"><Plus className="h-4 w-4 text-slate-500" /></button>
                                    </div>
                                    <p className="font-bold text-[var(--color-text-main)] w-24 text-right shrink-0 hidden sm:block">{formatCurrency(item.price * item.qty)}</p>
                                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors shrink-0">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-[var(--color-surface)] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24 p-6">
                                <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-[var(--color-text-muted)]">
                                        <span>Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                                        <span className="font-medium text-[var(--color-text-main)]">{formatCurrency(rawSubtotal)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Student Discount (15%)</span>
                                            <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[var(--color-text-muted)]">
                                        <span>Shipping</span>
                                        <span className="font-medium text-[var(--color-text-main)]">{formatCurrency(shipping)}</span>
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                    <div className="flex justify-between font-bold text-lg text-[var(--color-text-main)]">
                                        <span>Total</span>
                                        <span>{formatCurrency(subtotal + shipping)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) { toast.error('Please login to checkout!'); navigate('/login'); }
                                        else { navigate('/checkout'); }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-6"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                                <div className="mt-4 text-center">
                                    <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                                        or Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Orders ── */}
                {user && (
                    <div className="mt-16 space-y-8">

                        {/* My Orders — Unified */}
                        <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 sm:px-10 py-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--color-text-main)]">My Orders</h2>
                                        <p className="text-sm text-[var(--color-text-muted)]">Track your active orders below.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 sm:px-10 py-6">
                                {loadingOrders ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => <OrderSkeleton key={i} />)}
                                    </div>
                                ) : activeOrders.length === 0 ? (
                                    <EmptyState icon={Package} title="No active orders" description="You don't have any ongoing orders at the moment. When you place a new order, it will appear here." compact />
                                ) : (
                                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-[var(--color-surface)]">
                                        <OrdersTable
                                            orders={activeOrders}
                                            onViewDetails={(order) => setSelectedOrderDetails({ order, type: 'active' })}
                                            getStatusBadge={getStatusBadge}
                                            handleNotReceived={handleNotReceived}
                                            handleConfirmReceived={handleConfirmReceived}
                                            confirmingId={confirmingId}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 sm:px-10 py-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                        <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--color-text-main)]">Order History</h2>
                                        <p className="text-sm text-[var(--color-text-muted)]">Completed and closed orders.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 sm:px-10 py-6">
                                {loadingOrders ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => <OrderSkeleton key={i} />)}
                                    </div>
                                ) : historyOrders.length === 0 ? (
                                    <EmptyState icon={Inbox} title="No order history yet" description="Completed and delivered orders will be archived here for your reference." compact />
                                ) : (
                                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-[var(--color-surface)]">
                                        <OrdersTable
                                            orders={historyOrders}
                                            onViewDetails={(order) => setSelectedOrderDetails({ order, type: 'history' })}
                                            getStatusBadge={(order) => {
                                                if (order.refundStatus && order.refundStatus !== 'none') {
                                                    if (order.refundStatus === 'requested') return (
                                                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-md text-xs">
                                                            <RotateCcw className="w-3 h-3" /> Refund Requested
                                                        </span>
                                                    );
                                                    if (order.refundStatus === 'approved') return (
                                                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md text-xs">
                                                            <CheckCircle className="w-3 h-3" /> Refunded
                                                        </span>
                                                    );
                                                    return (
                                                        <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs">
                                                            <X className="w-3 h-3" /> Refund Rejected
                                                        </span>
                                                    );
                                                }
                                                return order.paymentStatus === 'rejected' ? (
                                                    <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 font-semibold bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-md text-xs">
                                                        <AlertCircle className="w-3 h-3" /> Payment Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-md text-xs">
                                                        <CheckCircle className="w-3 h-3" /> Received
                                                    </span>
                                                );
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {reviewOrder && <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} user={user} />}

            {/* Modal for Order Details / Timeline */}
            {selectedOrderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto pt-16">
                    <div className="relative w-full max-w-3xl mt-12 bg-[var(--color-surface)] dark:bg-[#151521] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 rounded-t-2xl shrink-0">
                            <h3 className="font-bold text-lg text-[var(--color-text-main)]">Order Timeline & Details</h3>
                            <button onClick={() => setSelectedOrderDetails(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 bg-[var(--color-background)] rounded-b-2xl overflow-y-auto">
                            <UnifiedOrderCard
                                order={selectedOrderDetails.order}
                                statusBadge={selectedOrderDetails.type === 'active' || (selectedOrderDetails.order.refundStatus && selectedOrderDetails.order.refundStatus !== 'none') ? getStatusBadge(selectedOrderDetails.order) : (
                                    selectedOrderDetails.order.paymentStatus === 'rejected' ? (
                                        <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 font-semibold bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-md text-xs">
                                            <AlertCircle className="w-3 h-3" /> Payment Rejected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-md text-xs">
                                            <CheckCircle className="w-3 h-3" /> Received {selectedOrderDetails.order.receivedAt ? `on ${new Date(selectedOrderDetails.order.receivedAt).toLocaleDateString()}` : ''}
                                        </span>
                                    )
                                )}
                                faded={selectedOrderDetails.type === 'history'}
                                confirmingId={confirmingId}
                                handleConfirmReceived={handleConfirmReceived}
                                handleNotReceived={handleNotReceived}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Unified Order Card with Timeline
const UnifiedOrderCard = ({ order, statusBadge, faded = false, confirmingId, handleConfirmReceived, handleNotReceived }) => {
    const isRejected = order.paymentStatus === 'rejected';

    // Format a date as "Mar 9, 2:35 PM"
    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${date}, ${time}`;
    };

    const steps = [
        { label: 'Placed', done: true, date: order.createdAt },
        { label: 'Payment Verified', done: order.paymentStatus === 'approved', date: order.paymentVerifiedAt || order.paidAt },
        { label: 'Shipped', done: order.isShipped, date: order.shippedAt },
        { label: 'Received', done: order.isReceivedByUser, date: order.receivedAt },
    ];

    // For rejected: Placed is done, Payment shows red X, rest are grey
    const rejectedSteps = [
        { label: 'Placed', status: 'done', date: order.createdAt },
        { label: 'Payment', status: 'rejected', date: null },
        { label: 'Shipped', status: 'pending', date: null },
        { label: 'Received', status: 'pending', date: null },
    ];

    const doneCount = isRejected ? 1 : steps.filter(s => s.done).length;
    const isShippedAwaitingConfirm = order.isShipped && !order.isReceivedByUser && !isRejected;

    return (
        <div className={`bg-[var(--color-background)] border ${isRejected ? 'border-red-200 dark:border-red-900/30' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 sm:p-6 transition-opacity ${faded ? 'opacity-75 hover:opacity-100' : ''}`}>
            {/* Header */}
            <div className="flex flex-wrap gap-4 justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Order Placed</p>
                    <p className="font-medium text-[var(--color-text-main)]">{formatDateTime(order.createdAt)}</p>
                </div>
                <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Total</p>
                    <p className="font-bold text-blue-600">{formatCurrency(order.totalPrice)}</p>
                </div>
                <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Status</p>
                    <div className="mt-1">{statusBadge}</div>
                </div>
            </div>

            {/* Order Tracking Timeline */}
            <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between relative">
                    {/* Background line */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
                    {/* Progress line */}
                    <div
                        className={`absolute top-4 left-6 h-0.5 z-0 transition-all duration-700 ${isRejected ? 'bg-gradient-to-r from-emerald-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'}`}
                        style={{
                            width: `calc(${((doneCount - 1) / 3) * 100}% - 48px)`,
                        }}
                    />

                    {(isRejected ? rejectedSteps : steps).map((step, i) => {
                        const isDone = isRejected ? step.status === 'done' : step.done;
                        const isRejectedStep = isRejected && step.status === 'rejected';
                        const isAwaitingAction = !isRejected && !step.done && i === doneCount && isShippedAwaitingConfirm && i === 3;

                        return (
                            <div key={step.label} className="flex flex-col items-center z-10 relative" style={{ flex: '1 1 0%' }}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                    : isRejectedStep
                                        ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/30'
                                        : isAwaitingAction
                                            ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 text-amber-600 animate-pulse'
                                            : 'bg-[var(--color-surface)] border-slate-300 dark:border-slate-600 text-slate-400'
                                    }`}>
                                    {isDone ? '✓' : isRejectedStep ? '✗' : isAwaitingAction ? '!' : i + 1}
                                </div>
                                <span className={`text-[10px] sm:text-xs mt-1.5 text-center font-medium leading-tight ${isDone ? 'text-emerald-600 dark:text-emerald-400'
                                    : isRejectedStep ? 'text-red-600 dark:text-red-400 font-bold'
                                        : isAwaitingAction ? 'text-amber-600 dark:text-amber-400 font-bold'
                                            : 'text-slate-400 dark:text-slate-500'
                                    }`}>
                                    {step.label}
                                </span>
                                {isDone && step.date && (
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block text-center leading-tight">
                                        {formatDateTime(step.date)}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rejection reason */}
            {order.paymentRejectedReason && (
                <div className="mb-4 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 p-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span><strong>Issue:</strong> {order.paymentRejectedReason}</span>
                </div>
            )}

            {/* Order items */}
            <div className={`space-y-3 mb-4`}>
                {order.orderItems.map((item, idx) => (
                    <div key={item._id || idx} className="flex items-center gap-4">
                        <Link to={`/order/${order._id}`}>
                            <img src={getImageUrl(item.image)} alt={item.name} className={`w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 object-cover hover:scale-105 transition-transform ${faded ? 'grayscale' : ''}`} />
                        </Link>
                        <div className="flex-1">
                            <Link to={`/order/${order._id}`} className="font-medium text-[var(--color-text-main)] text-sm hover:text-blue-600 transition-colors cursor-pointer">
                                {item.name}
                            </Link>
                            <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.qty}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Order Details link */}
            <Link to={`/order/${order._id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4">
                View Order Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
                {/* Confirm Received button — only for shipped orders */}
                {isShippedAwaitingConfirm && handleConfirmReceived && (
                    <button
                        id={`confirm-btn-${order._id}`}
                        onClick={() => handleConfirmReceived(order._id)}
                        disabled={confirmingId === order._id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-md shadow-green-600/20"
                    >
                        <CheckCircle className="h-5 w-5" />
                        {confirmingId === order._id ? 'Confirming...' : 'Confirm Order Received'}
                    </button>
                )}

                {/* Not Received button — if shipped but not confirmed received */}
                {order.isShipped && !order.isReceivedByUser && !isRejected && handleNotReceived && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Not Received clicked in UnifiedOrderCard", order._id);
                            handleNotReceived(order._id);
                        }}
                        disabled={confirmingId === order._id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-600/20 relative z-10 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <AlertCircle className="h-5 w-5" />
                        {confirmingId === order._id ? 'Processing...' : 'Not Received?'}
                    </button>
                )}

                {/* Refund button — if received and no active refund */}
                {order.isReceivedByUser && (!order.refundStatus || order.refundStatus === 'none' || order.refundStatus === 'rejected') && (
                    <Link
                        to={`/order/${order._id}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-bold py-3 px-6 rounded-xl border border-amber-200 dark:border-amber-800/30 transition-all active:scale-95 shadow-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Refund / Return
                    </Link>
                )}
            </div>
        </div>
    );
};

// Interactive Review Modal
const ReviewModal = ({ order, onClose, user }) => {
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState({});

    const handleSubmit = async (item) => {
        if (!ratings[item.product]) return toast.error("Please select a star rating first.");
        setSubmitting(true);
        try {
            const res = await fetch(`/api/reviews/${item.product}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    rating: ratings[item.product],
                    comment: comments[item.product] || "Great product!"
                })
            });
            if (res.ok) {
                setSubmittedData(prev => ({ ...prev, [item.product]: true }));
                toast.success('Review submitted!');
            } else {
                const err = await res.json();
                toast.error(`Error: ${err.message}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Network error.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-[var(--color-surface)] w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 my-8 flex flex-col mt-20">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-900/10 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-400">Rate Your Experience</h3>
                    <button onClick={onClose} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-[var(--color-text-main)] font-medium">Thank you for confirming your delivery! Please take a moment to review the items you received.</p>

                    <div className="space-y-4">
                        {order.orderItems.map((item, idx) => {
                            const isSubmitted = submittedData[item.product];
                            return (
                                <div key={idx} className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700" />
                                    <div className="flex-1 w-full">
                                        <p className="font-bold text-[var(--color-text-main)] text-lg">{item.name}</p>

                                        {isSubmitted ? (
                                            <div className="mt-3 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg inline-flex border border-emerald-100 dark:border-emerald-800/30">
                                                <CheckCircle className="w-5 h-5" /> Review submitted!
                                            </div>
                                        ) : (
                                            <div className="mt-2 space-y-3">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setRatings(prev => ({ ...prev, [item.product]: star }))}
                                                            className={`transition-all hover:scale-110 ${ratings[item.product] >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-200'}`}
                                                        >
                                                            <Star className="w-7 h-7 fill-current focus:outline-none drop-shadow-sm" />
                                                        </button>
                                                    ))}
                                                </div>
                                                <textarea
                                                    placeholder="Leave a comment about this product (optional)..."
                                                    className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[var(--color-text-main)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={comments[item.product] || ''}
                                                    onChange={e => setComments(prev => ({ ...prev, [item.product]: e.target.value }))}
                                                    rows="2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {!isSubmitted && (
                                        <button
                                            onClick={() => handleSubmit(item)}
                                            disabled={submitting}
                                            className="w-full md:w-auto mt-2 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95 shrink-0 disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-semibold transition-colors">Skip for now</button>
                </div>
            </div>
        </div>
    );
};

// Extracted Orders Table view for mapping array
const OrdersTable = ({ orders, onViewDetails, getStatusBadge, handleNotReceived, handleConfirmReceived, confirmingId }) => (
    <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-[#1e2330]">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-[var(--color-surface)] dark:bg-[#151923] divide-y divide-slate-100 dark:divide-[#1e2330]">
                {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-2 border-transparent hover:border-indigo-500">
                        <td className="px-6 py-4 whitespace-nowrap">
                            {order.orderItems && order.orderItems.length > 0 ? (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                        <img src={getImageUrl(order.orderItems[0].image)} alt={order.orderItems[0].name} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--color-text-main)] truncate max-w-[150px]" title={order.orderItems[0].name}>{order.orderItems[0].name}</p>
                                        {order.orderItems.length > 1 && <p className="text-xs text-[var(--color-text-muted)]">+{order.orderItems.length - 1} more item(s)</p>}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-[var(--color-text-muted)] text-sm">Order #{order._id.substring(0, 6)}</span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                            {order.contactInfo?.name || order.user?.name || 'Missing Name'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-main)]">
                            {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5 items-start">
                                {getStatusBadge(order)}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                                {/* Refund Button: Only for received orders with no active refund process */}
                                {order.isReceivedByUser && (!order.refundStatus || order.refundStatus === 'none' || order.refundStatus === 'rejected') && (
                                    <Link
                                        to={`/order/${order._id}`}
                                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" /> Refund
                                    </Link>
                                )}
                                
                                {!!order.isShipped && !order.isReceivedByUser && (
                                    <button
                                        onClick={() => handleConfirmReceived?.(order._id)}
                                        disabled={confirmingId === order._id}
                                        className="text-white font-bold px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" /> {confirmingId === order._id ? '...' : 'Received?'}
                                    </button>
                                )}

                                {/* Not Received Button: Only for shipped orders that aren't confirmed received yet */}
                                {!!order.isShipped && !order.isReceivedByUser && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Not Received clicked in OrdersTable", order._id);
                                            handleNotReceived?.(order._id);
                                        }}
                                        disabled={confirmingId === order._id}
                                        className="text-white font-bold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 relative z-10 cursor-pointer"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <AlertCircle className="w-3.5 h-3.5" /> {confirmingId === order._id ? '...' : 'Not Received?'}
                                    </button>
                                )}

                                <button
                                    onClick={() => onViewDetails(order)}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-bold px-4 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
                                >
                                    Details
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Cart;
