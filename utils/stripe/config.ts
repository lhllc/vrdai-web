import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    apiVersion: '2025-04-30.basil',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'VrdAI Subscription Service',
      version: '1.0.0'
    },
    typescript: true
  }
);
