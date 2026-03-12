import React, { useEffect } from 'react';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto min-h-screen text-gray-300">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-b border-white/10 pb-4">Terms and Conditions</h1>

            <div className="space-y-10 text-sm leading-relaxed">
                <section className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="bg-brand-red/20 text-brand-red w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
                        Acceptance of Terms
                    </h2>
                    <p className="text-gray-400">By accessing and utilizing the WatchWave application, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using these specific services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                </section>

                <section className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="bg-brand-red/20 text-brand-red w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
                        Premium Subscription
                    </h2>
                    <p className="text-gray-400">WatchWave is a premium streaming platform. Users agree to provide current, complete, and accurate purchase and account information for all purchases made via our platform. Subscriptions are billed on a recurring basis as dictated by your selected plan.</p>
                </section>

                <section className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="bg-brand-red/20 text-brand-red w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">3</span>
                        Watch Parties & Social Conduct
                    </h2>
                    <p className="text-gray-400">The "Watch Room" feature is designed for communal viewing. Users are expected to maintain respectful conduct in Voice Chat and Live Text Chat. WatchWave reserves the right to terminate accounts that engage in harassment, hate speech, or the broadcast of unauthorized restricted content.</p>
                </section>

                <section className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="bg-brand-red/20 text-brand-red w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">4</span>
                        Intellectual Property
                    </h2>
                    <p className="text-gray-400">All content included on this site, such as text, graphics, logos, images, digital downloads, and data compilations is the property of WatchWave or its content suppliers and protected by international copyright laws.</p>
                </section>

                <p className="text-gray-500 mt-12 pt-8 border-t border-white/5 font-mono text-xs">LAST UPDATED: MARCH 2026 // REVISION: 4.2.0</p>
            </div>
        </div>
    );
};

export default Terms;
