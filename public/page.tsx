"use client";
import React from "react";

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = React.useState<"monthly" | "annual">(
    "annual"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1A1A1A] text-gray-200 font-sans">
      {/* HEADER */}
      <header className="border-b border-[#2A2A2A]/50 backdrop-blur-lg bg-[#121212]/80 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
            vrdAI
          </h1>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <a
              href="/login"
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Sign In
            </a>
            <a
              href="/dashboard/analyze"
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg"
            >
              Launch App
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent z-10" />
            <img
              src="https://readdy.ai/api/search-image?query=futuristic%20financial%20market%20visualization%20with%20glowing%20green%20lines%20and%20charts%20on%20dark%20background%2C%20professional%20financial%20dashboard%20with%20market%20analysis%20data%2C%20sleek%20modern%20design%20with%20green%20accents%2C%20high%20quality%20digital%20art&width=1200&height=600&seq=hero1&orientation=landscape"
              alt="Financial data"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                AI-Powered Market Analysis at Your Fingertips
              </h1>
              <p className="text-2xl text-gray-300 mb-10">
                Real-time insights, advanced technical analysis, and AI
                predictions for stocks, crypto &amp; forex.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/dashboard/analyze"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg"
                >
                  Launch App
                </a>
                <a
                  href="#demo"
                  className="px-8 py-4 bg-[#2D2D2D] hover:bg-[#353535] text-white rounded-xl border border-[#3D3D3D]/30"
                >
                  <i className="fas fa-play-circle mr-2" />
                  Watch Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-[#121212]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Unlock the full potential of your investments with AI-powered
                tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example feature */}
              <Feature
                icon="fas fa-robot"
                title="AI-Powered Analysis"
                desc="Instant, detailed analysis of any asset using advanced AI."
              />
              <Feature
                icon="fas fa-chart-line"
                title="Real-Time Charts"
                desc="Professional charts with pattern recognition & indicators."
              />
              <Feature
                icon="fas fa-comments"
                title="Natural Conversations"
                desc="Ask questions in plain English and get actionable insights."
              />
              <Feature
                icon="fas fa-history"
                title="Analysis History"
                desc="Revisit past analyses to refine your strategy."
              />
              <Feature
                icon="fas fa-globe"
                title="Multi-Market Support"
                desc="Stocks, crypto, and forex in a single dashboard."
              />
              <Feature
                icon="fas fa-mobile-alt"
                title="Accessible Anywhere"
                desc="Responsive design so you never miss an opportunity."
              />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-20 bg-[#1A1A1A]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Unlimited access to all features with affordable subscription
                plans.
              </p>

              {/* Plan switch */}
              <div className="flex justify-center mt-8">
                <div className="bg-[#252525] p-1.5 rounded-lg inline-flex">
                  <SwitchButton
                    active={selectedPlan === "monthly"}
                    onClick={() => setSelectedPlan("monthly")}
                  >
                    Monthly
                  </SwitchButton>
                  <SwitchButton
                    active={selectedPlan === "annual"}
                    onClick={() => setSelectedPlan("annual")}
                  >
                    Annual
                  </SwitchButton>
                </div>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="flex flex-col lg:flex-row justify-center gap-8 max-w-5xl mx-auto">
              <PriceCard
                active={selectedPlan === "monthly"}
                title="Monthly Plan"
                price="$5"
                period="/month"
              />
              <PriceCard
                active={selectedPlan === "annual"}
                title="Annual Plan"
                price="$50"
                period="/year"
                badge="SAVE 17%"
              />
            </div>

            <p className="text-center mt-10 text-gray-400">
              All plans include a 7-day free trial. No credit card required.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-[#121212]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Everything you need to know about vrdAI.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <Faq
                q="How accurate is the AI analysis?"
                a="Our AI is trained on vast historical data. While no prediction
                   is 100 % accurate, vrdAI provides high-quality insights based
                   on comprehensive analysis."
              />
              <Faq
                q="Can I cancel anytime?"
                a="Yes. Cancel from your account page and retain access until
                   the end of the billing period."
              />
              <Faq
                q="Which markets are supported?"
                a="Major global equities, top 500 crypto assets, and major
                   forex pairs. More coming soon."
              />
              <Faq
                q="Is my data secure?"
                a="All traffic is encrypted; we never share your data with
                   third parties."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1A1A1A] border-t border-[#2A2A2A]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to transform your market analysis?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Join thousands of traders using vrdAI to make smarter decisions.
            </p>
            <a
              href="/dashboard/analyze"
              className="px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white text-lg rounded-xl shadow-lg"
            >
              Get Started Now
            </a>
            <p className="mt-6 text-gray-500">
              No credit card required for 7-day free trial
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#121212] border-t border-[#2A2A2A] py-12">
        <div className="container mx-auto px-6">
          {/* …footer content from original snippet… */}
          <p className="text-center text-gray-500 mt-6">
            © 2025 vrdAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ----- Helper sub-components below ----- */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#2A2A2A] hover:border-green-500/30 transition-all shadow-lg hover:shadow-green-500/5">
      <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
        <i className={`${icon} text-2xl text-green-500`} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function SwitchButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-md transition ${
        active
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function PriceCard({
  active,
  title,
  price,
  period,
  badge,
}: {
  active: boolean;
  title: string;
  price: string;
  period: string;
  badge?: string;
}) {
  return (
    <div
      className={`bg-[#252525] rounded-2xl border-2 transition transform ${
        active
          ? "border-green-500 shadow-lg shadow-green-500/10 scale-105"
          : "border-[#353535]"
      }`}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          {badge && (
            <span className="bg-green-500/20 text-green-400 text-xs font-bold py-1 px-2 rounded">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-end mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-400 ml-2">{period}</span>
        </div>
        <ul className="space-y-3 mb-8 text-sm">
          <li className="flex items-start">
            <i className="fas fa-check text-green-500 mr-2 mt-0.5" />
            Unlimited AI-powered analyses
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-green-500 mr-2 mt-0.5" />
            Real-time market data
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-green-500 mr-2 mt-0.5" />
            Advanced charts
          </li>
          <li className="flex items-start">
            <i className="fas fa-check text-green-500 mr-2 mt-0.5" />
            Stocks · Crypto · Forex
          </li>
        </ul>
        <a
          href="/upgrade"
          className={`block text-center py-3 rounded-xl ${
            active
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              : "bg-[#353535] text-gray-300 hover:bg-[#404040]"
          }`}
        >
          Subscribe Now
        </a>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
      <h3 className="text-xl font-bold mb-3">{q}</h3>
      <p className="text-gray-400">{a}</p>
    </div>
  );
}
