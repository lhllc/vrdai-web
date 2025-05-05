import Pricing from '@/components/ui/Pricing/Pricing';
// Comment out getUser, getProducts, and getSubscription calls if they cannot be used without a supabase client
// import {
//   getProducts,
//   getSubscription,
//   getUser
// } from '@/utils/supabase/queries';

export default async function PricingPage() {
  // const [user, products, subscription] = await Promise.all([
  //   getUser(),
  //   getProducts(),
  //   getSubscription()
  // ]);

  return (
    <Pricing
      user={null}
      products={[]}
      subscription={null}
    />
  );
}
