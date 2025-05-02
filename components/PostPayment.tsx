import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/client';

const PostPayment: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handlePostPayment = async () => {
      try {
        const { session_id } = router.query;

        if (!session_id || typeof session_id !== 'string') {
          throw new Error('No session ID found');
        }

        // Fetch session details
        const response = await fetch(`/api/stripe/session?session_id=${session_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session details');
        }

        const data = await response.json();
        setEmail(data.customer_email);

        // Check if user is already authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          // User is not authenticated, redirect to sign in
          router.push({
            pathname: '/signin',
            query: { from: router.asPath }
          });
          return;
        }

        // Verify the subscription status
        const verifyResponse = await fetch('/api/verify-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id }),
        });

        if (!verifyResponse.ok) {
          throw new Error('Failed to verify subscription');
        }

        const { data: subscriptionData } = await verifyResponse.json();

        // Update user's subscription status in Supabase
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            id: subscriptionData.id,
            user_id: user.id,
            status: subscriptionData.status,
            price_id: subscriptionData.price_id,
            current_period_end: subscriptionData.current_period_end,
            current_period_start: subscriptionData.current_period_start,
            created: subscriptionData.created,
          });

        if (upsertError) {
          throw new Error('Failed to update subscription status');
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Post-payment error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      handlePostPayment();
    }
  }, [router.isReady, router.query, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1A1A1A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-300">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1A1A1A]">
        <div className="text-center max-w-md p-8 bg-[#0A0A0A]/90 backdrop-blur-lg rounded-2xl border border-[#1A1A1A]">
          <div className="text-red-500 text-2xl mb-4">Error</div>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/payment')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Return to Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1A1A1A]">
      <div className="text-center max-w-md p-8 bg-[#0A0A0A]/90 backdrop-blur-lg rounded-2xl border border-[#1A1A1A]">
        <h1 className="text-2xl font-bold text-gray-200 mb-4">Thank you for subscribing!</h1>
        {email && (
          <p className="text-gray-400 mb-6">
            Receipt sent to <strong className="text-gray-200">{email}</strong>
          </p>
        )}
        <p className="text-gray-300 mb-6">Please sign in with Google to finish setting up your account:</p>
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/dashboard`,
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent',
                }
              }
            })
          }
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PostPayment; 