import React, { useState, useEffect } from 'react';
import { Check, Users, Crown, Sparkles, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [groupSize, setGroupSize] = useState(5);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    if (!currentUser) {
      toast.error("Connection Failed. Screen authentication required.");
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Transmission Error. Razorpay SDK dropped.");
        setIsProcessing(false);
        return;
      }

      const planConfig = plans.find(p => p.id === selectedPlan);
      const finalAmount = selectedPlan === 'group' ? planConfig.price : planConfig.price;

      let data;
      try {
        const response = await fetch('http://localhost:5000/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalAmount,
            currency: 'INR',
            receipt: `wv_rct_${Date.now()}`
          })
        });
        
        if (!response.ok) throw new Error("Server down");
        data = await response.json();
      } catch (e) {
        console.warn("Backend not detected, initializing mock payment tunnel.");
        // Mock data for testing without backend
        data = {
          success: true,
          amount: finalAmount * 100,
          currency: 'INR',
          orderId: `order_mock_${Date.now()}`
        };
      }

      if (!data.success) {
        toast.error("Server Error. Unable to connect to server.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourKeyID",
        amount: data.amount,
        currency: data.currency,
        name: "WatchWave Systems",
        description: `${planConfig.name} Feature Activation`,
        image: "https://i.imgur.com/3g7nmJC.png",
        order_id: data.orderId,
        handler: function (response) {
          toast.success(`Access Granted. Welcome to ${planConfig.name}.`);
          navigate('/profile');
        },
        prefill: {
          name: currentUser.displayName || "Verified User",
          email: currentUser.email,
        },
        notes: {
          firebase_uid: currentUser.uid,
          plan_id: selectedPlan
        },
        theme: {
          color: "#E50914"
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        toast.error(`Transaction Dropped. Reason: ${response.error.description}`);
        setIsProcessing(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error("Payment flow error: ", error);
      toast.error("Critical Failure. Secure tunnel collapsed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      id: 'solo',
      name: 'Solo Screen',
      icon: Crown,
      price: 499,
      period: 'Cycle',
      description: 'Optimized for individual immersion',
      features: [
        '8K Resolution Authorization',
        'Singular Active Transmission',
        'Cinematic Sound Encryption',
        'Offline Storage',
        'Zero Data Intervention',
        'Dynamic Scaling',
      ],
      highlight: 'Standard Feature',
    },
    {
      id: 'group',
      name: 'Party Hub',
      icon: Users,
      price: 1499,
      period: 'Cycle',
      description: 'Connected multi-user environment',
      features: [
        '8K Global Multi-stream',
        'Up to 12 Parallel Screens',
        'Advanced Sharing Features',
        'Priority Bandwidth Tunnel',
        'Administrative Controls',
        'Cross-Platform Play',
        'Offline Hub',
        'Elite Command Support',
      ],
      highlight: 'Maximum Efficacy',
      minUsers: 5,
    },
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="min-h-screen pt-40 pb-24 px-8 font-sans text-white bg-transparent selection:bg-accent-gold selection:text-black overflow-hidden relative">
      {/* Dynamic Background Field */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-accent-gold/[0.04] blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8 mb-24">
          <h3 className="text-[10px] font-black tracking-[0.8em] text-gray-600 uppercase">System Tiers / Entitlements</h3>
          <h1 className="text-8xl font-black text-white tracking-tighter uppercase leading-none">
            Subscription <br/> Access
          </h1>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
            Select your cinematic authorization level. Tier changes are processed in real-time across all screens.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto mb-32">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className={`relative glass-card p-12 md:p-16 transition-all duration-1000 transform cursor-pointer border-white/5 shadow-3xl overflow-hidden group
                  ${isSelected ? 'bg-white/[0.05] border-white/20 scale-[1.02]' : 'hover:bg-white/[0.02] hover:border-white/10'}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {/* Visual Accent */}
                <div className={`absolute -top-10 -right-10 w-48 h-48 blur-[100px] rounded-full transition-all duration-1000 ${isSelected ? 'bg-accent-gold/20' : 'bg-white/5 opacity-50 group-hover:opacity-100'}`} />

                {/* Highlight Badge */}
                {plan.highlight && (
                  <div className={`absolute top-10 right-10 glass-pill px-5 py-2 text-[8px] font-black uppercase tracking-[0.3em] border shadow-2xl transition-all duration-700 ${isSelected ? 'border-accent-gold text-accent-gold' : 'border-white/5 text-gray-600'}`}>
                    {plan.highlight}
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-8 mb-16 relative z-10">
                  <div className={`glass-card p-5 rounded-[2rem] border-white/10 shadow-3xl transition-all duration-700 ${isSelected ? 'scale-110 border-accent-gold/40' : ''}`}>
                    <IconComponent className={`w-10 h-10 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing Screen */}
                <div className="mb-16 p-10 glass-card border-white/5 bg-white/[0.01] shadow-inner relative z-10 overflow-hidden">
                  <div className="flex items-baseline gap-4">
                    <span className="text-gray-600 text-2xl font-bold font-mono">₹</span>
                    <span className="text-7xl font-black text-white tracking-widest leading-none">{plan.price}</span>
                    <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]"> / {plan.period}</span>
                  </div>
                  {plan.id === 'group' && (
                    <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-600">
                         <span>Network Resolution</span>
                         <span className="text-accent-gold">{groupSize} Screens</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="12"
                        step="1"
                        value={groupSize}
                        onChange={(e) => setGroupSize(parseInt(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                      />
                      <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.4em] font-mono">
                        Cost per Screen: ₹{Math.round(plan.price / groupSize)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Directives */}
                <div className="space-y-6 mb-16 relative z-10">
                  <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">Core Directives</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${isSelected ? 'bg-accent-gold shadow-[0_0_10px_#FFD700]' : 'bg-white/10'}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Hub */}
                <button
                  className={`w-full py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.5em] transition-all duration-700 shadow-3xl relative overflow-hidden group/btn
                  ${isSelected ? 'glass-pill-active border-white/20' : 'glass-card border-white/5 hover:border-white/10 text-gray-500 hover:text-white'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-[sheen_2s_infinite]" />
                  {isSelected ? 'Ready to Initialize' : `Select ${plan.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>

        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10 pb-24"
          >
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="glass-pill-active px-24 py-8 font-black text-[12px] uppercase tracking-[0.6em] transition-all transform hover:scale-105 shadow-[0_40px_100px_rgba(255,255,255,0.08)] flex items-center justify-center mx-auto disabled:opacity-50 group/final"
            >
              {isProcessing ? (
                <><Loader2 className="w-6 h-6 mr-4 animate-spin" /> Tunnel Initialization...</>
              ) : (
                <>Connect to Secure Server</>
              )}
            </button>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em] mt-10">
              Feature SEC-256 Active. Multi-region Authorization support.
            </p>
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes sheen {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }
        `
      }} />
    </div>
  );
};

export default Plans;
