"use client";
import { useEffect, useState } from "react";

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const PinterestIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.85 6.37 9.3-.09-.79-.17-2 .04-2.87.19-.77 1.21-4.93 1.21-4.93s-.31-.62-.31-1.54c0-1.44.84-2.52 1.88-2.52.89 0 1.31.67 1.31 1.46 0 .89-.57 2.22-.86 3.45-.25 1.04.52 1.88 1.53 1.88 1.84 0 3.25-1.94 3.25-4.74 0-2.47-1.78-4.21-4.32-4.21-2.94 0-4.67 2.21-4.67 4.49 0 .89.34 1.84.77 2.36.08.1.1.19.07.29l-.3 1.22c-.05.19-.15.24-.35.14-1.31-.61-2.13-2.52-2.13-4.06 0-3.3 2.4-6.34 6.91-6.34 3.63 0 6.45 2.59 6.45 6.04 0 3.6-2.27 6.5-5.43 6.5-1.06 0-2.06-.55-2.4-1.2l-.65 2.49c-.24.91-.88 2.05-1.31 2.75.99.31 2.03.47 3.12.47 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 3C9.37 3 4 8.37 4 15c0 2.64.86 5.08 2.32 7.06L5 29l7.13-1.27A11.94 11.94 0 0016 27c6.63 0 12-5.37 12-12S22.63 3 16 3z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ArticleShareBar({ url, title, showLabel = true }) {
  // Prefer the live browser URL so the share targets always open
  // the actual page the user is on — fixes sharing "localhost" or
  // stale SSR-provided URLs in production.
  const [liveUrl, setLiveUrl] = useState(url || "");
  useEffect(() => {
    if (typeof window !== "undefined") setLiveUrl(window.location.href);
  }, []);

  const shareTitle = encodeURIComponent(title || "");
  const shareUrl = encodeURIComponent(liveUrl);

  const buttons = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      bg: "bg-[#1877F2] hover:bg-[#0d5dcc]",
      icon: <FacebookIcon />,
    },
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}&via=SugarTimes`,
      bg: "bg-black hover:bg-slate-800",
      icon: <XIcon />,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`,
      bg: "bg-[#E60023] hover:bg-red-700",
      icon: <PinterestIcon />,
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`,
      bg: "bg-[#25D366] hover:bg-green-600",
      icon: <WhatsAppIcon />,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}`,
      bg: "bg-[#0A66C2] hover:bg-blue-800",
      icon: <LinkedInIcon />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <button
          type="button"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({ url: liveUrl, title }).catch(() => {});
            }
          }}
          className="px-3 h-8 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest transition-colors"
        >
          Share
        </button>
      )}
      {buttons.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${b.label}`}
          title={`Share on ${b.label}`}
          className={`${b.bg} text-white w-8 h-8 rounded-md flex items-center justify-center transition-colors shadow-sm`}
        >
          {b.icon}
        </a>
      ))}
    </div>
  );
}
