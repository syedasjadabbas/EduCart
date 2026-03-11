import { Star, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';


const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const getGlowColor = (cat) => {
        const colors = {
            stationery: 'rgba(79, 70, 229, 0.4)', // Indigo
            gadgets: 'rgba(245, 158, 11, 0.4)',    // Amber
            laptop: 'rgba(59, 130, 246, 0.4)',    // Blue
            backpacks: 'rgba(16, 185, 129, 0.4)', // Emerald
            desk: 'rgba(139, 92, 246, 0.4)',      // Violet
            bottles: 'rgba(6, 182, 212, 0.4)',    // Cyan
        };
        return colors[cat?.toLowerCase()] || 'rgba(59, 130, 246, 0.3)';
    };

    const glowColor = getGlowColor(product.category);

    return (
        <div
            className={`bg-[var(--color-surface)] rounded-2xl overflow-hidden glass-panel relative group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-transparent`}
            style={{
                boxShadow: isHovered ? `0 20px 40px -15px ${glowColor}` : 'none',
                transform: isHovered ? 'translateY(-8px)' : 'none',
                borderColor: isHovered ? glowColor.replace('0.4', '0.2') : 'transparent'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Discount Badge */}
            {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md z-10 shadow-lg shadow-red-500/20 backdrop-blur-sm">
                    -{product.discount}% Student Offer
                </div>
            )}



            <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            </Link>

            <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {(product.ratings || product.rating || 0) > 0
                            ? (product.ratings || product.rating).toFixed(1)
                            : "0"}
                    </span>
                    <span className="text-sm text-slate-400">({product.numReviews || 0})</span>
                </div>

                <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-lg text-[var(--color-text-main)] mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-1">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200">
                            {formatCurrency(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-slate-400 line-through">
                                {formatCurrency(product.oldPrice)}
                            </span>
                        )}
                        <span className={`text-xs font-semibold mt-1 ${product.stock > 10 ? 'text-green-600 dark:text-green-400' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                            {product.stock > 10 ? `${product.stock} in stock` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of stock'}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!user) {
                                toast.error("Please login to add items to your cart!");
                                navigate('/login');
                                return;
                            }
                            const currentItem = cartItems.find(x => x._id === product._id);
                            const currentQty = currentItem ? currentItem.qty : 0;
                            if (currentQty >= product.stock) {
                                toast.error(`Sorry, only ${product.stock} units available.`);
                                return;
                            }
                            addToCart(product, currentQty + 1);
                            toast.success("Added to Cart!");
                        }}
                        disabled={product.stock === 0}
                        className={`p-2.5 rounded-full shadow-lg transition-transform ${product.stock === 0 ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95 group-hover:-translate-y-1'}`}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
