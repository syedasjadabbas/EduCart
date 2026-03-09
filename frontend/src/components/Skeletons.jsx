import { Package } from 'lucide-react';

export const ProductSkeleton = () => {
    return (
        <div className="bg-[var(--color-surface)] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="w-full h-56 lg:h-64 bg-slate-200 dark:bg-slate-800"></div>

            <div className="p-5">
                {/* Category Placeholder */}
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full mb-3"></div>
                {/* Title Placeholder */}
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
                {/* Rating Placeholder */}
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    ))}
                    <div className="ml-2 h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
                {/* Footer (Price & Button) */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export const OrderSkeleton = ({ isAdmin = false }) => {
    if (isAdmin) {
        return (
            <div className="bg-[var(--color-surface)] flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
                <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 mb-4 animate-pulse">
            {/* Header */}
            <div className="flex flex-wrap gap-4 justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                </div>
            </div>
            {/* Timeline */}
            <div className="mb-6 h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg"></div>
            {/* Items */}
            <div className="space-y-3 mb-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Action buttons */}
            <div className="flex gap-3">
                <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
        </div>
    );
};

export const EmptyState = ({ icon: Icon = Package, title, description, action, className = "", compact = false }) => (
    <div className={`text-center ${compact ? 'py-6 px-2' : 'py-8 px-4'} bg-[var(--color-surface)] rounded-2xl ${compact ? '' : 'border border-slate-100 dark:border-slate-800 shadow-sm'} animate-fade-in-up ${className}`}>
        <div className={`bg-slate-50 dark:bg-slate-800/50 ${compact ? 'w-16 h-16 mb-3' : 'w-20 h-20 mb-4'} rounded-full flex items-center justify-center mx-auto transform transition-transform hover:scale-105 duration-300`}>
            <Icon className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} text-blue-500/70 dark:text-blue-400/70`} />
        </div>
        <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-[var(--color-text-main)] mb-1`}>{title}</h2>
        {description && <p className={`text-[var(--color-text-muted)] ${compact ? 'text-xs' : 'text-sm'} max-w-md mx-auto mb-4 leading-relaxed`}>{description}</p>}
        {action && (
            <div className="mt-2">
                {action}
            </div>
        )}
    </div>
);
