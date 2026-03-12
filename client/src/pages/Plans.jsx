import React, { useState, useEffect } from 'react';
import { Check, Users, Crown, Sparkles, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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

  // Utility to inject Razorpay Checkout script
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
      alert("You must be signed in to purchase a premium plan.");
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Check your connection.");
        setIsProcessing(false);
        return;
      }

      // Define amount based on Solo or Group logic
      const planConfig = plans.find(p => p.id === selectedPlan);
      const finalAmount = selectedPlan === 'group' ? planConfig.price : planConfig.price;

      // 2. Contact Backend to create the order
      const response = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
          receipt: `wv_rct_${Date.now()}`
        })
      });
      const data = await response.json();

      if (!data.success) {
        alert("Could not initialize payment wrapper.");
        setIsProcessing(false);
        return;
      }

      // 3. Mount the Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourKeyID", // Requires VITE_RAZORPAY_KEY_ID in .env
        amount: data.amount,
        currency: data.currency,
        name: "WatchWave Entertainment",
        description: `${planConfig.name} Subscription`,
        image: "https://i.imgur.com/3g7nmJC.png", // A red logo placeholder
        order_id: data.orderId,
        handler: function (response) {
          // This is the SUCCESS handler. Real verification happens in the backend webhook.
          alert(`Payment Successful! Welcome to ${planConfig.name}. ID: ${response.razorpay_payment_id}`);
          navigate('/profile');
        },
        prefill: {
          name: currentUser.displayName || "Premium User",
          email: currentUser.email,
        },
        notes: {
          firebase_uid: currentUser.uid, // PASSING SECURE UID TO BACKEND WEBHOOK!
          plan_id: selectedPlan
        },
        theme: {
          color: "#E50914" // WatchWave Brand Code Theme
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        alert(`Payment Failed. Reason: ${response.error.description}`);
        setIsProcessing(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error("Payment flow error: ", error);
      alert("A critical error occurred initializing the payment window.");
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      id: 'solo',
      name: 'Solo Plan',
      icon: Crown,
      price: 499,
      period: 'month',
      description: 'Perfect for individual streaming enthusiasts',
      features: [
        '4K Ultra HD Streaming',
        '1 Device at a time',
        'Unlimited Movies & Series',
        'Download for Offline Viewing',
        'No Ads',
        'Cancel Anytime',
      ],
      highlight: 'Most Popular',
      // Removed complex gradient string
    },
    {
      id: 'group',
      name: 'Group Plan',
      icon: Users,
      price: 1499,
      period: 'month',
      description: 'Share the joy with family and friends (Min. 5 users)',
      features: [
        '4K Ultra HD Streaming',
        'Up to 10 Devices',
        'Unlimited Movies & Series',
        'Download for Offline Viewing',
        'No Ads',
        'Personalized Profiles',
        'Parental Controls',
        'Priority Support',
      ],
      highlight: 'Best Value',
      minUsers: 5,
    },
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen pb-16 flex flex-col items-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock the full potential of Watch Wave. Select the plan that best fits your entertainment needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative border-2 ${isSelected ? 'border-brand-red' : 'border-white/10'} 
                  ${plan.id === 'solo' ? 'bg-rich-gray' : 'bg-rich-gray'}
                  rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer hover:bg-white/5`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {/* Highlight Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-red text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {plan.highlight}
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-brand-red/20 p-3 rounded-xl mr-4">
                      <IconComponent className="w-8 h-8 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 bg-deep-black/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-baseline">
                    <span className="text-gray-400 text-lg mr-2">₹</span>
                    <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  {plan.id === 'group' && (
                    <div className="mt-4">
                      <label className="block text-gray-300 text-sm mb-2">Number of Users (Min. 5)</label>
                      <input
                        type="number"
                        min="5"
                        max="10"
                        value={groupSize}
                        onChange={(e) => setGroupSize(Math.max(5, Math.min(10, parseInt(e.target.value) || 5)))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-rich-gray border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red"
                      />
                      <p className="text-gray-400 text-xs mt-2">
                        ₹{Math.round(plan.price / groupSize)} per user
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${isSelected
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/50'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {isSelected ? 'Selected Plan' : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Subscribe Button */}
        {selectedPlan && (
          <div className="mt-12 text-center animate-slide-up">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-gradient-to-r from-brand-red to-brand-dark-red hover:from-brand-dark-red hover:to-brand-red text-white font-bold px-12 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-brand-red/30 flex items-center justify-center mx-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Securing Connection...</>
              ) : (
                'Subscribe Now'
              )}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Secured by 256-bit encryption. Cancel anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
