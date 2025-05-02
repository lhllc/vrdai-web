import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-04-30.basil" });

export default async function handler(req: any, res: any) {
  // Log method and origin for debugging CORS
  console.log('CORS Debug:', {
    method: req.method,
    origin: req.headers.origin,
    headers: req.headers
  });
  // --- CORS headers ---
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://vrdai-web.vercel.app'); // <-- your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // --- End CORS headers ---

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, success_url, cancel_url } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Price ID is required" });
    }

    const session = await stripe.checkout.sessions.create({
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
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ error: error.message });
  }
} 