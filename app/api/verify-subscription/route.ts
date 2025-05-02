import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get the user from Supabase auth
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription']
    });

    if (!session?.subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    const subscription = session.subscription as any;

    return NextResponse.json({
      data: {
        id: subscription.id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        created: new Date(subscription.created * 1000).toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 