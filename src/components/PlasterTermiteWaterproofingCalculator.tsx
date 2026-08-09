import React, { useState } from "react";
import { ProjectConfig, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  ShieldCheck,
  Sparkles,
  Bug,
  Paintbrush,
  Umbrella,
  Flame,
  CheckCircle2
} from "lucide-react";

interface PlasterTermiteWaterproofingCalculatorProps {
  config: ProjectConfig;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const PlasterTermiteWaterproofingCalculator: React.FC<PlasterTermiteWaterproofingCalculatorProps> = ({
  config,
  currency,
  language
}) => {
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium" | "high_protection">("standard");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";
  const rateFromINR = CURRENCY_CONVERSION[currency]?.rateFromINR || 1.0;

  const tierDetails = {
    standard: {
      nameEn: "Standard (Chlorpyrifos + 1:6 Plaster + Brick-Bat Coba Waterproofing)",
      nameHi: "स्टैंडर्ड (क्लोरपायरीफॉस + 1:6 प्लास्टर + ब्रिक-बैट कोबा वाटरप्रूफिंग)",
      termiteRatePerL: 280,
      plasterLaborPerSqFt: 22,
      terraceWaterproofPerSqFt: 45,
      sunkenWaterproofPerBath: 3200,
      chickenMeshPerMeter: 32,
    },
    premium: {
      nameEn: "Premium (Imidacloprid Bayer + Ready-mix Gypsum/Plaster + Dr. Fixit 2K Polymer)",
      nameHi: "प्रीमियम (बायो इमिडाक्लोप्रिड + रेडी-मिक्स प्लास्टर + डॉ. फिक्सिट 2K पॉलीमर)",
      termiteRatePerL: 480,
      plasterLaborPerSqFt: 30,
      terraceWaterproofPerSqFt: 75,
      sunkenWaterproofPerBath: 5800,
      chickenMeshPerMeter: 48,
    },
    high_protection: {
      nameEn: "High Defense (Premise Termite Barrier + Polymer Fiber Plaster + Membrane Waterproofing)",
      nameHi: "हाई डिफेंस (केमिकल बैरियर दीमक रोधी + पॉलीमर फाइबर प्लास्टर + मेम्ब्रेन वाटरप्रूफिंग)",
      termiteRatePerL: 850,
      plasterLaborPerSqFt: 42,
      terraceWaterproofPerSqFt: 110,
      sunkenWaterproofPerBath: 9200,
      chickenMeshPerMeter: 65,
    }
  };

  const currentTier = tierDetails[selectedTier];

  const builtUpAreaPerFloor = config.builtUpAreaPerFloorFt;
  const totalBuiltUpArea = builtUpAreaPerFloor * (config.floors + 1);
  const bathrooms = Math.max(1, config.bathrooms || 2);

  // Plaster Area Calculations (Roughly 3.5x built-up area for internal walls + ceiling + external walls)
  const internalPlasterSqFt = Math.round(totalBuiltUpArea * 2.6);
  const externalPlasterSqFt = Math.round(totalBuiltUpArea * 0.95);
  const totalPlasterSqFt = internalPlasterSqFt + externalPlasterSqFt;

  // Materials for Plaster
  const cementBagsPlaster = Math.round(totalPlasterSqFt / 75); // 1 bag per 75 sqft plaster
  const sandCuFtPlaster = Math.round(cementBagsPlaster * 6); // 1:6 ratio
  const chickenMeshMeters = Math.round(totalBuiltUpArea * 0.22); // Column-brick joint crack prevention

  // Anti-Termite Chemicals
  const termiteChemicalLiters = Math.max(8, Math.round(builtUpAreaPerFloor * 0.08));

  // Waterproofing
  const terraceWaterproofSqFt = Math.round(builtUpAreaPerFloor * 1.05);
  const sunkenBathroomsCount = bathrooms;

  // Costs
  const antiTermiteCostINR = termiteChemicalLiters * currentTier.termiteRatePerL + Math.round(builtUpAreaPerFloor * 4.5); // chemical + spraying labor
  const plasterCementCostINR = cementBagsPlaster * 385;
  const plasterSandCostINR = sandCuFtPlaster * 58;
  const chickenMeshCostINR = chickenMeshMeters * currentTier.chickenMeshPerMeter;
  const plasterLaborCostINR = totalPlasterSqFt * currentTier.plasterLaborPerSqFt;
  const terraceWaterproofingCostINR = terraceWaterproofSqFt * currentTier.terraceWaterproofPerSqFt;
  const sunkenWaterproofingCostINR = sunkenBathroomsCount * currentTier.sunkenWaterproofPerBath;

  const totalModuleCostINR =
    antiTermiteCostINR +
    plasterCementCostINR +
    plasterSandCostINR +
    chickenMeshCostINR +
    plasterLaborCostINR +
    terraceWaterproofingCostINR +
    sunkenWaterproofingCostINR;

  const formatMoney = (valINR: number) => {
    const val = valINR * rateFromINR;
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Title & Tier Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Bug className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {language === "hi"
                ? "प्लास्टर, दीमक रोधी व वाटरप्रूफिंग कैलकुलेटर"
                : "Plastering, Anti-Termite Treatment & Waterproofing Calculator"}
              <span className="px-2 py-0.5 bg-slate-900 text-rose-400 text-[10px] font-mono font-bold border border-slate-900">
                PLASTER & DEFENSE
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "दीमक केमिकल ट्रीटमेंट, 12mm आंतरिक व 18mm बाहरी प्लास्टर, मुर्गा जाली व छत/बाथरूम वाटरप्रूफिंग"
                : "Soil anti-termite chemical spray, internal 12mm & external 18mm double plaster, GI chicken mesh & waterproofing"}
            </p>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          {(["standard", "premium", "high_protection"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 text-xs font-black uppercase transition ${
                selectedTier === t
                  ? "bg-amber-400 text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {t === "standard" ? "Standard" : t === "premium" ? "Premium" : "High Defense"}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Quality Banner */}
      <div className="bg-rose-50 border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>
            {language === "hi" ? "चयनित प्लास्टर व सुरक्षा ग्रेड: " : "Selected Protection Tier: "}
            <strong className="text-rose-950 font-black">{currentTier.nameEn}</strong>
          </span>
        </div>
        <div className="font-mono font-black text-slate-900 text-sm">
          {language === "hi" ? "अनुमानित कुल लागत: " : "Total Est. Plaster & Defense Cost: "}
          <span className="text-rose-700 text-base">{formatMoney(totalModuleCostINR)}</span>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "दीमक रोधी केमिकल" : "Anti-Termite Chem."}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {termiteChemicalLiters} Liters
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.termiteRatePerL)}/liter
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "कुल प्लास्टर क्षेत्रफल" : "Total Plaster Area"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {totalPlasterSqFt} Sq.Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            Int: {internalPlasterSqFt} | Ext: {externalPlasterSqFt}
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "मुर्गा जाली (Chicken Mesh)" : "GI Chicken Mesh"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {chickenMeshMeters} Meters
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.chickenMeshPerMeter)}/m
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "छत वाटरप्रूफिंग" : "Terrace Area"}
          </span>
          <span className="font-mono font-black text-rose-700 text-base sm:text-lg block">
            {terraceWaterproofSqFt} Sq.Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.terraceWaterproofPerSqFt)}/sqft
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "बाथरूम सनकेन कोटिंग" : "Sunken Baths"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {sunkenBathroomsCount} Units
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.sunkenWaterproofPerBath)}/bath
          </span>
        </div>

        <div className="bg-amber-100 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
            {language === "hi" ? "प्लास्टर मिस्त्री मजदूरी" : "Plaster Labor"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {formatMoney(plasterLaborCostINR)}
          </span>
          <span className="text-[10px] font-mono text-slate-700 font-bold block">
            @{formatMoney(currentTier.plasterLaborPerSqFt)}/sqft
          </span>
        </div>

      </div>

      {/* Itemized Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
              <th className="p-3">#</th>
              <th className="p-3">{language === "hi" ? "आइटम व प्रक्रिया विवरण" : "Plaster & Waterproofing Description"}</th>
              <th className="p-3 text-center">{language === "hi" ? "मात्रा" : "Est. Quantity"}</th>
              <th className="p-3 text-right">{language === "hi" ? "इकाई दर" : "Unit Price"}</th>
              <th className="p-3 text-right">{language === "hi" ? "अनुमानित कुल लागत" : "Total Cost"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
            
            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">1</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "दीमक रोधी रासायनिक ट्रीटमेंट (इमिडाक्लोप्रिड/क्लोरपायरीफॉस स्प्रे व सॉइल इंजेक्शन)" : "Anti-Termite Chemical Treatment & Foundation Soil Barrier"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{termiteChemicalLiters} Liters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.termiteRatePerL)}/L</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(antiTermiteCostINR)}</td>
            </tr>

            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">2</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "प्लास्टर हेतु महीन छान सीमेंट (PPC Grade Cement)" : "Fine Plastering Grade Cement (PPC)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{cementBagsPlaster} Bags</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(385)}/bag</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(plasterCementCostINR)}</td>
            </tr>

            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">3</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "छाना हुआ महीन प्लास्टर सैंड (Plaster River Sand / P-Sand)" : "Filtered Plaster Fine Sand (P-Sand)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{sandCuFtPlaster} Cu.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(58)}/cuft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(plasterSandCostINR)}</td>
            </tr>

            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">4</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "गैल्वनाइज्ड GI मुर्गा जाली (कॉलम व ईंट जोड़ दरार-रोधी जाली)" : "Galvanized GI Chicken Wire Mesh (Joint Crack Prevention)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{chickenMeshMeters} Meters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.chickenMeshPerMeter)}/m</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(chickenMeshCostINR)}</td>
            </tr>

            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">5</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "12mm आंतरिक व 18mm बाहरी डबल कोट प्लास्टर मिस्त्री मजदूरी" : "Internal 12mm Smooth & External 18mm Double Plaster Labor"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{totalPlasterSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.plasterLaborPerSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(plasterLaborCostINR)}</td>
            </tr>

            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">6</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "छत वाटरप्रूफिंग - ब्रिक बैट कोबा / डॉ फिक्सिट पॉलीमर कोटिंग" : "Terrace Waterproofing (Brick-Bat Coba & Polymer Coating)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{terraceWaterproofSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.terraceWaterproofPerSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(terraceWaterproofingCostINR)}</td>
            </tr>

            <tr className="hover:bg-rose-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">7</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "बाथरूम सनकेन स्लैब वाटरप्रूफिंग कोटिंग (Dr. Fixit SBR/Pidilite)" : "Bathroom Sunken Slab Waterproofing Elastomeric Treatment"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{sunkenBathroomsCount} Baths</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.sunkenWaterproofPerBath)}/bath</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(sunkenWaterproofingCostINR)}</td>
            </tr>

          </tbody>
          <tfoot>
            <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
              <td colSpan={4} className="p-3 text-right uppercase">
                {language === "hi" ? "कुल प्लास्टर व वाटरप्रूफिंग योग:" : "Total Plaster & Waterproofing Sum:"}
              </td>
              <td className="p-3 text-right text-slate-900 text-sm sm:text-base">
                {formatMoney(totalModuleCostINR)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
