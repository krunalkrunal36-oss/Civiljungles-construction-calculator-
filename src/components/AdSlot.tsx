/// <reference types="vite/client" />
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export type AdLocation =
  | "top-header"
  | "mid-content"
  | "sidebar-rect"
  | "calculator-bottom"
  | "bottom-sticky";

interface AdSlotProps {
  location: AdLocation;
  slotId?: string;
  clientId?: string;
  className?: string;
  labelEn?: string;
  labelHi?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  location,
  slotId,
  clientId,
  className = "",
  labelEn,
  labelHi,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  const env = (import.meta as any).env || {};

  // Civil Jungles AdSense Publisher ID & Default Ad Slot ID
  const DEFAULT_CLIENT_ID = "ca-pub-9616095780084968";
  const DEFAULT_SLOT_ID = "9287959002";

  // Environment variable fallback
  const finalClientId =
    clientId ||
    (env.VITE_GOOGLE_ADSENSE_CLIENT_ID as string) ||
    DEFAULT_CLIENT_ID;

  const getEnvSlot = () => {
    if (slotId) return slotId;
    switch (location) {
      case "top-header":
        return (env.VITE_ADSENSE_SLOT_TOP as string) || DEFAULT_SLOT_ID;
      case "mid-content":
        return (env.VITE_ADSENSE_SLOT_MID as string) || DEFAULT_SLOT_ID;
      case "sidebar-rect":
        return (env.VITE_ADSENSE_SLOT_SIDEBAR as string) || DEFAULT_SLOT_ID;
      case "calculator-bottom":
        return (env.VITE_ADSENSE_SLOT_CALCULATOR as string) || DEFAULT_SLOT_ID;
      case "bottom-sticky":
        return (env.VITE_ADSENSE_SLOT_BOTTOM as string) || DEFAULT_SLOT_ID;
      default:
        return DEFAULT_SLOT_ID;
    }
  };

  const finalSlotId = getEnvSlot();

  useEffect(() => {
    if (finalClientId && !pushedRef.current) {
      // Load Google AdSense Script if not present
      const scriptId = "google-adsense-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${finalClientId}`;
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }

      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [finalClientId]);

  // Dimensions & layout per location
  const getLocationDetails = () => {
    switch (location) {
      case "top-header":
        return {
          title: "Top Header Leaderboard Ad (728x90 / Responsive)",
          desc: "High viewability ad placement directly below main navigation.",
          format: "auto",
          style: { display: "block" },
          minHeight: "h-24 sm:h-28",
        };
      case "mid-content":
        return {
          title: "Mid-Content In-Feed Ad (Responsive Banner)",
          desc: "High engagement ad slot placed between estimate breakdown and material tables.",
          format: "auto",
          style: { display: "block" },
          minHeight: "h-28 sm:h-32",
        };
      case "sidebar-rect":
        return {
          title: "Sidebar Rectangle Ad (300x250 / 336x280)",
          desc: "Perfect for display units alongside project parameters.",
          format: "rectangle",
          style: { display: "inline-block", width: "100%", height: "280px" },
          minHeight: "h-64",
        };
      case "calculator-bottom":
        return {
          title: "Calculator Bottom Banner Ad (Responsive)",
          desc: "Placed at bottom of specialized calculators (Tiles, Electrical, Paint, etc.)",
          format: "auto",
          style: { display: "block" },
          minHeight: "h-24 sm:h-28",
        };
      case "bottom-sticky":
        return {
          title: "Bottom Sticky Anchor Banner Ad",
          desc: "High RPM mobile anchor ad slot visible at the page bottom.",
          format: "horizontal",
          style: { display: "block" },
          minHeight: "h-16 sm:h-20",
        };
    }
  };

  const details = getLocationDetails();

  return (
    <div
      ref={adRef}
      className={`w-full my-4 text-center overflow-hidden print:hidden ${className}`}
    >
      {finalClientId ? (
        <div className="w-full flex justify-center items-center bg-slate-50 border border-slate-200 rounded p-1 min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={details.style}
            data-ad-client={finalClientId}
            data-ad-slot={finalSlotId}
            data-ad-format={details.format}
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        /* Placeholder Container when AdSense Client ID is not yet filled in */
        <div
          className={`w-full border-2 border-dashed border-amber-400 bg-amber-50/60 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center text-slate-800 transition hover:bg-amber-100/50 ${details.minHeight}`}
        >
          <div className="flex items-center gap-2 flex-wrap justify-center mb-1">
            <span className="text-[10px] sm:text-xs font-black uppercase text-amber-900 bg-amber-300 px-2 py-0.5 rounded border border-amber-500 shadow-sm">
              📢 GOOGLE ADS LOCATION: {location.toUpperCase()}
            </span>
            <span className="text-[11px] font-bold text-slate-600 font-mono">
              [Slot ID: {finalSlotId}]
            </span>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-900">
            {labelEn || details.title}
          </p>
          <p className="text-[11px] text-slate-600 max-w-xl text-center mt-0.5">
            {details.desc}
          </p>
          <div className="mt-2 text-[10px] font-mono bg-white px-2 py-1 border border-amber-300 rounded text-slate-700">
            To show real live Ads, add <code className="font-bold text-amber-800">VITE_GOOGLE_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXX"</code> in Cloudflare / environment variables.
          </div>
        </div>
      )}
    </div>
  );
};
