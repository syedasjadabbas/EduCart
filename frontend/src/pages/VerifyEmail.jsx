import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`/api/users/verify-email/${token}`);
                const data = await res.json();
                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Network error. Please try again.');
            }
        };
        if (token) verify();
    }, [token]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4 animate-fade-in-up">
            <div className="max-w-md w-full bg-[var(--color-surface)] p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center space-y-6">

                {status === 'loading' && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse">
                                <Loader className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-[var(--color-text-main)]">Verifying your email...</h2>
                        <p className="text-[var(--color-text-muted)]">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-[var(--color-text-main)]">Email Verified!</h2>
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{message}</p>
                        <Link
                            to="/login"
                            className="block w-full py-3.5 px-4 text-center font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            Log In to Your Account
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-[var(--color-text-main)]">Verification Failed</h2>
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{message}</p>
                        <Link
                            to="/register"
                            className="block w-full py-3.5 px-4 text-center font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            Register Again
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;
