import React, { useState } from "react";
import { ProjectConfig, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Paintbrush,
  Sparkles,
  Palette,
  Sun,
  ShieldAlert,
  Pipette,
  CheckCircle2
} from "lucide-react";

interface FinishingPaintCalculatorProps {
  config: ProjectConfig;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const FinishingPaintCalculator: React.FC<FinishingPaintCalculatorProps> = ({
  config,
  currency,
  language
}) => {
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium" | "luxury">("standard");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";
  const rateFromINR = CURRENCY_CONVERSION[currency]?.rateFromINR || 1.0;

  const tierDetails = {
    standard: {
      nameEn: "Standard (Birla Putty + Asian Paints Tractor Emulsion + Apex Exterior)",
      nameHi: "स्टैंडर्ड (बिरला पुट्टी + एशियन पेंट्स ट्रैक्टर इमल्शन + एपेक्स)",
      puttyKgRate: 24,
      primerLiterRate: 160,
      interiorPaintLiterRate: 220,
      exteriorPaintLiterRate: 280,
      paintingLaborPerSqFt: 14,
    },
    premium: {
      nameEn: "Premium (JK WallMax + Asian Paints Apcolite / Berger Silk + Apex Dustproof)",
      nameHi: "प्रीमियम (जेके वॉलमैक्स + एशियन पेंट्स एपकोलाइट / सिल्क + डस्टप्रूफ)",
      puttyKgRate: 28,
      primerLiterRate: 220,
      interiorPaintLiterRate: 360,
      exteriorPaintLiterRate: 420,
      paintingLaborPerSqFt: 22,
    },
    luxury: {
      nameEn: "Luxury (Asian Paints Royale Glitz / Velvet Touch + Apex Ultima Protek)",
      nameHi: "लक्ज़री (एशियन पेंट्स रॉयल ग्लिट्ज़ / वेलवेट टच + अल्टीमा प्रोटेक)",
      puttyKgRate: 35,
      primerLiterRate: 320,
      interiorPaintLiterRate: 680,
      exteriorPaintLiterRate: 750,
      paintingLaborPerSqFt: 35,
    }
  };

  const currentTier = tierDetails[selectedTier];

  const totalBuiltUpArea = config.builtUpAreaPerFloorFt * (config.floors + 1);

  // Paint Coverage Calculations
  const interiorWallSqFt = Math.round(totalBuiltUpArea * 2.5);
  const exteriorWallSqFt = Math.round(totalBuiltUpArea * 0.95);
  const totalPaintingSqFt = interiorWallSqFt + exteriorWallSqFt;

  // Material Estimation
  const puttyKgTotal = Math.round(interiorWallSqFt * 0.16); // ~0.16 kg per sqft for 2 coats
  const primerLitersTotal = Math.round(totalPaintingSqFt / 110); // 1 liter per 110 sqft
  const interiorPaintLitersTotal = Math.round(interiorWallSqFt / 65); // ~2 coats
  const exteriorPaintLitersTotal = Math.round(exteriorWallSqFt / 55); // ~2 coats
  const enamelPaintLitersTotal = Math.round(totalBuiltUpArea * 0.015); // grills & metal doors

  // Costs
  const puttyCostINR = puttyKgTotal * currentTier.puttyKgRate;
  const primerCostINR = primerLitersTotal * currentTier.primerLiterRate;
  const interiorPaintCostINR = interiorPaintLitersTotal * currentTier.interiorPaintLiterRate;
  const exteriorPaintCostINR = exteriorPaintLitersTotal * currentTier.exteriorPaintLiterRate;
  const enamelPaintCostINR = enamelPaintLitersTotal * 380;
  const laborCostINR = totalPaintingSqFt * currentTier.paintingLaborPerSqFt;

  const totalPaintingCostINR =
    puttyCostINR +
    primerCostINR +
    interiorPaintCostINR +
    exteriorPaintCostINR +
    enamelPaintCostINR +
    laborCostINR;

  const formatMoney = (valINR: number) => {
    const val = valINR * rateFromINR;
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Title & Tier Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Paintbrush className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {language === "hi"
                ? "पेंटिंग, पुट्टी व फिनिशिंग कैलकुलेटर"
                : "Putty, Primer & Emulsion Painting Calculator"}
              <span className="px-2 py-0.5 bg-slate-900 text-purple-400 text-[10px] font-mono font-bold border border-slate-900">
                PAINT & FINISHING
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "व्हाइट पुट्टी (2-कोट), प्राइमर, इंटीरियर इमल्शन, एक्सटीरियर वेदरप्रूफ पेंट व पेंटर लेबर"
                : "2-coat white cement putty, wall primer, interior royal emulsion, weather-guard exterior & painter labor"}
            </p>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          {(["standard", "premium", "luxury"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 text-xs font-black uppercase transition ${
                selectedTier === t
                  ? "bg-amber-400 text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {t === "standard" ? "Standard" : t === "premium" ? "Premium" : "Royale Velvet"}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Quality Banner */}
      <div className="bg-purple-50 border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>
            {language === "hi" ? "चयनित पेंटिंग ब्रांड व क्वालिटी: " : "Selected Paint Brand & Quality: "}
            <strong className="text-purple-950 font-black">{currentTier.nameEn}</strong>
          </span>
        </div>
        <div className="font-mono font-black text-slate-900 text-sm">
          {language === "hi" ? "अनुमानित कुल पेंटिंग खर्च: " : "Total Est. Painting Cost: "}
          <span className="text-purple-700 text-base">{formatMoney(totalPaintingCostINR)}</span>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "वॉल पुट्टी" : "Wall Putty"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {puttyKgTotal} Kg
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.puttyKgRate)}/kg
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "वॉल प्राइमर" : "Wall Primer"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {primerLitersTotal} L
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.primerLiterRate)}/L
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "इंटीरियर इमल्शन" : "Interior Paint"}
          </span>
          <span className="font-mono font-black text-purple-700 text-base sm:text-lg block">
            {interiorPaintLitersTotal} Liters
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.interiorPaintLiterRate)}/L
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "वेदरप्रूफ एक्सटीरियर" : "Exterior Paint"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {exteriorPaintLitersTotal} Liters
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.exteriorPaintLiterRate)}/L
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "ग्रिल इनेमल पेंट" : "Enamel Paint"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {enamelPaintLitersTotal} Liters
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            Grills & Metal
          </span>
        </div>

        <div className="bg-amber-100 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
            {language === "hi" ? "पेंटर मिस्त्री मजदूरी" : "Painter Labor"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {formatMoney(laborCostINR)}
          </span>
          <span className="text-[10px] font-mono text-slate-700 font-bold block">
            @{formatMoney(currentTier.paintingLaborPerSqFt)}/sqft
          </span>
        </div>

      </div>

      {/* Itemized Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
              <th className="p-3">#</th>
              <th className="p-3">{language === "hi" ? "पेंटिंग सामग्री व प्रक्रिया" : "Paint Material & Labor Description"}</th>
              <th className="p-3 text-center">{language === "hi" ? "मात्रा" : "Est. Quantity"}</th>
              <th className="p-3 text-right">{language === "hi" ? "इकाई दर" : "Unit Price"}</th>
              <th className="p-3 text-right">{language === "hi" ? "अनुमानित कुल लागत" : "Total Cost"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
            
            <tr className="hover:bg-purple-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">1</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "व्हाइट सीमेंट पुट्टी (2-कोट स्मूथ वॉल फिनिशिंग - Birla White / JK)" : "White Cement Smooth Wall Putty (2 Coats)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{puttyKgTotal} Kg</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.puttyKgRate)}/kg</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(puttyCostINR)}</td>
            </tr>

            <tr className="hover:bg-purple-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">2</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "ऐक्रेलिक वॉल प्राइमर (अंदर व बाहर की दीवारों के लिए कोट)" : "Water-based Acrylic Wall Primer Coat"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{primerLitersTotal} Liters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.primerLiterRate)}/L</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(primerCostINR)}</td>
            </tr>

            <tr className="hover:bg-purple-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">3</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "इंटीरियर रॉयल / प्रीमियम वाशेबल इमल्शन (कमरों व छत हेतु 2-कोट)" : "Interior Royal Premium Washable Emulsion Paint (2 Coats)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{interiorPaintLitersTotal} Liters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.interiorPaintLiterRate)}/L</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(interiorPaintCostINR)}</td>
            </tr>

            <tr className="hover:bg-purple-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">4</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "एक्सटीरियर वेदरप्रूफ एंटी-डस्ट पेंट (बाहरी दीवारों हेतु 2-कोट)" : "Exterior Weather-Shield Anti-Dust & Fungus Paint (2 Coats)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{exteriorPaintLitersTotal} Liters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.exteriorPaintLiterRate)}/L</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(exteriorPaintCostINR)}</td>
            </tr>

            <tr className="hover:bg-purple-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">5</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "ग्लोसी इनेमल पेंट (विंडो सेफ्टी ग्रिल, एमएस गेट व लकड़ी पोलिश)" : "High Gloss Synthetic Enamel Paint for Grills, Gates & Frames"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{enamelPaintLitersTotal} Liters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(380)}/L</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(enamelPaintCostINR)}</td>
            </tr>

            <tr className="hover:bg-purple-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">6</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "स्कैफोल्डिंग (भाड़ा) व प्रोफेशनल पेंटर कारीगर मजदूरी" : "Scaffolding Setup & Professional Painter Application Labor"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{totalPaintingSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.paintingLaborPerSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(laborCostINR)}</td>
            </tr>

          </tbody>
          <tfoot>
            <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
              <td colSpan={4} className="p-3 text-right uppercase">
                {language === "hi" ? "कुल पेंटिंग व पुट्टी योग (Total Painting Sum):" : "Total Painting & Finishing Sum:"}
              </td>
              <td className="p-3 text-right text-slate-900 text-sm sm:text-base">
                {formatMoney(totalPaintingCostINR)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
