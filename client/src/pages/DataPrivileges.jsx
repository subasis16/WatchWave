import React, { useEffect } from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';

const DataPrivileges = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto min-h-screen text-gray-300">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-b border-white/10 pb-4">Data Privileges & Protection</h1>

            <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-red/10 to-transparent pointer-events-none" />
                <Shield size={40} className="text-brand-red shrink-0 relative z-10 drop-shadow-[0_0_10px_rgba(229,9,20,0.4)]" />
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white mb-2">Your Privacy is Premium</h2>
                    <p className="text-base text-gray-300 leading-relaxed">At WatchWave, we believe world-class entertainment shouldn't come at the cost of your digital privacy. We employ rigorous data protection standards to ensure your viewing habits remain strictly yours.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl transition hover:border-white/20">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5"><Lock size={24} className="text-white" /></div>
                    <h3 className="text-lg font-bold text-white mb-3">End-to-End Encryption</h3>
                    <p className="text-gray-400 leading-relaxed">All direct messages and private voice comms within the Watch Room are secured using state-of-the-art E2E encryption protocols.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl transition hover:border-white/20">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-5"><EyeOff size={24} className="text-white" /></div>
                    <h3 className="text-lg font-bold text-white mb-3">No Third-Party Ad Tracking</h3>
                    <p className="text-gray-400 leading-relaxed">Because WatchWave is a premium subscription service, we do not inject tracking pixels or sell your watch history to third-party ad networks.</p>
                </div>
            </div>

            <div className="mt-14 space-y-8 bg-black/40 border border-white/5 rounded-3xl p-8 md:p-10">
                <h3 className="text-2xl font-bold text-white">Your Absolute Rights</h3>
                <ul className="space-y-6 text-gray-400 text-base">
                    <li className="flex gap-4"><span className="text-brand-red font-bold">1.</span> <strong>The Right to Access:</strong> You can download a complete archive of your WatchWave viewing history and account data at any time from your Profile Settings.</li>
                    <li className="flex gap-4"><span className="text-brand-red font-bold">2.</span> <strong>The Right to Erasure:</strong> Deleting your WatchWave account permanently purges all associated data from our servers within exactly 48 hours.</li>
                    <li className="flex gap-4"><span className="text-brand-red font-bold">3.</span> <strong>Opt-Out of Analytics:</strong> While we use anonymized data to improve our cinematic recommendation engine, you may opt out of all telemetry tracking at any point.</li>
                </ul>
            </div>
        </div>
    );
};

export default DataPrivileges;
