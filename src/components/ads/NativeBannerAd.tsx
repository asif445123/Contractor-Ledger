"use client";

import Script from "next/script";

// Adsterra Native Banner — the invoke.js script looks for the div below by
// its exact id and injects the ad into it. The div must exist before the
// script runs, which afterInteractive guarantees.
export default function NativeBannerAd() {
  return (
    <div className="px-2 py-2">
      <div id="container-b98688a92c5347b41dbb7472b614fcb1" />
      <Script
        async
        data-cfasync="false"
        src="https://pl31002720.profitableratecpmnetwork.com/b98688a92c5347b41dbb7472b614fcb1/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
