import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Package, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const RevenueDashboard = ({ orders }) => {
    // Process data
    const validOrders = orders.filter(o => o.paymentStatus !== 'rejected');

    const stats = useMemo(() => {
        const totalSales = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const totalItemsSold = validOrders.reduce((sum, order) => {
            return sum + (order.orderItems?.reduce((itemSum, item) => itemSum + (item.qty || 1), 0) || 0);
        }, 0);
        const averageOrderValue = validOrders.length > 0 ? totalSales / validOrders.length : 0;

        return {
            totalSales,
            totalOrders: validOrders.length,
            totalItemsSold,
            averageOrderValue
        };
    }, [validOrders]);

    const monthlyData = useMemo(() => {
        const months = {};
        // Initialize last 6 months to ensure some data points even if empty
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months[d.toLocaleString('default', { month: 'short' })] = 0;
        }

        validOrders.forEach(order => {
            const date = new Date(order.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            if (months[month] !== undefined) {
                months[month] += order.totalPrice || 0;
            } else {
                months[month] = order.totalPrice || 0;
            }
        });

        return Object.keys(months).map(month => ({
            name: month,
            revenue: months[month]
        }));
    }, [validOrders]);

    const bestSellingProducts = useMemo(() => {
        const productCounts = {};
        validOrders.forEach(order => {
            order.orderItems?.forEach(item => {
                if (!productCounts[item.name]) {
                    productCounts[item.name] = { name: item.name, qty: 0, revenue: 0, image: item.image };
                }
                productCounts[item.name].qty += (item.qty || 1);
                productCounts[item.name].revenue += ((item.price || 0) * (item.qty || 1));
            });
        });

        return Object.values(productCounts)
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5); // top 5
    }, [validOrders]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 shadow-lg rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        Revenue: {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-6">Revenue Dashboard</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{formatCurrency(stats.totalSales)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">Total Orders</p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{stats.totalOrders}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">Items Sold</p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{stats.totalItemsSold}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-muted)]">Avg Order Value</p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{formatCurrency(stats.averageOrderValue)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6">Monthly Revenue</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} className="dark:opacity-20" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `${value}`} />
                                <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} content={<CustomTooltip />} />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Selling Products */}
                <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6">Top Products</h3>
                    <div className="flex-1 space-y-4 overflow-y-auto">
                        {bestSellingProducts.length > 0 ? bestSellingProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    {product.image ? (
                                        <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Package className="h-6 w-6 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[var(--color-text-main)] truncate">{product.name}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{product.qty} sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(product.revenue)}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-muted)] gap-2">
                                <Package className="h-8 w-8 opacity-50" />
                                <p className="text-sm">No sales data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueDashboard;
