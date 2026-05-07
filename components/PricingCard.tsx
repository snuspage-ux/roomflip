"use client";

import { motion } from "motion/react";

interface PricingCardProps {
  id: string;
  credits: number;
  usd: number;
  label: string;
  description: string;
  popular?: boolean;
  onSelect: (packageId: string) => void;
  disabled?: boolean;
}

export default function PricingCard({
  id,
  credits,
  usd,
  label,
  description,
  popular = false,
  onSelect,
  disabled = false,
}: PricingCardProps) {
  const perCredit = (usd / credits).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl border p-6 flex flex-col transition-all ${
        popular
          ? "bg-gradient-to-b from-indigo-500/10 to-indigo-900/5 border-indigo-500/40 shadow-lg shadow-indigo-500/10 scale-105"
          : "bg-white/[0.03] border-white/10 hover:border-white/20"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
          Best Value
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1">{label}</h3>
        <p className="text-sm text-slate-400 mb-4">{description}</p>

        <div className="mb-4">
          <span className="text-4xl font-bold">${usd}</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl font-bold text-indigo-400">{credits}</span>
          <div>
            <p className="text-sm font-medium">Credits</p>
            <p className="text-xs text-slate-500">${perCredit}/credit</p>
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {credits} room redesigns
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            All 17 styles available
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            HD download
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Credits never expire
          </li>
        </ul>
      </div>

      <button
        onClick={() => onSelect(id)}
        disabled={disabled}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
          popular
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
            : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Buy Now
      </button>
    </motion.div>
  );
}
