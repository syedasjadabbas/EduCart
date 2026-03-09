import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, Menu, Search, Package } from 'lucide-react';
import { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const { cartItems } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="fixed w-full z-50 glass-panel border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200">
                                EduCart
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Search Bar */}
                    {(!user || user.role !== 'admin') ? (
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
                            <input
                                type="text"
                                placeholder="Search student essentials..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--color-background)] rounded-full py-2 pl-4 pr-10 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-white"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-blue-500 transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                        </form>
                    ) : (
                        <div className="hidden md:flex flex-1" />
                    )}

                    {/* Nav Icons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5 text-yellow-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-slate-600" />
                            )}
                        </button>
                        {user ? (
                            <div className="hidden sm:flex items-center gap-6">
                                {user.role === 'admin' && (
                                    <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-700 pr-4 mr-2">
                                        <Link to="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                            View Products
                                        </Link>
                                        <Link to="/admin/orders" className="bg-indigo-600/10 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-600/20 transition-all border border-indigo-600/20">
                                            Manage Dashboard
                                        </Link>
                                    </div>
                                )}

                                <div className="relative group">
                                    <Link to="/profile" className="flex items-center gap-2.5">
                                        <span className="hidden lg:block text-sm font-bold text-[var(--color-text-main)] group-hover:text-blue-600 transition-colors pointer-events-none">
                                            Hi, {user.name?.split(' ')[0]}!
                                        </span>
                                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-blue-100 flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 shadow-sm transition-all">
                                            {user.profilePicture ? (
                                                <img src={`http://localhost:5000${user.profilePicture}`} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-blue-600">{user.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Action Hover dropdown or click for logout */}
                                    <div className="invisible group-hover:visible absolute right-0 mt-0 pt-2 w-48 z-50 transition-all origin-top-right">
                                        <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 overflow-hidden">
                                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                                <p className="text-xs font-semibold text-blue-600 truncate">{user.name}</p>
                                            </div>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-[var(--color-text-main)] hover:bg-slate-50 dark:hover:bg-slate-800">My Profile</Link>
                                            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden sm:flex items-center gap-1 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors dark:text-gray-300">
                                <User className="h-5 w-5" />
                                <span className="text-sm font-medium">Login</span>
                            </Link>
                        )}
                        {user?.role !== 'admin' && (
                            <Link
                                to="/cart"
                                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer dark:text-gray-300"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 dark:text-gray-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-[var(--color-surface)] border-b border-slate-200 dark:border-slate-800 p-4">
                    {(!user || user.role !== 'admin') && (
                        <form onSubmit={handleSearch} className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--color-background)] rounded-full py-2 pl-4 pr-10 border border-slate-200 dark:border-slate-700 focus:outline-none dark:text-white"
                            />
                            <button type="submit" className="absolute right-3 top-2.5">
                                <Search className="h-5 w-5 text-slate-400 hover:text-blue-500" />
                            </button>
                        </form>
                    )}
                    {user ? (
                        <div className="flex flex-col gap-2 py-2 text-[var(--color-text-main)] font-medium">
                            {user.role === 'admin' ? (
                                <>
                                    <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} className="text-left text-emerald-600 hover:text-emerald-700">Admin Dashboard</Link>
                                    <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-left text-[var(--color-text-main)] hover:text-blue-500">View Products</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                                        {user.profilePicture ? (
                                            <img src={`http://localhost:5000${user.profilePicture}`} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-blue-300" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-xs font-bold text-blue-600">{user.name?.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )}
                                        <span>Hi, {user.name}</span>
                                    </Link>
                                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-left text-blue-600 hover:text-blue-700">My Orders</Link>
                                    <Link to="/verify" onClick={() => setIsMenuOpen(false)} className="text-left text-[var(--color-text-main)] hover:text-blue-500">🏷️ Student Discount</Link>
                                </>
                            )}
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-500 hover:text-red-600">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2 text-[var(--color-text-main)] font-medium">
                            <User className="h-5 w-5" />
                            Login / Register
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
