import { useState, useContext, useRef } from 'react';
import { User, Lock, Camera, CheckCircle, AlertCircle, Package } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [previewPic, setPreviewPic] = useState(null);
    const [picFile, setPicFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef();

    if (!user) return <Navigate to="/login" replace />;

    const currentPic = previewPic || (user.profilePicture ? `http://localhost:5000${user.profilePicture}` : null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPicFile(file);
        setPreviewPic(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password && password !== confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (password && password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        setLoading(true);
        try {
            const data = new FormData();
            if (name !== user.name) data.append('name', name);
            if (password) data.append('password', password);
            if (picFile) data.append('profilePicture', picFile);

            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` },
                body: data,
            });
            const result = await res.json();
            if (res.ok) {
                updateUser({ ...user, ...result });
                setSuccess('Profile updated successfully!');
                setPassword('');
                setConfirmPassword('');
                setPicFile(null);
            } else {
                setError(result.message || 'Update failed.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 animate-fade-in-up">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[var(--color-text-main)]">My Profile</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">Manage your account details</p>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">

                    {/* Profile Picture Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
                                {currentPic ? (
                                    <img src={currentPic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                        <User className="h-14 w-14 text-blue-400" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-lg">{user.name}</p>
                            <p className="text-blue-100 text-sm">{user.email}</p>
                            {user.isStudentVerified && (
                                <span className="mt-1 inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    ✓ Student Verified
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {success && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-800/30 text-sm">
                                <CheckCircle className="h-4 w-4 shrink-0" /> {success}
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/30 text-sm">
                                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[var(--color-text-muted)] cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />
                        <h3 className="font-bold text-[var(--color-text-main)]">Change Password <span className="font-normal text-sm text-[var(--color-text-muted)]">(leave blank to keep current)</span></h3>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-[var(--color-background)] text-[var(--color-text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                        <div className="text-center">
                            <Link to="/cart" className="text-sm text-blue-600 hover:text-blue-700">← Back to My Orders</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
