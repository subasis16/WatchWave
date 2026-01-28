import React, { useState } from 'react';
import { Check, Users, Crown, Sparkles } from 'lucide-react';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [groupSize, setGroupSize] = useState(5);

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
      gradient: 'from-brand-red/20 to-brand-dark-red/10',
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
      gradient: 'from-brand-dark-red/40 to-black',
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
                className={`relative bg-gradient-to-br ${plan.gradient} border-2 ${isSelected ? 'border-brand-red' : 'border-white/10'
                  } rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
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
            <button className="bg-gradient-to-r from-brand-red to-brand-dark-red hover:from-brand-dark-red hover:to-brand-red text-white font-bold px-12 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-brand-red/30">
              Subscribe Now
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Cancel anytime. No hidden fees. 30-day money-back guarantee.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
