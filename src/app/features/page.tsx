'use client';

import Link from 'next/link';
import { Heart, Sparkles, Brain, Target, BarChart3, Shield, Zap, Users, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Personalization",
      description: "Our advanced AI analyzes your goals, preferences, and lifestyle to create truly personalized wellness plans.",
      benefits: ["Adaptive recommendations", "Learning from your progress", "Smart goal adjustment"]
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal-Oriented Planning",
      description: "Set specific wellness goals and get step-by-step plans designed to help you achieve them.",
      benefits: ["Clear milestones", "Progress tracking", "Achievement celebrations"]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Track your wellness journey with detailed insights and progress reports.",
      benefits: ["Visual progress charts", "Performance metrics", "Trend analysis"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy & Security",
      description: "Your health data is protected with enterprise-grade encryption and privacy controls.",
      benefits: ["End-to-end encryption", "GDPR compliance", "Data ownership"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Quick Setup",
      description: "Get started in minutes with our streamlined onboarding process.",
      benefits: ["3-minute setup", "Guided walkthrough", "Instant access"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Support",
      description: "Access to wellness experts and 24/7 customer support when you need help.",
      benefits: ["Live chat support", "Expert consultations", "Community forum"]
    }
  ];

  const integrations = [
    { name: "Apple Health", icon: "🍎" },
    { name: "Google Fit", icon: "📱" },
    { name: "Fitbit", icon: "⌚" },
    { name: "Garmin", icon: "🏃" },
    { name: "MyFitnessPal", icon: "🍽️" },
    { name: "Strava", icon: "🏃‍♂️" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">WellnessAI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Contact
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Login
              </Link>
              <Link
                href="/generate"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-12 w-12 text-emerald-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Powerful Features
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Discover how our AI-powered platform combines cutting-edge technology with proven wellness practices 
            to deliver personalized results that stick.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold"
            >
              Try It Free
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-50 transition-colors text-lg font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:bg-emerald-50 transition-colors">
                <div className="bg-emerald-100 rounded-full p-3 w-fit mb-6">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your favorite health and fitness apps to get a complete picture of your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{integration.icon}</div>
                <h3 className="font-semibold text-gray-900">{integration.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to experience the power of AI-driven wellness?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of users who have transformed their wellness journey with our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-emerald-400" />
                <span className="text-2xl font-bold">WellnessAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your well-being with AI-powered personalized wellness plans.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/generate" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WellnessAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 