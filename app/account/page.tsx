import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
// import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function Account() {
  // const supabase = createClient();
  // const [user, userDetails, subscription] = await Promise.all([
  //   getUser(supabase),
  //   getUserDetails(supabase),
  //   getSubscription(supabase)
  // ]);
  // TODO: Re-implement account logic without supabase dependency
  return <div>Account page is under construction.</div>;
}
