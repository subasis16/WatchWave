import React, { useEffect } from 'react';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-gray-300 font-sans selection:bg-brand-red selection:text-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Terms of Service</h1>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Last Updated: March 14, 2026</p>
                </div>

                <div className="space-y-10 text-base md:text-lg leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">1. Playback License</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            WatchWave grants you a revocable, non-exclusive, non-transferable, limited license to stream content for personal, non-commercial purposes within our platform. You may not modify, distribute, or create derivative works based on our content.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">2. User Accounts & Responsibilities</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            You are responsible for maintaining the security of your personal access keys and account credentials. Any activity originating from your account is your legal responsibility. Do not share your account or password with anyone. 
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">3. Regional Boundaries</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            Our services are geographically restricted based on regional licensing agreements. Attempting to bypass these cinematic boundaries via virtual private networks (VPNs), proxy screens, or any other location-masking technology is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">4. Content Integrity & Piracy</h2>
                        <p className="text-gray-400 tracking-wide font-light">
                            Reproduction or redistribution of the streaming content is strictly forbidden. We employ digital rights management (DRM) and forensic watermarking to protect content integrity. Any unauthorized downloading or screen-recording will result in immediate account termination and potential legal action.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
