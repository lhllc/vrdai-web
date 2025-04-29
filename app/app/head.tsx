/**
 * app/head.tsx
 * Shared <head> for every page — adds Font-Awesome + TradingView script
 */

export default function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>vrdAI</title>

      {/* Font-Awesome icons used in the landing page */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      {/* TradingView widget script required by <LiveChart /> */}
      <script src="https://s3.tradingview.com/tv.js"></script>
    </>
  );
}
