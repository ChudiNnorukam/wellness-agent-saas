import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const planId = resolvedParams.id;

    // Fetch the specific plan
    const { data: plan, error } = await supabase
      .from('wellness_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching plan:', error);
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Update last accessed time in analytics
    await supabase
      .from('plan_analytics')
      .update({ last_accessed: new Date().toISOString() })
      .eq('plan_id', planId)
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      plan: {
        ...plan,
        id: plan.id,
        userId: plan.user_id,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      }
    });

  } catch (error) {
    console.error('Error fetching wellness plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const planId = resolvedParams.id;
    const body = await request.json();

    // Update the plan
    const { data: updatedPlan, error } = await supabase
      .from('wellness_plans')
      .update({
        title: body.title,
        is_active: body.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating plan:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan: {
        ...updatedPlan,
        id: updatedPlan.id,
        userId: updatedPlan.user_id,
        createdAt: new Date(updatedPlan.created_at),
        updatedAt: new Date(updatedPlan.updated_at)
      }
    });

  } catch (error) {
    console.error('Error updating wellness plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const planId = resolvedParams.id;

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('wellness_plans')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting plan:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting wellness plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 