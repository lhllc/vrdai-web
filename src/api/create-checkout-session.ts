import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, success_url, cancel_url } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Price ID is required" });
    }

    // Get the user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      // Check if customer exists in Supabase
      const { data: existingCustomer, error: queryError } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      if (queryError) {
        throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
      }

      if (existingCustomer?.stripe_customer_id) {
        customer = existingCustomer.stripe_customer_id;
      } else {
        // Create new customer in Stripe
        const stripeCustomer = await stripe.customers.create({
          email: user.email,
          metadata: { supabaseUUID: user.id }
        });
        customer = stripeCustomer.id;

        // Store customer ID in Supabase
        await supabase
          .from('customers')
          .insert([{ id: user.id, stripe_customer_id: customer }]);
      }
    } catch (err) {
      console.error('Customer creation/retrieval error:', err);
      return res.status(500).json({ error: "Failed to create/retrieve customer" });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: success_url || `${process.env.FRONTEND_URL}/post-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.FRONTEND_URL}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto'
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ error: error.message });
  }
} 