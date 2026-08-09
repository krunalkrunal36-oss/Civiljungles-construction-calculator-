import React, { useState } from "react";
import { MaterialAndLabourRates, LanguageMode } from "../types";
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Coins
} from "lucide-react";

interface RateCustomizerModalProps {
  currentRates: MaterialAndLabourRates;
  onSave: (updated: MaterialAndLabourRates) => void;
  onReset: () => void;
  onClose: () => void;
  language: LanguageMode;
}

export const RateCustomizerModal: React.FC<RateCustomizerModalProps> = ({
  currentRates,
  onSave,
  onReset,
  onClose,
  language
}) => {
  const [rates, setRates] = useState<MaterialAndLabourRates>({ ...currentRates });

  const handleChange = (field: keyof MaterialAndLabourRates, value: number) => {
    setRates((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onSave(rates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-900 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_#0F172A] text-slate-900">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
                {language === "hi"
                  ? "सामग्री व मजदूरी की दरें बदलें (Edit Unit Rates)"
                  : "Customize Material & Labour Unit Rates"}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi"
                  ? "अपने स्थानीय बाजार की दरों के अनुसार बदलाव करें"
                  : "Adjust unit prices to match your local hardware & contractor market rates"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Form */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Civil Materials */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] border-b-2 border-slate-900 pb-1">
              1. {language === "hi" ? "सिविल सामग्री दरें (Civil Materials)" : "Civil Material Rates"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              
              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Cement (₹/Bag 50kg)</label>
                <input
                  type="number"
                  value={rates.cementBagINR}
                  onChange={(e) => handleChange("cementBagINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Steel TMT (₹/Kg)</label>
                <input
                  type="number"
                  value={rates.steelKgINR}
                  onChange={(e) => handleChange("steelKgINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Sand / M-Sand (₹/Cu.Ft)</label>
                <input
                  type="number"
                  value={rates.sandCuFtINR}
                  onChange={(e) => handleChange("sandCuFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Aggregate 20mm (₹/Cu.Ft)</label>
                <input
                  type="number"
                  value={rates.aggregateCuFtINR}
                  onChange={(e) => handleChange("aggregateCuFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Red Brick (₹/Piece)</label>
                <input
                  type="number"
                  value={rates.redBrickPcsINR}
                  onChange={(e) => handleChange("redBrickPcsINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Floor Tile (₹/Sq.Ft)</label>
                <input
                  type="number"
                  value={rates.tilesSqFtINR}
                  onChange={(e) => handleChange("tilesSqFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* Electrical & Plumbing Materials */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] border-b-2 border-slate-900 pb-1">
              2. {language === "hi" ? "इलेक्ट्रिकल व प्लंबिंग दरें (Electrical & Plumbing)" : "Electrical & Plumbing Material Rates"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              
              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Modular Switch (₹/Unit)</label>
                <input
                  type="number"
                  value={rates.modularSwitchUnitINR}
                  onChange={(e) => handleChange("modularSwitchUnitINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Wire Roll 90m (₹/Roll)</label>
                <input
                  type="number"
                  value={rates.wireRoll90mINR}
                  onChange={(e) => handleChange("wireRoll90mINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">CPVC Pipe (₹/Ft)</label>
                <input
                  type="number"
                  value={rates.cpvcPipeFtINR}
                  onChange={(e) => handleChange("cpvcPipeFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* Labour Rates */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] border-b-2 border-slate-900 pb-1">
              3. {language === "hi" ? "मजदूरी दरें (Labour & Contractor Rates)" : "Labour Trade Rates"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              
              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">RCC Concrete Labour (₹/Sq.Ft)</label>
                <input
                  type="number"
                  value={rates.rccLabourSqFtINR}
                  onChange={(e) => handleChange("rccLabourSqFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Brickwork Labour (₹/Sq.Ft)</label>
                <input
                  type="number"
                  value={rates.brickworkLabourSqFtINR}
                  onChange={(e) => handleChange("brickworkLabourSqFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Plaster Labour (₹/Sq.Ft)</label>
                <input
                  type="number"
                  value={rates.plasterLabourSqFtINR}
                  onChange={(e) => handleChange("plasterLabourSqFtINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Electrical Labour (₹/Point)</label>
                <input
                  type="number"
                  value={rates.electricalLabourPointINR}
                  onChange={(e) => handleChange("electricalLabourPointINR", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-900 font-bold uppercase block mb-1">Contractor Margin (%)</label>
                <input
                  type="number"
                  value={rates.contractorMarginPercent}
                  onChange={(e) => handleChange("contractorMarginPercent", Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-2 border-slate-900 bg-white flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === "hi" ? "डिफॉल्ट दरें रीसेट करें" : "Reset Default"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase transition"
            >
              {language === "hi" ? "रद्द करें" : "Cancel"}
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black uppercase border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Check className="w-4 h-4 text-slate-900" />
              <span>{language === "hi" ? "दरें लागू करें" : "Save Rates"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
