"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle, CreditCard, Phone, Mail } from "lucide-react";
import { subscriptionsAPI } from "@/lib/api";

const SEARCH_TYPES = [
  {
    value: "memberNumber",
    label: "Member Number",
    icon: CreditCard,
    placeholder: "e.g., SUG-001234",
    hint: "Printed on your magazine label or subscription form",
  },
  {
    value: "mobile",
    label: "Mobile Number",
    icon: Phone,
    placeholder: "e.g., 9876543210 (10 digits)",
    hint: "Enter your 10-digit registered mobile number",
  },
  {
    value: "email",
    label: "Email Address",
    icon: Mail,
    placeholder: "e.g., subscriber@example.com",
    hint: "Your registered email address",
  },
];

export default function SubscriptionSearch({ onSubscriptionFound }) {
  const [searchType, setSearchType] = useState("memberNumber");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeType = SEARCH_TYPES.find((t) => t.value === searchType);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!searchValue.trim()) {
      setError("Please enter a search value");
      return;
    }

    setLoading(true);
    try {
      const response = await subscriptionsAPI.search({ [searchType]: searchValue });
      onSubscriptionFound(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Subscription not found. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden mb-14">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white px-6 md:px-8 py-5 border-b border-slate-200">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
          Find Your Existing Subscription
        </h2>
        <p className="text-sm text-slate-500">
          Enter any one of the following to find your subscription record
        </p>
      </div>

      <div className="px-6 md:px-8 py-6">
        <form onSubmit={handleSearch}>
          {/* Search Type Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {SEARCH_TYPES.map((option) => {
              const Icon = option.icon;
              const isActive = searchType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSearchType(option.value);
                    setSearchValue("");
                    setError("");
                  }}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    isActive
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-md"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="text-xs md:text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={searchType === "mobile" ? "tel" : "text"}
              placeholder={activeType.placeholder}
              value={searchValue}
              onChange={(e) => {
                if (searchType === "mobile") {
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  if (digitsOnly.length > 10) return;
                  setSearchValue(digitsOnly);
                  return;
                }
                setSearchValue(e.target.value);
              }}
              {...(searchType === "mobile" && { maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" })}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800 placeholder-slate-400 text-base transition-all"
            />
          </div>
          <p className="text-xs text-slate-400 mb-5 pl-1">{activeType.hint}</p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find My Subscription
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
