import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { fetchApi } from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetchApi('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setIsSubmitted(true);
            } else {
                setError(data.message || 'Error sending link');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-full mb-4">
                        <KeyRound className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">Reset Password</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        Enter your student email and we'll send you a link to reset your password.
                    </p>
                </div>

                {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}

                {!isSubmitted ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="student@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-300 text-center font-medium">
                            If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
