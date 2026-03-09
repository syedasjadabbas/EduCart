import { useState, useEffect, useContext } from 'react';
import { Tag, Plus, CheckCircle, XCircle, Trash2, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const CouponManagementPanel = () => {
    const { user } = useContext(AuthContext);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCode, setNewCode] = useState('');
    const [newDiscount, setNewDiscount] = useState('');

    const fetchCoupons = async () => {
        try {
            if (!user || !user.token) {
                setLoading(false);
                return;
            }

            const res = await fetch('/api/coupons', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error('Coupon fetch failed:', errorData);
                toast.error(errorData.message || 'Failed to load coupons');
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
            toast.error('Connection error: Could not load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [user]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            if (!user || !user.token) {
                return toast.error('You must be logged in as an Admin to create coupons.');
            }

            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ code: newCode, discount: Number(newDiscount) })
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Server error response:', text);
                return toast.error('Server error: Received invalid data');
            }

            if (res.ok) {
                toast.success('Coupon created successfully!');
                setNewCode('');
                setNewDiscount('');
                fetchCoupons();
            } else {
                toast.error(data.message || 'Failed to create coupon');
            }
        } catch (error) {
            console.error('Coupon creation error:', error);
            toast.error('Network error: Could not connect to server');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            if (!user || !user.token) return;

            const res = await fetch(`/api/coupons/${id}/toggle`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast.success('Coupon status updated');
                fetchCoupons();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            if (!user || !user.token) return;

            const res = await fetch(`/api/coupons/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast.success('Coupon deleted');
                fetchCoupons();
            } else {
                toast.error('Failed to delete coupon');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)] animate-pulse">Loading coupons map...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Create Input block */}
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Tag className="w-32 h-32" />
                </div>

                <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-500" />
                    Create Promo Code
                </h2>

                <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Coupon Code</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. SUMMER20"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                            className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[var(--color-text-main)] font-mono focus:ring-2 focus:ring-indigo-500 outline-none uppercase placeholder:font-sans"
                        />
                    </div>
                    <div className="sm:w-48">
                        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Discount (%)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="100"
                            placeholder="e.g. 15"
                            value={newDiscount}
                            onChange={(e) => setNewDiscount(e.target.value)}
                            className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[var(--color-text-main)] focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors active:scale-95 shadow-md shadow-indigo-500/20">
                            Create Coupon
                        </button>
                    </div>
                </form>
            </div>

            {/* List Block */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-[var(--color-text-main)]">Active Promos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Code</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Discount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Created</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--color-surface)] divide-y divide-slate-100 dark:divide-slate-800">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                        No coupons have been created yet.
                                    </td>
                                </tr>
                            ) : (
                                coupons.map(coupon => (
                                    <tr key={coupon._id} className={!coupon.isActive ? 'opacity-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {coupon.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                                    <XCircle className="w-3.5 h-3.5" /> Paused
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[var(--color-text-main)]">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--color-text-main)]">
                                            {coupon.discount}% Off
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                                            {new Date(coupon.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleToggleStatus(coupon._id)}
                                                    className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                                    title={coupon.isActive ? "Pause Coupon" : "Activate Coupon"}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon._id)}
                                                    className="p-1.5 rounded bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
                                                    title="Delete Coupon"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CouponManagementPanel;
