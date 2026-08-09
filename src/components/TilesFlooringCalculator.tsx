import React, { useState } from "react";
import { ProjectConfig, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Grid,
  Sparkles,
  Layers,
  Square,
  Sparkle,
  Box
} from "lucide-react";

interface TilesFlooringCalculatorProps {
  config: ProjectConfig;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const TilesFlooringCalculator: React.FC<TilesFlooringCalculatorProps> = ({
  config,
  currency,
  language
}) => {
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium" | "luxury">("standard");

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";
  const rateFromINR = CURRENCY_CONVERSION[currency]?.rateFromINR || 1.0;

  const tierDetails = {
    standard: {
      nameEn: "Standard (Kajaria / Johnson 2x2 Vitrified Tiles)",
      nameHi: "स्टैंडर्ड (कजारिया / जॉनसन 2x2 विट्रिफाइड टाइल्स)",
      floorTileRateSqFt: 55,
      wallDadoRateSqFt: 50,
      antiSkidRateSqFt: 52,
      graniteRateSqFt: 140,
      adhesiveBagPrice: 350,
      groutKgPrice: 180,
      tilingLaborSqFt: 22
    },
    premium: {
      nameEn: "Premium (RAK / Somany 4x2 GVT Large Slab Tiles)",
      nameHi: "प्रीमियम (आरएके / सोमैनी 4x2 GVT बड़ी स्लैब टाइल्स)",
      floorTileRateSqFt: 85,
      wallDadoRateSqFt: 72,
      antiSkidRateSqFt: 75,
      graniteRateSqFt: 220,
      adhesiveBagPrice: 480,
      groutKgPrice: 280,
      tilingLaborSqFt: 30
    },
    luxury: {
      nameEn: "Luxury (Imported Italian Marble / Simpolo 6x4 Slabs)",
      nameHi: "लक्ज़री (इटैलियन मार्बल / सिमपोलो 6x4 विशाल स्लैब्स)",
      floorTileRateSqFt: 165,
      wallDadoRateSqFt: 120,
      antiSkidRateSqFt: 110,
      graniteRateSqFt: 380,
      adhesiveBagPrice: 650,
      groutKgPrice: 420,
      tilingLaborSqFt: 45
    }
  };

  const currentTier = tierDetails[selectedTier];

  const builtUpArea = config.builtUpAreaPerFloorFt * (config.floors + 1);
  const bathrooms = Math.max(1, config.bathrooms || 2);
  const kitchens = Math.max(1, config.kitchens || 1);

  // SqFt Quantities estimation
  const livingBedroomsFloorSqFt = Math.round(builtUpArea * 0.75); // 75% carpet living & bed
  const bathroomWallDadoSqFt = Math.round(bathrooms * 140 + kitchens * 80); // 7ft height dado
  const bathroomAntiSkidFloorSqFt = Math.round(bathrooms * 35);
  const kitchenGraniteSqFt = Math.round(kitchens * 45); // L-shape counter platform
  const parkingBalconyTilesSqFt = Math.round(builtUpArea * 0.12);

  const totalTileCoverageSqFt =
    livingBedroomsFloorSqFt +
    bathroomWallDadoSqFt +
    bathroomAntiSkidFloorSqFt +
    parkingBalconyTilesSqFt;

  // Material Bags / Kg
  const adhesiveBagsCount = Math.max(8, Math.round(totalTileCoverageSqFt / 80));
  const groutKgCount = Math.max(5, Math.round(totalTileCoverageSqFt / 120));

  // Costs
  const livingFloorTilesCostINR = livingBedroomsFloorSqFt * currentTier.floorTileRateSqFt;
  const wallDadoTilesCostINR = bathroomWallDadoSqFt * currentTier.wallDadoRateSqFt;
  const antiSkidTilesCostINR = bathroomAntiSkidFloorSqFt * currentTier.antiSkidRateSqFt;
  const graniteCostINR = kitchenGraniteSqFt * currentTier.graniteRateSqFt;
  const parkingTilesCostINR = parkingBalconyTilesSqFt * (currentTier.floorTileRateSqFt - 10);
  const adhesiveCostINR = adhesiveBagsCount * currentTier.adhesiveBagPrice;
  const groutCostINR = groutKgCount * currentTier.groutKgPrice;
  const tilingLaborCostINR = (totalTileCoverageSqFt + kitchenGraniteSqFt) * currentTier.tilingLaborSqFt;

  const totalTilingCostINR =
    livingFloorTilesCostINR +
    wallDadoTilesCostINR +
    antiSkidTilesCostINR +
    graniteCostINR +
    parkingTilesCostINR +
    adhesiveCostINR +
    groutCostINR +
    tilingLaborCostINR;

  const formatMoney = (valINR: number) => {
    const val = valINR * rateFromINR;
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Title & Tier Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Grid className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {language === "hi"
                ? "टाइल्स, मार्बल, ग्रेनाइट व फर्श कैलकुलेटर"
                : "Vitrified Tiles, Wall Dado, Granite & Tiling Calculator"}
              <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 text-[10px] font-mono font-bold border border-slate-900">
                TILES & GRANITE
              </span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "2x2 / 4x2 विट्रिफाइड फ्लोर टाइल्स, बाथरूम दादो, किचन जेट ब्लैक ग्रेनाइट, एडेसिव व मिस्त्री मजदूरी"
                : "Vitrified flooring, bathroom dado, kitchen granite slab, tile adhesive, epoxy grout & fitting labor"}
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
              {t === "standard" ? "Standard" : t === "premium" ? "Premium" : "Italian/Slab"}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Quality Banner */}
      <div className="bg-emerald-50 border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>
            {language === "hi" ? "चयनित टाइल्स श्रेणी: " : "Selected Tile Category: "}
            <strong className="text-emerald-900 font-black">{currentTier.nameEn}</strong>
          </span>
        </div>
        <div className="font-mono font-black text-slate-900 text-sm">
          {language === "hi" ? "अनुमानित कुल टाइल्स व ग्रेनाइट खर्च: " : "Total Est. Tiles & Granite Cost: "}
          <span className="text-emerald-700 text-base">{formatMoney(totalTilingCostINR)}</span>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "फ्लोर विट्रिफाइड टाइल्स" : "Floor Tiles Area"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {livingBedroomsFloorSqFt} Sq.Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.floorTileRateSqFt)}/sqft
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "बाथरूम वाल दादो" : "Wall Dado Area"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {bathroomWallDadoSqFt} Sq.Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.wallDadoRateSqFt)}/sqft
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "किचन जेट ब्लैक ग्रेनाइट" : "Kitchen Granite"}
          </span>
          <span className="font-mono font-black text-emerald-700 text-base sm:text-lg block">
            {kitchenGraniteSqFt} Sq.Ft
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.graniteRateSqFt)}/sqft
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "टाइल्स एडेसिव मसाला" : "Tile Adhesive"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {adhesiveBagsCount} Bags
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.adhesiveBagPrice)}/bag
          </span>
        </div>

        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            {language === "hi" ? "इपॉक्सी ग्राउट" : "Epoxy Grout"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {groutKgCount} Kg
          </span>
          <span className="text-[10px] font-mono text-slate-600 block">
            @{formatMoney(currentTier.groutKgPrice)}/kg
          </span>
        </div>

        <div className="bg-amber-100 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
          <span className="text-[10px] font-bold uppercase text-slate-700 block mb-1">
            {language === "hi" ? "टाइल्स मिस्त्री मजदूरी" : "Tiling Labor"}
          </span>
          <span className="font-mono font-black text-slate-900 text-base sm:text-lg block">
            {formatMoney(tilingLaborCostINR)}
          </span>
          <span className="text-[10px] font-mono text-slate-700 font-bold block">
            @{formatMoney(currentTier.tilingLaborSqFt)}/sqft
          </span>
        </div>

      </div>

      {/* Itemized Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
              <th className="p-3">#</th>
              <th className="p-3">{language === "hi" ? "टाइल्स व मार्बल विवरण" : "Flooring / Tiling Item Description"}</th>
              <th className="p-3 text-center">{language === "hi" ? "मात्रा" : "Est. Quantity"}</th>
              <th className="p-3 text-right">{language === "hi" ? "इकाई दर" : "Unit Price"}</th>
              <th className="p-3 text-right">{language === "hi" ? "अनुमानित कुल लागत" : "Total Cost"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
            
            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">1</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "लिविंग व बेडरूम विट्रिफाइड फ्लोर टाइल्स (2x2 / 4x2 फीट)" : "Living, Bedroom & Passage Vitrified Floor Tiles"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{livingBedroomsFloorSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.floorTileRateSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(livingFloorTilesCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">2</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "बाथरूम व किचन ग्लैज्ड वाल दादो टाइल्स (7-फीट ऊंचाई)" : "Bathroom & Kitchen Glazed Wall Dado Tiles"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{bathroomWallDadoSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.wallDadoRateSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(wallDadoTilesCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">3</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "बाथरूम एंटी-स्किड मैट फिनिश फ्लोर टाइल्स" : "Bathroom Anti-Skid Floor Tiles"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{bathroomAntiSkidFloorSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.antiSkidRateSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(antiSkidTilesCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">4</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "किचन काउंटर जेट ब्लैक ग्रेनाइट स्लैब (मोल्डिंग सहित)" : "Kitchen Platform Jet Black Granite Slab"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{kitchenGraniteSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.graniteRateSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(graniteCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">5</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "पार्किंग, बालकनी व पोर्च हैवी-ड्यूटी टाइल्स" : "Parking, Balcony & Porch Heavy Duty Anti-Skid Tiles"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{parkingBalconyTilesSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.floorTileRateSqFt - 10)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(parkingTilesCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">6</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "पॉलीमर मॉडीफाइड टाइल एडेसिव (20kg बैग - Roff / Asian Paints)" : "Polymer Modified Tile Adhesive Mortar (20kg Bags)"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{adhesiveBagsCount} Bags</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.adhesiveBagPrice)}/bag</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(adhesiveCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">7</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "वाटरप्रूफ इपॉक्सी टाइल ग्राउट व टाइल स्पेसर क्लिप्स" : "Waterproof Epoxy Tile Joint Grout & Tile Spacers"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{groutKgCount} Kg</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.groutKgPrice)}/kg</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(groutCostINR)}</td>
            </tr>

            <tr className="hover:bg-emerald-50/50">
              <td className="p-3 font-mono text-slate-500 font-bold">8</td>
              <td className="p-3 font-bold uppercase">
                {language === "hi" ? "टाइल्स व मार्बल मिस्त्री फिटिंग व कटिंग मजदूरी" : "Skilled Tile Fitter Fitting & Precision Cutting Labor"}
              </td>
              <td className="p-3 text-center font-mono font-bold">{totalTileCoverageSqFt + kitchenGraniteSqFt} Sq.Ft</td>
              <td className="p-3 text-right font-mono font-bold text-slate-700">{formatMoney(currentTier.tilingLaborSqFt)}/sqft</td>
              <td className="p-3 text-right font-mono font-black text-slate-900">{formatMoney(tilingLaborCostINR)}</td>
            </tr>

          </tbody>
          <tfoot>
            <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
              <td colSpan={4} className="p-3 text-right uppercase">
                {language === "hi" ? "कुल टाइल्स व मार्बल योग (Total Flooring Sum):" : "Total Tiles & Granite Sum:"}
              </td>
              <td className="p-3 text-right text-slate-900 text-sm sm:text-base">
                {formatMoney(totalTilingCostINR)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
