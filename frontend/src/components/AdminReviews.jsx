import React, { useState, useEffect, useContext } from 'react';
import { Star, MessageSquare, Package, AlertCircle, RefreshCw, Trash2, X } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);      // which review is being deleted (spinner)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // which review is awaiting confirmation
    const { user } = useContext(AuthContext);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reviewsRes, productsRes] = await Promise.all([
                fetch('/api/reviews', {
                    headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
                }),
                fetch('/api/products')
            ]);

            if (reviewsRes.ok && productsRes.ok) {
                const reviewsData = await reviewsRes.json();
                const productsData = await productsRes.json();
                setReviews(reviewsData);
                setProducts(productsData);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ---- Delete handler (no window.confirm) ----
    const handleDeleteReview = async (reviewId) => {
        setDeletingId(reviewId);
        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast.success('Review deleted successfully');
                setConfirmDeleteId(null);
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    // Helper to get product details
    const getProductInfo = (review) => {
        if (review.productId && typeof review.productId === 'object') {
            return review.productId;
        }

        const liveProduct = products.find(p => p._id === review.productId);
        if (liveProduct) return liveProduct;

        const legacyMockProduct = mockProducts.find(p => p.id === review.productId || String(p._id) === String(review.productId));
        return legacyMockProduct || { name: 'Deleted Product', image: null };
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Customer Ratings & Feedback</h2>
                <button
                    onClick={fetchData}
                    className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-medium">Refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-[var(--color-text-muted)] animate-pulse">
                    Loading customer feedback...
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-[var(--color-surface)] border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">No Reviews Yet</h3>
                    <p className="text-[var(--color-text-muted)]">When customers submit feedback, it will appear here.</p>
                </div>
            ) : (
                <div className="bg-[var(--color-surface)] border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Rating</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Customer Feedback</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                                {reviews.map((review) => {
                                    const product = getProductInfo(review);
                                    const isConfirming = confirmDeleteId === review._id;
                                    const isDeleting = deletingId === review._id;
                                    return (
                                        <tr key={review._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                        {product.image ? (
                                                            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-[var(--color-text-main)] max-w-[200px] truncate" title={product.name}>
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-[var(--color-text-muted)]">ID: {product._id || review.productId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-1 items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current drop-shadow-sm' : 'text-slate-200 dark:text-slate-700'}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 font-bold text-[var(--color-text-main)] text-sm">{review.rating}/5</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-[var(--color-text-main)] max-w-sm">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                                        {review.user?.name || 'Anonymous'}:
                                                    </span>
                                                    <span className="italic text-slate-600 dark:text-slate-400 block break-words whitespace-pre-wrap">
                                                        "{review.comment}"
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                                <div className="text-xs mt-1">{new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {isConfirming ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-xs text-red-500 font-semibold mr-1">Sure?</span>
                                                        <button
                                                            type="button"
                                                            disabled={isDeleting}
                                                            onClick={() => handleDeleteReview(review._id)}
                                                            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
                                                        >
                                                            {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(review._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-600 rounded-lg transition-colors font-semibold text-xs border border-red-200 dark:border-red-800 hover:border-transparent"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
