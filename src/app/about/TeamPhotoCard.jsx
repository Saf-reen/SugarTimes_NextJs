"use client";
import { useState } from "react";
import Image from "next/image";

export default function TeamPhotoCard({ member }) {
  const [imgError, setImgError] = useState(false);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative group flex flex-col items-center text-center">
      {/* Photo */}
      <div className="relative mb-6">
        {/* Decorative ring on hover */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500">
          {!imgError ? (
            <Image
              src={member.image}
              alt={`${member.name} — ${member.role}, Sugar Times Magazine`}
              fill
              sizes="176px"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
              <span className="text-white text-4xl font-black">{initials}</span>
            </div>
          )}
        </div>
        {/* Role badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-green-500/30 whitespace-nowrap">
          {member.role}
        </div>
      </div>

      {/* Info */}
      <h3 className="text-xl font-black text-slate-900 mt-3 mb-1">{member.name}</h3>
      <p className="text-green-600 text-[12px] font-bold uppercase tracking-widest mb-3">
        {member.role}
      </p>
      <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{member.desc}</p>
    </div>
  );
}
