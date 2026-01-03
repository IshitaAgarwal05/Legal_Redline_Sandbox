import React from 'react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
    {
        id: 'weekly_49',
        name: 'Weekly Premium',
        price: 49,
        period: '/week',
        features: ['4 Document Analyses', '500 Token Queries', 'Priority Support'],
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'monthly_199',
        name: 'Monthly Pro',
        price: 199,
        period: '/month',
        features: ['18 Document Analyses', '2,500 Token Queries', 'Advanced Exports'],
        color: 'from-purple-500 to-pink-500',
        popular: true
    },
    {
        id: 'yearly_2599',
        name: 'Yearly Elite',
        price: 2599,
        period: '/year',
        features: ['200 Document Analyses', '50,000 Token Queries', 'Dedicated Account Manager'],
        color: 'from-amber-400 to-orange-500'
    },
    {
        id: 'yearly_3999',
        name: 'Ultimate Unlimited',
        price: 3999,
        period: '/year',
        features: ['Unlimited Documents', '50,000 Token Queries', 'White-label Reports'],
        color: 'from-emerald-500 to-teal-500'
    }
];

export default function PricingPage() {
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        navigate('/payment', { state: { plan } });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4" style={{ marginTop: '150px' }}>
                    Choose Your Plan
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Unlock the full potential of Legal AI with our flexible pricing tiers.
                    Start small or go unlimited.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-gray-800 rounded-2xl p-8 border ${plan.popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'} hover:border-gray-500 transition-all`}
                    >
                        {plan.popular && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </span>
                        )}

                        <h3 className="text-xl font-semibold text-gray-100 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                            <span className="text-gray-400 ml-1">{plan.period}</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center text-gray-300">
                                    <span className="text-green-400 mr-2">✓</span>
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSelectPlan(plan)}
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                        >
                            Get Started
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
