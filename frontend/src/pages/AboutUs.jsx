import { Info, Users, ShieldCheck, Mail, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="bg-[var(--color-background)] min-h-screen py-16 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-4 rounded-3xl inline-block mb-6 shadow-sm">
                        <Info className="h-10 w-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6 tracking-tight">
                        About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200">EduCart</span>
                    </h1>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
                        We are passionate about providing the highest quality academic gear and essentials to students nationwide at incredibly fair prices.
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-[var(--color-surface)] p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-12">

                    {/* Mission */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-indigo-50 p-4 rounded-full text-indigo-600 shrink-0 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-3">Our Mission</h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                EduCart was founded on a simple principle: students shouldn't have to overpay for the foundational tools they need to succeed. Our mission is to strip away the overwhelming retail markups and deliver premium backpacks, stationery, study gadgets, and laptop accessories directly to your dorm or home.
                            </p>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-emerald-50 p-4 rounded-full text-emerald-600 shrink-0 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Users className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-3">By Students, For Students</h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                Created by a collaborative collective of recent graduates and current scholars, we personally test every single gadget and notebook before we list it. If it doesn't meet our rigorous standard for late-night study sessions, it doesn't make it to EduCart.
                            </p>
                        </div>
                    </div>

                    {/* Trust */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-slate-100 p-4 rounded-full text-slate-600 shrink-0 dark:bg-slate-800 dark:text-slate-300">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-3">Commitment to Quality</h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                We pride ourselves on transparent shipping, secure local payment methods (including EasyPaisa, JazzCash, and cash on delivery capabilities), and reliable customer service that actually listens to your needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Have questions or feedback?</h3>
                    <a
                        href="mailto:asjadabbaszaidi@gmail.com"
                        className="inline-flex justify-center items-center gap-2 px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-600/20 transition-all"
                    >
                        <Mail className="h-5 w-5" />
                        Contact Us Directly
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
