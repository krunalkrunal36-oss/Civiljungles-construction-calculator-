import React, { useState } from "react";
import { ProjectConfig, ElectricalPointDetails, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Zap,
  Check,
  ShieldAlert,
  Sliders,
  Sparkles,
  CircuitBoard,
  Cpu,
  Flame
} from "lucide-react";

interface ElectricalSwitchCalculatorProps {
  config: ProjectConfig;
  onChangeConfig: (updated: ProjectConfig) => void;
  electricalDetails: ElectricalPointDetails;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const ElectricalSwitchCalculator: React.FC<ElectricalSwitchCalculatorProps> = ({
  config,
  onChangeConfig,
  electricalDetails,
  currency,
  language
}) => {
  const [selectedBrand, setSelectedBrand] = useState<"standard" | "premium" | "luxury">("standard");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";

  const brandRates = {
    standard: { name: "Anchor Roma / Goldmedal / Havells", switchPrice: 65, boardPrice: 240 },
    premium: { name: "Legrand Mylinc / Schneider Vivace", switchPrice: 120, boardPrice: 420 },
    luxury: { name: "Schneider Glass Touch / Touch Smart Panels", switchPrice: 240, boardPrice: 750 },
  };

  const currentBrand = brandRates[selectedBrand];

  const totalSwitchesCost = electricalDetails.switchesTotal * currentBrand.switchPrice;
  const totalBoardsCost = electricalDetails.switchBoardsTotal * currentBrand.boardPrice;
  const wireRollsCost = electricalDetails.wireRollsRequired * 1750;
  const conduitsCost = electricalDetails.conduitFtRequired * 24;
  const mcbCost = electricalDetails.mcbCount * 280 + 1800;
  const laborCost = electricalDetails.switchesTotal * 380;

  const totalElectricalCost = totalSwitchesCost + totalBoardsCost + wireRollsCost + conduitsCost + mcbCost + laborCost;

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Zap className="w-6 h-6 fill-slate-900" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {language === "hi"
                ? "इलेक्ट्रिकल वायरिंग और स्विच बोर्ड कैलकुलेटर"
                : "Electrical Wiring, Modular Switches & DB Calculator"}
              <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold border border-slate-900">
                08. SWITCHES
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "स्विच प्वाइंट्स, वायर बंडल, एमसीबी और मॉड्यूलर बोर्ड की सटीक गिनती"
                : "Room-wise light/fan points, wire rolls, conduit pipes & modular switch plates"}
            </p>
          </div>
        </div>

        {/* Brand Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          {(["standard", "premium", "luxury"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 text-xs font-bold uppercase transition ${
                selectedBrand === b
                  ? "bg-amber-400 text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {b === "standard" ? "Standard" : b === "premium" ? "Premium" : "Smart Touch"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "लाइट प्वाइंट्स" : "Light Points"}
          </span>
          <span className="text-base font-mono font-black text-slate-900">{electricalDetails.lightPoints} Pcs</span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "पंखा (Fan) प्वाइंट्स" : "Fan Points"}
          </span>
          <span className="text-base font-mono font-black text-slate-900">{electricalDetails.fanPoints} Pcs</span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "6A सॉकेट्स" : "6A Sockets"}
          </span>
          <span className="text-base font-mono font-black text-slate-900">{electricalDetails.socket6APoints} Pcs</span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "16A पावर सॉकेट्स" : "16A Heavy Sockets"}
          </span>
          <span className="text-base font-mono font-black text-amber-600">{electricalDetails.socket16APoints} Pcs</span>
        </div>

        <div className="bg-amber-400 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-900 block mb-1">
            {language === "hi" ? "कुल मॉड्यूलर स्विच" : "Total Switches"}
          </span>
          <span className="text-base font-mono font-black text-slate-900">{electricalDetails.switchesTotal} Pcs</span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "स्विच बोर्ड प्लेट्स" : "Switchboards"}
          </span>
          <span className="text-base font-mono font-black text-slate-900">{electricalDetails.switchBoardsTotal} Boards</span>
        </div>

      </div>

      {/* Itemized Electrical Materials & Cost Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-hidden">
        <div className="p-3 bg-slate-900 text-white font-bold text-xs uppercase flex justify-between border-b-2 border-slate-900">
          <span>{language === "hi" ? "इलेक्ट्रिकल सामग्री विवरण" : "Itemized Electrical Component Breakdown"}</span>
          <span className="text-amber-400 font-mono">{currentBrand.name}</span>
        </div>

        <div className="divide-y-2 divide-slate-100 text-xs">
          
          {/* Wire Rolls */}
          <div className="p-3 flex items-center justify-between hover:bg-slate-50">
            <div>
              <span className="font-black text-slate-900 block uppercase">
                {language === "hi" ? "कॉपर फायर रिटार्डेंट (FR) वायर रोल (Havells/Finolex)" : "FR Copper Wires (1.5, 2.5 & 4.0 sq.mm)"}
              </span>
              <span className="text-slate-500 text-[11px] font-mono font-bold">
                {electricalDetails.wireRollsRequired} {language === "hi" ? "बंडल (90 मीटर प्रति बंडल)" : "Rolls (90m each)"} @ {symbol}1,750 / roll
              </span>
            </div>
            <span className="font-mono font-black text-slate-900 text-sm">{symbol}{wireRollsCost.toLocaleString("en-IN")}</span>
          </div>

          {/* Conduit Pipes */}
          <div className="p-3 flex items-center justify-between hover:bg-slate-50">
            <div>
              <span className="font-black text-slate-900 block uppercase">
                {language === "hi" ? "कंड्यूट पाइप्स और जंक्शन बॉक्स (छत व दीवार हेतु)" : "Heavy Duty Conduit Pipes & Gang Boxes"}
              </span>
              <span className="text-slate-500 text-[11px] font-mono font-bold">
                {electricalDetails.conduitFtRequired} ft @ {symbol}24 / ft
              </span>
            </div>
            <span className="font-mono font-black text-slate-900 text-sm">{symbol}{conduitsCost.toLocaleString("en-IN")}</span>
          </div>

          {/* Modular Switches */}
          <div className="p-3 flex items-center justify-between hover:bg-slate-50">
            <div>
              <span className="font-black text-slate-900 block uppercase">
                {language === "hi" ? "मॉड्यूलर स्विच, सॉकेट्स व फैन रेगुलेटर" : "Modular Switches, Sockets & Fan Dimmers"}
              </span>
              <span className="text-slate-500 text-[11px] font-mono font-bold">
                {electricalDetails.switchesTotal} {language === "hi" ? "यूनिट" : "Units"} @ {symbol}{currentBrand.switchPrice} / unit
              </span>
            </div>
            <span className="font-mono font-black text-amber-600 text-sm">{symbol}{totalSwitchesCost.toLocaleString("en-IN")}</span>
          </div>

          {/* Switchboards */}
          <div className="p-3 flex items-center justify-between hover:bg-slate-50">
            <div>
              <span className="font-black text-slate-900 block uppercase">
                {language === "hi" ? "मॉड्यूलर स्विच बोर्ड प्लेट्स व जीआई बॉक्सेस" : "Modular Switchboard Plates & GI Flush Boxes"}
              </span>
              <span className="text-slate-500 text-[11px] font-mono font-bold">
                {electricalDetails.switchBoardsTotal} {language === "hi" ? "बोर्ड्स (6 & 8 मॉड्यूलर)" : "Boards"} @ {symbol}{currentBrand.boardPrice} / board
              </span>
            </div>
            <span className="font-mono font-black text-slate-900 text-sm">{symbol}{totalBoardsCost.toLocaleString("en-IN")}</span>
          </div>

          {/* MCB & DB Box */}
          <div className="p-3 flex items-center justify-between hover:bg-slate-50">
            <div>
              <span className="font-black text-slate-900 block uppercase">
                {language === "hi" ? "मुख्य डिस्ट्रीब्यूशन बोर्ड (DB Box) और MCBs" : "Main Distribution Board (DB) & MCBs"}
              </span>
              <span className="text-slate-500 text-[11px] font-mono font-bold">
                {electricalDetails.mcbCount} MCBs + Main Isolator & Earth Pit Kit
              </span>
            </div>
            <span className="font-mono font-black text-slate-900 text-sm">{symbol}{mcbCost.toLocaleString("en-IN")}</span>
          </div>

          {/* Electrician Labour */}
          <div className="p-3 flex items-center justify-between hover:bg-slate-50 bg-amber-50">
            <div>
              <span className="font-black text-slate-900 block uppercase">
                {language === "hi" ? "इलेक्ट्रीशियन मजदूरी (झिरी कटाई, पाइप बिछाना व स्विच फिटिंग)" : "Electrician Labour (Chasing, Conduit, Wire Drawing & Switch Testing)"}
              </span>
              <span className="text-slate-600 text-[11px] font-mono font-bold">
                {electricalDetails.switchesTotal} {language === "hi" ? "प्वाइंट्स" : "Points"} @ {symbol}380 / point
              </span>
            </div>
            <span className="font-mono font-black text-slate-900 text-sm">{symbol}{laborCost.toLocaleString("en-IN")}</span>
          </div>

        </div>

        {/* Total Electrical Footer */}
        <div className="p-4 bg-amber-400 text-slate-900 border-t-2 border-slate-900 flex items-center justify-between">
          <span className="font-black uppercase text-xs sm:text-sm tracking-wider">
            {language === "hi" ? "कुल इलेक्ट्रिकल व स्विच खर्चा (सामान + मजदूरी):" : "Total Electrical Cost (Material + Labour):"}
          </span>
          <span className="font-mono font-black text-slate-900 text-lg sm:text-xl">
            {symbol}{Math.round(totalElectricalCost).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-100 border-2 border-slate-900 p-3.5 shadow-[2px_2px_0px_0px_#0F172A] flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-slate-800 leading-relaxed">
          {language === "hi"
            ? "सुरक्षा टिप: केवल FRLS (फायर रिटार्डेंट लो स्मोक) कॉपर वायर्स का उपयोग करें। एसी, गीजर और इंडक्शन के लिए कम से कम 2.5/4.0 sq.mm वायर अवश्य लगवाएं।"
            : "Safety Standard: Use FRLS (Fire Retardant Low Smoke) 100% Copper Wires. Run dedicated 2.5/4.0 sq.mm lines directly from Distribution Board for high-wattage AC & Geysers."}
        </p>
      </div>

    </div>
  );
};
