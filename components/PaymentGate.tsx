import React, { useState, useEffect } from 'react';
import { createCheckoutSession, PlanType, BillingInterval, calculateSavings, getPriceId } from '../utils/payment';
import { useRouter } from 'next/router';

const PaymentGate: React.FC = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<BillingInterval>('annual');
  const [selectedTier, setSelectedTier] = useState<PlanType>('base');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => setIsChartLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isChartLoaded) {
      new (window as any).TradingView.widget({
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "1",
        "timezone": "exchange",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": true,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart"
      });
    }
  }, [isChartLoaded]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await createCheckoutSession({
        priceId: getPriceId(selectedTier, selectedPlan),
        successUrl: `${window.location.origin}/post-payment`,
        cancelUrl: `${window.location.origin}/payment`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const savings = calculateSavings(5, 50); // Base plan savings
  const proSavings = calculateSavings(25, 250); // Pro plan savings

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1A1A1A] text-gray-200 font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
        <div id="tradingview_chart" className="w-full h-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-[#0A0A0A]/90 backdrop-blur-lg rounded-2xl p-8 border border-[#1A1A1A] shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
              Unlock Full Access
            </h1>
            <p className="text-gray-300 text-lg">
              Choose your plan and start analyzing markets with AI
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Plan Selection Toggle */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-300">Monthly</span>
              <button
                onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'annual' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  selectedPlan === 'annual' ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    selectedPlan === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-gray-300">Annual</span>
              {selectedPlan === 'annual' && (
                <span className="ml-2 text-green-500 text-sm font-medium">
                  Save {selectedTier === 'base' ? savings : proSavings}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Base Plan */}
              <div className={`bg-[#0F0F0F] rounded-xl p-6 border transition-all duration-300 ${
                selectedTier === 'base' ? 'border-green-500' : 'border-[#2A2A2A] hover:border-green-500/30'
              }`}>
                <h3 className="text-xl font-semibold mb-2">Base Plan</h3>
                <div className="text-3xl font-bold mb-4">
                  {selectedPlan === 'monthly' ? '$5' : '$50'}
                  <span className="text-sm text-gray-400">/{selectedPlan === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Basic AI Analysis
                  </li>
                  <li className="flex items-center text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Standard Market Data
                  </li>
                  <li className="flex items-center text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Email Support
                  </li>
                </ul>
                <button
                  onClick={() => setSelectedTier('base')}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                    selectedTier === 'base'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
                      : 'bg-[#0F0F0F] text-gray-300 hover:bg-[#1A1A1A]'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedTier === 'base' ? 'Selected' : 'Select Plan'}
                </button>
              </div>

              {/* Pro Plan */}
              <div className={`bg-[#0F0F0F] rounded-xl p-6 border transition-all duration-300 relative ${
                selectedTier === 'pro' ? 'border-green-500' : 'border-[#2A2A2A] hover:border-green-500/30'
              }`}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recommended
                </div>
                <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
                <div className="text-3xl font-bold mb-4">
                  {selectedPlan === 'monthly' ? '$25' : '$250'}
                  <span className="text-sm text-gray-400">/{selectedPlan === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Advanced AI Analysis
                  </li>
                  <li className="flex items-center text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Premium Market Data
                  </li>
                  <li className="flex items-center text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Priority Support
                  </li>
                </ul>
                <button
                  onClick={() => setSelectedTier('pro')}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                    selectedTier === 'pro'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
                      : 'bg-[#0F0F0F] text-gray-300 hover:bg-[#1A1A1A]'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedTier === 'pro' ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={`mt-8 w-full max-w-md py-3 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                isProcessing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </div>

          <div className="text-center text-gray-300 mt-8">
            <p>Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGate; 