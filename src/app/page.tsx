'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight, CheckCircle, Star } from 'lucide-react';

// Cache bust: 2025-07-20 deployment fix
export default function Home() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup
    console.log('Email signup:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">WellnessAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/generate"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Generate Plan
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/generate"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-12 w-12 text-emerald-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              AI-Powered Wellness
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized wellness plans tailored to your goals, lifestyle, and preferences. 
            Transform your well-being with AI-driven recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/generate"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-50 transition-colors text-lg font-semibold">
              Learn More
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-emerald-100 rounded-full p-3 w-fit mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Plans</h3>
              <p className="text-gray-600">
                Get personalized wellness recommendations based on your unique goals and preferences.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your wellness journey with detailed analytics and progress tracking.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Access evidence-based wellness practices and expert-curated content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 WellnessAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
