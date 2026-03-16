import React, { useEffect } from 'react';
import { Mail, MapPin, Phone, Send, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-40 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-white selection:bg-accent-gold selection:text-black relative overflow-hidden">
            
            {/* Cinematic Background Field */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-white/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Get in Touch</h3>
                        <h1 className="text-8xl font-black tracking-tighter uppercase text-white leading-[0.8]">
                            Contact <br/> Us
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Contact Info Screens */}
                    <div className="space-y-16">
                        <div className="max-w-md">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.4em] leading-[2]">
                                Our premium support team is available 24/7. Reach out through any of the channels listed below.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-1 gap-10">
                            {[
                                { icon: Mail, label: 'Email', value: 'support@watchwave.com', color: 'text-blue-400' },
                                { icon: Phone, label: 'Phone', value: '1-800-WATCHWAVE', color: 'text-accent-gold' },
                                { icon: MapPin, label: 'Address', value: '123 Cinematic Blvd, SF, CA', color: 'text-white' }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-8 group"
                                >
                                    <div className="w-16 h-16 rounded-[1.2rem] glass-card flex items-center justify-center border-white/5 group-hover:border-white/20 transition-all duration-700">
                                        <item.icon size={24} className={item.color} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.label}</span>
                                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">{item.value}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Transmission Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 md:p-16 border-white/5 shadow-3xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Fingerprint size={120} strokeWidth={1} />
                         </div>

                        <div className="relative z-10 space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Send a Message</h2>
                                <div className="h-1 w-20 bg-accent-gold rounded-full" />
                            </div>

                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Your Name</label>
                                        <input type="text" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Email</label>
                                        <input type="email" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Message</label>
                                    <textarea rows="4" className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-700 resize-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <button className="w-full glass-pill-active py-6 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 group">
                                    Send Message <Send size={18} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
