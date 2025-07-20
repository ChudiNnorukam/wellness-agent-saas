import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { executeGeneratePlanTask } from '@/src/tasks/generate-plan';
import { GeneratePlanRequest, GeneratePlanResponse } from '@/src/types/wellness';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: GeneratePlanRequest = await request.json();
    const { goal, currentState, preferences } = body;

    if (!goal) {
      return NextResponse.json(
        { success: false, error: 'Goal is required' },
        { status: 400 }
      );
    }

    // Check user subscription status
    const { data: userProfile } = await supabase
      .from('users')
      .select('subscription_status, subscription_end_date')
      .eq('id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check if user has active subscription or is on free tier
    const isSubscriptionActive = userProfile.subscription_status !== 'free' && 
      userProfile.subscription_end_date && 
      new Date(userProfile.subscription_end_date) > new Date();

    // For free users, check plan generation limits
    if (userProfile.subscription_status === 'free') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count } = await supabase
        .from('wellness_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (count && count >= 3) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Daily limit reached. Upgrade to generate more plans.' 
          },
          { status: 429 }
        );
      }
    }

    // Generate the wellness plan using the Cursor agent task
    const wellnessPlan = await executeGeneratePlanTask(
      goal,
      currentState,
      preferences,
      user.id
    );

    // Save the plan to the database
    const { data: savedPlan, error: saveError } = await supabase
      .from('wellness_plans')
      .insert({
        user_id: user.id,
        title: wellnessPlan.title,
        goal: wellnessPlan.goal,
        current_state: currentState,
        preferences: preferences,
        content: wellnessPlan.content,
        is_active: true
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving plan:', saveError);
      return NextResponse.json(
        { success: false, error: 'Failed to save plan' },
        { status: 500 }
      );
    }

    // Create analytics entry
    await supabase
      .from('plan_analytics')
      .insert({
        plan_id: savedPlan.id,
        user_id: user.id,
        goal: goal,
        generated_at: new Date().toISOString()
      });

    const response: GeneratePlanResponse = {
      success: true,
      plan: {
        ...savedPlan,
        id: savedPlan.id,
        userId: savedPlan.user_id,
        createdAt: new Date(savedPlan.created_at),
        updatedAt: new Date(savedPlan.updated_at)
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating wellness plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's wellness plans
    const { data: plans, error } = await supabase
      .from('wellness_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plans: plans.map(plan => ({
        ...plan,
        id: plan.id,
        userId: plan.user_id,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      }))
    });

  } catch (error) {
    console.error('Error fetching wellness plans:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 