"use client";

import Script from "next/script";

// Adsterra 320x50 Banner — the atOptions config must run and finish before
// invoke.js loads, since invoke.js reads window.atOptions to build the ad
// iframe. Both scripts share the strategy so Next.js keeps them in order.
export default function SmallBannerAd() {
  return (
    <div className="flex justify-center py-2">
      <Script id="atOptions-320x50" strategy="afterInteractive">
        {`
          atOptions = {
            'key' : 'b540208433deddddf0193b8e6c3425f5',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        `}
      </Script>
      <Script
        src="https://www.highrevenueformat.com/b540208433deddddf0193b8e6c3425f5/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
