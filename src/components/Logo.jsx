"use client";
import Image from "next/image";

export default function Logo({ className = "", showText = true }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-green-500/30">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M20 5C12 5 6 11 6 19C6 25 9.5 30 15 32.5C15 29 16 26.5 18 25C14 24 12 21.5 12 19C12 14.5 15.5 11 20 11C24.5 11 28 14.5 28 19C28 21.5 26 24 22 25C24 26.5 25 29 25 32.5C30.5 30 34 25 34 19C34 11 28 5 20 5Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M20 27C18.5 27 17.2 27.6 16.3 28.6C17.4 33.2 18.7 36 20 36C21.3 36 22.6 33.2 23.7 28.6C22.8 27.6 21.5 27 20 27Z"
            fill="white"
            fillOpacity="0.7"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-black tracking-tight text-slate-900">
            Sugar<span className="text-green-600">Times</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Industry Portal
          </span>
        </div>
      )}
    </div>
  );
}
