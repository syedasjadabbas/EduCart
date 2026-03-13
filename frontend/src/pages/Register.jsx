import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { fetchApi } from '../utils/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetchApi('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    isStudentVerified: email.toLowerCase().endsWith('.edu'),
                }),
            });
            const data = await res.json();
            if (res.ok && data.requiresVerification) {
                setVerified(true); // Show the "check your email" screen
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:px-8">

            {/* ── Email Sent Screen ── */}
            {verified ? (
                <div className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                            <Mail className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-[var(--color-text-main)] mb-2">Check your inbox!</h2>
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                            We've sent a verification link to <strong className="text-[var(--color-text-main)]">{email}</strong>.
                            Click the link in the email to activate your account.
                        </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300 text-left space-y-1">
                        <p>✅ The link expires in <strong>24 hours</strong>.</p>
                        <p>✅ Check your spam/junk folder if you don't see it.</p>
                    </div>
                    <Link
                        to="/login"
                        className="block w-full py-3.5 px-4 text-center font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                    >
                        Go to Login
                    </Link>
                </div>
            ) : (
                /* ── Registration Form ── */
                <div className="max-w-md w-full space-y-8 bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                    <div>
                        <div className="flex justify-center flex-col items-center">
                            <div className="bg-blue-600 text-white p-2 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
                                <Package className="h-8 w-8" />
                            </div>
                            <h2 className="text-center text-3xl font-extrabold text-[var(--color-text-main)]">
                                Create an account
                            </h2>
                            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="name" name="name" type="text" required
                                        value={name} onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email" name="email" type="email" required
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        placeholder="student@university.edu"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">A verification email will be sent to this address.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password" name="password" type="password" required
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-60"
                            >
                                {loading ? 'Creating account...' : 'Sign Up & Verify Email'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Register;
