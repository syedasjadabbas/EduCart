import { Link } from 'react-router-dom';
import { Package, Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || 'Subscribed successfully!');
                setEmail('');
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                                <Package className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl text-white">EduCart</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            Everything students need in one store. Affordable, fast delivery, and quality study tools.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/shop?category=stationery" className="hover:text-blue-400 transition-colors">Stationery</Link></li>
                            <li><Link to="/shop?category=gadgets" className="hover:text-blue-400 transition-colors">Study Gadgets</Link></li>
                            <li><Link to="/shop?category=laptop" className="hover:text-blue-400 transition-colors">Laptop Accessories</Link></li>
                            <li><Link to="/shop?category=backpacks" className="hover:text-blue-400 transition-colors">Backpacks</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link to="/student-discount" className="hover:text-blue-400 transition-colors">Student Discount</Link></li>
                            <li><a href="mailto:asjadabbaszaidi@gmail.com" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
                        <p className="text-slate-400 text-sm mb-4">Get notified when new products drop & exclusive student offers.</p>
                        <form className="flex" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-r-md transition-colors font-medium whitespace-nowrap"
                            >
                                {loading ? '...' : 'Join'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} EduCart. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
