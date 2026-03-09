import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, MapPin, CreditCard, CheckCircle, Truck, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { OrderSkeleton } from '../components/Skeletons';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reporting, setReporting] = useState(false);

    const fetchOrder = async () => {
        try {
            // Artificial delay to show off beautiful skeletons for 600ms
            await new Promise(r => setTimeout(r, 600));

            const res = await fetch(`/api/orders/${id}`, {
                headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {},
            });
            if (!res.ok) throw new Error('Order not found');
            const data = await res.json();
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id, user]);

    const handleReportNotReceived = async () => {
        if (!window.confirm("Are you sure you haven't received this order? The admin will be notified and this status will be reset so they can re-ship it.")) return;

        setReporting(true);
        try {
            const res = await fetch(`/api/orders/${id}/not-received`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ reason: "User reported not received via order details page" })
            });

            if (res.ok) {
                toast.success('Report submitted. Admin has been notified.');
                fetchOrder();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(`Error: ${err.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error. Please try again.');
        } finally {
            setReporting(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${date} at ${time}`;
    };

    const getStatusInfo = (order) => {
        if (order.isReceivedByUser) return { label: 'Received', color: 'emerald', icon: CheckCircle };
        if (order.paymentStatus === 'rejected') return { label: 'Payment Rejected', color: 'red', icon: AlertCircle };
        if (order.isShipped) return { label: 'Shipped', color: 'indigo', icon: Package };
        if (order.paymentStatus === 'approved') return { label: 'Payment Verified', color: 'emerald', icon: CheckCircle };
        return { label: 'Processing', color: 'amber', icon: Clock };
    };

    if (loading) {
        return (
            <div className="bg-[var(--color-background)] min-h-screen py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <OrderSkeleton />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-[var(--color-background)] min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Order Not Found</h2>
                    <p className="text-[var(--color-text-muted)] mb-6">{error || 'This order does not exist or you do not have permission to view it.'}</p>
                    <Link to="/cart" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold transition-all">
                        <ArrowLeft className="h-5 w-5" /> Back to Cart
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order);
    const StatusIcon = statusInfo.icon;
    const isRejected = order.paymentStatus === 'rejected';

    const timelineSteps = isRejected
        ? [
            { label: 'Order Placed', done: true, date: order.createdAt, icon: ShoppingBag },
            { label: 'Payment Rejected', done: false, rejected: true, date: null, icon: AlertCircle },
            { label: 'Shipped', done: false, date: null, icon: Package },
            { label: 'Received', done: false, date: null, icon: CheckCircle },
        ]
        : [
            { label: 'Order Placed', done: true, date: order.createdAt, icon: ShoppingBag },
            { label: 'Payment Verified', done: order.paymentStatus === 'approved', date: order.paymentVerifiedAt || order.paidAt, icon: CreditCard },
            { label: 'Shipped', done: order.isShipped, date: order.shippedAt, icon: Package },
            { label: 'Received', done: order.isReceivedByUser, date: order.receivedAt, icon: CheckCircle },
        ];

    const doneCount = isRejected ? 1 : timelineSteps.filter(s => s.done).length;

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back button */}
                <Link to="/cart" className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-blue-600 font-medium mb-6 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to My Orders
                </Link>

                {/* Header */}
                <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 sm:px-10 py-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-1">Order ID</p>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-main)] break-all">#{order._id}</h1>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">Placed on {formatDateTime(order.createdAt)}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-900/30 text-${statusInfo.color}-700 dark:text-${statusInfo.color}-400 border border-${statusInfo.color}-200 dark:border-${statusInfo.color}-800/30`}
                                style={{
                                    backgroundColor: statusInfo.color === 'emerald' ? 'rgb(209 250 229)' : statusInfo.color === 'red' ? 'rgb(254 226 226)' : statusInfo.color === 'blue' ? 'rgb(219 234 254)' : statusInfo.color === 'indigo' ? 'rgb(224 231 255)' : statusInfo.color === 'amber' ? 'rgb(254 243 199)' : undefined,
                                    color: statusInfo.color === 'emerald' ? 'rgb(4 120 87)' : statusInfo.color === 'red' ? 'rgb(185 28 28)' : statusInfo.color === 'blue' ? 'rgb(29 78 216)' : statusInfo.color === 'indigo' ? 'rgb(67 56 202)' : statusInfo.color === 'amber' ? 'rgb(146 64 14)' : undefined,
                                }}
                            >
                                <StatusIcon className="h-5 w-5" />
                                {statusInfo.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {(order.isShipped || order.isDelivered) && !order.isReceivedByUser && !isRejected && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-subtle">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-amber-900 dark:text-amber-400">Parcel taking too long?</p>
                                <p className="text-sm text-amber-700 dark:text-amber-500">If you haven't received your order yet, click the button to notify the admin.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleReportNotReceived}
                            disabled={reporting}
                            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            {reporting ? 'Reporting...' : 'Report Not Received'}
                        </button>
                    </div>
                )}

                {/* ── Tracking Timeline ── */}
                <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 sm:px-10 py-5 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" /> Order Timeline
                        </h2>
                    </div>
                    <div className="px-6 sm:px-10 py-8">
                        {/* Vertical timeline for detailed view */}
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

                            <div className="space-y-0">
                                {timelineSteps.map((step, i) => {
                                    const StepIcon = step.icon;
                                    const isDone = step.done;
                                    const isRejectedStep = step.rejected;
                                    const isNext = !isDone && !isRejectedStep && i === doneCount;

                                    return (
                                        <div key={step.label} className="relative flex items-start gap-5 pb-8 last:pb-0">
                                            {/* Circle on the vertical line */}
                                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${isDone
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                : isRejectedStep
                                                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30'
                                                    : isNext
                                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-500 animate-pulse'
                                                        : 'bg-[var(--color-surface)] border-slate-300 dark:border-slate-600 text-slate-400'
                                                }`}>
                                                {isDone ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : isRejectedStep ? (
                                                    <AlertCircle className="h-5 w-5" />
                                                ) : (
                                                    <StepIcon className="h-5 w-5" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pt-1.5">
                                                <p className={`font-bold text-sm ${isDone ? 'text-emerald-700 dark:text-emerald-400'
                                                    : isRejectedStep ? 'text-red-700 dark:text-red-400'
                                                        : isNext ? 'text-blue-700 dark:text-blue-400'
                                                            : 'text-slate-400 dark:text-slate-500'
                                                    }`}>
                                                    {step.label}
                                                </p>
                                                {isDone && step.date ? (
                                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDateTime(step.date)}</p>
                                                ) : isRejectedStep ? (
                                                    <p className="text-xs text-red-500 mt-0.5">Payment could not be verified</p>
                                                ) : isNext ? (
                                                    <p className="text-xs text-blue-500 mt-0.5">Awaiting this step...</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">Pending</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rejection reason */}
                {order.paymentRejectedReason && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-5 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-red-800 dark:text-red-300">Payment Rejection Reason</p>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{order.paymentRejectedReason}</p>
                        </div>
                    </div>
                )}

                {/* ── Order Items ── */}
                <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 sm:px-10 py-5 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-blue-500" /> Items Ordered
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {order.orderItems.map((item, idx) => (
                            <div key={item._id || idx} className="px-6 sm:px-10 py-5 flex items-center gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <Link to={`/product/${item.product}`} className="shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 dark:bg-slate-800 object-cover shadow-sm hover:shadow-md transition-shadow hover:scale-105 transform"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.product}`} className="font-bold text-[var(--color-text-main)] hover:text-blue-600 transition-colors text-base sm:text-lg line-clamp-2">
                                        {item.name}
                                    </Link>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-[var(--color-text-muted)]">
                                        <span>Qty: <strong className="text-[var(--color-text-main)]">{item.qty}</strong></span>
                                        <span>Price: <strong className="text-[var(--color-text-main)]">{formatCurrency(item.price)}</strong></span>
                                        <span>Subtotal: <strong className="text-blue-600 dark:text-blue-400">{formatCurrency(item.price * item.qty)}</strong></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Order Details Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2 mb-4">
                            <MapPin className="h-5 w-5 text-blue-500" /> Shipping Address
                        </h3>
                        <div className="text-sm text-[var(--color-text-muted)] space-y-1.5">
                            {order.contactInfo?.name && <p className="font-semibold text-[var(--color-text-main)]">{order.contactInfo.name}</p>}
                            {order.contactInfo?.email && <p>{order.contactInfo.email}</p>}
                            {order.contactInfo?.phone && <p>{order.contactInfo.phone}</p>}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                <p>{order.shippingAddress?.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-blue-500" /> Payment Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <span>Payment Method</span>
                                <span className="font-medium text-[var(--color-text-main)]">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <span>Items Total</span>
                                <span className="font-medium text-[var(--color-text-main)]">
                                    {formatCurrency(order.orderItems.reduce((sum, item) => sum + item.price * item.qty, 0))}
                                </span>
                            </div>
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <span>Shipping</span>
                                <span className="font-medium text-[var(--color-text-main)]">{formatCurrency(200)}</span>
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex justify-between font-bold text-lg text-[var(--color-text-main)]">
                                <span>Total Paid</span>
                                <span className="text-blue-600">{formatCurrency(order.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Screenshot */}
                {order.transactionScreenshot && (
                    <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-6">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-blue-500" /> Payment Screenshot
                        </h3>
                        <img
                            src={`http://localhost:5000${order.transactionScreenshot}`}
                            alt="Transaction Screenshot"
                            className="max-w-sm w-full rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderDetail;
