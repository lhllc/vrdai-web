import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export default async function handler(req: any, res: any) {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: "session_id required" });
  }
  const session = await stripe.checkout.sessions.retrieve(session_id as string);
  return res.status(200).json({ customer_email: session.customer_details?.email });
} 