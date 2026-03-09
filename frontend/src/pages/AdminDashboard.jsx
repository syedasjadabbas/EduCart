import { useState, useContext, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, Users, ShoppingBag, X, CheckCircle, Truck, MapPin, Package, PackageCheck, Clock, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import ProductManager from '../components/ProductManager';
import RevenueDashboard from '../components/RevenueDashboard';
import AdminReviews from '../components/AdminReviews';
import StudentVerificationDashboard from '../components/StudentVerificationDashboard';
import UserManagementPanel from '../components/UserManagementPanel';
import CouponManagementPanel from '../components/CouponManagementPanel';
import { Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const initialTab = searchParams.get('tab') || 'orders';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Sync tab with URL
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSearchParams({ tab: tabName });
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleMarkShipped = async (orderId) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${orderId}/ship`, {
                method: 'PUT',
            });
            if (res.ok) {
                await fetchOrders();
                setSelectedOrder(prev => ({ ...prev, isShipped: true, shippedAt: new Date().toISOString() }));
                toast.success('Order marked as shipped!');
            }
        } catch (error) {
            console.error("Failed to ship order", error);
            toast.error('Failed to update shipping status.');
        } finally {
            setUpdating(false);
        }
    };

    // Security Gate
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const totalRevenue = orders.reduce((acc, order) => order.isPaid || true ? acc + order.totalPrice : acc, 0);

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="h-8 w-8 text-indigo-600" />
                    <h1 className="text-3xl font-extrabold text-[var(--color-text-main)]">Admin Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">Total Orders</p>
                                <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{orders.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">Processing</p>
                                <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{orders.filter(o => !o.isShipped && !o.isReceivedByUser && o.paymentStatus !== 'rejected').length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">Shipped</p>
                                <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{orders.filter(o => o.isShipped && !o.isReceivedByUser).length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <PackageCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">Received by Customer</p>
                                <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{orders.filter(o => o.isReceivedByUser).length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-6 mb-8 border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => handleTabChange('orders')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors ${activeTab === 'orders' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => handleTabChange('revenue')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors ${activeTab === 'revenue' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Revenue
                    </button>
                    <button
                        onClick={() => handleTabChange('products')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors ${activeTab === 'products' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Manage Products
                    </button>
                    <button
                        onClick={() => handleTabChange('reviews')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Customer Reviews
                    </button>
                    <button
                        onClick={() => handleTabChange('users')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        User Management
                    </button>
                    <button
                        onClick={() => handleTabChange('students')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'students' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        Student Verifications
                    </button>
                    <button
                        onClick={() => handleTabChange('coupons')}
                        className={`text-lg font-bold pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'coupons' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                    >
                        <Tag className="w-5 h-5" /> Promo Codes
                    </button>
                </div>

                {activeTab === 'revenue' ? (
                    <RevenueDashboard orders={orders} />
                ) : activeTab === 'products' ? (
                    <ProductManager />
                ) : activeTab === 'users' ? (
                    <UserManagementPanel />
                ) : activeTab === 'reviews' ? (
                    <AdminReviews />
                ) : activeTab === 'students' ? (
                    <StudentVerificationDashboard />
                ) : activeTab === 'coupons' ? (
                    <CouponManagementPanel />
                ) : (
                    <>
                        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-12">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-[var(--color-text-main)]">Recent Orders</h2>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center text-[var(--color-text-muted)]">Loading incoming orders...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[var(--color-surface)] divide-y divide-slate-100 dark:divide-slate-800">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {order.orderItems && order.orderItems.length > 0 ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                                    <img src={order.orderItems[0].image?.startsWith('http') ? order.orderItems[0].image : `http://localhost:5000${order.orderItems[0].image}`} alt={order.orderItems[0].name} className="h-full w-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-[var(--color-text-main)] truncate max-w-[150px]" title={order.orderItems[0].name}>{order.orderItems[0].name}</p>
                                                                    {order.orderItems.length > 1 && <p className="text-xs text-[var(--color-text-muted)]">+{order.orderItems.length - 1} more order item(s)</p>}
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
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)]">
                                                        {formatCurrency(order.totalPrice)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {/* Payment Status badge */}
                                                        <div className="mb-2">
                                                            {order.paymentStatus === 'approved' ? (
                                                                <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                                                    <CheckCircle className="w-3 h-3" /> Paid
                                                                </span>
                                                            ) : order.paymentStatus === 'rejected' ? (
                                                                <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                                                    <AlertCircle className="w-3 h-3" /> Rejected
                                                                </span>
                                                            ) : (
                                                                <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                                                                    <Clock className="w-3 h-3" /> Unverified
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Delivery Status badge */}
                                                        {order.isReceivedByUser ? (
                                                            <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                <CheckCircle className="w-3 h-3" /> Customer Received
                                                            </span>
                                                        ) : order.paymentStatus === 'rejected' ? (
                                                            <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                                                <AlertCircle className="w-3 h-3" /> Halted
                                                            </span>
                                                        ) : order.isShipped ? (
                                                            <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                                <Truck className="w-3 h-3" /> Shipped
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                                                                <Clock className="w-3 h-3" /> Pending Ship
                                                            </span>
                                                        )}

                                                        {/* Not Received badge */}
                                                        {order.notReceivedCount > 0 && !order.isReceivedByUser && (
                                                            <div className="mt-2">
                                                                <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 animate-pulse">
                                                                    <AlertCircle className="w-3 h-3" /> NOT RECEIVED ({order.notReceivedCount})
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold px-3 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                                        >
                                                            Manage
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">No orders found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Modal Overlay */}
                        {selectedOrder && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                                <div className="bg-[var(--color-surface)] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">

                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="text-xl font-bold text-[var(--color-text-main)]">Order Details</h3>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-6 overflow-y-auto flex-1 space-y-8">

                                        {/* Header Info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                            <div>
                                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Order ID</p>
                                                <p className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm break-all">#{selectedOrder._id}</p>
                                            </div>
                                            <div className="sm:text-center">
                                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Student Name</p>
                                                <p className="font-bold text-[var(--color-text-main)] text-base">{selectedOrder.contactInfo?.name || selectedOrder.user?.name || 'Missing Name'}</p>
                                            </div>
                                            <div className="sm:text-right">
                                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Order Date</p>
                                                <p className="font-semibold text-[var(--color-text-main)] text-base">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Address & Contact */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-3"><MapPin className="h-4 w-4 text-blue-500" /> Shipping Address</h4>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm text-[var(--color-text-muted)] space-y-1">
                                                    <p className="font-semibold text-[var(--color-text-main)]">{selectedOrder.contactInfo?.name || selectedOrder.user?.name || 'Missing Name'}</p>
                                                    <p>{selectedOrder.shippingAddress?.address || 'N/A'}</p>
                                                    <p>{selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.postalCode || 'N/A'}</p>
                                                    <p>{selectedOrder.shippingAddress?.country || 'Pakistan'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-3"><Users className="h-4 w-4 text-blue-500" /> Contact Info</h4>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm text-[var(--color-text-muted)] space-y-1">
                                                    <p>Email: <span className="text-[var(--color-text-main)] font-medium">{selectedOrder.contactInfo?.email || selectedOrder.user?.email || 'N/A'}</span></p>
                                                    <p>Phone: <span className="text-[var(--color-text-main)] font-medium">{selectedOrder.contactInfo?.phone || '+92 300 0000000'}</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Order Items ({selectedOrder.orderItems?.length})</h4>
                                            <div className="border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                                                {selectedOrder.orderItems?.map(item => (
                                                    <div key={item._id} className="flex items-center gap-4 p-3 relative">
                                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md bg-slate-100" />
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <p className="font-medium text-[var(--color-text-main)] truncate text-sm">{item.name}</p>
                                                            <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.qty}</p>
                                                        </div>
                                                        <div className="font-semibold text-[var(--color-text-main)] shrink-0">
                                                            {formatCurrency(item.price * item.qty)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Transaction Screenshot */}
                                        <div className="px-6 sm:px-8 pb-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-base font-bold text-[var(--color-text-main)] flex items-center gap-2">
                                                    <ShoppingBag className="h-4 w-4 text-indigo-500" /> Payment Proof
                                                </h3>
                                                <div className="flex gap-2">
                                                    {selectedOrder.paymentStatus !== 'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                try {
                                                                    const res = await fetch(`/api/orders/${selectedOrder._id}/approve-payment`, {
                                                                        method: 'PUT',
                                                                        headers: { Authorization: `Bearer ${user.token}` }
                                                                    });
                                                                    const data = await res.json();
                                                                    if (res.ok) {
                                                                        setOrders(orders.map(o => o._id === data._id ? data : o));
                                                                        setSelectedOrder(data);
                                                                        toast.success('Payment approved!');
                                                                    } else {
                                                                        toast.error(`Error: ${data.message || 'Failed to approve'}`);
                                                                    }
                                                                } catch (e) {
                                                                    console.error('Error approving payment', e);
                                                                    toast.error('Network error approving payment.');
                                                                }
                                                            }}
                                                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs rounded-lg hover:bg-green-200"
                                                        >
                                                            Approve Payment
                                                        </button>
                                                    )}
                                                    {selectedOrder.paymentStatus !== 'rejected' && (
                                                        <button
                                                            type="button"
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const reason = window.prompt("Enter reason for rejection:");
                                                                if (!reason) return;
                                                                try {
                                                                    const res = await fetch(`/api/orders/${selectedOrder._id}/reject-payment`, {
                                                                        method: 'PUT',
                                                                        headers: {
                                                                            Authorization: `Bearer ${user.token}`,
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                        body: JSON.stringify({ reason: reason || 'Screenshot invalid' })
                                                                    });
                                                                    const data = await res.json();
                                                                    if (res.ok) {
                                                                        setOrders(orders.map(o => o._id === data._id ? data : o));
                                                                        setSelectedOrder(data);
                                                                        toast.success('Payment rejected.');
                                                                    } else {
                                                                        toast.error(`Error: ${data.message || 'Failed to reject'}`);
                                                                    }
                                                                } catch (e) {
                                                                    console.error('Error rejecting payment', e);
                                                                    toast.error('Network error rejecting payment.');
                                                                }
                                                            }}
                                                            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-xs rounded-lg hover:bg-red-200"
                                                        >
                                                            Reject Payment
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {selectedOrder.paymentStatus === 'rejected' && selectedOrder.paymentRejectedReason && (
                                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-red-800 dark:text-red-300 text-sm">
                                                    <strong>Rejected Reason:</strong> {selectedOrder.paymentRejectedReason}
                                                </div>
                                            )}

                                            {selectedOrder.transactionScreenshot ? (
                                                <div className="space-y-4">
                                                    <p className="text-xs text-[var(--color-text-muted)]">Method: <strong className="text-[var(--color-text-main)]">{selectedOrder.paymentMethod}</strong> • Status: <strong className="uppercase">{selectedOrder.paymentStatus}</strong></p>
                                                    <a href={`http://localhost:5000${selectedOrder.transactionScreenshot}`} target="_blank" rel="noopener noreferrer" className="block max-w-sm">
                                                        <img
                                                            src={`http://localhost:5000${selectedOrder.transactionScreenshot}`}
                                                            alt="Transaction Screenshot"
                                                            className={`w-full h-auto max-h-80 rounded-xl border-4 ${selectedOrder.paymentStatus === 'approved' ? 'border-green-500' : selectedOrder.paymentStatus === 'rejected' ? 'border-red-500' : 'border-yellow-400'} object-contain cursor-zoom-in hover:opacity-90 transition-opacity shadow-sm`}
                                                        />
                                                    </a>
                                                    <p className="text-xs text-slate-400">Click image to open full size</p>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 text-sm text-[var(--color-text-muted)] border border-slate-200 dark:border-slate-700">
                                                    No screenshot uploaded — paid by <strong>{selectedOrder.paymentMethod}</strong> (Status: {selectedOrder.paymentStatus})
                                                </div>
                                            )}
                                        </div>

                                        {/* Totals */}
                                        <div className="flex justify-end pt-2 px-6 sm:px-8 pb-6">
                                            <div className="w-full sm:w-1/2 space-y-2 text-sm">
                                                <div className="flex justify-between text-[var(--color-text-muted)]">
                                                    <span>Subtotal</span>
                                                    <span>{formatCurrency(selectedOrder.itemsPrice)}</span>
                                                </div>
                                                <div className="flex justify-between text-[var(--color-text-muted)]">
                                                    <span>Shipping</span>
                                                    <span>{formatCurrency(selectedOrder.shippingPrice)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-lg text-[var(--color-text-main)] pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <span>Total Paid</span>
                                                    <span className="text-blue-600">{formatCurrency(selectedOrder.totalPrice)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3 rounded-b-2xl">
                                        {selectedOrder.isReceivedByUser ? (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <CheckCircle className="h-5 w-5" /> Customer Confirmed Delivery
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Close</button>
                                                {/* Ship button — visible when payment approved + not yet shipped */}
                                                {!selectedOrder.isShipped && selectedOrder.paymentStatus === 'approved' && (
                                                    <button
                                                        onClick={() => handleMarkShipped(selectedOrder._id)}
                                                        disabled={updating}
                                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors disabled:opacity-50"
                                                    >
                                                        <Package className="h-5 w-5" />
                                                        {updating ? 'Updating...' : 'Mark as Shipped'}
                                                    </button>
                                                )}
                                                {selectedOrder.isShipped && !selectedOrder.isReceivedByUser && (
                                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                                        <Truck className="h-5 w-5" />
                                                        Shipped on {new Date(selectedOrder.shippedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {!selectedOrder.isShipped && selectedOrder.paymentStatus !== 'approved' && (
                                                    <div className="px-5 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4" /> Approve payment first
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
