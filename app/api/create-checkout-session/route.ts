import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';
import { getURL } from '@/utils/helpers';

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
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

    // Check if customer exists in Supabase
    const { data: existingCustomer, error: queryError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (queryError) {
      console.error('Supabase customer lookup failed:', queryError);
      return NextResponse.json(
        { error: 'Failed to lookup customer' },
        { status: 500 }
      );
    }

    let customerId: string;

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUUID: user.id }
      });
      customerId = customer.id;

      // Store customer ID in Supabase
      const { error: insertError } = await supabase
        .from('customers')
        .insert([{ id: user.id, stripe_customer_id: customerId }]);

      if (insertError) {
        console.error('Failed to store customer ID:', insertError);
        return NextResponse.json(
          { error: 'Failed to store customer data' },
          { status: 500 }
        );
      }
    }

    const baseUrl = getURL();
    
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      subscription_data: {
        metadata: {
          userId: user.id
        }
      },
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
} 