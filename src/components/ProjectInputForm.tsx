import React, { useState, useEffect } from "react";
import {
  ProjectConfig,
  QualityGrade,
  LanguageMode
} from "../types";
import { CITY_MULTIPLIERS } from "../data/defaultRates";
import {
  Building2,
  Sliders,
  Bed,
  Bath,
  UtensilsCrossed,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from "lucide-react";

interface ProjectInputFormProps {
  config: ProjectConfig;
  onChange: (updated: ProjectConfig) => void;
  language: LanguageMode;
  onOpenCustomRates: () => void;
}

export const ProjectInputForm: React.FC<ProjectInputFormProps> = ({
  config,
  onChange,
  language,
  onOpenCustomRates
}) => {
  const [useDimensions, setUseDimensions] = useState(true);
  const [showAdvancedRooms, setShowAdvancedRooms] = useState(false);

  // Auto calculate built-up area per floor if dimensions change
  useEffect(() => {
    if (useDimensions) {
      const calculatedArea = Math.round(config.plotLengthFt * config.plotWidthFt);
      if (calculatedArea > 0 && calculatedArea !== config.builtUpAreaPerFloorFt) {
        onChange({ ...config, builtUpAreaPerFloorFt: calculatedArea });
      }
    }
  }, [config.plotLengthFt, config.plotWidthFt, useDimensions]);

  const totalBuiltUpArea = config.builtUpAreaPerFloorFt * (config.floors + 1);

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 sm:p-6 text-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-400 border-2 border-slate-900 text-slate-900 font-black shadow-[2px_2px_0px_0px_#0F172A]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi" ? "मकान का आकार और प्रोजेक्ट विवरण" : "Project Dimensions & Configuration"}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "प्लाट का साइज, मंजिल और क्वालिटी चुनें"
                : "Specify area, floor count, quality grade & room layout"}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCustomRates}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none uppercase"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === "hi" ? "दरें बदलें" : "Edit Rates"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Plot Size / Area Section */}
        <div className="space-y-3 bg-slate-50 p-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-900 tracking-wider">
              {language === "hi" ? "01. प्लॉट एरिया" : "01. Area Measurement"}
            </label>
            <button
              onClick={() => setUseDimensions(!useDimensions)}
              className="text-[11px] font-bold text-amber-600 hover:underline uppercase"
            >
              {useDimensions ? (language === "hi" ? "sq.ft में" : "Direct Sq.Ft") : (language === "hi" ? "L x W माप" : "Length x Width")}
            </button>
          </div>

          {useDimensions ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  {language === "hi" ? "लंबाई (Ft)" : "Length (Ft)"}
                </span>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={config.plotLengthFt}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      plotLengthFt: Math.max(1, Number(e.target.value) || 0)
                    })
                  }
                  className="w-full bg-white border-2 border-slate-900 p-2 text-sm font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  {language === "hi" ? "चौड़ाई (Ft)" : "Width (Ft)"}
                </span>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={config.plotWidthFt}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      plotWidthFt: Math.max(1, Number(e.target.value) || 0)
                    })
                  }
                  className="w-full bg-white border-2 border-slate-900 p-2 text-sm font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                {language === "hi" ? "कुल एरिया (Sq. Ft/Floor)" : "Area Per Floor (Sq. Ft)"}
              </span>
              <input
                type="number"
                min="100"
                max="50000"
                value={config.builtUpAreaPerFloorFt}
                onChange={(e) =>
                  onChange({
                    ...config,
                    builtUpAreaPerFloorFt: Math.max(1, Number(e.target.value) || 0)
                  })
                }
                className="w-full bg-white border-2 border-slate-900 p-2 text-sm font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
              />
            </div>
          )}

          <div className="pt-2 text-xs font-bold text-slate-900 flex justify-between items-center border-t border-slate-200">
            <span className="uppercase text-slate-500 text-[10px]">{language === "hi" ? "प्रति मंजिल:" : "Per Floor Area:"}</span>
            <span className="font-mono font-black text-slate-900">{config.builtUpAreaPerFloorFt} SQ.FT</span>
          </div>
        </div>

        {/* Floors Selection */}
        <div className="space-y-3 bg-slate-50 p-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <label className="text-xs font-black uppercase text-slate-900 tracking-wider block">
            {language === "hi" ? "02. कुल मंजिल (Floors)" : "02. Floors Construction"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 0, label: "Ground Floor", hi: "ग्राउंड (G)" },
              { val: 1, label: "G + 1 Floor", hi: "जी + 1 (2 Floors)" },
              { val: 2, label: "G + 2 Floor", hi: "जी + 2 (3 Floors)" },
              { val: 3, label: "G + 3 Floor", hi: "जी + 3 (4 Floors)" },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => onChange({ ...config, floors: f.val })}
                className={`px-2 py-1.5 text-[11px] font-bold text-center border-2 border-slate-900 transition uppercase shadow-[2px_2px_0px_0px_#0F172A] ${
                  config.floors === f.val
                    ? "bg-amber-400 text-slate-900"
                    : "bg-white text-slate-900 hover:bg-slate-100"
                }`}
              >
                {language === "hi" ? f.hi : f.label}
              </button>
            ))}
          </div>

          <div className="pt-2 text-xs font-bold text-slate-900 flex justify-between items-center border-t border-slate-200">
            <span className="uppercase text-slate-500 text-[10px]">{language === "hi" ? "कुल एरिया:" : "Total Area:"}</span>
            <span className="font-mono font-black text-slate-900">{totalBuiltUpArea.toLocaleString("en-IN")} SQ.FT</span>
          </div>
        </div>

        {/* Construction Quality Grade */}
        <div className="space-y-3 bg-slate-50 p-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <label className="text-xs font-black uppercase text-slate-900 tracking-wider block">
            {language === "hi" ? "03. क्वालिटी ग्रेड" : "03. Quality Grade"}
          </label>

          <select
            value={config.grade}
            onChange={(e) => onChange({ ...config, grade: e.target.value as QualityGrade })}
            className="w-full bg-white border-2 border-slate-900 p-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none uppercase cursor-pointer"
          >
            <option value="economy">Economy - ₹1,350-1,500/sqft (बजट)</option>
            <option value="standard">Standard - ₹1,750-2,100/sqft (स्टैंडर्ड)</option>
            <option value="premium">Premium - ₹2,400-3,000/sqft (प्रीमियम)</option>
            <option value="luxury">Luxury - ₹3,200+/sqft (लक्जरी मार्बल)</option>
          </select>

          <p className="text-[11px] text-slate-600 font-medium leading-snug">
            {config.grade === "economy" && (language === "hi" ? "लोकल ईंट, स्टैंडर्ड सरिया, सामान्य टाइल्स व बेसिक स्विच" : "Basic RCC, local bricks, ceramic tiles, standard switches")}
            {config.grade === "standard" && (language === "hi" ? "अल्ट्राटेक सीमेंट, टाटा सरिया, विट्रिफाइड टाइल्स, ब्रांडेड स्विच" : "Tata Steel, UltraTech Cement, 2x2 Vitrified Tiles, Anchor switches")}
            {config.grade === "premium" && (language === "hi" ? "ब्रांडेड स्टील, बड़ी टाइल्स, श्नाइडर स्विच, जैक्वार नल" : "Premium Rebar, large tiles, Schneider switches, Jaquar bath")}
            {config.grade === "luxury" && (language === "hi" ? "इटैलियन मार्बल, स्मार्ट होम टच स्विच, कोहलर सैनिटरी" : "Italian Marble, Smart Touch Switches, Kohler Fittings")}
          </p>
        </div>

        {/* City Location Type */}
        <div className="space-y-3 bg-slate-50 p-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <label className="text-xs font-black uppercase text-slate-900 tracking-wider block">
            {language === "hi" ? "04. शहर / लोकेशन" : "04. City Location Factor"}
          </label>

          <select
            value={config.cityType}
            onChange={(e) => onChange({ ...config, cityType: e.target.value as any })}
            className="w-full bg-white border-2 border-slate-900 p-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none uppercase cursor-pointer"
          >
            {Object.entries(CITY_MULTIPLIERS).map(([key, val]) => (
              <option key={key} value={key}>
                {language === "hi" ? val.labelHi : val.labelEn}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            <span className="uppercase font-bold text-[10px]">{language === "hi" ? "लोकेशन गुणांक:" : "Multiplier:"}</span>
            <span className="font-mono font-black text-amber-600">{CITY_MULTIPLIERS[config.cityType]?.factor}x</span>
          </div>
        </div>

      </div>

      {/* Advanced Room Layout Toggle for Electrical/Plumbing precision */}
      <div className="mt-4 pt-4 border-t-2 border-slate-900">
        <button
          onClick={() => setShowAdvancedRooms(!showAdvancedRooms)}
          className="flex items-center justify-between w-full text-xs font-black uppercase text-slate-900 hover:text-amber-600 transition tracking-wider"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            {language === "hi"
              ? "कमरों का विभाजन (स्विच बोर्ड व प्लंबिंग सटीकता के लिए)"
              : "Room Layout Configuration (For Switch & Plumbing Precision)"}
          </span>
          {showAdvancedRooms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvancedRooms && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3 pt-3 bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            
            {/* Bedrooms */}
            <div className="bg-white p-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1 mb-1">
                <Bed className="w-3.5 h-3.5 text-blue-600" />
                {language === "hi" ? "बेडरूम" : "Bedrooms"}
              </span>
              <input
                type="number"
                min="1"
                max="20"
                value={config.bedrooms}
                onChange={(e) => onChange({ ...config, bedrooms: Math.max(1, Number(e.target.value) || 1) })}
                className="w-full bg-slate-50 border border-slate-900 p-1 text-xs font-mono font-black text-slate-900"
              />
            </div>

            {/* Bathrooms */}
            <div className="bg-white p-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1 mb-1">
                <Bath className="w-3.5 h-3.5 text-cyan-600" />
                {language === "hi" ? "बाथरूम" : "Bathrooms"}
              </span>
              <input
                type="number"
                min="1"
                max="20"
                value={config.bathrooms}
                onChange={(e) => onChange({ ...config, bathrooms: Math.max(1, Number(e.target.value) || 1) })}
                className="w-full bg-slate-50 border border-slate-900 p-1 text-xs font-mono font-black text-slate-900"
              />
            </div>

            {/* Kitchens */}
            <div className="bg-white p-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1 mb-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
                {language === "hi" ? "किचन" : "Kitchens"}
              </span>
              <input
                type="number"
                min="1"
                max="10"
                value={config.kitchens}
                onChange={(e) => onChange({ ...config, kitchens: Math.max(1, Number(e.target.value) || 1) })}
                className="w-full bg-slate-50 border border-slate-900 p-1 text-xs font-mono font-black text-slate-900"
              />
            </div>

            {/* Living Rooms */}
            <div className="bg-white p-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                {language === "hi" ? "हॉल / लिविंग" : "Living Hall"}
              </span>
              <input
                type="number"
                min="1"
                max="10"
                value={config.livingRooms}
                onChange={(e) => onChange({ ...config, livingRooms: Math.max(1, Number(e.target.value) || 1) })}
                className="w-full bg-slate-50 border border-slate-900 p-1 text-xs font-mono font-black text-slate-900"
              />
            </div>

            {/* Balconies */}
            <div className="bg-white p-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                {language === "hi" ? "बालकनी" : "Balconies"}
              </span>
              <input
                type="number"
                min="0"
                max="10"
                value={config.balconies}
                onChange={(e) => onChange({ ...config, balconies: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full bg-slate-50 border border-slate-900 p-1 text-xs font-mono font-black text-slate-900"
              />
            </div>

            {/* Parking Spaces */}
            <div className="bg-white p-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                {language === "hi" ? "पार्किंग" : "Parking Spots"}
              </span>
              <input
                type="number"
                min="0"
                max="5"
                value={config.parkingSpaces}
                onChange={(e) => onChange({ ...config, parkingSpaces: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full bg-slate-50 border border-slate-900 p-1 text-xs font-mono font-black text-slate-900"
              />
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
