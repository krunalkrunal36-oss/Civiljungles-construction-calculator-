import React, { useState } from "react";
import { PhaseCostDetail, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Boxes,
  Users,
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
  Brush,
  Wrench,
  Construction
} from "lucide-react";

interface PhaseBreakdownProps {
  phases: PhaseCostDetail[];
  currency: CurrencyCode;
  language: LanguageMode;
}

export const PhaseBreakdown: React.FC<PhaseBreakdownProps> = ({
  phases,
  currency,
  language
}) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>("phase_1");
  const [searchTerm, setSearchTerm] = useState("");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";

  const formatMoney = (val: number) => {
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedPhaseId((prev) => (prev === id ? null : id));
  };

  const filteredPhases = phases.filter((p) => {
    const text = `${p.titleEn} ${p.titleHi} ${p.descriptionEn} ${p.descriptionHi} ${p.keyMaterials.join(" ")}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const getPhaseIcon = (phaseNumber: number) => {
    switch (phaseNumber) {
      case 1:
        return <Construction className="w-5 h-5 text-amber-600" />;
      case 2:
      case 3:
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 4:
      case 5:
        return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 6:
      case 7:
        return <Boxes className="w-5 h-5 text-purple-600" />;
      case 8:
        return <Zap className="w-5 h-5 text-amber-600 fill-amber-400" />;
      case 9:
        return <Wrench className="w-5 h-5 text-cyan-600" />;
      case 10:
        return <Brush className="w-5 h-5 text-pink-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-slate-900" />;
    }
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-400 border-2 border-slate-900 text-slate-900 font-black shadow-[2px_2px_0px_0px_#0F172A]">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi"
                ? "चरन दर चरन निर्माण लागत (सफाई से लेकर स्विच बोर्ड तक)"
                : "Phase-Wise Construction Cost Breakdown"}
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            {language === "hi"
              ? "प्रत्येक चरण में लगने वाला सामान, मजदूरी और इंजीनियर चेकलिस्ट"
              : "Detailed material, labour and civil inspection checklist from site cleaning to switchboards"}
          </p>
        </div>

        {/* Search Bar - Bento Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === "hi"
                ? "खोजें (जैसे: स्विच, खुदाई, टाइल्स)..."
                : "Search phase or material (e.g. Switch, Tile)..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-900 pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none uppercase"
          />
        </div>
      </div>

      {/* Phase Accordion Cards */}
      <div className="space-y-3">
        {filteredPhases.map((p) => {
          const isExpanded = expandedPhaseId === p.id;

          return (
            <div
              key={p.id}
              className={`border-2 border-slate-900 transition-all duration-200 overflow-hidden shadow-[2px_2px_0px_0px_#0F172A] ${
                isExpanded
                  ? "bg-amber-50/70"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              {/* Accordion Bar */}
              <div
                onClick={() => toggleExpand(p.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-amber-400 font-mono font-black text-xs flex items-center justify-center border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]">
                    #{p.phaseNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-white border border-slate-900">
                        {getPhaseIcon(p.phaseNumber)}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                        {language === "hi" ? p.titleHi : p.titleEn}
                      </h3>
                      {p.phaseNumber === 8 && (
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black uppercase border border-slate-900">
                          {language === "hi" ? "स्विच व वायरिंग" : "Switches & Wiring"}
                        </span>
                      )}
                      {p.phaseNumber === 1 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-black uppercase border border-slate-900">
                          {language === "hi" ? "शुरुआती सफाई" : "Site Clearance"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {language === "hi" ? p.descriptionHi : p.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Cost & Expand Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-slate-200 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-mono font-black text-slate-900">
                      {formatMoney(p.totalCost)}
                    </div>
                    <div className="text-[11px] text-slate-600 font-bold uppercase">
                      {p.percentageOfTotal}% {language === "hi" ? "कुल बजट का" : "of total budget"}
                    </div>
                  </div>

                  <div className="p-1.5 bg-white border-2 border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#0F172A]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t-2 border-slate-900 bg-white space-y-4">
                  
                  {/* Cost Split: Material vs Labour */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Material Cost */}
                    <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-emerald-100 text-emerald-900 border border-slate-900 font-bold">
                          <Boxes className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block font-bold uppercase">
                            {language === "hi" ? "सामान लागत (Material)" : "Material Cost"}
                          </span>
                          <span className="text-sm font-mono font-black text-emerald-700">
                            {formatMoney(p.materialCost)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900 bg-amber-400 px-2 py-1 border border-slate-900">
                        {Math.round((p.materialCost / (p.totalCost || 1)) * 100)}%
                      </span>
                    </div>

                    {/* Labour Cost */}
                    <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-cyan-100 text-cyan-900 border border-slate-900 font-bold">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block font-bold uppercase">
                            {language === "hi" ? "मजदूरी लागत (Labour)" : "Labour Cost"}
                          </span>
                          <span className="text-sm font-mono font-black text-cyan-800">
                            {formatMoney(p.labourCost)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900 bg-cyan-200 px-2 py-1 border border-slate-900">
                        {Math.round((p.labourCost / (p.totalCost || 1)) * 100)}%
                      </span>
                    </div>

                  </div>

                  {/* Key Materials Chips */}
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase block mb-2 tracking-wider">
                      {language === "hi" ? "मुख्य सामग्री व घटक:" : "Key Materials & Components:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {p.keyMaterials.map((mat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-bold border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 bg-amber-400"></span>
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Civil Engineer Quality Inspection Tips */}
                  <div className="bg-amber-100 border-2 border-slate-900 p-3.5 shadow-[2px_2px_0px_0px_#0F172A] space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-black uppercase text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-slate-900" />
                      <span>
                        {language === "hi"
                          ? "सिविल इंजीनियर जांच सूची (साइट पर ध्यान दें)"
                          : "Civil Engineering Quality Checklist & Site Inspection Tips"}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs font-semibold text-slate-800 pl-5 list-disc marker:text-slate-900">
                      {(language === "hi" ? p.inspectionTipsHi : p.inspectionTipsEn).map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {filteredPhases.length === 0 && (
          <div className="text-center py-8 text-slate-500 font-bold text-xs uppercase">
            {language === "hi"
              ? "कोई परिणाम नहीं मिला। कृपया दूसरा शब्द खोजें।"
              : "No phases found matching your search term."}
          </div>
        )}
      </div>

    </div>
  );
};
