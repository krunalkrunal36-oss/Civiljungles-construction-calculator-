import { MaterialAndLabourRates, QualityGrade } from "../types";

export const DEFAULT_RATES_BY_GRADE: Record<QualityGrade, MaterialAndLabourRates> = {
  economy: {
    cementBagINR: 360,
    steelKgINR: 62,
    sandCuFtINR: 52,
    aggregateCuFtINR: 38,
    redBrickPcsINR: 8.5,
    aacBlockPcsINR: 60,
    tilesSqFtINR: 42,
    paintLiterINR: 260,
    puttyKgINR: 22,
    
    wireRoll90mINR: 1250,
    conduitPipeFtINR: 18,
    modularSwitchUnitINR: 38,
    switchBoard6ModINR: 160,
    mcbUnitINR: 180,
    
    cpvcPipeFtINR: 42,
    swrPipeFtINR: 55,
    commodeUnitINR: 2800,
    faucetTapUnitINR: 450,
    waterTank1000LINR: 6500,

    siteCleaningLabourSqFtINR: 3.5,
    excavationLabourCuFtINR: 11,
    rccLabourSqFtINR: 210,
    brickworkLabourSqFtINR: 45,
    plasterLabourSqFtINR: 32,
    tilingLabourSqFtINR: 28,
    electricalLabourPointINR: 280,
    plumbingLabourPointINR: 750,
    paintingLabourSqFtINR: 16,
    dailyMasonINR: 850,
    dailyHelperINR: 550,
    contractorMarginPercent: 8,
  },

  standard: {
    cementBagINR: 410, // UltraTech / ACC / Ambuja
    steelKgINR: 68, // Tata Tiscon / JSW Neosteel Fe500D
    sandCuFtINR: 62, // River Sand / Coarse M-Sand
    aggregateCuFtINR: 46, // 20mm Blue Metal Aggregate
    redBrickPcsINR: 10, // First Class Red Bricks
    aacBlockPcsINR: 72, // AAC Light-weight Blocks
    tilesSqFtINR: 65, // Vitrified 2x2 Nano Polish / Glazed
    paintLiterINR: 380, // Asian Paints Tractor/Apcolite Emulsion
    puttyKgINR: 28, // Birla White Putty
    
    wireRoll90mINR: 1750, // Havells / Finolex / Polycab Flame Retardant
    conduitPipeFtINR: 24, // Medium Duty PVC Conduits
    modularSwitchUnitINR: 65, // Anchor Roma / Goldmedal / Legrand
    switchBoard6ModINR: 240, // Flush Metallic Box + Plate
    mcbUnitINR: 280, // Havells / Schneider MCB
    
    cpvcPipeFtINR: 65, // Astral / Ashirvad SDR 11
    swrPipeFtINR: 82, // Supreme PVC Pipes
    commodeUnitINR: 5500, // Cera / Hindware Wall Hung / Floor
    faucetTapUnitINR: 950, // Jaquar / Cera Chrome Taps
    waterTank1000LINR: 8500, // Sintex 4-Layer Insulated Tank

    siteCleaningLabourSqFtINR: 5,
    excavationLabourCuFtINR: 15,
    rccLabourSqFtINR: 260,
    brickworkLabourSqFtINR: 58,
    plasterLabourSqFtINR: 42,
    tilingLabourSqFtINR: 38,
    electricalLabourPointINR: 380,
    plumbingLabourPointINR: 1100,
    paintingLabourSqFtINR: 24,
    dailyMasonINR: 1000,
    dailyHelperINR: 650,
    contractorMarginPercent: 10,
  },

  premium: {
    cementBagINR: 460,
    steelKgINR: 78,
    sandCuFtINR: 75,
    aggregateCuFtINR: 58,
    redBrickPcsINR: 12.5,
    aacBlockPcsINR: 88,
    tilesSqFtINR: 110, // Large Format Vitrified 4x2 / Italian Granite
    paintLiterINR: 580, // Royale Velvet / Weathercoat Long Life
    puttyKgINR: 35,
    
    wireRoll90mINR: 2400, // Finolex Zero Halogen
    conduitPipeFtINR: 34,
    modularSwitchUnitINR: 120, // Schneider Vivace / Legrand Arteor
    switchBoard6ModINR: 420,
    mcbUnitINR: 450,
    
    cpvcPipeFtINR: 95,
    swrPipeFtINR: 120,
    commodeUnitINR: 12500, // Kohler / Grohe
    faucetTapUnitINR: 2200, // Grohe / Kohler Concealed Mixers
    waterTank1000LINR: 12000,

    siteCleaningLabourSqFtINR: 7,
    excavationLabourCuFtINR: 20,
    rccLabourSqFtINR: 340,
    brickworkLabourSqFtINR: 75,
    plasterLabourSqFtINR: 58,
    tilingLabourSqFtINR: 52,
    electricalLabourPointINR: 520,
    plumbingLabourPointINR: 1600,
    paintingLabourSqFtINR: 36,
    dailyMasonINR: 1200,
    dailyHelperINR: 800,
    contractorMarginPercent: 12,
  },

  luxury: {
    cementBagINR: 520,
    steelKgINR: 88,
    sandCuFtINR: 90,
    aggregateCuFtINR: 70,
    redBrickPcsINR: 16,
    aacBlockPcsINR: 105,
    tilesSqFtINR: 220, // Imported Italian Marble / Quartz
    paintLiterINR: 850, // PU Polish / Royale Aspira / Textured Coating
    puttyKgINR: 45,
    
    wireRoll90mINR: 3200,
    conduitPipeFtINR: 48,
    modularSwitchUnitINR: 240, // Touch Glass Switches / Smart Home Panels
    switchBoard6ModINR: 750,
    mcbUnitINR: 750,
    
    cpvcPipeFtINR: 140,
    swrPipeFtINR: 180,
    commodeUnitINR: 28000, // Smart Bidet Commodes / Concealed Cistern
    faucetTapUnitINR: 5500, // Thermostatic Rain Showers
    waterTank1000LINR: 18000,

    siteCleaningLabourSqFtINR: 10,
    excavationLabourCuFtINR: 28,
    rccLabourSqFtINR: 450,
    brickworkLabourSqFtINR: 98,
    plasterLabourSqFtINR: 78,
    tilingLabourSqFtINR: 75,
    electricalLabourPointINR: 750,
    plumbingLabourPointINR: 2400,
    paintingLabourSqFtINR: 55,
    dailyMasonINR: 1500,
    dailyHelperINR: 1000,
    contractorMarginPercent: 15,
  }
};

export const CITY_MULTIPLIERS: Record<string, { labelEn: string; labelHi: string; factor: number }> = {
  metro: { labelEn: "Metro City (Delhi, Mumbai, Bengaluru, etc.)", labelHi: "मेट्रो शहर (दिल्ली, मुंबई, बैंगलोर आदि)", factor: 1.15 },
  tier1: { labelEn: "Tier 1 City (Ahmedabad, Pune, Hyderabad, Jaipur, etc.)", labelHi: "टायर 1 शहर (पुणे, हैदराबाद, जयपुर आदि)", factor: 1.05 },
  tier2: { labelEn: "Tier 2 / Tier 3 City (Indore, Lucknow, Patna, Kota, etc.)", labelHi: "टायर 2 / 3 शहर (इंदौर, लखनऊ, पटना आदि)", factor: 1.00 },
  rural: { labelEn: "Town / Rural Area", labelHi: "कस्बा / ग्रामीण क्षेत्र", factor: 0.90 }
};

export const CURRENCY_CONVERSION: Record<string, { symbol: string; rateFromINR: number }> = {
  INR: { symbol: "₹", rateFromINR: 1.0 },
  USD: { symbol: "$", rateFromINR: 0.012 },
  EUR: { symbol: "€", rateFromINR: 0.011 }
};
