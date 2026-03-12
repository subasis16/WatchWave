import React, { useEffect, useState } from 'react';
import { Star, Send } from 'lucide-react';

const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
        }, 6000);
    }

    return (
        <div className="pt-24 px-6 max-w-3xl mx-auto min-h-screen relative">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-red/10 blur-[120px] pointer-events-none rounded-full" />

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-center relative z-10 drop-shadow-md">We Value Your Feedback</h1>
            <p className="text-gray-400 text-center mb-10 max-w-lg mx-auto relative z-10">Help us build the ultimate spatial streaming interface. Tell us what you love, what's broken, and what we should build next.</p>

            {submitted ? (
                <div className="bg-[#E50914]/10 border border-[#E50914]/30 text-white rounded-3xl p-12 text-center shadow-2xl relative z-10 backdrop-blur-md">
                    <div className="w-20 h-20 bg-[#E50914]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                        <Star size={32} className="text-[#E50914] fill-[#E50914]" />
                    </div>
                    <h2 className="text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-[#E50914]">Thank You!</h2>
                    <p className="text-gray-300 text-lg">Your premium feedback loop has been successfully transmitted to our engineering team.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 backdrop-blur-xl">

                    <div className="mb-10 flex flex-col items-center">
                        <label className="block text-white font-bold mb-4 text-lg">Rate your overall experience</label>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className="focus:outline-none transition-transform hover:scale-125 duration-300"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    <Star
                                        size={44}
                                        fill={star <= (hover || rating) ? "#E50914" : "transparent"}
                                        className={star <= (hover || rating) ? "text-[#E50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.8)]" : "text-gray-600 hover:text-gray-400 transition-colors"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Feature Category</label>
                            <select className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white focus:border-[#E50914] focus:outline-none appearance-none transition-colors shadow-inner">
                                <option>General UI Design</option>
                                <option>Watch Room / Party Sync</option>
                                <option>Video Player Performance</option>
                                <option>Mobile Responsiveness</option>
                                <option>Feature Request</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Detailed Feedback</label>
                            <textarea
                                required
                                rows="5"
                                className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white focus:border-[#E50914] focus:outline-none resize-none transition-colors shadow-inner"
                                placeholder="What did you experience? Be as detailed as possible."
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_5px_15px_rgba(229,9,20,0.4)] hover:shadow-[0_8px_25px_rgba(229,9,20,0.6)] text-lg flex items-center justify-center gap-2 mt-4">
                            <Send size={20} /> Submit Intelligence
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Feedback;
