import React from "react";
import { CalculationResult, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Coins,
  Square,
  Clock,
  Boxes,
  Users,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";

interface SummaryCardsProps {
  result: CalculationResult;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  result,
  currency,
  language
}) => {
  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";

  const formatMoney = (val: number) => {
    if (currency === "INR") {
      if (val >= 10000000) {
        return `${symbol}${(val / 10000000).toFixed(2)} Cr`;
      } else if (val >= 100000) {
        return `${symbol}${(val / 100000).toFixed(2)} Lakh`;
      }
      return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
    }
    return `${symbol}${Math.round(val).toLocaleString("en-US")}`;
  };

  const materialPercent = Math.round((result.materialCostTotal / result.totalCost) * 100);
  const labourPercent = Math.round((result.labourCostTotal / result.totalCost) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Estimated Cost - Highlight Bento Block */}
      <div className="bg-amber-400 text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-slate-900/10 group-hover:scale-110 transition">
          <Coins className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-black uppercase tracking-wider block mb-1 text-slate-900">
            {language === "hi" ? "01. कुल अनुमानित लागत" : "01. Total Estimated Cost"}
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-tight my-1">
            {formatMoney(result.totalCost)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-900 mt-2 font-bold">
            <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold border border-slate-900">
              {symbol}{Math.round(result.costPerSqFt).toLocaleString("en-IN")}/sq.ft
            </span>
            <span className="text-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              {language === "hi" ? "औसत दर" : "avg unit rate"}
            </span>
          </div>
        </div>
      </div>

      {/* Builtup Area & Duration - White Bento Block */}
      <div className="bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
              {language === "hi" ? "02. निर्मित एरिया व समय" : "02. Builtup Area & Duration"}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
              {result.totalBuiltUpAreaSqFt.toLocaleString("en-IN")}{" "}
              <span className="text-xs font-sans font-bold text-slate-500">SQ.FT.</span>
            </div>
          </div>
          <div className="p-2 bg-slate-100 border-2 border-slate-900 text-slate-900">
            <Square className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-slate-800">
          <span className="flex items-center gap-1 font-bold text-slate-500 uppercase text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {language === "hi" ? "अनुमानित समय:" : "Est. Timeline:"}
          </span>
          <span className="font-mono font-black text-slate-900 text-sm">
            {result.estimatedDurationMonths} {language === "hi" ? "महीने" : "MONTHS"}
          </span>
        </div>
      </div>

      {/* Material Cost Breakdown - White Bento Block */}
      <div className="bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
              {language === "hi" ? "03. कुल सामान (Material)" : "03. Total Material Cost"}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-emerald-600">
              {formatMoney(result.materialCostTotal)}
            </div>
          </div>
          <div className="p-2 bg-emerald-100 border-2 border-slate-900 text-emerald-800">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-slate-100">
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span className="text-slate-500 uppercase text-[10px]">{language === "hi" ? "सामान का हिस्सा" : "Material Share"}</span>
            <span className="font-mono text-emerald-600 font-black">{materialPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 border border-slate-900 h-2.5 overflow-hidden p-[1px]">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${materialPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Labour & Contractor Cost - Dark Bento Block */}
      <div className="bg-slate-900 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              {language === "hi" ? "04. मजदूरी (Labour Cost)" : "04. Total Labour Cost"}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-400">
              {formatMoney(result.labourCostTotal)}
            </div>
          </div>
          <div className="p-2 bg-slate-800 border-2 border-slate-700 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-slate-800">
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span className="text-slate-400 uppercase text-[10px]">{language === "hi" ? "मजदूरी का हिस्सा" : "Labour Share"}</span>
            <span className="font-mono text-amber-400 font-black">{labourPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 border border-slate-700 h-2.5 overflow-hidden p-[1px]">
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${labourPercent}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
