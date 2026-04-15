import React, { useEffect } from 'react';

const DataPrivileges = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-gray-300 font-sans selection:bg-brand-red selection:text-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Last Updated: March 14, 2026</p>
                </div>

                <div className="space-y-10 text-base md:text-lg leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">1. Identity & Integrity</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            WatchWave is built on the foundation of absolute privacy. We do not harvest your viewing metadata for third-party optimization or advertising. Your digital footprint belongs exclusively to your local screen.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">2. Data Collection</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            We only collect data that is strictly necessary for providing our premium streaming experience:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400 tracking-wide font-light">
                            <li>Account information for authentication (Email, Username).</li>
                            <li>Watch history (Optional) to allow you to resume movies and sync watch parties.</li>
                            <li>Payment information, processed securely by our trusted third-party payment providers.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">3. Security Measures</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            We enforce robust security measures, including symmetric encryption for all offline downloads and end-to-end encryption for watch party chat messages. We operate on a 'Zero Knowledge' principle where possible, ensuring your personal communications remain entirely private.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">4. Your Data Rights</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            Under our policy, you are fully entitled to access, modify, or erase your data at any time.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400 tracking-wide font-light">
                            <li><strong className="text-white font-bold">Right to Access:</strong> You can request a full export of your account data.</li>
                            <li><strong className="text-white font-bold">Right to Erasure:</strong> Instantly delete your entire account history from our servers.</li>
                            <li><strong className="text-white font-bold">Incognito Mode:</strong> You can enable private viewing sessions that disable watch history tracking.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DataPrivileges;
