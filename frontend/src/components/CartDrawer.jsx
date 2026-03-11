import { useContext } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { getImageUrl } from '../utils/imageHelper';


const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[var(--color-surface)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text-main)]">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        Your Cart
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900/40 dark:text-blue-300 ml-2">
                            {cartItems.length}
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                            <ShoppingBag className="h-16 w-16 mb-4 text-slate-300 dark:text-slate-700 mx-auto" />
                            <p className="text-lg font-medium">Your cart is empty.</p>
                            {user && (
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-colors shadow-sm"
                                >
                                    View Your Orders
                                </Link>
                            )}
                            <button
                                onClick={onClose}
                                className={`mt-4 ${user ? 'text-slate-500 hover:text-blue-600' : 'text-blue-600 hover:text-blue-700'} font-medium transition-colors`}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item._id} className="flex gap-4 bg-[var(--color-background)] p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                                    <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-semibold text-[var(--color-text-main)] line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="font-bold text-[var(--color-text-main)] text-sm">
                                            {formatCurrency(item.price)}
                                        </span>

                                        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                                            <button
                                                onClick={() => addToCart(item, Math.max(1, item.qty - 1))}
                                                className="text-slate-500 hover:text-blue-600"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="text-xs font-medium w-4 text-center text-[var(--color-text-main)]">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => addToCart(item, item.qty + 1)}
                                                className="text-slate-500 hover:text-blue-600"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-[var(--color-background)]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-500 font-medium">Subtotal</span>
                            <span className="text-xl font-bold text-[var(--color-text-main)]">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 text-center">Shipping and taxes calculated at checkout.</p>

                        <Link
                            to="/cart"
                            onClick={onClose}
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Go to Cart & Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
