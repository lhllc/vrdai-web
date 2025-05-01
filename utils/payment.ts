import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Price IDs (move to environment variables in production)
export const PRICE_IDS = {
  BASE_MONTHLY: 'price_1RHq8IBGfO543PPIq13lWoz5',
  BASE_ANNUAL: 'price_1RHq8kBGfO543PPISz8x3xSy',
  PRO_MONTHLY: 'price_1RHq9EBGfO543PPIEMdDMqkD',
  PRO_ANNUAL: 'price_1RHq9sBGfO543PPILML7yrVr',
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

export function getPriceId(planType: PlanType, billingInterval: BillingInterval): string {
  switch (planType) {
    case 'base':
      return billingInterval === 'monthly' ? PRICE_IDS.BASE_MONTHLY : PRICE_IDS.BASE_ANNUAL;
    case 'pro':
      return billingInterval === 'monthly' ? PRICE_IDS.PRO_MONTHLY : PRICE_IDS.PRO_ANNUAL;
    default:
      throw new Error('Invalid plan type');
  }
}

export function calculateSavings(monthlyPrice: number, annualPrice: number): number {
  const monthlyTotal = monthlyPrice * 12;
  return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100);
} 