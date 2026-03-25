import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ShieldCheck, Truck, ArrowLeft, Plus, Minus, Loader, Share2, Copy, CheckCircle, Heart } from 'lucide-react';
import { useState, useContext, useEffect, useRef } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/currency';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/imageHelper';
import { Helmet } from 'react-helmet-async';
import { fetchApi } from '../utils/api';

const ProductDetails = () => {
    const { id } = useParams();
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    // Image zoom state
    const imgRef = useRef(null);
    const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

    const handleMouseMove = (e) => {
        const img = imgRef.current;
        if (!img) return;
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomStyle({
            display: 'block',
            backgroundImage: `url(${product.image})`,
            backgroundSize: '250%',
            backgroundPosition: `${x}% ${y}%`,
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: product.name, text: product.description, url });
            } catch { }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const [notFound, setNotFound] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    const handleAddToWishlist = async () => {
        if (!user) {
            toast.error('Please login to manage wishlist!');
            navigate('/login');
            return;
        }
        try {
            const res = await fetchApi('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId: product._id })
            });

            if (res.ok) {
                const data = await res.json();
                setInWishlist(data.action === 'added');
                toast.success(data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    useEffect(() => {
        setPageLoading(true);
        setNotFound(false);
        Promise.all([
            fetchApi(`/api/products/${id}`).then(res => {
                if (!res.ok) throw new Error('Product not found');
                return res.json();
            }),
            fetchApi(`/api/products`).then(res => res.json()),
        ])
            .then(([prodData, allProducts]) => {
                if (!prodData || prodData.message) {
                    setNotFound(true);
                    return;
                }
                setProduct(prodData);
                if (Array.isArray(allProducts)) {
                    let related = allProducts.filter(p => p._id !== prodData._id && p.category === prodData.category).slice(0, 4);
                    if (related.length < 4) {
                        const more = allProducts.filter(p => p._id !== prodData._id && !related.map(r => r._id).includes(p._id)).slice(0, 4 - related.length);
                        related.push(...more);
                    }
                    setRelatedProducts(related);
                }

                // Fetch reviews using the actual product ID
                setReviewsLoading(true);
                fetchApi(`/api/reviews/${prodData._id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) setReviews(data);
                    })
                    .catch(err => console.error('Failed to load reviews:', err))
                    .finally(() => setReviewsLoading(false));

                if (user) {
                    fetchApi('/api/wishlist', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.products && data.products.some(p => p._id === prodData._id || p === prodData._id)) {
                            setInWishlist(true);
                        }
                    })
                    .catch(() => {});
                }
            })
            .catch(err => {
                console.error('Failed to load product:', err);
                setNotFound(true);
            })
            .finally(() => setPageLoading(false));
    }, [id]);

    const handleSubmitReview = async () => {
        if (!user) {
            toast.error('Please login to submit a review!');
            navigate('/login');
            return;
        }
        if (rating === 0) return toast.error('Please select a rating.');
        if (!comment.trim()) return toast.error('Please enter your feedback.');

        setSubmitting(true);
        try {
            const res = await fetchApi(`/api/reviews/${product._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(err.message || 'Failed to submit review.');
                return;
            }

            const newReview = await res.json();
            setReviews(prev => [newReview, ...prev]);
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error('Error submitting review. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    if (notFound) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-background)]">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Product Not Found</h2>
                <p className="text-[var(--color-text-muted)] mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
                    Browse All Products
                </Link>
            </div>
        );
    }

    if (pageLoading || !product) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)]">
                <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    const currentCartItem = cartItems.find(x => x._id === product._id);
    const existingQty = currentCartItem ? currentCartItem.qty : 0;
    const isOutOfStock = product.stock === 0;
    const stockPercent = product.stock > 0 ? Math.min(100, (product.stock / 50) * 100) : 0;

    return (
        <div className="bg-[var(--color-background)] min-h-screen py-8 sm:py-12 animate-fade-in-up">
            {product && (
                <Helmet>
                    <title>{product.seoTitle || product.name}</title>
                    <meta name="description" content={product.seoDescription || product.description?.substring(0, 150)} />
                    {(product.seoKeywords && product.seoKeywords.length > 0) && (
                        <meta name="keywords" content={product.seoKeywords.join(', ')} />
                    )}
                </Helmet>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link to="/shop" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 sm:mb-10 transition-colors group">
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to all essentials
                </Link>

                {/* Product Section */}
                <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-16 relative">
                    {product.discount > 0 && (
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg shadow-red-500/20 z-10">
                            -{product.discount}% Student Offer
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">

                        {/* Image with Zoom */}
                        <div
                            ref={imgRef}
                            className="relative h-96 md:h-full min-h-[400px] bg-slate-100 dark:bg-slate-800 cursor-crosshair overflow-hidden group"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div
                                className="absolute inset-0 z-10 pointer-events-none rounded-none"
                                style={{
                                    ...zoomStyle,
                                    backgroundRepeat: 'no-repeat',
                                }}
                            />
                            <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                ?? Hover to zoom
                            </div>
                        </div>

                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-2">
                                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                                    {product.category}
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
                                >
                                    {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                                    {copied ? 'Copied!' : 'Share'}
                                </button>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-main)] mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800/50">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span className="font-bold text-yellow-700 dark:text-yellow-400 text-sm">{avgRating}</span>
                                </div>
                                <span className="text-sm text-[var(--color-text-muted)]">
                                    ({reviews.length})
                                </span>
                            </div>

                            <div className="flex flex-col mb-6 mt-2">
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-4xl font-black text-[var(--color-text-main)]">
                                        {formatCurrency(product.price)}
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-xl text-slate-400 line-through mb-1">
                                            {formatCurrency(product.oldPrice)}
                                        </span>
                                    )}
                                </div>
                                {/* Stock Indicator */}
                                <div className="space-y-1.5">
                                    <span className={`text-sm font-semibold max-w-max px-2.5 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : product.stock > 0 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {product.stock > 10 ? `In Stock: ${product.stock}` : product.stock > 0 ? `Hurry! Only ${product.stock} left` : 'Out of Stock'}
                                    </span>
                                    {product.stock > 0 && (
                                        <div className="w-full max-w-[200px] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`}
                                                style={{ width: `${stockPercent}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-base text-[var(--color-text-muted)] leading-relaxed mb-8">
                                {product.description}
                            </p>

                            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-8"></div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] p-1 shrink-0 w-max">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="p-3 text-slate-500 hover:text-[var(--color-text-main)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                                        disabled={qty <= 1 || isOutOfStock}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <span className="w-12 text-center font-semibold text-lg text-[var(--color-text-main)]">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (existingQty + qty >= product.stock) {
                                                toast.error(`You cannot add more than ${product.stock} of this item.`);
                                            } else {
                                                setQty(qty + 1);
                                            }
                                        }}
                                        className="p-3 text-slate-500 hover:text-[var(--color-text-main)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                                        disabled={existingQty + qty >= product.stock || isOutOfStock}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            toast.error('Please login to order products!');
                                            navigate('/login');
                                            return;
                                        }
                                        if (existingQty + qty > product.stock) {
                                            toast.error(`Cannot add to cart. Only ${product.stock} total in stock.`);
                                            return;
                                        }
                                        addToCart(product, existingQty + qty);
                                        toast.success('Successfully added to cart!');
                                        navigate('/cart');
                                    }}
                                    disabled={isOutOfStock}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${isOutOfStock ? 'bg-slate-300 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'}`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className={`p-4 rounded-xl border transition-colors flex items-center justify-center shrink-0 ${inWishlist ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-900/20 dark:border-rose-900/50' : 'bg-[var(--color-background)] border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                                    title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                >
                                    <Heart className={`h-6 w-6 transition-transform hover:scale-110 active:scale-95 ${inWishlist ? 'fill-rose-500' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-background)]">
                                    <ShieldCheck className="h-6 w-6 text-green-500" />
                                    <span className="text-sm font-medium text-[var(--color-text-main)]">1 Year Student Warranty</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-background)]">
                                    <Truck className="h-6 w-6 text-blue-500" />
                                    <span className="text-sm font-medium text-[var(--color-text-main)]">Can be delivered all across Pakistan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews & Ratings Section */}
                <div className="mt-16 bg-[var(--color-surface)] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Student Ratings &amp; Reviews</h2>
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Submit Form */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Rate this product</label>
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-8 w-8 cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Your Feedback</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-[var(--color-text-main)] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-32"
                                placeholder="What did you like or dislike about this product?"
                            ></textarea>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submitting}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>

                        {/* Reviews List */}
                        <div className="flex-1 space-y-4">
                            <h3 className="text-lg font-bold text-[var(--color-text-main)] border-b border-slate-100 dark:border-slate-800 pb-2">Recent Feedback</h3>
                            {reviewsLoading ? (
                                <p className="text-[var(--color-text-muted)]">Loading reviews...</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-[var(--color-text-muted)]">No reviews yet. Be the first to review this product!</p>
                            ) : (
                                reviews.map((rev, i) => (
                                    <div key={rev._id || i} className="bg-[var(--color-background)] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-[var(--color-text-main)] text-sm">{rev.user?.name || 'Anonymous'}</span>
                                            <span className="text-xs text-[var(--color-text-muted)]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, index) => (
                                                <Star key={index} className={`h-4 w-4 ${index < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)]">{rev.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16 sm:mt-24">
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-8">You might also like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {relatedProducts.map(rp => (
                            <ProductCard key={rp._id} product={rp} />
                        ))}
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ProductDetails;
