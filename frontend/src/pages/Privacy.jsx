const Privacy = () => {
    return (
        <div className="bg-[var(--color-background)] min-h-screen py-10 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[var(--color-surface)] rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-main)] mb-6">Privacy Policy</h1>
                    <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <section>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">1. Information We Collect</h2>
                            <p>At EduCart, we collect personal information such as your name, student email address, and shipping details when you place an order or register for an account. We do not store full payment card details on our servers.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">2. How We Use Information</h2>
                            <p>We use the data collected to fulfill your orders, communicate regarding delivery, and verify your student status. We do not sell your personal data to third parties.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-3">3. Data Security</h2>
                            <p>We implement industry-standard encryption protocols (SSL) and secure backend infrastructure to protect your personal and payment details.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
