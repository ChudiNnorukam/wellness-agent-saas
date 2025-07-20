'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  ArrowLeft, 
  Download, 
  Share2, 
  Clock, 
  Target, 
  Sparkles,
  Sun,
  Moon,
  Calendar,
  Star
} from 'lucide-react';
import { WellnessPlan } from '@/types/wellness';

export default function PlanViewPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchPlan(params.id as string);
    }
  }, [params.id]);

  const fetchPlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/wellness/plan/${planId}`);
      const data = await response.json();

      if (data.success) {
        setPlan(data.plan);
      } else {
        setError(data.error || 'Failed to fetch plan');
      }
    } catch (err) {
      setError('An error occurred while fetching the plan');
    } finally {
      setLoading(false);
    }
  };

  const getGoalDisplayName = (goal: string) => {
    return goal.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      physical: 'bg-blue-100 text-blue-800',
      mental: 'bg-purple-100 text-purple-800',
      emotional: 'bg-pink-100 text-pink-800',
      spiritual: 'bg-indigo-100 text-indigo-800',
      social: 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Plan not found</h3>
          <p className="text-gray-600 mb-6">{error || 'The requested plan could not be found.'}</p>
          <Link
            href="/dashboard"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
                <p className="text-gray-600">Your personalized wellness plan</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 rounded-full p-3">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Goal</p>
                <p className="text-lg font-semibold text-gray-900">{getGoalDisplayName(plan.goal)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }).format(plan.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-full p-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  plan.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Routine */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Daily Routine</h2>
          </div>
          
          <div className="p-6">
            {/* Morning Routine */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Sun className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-medium text-gray-900">Morning</h3>
              </div>
              <div className="space-y-4">
                {plan.content.dailyRoutine.morning.map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening Routine */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Moon className="h-6 w-6 text-indigo-500" />
                <h3 className="text-lg font-medium text-gray-900">Evening</h3>
              </div>
              <div className="space-y-4">
                {plan.content.dailyRoutine.evening.map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Affirmations */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Daily Affirmations</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {plan.content.affirmations.map((affirmation, index) => (
                <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <p className="text-gray-800 italic">"{affirmation}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Self-Care Tips */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Self-Care Tips</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {plan.content.selfCareTips.map((tip, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{tip.title}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
                      {tip.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{tip.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {tip.timeRequired} min
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${tip.energyLevel === 'low' ? 'bg-green-100 text-green-800' : tip.energyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {tip.energyLevel} energy
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer and Closing */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-emerald-900 mb-3">Important Note</h3>
          <p className="text-emerald-800 text-sm mb-4">{plan.content.disclaimer}</p>
          <p className="text-emerald-800 text-sm font-medium">{plan.content.closingMessage}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/generate"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-center"
          >
            Create New Plan
          </Link>
          <Link
            href="/dashboard"
            className="border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors text-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 