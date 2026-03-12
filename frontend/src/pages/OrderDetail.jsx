import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, MapPin, CreditCard, CheckCircle, Truck, Clock, AlertCircle, ShoppingBag, RotateCcw } from 'lucide-react';
import { OrderSkeleton } from '../components/Skeletons';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';


const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reporting, setReporting] = useState(false);
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [submittingRefund, setSubmittingRefund] = useState(false);

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
        // Immediate feedback
        toast.loading('Notifying admin...', { id: 'not-received-toast-detail' });
        console.log("Starting handleReportNotReceived in OrderDetail for:", id);

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
                toast.success('Report submitted. Admin has been notified.', { id: 'not-received-toast-detail' });
                fetchOrder();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(`Error: ${err.message || 'Unknown error'}`);
                fetchOrder();
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error. Please try again.');
        } finally {
            setReporting(false);
        }
    };

    const handleConfirmReceived = async () => {
        setReporting(true);
        try {
            const res = await fetch(`/api/orders/${id}/received`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}` 
                },
            });

            if (res.ok) {
                toast.success('Order confirmed received!');
                fetchOrder();
                // If on details page, we might want to navigate back to cart so they see the review popup
                // but for now just refresh
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
        if (order.refundStatus === 'requested') return { label: 'Refund Requested', color: 'amber', icon: RotateCcw };
        if (order.refundStatus === 'approved') return { label: 'Refunded', color: 'emerald', icon: CheckCircle };
        if (order.notReceivedCount > 0 && !order.isShipped) return { label: 'Reported Missing', color: 'red', icon: AlertCircle };
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
                {order.isShipped && !order.isReceivedByUser && !isRejected && (
                    <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h4 className="font-bold text-[var(--color-text-main)] text-xl mb-1">Track Your Parcel 📦</h4>
                            <p className="text-sm text-[var(--color-text-muted)]">Please confirm once you receive your package, or report if it's missing.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleConfirmReceived}
                                disabled={reporting}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 active:scale-95 whitespace-nowrap"
                            >
                                {reporting ? '...' : 'Confirm Received'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Not Received button clicked in OrderDetail UI");
                                    handleReportNotReceived();
                                }}
                                disabled={reporting}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap relative z-10 cursor-pointer"
                                style={{ pointerEvents: 'auto' }}
                            >
                                {reporting ? '...' : 'Not Received?'}
                            </button>
                        </div>
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
                                <Link to={`/product/${item.slug || item.product}`} className="shrink-0">
                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 dark:bg-slate-800 object-cover shadow-sm hover:shadow-md transition-shadow hover:scale-105 transform"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.slug || item.product}`} className="font-bold text-[var(--color-text-main)] hover:text-blue-600 transition-colors text-base sm:text-lg line-clamp-2">
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
                            src={getImageUrl(order.transactionScreenshot)}
                            alt="Transaction Screenshot"
                            className="max-w-sm w-full rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                    </div>
                )}

                {/* Refund / Return Section */}
                {order.isReceivedByUser && (
                    <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
                        <div className="px-6 sm:px-10 py-5 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
                                <RotateCcw className="h-5 w-5 text-amber-500" /> Return / Refund
                            </h2>
                        </div>
                        <div className="px-6 sm:px-10 py-6">
                            {order.refundStatus === 'approved' ? (
                                <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 p-4 rounded-xl">
                                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-green-800 dark:text-green-300">Refund Approved</p>
                                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">Your refund of {formatCurrency(order.totalPrice)} has been approved and will be processed.</p>
                                        {order.refundAdminNote && <p className="text-sm text-green-600 dark:text-green-500 mt-2 italic">Admin note: "{order.refundAdminNote}"</p>}
                                    </div>
                                </div>
                            ) : order.refundStatus === 'rejected' ? (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-4 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-red-800 dark:text-red-300">Refund Rejected</p>
                                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">Your refund request was not approved.</p>
                                            {order.refundAdminNote && <p className="text-sm text-red-600 dark:text-red-500 mt-2 italic">Reason: "{order.refundAdminNote}"</p>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowRefundForm(true)}
                                        className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                                    >
                                        Request again?
                                    </button>
                                </div>
                            ) : order.refundStatus === 'requested' ? (
                                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-4 rounded-xl">
                                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                                    <div>
                                        <p className="font-bold text-amber-800 dark:text-amber-300">Refund Request Pending</p>
                                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">Your request has been submitted and is being reviewed by our team.</p>
                                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">Reason: "{order.refundReason}"</p>
                                    </div>
                                </div>
                            ) : showRefundForm ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-[var(--color-text-muted)]">Please tell us why you'd like to return this order:</p>
                                    <textarea
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        placeholder="Describe the reason for your return/refund request..."
                                        rows={3}
                                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[var(--color-background)] text-[var(--color-text-main)] focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            disabled={submittingRefund || !refundReason.trim()}
                                            onClick={async () => {
                                                setSubmittingRefund(true);
                                                try {
                                                    const res = await fetch(`/api/orders/${id}/request-refund`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                                                        body: JSON.stringify({ reason: refundReason })
                                                    });
                                                    if (res.ok) {
                                                        toast.success('Refund request submitted! We\'ll review it soon.');
                                                        setShowRefundForm(false);
                                                        fetchOrder();
                                                    } else {
                                                        const data = await res.json();
                                                        toast.error(data.message || 'Failed to submit refund request');
                                                    }
                                                } catch (err) {
                                                    toast.error('Network error. Please try again.');
                                                } finally {
                                                    setSubmittingRefund(false);
                                                }
                                            }}
                                            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            {submittingRefund ? 'Submitting...' : 'Submit Refund Request'}
                                        </button>
                                        <button
                                            onClick={() => setShowRefundForm(false)}
                                            className="px-5 py-3 font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-[var(--color-text-muted)]">Not satisfied with your order? You can request a return or refund.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowRefundForm(true)}
                                        className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-bold py-2.5 px-5 rounded-xl border border-amber-200 dark:border-amber-800/30 transition-all"
                                    >
                                        <RotateCcw className="h-4 w-4" /> Request Return/Refund
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderDetail;
