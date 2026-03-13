import { useState, useEffect, useContext } from 'react';
import { Users, Search, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { getImageUrl } from '../utils/imageHelper';
import { fetchApi } from '../utils/api';


const UserManagementPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetchApi('/api/users', {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-12 text-center text-[var(--color-text-muted)] animate-pulse">Loading users...</div>;
    }

    return (
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-12 animate-fade-in-up">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                        <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--color-text-main)]">User Management</h2>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-[var(--color-text-main)]"
                        />
                    </div>
                    <button
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = `/api/users/export-csv`;
                            link.setAttribute('download', '');
                            // We need auth header, so use fetch
                            fetchApi('/api/users/export-csv', { headers: { 'Authorization': `Bearer ${user?.token}` } })
                                .then(res => res.blob())
                                .then(blob => {
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'educart_users.csv';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-800/30 whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" /> CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Orders</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Total Spent</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--color-surface)] divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {u.profilePicture ? (
                                            <img src={getImageUrl(u.profilePicture)} alt={u.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-[var(--color-text-main)]">{u.name}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${u.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                        }`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1.5">
                                        {/* Email Status */}
                                        <div className="flex items-center gap-1.5 text-xs">
                                            {u.isEmailVerified ? (
                                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                    <CheckCircle className="h-3 w-3" /> Email Verified
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                                    <Clock className="h-3 w-3" /> Email Pending
                                                </span>
                                            )}
                                        </div>

                                        {/* Student Status */}
                                        <div className="flex items-center gap-1.5 text-xs">
                                            {u.isStudentVerified ? (
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                                                    <CheckCircle className="h-3 w-3" /> Student Verified
                                                </span>
                                            ) : u.studentVerificationStatus === 'pending' ? (
                                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                                    <Clock className="h-3 w-3" /> ID Under Review
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                                                    <AlertCircle className="h-3 w-3" /> Not Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)] font-semibold">
                                    {u.orderCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)] font-semibold">
                                    {formatCurrency(u.totalSpent || 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                    <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>No users found matching "{searchQuery}"</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPanel;
