import { BadgePercent, IdCard, ShoppingCart, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDiscount = () => {
    return (
        <div className="bg-[var(--color-background)] min-h-screen py-16 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Sub-hero */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse hidden md:block"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse delay-1000 hidden md:block"></div>

                    <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 p-4 rounded-3xl inline-block mb-6 shadow-sm relative z-10">
                        <BadgePercent className="h-10 w-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6 tracking-tight relative z-10">
                        Unlock Exclusive <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-400">Student Deals</span>
                    </h1>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed relative z-10">
                        All our prices are already deeply discounted compared to standard retail. Verify your student status to unlock a flat 15% discount on every purchase!
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Step 1 */}
                    <div className="bg-[var(--color-surface)] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-emerald-200 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform dark:opacity-10">
                            <IdCard className="w-40 h-40" />
                        </div>
                        <h3 className="text-5xl font-black text-emerald-100 dark:text-slate-800 mb-4">01</h3>
                        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Create Account</h2>
                        <p className="text-[var(--color-text-muted)] mb-8">
                            Sign up for a free EduCart account. It only takes a minute — just your name, email, and a password.
                        </p>
                        <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-2">
                            Go to Registration <span className="text-xl">→</span>
                        </Link>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-[var(--color-surface)] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-blue-200 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500 group-hover:scale-110 transition-transform dark:opacity-10">
                            <Upload className="w-40 h-40" />
                        </div>
                        <h3 className="text-5xl font-black text-blue-100 dark:text-slate-800 mb-4">02</h3>
                        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Upload Student ID</h2>
                        <p className="text-[var(--color-text-muted)] mb-8">
                            Upload a clear photo of your valid student ID card. Our admin team will review and verify it within 24 hours.
                        </p>
                        <Link to="/verify" className="font-bold text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-2">
                            Upload Student ID <span className="text-xl">→</span>
                        </Link>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-[var(--color-surface)] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500 group-hover:scale-110 transition-transform dark:opacity-10">
                            <ShoppingCart className="w-40 h-40" />
                        </div>
                        <h3 className="text-5xl font-black text-indigo-100 dark:text-slate-800 mb-4">03</h3>
                        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Enjoy 15% Off</h2>
                        <p className="text-[var(--color-text-muted)] mb-8">
                            Once approved, a flat 15% discount is automatically applied on every purchase — forever! No codes needed.
                        </p>
                        <Link to="/shop" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center gap-2">
                            Browse the Shop <span className="text-xl">→</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-800 text-white rounded-3xl p-8 md:p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 mix-blend-overlay"></div>
                    <h2 className="text-2xl font-bold mb-2 relative z-10">Need Bulk Order Discounts for a Society?</h2>
                    <p className="text-slate-300 max-w-xl mx-auto mb-6 relative z-10">
                        Are you organizing an event for a university society or club? Email us directly and we'll provision a massive custom discount code specifically for your club members!
                    </p>
                    <a
                        href="mailto:asjadabbaszaidi@gmail.com?subject=Bulk%20Order%20Discount%20Request%20-%20University%20Society&body=Hi%20EduCart%20Team%2C%0A%0AI%20would%20like%20to%20request%20a%20bulk%20order%20discount%20for%20our%20university%20society%2Fclub.%0A%0ASociety%20Name%3A%20%0ANumber%20of%20Members%3A%20%0AProducts%20Interested%20In%3A%20%0A%0AThank%20you!"
                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg relative z-10"
                    >
                        Email Us About Bulk Orders
                    </a>
                </div>

            </div>
        </div>
    );
};

export default StudentDiscount;
