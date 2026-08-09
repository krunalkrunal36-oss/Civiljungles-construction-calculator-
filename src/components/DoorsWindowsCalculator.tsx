import React, { useState } from "react";
import { ProjectConfig, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  DoorOpen,
  Sparkles,
  LayoutGrid,
  ShieldCheck,
  PanelTopClose,
  Lock
} from "lucide-react";

interface DoorsWindowsCalculatorProps {
  config: ProjectConfig;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const DoorsWindowsCalculator: React.FC<DoorsWindowsCalculatorProps> = ({
  config,
  currency,
  language
}) => {
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium" | "luxury">("standard");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";
  const rateFromINR = CURRENCY_CONVERSION[currency]?.rateFromINR || 1.0;

  const tierDetails = {
    standard: {
      nameEn: "Standard (Teak Frame + Flush Doors + Aluminum Windows)",
      nameHi: "स्टैंडर्ड (सागौन चौखट + फ्लश डोर + एल्युमिनियम विंडो)",
      mainDoorCost: 22000,
      bedroomDoorCost: 6500,
      bathroomDoorCost: 3800,
      windowRateSqFt: 280,
      hardwarePerDoor: 1200,
      laborPerDoor: 1400
    },
    premium: {
      nameEn: "Premium (Carved Teak Main + Veneer Flush + UPVC Sliding)",
      nameHi: "प्रीमियम (कार्व्ड सागौन + वैनियर डोर + UPVC कांच खिड़की)",
      mainDoorCost: 45000,
      bedroomDoorCost: 9500,
      bathroomDoorCost: 5200,
      windowRateSqFt: 420,
      hardwarePerDoor: 2200,
      laborPerDoor: 2200
    },
    luxury: {
      nameEn: "Luxury (Solid Teak Main + Italian Touch + Fenesta UPVC)",
      nameHi: "लक्ज़री (सॉलिड टीक + इटैलियन फिनिश + फेनेस्टा UPVC)",
      mainDoorCost: 85000,
      bedroomDoorCost: 15500,
      bathroomDoorCost: 7800,
      windowRateSqFt: 650,
      hardwarePerDoor: 3800,
      laborPerDoor: 3200
    }
  };

  const currentTier = tierDetails[selectedTier];

  // Room counts
  const bedrooms = Math.max(1, config.bedrooms || 2);
  const bathrooms = Math.max(1, config.bathrooms || 2);
  const totalFloors = config.floors + 1;

  // Door & Window counts
  const mainDoorsCount = totalFloors; // 1 main entrance per floor/unit
  const bedroomDoorsCount = bedrooms;
  const bathroomDoorsCount = bathrooms;
  const totalDoors = mainDoorsCount + bedroomDoorsCount + bathroomDoorsCount;

  // Windows SqFt estimation (approx 12% of total built-up area)
  const windowTotalSqFt = Math.round(config.builtUpAreaPerFloorFt * totalFloors * 0.12);

  // Cost calculations
  const mainDoorsCostINR = mainDoorsCount * currentTier.mainDoorCost;
  const bedroomDoorsCostINR = bedroomDoorsCount * currentTier.bedroomDoorCost;
  const bathroomDoorsCostINR = bathroomDoorsCount * currentTier.bathroomDoorCost;
  const windowsCostINR = windowTotalSqFt * currentTier.windowRateSqFt;
  const hardwareCostINR = totalDoors * currentTier.hardwarePerDoor; // Mortise locks, hinges, handles, stoppers
  const laborCostINR = totalDoors * currentTier.laborPerDoor + Math.round(windowTotalSqFt * 45);

  const totalDoorsWindowsCostINR =
    mainDoorsCostINR +
    bedroomDoorsCostINR +
    bathroomDoorsCostINR +
    windowsCostINR +
    hardwareCostINR +
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
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <DoorOpen className="w-6 h-6 fill-slate-900" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {language === "hi"
                ? "दरवाजे, खिड़कियां व कारपेंटरी कैलकुलेटर"
                : "Doors, UPVC/Aluminum Windows & Hardware Calculator"}
              <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold border border-slate-900">
                DOORS & WINDOWS
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "सागौन मुख्य दरवाजा, बेडरूम फ्लश डोर, WPC टॉयलेट डोर, UPVC स्लाइडिंग विंडो व ताले"
                : "Main teak entrance, laminated bedroom doors, WPC toilet doors & UPVC glass sliding windows"}
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
      <div className="bg-amber-50 border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>
            {language === "hi" ? "चयनित वुडवर्क व विंडो क्वालिटी: " : "Selected Quality Tier: "}
            <strong className="text-slate-900 font-black">{currentTier.nameEn}</strong>
          </span>
        </div>
        <div className="font-mono font-black text-slate-900 text-sm">
          {language === "hi" ? "अनुमानित कुल वुडवर्क खर्च: " : "Total Est. Doors & Windows Cost: "}
          <span className="text-amber-700 text-base">{formatMoney(totalDoorsWindowsCostINR)}</span>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "मुख्य दरवाजा" : "Main Entrance Door"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {mainDoorsCount} Pc
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.mainDoorCost)}/pc
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "बेडरूम दरवाजे" : "Bedroom Doors"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {bedroomDoorsCount} Pcs
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.bedroomDoorCost)}/pc
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "WPC बाथरूम दरवाजे" : "WPC Toilet Doors"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {bathroomDoorsCount} Pcs
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.bathroomDoorCost)}/pc
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "UPVC/कांच खिड़कियां" : "Windows Area"}
          </span>
          <span className="font-mono font-black text-amber-700 text-base sm:text-lg block">
            {windowTotalSqFt} Sq.Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.windowRateSqFt)}/sqft
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "हार्डवेयर व ताले" : "Locks & Hardware"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {totalDoors} Sets
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.hardwarePerDoor)}/set
          </span>
        </div>

        <div className="bg-amber-100 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
            {language === "hi" ? "कारपेंटर लेबर" : "Carpentry Labor"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {formatMoney(laborCostINR)}
          </span>
          <span className="text-[10px] font-mono text-slate-700 font-bold block">
            Fitting & Alignment
          </span>
        </div>

      </div>

      {/* Itemized Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
              <th className="p-3">#</th>
              <th className="p-3">{language === "hi" ? "आइटम व विवरण" : "Door / Window Description"}</th>
              <th className="p-3 text-center">{language === "hi" ? "मात्रा" : "Est. Quantity"}</th>
              <th className="p-3 text-right">{language === "hi" ? "इकाई दर" : "Unit Price"}</th>
              <th className="p-3 text-right">{language === "hi" ? "अनुमानित कुल लागत" : "Total Cost"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
            
            <tr className="hover:bg-amber-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">1</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "मुख्य प्रवेश द्वार - सागौन लकड़ी का नक्काशीदार दरवाजा व भारी चौखट" : "Main Entrance Door & Teak Frame Assembly"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{mainDoorsCount} Pc</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.mainDoorCost)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(mainDoorsCostINR)}</td>
            </tr>

            <tr className="hover:bg-amber-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">2</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "बेडरूम फ्लश डोर - वॉटरप्रूफ लैमिनेटेड शटर व फ्रेम" : "Bedroom Waterproof Laminated Flush Doors & Frames"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{bedroomDoorsCount} Pcs</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.bedroomDoorCost)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(bedroomDoorsCostINR)}</td>
            </tr>

            <tr className="hover:bg-amber-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">3</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "बाथरूम टॉयलेट दरवाजे - WPC / PVC 100% वाटरप्रूफ शटर" : "Bathroom WPC / PVC 100% Waterproof Doors & Frames"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{bathroomDoorsCount} Pcs</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.bathroomDoorCost)}</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(bathroomDoorsCostINR)}</td>
            </tr>

            <tr className="hover:bg-amber-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">4</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "UPVC / एल्युमिनियम ग्लास स्लाइडिंग विंडो, मच्छर जाली व एमएस ग्रिल" : "UPVC Glass Sliding Windows with Mosquito Net & MS Grills"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{windowTotalSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.windowRateSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(windowsCostINR)}</td>
            </tr>

            <tr className="hover:bg-amber-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">5</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "हार्डवेयर फिटिंग्स - मोर्टिस लॉक, हैंडल, कब्जे, कुंडी व डोर स्टॉपर" : "Brass/SS Hardware, Mortise Handles, Hinges & Tower Bolts"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{totalDoors} Sets</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.hardwarePerDoor)}/set</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(hardwareCostINR)}</td>
            </tr>

            <tr className="hover:bg-amber-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">6</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "कारपेंटर कारीगर लेबर व चौखट जामिंग-फिटिंग मजदूरी" : "Carpentry Installation Labor & Door/Window Frame Jamming"}
              </td>
              <td className="p-3 text-center font-mono font-bold">Lump Sum</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">-</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(laborCostINR)}</td>
            </tr>

          </tbody>
          <tfoot>
            <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
              <td colSpan={4} className="p-3 text-right uppercase">
                {language === "hi" ? "कुल दरवाजे व खिड़कियां योग (Total Woodwork Sum):" : "Total Doors & Windows Sum:"}
              </td>
              <td className="p-3 text-right text-slate-900 text-sm sm:text-base">
                {formatMoney(totalDoorsWindowsCostINR)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
