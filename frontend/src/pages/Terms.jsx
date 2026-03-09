const Terms = () => {
    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[var(--color-surface)] rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-main)] mb-6">Terms of Service</h1>
                    <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <section>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">1. General Terms</h2>
                            <p>By accessing and placing an order with EduCart, you confirm that you are in agreement with and bound by the terms of service contained herein.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">2. Order Acceptance</h2>
                            <p>All orders are subject to acceptance and availability. If your selected products are out of stock, we will notify you and process a refund if applicable.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">3. Payment Methods</h2>
                            <p>We accept local payment methods including EasyPaisa and JazzCash, as well as major credit/debit cards. Ensure your screenshot of the transaction is fully visible.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
