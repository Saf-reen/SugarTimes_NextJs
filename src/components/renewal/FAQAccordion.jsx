"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "My subscription expired a few months ago. Can I still renew?",
    answer:
      "Yes, absolutely. You can renew at any time, even if your subscription has been expired for some time. Your new validity will start from the date of renewal.",
  },
  {
    question: "Will my new subscription start from today or from my old expiry date?",
    answer:
      "If your subscription is still active or expiring soon, renewal is added from your current expiry date \u2014 so you don\u2019t lose a single issue. If it has already expired, renewal starts from the current month.",
  },
  {
    question: "I don\u2019t remember my Member Number. What should I do?",
    answer:
      "You can find your Member Number printed on the address label of your magazine. Alternatively, search using your registered mobile number or email on this page, or call us on +91 7355453462.",
  },
  {
    question: "Can I change from Print to Digital (or Digital to Print) at renewal?",
    answer:
      "Yes. Please mention your preferred change when confirming your renewal, and our team will update your subscription type accordingly.",
  },
  {
    question: "I have moved to a new address. How do I update it?",
    answer:
      'Use the "Update My Details" section on this page during renewal, or call/WhatsApp us on +91 7355453462 before your next issue is dispatched.',
  },
  {
    question: "I paid but did not receive a confirmation. What should I do?",
    answer:
      "Please WhatsApp your payment screenshot along with your name and Member Number to +91 7355453462. We will verify and confirm within 1 working day.",
  },
  {
    question: "Do you offer any discount on renewal?",
    answer:
      "Our 2-year and 3-year plans already offer savings over the single-year rate. Special loyalty discounts may be available for long-standing subscribers \u2014 please contact us directly to enquire.",
  },
  {
    question: "Can I gift a subscription to someone else?",
    answer:
      "Yes! Contact us on +91 7355453462 or email info@sugartimes.co.in and we will set up a gift subscription with their delivery details.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle, index }) {
  return (
    <div className={`border-b border-slate-100 last:border-b-0 ${isOpen ? "bg-emerald-50/30" : ""}`}>
      <button
        onClick={onToggle}
        className="w-full py-5 px-6 md:px-8 text-left flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors duration-200"
      >
        <div className="flex items-start gap-3">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
            Q
          </span>
          <span className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">
            {question}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 md:px-8 pb-5">
          <div className="pl-9 text-slate-600 text-sm leading-relaxed">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-12">
      <div className="px-6 md:px-8 py-6 border-b border-slate-200">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Quick answers to common renewal questions
        </p>
      </div>

      <div>
        {FAQS.map((faq, idx) => (
          <FAQItem
            key={idx}
            index={idx}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
}

export { FAQS };
