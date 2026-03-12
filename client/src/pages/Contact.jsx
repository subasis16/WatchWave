import React, { useEffect } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto min-h-screen text-gray-200">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-b border-white/10 pb-4">Contact Us</h1>

            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
                    <p className="mb-8 text-gray-400 leading-relaxed">Have questions about WatchWave, billing, or technical support? Our premium concierge team is here to assist you.</p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-brand-red/10 border border-brand-red/20 p-3 rounded-xl text-brand-red"><Mail size={24} /></div>
                            <div>
                                <h3 className="text-white font-bold">Email Support</h3>
                                <p className="text-sm text-gray-400 mt-1">support@watchwave.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-brand-red/10 border border-brand-red/20 p-3 rounded-xl text-brand-red"><Phone size={24} /></div>
                            <div>
                                <h3 className="text-white font-bold">Phone</h3>
                                <p className="text-sm text-gray-400 mt-1">1-800-WATCHWAVE</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-brand-red/10 border border-brand-red/20 p-3 rounded-xl text-brand-red"><MapPin size={24} /></div>
                            <div>
                                <h3 className="text-white font-bold">Headquarters</h3>
                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">123 Cinematic Blvd<br />San Francisco, CA 94105</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[80px] pointer-events-none rounded-full" />
                    <h2 className="text-xl font-bold text-white mb-6 relative z-10">Send a Message</h2>
                    <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Your Name</label>
                            <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-red focus:outline-none transition-colors" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                            <input type="email" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-red focus:outline-none transition-colors" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Message</label>
                            <textarea rows="4" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-red focus:outline-none transition-colors" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)]">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
