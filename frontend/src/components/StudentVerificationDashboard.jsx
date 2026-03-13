import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Check, X, Clock, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';
import { fetchApi } from '../utils/api';


const StudentVerificationDashboard = () => {
    const { user } = useContext(AuthContext);
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchVerifications = async () => {
        try {
            const res = await fetchApi('/api/users/pending-verifications', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVerifications(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifications();
    }, []);

    const handleAction = async (studentId, status) => {
        try {
            const res = await fetchApi(`/api/users/review-verification/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success(`Verification marked as ${status}`);
                setVerifications(verifications.filter(v => v._id !== studentId));
                setSelectedStudent(null);
            } else {
                toast.error('Failed to update verification');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-slate-500">Loading student verifications...</div>;
    }

    if (verifications.length === 0) {
        return (
            <div className="bg-slate-50 dark:bg-slate-800/20 text-center rounded-2xl p-12 animate-fade-in-up">
                <BadgeCheck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">All caught up!</h3>
                <p className="text-slate-500 mt-2">There are no pending student verifications.</p>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up">
            <div className={`lg:col-span-1 space-y-4 ${selectedStudent ? 'hidden lg:block' : 'block'}`}>
                {verifications.map((student) => (
                    <div
                        key={student._id}
                        onClick={() => setSelectedStudent(student)}
                        className={`bg-[var(--color-surface)] border ${selectedStudent?._id === student._id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-slate-100 dark:border-slate-800 shadow-sm'} p-4 rounded-xl cursor-pointer hover:shadow-md transition-all`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-[var(--color-text-main)] truncate max-w-[200px]">{student.name}</h3>
                                <p className="text-xs text-slate-500 truncate">{student.email}</p>
                            </div>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Pending
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`lg:col-span-2 ${!selectedStudent ? 'hidden lg:flex lg:items-center lg:justify-center' : 'block'}`}>
                {!selectedStudent ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-full h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800">
                        <BadgeCheck className="h-16 w-16 mb-4 opacity-50" />
                        <p className="font-medium text-[var(--color-text-main)]">Select a student record to review</p>
                    </div>
                ) : (
                    <div className="bg-[var(--color-surface)] rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden sticky top-8 animate-fade-in-up">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-[var(--color-text-main)]">Review Student ID</h2>
                                <p className="text-sm text-slate-500">{selectedStudent.name} ({selectedStudent.email})</p>
                            </div>
                            <button className="lg:hidden p-2 text-slate-500 hover:text-slate-800" onClick={() => setSelectedStudent(null)}>Close</button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">ID Card Image</p>
                                <div className="border-4 border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex justify-center p-2">
                                    <img
                                        src={getImageUrl(selectedStudent.studentIdCard)}
                                        alt="Student ID"
                                        className="max-h-[500px] object-contain rounded-xl"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/400x300?text=Card+Not+Found"
                                        }}
                                    />
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <a href={getImageUrl(selectedStudent.studentIdCard)} target="_blank" rel="noreferrer" className="text-blue-500 font-medium text-sm hover:underline">
                                        Open full size in new tab
                                    </a>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => handleAction(selectedStudent._id, 'approved')}
                                    className="flex-1 flex justify-center items-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                >
                                    <Check className="w-5 h-5" /> Approve Verification
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to reject this ID card?")) {
                                            handleAction(selectedStudent._id, 'rejected');
                                        }
                                    }}
                                    className="flex-1 flex justify-center items-center gap-2 py-3 px-6 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" /> Reject ID Card
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentVerificationDashboard;
