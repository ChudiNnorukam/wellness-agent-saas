'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPlansProps {
  userId: string;
  userEmail: string;
  currentPlan: string;
}

export default function SubscriptionPlans({ userId, userEmail, currentPlan }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: 'month',
      features: [
        'Unlimited wellness plans',
        'Daily routines & affirmations',
        'Basic analytics',
        'Email support'
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_basic_test'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: 'month',
      features: [
        'Everything in Basic',
        'Priority support',
        'Advanced analytics',
        'Custom plan templates',
        'Priority feature access'
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium_test'
    }
  ];

  const handleSubscribe = async (planId: string, priceId: string) => {
    if (currentPlan === planId) {
      alert('You are already subscribed to this plan!');
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
        }),
      });

      const { sessionId } = await response.json();

      if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Wellness Journey
        </h2>
        <p className="text-lg text-gray-600">
          Select the plan that best fits your wellness goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-lg shadow-lg p-8 border-2 ${
              currentPlan === plan.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {currentPlan === plan.id && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {plan.price}
                <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id, plan.priceId)}
              disabled={loading === plan.id || currentPlan === plan.id}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                currentPlan === plan.id
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : loading === plan.id
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading === plan.id
                ? 'Processing...'
                : currentPlan === plan.id
                ? 'Current Plan'
                : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          All plans include a 7-day free trial. Cancel anytime.
        </p>
        <p className="mt-2">
          Need help? Contact us at{' '}
          <a href="mailto:support@wellnessai.com" className="text-blue-600 hover:underline">
            support@wellnessai.com
          </a>
        </p>
      </div>
    </div>
  );
} 