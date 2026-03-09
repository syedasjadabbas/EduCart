import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/users/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Password reset successfully. Please login.');
                navigate('/login');
            } else {
                setError(data.message || 'Error resetting password');
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
                    <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 p-3 rounded-full mb-4">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">New Password</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        Enter and confirm your new strong student password.
                    </p>
                </div>

                {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-500 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel and Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
