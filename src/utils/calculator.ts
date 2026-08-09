import {
  ProjectConfig,
  CalculationResult,
  MaterialAndLabourRates,
  ElectricalPointDetails,
  PhaseCostDetail,
  MaterialItemQuantity,
  LabourBreakdownItem
} from "../types";
import { DEFAULT_RATES_BY_GRADE, CITY_MULTIPLIERS, CURRENCY_CONVERSION } from "../data/defaultRates";

export function calculateElectricalPoints(config: ProjectConfig): ElectricalPointDetails {
  const { bedrooms, bathrooms, kitchens, livingRooms, balconies, parkingSpaces } = config;

  // Point count rules
  // Living Room: 4 lights, 2 fans, 4 plugs 6A, 1 TV 16A, 1 AC 16A
  // Bedroom: 3 lights, 1 fan, 3 plugs 6A, 1 AC 16A, 1 night lamp = 9 points
  // Kitchen: 2 lights, 1 exhaust, 2 plugs 6A, 2 plugs 16A (Microwave/Mixer/Chimney/RO)
  // Bathroom: 2 lights, 1 geyser 16A, 1 shaver 6A, 1 exhaust
  // Balcony/Passage: 2 lights, 1 plug 6A
  // Parking: 2 lights, 1 plug 16A (EV charging/pressure wash)

  const lightPoints = (livingRooms * 4) + (bedrooms * 3) + (kitchens * 2) + (bathrooms * 2) + (balconies * 2) + (parkingSpaces * 2) + 4; // +4 for staircase/passage
  const fanPoints = (livingRooms * 2) + (bedrooms * 1) + (kitchens * 1);
  const socket6APoints = (livingRooms * 4) + (bedrooms * 3) + (kitchens * 2) + (bathrooms * 1) + (balconies * 1);
  const socket16APoints = (livingRooms * 2) + (bedrooms * 1) + (kitchens * 2) + (bathrooms * 1) + (parkingSpaces * 1); // Heavy load

  const switchesTotal = lightPoints + fanPoints + socket6APoints + socket16APoints;
  // Avg 6 points per switchboard
  const switchBoardsTotal = Math.ceil(switchesTotal / 6) + 2; // +2 for main entrance & DB near board
  
  // Total electrical points for labor calculation
  const totalPoints = switchesTotal;

  // MCB calculation: 1 Main isolator + 1 MCB per heavy load + 1 per light circuit
  const mcbCount = Math.ceil(socket16APoints * 1.2) + Math.ceil(lightPoints / 6) + 2;

  // Wire rolls (90m each): 1 roll per 15 points roughly
  const wireRollsRequired = Math.ceil(totalPoints / 12) + 1;

  // Conduit pipes ft: approx 15 ft per point
  const conduitFtRequired = Math.ceil(totalPoints * 14);

  return {
    lightPoints,
    fanPoints,
    socket6APoints,
    socket16APoints,
    switchesTotal,
    switchBoardsTotal,
    mcbCount,
    wireRollsRequired,
    conduitFtRequired,
  };
}

export function calculateConstructionCost(config: ProjectConfig): CalculationResult {
  const { builtUpAreaPerFloorFt, floors, grade, cityType, currency, customRates } = config;
  
  const numFloorsTotal = floors + 1; // 0 = Ground only (1 floor), 1 = G+1 (2 floors), etc.
  const totalBuiltUpAreaSqFt = builtUpAreaPerFloorFt * numFloorsTotal;

  // Base rates according to grade
  const baseRates = DEFAULT_RATES_BY_GRADE[grade] || DEFAULT_RATES_BY_GRADE.standard;

  // Merge custom user rate overrides if provided
  const rates: MaterialAndLabourRates = {
    ...baseRates,
    ...customRates,
  };

  const cityFactor = CITY_MULTIPLIERS[cityType]?.factor || 1.0;
  const currencyInfo = CURRENCY_CONVERSION[currency] || CURRENCY_CONVERSION.INR;

  // Helper to scale cost with city factor & currency rate
  const scale = (inrVal: number) => inrVal * cityFactor * currencyInfo.rateFromINR;

  // -------------------------------------------------------------
  // QUANTITY CALCULATIONS (Standard Civil Engineering Norms)
  // -------------------------------------------------------------
  
  // Cement: Approx 0.40 bags per sq.ft builtup area total across all stages
  const cementBagsTotal = Math.round(totalBuiltUpAreaSqFt * 0.42);
  
  // Steel: Approx 3.80 kg per sq.ft builtup area
  const steelKgTotal = Math.round(totalBuiltUpAreaSqFt * 3.85);

  // Sand / M-Sand: Approx 1.8 cu.ft per sq.ft
  const sandCuFtTotal = Math.round(totalBuiltUpAreaSqFt * 1.85);

  // Coarse Aggregate: Approx 1.35 cu.ft per sq.ft
  const aggregateCuFtTotal = Math.round(totalBuiltUpAreaSqFt * 1.38);

  // Red Bricks (assuming 9" external & 4.5" internal walls): Approx 8.5 bricks per sq.ft
  const redBricksTotal = Math.round(totalBuiltUpAreaSqFt * 8.5);
  // AAC Blocks alternative (if chosen): Approx 0.52 blocks per sq.ft
  const aacBlocksTotal = Math.round(totalBuiltUpAreaSqFt * 0.52);

  // Flooring Tiles (including 10% cutting/wastage): Approx 1.15 sq.ft per sq.ft
  const tilesSqFtTotal = Math.round(totalBuiltUpAreaSqFt * 1.18);

  // Wall Putty (Kg): Approx 0.85 kg per sq.ft
  const puttyKgTotal = Math.round(totalBuiltUpAreaSqFt * 0.85);

  // Paint Liters (Primer + Emulsion + Exterior): Approx 0.22 liters per sq.ft
  const paintLitersTotal = Math.round(totalBuiltUpAreaSqFt * 0.24);

  // Electrical details
  const electricalDetails = calculateElectricalPoints(config);

  // Plumbing details
  const cpvcPipeFt = Math.round(totalBuiltUpAreaSqFt * 0.45);
  const swrPipeFt = Math.round(totalBuiltUpAreaSqFt * 0.35);
  const commodeCount = config.bathrooms;
  const faucetTapCount = config.bathrooms * 4 + config.kitchens * 2;
  const waterTankCapacityL = numFloorsTotal > 2 ? 2000 : 1000;

  // -------------------------------------------------------------
  // PHASE-BY-PHASE COST CALCULATION (Area Cleaning to Switches)
  // -------------------------------------------------------------

  // Phase 1: Site Clearance, Excavation & Anti-Termite (एरिया की सफाई और खुदाई)
  const siteCleaningArea = totalBuiltUpAreaSqFt * 1.15;
  const siteCleaningCost = scale(siteCleaningArea * rates.siteCleaningLabourSqFtINR);
  const excavationCuFt = totalBuiltUpAreaSqFt * 0.35;
  const excavationCost = scale(excavationCuFt * rates.excavationLabourCuFtINR);
  const antiTermiteCost = scale(totalBuiltUpAreaSqFt * 6); // Chemical soil barrier
  const pccConcreteMatCost = scale(totalBuiltUpAreaSqFt * 0.04 * rates.cementBagINR + totalBuiltUpAreaSqFt * 0.2 * rates.sandCuFtINR + totalBuiltUpAreaSqFt * 0.3 * rates.aggregateCuFtINR);
  
  const phase1Material = pccConcreteMatCost + scale(totalBuiltUpAreaSqFt * 3.5); // Chemical + base PCC mat
  const phase1Labour = siteCleaningCost + excavationCost + antiTermiteCost;

  // Phase 2: Foundation & Substructure / Plinth (नींव और प्लिंथ बीम)
  const phase2CementBags = Math.round(cementBagsTotal * 0.16);
  const phase2SteelKg = Math.round(steelKgTotal * 0.18);
  const phase2Sand = Math.round(sandCuFtTotal * 0.16);
  const phase2Aggregate = Math.round(aggregateCuFtTotal * 0.18);
  
  const phase2Material = scale(
    phase2CementBags * rates.cementBagINR +
    phase2SteelKg * rates.steelKgINR +
    phase2Sand * rates.sandCuFtINR +
    phase2Aggregate * rates.aggregateCuFtINR
  );
  const phase2Labour = scale(totalBuiltUpAreaSqFt * (rates.rccLabourSqFtINR * 0.22));

  // Phase 3: Superstructure RCC Columns, Beams & Slab (ढांचा - कॉलम, बीम और छत ढलाई)
  const phase3CementBags = Math.round(cementBagsTotal * 0.28);
  const phase3SteelKg = Math.round(steelKgTotal * 0.45);
  const phase3Sand = Math.round(sandCuFtTotal * 0.26);
  const phase3Aggregate = Math.round(aggregateCuFtTotal * 0.32);

  const phase3Material = scale(
    phase3CementBags * rates.cementBagINR +
    phase3SteelKg * rates.steelKgINR +
    phase3Sand * rates.sandCuFtINR +
    phase3Aggregate * rates.aggregateCuFtINR
  );
  // Shuttering & Centering labour included in RCC labour
  const phase3Labour = scale(totalBuiltUpAreaSqFt * (rates.rccLabourSqFtINR * 0.58));

  // Phase 4: Masonry & Brickwork (ईंट की दीवारें)
  const phase4CementBags = Math.round(cementBagsTotal * 0.15);
  const phase4Sand = Math.round(sandCuFtTotal * 0.20);
  const phase4Material = scale(
    redBricksTotal * rates.redBrickPcsINR +
    phase4CementBags * rates.cementBagINR +
    phase4Sand * rates.sandCuFtINR
  );
  const phase4Labour = scale(totalBuiltUpAreaSqFt * rates.brickworkLabourSqFtINR);

  // Phase 5: Plastering & Waterproofing (प्लास्टर और वाटरप्रूफिंग)
  const phase5CementBags = Math.round(cementBagsTotal * 0.18);
  const phase5Sand = Math.round(sandCuFtTotal * 0.22);
  const waterproofingChemicals = scale(totalBuiltUpAreaSqFt * 14);

  const phase5Material = scale(
    phase5CementBags * rates.cementBagINR +
    phase5Sand * rates.sandCuFtINR
  ) + waterproofingChemicals;
  const phase5Labour = scale(totalBuiltUpAreaSqFt * rates.plasterLabourSqFtINR);

  // Phase 6: Flooring, Tiling & Kitchen Granite (टाइल्स, मार्बल और ग्रेनाइट)
  const tilesCost = scale(tilesSqFtTotal * rates.tilesSqFtINR);
  const tileAdhesiveMortar = scale(totalBuiltUpAreaSqFt * 18);
  const kitchenGraniteSlab = scale((config.kitchens * 45) * 160); // Granite kitchen platform
  
  const phase6Material = tilesCost + tileAdhesiveMortar + kitchenGraniteSlab;
  const phase6Labour = scale(totalBuiltUpAreaSqFt * rates.tilingLabourSqFtINR);

  // Phase 7: Doors, Windows & Hardware (दरवाजे और खिड़कियां)
  const mainDoorCost = scale(1 * (grade === 'luxury' ? 45000 : grade === 'premium' ? 28000 : grade === 'standard' ? 18000 : 12000));
  const bedroomDoorsCost = scale(config.bedrooms * (grade === 'luxury' ? 12000 : grade === 'premium' ? 8500 : grade === 'standard' ? 6200 : 4500));
  const bathroomDoorsCost = scale(config.bathrooms * (grade === 'luxury' ? 6500 : grade === 'premium' ? 5000 : grade === 'standard' ? 3800 : 2800));
  const windowsCost = scale(totalBuiltUpAreaSqFt * 0.12 * (grade === 'luxury' ? 480 : grade === 'premium' ? 360 : grade === 'standard' ? 260 : 190)); // UPVC / Aluminum windows

  const phase7Material = mainDoorCost + bedroomDoorsCost + bathroomDoorsCost + windowsCost;
  const phase7Labour = scale(totalBuiltUpAreaSqFt * 28); // Carpenter & window fitting labour

  // Phase 8: Electrical Wiring, Switchboards, Switches & Fittings (बिजली की वायरिंग, स्विचबोर्ड और स्विच)
  const wireCost = scale(electricalDetails.wireRollsRequired * rates.wireRoll90mINR);
  const conduitCost = scale(electricalDetails.conduitFtRequired * rates.conduitPipeFtINR);
  const switchesAndSocketsCost = scale(electricalDetails.switchesTotal * rates.modularSwitchUnitINR);
  const switchBoardsCost = scale(electricalDetails.switchBoardsTotal * rates.switchBoard6ModINR);
  const mcbAndDbCost = scale(electricalDetails.mcbCount * rates.mcbUnitINR + 1800);

  const phase8Material = wireCost + conduitCost + switchesAndSocketsCost + switchBoardsCost + mcbAndDbCost;
  const phase8Labour = scale(electricalDetails.switchesTotal * rates.electricalLabourPointINR);

  // Phase 9: Plumbing, Drainage, Sanitary & Water Tank (प्लंबिंग, सैनिटरी और पानी की टंकी)
  const cpvcPipesCost = scale(cpvcPipeFt * rates.cpvcPipeFtINR);
  const swrPipesCost = scale(swrPipeFt * rates.swrPipeFtINR);
  const commodessCost = scale(commodeCount * rates.commodeUnitINR);
  const faucetsCost = scale(faucetTapCount * rates.faucetTapUnitINR);
  const tankCost = scale((waterTankCapacityL / 1000) * rates.waterTank1000LINR);

  const phase9Material = cpvcPipesCost + swrPipesCost + commodessCost + faucetsCost + tankCost;
  const phase9Labour = scale((commodeCount + faucetTapCount) * rates.plumbingLabourPointINR + totalBuiltUpAreaSqFt * 12);

  // Phase 10: Painting, Putty & Wall Finishes (पेंटिंग और पुट्टी का काम)
  const puttyCost = scale(puttyKgTotal * rates.puttyKgINR);
  const paintCost = scale(paintLitersTotal * rates.paintLiterINR);
  
  const phase10Material = puttyCost + paintCost;
  const phase10Labour = scale(totalBuiltUpAreaSqFt * rates.paintingLabourSqFtINR);

  // Phase 11: Final Site Deep Cleaning, Architect & Contingency (अंतिम सफाई, आर्किटेक्ट और ठेकेदार)
  const finalCleaningLabour = scale(totalBuiltUpAreaSqFt * 4.5);
  const architectDrawingFees = scale(totalBuiltUpAreaSqFt * 18);
  const temporaryUtilities = scale(numFloorsTotal * 8000);

  const phase11Material = temporaryUtilities;
  const phase11Labour = finalCleaningLabour + architectDrawingFees;

  // -------------------------------------------------------------
  // CONSOLIDATED PHASES ARRAY
  // -------------------------------------------------------------

  const rawPhasesList = [
    {
      id: "phase_1",
      phaseNumber: 1,
      titleEn: "Site Clearance & Earthwork Excavation",
      titleHi: "साइट की सफाई और जमीन की खुदाई",
      descriptionEn: "Area Jungle/debris cleaning, footing excavation, anti-termite soil treatment & PCC base concrete.",
      descriptionHi: "झाड़ियों/मलबे की सफाई, नींव के लिए खुदाई, दीमक रोधी दवा का छिड़काव और पीसीसी कंक्रीट बेस।",
      materialCost: phase1Material,
      labourCost: phase1Labour,
      keyMaterials: ["Anti-Termite Chemical", "Cement 1:4:8 PCC", "River Sand", "Coarse Aggregate"],
      inspectionTipsEn: [
        "Ensure soil is excavated till hard strata level is reached.",
        "Check anti-termite chemical ratio (1:19 chlorpyrifos/imidacloprid solution).",
        "PCC must be minimum 4 inches (100mm) thick and well leveled."
      ],
      inspectionTipsHi: [
        "यह सुनिश्चित करें कि खुदाई तब तक हो जब तक सख्त मिट्टी (Hard Strata) न मिल जाए।",
        "दीमक रोधी रासायनिक घोल का सही अनुपात जांचें।",
        "पीसीसी की मोटाई कम से कम 4 इंच होनी चाहिए।"
      ],
      durationWeeks: 2,
    },
    {
      id: "phase_2",
      phaseNumber: 2,
      titleEn: "Foundation & Substructure (Plinth Level)",
      titleHi: "नींव, फुटिंग और प्लिंथ बीम (सब-स्ट्रक्चर)",
      descriptionEn: "Footing RCC casting, column starter, plinth beam concrete, backfilling soil & DPC damp proofing.",
      descriptionHi: "फुटिंग कंक्रीट, कॉलम स्टार्टर, प्लिंथ बीम ढलाई, मिट्टी की भराई और सीलन-रोधी DPC लेयर।",
      materialCost: phase2Material,
      labourCost: phase2Labour,
      keyMaterials: [`Cement (${phase2CementBags} Bags)`, `TMT Steel (${phase2SteelKg} kg)`, `M-Sand (${phase2Sand} cu.ft)`, "DPC Waterproof Coating"],
      inspectionTipsEn: [
        "Check footing mat steel spacing (minimum 6 inches c/c).",
        "Provide 50mm clear concrete cover under footing reinforcement.",
        "Compact backfilling soil in 6-inch layers with water soaking."
      ],
      inspectionTipsHi: [
        "फुटिंग जाल का गैप (कम से कम 6 इंच) जांचें।",
        "फुटिंग सरिये के नीचे 50mm कवर ब्लॉक जरूर लगाएं।",
        "प्लॉट भराई के बाद पानी डालकर दुर्मुट/कम्पैक्टर से मिट्टी अच्छी तरह बैठाएं।"
      ],
      durationWeeks: 3,
    },
    {
      id: "phase_3",
      phaseNumber: 3,
      titleEn: "Superstructure RCC Columns, Beams & Slab",
      titleHi: "कॉलम, बीम और छत ढलाई (सुपर-स्ट्रक्चर)",
      descriptionEn: "RCC columns casting, roof beam shuttering, steel bar bending, slab casting with vibrator.",
      descriptionHi: "कॉलम ढलाई, बीम और छत का शटरिंग फॉर्मवर्क, सरिया बांधना और कंक्रीट वाइब्रेटर से छत ढलाई।",
      materialCost: phase3Material,
      labourCost: phase3Labour,
      keyMaterials: [`Cement (${phase3CementBags} Bags)`, `Fe500D Steel (${phase3SteelKg} kg)`, "Centering Plywood/Iron Sheets", "M20/M25 Ready/Site Concrete"],
      inspectionTipsEn: [
        "Maintain 25mm column cover & 20mm slab cover blocks.",
        "Use mechanical needle vibrator during concrete pouring to avoid honeycombing.",
        "Ensure continuous water ponding curing for minimum 14 days."
      ],
      inspectionTipsHi: [
        "छत की कंक्रीट ढलाई में 20mm और कॉलम में 40mm का कवर ब्लॉक जरूर रखें।",
        "कंक्रीट डालते समय वाइब्रेटर मशीन का इस्तेमाल अनिवार्य रूप से करें।",
        "ढाई जाने के बाद 14 दिनों तक छत पर पानी की क्यारियां (Pond Curing) बनाकर रखें।"
      ],
      durationWeeks: 4 * numFloorsTotal,
    },
    {
      id: "phase_4",
      phaseNumber: 4,
      titleEn: "Masonry & Wall Construction",
      titleHi: "ईंट की दीवारें (ब्रिकवर्क / AAC ब्लॉक्स)",
      descriptionEn: "9-inch exterior boundary/load walls, 4.5-inch partition walls, RCC lintel beams over openings.",
      descriptionHi: "9-इंच बाहरी दीवारें, 4.5-इंच अंदरूनी दीवारें, दरवाजे-खिड़की के ऊपर लिंटेल बीम।",
      materialCost: phase4Material,
      labourCost: phase4Labour,
      keyMaterials: [`Red Bricks (${redBricksTotal} Pcs)`, `Cement (${phase4CementBags} Bags)`, `Sand (${phase4Sand} cu.ft)`, "Lintel RCC Steel"],
      inspectionTipsEn: [
        "Soak red bricks in water for at least 2 hours before laying.",
        "Keep mortar joint thickness strictly between 10mm to 12mm.",
        "Provide RCC chicken wire mesh at brick-to-column concrete joints before plastering."
      ],
      inspectionTipsHi: [
        "लाल ईंटों को इस्तेमाल करने से पहले कम से कम 2 घंटे पानी में भिगोएं।",
        "ईंट की जुड़ाई में मसाले की मोटाई 10mm से 12mm से ज्यादा न हो।",
        "दीवार और कॉलम के जोड़ पर प्लास्टर से पहले मुर्गा जाली (Chicken Mesh) लगाएं।"
      ],
      durationWeeks: 3 * numFloorsTotal,
    },
    {
      id: "phase_5",
      phaseNumber: 5,
      titleEn: "Plastering & Waterproofing Work",
      titleHi: "अंदरूनी व बाहरी प्लास्टर और वाटरप्रूफिंग",
      descriptionEn: "12mm interior 1:6 cement plaster, 20mm exterior double coat with Dr. Fixit, bathroom sunken waterproofing.",
      descriptionHi: "अंदर 12mm का प्लास्टर, बाहर 20mm डबल कोट प्लास्टर वाटरप्रूफिंग केमिकल के साथ और टॉयलेट सीलन रोधी कोटिंग।",
      materialCost: phase5Material,
      labourCost: phase5Labour,
      keyMaterials: [`Cement (${phase5CementBags} Bags)`, "Waterproofing Chemical Compound", "Fine Plaster Sand"],
      inspectionTipsEn: [
        "Groove brick joints before plastering for maximum bonding.",
        "Cure plaster thoroughly 3 times daily for 7 days.",
        "Perform 48-hour water ponding test in bathroom sunken slab after waterproofing."
      ],
      inspectionTipsHi: [
        "प्लास्टर करने से पहले दीवार की अच्छी तरह से तराई करें।",
        "प्लास्टर की कम से कम 7 दिनों तक दिन में 3 बार तराई करें।",
        "टॉयलेट में वाटरप्रूफिंग के बाद 48 घंटे पानी भरकर लीक टेस्ट जरूर करें।"
      ],
      durationWeeks: 3,
    },
    {
      id: "phase_6",
      phaseNumber: 6,
      titleEn: "Flooring, Tiling & Granite Work",
      titleHi: "टाइल्स, मार्बल, बाथरूम टाइल्स और ग्रेनाइट",
      descriptionEn: "2x2/4x2 Vitrified floor tiles laying, bathroom wall dado, kitchen granite platform counter & sink.",
      descriptionHi: "लिविंग और बेडरूम में विट्रिफाइड टाइल्स, बाथरूम में एंटी-स्किड टाइल्स, किचन में ग्रेनाइट प्लेटफॉर्म व सिंक।",
      materialCost: phase6Material,
      labourCost: phase6Labour,
      keyMaterials: [`Floor Tiles (${tilesSqFtTotal} sq.ft)`, "Tile Adhesive / Polymers", "Granite Slab", "Epoxy Grout"],
      inspectionTipsEn: [
        "Check floor slope towards floor trap in bathrooms & balconies.",
        "Use tile spacers (2mm) and polymer adhesive for stain-free joints.",
        "Tap tiles with rubber hammer to eliminate hollow sound pockets."
      ],
      inspectionTipsHi: [
        "बाथरूम और बालकनी में ढलान (Slope) जाली की तरफ सही जांचें।",
        "टाइल्स लगाने में पॉलीमर एडेसिव (Tile Adhesive) का उपयोग करें ताकि टाइल बाद में उखड़े नहीं।",
        "रबर के हथौड़े से ठोक कर देखें कि अंदर खोखली आवाज तो नहीं आ रही।"
      ],
      durationWeeks: 3,
    },
    {
      id: "phase_7",
      phaseNumber: 7,
      titleEn: "Doors, Windows & Frames",
      titleHi: "दरवाजे, खिड़कियां, वेंटिलेटर और चौखट",
      descriptionEn: "Teakwood/Flush doors, waterproof WPC doors for toilets, UPVC sliding glass windows with grills.",
      descriptionHi: "मुख्य सागौन दरवाजा, बेडरूम फ्लश डोर, वाटरप्रूफ WPC बाथरूम डोर और सेफ्टी ग्रिल के साथ UPVC खिड़कियां।",
      materialCost: phase7Material,
      labourCost: phase7Labour,
      keyMaterials: ["Main Teak Door", "Flush Doors", "UPVC Window Frames", "SS Hinges & Mortise Locks"],
      inspectionTipsEn: [
        "Ensure window silicone sealant coating on exterior gaps to prevent rainwater leakage.",
        "Check diagonal squareness of door frames before fixing.",
        "Use WPC / PVC doors for bathrooms to prevent water swelling."
      ],
      inspectionTipsHi: [
        "खिड़कियों के बाहरी फ्रेम में सिलिकॉन सीलेंट जरूर भरवाएं ताकि बारिश का पानी अंदर न आए।",
        "दरवाजों के फ्रेम की गुनिया (90 degree) जांचें।",
        "बाथरूम में सिर्फ वाटरप्रूफ WPC या PVC दरवाजे ही लगवाएं।"
      ],
      durationWeeks: 2,
    },
    {
      id: "phase_8",
      phaseNumber: 8,
      titleEn: "Electrical Wiring, Conduit, Switches & DB",
      titleHi: "बिजली की वायरिंग, कंड्यूट पाइप, स्विचबोर्ड और स्विच",
      descriptionEn: "Wall chasing, conduit pipes, FR copper wire drawing, modular switchboards, switches, sockets & MCB box.",
      descriptionHi: "दीवार की झिरी कटाई, कंड्यूट पाइप डालना, कॉपर वायर खींचना, मॉड्यूलर स्विच-सॉकेट व एमसीबी बॉक्स फिटिंग।",
      materialCost: phase8Material,
      labourCost: phase8Labour,
      keyMaterials: [
        `FR Copper Wires (${electricalDetails.wireRollsRequired} Rolls)`,
        `Modular Switches (${electricalDetails.switchesTotal} Units)`,
        `Switchboard Plates (${electricalDetails.switchBoardsTotal} Boards)`,
        `MCB & DB Box (${electricalDetails.mcbCount} MCBs)`
      ],
      inspectionTipsEn: [
        "Ensure separate 2.5/4.0 sq.mm wire line for heavy loads (AC, Geyser, Microwave).",
        "Check proper copper earthing rod connection with charcoal/salt pit.",
        "Test all switchboards with multimeter before final cover plate fixing."
      ],
      inspectionTipsHi: [
        "एसी, गीजर और भारी उपकरणों के लिए अलग से 2.5 या 4.0 sq.mm का वायर पड़वाएं।",
        "घर की सुरक्षा के लिए अर्थिंग (Copper Pit / Chemical Earthing) जरूर करवाएं।",
        "स्विच बोर्ड ढकने से पहले सभी प्वाइंट्स में करंट टेस्ट करवा लें।"
      ],
      durationWeeks: 2,
    },
    {
      id: "phase_9",
      phaseNumber: 9,
      titleEn: "Plumbing, Drainage, Sanitary & Water Tank",
      titleHi: "प्लंबिंग, ड्रेनेज, सैनिटरी और ओवरहेड वाटर टैंक",
      descriptionEn: "Concealed CPVC hot/cold water pipes, SWR PVC drainage, wall-hung commodes, taps & 1000L water tank.",
      descriptionHi: "दीवार के अंदर CPVC पानी की पाइपलाइन, SWR सीवर ड्रेनेज, कमोड, बेसिन, नल व छत पर 1000L पानी की टंकी।",
      materialCost: phase9Material,
      labourCost: phase9Labour,
      keyMaterials: [
        `CPVC Pipes (${cpvcPipeFt} ft)`,
        `SWR PVC Pipes (${swrPipeFt} ft)`,
        `Sanitary Commodes (${commodeCount} Pcs)`,
        `Taps & Fittings (${faucetTapCount} Pcs)`,
        `Water Tank (${waterTankCapacityL} Liters)`
      ],
      inspectionTipsEn: [
        "Perform 10 bar pressure testing on CPVC lines for 24 hours before plastering.",
        "Ensure 1:40 slope in drainage PVC pipes for smooth waste flow without clogging.",
        "Install non-return valve (NRV) near water meter / pump line."
      ],
      inspectionTipsHi: [
        "दीवार बंद करने से पहले CPVC पाइपलाइन पर 24 घंटे प्रेशर टेस्ट करवाकर लीकेज जांचें।",
        "सीवर पाइप में सही ढलान (Slope) रखें ताकि कचरा कभी अटके नहीं।",
        "ओवरहेड वाटर टैंक में ओवरफ्लो अलार्म / ऑटो-कट ऑफ स्विच जरूर लगवाएं।"
      ],
      durationWeeks: 2,
    },
    {
      id: "phase_10",
      phaseNumber: 10,
      titleEn: "Painting, Wall Putty & Finishing",
      titleHi: "पेंटिंग, वॉल पुट्टी और वॉल फिनिशिंग",
      descriptionEn: "2 Coats Birla wall putty sand rubbing, 1 coat water primer, 2 coats interior & weather-shield exterior paint.",
      descriptionHi: "2 कोट वॉल पुट्टी की घिसाई, 1 कोट प्राइमर और 2 कोट रॉयल/इमल्शन इंटीरियर व वेदरप्रूफ एक्सटीरियर पेंट।",
      materialCost: phase10Material,
      labourCost: phase10Labour,
      keyMaterials: [`Wall Putty (${puttyKgTotal} kg)`, `Primer & Emulsion Paint (${paintLitersTotal} Liters)`, "Sanding Paper"],
      inspectionTipsEn: [
        "Ensure moisture meter reading on walls is below 12% before putty application.",
        "Allow 6 to 8 hours drying time between successive coats of paint.",
        "Apply 100% acrylic weather-proof paint on exterior walls to prevent fungal growth."
      ],
      inspectionTipsHi: [
        "पुट्टी लगाने से पहले दीवार पूरी तरह सूखी होनी चाहिए।",
        "पेंट के एक कोट के बाद कम से कम 6 घंटे सूखने का समय दें।",
        "बाहरी दीवारों पर वॉटरप्रूफ वेदरकोट पेंट का ही उपयोग करें।"
      ],
      durationWeeks: 3,
    },
    {
      id: "phase_11",
      phaseNumber: 11,
      titleEn: "Deep Cleaning, Architect Fee & Contingency",
      titleHi: "साइट की अंतिम सफाई, आर्किटेक्ट शुल्क व आकस्मिक फंड",
      descriptionEn: "Post-construction deep chemical floor cleaning, debris removal, structural drawing fee & contingency buffer.",
      descriptionHi: "निर्माण के बाद टाइल्स/कांच की केमिकल सफाई, मलबा हटाना, नक्शा/स्ट्रक्चरल फीस व 5% आकस्मिक बजट।",
      materialCost: phase11Material,
      labourCost: phase11Labour,
      keyMaterials: ["Cleaning Chemicals", "Debris Hauling Trucks", "Architect / Structural Blueprints"],
      inspectionTipsEn: [
        "Conduct thorough inspection of all electrical switches and plumbing traps before final handover.",
        "Keep 5% buffer amount reserved for unexpected local body or utility connection costs."
      ],
      inspectionTipsHi: [
        "घर में शिफ्ट होने से पहले सभी नल, स्विच और ताले चलाकर देख लें।",
        "अंतिम बजट में 5% आकस्मिक राशि (Contingency Fund) सुरक्षित रखें।"
      ],
      durationWeeks: 1,
    }
  ];

  // Calculate percentages & total phase cost
  let materialCostTotal = 0;
  let labourCostTotal = 0;

  const phases: PhaseCostDetail[] = rawPhasesList.map((p) => {
    const totalCost = p.materialCost + p.labourCost;
    materialCostTotal += p.materialCost;
    labourCostTotal += p.labourCost;
    return {
      ...p,
      totalCost,
      percentageOfTotal: 0, // calculated below
    };
  });

  // Architect/Contractor margin & contingency
  const subtotalCost = materialCostTotal + labourCostTotal;
  const contractorAndArchitectCost = subtotalCost * (rates.contractorMarginPercent / 100);
  const contingencyCost = subtotalCost * 0.05; // 5% contingency

  const totalCost = subtotalCost + contractorAndArchitectCost + contingencyCost;
  const costPerSqFt = totalCost / totalBuiltUpAreaSqFt;

  // Update percentages
  phases.forEach((p) => {
    p.percentageOfTotal = Math.round((p.totalCost / totalCost) * 1000) / 10;
  });

  // -------------------------------------------------------------
  // MATERIAL QUANTITY LIST FOR SUMMARY TABLE (Extremely Detailed)
  // -------------------------------------------------------------
  const materials: MaterialItemQuantity[] = [
    // --- Anti-Termite Treatment ---
    {
      id: "mat_anti_termite",
      nameEn: "Chlorpyrifos / Imidacloprid Anti-Termite Chemical",
      nameHi: "दीमक रोधी रासायनिक घोल (Anti-Termite Chemical)",
      category: "anti_termite",
      quantity: Math.max(5, Math.round(totalBuiltUpAreaSqFt * 0.08)),
      unit: "Liters",
      rate: scale(280),
      totalCost: scale(Math.max(5, Math.round(totalBuiltUpAreaSqFt * 0.08)) * 280),
    },

    // --- Civil Base Materials ---
    {
      id: "mat_cement",
      nameEn: "Cement (OPC 53 / PPC Structural Grade)",
      nameHi: "सीमेंट (अल्ट्राटेक / एसीसी / अंबूजा / श्री)",
      category: "civil",
      quantity: cementBagsTotal,
      unit: "Bags (50kg)",
      rate: scale(rates.cementBagINR),
      totalCost: scale(cementBagsTotal * rates.cementBagINR),
    },
    {
      id: "mat_steel",
      nameEn: "TMT Rebar Steel (Fe500D / Fe550D)",
      nameHi: "टीएमटी सरिया (टाटा टिस्कॉन / जेएसडब्ल्यू / जिंदल)",
      category: "civil",
      quantity: steelKgTotal,
      unit: "Kg",
      rate: scale(rates.steelKgINR),
      totalCost: scale(steelKgTotal * rates.steelKgINR),
    },
    {
      id: "mat_sand",
      nameEn: "M-Sand / Coarse Concrete Sand",
      nameHi: "एम-सैंड कंक्रीट रेत (M-Sand)",
      category: "civil",
      quantity: sandCuFtTotal,
      unit: "Cu.Ft",
      rate: scale(rates.sandCuFtINR),
      totalCost: scale(sandCuFtTotal * rates.sandCuFtINR),
    },
    {
      id: "mat_aggregate",
      nameEn: "Coarse Aggregate (10mm & 20mm Blue Metal)",
      nameHi: "गिट्टी / एग्रीगेट (10mm व 20mm)",
      category: "civil",
      quantity: aggregateCuFtTotal,
      unit: "Cu.Ft",
      rate: scale(rates.aggregateCuFtINR),
      totalCost: scale(aggregateCuFtTotal * rates.aggregateCuFtINR),
    },
    {
      id: "mat_bricks",
      nameEn: "First Class Red Bricks (or AAC Blocks)",
      nameHi: "प्रथम श्रेणी लाल ईंटें (या AAC ब्लॉक्स)",
      category: "civil",
      quantity: redBricksTotal,
      unit: "Pcs",
      rate: scale(rates.redBrickPcsINR),
      totalCost: scale(redBricksTotal * rates.redBrickPcsINR),
    },

    // --- Plaster Details ---
    {
      id: "mat_plaster_cement",
      nameEn: "Fine Plastering Cement (PPC)",
      nameHi: "प्लास्टर ग्रेड सीमेंट (PPC Cement)",
      category: "plaster",
      quantity: phase5CementBags,
      unit: "Bags (50kg)",
      rate: scale(rates.cementBagINR - 15),
      totalCost: scale(phase5CementBags * (rates.cementBagINR - 15)),
    },
    {
      id: "mat_plaster_sand",
      nameEn: "Filtered Fine Plaster River Sand (P-Sand)",
      nameHi: "छाना हुआ महीन प्लास्टर सैंड (P-Sand)",
      category: "plaster",
      quantity: phase5Sand,
      unit: "Cu.Ft",
      rate: scale(rates.sandCuFtINR + 5),
      totalCost: scale(phase5Sand * (rates.sandCuFtINR + 5)),
    },
    {
      id: "mat_chicken_mesh",
      nameEn: "Galvanized GI Chicken Wire Mesh (For Joint Crack Prevention)",
      nameHi: "मुर्गा जाली (कॉलम व ईंट जोड़ पर दरार-रोधी जाली)",
      category: "plaster",
      quantity: Math.round(totalBuiltUpAreaSqFt * 0.22),
      unit: "Meters",
      rate: scale(32),
      totalCost: scale(Math.round(totalBuiltUpAreaSqFt * 0.22) * 32),
    },

    // --- Tiles & Granite Details ---
    {
      id: "mat_floor_tiles",
      nameEn: "Vitrified Living & Bedroom Floor Tiles (2x2 / 4x2 ft)",
      nameHi: "विट्रिफाइड फ्लोर टाइल्स (2x2 / 4x2 फीट)",
      category: "tiles",
      quantity: Math.round(totalBuiltUpAreaSqFt * 0.85),
      unit: "Sq.Ft",
      rate: scale(rates.tilesSqFtINR),
      totalCost: scale(Math.round(totalBuiltUpAreaSqFt * 0.85) * rates.tilesSqFtINR),
    },
    {
      id: "mat_wall_dado_tiles",
      nameEn: "Bathroom & Kitchen Glazed Wall Dado Tiles",
      nameHi: "बाथरूम व किचन वाल दादो टाइल्स",
      category: "tiles",
      quantity: Math.round(config.bathrooms * 140 + config.kitchens * 80),
      unit: "Sq.Ft",
      rate: scale(rates.tilesSqFtINR + 8),
      totalCost: scale(Math.round(config.bathrooms * 140 + config.kitchens * 80) * (rates.tilesSqFtINR + 8)),
    },
    {
      id: "mat_antiskid_tiles",
      nameEn: "Bathroom Anti-Skid Floor Tiles",
      nameHi: "बाथरूम एंटी-स्किड फ्लोर टाइल्स",
      category: "tiles",
      quantity: Math.round(config.bathrooms * 35),
      unit: "Sq.Ft",
      rate: scale(rates.tilesSqFtINR + 5),
      totalCost: scale(Math.round(config.bathrooms * 35) * (rates.tilesSqFtINR + 5)),
    },
    {
      id: "mat_kitchen_granite",
      nameEn: "Jet Black Granite Platform Slab",
      nameHi: "किचन प्लेटफॉर्म जेट ब्लैक ग्रेनाइट",
      category: "tiles",
      quantity: Math.round(config.kitchens * 45),
      unit: "Sq.Ft",
      rate: scale(160),
      totalCost: scale(Math.round(config.kitchens * 45) * 160),
    },
    {
      id: "mat_tile_adhesive",
      nameEn: "Polymer Modified Tile Adhesive Mortar",
      nameHi: "टाइल्स एडेसिव मसाला (Roff / Asian Paints SmartCare)",
      category: "tiles",
      quantity: Math.max(6, Math.round(totalBuiltUpAreaSqFt * 0.04)),
      unit: "Bags (20kg)",
      rate: scale(380),
      totalCost: scale(Math.max(6, Math.round(totalBuiltUpAreaSqFt * 0.04)) * 380),
    },
    {
      id: "mat_tile_grout",
      nameEn: "Waterproof Epoxy Tile Joint Grout",
      nameHi: "वाटरप्रूफ इपॉक्सी टाइल ग्राउट",
      category: "tiles",
      quantity: Math.max(3, Math.round(totalBuiltUpAreaSqFt * 0.025)),
      unit: "Kg",
      rate: scale(220),
      totalCost: scale(Math.max(3, Math.round(totalBuiltUpAreaSqFt * 0.025)) * 220),
    },

    // --- Plumbing Details ---
    {
      id: "mat_cpvc_pipe",
      nameEn: "SDR-11 CPVC Hot & Cold Water Supply Pipes",
      nameHi: "CPVC गर्म व ठंडा पानी सप्लाई पाइप्स (Astral/Finolex)",
      category: "plumbing",
      quantity: cpvcPipeFt,
      unit: "Feet",
      rate: scale(rates.cpvcPipeFtINR),
      totalCost: scale(cpvcPipeFt * rates.cpvcPipeFtINR),
    },
    {
      id: "mat_swr_pipe",
      nameEn: "Heavy Duty SWR PVC Sewer Drainage Pipes",
      nameHi: "SWR PVC सीवर व ड्रेनेज पाइप्स (4 इंच व 3 इंच)",
      category: "plumbing",
      quantity: swrPipeFt,
      unit: "Feet",
      rate: scale(rates.swrPipeFtINR),
      totalCost: scale(swrPipeFt * rates.swrPipeFtINR),
    },
    {
      id: "mat_sanitary_commode",
      nameEn: "Western Wall-Hung / Floor Mounted Commodes",
      nameHi: "वेस्टर्न कमोड व सॉफ्ट-क्लोज सीट कवर (Cera/Hindware)",
      category: "plumbing",
      quantity: commodeCount,
      unit: "Pcs",
      rate: scale(rates.commodeUnitINR),
      totalCost: scale(commodeCount * rates.commodeUnitINR),
    },
    {
      id: "mat_wash_basin",
      nameEn: "Ceramic Wash Basins with Pedestals",
      nameHi: "वाश बेसिन व पिलर कॉक (Wash Basins)",
      category: "plumbing",
      quantity: config.bathrooms + 1,
      unit: "Pcs",
      rate: scale(2400),
      totalCost: scale((config.bathrooms + 1) * 2400),
    },
    {
      id: "mat_faucets_taps",
      nameEn: "CP Brass Bathroom Taps, Mixers & Rain Showers",
      nameHi: "ब्रास सीपी नल, वाल मिक्सर व शॉवर फिटिंग्स",
      category: "plumbing",
      quantity: faucetTapCount,
      unit: "Pcs",
      rate: scale(rates.faucetTapUnitINR),
      totalCost: scale(faucetTapCount * rates.faucetTapUnitINR),
    },
    {
      id: "mat_water_tank",
      nameEn: "Overhead 4-Layer Antibacterial Water Storage Tank",
      nameHi: "छत की ओवरहेड 4-लेयर पानी की टंकी (Sintex/Supreme)",
      category: "plumbing",
      quantity: waterTankCapacityL,
      unit: "Liters",
      rate: scale(8.5),
      totalCost: scale(waterTankCapacityL * 8.5),
    },

    // --- Electrical Details ---
    {
      id: "mat_elec_wire",
      nameEn: "FR Copper Electrical Wires (1.5, 2.5 & 4.0 sq.mm)",
      nameHi: "एफआर कॉपर इलेक्ट्रिक वायर रोल्स (Havells/Polycab)",
      category: "electrical",
      quantity: electricalDetails.wireRollsRequired,
      unit: "Rolls (90m)",
      rate: scale(rates.wireRoll90mINR),
      totalCost: scale(electricalDetails.wireRollsRequired * rates.wireRoll90mINR),
    },
    {
      id: "mat_pvc_conduit",
      nameEn: "Heavy Rigid PVC Electrical Conduit Pipes",
      nameHi: "कंड्यूट पाइप (दीवार के अंदर वायरिंग सुरक्षा हेतु)",
      category: "electrical",
      quantity: electricalDetails.conduitFtRequired,
      unit: "Feet",
      rate: scale(rates.conduitPipeFtINR),
      totalCost: scale(electricalDetails.conduitFtRequired * rates.conduitPipeFtINR),
    },
    {
      id: "mat_elec_switches",
      nameEn: "Modular Switches, Socket Outlets & Regulators",
      nameHi: "मॉड्यूलर स्विच, सॉकेट व फैन रेगुलेटर (Anchor Roma/Legrand)",
      category: "electrical",
      quantity: electricalDetails.switchesTotal,
      unit: "Pcs",
      rate: scale(rates.modularSwitchUnitINR),
      totalCost: scale(electricalDetails.switchesTotal * rates.modularSwitchUnitINR),
    },
    {
      id: "mat_elec_boards",
      nameEn: "Modular Switchboard Cover Plates & Flush Boxes",
      nameHi: "मॉड्यूलर स्विचबोर्ड प्लेट्स व जीआई मेटल बॉक्स",
      category: "electrical",
      quantity: electricalDetails.switchBoardsTotal,
      unit: "Boards",
      rate: scale(rates.switchBoard6ModINR),
      totalCost: scale(electricalDetails.switchBoardsTotal * rates.switchBoard6ModINR),
    },
    {
      id: "mat_mcb_db",
      nameEn: "MCB Isolator Breakers, ELCB & Distribution Board",
      nameHi: "एमसीबी ब्रेकर, ट्रिप स्विच व मेन एमसीबी बॉक्स",
      category: "electrical",
      quantity: electricalDetails.mcbCount,
      unit: "Units",
      rate: scale(rates.mcbUnitINR),
      totalCost: scale(electricalDetails.mcbCount * rates.mcbUnitINR),
    },
    {
      id: "mat_earthing_kit",
      nameEn: "Copper Rod Safety Chemical Earthing Kit",
      nameHi: "कॉपर अर्थिंग रोड व केमिकल जेल पिट (Earthing Kit)",
      category: "electrical",
      quantity: 1,
      unit: "Set",
      rate: scale(4800),
      totalCost: scale(4800),
    },

    // --- Finishing Details ---
    {
      id: "mat_wall_putty",
      nameEn: "White Cement Wall Putty (Birla White / JK)",
      nameHi: "व्हाइट सीमेंट वॉल पुट्टी (बिरला / जेके पुट्टी)",
      category: "finishing",
      quantity: puttyKgTotal,
      unit: "Kg",
      rate: scale(rates.puttyKgINR),
      totalCost: scale(puttyKgTotal * rates.puttyKgINR),
    },
    {
      id: "mat_paint",
      nameEn: "Interior Royal Emulsion & Weather-Proof Exterior Paint",
      nameHi: "इंटीरियर रॉयल इमल्शन व वेदरप्रूफ एक्सटीरियर पेंट (Asian Paints)",
      category: "finishing",
      quantity: paintLitersTotal,
      unit: "Liters",
      rate: scale(rates.paintLiterINR),
      totalCost: scale(paintLitersTotal * rates.paintLiterINR),
    },

    // --- Doors & Windows Details ---
    {
      id: "mat_main_door",
      nameEn: "Main Entrance Teakwood / Decorative Door & Frame",
      nameHi: "मुख्य सागौन लकड़ी का दरवाजा व भारी चौखट",
      category: "doors_windows",
      quantity: 1,
      unit: "Pc",
      rate: mainDoorCost,
      totalCost: mainDoorCost,
    },
    {
      id: "mat_flush_doors",
      nameEn: "Bedroom Laminated Flush Doors",
      nameHi: "बेडरूम लैमिनेटेड फ्लश डोर (Flush Doors)",
      category: "doors_windows",
      quantity: config.bedrooms,
      unit: "Pcs",
      rate: scale(grade === 'luxury' ? 12000 : grade === 'premium' ? 8500 : 6200),
      totalCost: bedroomDoorsCost,
    },
    {
      id: "mat_wpc_doors",
      nameEn: "Waterproof WPC Bathroom Doors",
      nameHi: "वाटरप्रूफ WPC / PVC टॉयलेट दरवाजे",
      category: "doors_windows",
      quantity: config.bathrooms,
      unit: "Pcs",
      rate: scale(grade === 'luxury' ? 6500 : grade === 'premium' ? 5000 : 3800),
      totalCost: bathroomDoorsCost,
    },
    {
      id: "mat_upvc_windows",
      nameEn: "UPVC / Powder Coated Aluminum Sliding Glass Windows",
      nameHi: "UPVC कांच की स्लाइडिंग खिड़कियां व सेफ्टी ग्रिल",
      category: "doors_windows",
      quantity: Math.round(totalBuiltUpAreaSqFt * 0.12),
      unit: "Sq.Ft",
      rate: scale(grade === 'luxury' ? 480 : grade === 'premium' ? 360 : 260),
      totalCost: windowsCost,
    },

    // --- Waterproofing Details ---
    {
      id: "mat_waterproofing_liquid",
      nameEn: "Dr. Fixit SBR Latex Water-Proofing Compound",
      nameHi: "डॉ. फिक्सिट वाटरप्रूफिंग लिक्विड (Dr. Fixit Compound)",
      category: "waterproofing",
      quantity: Math.max(10, Math.round(totalBuiltUpAreaSqFt * 0.06)),
      unit: "Liters",
      rate: scale(340),
      totalCost: scale(Math.max(10, Math.round(totalBuiltUpAreaSqFt * 0.06)) * 340),
    },
    {
      id: "mat_terrace_waterproofing",
      nameEn: "Terrace Brick-Bat Coba / Polymer Membrane Waterproofing",
      nameHi: "छत ब्रिक-बैट कोबा व पॉलीमर मेम्ब्रेन वाटरप्रूफिंग",
      category: "waterproofing",
      quantity: Math.round(builtUpAreaPerFloorFt * 1.05),
      unit: "Sq.Ft",
      rate: scale(45),
      totalCost: scale(Math.round(builtUpAreaPerFloorFt * 1.05) * 45),
    }
  ];

  // -------------------------------------------------------------
  // LABOUR BREAKDOWN SUMMARY
  // -------------------------------------------------------------
  const labourBreakdown: LabourBreakdownItem[] = [
    {
      tradeEn: "Site Clearance & Earthwork Excavation Labour",
      tradeHi: "साइट सफाई और नींव खुदाई मजदूरी",
      rateType: "cuft",
      unitRate: scale(rates.excavationLabourCuFtINR),
      totalQuantity: excavationCuFt,
      totalCost: siteCleaningCost + excavationCost,
      estimatedManDays: Math.ceil(totalBuiltUpAreaSqFt * 0.04),
    },
    {
      tradeEn: "RCC Shuttering, Steel Binding & Concrete Labour",
      tradeHi: "आरसीसी शटरिंग, सरिया बांधना व ढलाई मजदूरी",
      rateType: "sqft",
      unitRate: scale(rates.rccLabourSqFtINR),
      totalQuantity: totalBuiltUpAreaSqFt,
      totalCost: phase2Labour + phase3Labour,
      estimatedManDays: Math.ceil(totalBuiltUpAreaSqFt * 0.22),
    },
    {
      tradeEn: "Masonry & Brickwork Labour",
      tradeHi: "ईंट की जुड़ाई (मिस्त्री व मजदूर)",
      rateType: "sqft",
      unitRate: scale(rates.brickworkLabourSqFtINR),
      totalQuantity: totalBuiltUpAreaSqFt,
      totalCost: phase4Labour,
      estimatedManDays: Math.ceil(totalBuiltUpAreaSqFt * 0.12),
    },
    {
      tradeEn: "Plastering & Waterproofing Labour",
      tradeHi: "प्लास्टर व वाटरप्रूफिंग मिस्त्री",
      rateType: "sqft",
      unitRate: scale(rates.plasterLabourSqFtINR),
      totalQuantity: totalBuiltUpAreaSqFt,
      totalCost: phase5Labour,
      estimatedManDays: Math.ceil(totalBuiltUpAreaSqFt * 0.10),
    },
    {
      tradeEn: "Tiling & Granite Fitting Labour",
      tradeHi: "टाइल्स व मार्बल लगाने वाले मिस्त्री",
      rateType: "sqft",
      unitRate: scale(rates.tilingLabourSqFtINR),
      totalQuantity: totalBuiltUpAreaSqFt,
      totalCost: phase6Labour,
      estimatedManDays: Math.ceil(totalBuiltUpAreaSqFt * 0.08),
    },
    {
      tradeEn: "Electrician Wiring & Switch Fitting Labour",
      tradeHi: "इलेक्ट्रीशियन (वायरिंग व स्विच फिटिंग)",
      rateType: "point",
      unitRate: scale(rates.electricalLabourPointINR),
      totalQuantity: electricalDetails.switchesTotal,
      totalCost: phase8Labour,
      estimatedManDays: Math.ceil(electricalDetails.switchesTotal * 0.18),
    },
    {
      tradeEn: "Plumber Pipe & Sanitary Fitting Labour",
      tradeHi: "प्लंबर (पाइपलाइन व सैनिटरी मिस्त्री)",
      rateType: "point",
      unitRate: scale(rates.plumbingLabourPointINR),
      totalQuantity: commodeCount + faucetTapCount,
      totalCost: phase9Labour,
      estimatedManDays: Math.ceil((commodeCount + faucetTapCount) * 0.35),
    },
    {
      tradeEn: "Painter & Putty Application Labour",
      tradeHi: "पेंटर व पुट्टी मिस्त्री",
      rateType: "sqft",
      unitRate: scale(rates.paintingLabourSqFtINR),
      totalQuantity: totalBuiltUpAreaSqFt,
      totalCost: phase10Labour,
      estimatedManDays: Math.ceil(totalBuiltUpAreaSqFt * 0.07),
    }
  ];

  // Duration estimation in months
  const estimatedDurationMonths = Math.round((6 + (numFloorsTotal - 1) * 2.5) * 10) / 10;

  return {
    totalBuiltUpAreaSqFt,
    totalCost,
    costPerSqFt,
    materialCostTotal,
    labourCostTotal,
    contractorAndArchitectCost,
    contingencyCost,
    phases,
    materials,
    labourBreakdown,
    electricalDetails,
    estimatedDurationMonths,
  };
}
