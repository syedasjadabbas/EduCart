import { Link } from 'react-router-dom';
import { BookOpen, Laptop, Briefcase, PenTool, Coffee, Monitor, ArrowRight, ShieldCheck, Truck, Tag, Search, X, Filter, GraduationCap, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeletons';
import { formatCurrency } from '../utils/currency';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminHome = ({ user }) => {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--color-background)] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-0 -z-0 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 animate-fade-in">
                {/* Header / Welcome */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-800/50">
                            <ShieldCheck className="w-3.5 h-3.5" /> Administrator Access
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--color-text-main)] tracking-tight">
                            Admin <span className="text-blue-600">Control Center</span>
                        </h1>
                        <p className="text-[var(--color-text-muted)] mt-3 text-lg max-w-2xl">
                            Welcome back, <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>. Your store management tools are ready for action.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-[var(--color-surface)] p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                            Live System
                        </div>
                        <div className="text-[var(--color-text-muted)] text-sm font-semibold pr-2">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* MAIN ACTIONS - Quick Access Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <Link to="/shop" className="group relative p-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 overflow-hidden border border-white/40 dark:border-white/10">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />

                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.05] transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 ease-out">
                            <Search className="w-64 h-64 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-3xl w-fit mb-8 border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm">
                                <Search className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-4xl font-bold mb-3 tracking-tight text-[var(--color-text-main)]">View Catalog</h2>
                            <p className="text-[var(--color-text-muted)] text-xl opacity-90 max-w-sm leading-relaxed">
                                Experience the store from a student's perspective. Browse products and check live pricing.
                            </p>
                            <div className="mt-10 flex items-center gap-3 font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                                <span className="pb-1 border-b-2 border-emerald-600/20 group-hover:border-emerald-600 transition-colors">Launch Storefront</span>
                                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="group relative p-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 overflow-hidden border border-white/40 dark:border-white/10">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.05] transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 ease-out">
                            <ShieldCheck className="w-64 h-64 text-indigo-600 dark:text-indigo-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-3xl w-fit mb-8 border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm">
                                <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-4xl font-bold mb-3 tracking-tight text-[var(--color-text-main)]">Management Suite</h2>
                            <p className="text-[var(--color-text-muted)] text-xl opacity-90 max-w-sm leading-relaxed">
                                Process daily orders, manage inventory, moderate reviews, and track revenue health.
                            </p>
                            <div className="mt-10 flex items-center gap-3 font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                <span className="pb-1 border-b-2 border-indigo-600/20 group-hover:border-indigo-600 transition-colors">Enter Dashboard</span>
                                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Management Hub Grid */}
                <div className="bg-[var(--color-surface)] rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-slate-50 dark:bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="mb-12 flex items-center justify-between relative z-10">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--color-text-main)] tracking-tight">Management Hub</h2>
                            <p className="text-[var(--color-text-muted)] text-lg mt-1">Direct access to core administrative modules.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {[
                            {
                                to: "/admin/orders?tab=orders",
                                icon: <Truck className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
                                name: "Shipments",
                                desc: "Manage logistics and order delivery.",
                                bgColor: "bg-blue-100 dark:bg-blue-900/30",
                                hoverBorder: "hover:border-blue-500/20"
                            },
                            {
                                to: "/admin/orders?tab=users",
                                icon: <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
                                name: "Users",
                                desc: "Manage students and verification status.",
                                bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
                                hoverBorder: "hover:border-indigo-500/20"
                            },
                            {
                                to: "/admin/orders?tab=coupons",
                                icon: <Tag className="w-7 h-7 text-amber-600 dark:text-amber-400" />,
                                name: "Promotions",
                                desc: "Create and monitor coupon codes.",
                                bgColor: "bg-amber-100 dark:bg-amber-900/30",
                                hoverBorder: "hover:border-amber-500/20"
                            },
                            {
                                to: "/admin/orders?tab=reviews",
                                icon: <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
                                name: "Reviews",
                                desc: "Review and moderate student feedback.",
                                bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
                                hoverBorder: "hover:border-emerald-500/20"
                            }
                        ].map((item, i) => (
                            <Link key={i} to={item.to} className={`group p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-transparent ${item.hoverBorder} hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-lg`}>
                                <div className={`p-4 ${item.bgColor} rounded-2xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">{item.name}</h3>
                                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

const Home = () => {
    const { user } = useContext(AuthContext);

    // If Admin, show the Admin Home view
    if (user && user.role === 'admin') {
        return <AdminHome user={user} />;
    }

    // Mock Data
    const categories = [
        { icon: <PenTool size={28} />, name: 'Stationery', color: 'from-pink-500 to-rose-400', route: '/shop?category=stationery' },
        { icon: <Monitor size={28} />, name: 'Study Gadgets', color: 'from-blue-600 to-cyan-500', route: '/shop?category=gadgets' },
        { icon: <Laptop size={28} />, name: 'Laptop Accs', color: 'from-indigo-500 to-purple-500', route: '/shop?category=laptop' },
        { icon: <Briefcase size={28} />, name: 'Backpacks', color: 'from-amber-500 to-orange-400', route: '/shop?category=backpacks' },
        { icon: <BookOpen size={28} />, name: 'Desk Accs', color: 'from-emerald-500 to-teal-400', route: '/shop?category=desk' },
        { icon: <Coffee size={28} />, name: 'Water Bottles', color: 'from-cyan-500 to-blue-400', route: '/shop?category=bottles' },
    ];

    const features = [
        { icon: <Tag className="h-8 w-8 text-blue-500" />, title: 'Affordable Pricing', desc: 'Exclusive discounts just for students' },
        { icon: <Truck className="h-8 w-8 text-blue-500" />, title: 'Fast Delivery', desc: 'Get your essentials before your next class' },
        { icon: <ShieldCheck className="h-8 w-8 text-blue-500" />, title: 'Quality Tools', desc: 'Verified products that last the semester' },
    ];

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Extract unique categories directly from DB products dynamically
    const uniqueCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Build the live filter subset
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProducts(data);
            })
            .catch(err => console.error('Failed to load products for home:', err));
    }, []);

    // Find specific items or fallback to latest
    const featuredProducts = products.filter(p =>
        p.name.includes('Messenger') ||
        p.name.includes('Scissors') ||
        p.name.includes('Calculator') ||
        p.name.includes('Stand')
    ).slice(0, 4);

    if (featuredProducts.length < 4 && products.length > 4) {
        featuredProducts.push(...products.filter(p => !featuredProducts.includes(p)).slice(0, 4 - featuredProducts.length));
    }

    const popularProducts = products.filter(p => !featuredProducts.includes(p)).slice(0, 4);

    return (
        <div className="relative bg-[var(--color-background)] min-h-screen overflow-hidden">
            {/* Dynamic Background Blurs */}
            <div className="absolute top-0 left-1/4 -z-0 w-[50rem] h-[50rem] bg-blue-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 -z-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 animate-fade-in-up">
                {/* 🚀 PREMIUM HERO SECTION */}
                <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-12 lg:pt-8 lg:pb-16 text-[var(--color-text-main)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative p-10 lg:p-16 xl:p-20 rounded-[4rem] overflow-hidden border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                            {/* Inner Glow Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="text-center lg:text-left relative z-10">
                                    {/* Personal Welcome Banner */}
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start mb-10">
                                        {user && (
                                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border border-blue-200/50 dark:border-blue-500/20 shadow-sm animate-fade-in">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-700">
                                                    <span className="text-xs font-bold text-blue-600">👋</span>
                                                </div>
                                                <span className="text-sm font-bold">
                                                    Hi, <span className="text-blue-600">{user.name?.split(' ')[0]}</span>! Welcome back.
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 leading-[0.95]">
                                        Essential Store <br />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient">For Students</span>
                                    </h1>

                                    <p className="text-xl text-[var(--color-text-muted)] mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed opacity-80">
                                        Elevate your study experience with premium tools and accessories, all curated specifically for student life.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                        <Link to="/shop" className="group relative px-10 py-5 bg-blue-600 rounded-[2.5rem] text-white font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-blue-500/50 overflow-hidden min-w-[220px]">
                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                            <span className="relative flex flex-col items-center leading-tight">
                                                <span>Shop the</span>
                                                <span>Catalog</span>
                                            </span>
                                            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                        <Link to="/verify" className="glass-panel px-10 py-5 rounded-[2.5rem] text-[var(--color-text-main)] font-black text-lg hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center min-w-[220px] leading-tight text-center text-wrap max-w-[220px]">
                                            <span>Verify Student</span>
                                            <span>Discount</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Floating 3D Elements Area */}
                                <div className="relative hidden lg:block">
                                    <div className="relative w-full aspect-square bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full animate-pulse p-10">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative p-2 rounded-[4rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transform rotate-6 animate-float overflow-hidden">
                                                <img
                                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                                    alt="Luxury Workspace"
                                                    className="w-full h-[540px] object-cover rounded-[3.5rem]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                                            </div>
                                        </div>

                                        {/* Floating Badge Widgets */}
                                        <div className="absolute top-10 right-0 glass-panel p-6 pr-10 rounded-[2.5rem] shadow-2xl animate-float border-white/20 dark:border-white/10" style={{ animationDelay: '1s' }}>
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                                    <Tag className="w-7 h-7 text-emerald-500 rotate-12" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider">Student Perk</p>
                                                    <p className="text-2xl font-black text-emerald-500">-15% OFF</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-10 -left-6 glass-panel p-6 pr-10 rounded-[2.5rem] shadow-2xl animate-float border-white/20 dark:border-white/10" style={{ animationDelay: '2s' }}>
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/20 rounded-2xl">
                                                    <Truck className="w-7 h-7 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider">Next Day</p>
                                                    <p className="text-2xl font-black text-blue-600">FREE SHIP</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🏷️ STUDENT VERIFICATION BANNER */}
                {user && user.role !== 'admin' && (
                    <section className="px-4 pb-12">
                        <div className="max-w-7xl mx-auto">
                            {(user.isStudentVerified || user.studentVerificationStatus === 'approved') ? (
                                <div className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:scale-[1.005]">
                                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                                    <div className="flex items-center gap-8">
                                        <div className="p-5 bg-white/20 rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-inner">
                                            <CheckCircle className="h-10 w-10 text-white animate-glow" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black tracking-tight">Verified Premium Member</h3>
                                            <p className="text-emerald-50 text-lg opacity-90 max-w-md mt-2 leading-relaxed">
                                                Enjoy your permanent <strong>15% Discount</strong> across the entire catalog. Verified status is active!
                                            </p>
                                        </div>
                                    </div>
                                    <Link to="/shop" className="bg-white text-emerald-700 font-black px-10 py-5 rounded-[2rem] hover:bg-emerald-50 transition-all shadow-xl active:scale-95 text-lg">
                                        Explore the Catalog
                                    </Link>
                                </div>
                            ) : (
                                <div className="group relative overflow-hidden bg-[var(--color-surface)] rounded-[2.5rem] p-10 border border-blue-500/20 shadow-xl shadow-blue-500/5 transition-all hover:shadow-2xl hover:scale-[1.005]">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center gap-8">
                                            <div className="p-5 bg-blue-100 dark:bg-blue-900/30 rounded-[2rem] border border-blue-200 dark:border-blue-700 text-blue-600">
                                                <GraduationCap className="h-10 w-10" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black tracking-tight text-[var(--color-text-main)]">Student Discount Locked</h3>
                                                <p className="text-[var(--color-text-muted)] text-lg mt-2 font-medium">
                                                    Verify your student status today and unlock <strong className="text-blue-600">Flat 15% OFF</strong> on all gear.
                                                </p>
                                            </div>
                                        </div>
                                        <Link to="/verify" className="bg-blue-600 text-white font-black px-12 py-5 rounded-[2rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 text-lg">
                                            Verify Status Now
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* 📦 CATEGORY ORBS */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-16 px-4">
                            <div>
                                <h2 className="text-4xl font-black text-[var(--color-text-main)] tracking-tight">Shop Categories</h2>
                                <p className="text-[var(--color-text-muted)] text-xl font-medium mt-2">Precision gear for every study session.</p>
                            </div>
                            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black text-lg transition-colors group">
                                Browse All Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                            {categories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    to={cat.route}
                                    className="group flex flex-col items-center p-8 glass-panel rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-500"
                                >
                                    <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${cat.color} text-white mb-6 shadow-xl transform group-hover:rotate-6 transition-all duration-500 relative`}>
                                        <div className="absolute inset-0 bg-white/20 rounded-[2rem] blur-sm group-hover:blur-none transition-all" />
                                        <div className="relative z-10">{cat.icon}</div>
                                    </div>
                                    <span className="font-bold text-center text-[var(--color-text-main)] text-lg group-hover:text-blue-600 transition-colors">
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ✨ FEATURED PRODUCT SHOWCASE */}
                <section className="py-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-y border-white/40 dark:border-white/5 relative overflow-hidden">
                    {/* Decorative Background Glows */}
                    <div className="absolute -top-40 right-1/4 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
                            <div>
                                <div className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-full mb-4 border border-amber-200/50">
                                    Curated Collection
                                </div>
                                <h2 className="text-5xl font-black text-[var(--color-text-main)] tracking-tight">Best Productivity Gear</h2>
                                <p className="text-[var(--color-text-muted)] text-xl font-medium mt-2 max-w-2xl leading-relaxed">
                                    Hand-picked tools designed to make your semester smoother and more efficient.
                                </p>
                            </div>
                            <Link to="/shop" className="group px-8 py-4 glass-panel text-[var(--color-text-main)] font-bold rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                View Entire Store <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {products.length === 0 ? (
                                [1, 2, 3, 4].map(i => <ProductSkeleton key={`f-${i}`} />)
                            ) : (
                                featuredProducts.map((product) => (
                                    <div key={product._id} className="relative group p-1 glass-panel rounded-[2.5rem] bg-white/20 dark:bg-slate-900/20 shadow-lg hover:shadow-2xl transition-all duration-700">
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* 🏆 POPULAR PRODUCTS (THE CORE FEED) */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-black text-[var(--color-text-main)] tracking-tight mb-4">Student Favorites</h2>
                            <p className="text-[var(--color-text-muted)] text-xl font-medium max-w-2xl mx-auto">
                                The most popular gear among verified students. Join the community.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {products.length === 0 ? (
                                [1, 2, 3, 4].map(i => <ProductSkeleton key={`p-${i}`} />)
                            ) : (
                                popularProducts.map((product) => <ProductCard key={product._id} product={product} />)
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
