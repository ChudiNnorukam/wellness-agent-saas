// Wellness Plan Types
export interface WellnessPlan {
  id: string;
  userId: string;
  title: string;
  goal: string;
  currentState?: string;
  preferences?: UserPreferences;
  content: PlanContent;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface PlanContent {
  dailyRoutine: DailyRoutine;
  affirmations: string[];
  selfCareTips: SelfCareTip[];
  mindfulnessPractices: MindfulnessPractice[];
  nutritionGuidance?: NutritionGuidance;
  sleepHygiene?: SleepHygiene;
  disclaimer: string;
  closingMessage: string;
}

export interface DailyRoutine {
  morning: RoutineActivity[];
  evening: RoutineActivity[];
  throughoutDay: RoutineActivity[];
}

export interface RoutineActivity {
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'physical' | 'mental' | 'emotional' | 'spiritual';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modifications?: string[];
}

export interface SelfCareTip {
  title: string;
  description: string;
  category: 'physical' | 'mental' | 'emotional' | 'social';
  timeRequired: number; // in minutes
  energyLevel: 'low' | 'medium' | 'high';
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
}

export interface MindfulnessPractice {
  name: string;
  description: string;
  duration: number;
  technique: string;
  benefits: string[];
}

export interface NutritionGuidance {
  generalTips: string[];
  hydrationReminders: string[];
  mealTiming?: string[];
  mindfulEating?: string[];
}

export interface SleepHygiene {
  eveningRoutine: string[];
  environmentTips: string[];
  timingGuidance: string[];
  relaxationTechniques: string[];
}

export interface UserPreferences {
  timeCommitment: 'minimal' | 'moderate' | 'extensive';
  energyLevel: 'low' | 'medium' | 'high';
  environment: 'home' | 'office' | 'outdoor' | 'mixed';
  physicalLimitations?: string[];
  dietaryRestrictions?: string[];
  spiritualPreferences?: 'none' | 'secular' | 'spiritual' | 'religious';
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus: 'free' | 'basic' | 'premium';
  subscriptionEndDate?: Date;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface GeneratePlanRequest {
  goal: string;
  currentState?: string;
  preferences?: UserPreferences;
}

export interface GeneratePlanResponse {
  success: boolean;
  plan?: WellnessPlan;
  error?: string;
}

export interface ValidateInputRequest {
  input: string;
  context: 'goal' | 'currentState' | 'preferences';
}

export interface ValidateInputResponse {
  isValid: boolean;
  sanitizedInput?: string;
  warnings?: string[];
  error?: string;
}

// Wellness Goal Types
export type WellnessGoal = 
  | 'better-sleep'
  | 'reduce-stress'
  | 'increase-energy'
  | 'improve-focus'
  | 'emotional-balance'
  | 'physical-wellness'
  | 'mindfulness'
  | 'self-compassion'
  | 'work-life-balance'
  | 'custom';

export interface GoalDefinition {
  id: WellnessGoal;
  title: string;
  description: string;
  keywords: string[];
  commonChallenges: string[];
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'json' | 'markdown';
  includeMetadata: boolean;
  includeDisclaimer: boolean;
}

// Analytics Types
export interface PlanAnalytics {
  planId: string;
  userId: string;
  generatedAt: Date;
  goal: string;
  userRating?: number;
  userFeedback?: string;
  completionRate?: number;
  lastAccessed?: Date;
} 