import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');
    
    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    return NextResponse.json({
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      subscription_status: session.subscription
    });
  } catch (error: any) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 