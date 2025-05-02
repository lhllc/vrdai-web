import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Price IDs from environment variables
export const PRICE_IDS = {
  BASE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASE_MONTHLY!,
  BASE_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASE_ANNUAL!,
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
  PRO_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL!,
} as const;

export type PlanType = 'base' | 'pro';
export type BillingInterval = 'monthly' | 'annual';

export interface CheckoutParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({ priceId, successUrl, cancelUrl }: CheckoutParams) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

// Helper function to get price ID based on tier and interval
export const getPriceId = (tier: 'base' | 'pro', interval: 'monthly' | 'annual') => {
  const key = `${tier.toUpperCase()}_${interval.toUpperCase()}` as keyof typeof PRICE_IDS;
  return PRICE_IDS[key];
};

// Helper function to format price with currency
export const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
};

export function calculateSavings(monthlyPrice: number, annualPrice: number): number {
  const monthlyTotal = monthlyPrice * 12;
  return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100);
} 