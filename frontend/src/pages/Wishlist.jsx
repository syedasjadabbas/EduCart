import { useState, useEffect, useContext } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { getImageUrl } from '../utils/imageHelper';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const { user, authLoading } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await fetchApi('/api/wishlist', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlistItems(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchWishlist();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const removeFromWishlist = async (productId) => {
        try {
            const res = await fetchApi('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId })
            });

            if (res.ok) {
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
                toast.success('Removed from wishlist');
            }
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleMoveToCart = (product) => {
        addToCart(product, 1);
        removeFromWishlist(product._id);
        toast.success(`Moved ${product.name} to cart`);
    };

    if (authLoading || loading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
                    <h1 className="text-3xl font-extrabold text-[var(--color-text-main)]">Your Wishlist</h1>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-[var(--color-surface)] p-12 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <Heart className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Your wishlist is empty</h2>
                        <p className="text-[var(--color-text-muted)] mb-6">Save items you love and buy them later.</p>
                        <Link to="/shop" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((product) => (
                            <div key={product._id} className="bg-[var(--color-surface)] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900">
                                <Link to={`/product/${product._id}`} className="relative h-48 sm:h-56 bg-white overflow-hidden flex-shrink-0">
                                    <img 
                                        src={getImageUrl(product.image)} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    {product.discount > 0 && (
                                        <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm">
                                            {product.discount}% OFF
                                        </div>
                                    )}
                                </Link>
                                <div className="p-5 flex flex-col flex-1">
                                    <Link to={`/product/${product._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <h3 className="font-bold text-[var(--color-text-main)] mb-1 line-clamp-2" title={product.name}>{product.name}</h3>
                                    </Link>
                                    <div className="flex items-end gap-2 mb-4 mt-1">
                                        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                            {formatCurrency(product.price)}
                                        </span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-slate-400 line-through mb-0.5">
                                                {formatCurrency(product.oldPrice)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => handleMoveToCart(product)}
                                            className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white px-3 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                                        >
                                            <ShoppingCart className="w-4 h-4" /> Cart
                                        </button>
                                        <button 
                                            onClick={() => removeFromWishlist(product._id)}
                                            className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white px-3 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
