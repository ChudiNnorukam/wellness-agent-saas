'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Plus, Calendar, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { WellnessPlan } from '@/types/wellness';

export default function DashboardPage() {
  const [plans, setPlans] = useState<WellnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/wellness/generate');
      const data = await response.json();

      if (data.success) {
        setPlans(data.plans || []);
      } else {
        setError(data.error || 'Failed to fetch plans');
      }
    } catch (_err) {
      setError('An error occurred while fetching your plans');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getGoalDisplayName = (goal: string) => {
    return goal.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness journey...</p>
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
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-emerald-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">WellnessAI Dashboard</h1>
                <p className="text-gray-600">Your personalized wellness journey</p>
              </div>
            </div>
            <Link
              href="/generate"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Plan
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.filter(plan => plan.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Days Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.length > 0 ? Math.ceil((Date.now() - plans[0].createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Wellness Plans</h2>
          </div>

          {plans.length === 0 ? (
            <div className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No plans yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first personalized wellness plan to start your journey.
              </p>
              <Link
                href="/generate"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Plan
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {plans.map((plan) => (
                <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{plan.title}</h3>
                        {plan.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        Goal: {getGoalDisplayName(plan.goal)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created {formatDate(plan.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/dashboard/plan/${plan.id}`}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        View Plan
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/generate"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-center"
            >
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Create New Plan</p>
              <p className="text-sm text-gray-600">Generate a personalized wellness plan</p>
            </Link>
            
            <Link
              href="/dashboard/analytics"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-center"
            >
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Track your wellness progress</p>
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-center"
            >
              <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Preferences</p>
              <p className="text-sm text-gray-600">Update your wellness preferences</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 