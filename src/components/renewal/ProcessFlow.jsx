"use client";

import { Search, RefreshCw, Bell, ArrowRight } from "lucide-react";

const PROCESS_STEPS = [
  {
    step: 1,
    icon: Search,
    title: "We Verify",
    description: "Our team verifies your payment within 1 working day.",
    color: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-600",
    bgLight: "bg-emerald-50",
  },
  {
    step: 2,
    icon: RefreshCw,
    title: "We Update",
    description:
      "Your subscription record is updated and your new validity date is set from your current expiry date (not from today \u2014 so you don\u2019t lose any time).",
    color: "from-sky-500 to-blue-600",
    iconColor: "text-sky-600",
    bgLight: "bg-sky-50",
  },
  {
    step: 3,
    icon: Bell,
    title: "We Confirm",
    description:
      "You receive a confirmation on WhatsApp / Email with your new Member Number and Valid Upto date.",
    color: "from-violet-500 to-purple-600",
    iconColor: "text-violet-600",
    bgLight: "bg-violet-50",
  },
];

export default function ProcessFlow() {
  return (
    <div className="mb-14">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          What Happens After You Submit?
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Simple 3-step verification process
        </p>
      </div>

      {/* Horizontal Steps */}
      <div className="grid md:grid-cols-3 gap-5">
        {PROCESS_STEPS.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div key={idx} className="relative">
              {/* Connector arrow (desktop) */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 z-10 w-8 items-center justify-center -translate-y-1/2">
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              )}

              {/* Step Card */}
              <div className={`relative ${item.bgLight} rounded-2xl border border-slate-200 p-6 h-full hover:shadow-lg transition-all duration-300`}>
                {/* Step Number */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-black text-lg shadow-lg mb-4`}
                >
                  {item.step}
                </div>

                {/* Icon + Content */}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  <h3 className="font-black text-lg text-slate-900">{item.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Note */}
      <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-center">
        <p className="text-slate-900 font-bold text-sm">
          Your new subscription starts from the day after your current subscription ends &mdash; you never lose a single issue.
        </p>
      </div>
    </div>
  );
}
