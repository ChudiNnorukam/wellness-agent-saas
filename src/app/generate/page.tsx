'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { WellnessGoal, UserPreferences } from '@/types/wellness';

const wellnessGoals: { id: WellnessGoal; title: string; description: string }[] = [
  {
    id: 'better-sleep',
    title: 'Better Sleep',
    description: 'Improve sleep quality and establish healthy sleep habits'
  },
  {
    id: 'reduce-stress',
    title: 'Reduce Stress',
    description: 'Manage stress levels and find inner peace'
  },
  {
    id: 'increase-energy',
    title: 'Increase Energy',
    description: 'Boost vitality and feel more energized throughout the day'
  },
  {
    id: 'improve-focus',
    title: 'Improve Focus',
    description: 'Enhance concentration and mental clarity'
  },
  {
    id: 'emotional-balance',
    title: 'Emotional Balance',
    description: 'Find emotional stability and inner harmony'
  },
  {
    id: 'physical-wellness',
    title: 'Physical Wellness',
    description: 'Improve overall physical health and fitness'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    description: 'Develop present-moment awareness and mindfulness practices'
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion',
    description: 'Cultivate kindness and compassion toward yourself'
  },
  {
    id: 'work-life-balance',
    title: 'Work-Life Balance',
    description: 'Create harmony between work and personal life'
  }
];

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<WellnessGoal | ''>('');
  const [currentState, setCurrentState] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    timeCommitment: 'moderate',
    energyLevel: 'medium',
    environment: 'home'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGoalSelect = (goal: WellnessGoal) => {
    setSelectedGoal(goal);
    setStep(2);
  };

  const handleNext = () => {
    if (step === 2 && currentState.trim()) {
      setStep(3);
    } else if (step === 3) {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/wellness/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: selectedGoal,
          currentState,
          preferences
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/dashboard/plan/${data.plan.id}`);
      } else {
        setError(data.error || 'Failed to generate plan');
      }
    } catch (_err) {
      setError('An error occurred while generating your plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Choose Your Wellness Goal';
      case 2:
        return 'How are you feeling today?';
      case 3:
        return 'Customize Your Preferences';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return 'Select the primary area of wellness you\'d like to focus on.';
      case 2:
        return 'Tell us about your current state to help personalize your plan.';
      case 3:
        return 'Adjust these settings to make your plan work better for you.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">WellnessAI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getStepTitle()}
          </h1>
          <p className="text-lg text-gray-600">
            {getStepDescription()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wellnessGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className="p-6 border-2 border-gray-200 rounded-xl text-left hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling right now?
                </label>
                <textarea
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  placeholder="Describe your current mood, energy level, or any challenges you're facing..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentState.trim()}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Commitment
                </label>
                <select
                  value={preferences.timeCommitment}
                  onChange={(e) => setPreferences({...preferences, timeCommitment: e.target.value as 'minimal' | 'moderate' | 'extensive'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="minimal">Minimal (5-15 minutes/day)</option>
                  <option value="moderate">Moderate (15-30 minutes/day)</option>
                  <option value="extensive">Extensive (30+ minutes/day)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Energy Level
                </label>
                <select
                  value={preferences.energyLevel}
                  onChange={(e) => setPreferences({...preferences, energyLevel: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="low">Low Energy</option>
                  <option value="medium">Medium Energy</option>
                  <option value="high">High Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Environment
                </label>
                <select
                  value={preferences.environment}
                  onChange={(e) => setPreferences({...preferences, environment: e.target.value as 'home' | 'office' | 'outdoor' | 'mixed'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate My Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-emerald-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-2">Your Privacy & Safety</h3>
              <p className="text-emerald-800 text-sm">
                All information you share is kept private and secure. Our AI generates wellness recommendations 
                based on widely accepted practices and includes appropriate safety disclaimers. 
                This is not medical advice - always consult healthcare professionals for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 