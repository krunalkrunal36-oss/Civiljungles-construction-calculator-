import React, { useState } from "react";
import { ProjectConfig, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Droplets,
  Check,
  ShieldAlert,
  Sparkles,
  Bath,
  ShowerHead,
  Waves,
  Pipette,
  CheckCircle2
} from "lucide-react";

interface PlumbingSanitaryCalculatorProps {
  config: ProjectConfig;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const PlumbingSanitaryCalculator: React.FC<PlumbingSanitaryCalculatorProps> = ({
  config,
  currency,
  language
}) => {
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium" | "luxury">("standard");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";
  const rateFromINR = CURRENCY_CONVERSION[currency]?.rateFromINR || 1.0;

  const tierDetails = {
    standard: {
      nameEn: "Standard (Supreme / Cera / Parryware)",
      nameHi: "स्टैंडर्ड (सुप्रीम / सेरा / पैरीवेयर)",
      commodePrice: 4200,
      basinPrice: 1800,
      tapPrice: 850,
      showerPrice: 1200,
      tankPricePerL: 7.5,
      cpvcPipePriceFt: 45,
      swrPipePriceFt: 65,
      laborPerPoint: 850,
    },
    premium: {
      nameEn: "Premium (Astral / Jaquar / Hindware)",
      nameHi: "प्रीमियम (एस्ट्रल / जैक्वार / हिंदवेयर)",
      commodePrice: 8500,
      basinPrice: 3500,
      tapPrice: 1800,
      showerPrice: 2800,
      tankPricePerL: 9.5,
      cpvcPipePriceFt: 60,
      swrPipePriceFt: 85,
      laborPerPoint: 1100,
    },
    luxury: {
      nameEn: "Luxury (Kohler / Grohe / Astral Silencio)",
      nameHi: "लक्ज़री (कोहलर / ग्रोहे / एस्ट्रल साइलेंसो)",
      commodePrice: 18500,
      basinPrice: 7200,
      tapPrice: 4200,
      showerPrice: 6500,
      tankPricePerL: 12.0,
      cpvcPipePriceFt: 85,
      swrPipePriceFt: 120,
      laborPerPoint: 1500,
    }
  };

  const currentTier = tierDetails[selectedTier];

  // Room counts
  const bathrooms = Math.max(1, config.bathrooms || 2);
  const kitchens = Math.max(1, config.kitchens || 1);
  const totalFloors = config.floors + 1;

  // Plumbing Fixtures Count
  const commodesCount = bathrooms;
  const washBasinsCount = bathrooms + 1; // 1 extra in dining area
  const tapsCount = bathrooms * 3 + kitchens * 2 + totalFloors * 1; // 3 per bath, 2 in kitchen, 1 per floor utility
  const showersCount = bathrooms;
  const waterTankCapacityL = totalFloors <= 1 ? 1000 : totalFloors === 2 ? 1500 : 2000;
  
  // Pipe length estimation
  const cpvcPipeFt = Math.round((bathrooms * 45 + kitchens * 30 + totalFloors * 40) * (config.builtUpAreaPerFloorFt / 1000));
  const swrPipeFt = Math.round((bathrooms * 35 + kitchens * 25 + totalFloors * 35) * (config.builtUpAreaPerFloorFt / 1000));
  const totalPoints = bathrooms * 6 + kitchens * 3 + 4; // Plumbing points for labor

  // Cost calculations
  const commodesCostINR = commodesCount * currentTier.commodePrice;
  const basinsCostINR = washBasinsCount * currentTier.basinPrice;
  const tapsCostINR = tapsCount * currentTier.tapPrice;
  const showersCostINR = showersCount * currentTier.showerPrice;
  const waterTankCostINR = waterTankCapacityL * currentTier.tankPricePerL;
  const cpvcPipesCostINR = cpvcPipeFt * currentTier.cpvcPipePriceFt;
  const swrPipesCostINR = swrPipeFt * currentTier.swrPipePriceFt;
  const accessoriesCostINR = Math.round((cpvcPipesCostINR + swrPipesCostINR) * 0.25); // Solvents, tees, elbows, traps
  const laborCostINR = totalPoints * currentTier.laborPerPoint;

  const totalPlumbingCostINR =
    commodesCostINR +
    basinsCostINR +
    tapsCostINR +
    showersCostINR +
    waterTankCostINR +
    cpvcPipesCostINR +
    swrPipesCostINR +
    accessoriesCostINR +
    laborCostINR;

  const formatMoney = (valINR: number) => {
    const val = valINR * rateFromINR;
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Title & Brand Tier Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Droplets className="w-6 h-6 fill-slate-900" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {language === "hi"
                ? "प्लंबिंग व सैनिटरी विस्तृत कैलकुलेटर"
                : "Plumbing, Water Pipes & Sanitaryware Calculator"}
              <span className="px-2 py-0.5 bg-slate-900 text-blue-400 text-[10px] font-mono font-bold border border-slate-900">
                PLUMBING MODULE
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "CPVC/SWR पाइप, वेस्टर्न कमोड, वाशबेसिन, नल, ओवरहेड टैंक और प्लंबर लेबर"
                : "Itemized CPVC/SWR pipe length, sanitaryware fixtures, tank capacity & plumbing points"}
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
              {t === "standard" ? "Standard" : t === "premium" ? "Premium" : "Luxury"}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Quality Banner */}
      <div className="bg-blue-50 border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>
            {language === "hi" ? "चयनित ब्रांड श्रेणी: " : "Selected Fitting Quality: "}
            <strong className="text-blue-900 font-black">{currentTier.nameEn}</strong>
          </span>
        </div>
        <div className="font-mono font-black text-slate-900 text-sm">
          {language === "hi" ? "अनुमानित कुल प्लंबिंग खर्च: " : "Total Est. Plumbing Cost: "}
          <span className="text-blue-700 text-base">{formatMoney(totalPlumbingCostINR)}</span>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "वेस्टर्न कमोड" : "Commodes"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {commodesCount} Pcs
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.commodePrice)}/pc
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "वाश बेसिन" : "Wash Basins"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {washBasinsCount} Pcs
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.basinPrice)}/pc
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "नल व वाल मिक्सर" : "Faucets & Taps"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {tapsCount} Pcs
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.tapPrice)}/pc
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "CPVC वाटर पाइप" : "CPVC Pipes"}
          </span>
          <span className="font-mono font-black text-blue-700 text-base sm:text-lg block">
            {cpvcPipeFt} Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.cpvcPipePriceFt)}/ft
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "SWR सीवर पाइप" : "SWR Drainage"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {swrPipeFt} Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.swrPipePriceFt)}/ft
          </span>
        </div>

        <div className="bg-amber-100 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
            {language === "hi" ? "पानी की टंकी" : "Water Tank"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {waterTankCapacityL} Liters
          </span>
          <span className="text-[10px] font-mono text-slate-700 font-bold block">
            4-Layer Antibacterial
          </span>
        </div>

      </div>

      {/* Detailed Itemized Plumbing Breakdown Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
              <th className="p-3">#</th>
              <th className="p-3">{language === "hi" ? "सामग्री व उपकरण नाम" : "Plumbing Item Description"}</th>
              <th className="p-3 text-center">{language === "hi" ? "मात्रा" : "Est. Quantity"}</th>
              <th className="p-3 text-right">{language === "hi" ? "इकाई दर" : "Unit Price"}</th>
              <th className="p-3 text-right">{language === "hi" ? "अनुमानित कुल लागत" : "Total Cost"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
            
            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">1</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "वेस्टर्न/इंडियन वॉल हग कमोड व सीट कवर" : "Commodes with Soft-close Seat Covers"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{commodesCount} Pcs</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.commodePrice)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(commodesCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">2</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "सेरामिक वाश बेसिन व पिलर कॉक" : "Wash Basins with Pedestal & Pillar Tap"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{washBasinsCount} Pcs</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.basinPrice)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(basinsCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">3</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "ब्रास सीपी नल, वाल मिक्सर व हेल्थ फॉसेट" : "CP Brass Taps, Wall Mixers & Health Faucets"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{tapsCount} Pcs</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.tapPrice)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(tapsCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">4</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "ओवरहेड वाल शॉवर व शॉवर आर्म" : "Overhead Bathroom Rain Showers"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{showersCount} Pcs</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.showerPrice)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(showersCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">5</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "CPVC गर्म व ठंडे पानी की सप्लाई पाइप्स (SDR-11)" : "CPVC Hot & Cold Water Supply Lines (SDR-11)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{cpvcPipeFt} Feet</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.cpvcPipePriceFt)}/ft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(cpvcPipesCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">6</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "SWR 4-इंच व 3-इंच सीवर/वेस्ट वाटर ड्रेनेज पाइप्स" : "Heavy Duty SWR Soil & Drainage Pipes (4\" & 3\")"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{swrPipeFt} Feet</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.swrPipePriceFt)}/ft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(swrPipesCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">7</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "छत पर 4-लेयर एंटीबैक्टीरियल पानी की ओवरहेड टंकी" : "Overhead 4-Layer Antibacterial Water Storage Tank"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{waterTankCapacityL} Liters</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.tankPricePerL)}/L</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(waterTankCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">8</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "प्लंबिंग एसेसरीज (टी, एल्बो, वाल्व, ट्रैप्स, सॉल्वेंट)" : "CPVC Fittings, Elbows, Valves, Nahani Traps & Solvent"}
              </td>
              <td className="p-3 text-center font-mono font-bold">1 Lump Sum</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">-</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(accessoriesCostINR)}</td>
            </tr>

            <tr className="hover:bg-blue-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">9</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "प्लंबर मिस्त्री लेबर व कटिंग-फिटिंग चार्ज" : "Skilled Plumber Labor & Pipe Wall Chasing Charges"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{totalPoints} Points</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.laborPerPoint)}/point</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(laborCostINR)}</td>
            </tr>

          </tbody>
          <tfoot>
            <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
              <td colSpan={4} className="p-3 text-right uppercase">
                {language === "hi" ? "कुल प्लंबिंग योग (Total Plumbing Sum):" : "Total Plumbing & Sanitary Sum:"}
              </td>
              <td className="p-3 text-right text-slate-900 text-sm sm:text-base">
                {formatMoney(totalPlumbingCostINR)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
