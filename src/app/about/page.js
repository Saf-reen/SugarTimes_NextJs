import React from "react";
import Link from "next/link";
import { mockMagazines } from "@/lib/mockData";

export const metadata = { title: "About – Sugartimes" };

async function getMagazines() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/magazines`, { cache: "no-store", next: { revalidate: 0 } });
    const data = res.ok ? await res.json() : [];
    return data;
  } catch (err) {
    return [];
  }
}

export default async function AboutPage() {
  const dbMagazines = await getMagazines();
  const magazines = dbMagazines.length > 0 ? dbMagazines.slice(0, 3) : mockMagazines.slice(0, 3);
  
  // ensure we have at least 3
  if (magazines.length < 3) magazines.push(...mockMagazines.slice(0, 3 - magazines.length));
  
  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=400";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${apiUrl}${url}`;
  };
  
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 font-sans overflow-hidden">
      {/* Decorative background waves */}
      <div className="absolute top-1/4 left-0 right-0 h-96 opacity-30 pointer-events-none" 
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(200,210,250,0.5) 41%, transparent 42%, transparent 45%, rgba(200,210,250,0.5) 46%, transparent 47%, transparent 50%, rgba(200,210,250,0.5) 51%, transparent 52%, transparent 100%)",
          backgroundSize: "200px 200px",
          transform: "scaleY(0.3) scaleX(2) rotate(-10deg)"
        }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Top Header Logo Replacement (as seen in image inside the page content) */}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            {/* Simple sugarcane icon representation */}
            <div className="flex gap-0.5">
              <div className="w-1 h-5 bg-white rounded-t-sm rotate-12"></div>
              <div className="w-1 h-6 bg-white rounded-t-sm -mt-1"></div>
              <div className="w-1 h-5 bg-white rounded-t-sm -rotate-12"></div>
            </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
              <span className="text-3xl font-black text-slate-900 tracking-tight">Sugar</span>
              <span className="text-3xl font-black text-green-500 tracking-tight ml-1">Times</span>
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-[#2c3e50] ml-1 mt-0.5">MAGAZINE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start mb-16">
          
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-slate-800 uppercase mb-2">Sugar Industry News</p>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                Covering the <span className="text-[#00ff00]">Latest</span> Trends
               </h1>
            </div>
            
            <div className="space-y-5 text-slate-600 text-sm leading-relaxed pr-0 md:pr-12">
              <p>
                Our readership includes sugar mills, distillery units, sugarcane farmers, molasses and
                ENA export traders, sugar institutes, sugar federations, cane societies, and the sugar
                department of state and national sugar allied industries.
              </p>
              <p>
                Our objective is to share information and knowledge on sugarcane policies, sugarcane
                farming techniques for farmers and the sugar industry. Our magazine covers a range
                of articles, write-ups, and news on government policies, sugar mill updates, molasses
                data, and other important data of the business.
              </p>
              <p>
                At Sugar Times Magazine, we are committed to providing high-quality, accurate, and timely information to our readers. We strive to be the go-to source for industry professionals, farmers, and anyone interested in the sugar industry. We welcome you to join us on this journey, and look forward to keeping you informed and engaged.
              </p>
            </div>
            
            {/* Mid-Left Additional Image */}
            <div className="mt-8">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" 
                alt="Digital reading devices" 
                className="w-full max-w-sm rounded-[2rem] shadow-xl object-cover h-64 grayscale opacity-90"
              />
            </div>
          </div>

          {/* Right Column: Magazine Collage */}
          <div className="relative h-[400px] lg:h-full flex justify-center items-center mr-10 lg:mr-0 mt-8 lg:mt-0">
            <div className="relative w-full max-w-md h-full min-h-[400px]">
              {/* Back right magazine */}
              <div className="absolute top-4 right-0 w-44 rotate-12 shadow-2xl z-10 hover:z-40 transition-all duration-300">
                <img src={getImageUrl(magazines[2]?.cover)} alt="Magazine Cover 3" className="w-full h-auto border-4 border-white shadow-xl" />
               </div>
               
              {/* Front center magazine */}
              <div className="absolute top-10 left-12 w-48 shadow-2xl z-20 hover:z-40 transition-all duration-300">
                <img src={getImageUrl(magazines[0]?.cover)} alt="Magazine Cover 1" className="w-full h-auto border-4 border-white shadow-xl" />
               </div>

              {/* Back left magazine */}
              <div className="absolute top-0 -left-6 w-44 -rotate-12 shadow-2xl z-10 hover:z-40 transition-all duration-300">
                <img src={getImageUrl(magazines[1]?.cover)} alt="Magazine Cover 2" className="w-full h-auto border-4 border-white shadow-xl" />
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Related Industry News */}
        <div className="pt-8 relative z-20">
          <h2 className="text-2xl font-black text-slate-800 mb-8">Related Industry News</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Round Card 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#f8f9ff]">
                <img 
                  src="https://images.unsplash.com/photo-1580983546535-618fc6f8f553?auto=format&fit=crop&q=80&w=400" 
                  alt="Sugar Mill" 
                  className="w-full h-full object-cover"
                />
             </div>
              <h3 className="font-bold text-slate-900 text-center">Sugar Mill</h3>
            </div>

            {/* Round Card 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#f8f9ff]">
                <img 
                  src="https://images.unsplash.com/photo-1605371661338-e67c52ed55da?auto=format&fit=crop&q=80&w=400" 
                  alt="Ethanol" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-900 text-center">Ethanol</h3>
            </div>

            {/* Round Card 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#f8f9ff]">
                <img 
                  src="https://images.unsplash.com/photo-1582294158914-f449339e0bd5?auto=format&fit=crop&q=80&w=400" 
                  alt="Cane Farming" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-900 text-center">Cane Farming</h3>
            </div>

            {/* Round Card 4 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#f8f9ff]">
                <img 
                  src="https://images.unsplash.com/photo-1541888086915-d41c88849b28?auto=format&fit=crop&q=80&w=400" 
                  alt="Technician" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-900 text-center">Technician</h3>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

