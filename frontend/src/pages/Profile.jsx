import { useState, useContext, useRef, useEffect } from 'react';
import { User, Lock, Camera, CheckCircle, AlertCircle, Package, Star, Trash2, Edit2, BadgeCheck } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';
import { fetchApi } from '../utils/api';


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
    const [myReviews, setMyReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const fileInputRef = useRef();

    const fetchMyReviews = async () => {
        if (!user?.token) return;
        setReviewsLoading(true);
        try {
            const res = await fetchApi('/api/reviews/mine', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMyReviews(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyReviews();
    }, [user]);

    if (!user) return <Navigate to="/login" replace />;

    const currentPic = previewPic || user.profilePicture;

    const handleDeleteReview = async (reviewId) => {
        setDeletingId(reviewId);
        try {
            const res = await fetchApi(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast.success('Review deleted');
                setConfirmDeleteId(null);
                fetchMyReviews();
            } else {
                toast.error('Failed to delete review');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditReview = (review) => {
        setEditingReviewId(review._id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleSaveEdit = async (review) => {
        try {
            const res = await fetchApi(`/api/reviews/${review.productId?._id || review.productId}`, {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: editRating, comment: editComment })
            });

            if (res.ok) {
                toast.success('Feedback updated successfully!');
                setEditingReviewId(null);
                fetchMyReviews();
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update feedback');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error. Please try again.');
        }
    };

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

            const res = await fetchApi('/api/users/profile', {
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
                                    <img src={currentPic ? getImageUrl(currentPic) : ''} alt="Profile" className="w-full h-full object-cover" />
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
                                <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/30 shadow-lg animate-pulse-slow">
                                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
                                    <span>ELITE STUDENT VERIFIED</span>
                                </div>
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

                {/* My Reviews Section */}
                <div className="mt-12 bg-[var(--color-surface)] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        YOUR FEEDBACK
                    </h2>

                    {reviewsLoading ? (
                        <p className="text-[var(--color-text-muted)] text-sm">Loading reviews...</p>
                    ) : myReviews.length === 0 ? (
                        <p className="text-[var(--color-text-muted)] text-sm">You haven't reviewed any products yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {myReviews.map(review => (
                                <div key={review._id} className="p-4 bg-[var(--color-background)] rounded-2xl border border-slate-100 dark:border-slate-800 group relative">
                                    {editingReviewId === review._id ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-bold text-blue-600">Editing Feedback</h3>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            onClick={() => setEditRating(star)}
                                                            className={`h-5 w-5 cursor-pointer ${star <= editRating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                value={editComment}
                                                onChange={(e) => setEditComment(e.target.value)}
                                                className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-main)]"
                                                rows="3"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingReviewId(null)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSaveEdit(review)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <Link to={`/product/${review.productId?.slug || review.productId?._id || review.productId}`} className="text-sm font-bold text-blue-600 hover:underline">
                                                        {review.productId?.name || `Product ID: ${review.productId}`}
                                                    </Link>
                                                    <div className="flex gap-1 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {confirmDeleteId === review._id ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-red-500 font-semibold">Delete?</span>
                                                        <button
                                                            type="button"
                                                            disabled={deletingId === review._id}
                                                            onClick={() => handleDeleteReview(review._id)}
                                                            className="px-2 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
                                                        >
                                                            {deletingId === review._id ? 'Deleting…' : 'Yes'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditReview(review)}
                                                            className="text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(review._id)}
                                                            className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--color-text-main)] italic mb-1">"{review.comment}"</p>
                                            <div className="text-[10px] text-[var(--color-text-muted)] text-right">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
