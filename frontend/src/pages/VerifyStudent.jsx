import { GraduationCap, ArrowRight, CheckCircle, Upload, AlertCircle, Clock } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const VerifyStudent = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error("Please log in to upload your Student ID");
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select an image file of your student ID.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('studentIdCard', file);

        try {
            const res = await fetch('/api/users/student-id', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Student ID uploaded successfully!');
                updateUser({
                    studentVerificationStatus: data.studentVerificationStatus,
                    studentIdCard: data.studentIdCard
                });
            } else {
                toast.error(data.message || 'Verification upload failed');
            }
        } catch (error) {
            toast.error('Network error during upload');
        } finally {
            setLoading(false);
        }
    };

    if (user.isStudentVerified || user.studentVerificationStatus === 'approved') {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 animate-fade-in-up">
                <div className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-3xl text-center shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full mb-6">
                        <CheckCircle className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-4">You're Verified!</h2>
                    <p className="text-[var(--color-text-muted)] mb-8">
                        Your student discount has been activated permanently on your account. Enjoy 15% off all sitewide purchases.
                    </p>
                    <Link to="/shop" className="w-full flex items-center justify-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                        Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        );
    }

    if (user.studentVerificationStatus === 'pending') {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 animate-fade-in-up">
                <div className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-3xl text-center shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full mb-6">
                        <Clock className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-4">Verification Pending</h2>
                    <p className="text-[var(--color-text-muted)] mb-8">
                        We have received your Student ID Card. Our admin team will review it shortly. You will be notified once it is approved!
                    </p>
                    <Link to="/shop" className="w-full flex items-center justify-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                        Return to Shop <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 animate-fade-in-up">
            <div className="max-w-md w-full bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                        <GraduationCap className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-2">Student Verification</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Unlock your exclusive 15% discount. Upload a photo of your valid university student ID card.
                    </p>
                </div>

                {user.studentVerificationStatus === 'rejected' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-400">Verification Rejected</h3>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                Your previous student ID submission was rejected. Please upload a clearer, valid ID card.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                            Upload Student ID Card
                        </label>
                        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => document.getElementById('studentIdUpload').click()}>
                            <Upload className="h-8 w-8 text-slate-400 mb-3" />
                            <p className="text-sm font-medium text-[var(--color-text-main)] text-center">
                                {file ? file.name : "Click to browse or drag and drop"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">JPG, PNG, PDF up to 5MB</p>
                            <input
                                id="studentIdUpload"
                                type="file"
                                accept="image/*,application/pdf"
                                required
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center py-3.5 px-4 font-bold rounded-xl text-white shadow-lg transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-600/20'
                            }`}
                    >
                        {loading ? 'Uploading...' : 'Submit ID Card'}
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-4">
                        By submitting, you agree to our Student terms. Fake IDs will result in account termination.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VerifyStudent;
