import { Briefcase, Send, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
    return (
        <div className="bg-[var(--color-background)] min-h-screen py-16 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 p-4 rounded-3xl inline-block mb-6 shadow-sm">
                        <Briefcase className="h-10 w-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6 tracking-tight">
                        Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">EduCart Team</span>
                    </h1>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
                        We are a fast-growing tech startup dedicated to simplifying the student retail experience. Want to build the future of education e-commerce with us?
                    </p>
                </div>

                <div className="bg-[var(--color-surface)] p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="text-center py-12">
                        <div className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-6">
                            <GraduationCap className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Current Openings</h2>
                        <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-8">
                            We currently don't have any wide open public positions, but we are always on the absolute lookout for immensely talented student interns and developers!
                        </p>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-left max-w-xl mx-auto">
                            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Think you'd be a great fit?</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mb-6">
                                Pitch us your best idea or send us your resume proactively. We love driven individuals who think entirely outside the box.
                            </p>
                            <a
                                href="mailto:asjadabbaszaidi@gmail.com"
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-[var(--color-background)] border-2 border-slate-200 dark:border-slate-600 text-[var(--color-text-main)] font-bold rounded-xl hover:border-purple-500 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400 transition-colors"
                            >
                                <Send className="h-4 w-4" />
                                Send Open Application
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
