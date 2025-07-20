import { WellnessPlan, PlanContent, UserPreferences, WellnessGoal } from '../types/wellness';

export interface GeneratePlanTask {
  name: 'generate-wellness-plan';
  parameters: {
    userGoal: string;
    currentState?: string;
    preferences?: UserPreferences;
    userId: string;
  };
  subtasks: [
    {
      name: 'validate-input';
      parameters: {
        input: string;
        context: 'goal';
      };
    },
    {
      name: 'analyze-user-needs';
      parameters: {
        goal: string;
        currentState?: string;
        preferences?: UserPreferences;
      };
    },
    {
      name: 'generate-daily-routine';
      parameters: {
        goal: string;
        preferences?: UserPreferences;
        timeCommitment: 'minimal' | 'moderate' | 'extensive';
      };
    },
    {
      name: 'create-affirmations';
      parameters: {
        goal: string;
        currentState?: string;
        count: number;
      };
    },
    {
      name: 'generate-self-care-tips';
      parameters: {
        goal: string;
        preferences?: UserPreferences;
        count: number;
      };
    },
    {
      name: 'format-wellness-plan';
      parameters: {
        routine: any;
        affirmations: string[];
        selfCareTips: any[];
        goal: string;
        userId: string;
      };
    }
  ];
}

export const generateWellnessPlanTask: GeneratePlanTask = {
  name: 'generate-wellness-plan',
  parameters: {
    userGoal: '',
    currentState: '',
    preferences: undefined,
    userId: ''
  },
  subtasks: [
    {
      name: 'validate-input',
      parameters: {
        input: '',
        context: 'goal'
      }
    },
    {
      name: 'analyze-user-needs',
      parameters: {
        goal: '',
        currentState: '',
        preferences: undefined
      }
    },
    {
      name: 'generate-daily-routine',
      parameters: {
        goal: '',
        preferences: undefined,
        timeCommitment: 'moderate'
      }
    },
    {
      name: 'create-affirmations',
      parameters: {
        goal: '',
        currentState: '',
        count: 5
      }
    },
    {
      name: 'generate-self-care-tips',
      parameters: {
        goal: '',
        preferences: undefined,
        count: 8
      }
    },
    {
      name: 'format-wellness-plan',
      parameters: {
        routine: {},
        affirmations: [],
        selfCareTips: [],
        goal: '',
        userId: ''
      }
    }
  ]
};

// Task execution functions
export async function executeGeneratePlanTask(
  userGoal: string,
  currentState: string = '',
  preferences?: UserPreferences,
  userId: string = ''
): Promise<WellnessPlan> {
  
  // Step 1: Validate input
  const validatedGoal = await validateWellnessInput(userGoal, 'goal');
  if (!validatedGoal.isValid) {
    throw new Error(`Invalid goal: ${validatedGoal.error}`);
  }

  // Step 2: Analyze user needs
  const userNeeds = await analyzeUserNeeds(validatedGoal.sanitizedInput!, currentState, preferences);

  // Step 3: Generate daily routine
  const dailyRoutine = await generateDailyRoutine(
    validatedGoal.sanitizedInput!,
    preferences,
    userNeeds.timeCommitment
  );

  // Step 4: Create affirmations
  const affirmations = await createAffirmations(
    validatedGoal.sanitizedInput!,
    currentState,
    5
  );

  // Step 5: Generate self-care tips
  const selfCareTips = await generateSelfCareTips(
    validatedGoal.sanitizedInput!,
    preferences,
    8
  );

  // Step 6: Format complete plan
  const plan = await formatWellnessPlan(
    dailyRoutine,
    affirmations,
    selfCareTips,
    validatedGoal.sanitizedInput!,
    userId
  );

  return plan;
}

// Helper functions for each subtask
async function validateWellnessInput(input: string, context: 'goal' | 'currentState' | 'preferences'): Promise<{ isValid: boolean; sanitizedInput?: string; error?: string }> {
  // Remove any potentially harmful content
  const sanitized = input.trim().replace(/[<>]/g, '');
  
  if (sanitized.length < 3) {
    return { isValid: false, error: 'Input too short' };
  }

  if (sanitized.length > 500) {
    return { isValid: false, error: 'Input too long' };
  }

  // Check for medical content red flags
  const medicalKeywords = ['diagnosis', 'treatment', 'medication', 'doctor', 'prescription', 'symptoms'];
  const hasMedicalContent = medicalKeywords.some(keyword => 
    sanitized.toLowerCase().includes(keyword)
  );

  if (hasMedicalContent) {
    return { isValid: false, error: 'Medical content not allowed' };
  }

  return { isValid: true, sanitizedInput: sanitized };
}

async function analyzeUserNeeds(goal: string, currentState: string, preferences?: UserPreferences) {
  // Analyze the user's goal and current state to determine appropriate recommendations
  const timeCommitment = preferences?.timeCommitment || 'moderate';
  const energyLevel = preferences?.energyLevel || 'medium';
  
  return {
    timeCommitment,
    energyLevel,
    primaryFocus: goal,
    secondaryFocus: currentState || 'general wellness'
  };
}

async function generateDailyRoutine(goal: string, preferences?: UserPreferences, timeCommitment: string = 'moderate') {
  // This would integrate with the AI model to generate personalized routines
  // For now, return a template structure
  return {
    morning: [
      {
        title: 'Mindful Breathing',
        description: 'Start your day with 5 minutes of deep breathing exercises',
        duration: 5,
        category: 'mental' as const,
        difficulty: 'beginner' as const
      }
    ],
    evening: [
      {
        title: 'Gratitude Reflection',
        description: 'Reflect on three things you\'re grateful for today',
        duration: 10,
        category: 'emotional' as const,
        difficulty: 'beginner' as const
      }
    ],
    throughoutDay: []
  };
}

async function createAffirmations(goal: string, currentState: string, count: number): Promise<string[]> {
  // Generate personalized affirmations based on goal and current state
  const baseAffirmations = [
    'I am capable of creating positive change in my life',
    'I choose to prioritize my well-being today',
    'I am worthy of self-care and compassion',
    'I trust in my ability to overcome challenges',
    'I am making progress toward my wellness goals'
  ];

  // Customize based on goal
  const goalSpecificAffirmations: Record<string, string[]> = {
    'better-sleep': [
      'I create a peaceful environment for restful sleep',
      'My body knows how to find deep, restorative sleep',
      'I release the day\'s stress and welcome peaceful rest'
    ],
    'reduce-stress': [
      'I choose calm and peace in every moment',
      'I release tension and embrace relaxation',
      'I am in control of my stress response'
    ],
    'increase-energy': [
      'I am filled with vitality and positive energy',
      'My body is strong and capable',
      'I choose activities that energize and uplift me'
    ]
  };

  const specificAffirmations = goalSpecificAffirmations[goal] || [];
  const allAffirmations = [...baseAffirmations, ...specificAffirmations];
  
  // Return random selection up to count
  return allAffirmations.slice(0, count);
}

async function generateSelfCareTips(goal: string, preferences?: UserPreferences, count: number) {
  // Generate personalized self-care tips
  const baseTips = [
    {
      title: 'Take a Mindful Walk',
      description: 'Spend 15 minutes walking outside, focusing on your surroundings',
      category: 'physical' as const,
      timeRequired: 15,
      energyLevel: 'medium' as const,
      indoorOutdoor: 'outdoor' as const
    },
    {
      title: 'Practice Deep Breathing',
      description: 'Sit comfortably and take 10 deep breaths, focusing on the inhale and exhale',
      category: 'mental' as const,
      timeRequired: 5,
      energyLevel: 'low' as const,
      indoorOutdoor: 'indoor' as const
    }
  ];

  return baseTips.slice(0, count);
}

async function formatWellnessPlan(
  routine: any,
  affirmations: string[],
  selfCareTips: any[],
  goal: string,
  userId: string
): Promise<WellnessPlan> {
  const now = new Date();
  
  return {
    id: `plan_${Date.now()}`,
    userId,
    title: `Personalized ${goal.replace('-', ' ')} Plan`,
    goal,
    content: {
      dailyRoutine: routine,
      affirmations,
      selfCareTips,
      mindfulnessPractices: [],
      disclaimer: 'This information is for general wellness purposes only and is not intended as medical advice. Always consult with healthcare professionals for medical concerns.',
      closingMessage: 'Remember, your wellness journey is unique. Listen to your body and adjust these suggestions to work best for you. You\'re doing great!'
    },
    createdAt: now,
    updatedAt: now,
    isActive: true
  };
} 