import { useState, useContext, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, Users, ShoppingBag, X, CheckCircle, Truck, MapPin, Package, PackageCheck, Clock, XCircle, AlertCircle, ArrowRight, Download, RotateCcw, TrendingUp, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import ProductManager from '../components/ProductManager';
import RevenueDashboard from '../components/RevenueDashboard';
import AdminReviews from '../components/AdminReviews';
import StudentVerificationDashboard from '../components/StudentVerificationDashboard';
import UserManagementPanel from '../components/UserManagementPanel';
import CouponManagementPanel from '../components/CouponManagementPanel';
import { Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';
import { fetchApi } from '../utils/api';


const AdminDashboard = () => {
    const { user, authLoading } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const initialTab = searchParams.get('tab') || 'orders';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [refundAdminNote, setRefundAdminNote] = useState('');
    const [paymentRejectReason, setPaymentRejectReason] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

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

    useEffect(() => {
        setRefundAdminNote('');
        setPaymentRejectReason('');
    }, [selectedOrder]);

    const fetchOrders = async () => {
        try {
            const res = await fetchApi('/api/orders', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
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

    const handleExportExcel = async () => {
        const loadingToast = toast.loading('Exporting to Excel...');
        try {
            const res = await fetchApi('/api/orders', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();

            // Create Style-rich HTML for Excel
            let tableContent = `
                <table border="1" style="border-collapse: collapse; font-family: sans-serif;">
                    <tr style="background-color: #10b981; color: #ffffff; font-weight: bold;">
                        <th style="padding: 10px; border: 1px solid #ccc;">Order ID</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Customer</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Email</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Date</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Amount</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Payment</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Shipping</th>
                        <th style="padding: 10px; border: 1px solid #ccc;">Items</th>
                    </tr>
            `;

            data.forEach(o => {
                const itemsList = o.orderItems.map(i => `${i.name} (x${i.qty})`).join(', ');
                tableContent += `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ccc;">${o._id}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${o.contactInfo?.name || o.user?.name || 'N/A'}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${o.contactInfo?.email || o.user?.email || 'N/A'}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${new Date(o.createdAt).toLocaleDateString()}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${o.totalPrice}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${o.paymentStatus}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${o.isShipped ? 'Shipped' : 'Pending'}</td>
                        <td style="padding: 8px; border: 1px solid #ccc;">${itemsList}</td>
                    </tr>
                `;
            });
            tableContent += `</table>`;

            const excelTemplate = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>EduCart Orders</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
                <body>${tableContent}</body></html>
            `;

            const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
            const url = window.URL.createObjectURL(blob);
            const fileName = `EduCart_Orders_${new Date().toISOString().split('T')[0]}.xls`;
            
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(downloadLink);
            }, 500);
            
            toast.success('Excel file exported!', { id: loadingToast });
        } catch (error) {
            console.error('Export Error:', error);
            toast.error('Failed to export. Please try again.', { id: loadingToast });
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchOrders();
        }
    }, [user, authLoading]);

    const handleMarkShipped = async (orderId) => {
        setUpdating(true);
        try {
            const res = await fetchApi(`/api/orders/${orderId}/ship`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
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

    const handleReship = async (orderId) => {
        setUpdating(true);
        try {
            const res = await fetchApi(`/api/orders/${orderId}/reship`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(orders.map(o => o._id === data._id ? data : o));
                setSelectedOrder(data);
                toast.success('Order re-shipped successfully!');
            } else {
                toast.error('Failed to re-ship order.');
            }
        } catch (error) {
            console.error("Failed to reship order", error);
            toast.error('Network error while re-shipping.');
        } finally {
            setUpdating(false);
        }
    };

    // Security Gate
    if (authLoading) return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Verifying authorization...</p>
            </div>
        </div>
    );
    
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {/* Total Revenue */}
                    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border border-blue-500/20">
                                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(orders.filter(o => o.paymentStatus === 'approved').reduce((acc, o) => acc + o.totalPrice, 0))}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Pending Payments */}
                    <div 
                        onClick={() => {
                            handleTabChange('orders');
                            setStatusFilter('payment');
                        }}
                        className={`cursor-pointer p-6 rounded-2xl shadow-xl border transition-all hover:scale-[1.02] backdrop-blur-xl ${statusFilter === 'payment' && activeTab === 'orders' ? 'bg-amber-500/20 border-amber-500/40 ring-2 ring-amber-500/20' : 'bg-white/60 dark:bg-slate-900/40 border-white/20 dark:border-slate-700/30'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl border border-amber-500/20">
                                <CreditCard className={`h-6 w-6 ${orders.filter(o => o.paymentStatus === 'pending').length > 0 ? 'text-amber-600 animate-pulse' : 'text-amber-400'}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${statusFilter === 'payment' && activeTab === 'orders' ? 'text-amber-900 dark:text-amber-200' : 'text-slate-500 dark:text-slate-400'}`}>Awaiting Payment</p>
                                <h3 className={`text-2xl font-bold ${statusFilter === 'payment' && activeTab === 'orders' ? 'text-amber-900 dark:text-amber-200' : 'text-slate-900 dark:text-white'}`}>
                                    {orders.filter(o => o.paymentStatus === 'pending').length}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div 
                        onClick={() => {
                            handleTabChange('orders');
                            setStatusFilter('all');
                        }}
                        className={`cursor-pointer p-6 rounded-2xl shadow-xl border transition-all hover:scale-[1.02] backdrop-blur-xl ${statusFilter === 'all' && activeTab === 'orders' ? 'bg-blue-500/20 border-blue-500/40 ring-2 ring-blue-500/20' : 'bg-white/60 dark:bg-slate-900/40 border-white/20 dark:border-slate-700/30'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl border border-blue-500/20">
                                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${statusFilter === 'all' && activeTab === 'orders' ? 'text-blue-900 dark:text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>Total Orders</p>
                                <h3 className={`text-2xl font-bold ${statusFilter === 'all' && activeTab === 'orders' ? 'text-blue-900 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>{orders.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Active Issues (Refunds + Missing) */}
                    <div 
                        onClick={() => {
                            handleTabChange('orders');
                            setStatusFilter('issue');
                        }}
                        className={`cursor-pointer p-6 rounded-2xl shadow-xl border transition-all hover:scale-[1.02] backdrop-blur-xl ${statusFilter === 'issue' && activeTab === 'orders' ? 'bg-red-500/20 border-red-500/40 ring-2 ring-red-500/20' : 'bg-white/60 dark:bg-slate-900/40 border-white/20 dark:border-slate-700/30'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-xl border border-red-500/20">
                                <AlertCircle className={`h-6 w-6 ${orders.filter(o => ((o.notReceivedCount > 0 && !o.isShipped) || o.refundStatus === 'requested') && !o.isReceivedByUser).length > 0 ? 'text-red-600 animate-pulse' : 'text-red-400'}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${statusFilter === 'issue' && activeTab === 'orders' ? 'text-red-900 dark:text-red-200' : 'text-slate-500 dark:text-slate-400'}`}>Active Issues</p>
                                <h3 className={`text-2xl font-bold ${statusFilter === 'issue' && activeTab === 'orders' ? 'text-red-900 dark:text-red-200' : 'text-slate-900 dark:text-white'}`}>
                                    {orders.filter(o => ((o.notReceivedCount > 0 && !o.isShipped) || o.refundStatus === 'requested') && !o.isReceivedByUser).length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation — scrollable on mobile */}
                <div className="flex gap-4 sm:gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar pb-px">
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
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-bold text-[var(--color-text-main)]">Recent Orders</h2>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setStatusFilter('all')}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${statusFilter === 'all' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            All
                                        </button>
                                        <button 
                                            onClick={() => setStatusFilter('payment')}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${statusFilter === 'payment' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10'}`}
                                        >
                                            Review Payments {orders.filter(o => o.paymentStatus === 'pending').length > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
                                        </button>

                                        <button 
                                            onClick={() => setStatusFilter('refund')}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${statusFilter === 'refund' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}
                                        >
                                            Refunds {orders.filter(o => o.refundStatus === 'requested').length > 0 && <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                                        </button>
                                        <button 
                                            onClick={() => setStatusFilter('issue')}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${statusFilter === 'issue' ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'}`}
                                        >
                                            Reports {orders.filter(o => o.notReceivedCount > 0 && !o.isShipped).length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse font-bold" />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleExportExcel}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-800/30 shadow-sm active:scale-95"
                                >
                                    <Download className="w-4 h-4" /> Export to Excel
                                </button>
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
                                            {orders
                                                .filter(o => {
                                                    if (statusFilter === 'payment') return o.paymentStatus === 'pending';
                                                    if (statusFilter === 'refund') return o.refundStatus === 'requested';
                                                    if (statusFilter === 'ship') return o.paymentStatus === 'approved' && !o.isShipped;
                                                    if (statusFilter === 'issue') return ((o.notReceivedCount > 0 && !o.isShipped) || o.refundStatus === 'requested') && !o.isReceivedByUser;
                                                    return true;
                                                })
                                                .map((order) => (
                                                <tr key={order._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${order.notReceivedCount > 0 && !order.isShipped ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {order.orderItems && order.orderItems.length > 0 ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                                    <img src={getImageUrl(order.orderItems[0].image)} alt={order.orderItems[0].name} className="h-full w-full object-cover" />
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

                                                        {/* Not Received active notification */}
                                                        {order.notReceivedCount > 0 && !order.isReceivedByUser && (
                                                            <div className="mt-2">
                                                                <button 
                                                                    onClick={() => setSelectedOrder(order)}
                                                                    className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full border shadow-sm transition-transform active:scale-95 ${!order.isShipped ? 'bg-red-100 text-red-700 border-red-200 animate-pulse cursor-pointer' : 'bg-slate-100 text-slate-600 border-slate-200 opacity-60'}`}
                                                                >
                                                                    <AlertCircle className="w-3 h-3" /> NOT RECEIVED ({order.notReceivedCount})
                                                                </button>
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
                                                        <img src={getImageUrl(item.image)} alt={item.name} className="w-12 h-12 object-cover rounded-md bg-slate-100" />
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
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    {selectedOrder.paymentStatus !== 'approved' && (
                                                        <button
                                                            type="button"
                                                            disabled={isActionLoading}
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                setIsActionLoading(true);
                                                                try {
                                                                    const res = await fetchApi(`/api/orders/${selectedOrder._id}/approve-payment`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Authorization': `Bearer ${user.token}` }
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
                                                                } finally {
                                                                    setIsActionLoading(false);
                                                                }
                                                            }}
                                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            {isActionLoading ? '...' : 'Approve Payment'}
                                                        </button>
                                                    )}
                                                    {selectedOrder.paymentStatus !== 'rejected' && (
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex gap-2">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Reason for rejection..."
                                                                    value={paymentRejectReason}
                                                                    onChange={(e) => setPaymentRejectReason(e.target.value)}
                                                                    className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[var(--color-text-main)] w-full sm:w-48"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    disabled={isActionLoading || !paymentRejectReason}
                                                                    onClick={async (e) => {
                                                                        e.preventDefault();
                                                                        setIsActionLoading(true);
                                                                        try {
                                                                            const res = await fetchApi(`/api/orders/${selectedOrder._id}/reject-payment`, {
                                                                                method: 'PUT',
                                                                                headers: {
                                                                                    Authorization: `Bearer ${user.token}`,
                                                                                    'Content-Type': 'application/json'
                                                                                },
                                                                                body: JSON.stringify({ reason: paymentRejectReason })
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
                                                                        } finally {
                                                                            setIsActionLoading(false);
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
                                                                >
                                                                    {isActionLoading ? '...' : 'Reject Payment'}
                                                                </button>
                                                            </div>
                                                        </div>
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
                                                    <a href={selectedOrder.transactionScreenshot} target="_blank" rel="noopener noreferrer" className="block max-w-sm">
                                                        <img
                                                            src={getImageUrl(selectedOrder.transactionScreenshot)}
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

                                    {/* Refund Section */}
                                    {selectedOrder.refundStatus && selectedOrder.refundStatus !== 'none' && (
                                        <div className={`mx-6 sm:mx-8 mb-4 p-4 rounded-xl border ${selectedOrder.refundStatus === 'requested' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30' : selectedOrder.refundStatus === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <RotateCcw className={`w-4 h-4 ${selectedOrder.refundStatus === 'requested' ? 'text-amber-600' : selectedOrder.refundStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`} />
                                                <span className={`text-sm font-bold ${selectedOrder.refundStatus === 'requested' ? 'text-amber-800 dark:text-amber-300' : selectedOrder.refundStatus === 'approved' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                                                    Refund {selectedOrder.refundStatus.charAt(0).toUpperCase() + selectedOrder.refundStatus.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--color-text-muted)] mb-1"><strong>Reason:</strong> {selectedOrder.refundReason}</p>
                                            {selectedOrder.refundAdminNote && <p className="text-sm text-[var(--color-text-muted)]"><strong>Admin Note:</strong> {selectedOrder.refundAdminNote}</p>}
                                            {selectedOrder.refundStatus === 'requested' && (
                                                <div className="mt-3 space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Admin note (optional)..."
                                                        value={refundAdminNote}
                                                        onChange={(e) => setRefundAdminNote(e.target.value)}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[var(--color-text-main)]"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                const note = refundAdminNote;
                                                                try {
                                                                    const res = await fetchApi(`/api/orders/${selectedOrder._id}/process-refund`, {
                                                                        method: 'PUT',
                                                                        headers: { 
                                                                            'Content-Type': 'application/json',
                                                                            'Authorization': `Bearer ${user.token}`
                                                                        },
                                                                        body: JSON.stringify({ status: 'approved', adminNote: note })
                                                                    });
                                                                    if (res.ok) { toast.success('Refund approved'); const data = await res.json(); setSelectedOrder(data); fetchOrders(); }
                                                                    else { toast.error('Failed to process refund'); }
                                                                } catch(e) { toast.error('Network error'); }
                                                            }}
                                                            className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                        >
                                                            ✅ Approve Refund
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                const note = refundAdminNote;
                                                                try {
                                                                    const res = await fetchApi(`/api/orders/${selectedOrder._id}/process-refund`, {
                                                                        method: 'PUT',
                                                                        headers: { 
                                                                            'Content-Type': 'application/json',
                                                                            'Authorization': `Bearer ${user.token}`
                                                                        },
                                                                        body: JSON.stringify({ status: 'rejected', adminNote: note })
                                                                    });
                                                                    if (res.ok) { toast.success('Refund rejected'); const data = await res.json(); setSelectedOrder(data); fetchOrders(); }
                                                                    else { toast.error('Failed to process refund'); }
                                                                } catch(e) { toast.error('Network error'); }
                                                            }}
                                                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                        >
                                                            ❌ Reject Refund
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Not Received History */}
                                    {selectedOrder.notReceivedReports && selectedOrder.notReceivedReports.length > 0 && (
                                        <div className="mx-6 sm:mx-8 mb-4 p-4 rounded-xl border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertCircle className="w-4 h-4 text-red-600" />
                                                <span className="text-sm font-bold text-red-800 dark:text-red-400">
                                                    Delivery Issues Reported ({selectedOrder.notReceivedCount})
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {selectedOrder.notReceivedReports.map((report, idx) => (
                                                    <div key={idx} className="text-sm bg-white dark:bg-slate-900 p-3 rounded-lg border border-red-100 dark:border-red-900/20 shadow-sm">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className="font-semibold text-slate-800 dark:text-slate-200">Reported on {new Date(report.reportedAt).toLocaleString()}</p>
                                                            {report.adminAction && (
                                                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded flex items-center gap-1">
                                                                    <CheckCircle className="w-2.5 h-2.5" /> {report.adminAction}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-400 italic">"{report.reason}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Modal Actions */}
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3 rounded-b-2xl">
                                        {selectedOrder.isReceivedByUser ? (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <CheckCircle className="h-5 w-5" /> Customer Confirmed Delivery
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Close</button>
                                                {!selectedOrder.isShipped && selectedOrder.paymentStatus === 'approved' && (
                                                    <button
                                                        onClick={() => {
                                                            if (selectedOrder.notReceivedCount > 0) {
                                                                handleReship(selectedOrder._id);
                                                            } else {
                                                                handleMarkShipped(selectedOrder._id);
                                                            }
                                                        }}
                                                        disabled={updating}
                                                        className={`flex items-center gap-2 ${selectedOrder.notReceivedCount > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors disabled:opacity-50`}
                                                    >
                                                        {selectedOrder.notReceivedCount > 0 ? <RotateCcw className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                                                        {updating ? 'Updating...' : selectedOrder.notReceivedCount > 0 ? 'Ship Again' : 'Mark as Shipped'}
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
