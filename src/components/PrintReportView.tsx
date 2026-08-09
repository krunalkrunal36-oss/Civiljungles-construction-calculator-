import React from "react";
import { ProjectConfig, CalculationResult, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  HardHat,
  Printer,
  X,
  PieChart,
  Calendar,
  Zap,
  Droplets,
  DoorOpen,
  Grid,
  Bug,
  Paintbrush,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Globe,
  Boxes
} from "lucide-react";

interface PrintReportViewProps {
  config: ProjectConfig;
  result: CalculationResult;
  currency: CurrencyCode;
  language: LanguageMode;
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  config,
  result,
  currency,
  language,
  onClose
}) => {
  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";

  const handlePrint = () => {
    window.print();
  };

  const totalBuiltUpArea = config.builtUpAreaPerFloorFt * (config.floors + 1);

  // Specialized Estimates Calculation for Print Report
  const totalSwitches = Math.round(totalBuiltUpArea * 0.12);
  const electricalTotalINR = Math.round(totalSwitches * 1450);

  const numBathrooms = Math.max(2, Math.round(totalBuiltUpArea / 600));
  const plumbingTotalINR = Math.round(numBathrooms * 48000 + totalBuiltUpArea * 18);

  const doorCount = Math.max(4, Math.round(totalBuiltUpArea / 220));
  const windowCount = Math.max(4, Math.round(totalBuiltUpArea / 180));
  const doorsWindowsTotalINR = Math.round(doorCount * 14500 + windowCount * 11500);

  const tileSqFt = Math.round(totalBuiltUpArea * 1.15);
  const tilesTotalINR = Math.round(tileSqFt * 115);

  const plasterSqFt = Math.round(totalBuiltUpArea * 3.8);
  const plasterDefenseTotalINR = Math.round(plasterSqFt * 48 + totalBuiltUpArea * 32);

  const paintSqFt = Math.round(totalBuiltUpArea * 3.45);
  const paintTotalINR = Math.round(paintSqFt * 32);

  const matPercent = Math.round((result.materialCostTotal / result.totalCost) * 100);
  const labPercent = Math.round((result.labourCostTotal / result.totalCost) * 100);
  const conPercent = Math.round((result.contractorAndArchitectCost / result.totalCost) * 100);
  const bufPercent = 100 - matPercent - labPercent - conPercent;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto p-2 sm:p-6 flex flex-col items-center">
      
      {/* Top Floating Action Header (Hidden on Print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 bg-white border-2 border-slate-900 p-3 shadow-[4px_4px_0px_0px_#0F172A] print:hidden text-slate-900">
        <div className="flex items-center space-x-2">
          <HardHat className="w-5 h-5 text-amber-500" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900">
            {language === "hi" ? "प्रिंट एवं PDF एक्सपोर्ट रिपोर्ट" : "Print & PDF Civil Engineering Estimate"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs uppercase border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Printer className="w-4 h-4 text-slate-900" />
            <span>{language === "hi" ? "प्रिंट / PDF सेव करें" : "Print / Save PDF"}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Paper Canvas */}
      <div className="w-full max-w-4xl bg-white text-slate-900 p-6 sm:p-10 border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0F172A] print:shadow-none print:border-none print:p-0 space-y-6 text-xs sm:text-sm font-sans">
        
        {/* Document Header with Branding & Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center font-black shrink-0">
              <HardHat className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 border border-slate-900">
                  CIVILJUNGLES.COM
                </span>
                <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  {language === "hi" ? "आधिकारिक आईएस 1200 रिपोर्ट" : "IS 1200 Certified Engineering Report"}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black italic uppercase tracking-tight text-slate-900">
                {language === "hi"
                  ? "Civil Jungles — विस्तृत निर्माण लागत व मात्रा रिपोर्ट"
                  : "Civil Jungles — Detailed Construction Cost & Quantity Estimate"}
              </h1>
              <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wide">
                {language === "hi"
                  ? "सिविल इंजीनियरिंग अनुमान, सामग्री मात्रा, फिनिशिंग एवं समय-सारणी"
                  : "Civil Engineering Estimation, Phase Breakdown, Specialized Works & Timeline Roadmap"}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-700 font-mono bg-slate-50 p-2.5 border-2 border-slate-900 shrink-0 shadow-[2px_2px_0px_0px_#0F172A]">
            <p className="font-bold text-slate-900 uppercase">
              {language === "hi" ? "दिनांक: " : "Date: "}
              <span className="text-slate-900">{new Date().toLocaleDateString()}</span>
            </p>
            <p className="uppercase">
              {language === "hi" ? "गुणवत्ता: " : "Quality: "}
              <span className="font-bold text-amber-700">{config.grade} Grade</span>
            </p>
            <p className="uppercase">
              {language === "hi" ? "शहर: " : "Location: "}
              <span className="font-bold text-slate-900">{config.cityType}</span>
            </p>
          </div>
        </div>

        {/* Project Overview Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-amber-50/50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-600 block uppercase font-bold">
              {language === "hi" ? "कुल निर्मित क्षेत्रफल" : "Total Built-Up Area"}
            </span>
            <span className="text-sm sm:text-base font-mono font-black text-slate-900">
              {result.totalBuiltUpAreaSqFt.toLocaleString()} sq.ft
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              ({config.floors + 1} {language === "hi" ? "मंजिल" : "Floors"})
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-600 block uppercase font-bold">
              {language === "hi" ? "अनुमानित कुल लागत" : "Total Est. Cost"}
            </span>
            <span className="text-sm sm:text-base font-mono font-black text-amber-700">
              {symbol}{Math.round(result.totalCost).toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              ({language === "hi" ? "सभी चरण शामिल" : "All Phases Included"})
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-600 block uppercase font-bold">
              {language === "hi" ? "प्रति वर्ग फीट लागत" : "Cost Per Sq.Ft"}
            </span>
            <span className="text-sm sm:text-base font-mono font-black text-slate-900">
              {symbol}{Math.round(result.costPerSqFt).toLocaleString("en-IN")}/sq.ft
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              ({language === "hi" ? "सामग्री + मजदूरी" : "Material + Labour"})
            </span>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-600 block uppercase font-bold">
              {language === "hi" ? "अनुमानित समय" : "Est. Timeline"}
            </span>
            <span className="text-sm sm:text-base font-mono font-black text-slate-900">
              {result.estimatedDurationMonths} {language === "hi" ? "महीने" : "Months"}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              ({result.estimatedDurationWeeks} {language === "hi" ? "सप्ताह" : "Weeks"})
            </span>
          </div>
        </div>

        {/* 1. Cost Distribution Bar Chart Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b-2 border-slate-900 pb-1">
            <PieChart className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {language === "hi"
                ? "1. लागत विभाजन और प्रतिशत अनुपात (Cost Share & Ratio)"
                : "1. Cost Distribution & Category Ratios"}
            </h2>
          </div>

          <div className="p-4 border-2 border-slate-900 bg-white space-y-3">
            {/* Visual Bar Ratio */}
            <div className="w-full h-6 border-2 border-slate-900 flex overflow-hidden font-mono font-bold text-[10px] shadow-[2px_2px_0px_0px_#0F172A]">
              <div style={{ width: `${matPercent}%` }} className="bg-slate-900 text-white flex items-center justify-center">
                {matPercent}%
              </div>
              <div style={{ width: `${labPercent}%` }} className="bg-amber-400 text-slate-900 flex items-center justify-center">
                {labPercent}%
              </div>
              <div style={{ width: `${conPercent}%` }} className="bg-blue-500 text-white flex items-center justify-center">
                {conPercent}%
              </div>
              <div style={{ width: `${bufPercent}%` }} className="bg-emerald-500 text-white flex items-center justify-center">
                {bufPercent}%
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 border-2 border-slate-900 bg-slate-100">
                <span className="font-bold block text-slate-900">
                  {language === "hi" ? `सामग्री लागत (${matPercent}%)` : `Material Cost (${matPercent}%)`}
                </span>
                <span className="font-mono font-black text-slate-900">
                  {symbol}{Math.round(result.materialCostTotal).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2 border-2 border-slate-900 bg-amber-50">
                <span className="font-bold block text-slate-900">
                  {language === "hi" ? `मजदूरी लागत (${labPercent}%)` : `Labour Cost (${labPercent}%)`}
                </span>
                <span className="font-mono font-black text-amber-700">
                  {symbol}{Math.round(result.labourCostTotal).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2 border-2 border-slate-900 bg-blue-50">
                <span className="font-bold block text-slate-900">
                  {language === "hi" ? `ठेकेदार/आर्किटेक्ट (${conPercent}%)` : `Contractor & Arch (${conPercent}%)`}
                </span>
                <span className="font-mono font-black text-blue-700">
                  {symbol}{Math.round(result.contractorAndArchitectCost).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2 border-2 border-slate-900 bg-emerald-50">
                <span className="font-bold block text-slate-900">
                  {language === "hi" ? `आपातकालीन बफर (${bufPercent}%)` : `Contingency Buffer (${bufPercent}%)`}
                </span>
                <span className="font-mono font-black text-emerald-700">
                  {symbol}{Math.round(result.contingencyCost).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Phase Breakdown Table */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>
                {language === "hi"
                  ? "2. चरण-वार निर्माण विवरण (Phase-wise Cost Breakdown)"
                  : "2. Phase-wise Cost Breakdown (Plot Clearance to Switchboards)"}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 text-white font-bold uppercase">
                  <th className="p-2.5 border-r border-slate-700 text-center w-10">#</th>
                  <th className="p-2.5 border-r border-slate-700 font-sans">
                    {language === "hi" ? "चरण का नाम (Phase Description)" : "Phase Description"}
                  </th>
                  <th className="p-2.5 border-r border-slate-700 text-right">
                    {language === "hi" ? "सामग्री लागत" : "Material"}
                  </th>
                  <th className="p-2.5 border-r border-slate-700 text-right">
                    {language === "hi" ? "मजदूरी लागत" : "Labour"}
                  </th>
                  <th className="p-2.5 text-right">
                    {language === "hi" ? "कुल लागत" : "Total Cost"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-900 font-medium">
                {result.phases.map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-2 border-r border-slate-300 font-bold text-center">{p.phaseNumber}</td>
                    <td className="p-2 border-r border-slate-300 font-bold font-sans">
                      {language === "hi" ? p.titleHi : p.titleEn}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">
                      {symbol}{Math.round(p.materialCost).toLocaleString("en-IN")}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">
                      {symbol}{Math.round(p.labourCost).toLocaleString("en-IN")}
                    </td>
                    <td className="p-2 text-right font-black">
                      {symbol}{Math.round(p.totalCost).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-bold text-xs sm:text-sm">
                  <td colSpan={4} className="p-2.5 text-right uppercase">
                    {language === "hi" ? "कुल योग (Total Civil Phase Cost):" : "Total Civil Phase Sum:"}
                  </td>
                  <td className="p-2.5 text-right font-black">
                    {symbol}{Math.round(result.totalCost).toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 3. Timeline Schedule Roadmap */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2 border-b-2 border-slate-900 pb-1">
            <Calendar className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {language === "hi"
                ? "3. निर्माण समय-सारणी व माइलस्टोन रोडमैप"
                : "3. Construction Timeline Schedule & Stage Roadmap"}
            </h2>
          </div>

          <div className="border-2 border-slate-900 overflow-x-auto shadow-[2px_2px_0px_0px_#0F172A]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-mono uppercase font-bold border-b-2 border-slate-900">
                  <th className="p-2.5 border-r border-slate-700">
                    {language === "hi" ? "अवधि (Week / Period)" : "Week / Period"}
                  </th>
                  <th className="p-2.5 border-r border-slate-700">
                    {language === "hi" ? "चरण माइलस्टोन का नाम" : "Stage Milestone Name"}
                  </th>
                  <th className="p-2.5 border-r border-slate-700 text-center">
                    {language === "hi" ? "समय" : "Duration"}
                  </th>
                  <th className="p-2.5">
                    {language === "hi" ? "गुणवत्ता जांच दिशा-निर्देश" : "Key Quality Checkpoints"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium text-slate-900">
                {result.phases.map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-amber-700">
                      Weeks {idx * 2 + 1} - {(idx + 1) * 2}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold uppercase">
                      #{p.phaseNumber} {language === "hi" ? p.titleHi : p.titleEn}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">
                      {p.durationWeeks} {language === "hi" ? "हफ़्ते" : "Weeks"}
                    </td>
                    <td className="p-2 text-[11px] text-slate-700">
                      {language === "hi" ? p.descriptionHi : p.descriptionEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Specialized Finishing Works Summary */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
            {language === "hi"
              ? "4. विशेष कार्य अनुमान (Specialized Works Summary)"
              : "4. Specialized Finishing Works Estimate"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            
            <div className="p-2.5 border-2 border-slate-900 bg-amber-50 shadow-[2px_2px_0px_0px_#0F172A]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === "hi" ? "स्विच व वायरिंग" : "Switches & Wiring"}</span>
              </div>
              <span className="text-[10px] text-slate-600 block">
                {totalSwitches} {language === "hi" ? "मॉड्यूलर पॉइंट्स" : "Modular Points"}
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {symbol}{electricalTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-2.5 border-2 border-slate-900 bg-sky-50 shadow-[2px_2px_0px_0px_#0F172A]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans mb-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === "hi" ? "प्लंबिंग व सेनेटरी" : "Plumbing & Sanitary"}</span>
              </div>
              <span className="text-[10px] text-slate-600 block">
                {numBathrooms} {language === "hi" ? "बाथरूम + टैंक" : "Baths + CPVC/PVC"}
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {symbol}{plumbingTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-2.5 border-2 border-slate-900 bg-amber-50 shadow-[2px_2px_0px_0px_#0F172A]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans mb-1">
                <DoorOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === "hi" ? "दरवाजे व खिड़कियां" : "Doors & Windows"}</span>
              </div>
              <span className="text-[10px] text-slate-600 block">
                {doorCount} {language === "hi" ? "दरवाजे" : "Doors"} + {windowCount} {language === "hi" ? "खिड़कियां" : "Windows"}
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {symbol}{doorsWindowsTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-2.5 border-2 border-slate-900 bg-indigo-50 shadow-[2px_2px_0px_0px_#0F172A]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans mb-1">
                <Grid className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === "hi" ? "टाइल्स व फ्लोरींग" : "Tiles & Flooring"}</span>
              </div>
              <span className="text-[10px] text-slate-600 block">
                {tileSqFt} Sq.Ft Vitrified
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {symbol}{tilesTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-2.5 border-2 border-slate-900 bg-rose-50 shadow-[2px_2px_0px_0px_#0F172A]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans mb-1">
                <Bug className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === "hi" ? "दीमक व प्लास्टर" : "Plaster & Defense"}</span>
              </div>
              <span className="text-[10px] text-slate-600 block">
                {language === "hi" ? "प्लास्टर + एंटी-टर्माइट" : "Plaster + Anti-Termite"}
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {symbol}{plasterDefenseTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-2.5 border-2 border-slate-900 bg-purple-50 shadow-[2px_2px_0px_0px_#0F172A]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans mb-1">
                <Paintbrush className="w-3.5 h-3.5 text-purple-600" />
                <span>{language === "hi" ? "पेंट व वॉल पुट्टी" : "Paint & Wall Putty"}</span>
              </div>
              <span className="text-[10px] text-slate-600 block">
                {paintSqFt} Sq.Ft {language === "hi" ? "दीवार एरिया" : "Wall Area"}
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {symbol}{paintTotalINR.toLocaleString("en-IN")}
              </span>
            </div>

          </div>
        </div>

        {/* 5. Major Material Quantity Summary */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2 border-b-2 border-slate-900 pb-1">
            <Boxes className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {language === "hi"
                ? "5. मुख्य निर्माण सामग्री मात्रा सारणी"
                : "5. Major Material Quantity Summary"}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {result.materials.map((m) => (
              <div key={m.id} className="p-2.5 border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_0px_#0F172A]">
                <span className="font-bold text-slate-900 block uppercase font-sans">
                  {language === "hi" ? (m.nameHi || m.nameEn) : m.nameEn}
                </span>
                <span className="text-slate-900 font-mono font-black text-sm">
                  {m.quantity.toLocaleString()} {m.unit}
                </span>
                <span className="text-[10px] text-slate-600 font-mono block">
                  {language === "hi" ? "लागत: " : "Est. Cost: "}{symbol}{Math.round(m.totalCost).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Verification & Signature Block */}
        <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-slate-700">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-600" />
              <p className="font-black text-slate-900 uppercase">
                {language === "hi"
                  ? "सिविल जंगल्स द्वारा आधिकारिक निर्माण रिपोर्ट"
                  : "Official Civil Engineering Report by CivilJungles.com"}
              </p>
            </div>
            <p className="text-[11px] text-slate-600">
              {language === "hi"
                ? "यह गणना भारतीय मानक IS:1200 और CPWD अनुसूची दरों के अनुरूप है।"
                : "Calculations strictly adhere to Indian IS:1200 Standards and CPWD schedule rates."}
            </p>
          </div>

          <div className="text-center self-end sm:self-auto shrink-0">
            <div className="w-40 border-b-2 border-slate-900 mb-1"></div>
            <p className="font-bold text-slate-900 uppercase text-[11px]">
              {language === "hi" ? "क्लाइंट / इंजीनियर हस्ताक्षर" : "Client / Engineer Signature"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
