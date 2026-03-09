import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Lock } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/'); // already logged in
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password, rememberMe);
        if (res.success) {
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            navigate('/');
        } else {
            setError(res.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                <div>
                    <div className="flex justify-center flex-col items-center">
                        <div className="bg-blue-600 text-white p-2 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
                            <Package className="h-8 w-8" />
                        </div>
                        <h2 className="text-center text-3xl font-extrabold text-[var(--color-text-main)]">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
                            Or{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                create a new student account
                            </Link>
                        </p>
                    </div>
                </div>
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    placeholder="Enter your student email..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-text-muted)]">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
