export type CurrencyCode = "INR" | "USD" | "EUR";
export type LanguageMode = "en" | "hi";
export type QualityGrade = "economy" | "standard" | "premium" | "luxury";

export interface ProjectConfig {
  plotLengthFt: number;
  plotWidthFt: number;
  builtUpAreaPerFloorFt: number;
  floors: number; // 0 = Ground only (1 floor total), 1 = G+1 (2 floors), 2 = G+2 (3 floors)
  grade: QualityGrade;
  cityType: "metro" | "tier1" | "tier2" | "rural";
  currency: CurrencyCode;
  
  // Room Counts for Detailed Electrical & Plumbing
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  livingRooms: number;
  balconies: number;
  parkingSpaces: number;

  // Custom Rate Overrides
  customRates: Partial<MaterialAndLabourRates>;
}

export interface MaterialAndLabourRates {
  // Materials
  cementBagINR: number; // ₹ per bag (50kg)
  steelKgINR: number; // ₹ per kg
  sandCuFtINR: number; // ₹ per cu.ft
  aggregateCuFtINR: number; // ₹ per cu.ft
  redBrickPcsINR: number; // ₹ per brick
  aacBlockPcsINR: number; // ₹ per AAC block
  tilesSqFtINR: number; // ₹ per sq.ft
  paintLiterINR: number; // ₹ per liter
  puttyKgINR: number; // ₹ per kg
  
  // Electrical Materials
  wireRoll90mINR: number; // ₹ per 90m wire roll (1.5 / 2.5 sqmm avg)
  conduitPipeFtINR: number; // ₹ per ft conduit
  modularSwitchUnitINR: number; // ₹ per modular switch/socket unit
  switchBoard6ModINR: number; // ₹ per 6-module plate & box
  mcbUnitINR: number; // ₹ per MCB unit
  
  // Plumbing Materials
  cpvcPipeFtINR: number; // ₹ per ft CPVC pipe
  swrPipeFtINR: number; // ₹ per ft PVC drainage pipe
  commodeUnitINR: number; // ₹ per sanitary commode
  faucetTapUnitINR: number; // ₹ per tap/mixer
  waterTank1000LINR: number; // ₹ per 1000L tank

  // Labour Rates (Contract / Daily)
  siteCleaningLabourSqFtINR: number;
  excavationLabourCuFtINR: number;
  rccLabourSqFtINR: number;
  brickworkLabourSqFtINR: number;
  plasterLabourSqFtINR: number;
  tilingLabourSqFtINR: number;
  electricalLabourPointINR: number; // ₹ per electrical point
  plumbingLabourPointINR: number; // ₹ per plumbing fixture point
  paintingLabourSqFtINR: number;
  dailyMasonINR: number;
  dailyHelperINR: number;
  contractorMarginPercent: number;
}

export interface ElectricalPointDetails {
  lightPoints: number;
  fanPoints: number;
  socket6APoints: number;
  socket16APoints: number; // AC, Geyser, Refrigerator
  switchesTotal: number;
  switchBoardsTotal: number;
  mcbCount: number;
  wireRollsRequired: number;
  conduitFtRequired: number;
}

export interface MaterialItemQuantity {
  id: string;
  nameEn: string;
  nameHi: string;
  category: "civil" | "finishing" | "electrical" | "plumbing" | "doors_windows" | "anti_termite" | "plaster" | "tiles" | "waterproofing";
  quantity: number;
  unit: string;
  rate: number;
  totalCost: number;
}

export interface PhaseCostDetail {
  id: string;
  phaseNumber: number;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  percentageOfTotal: number;
  keyMaterials: string[];
  inspectionTipsEn: string[];
  inspectionTipsHi: string[];
  durationWeeks: number;
}

export interface LabourBreakdownItem {
  tradeEn: string;
  tradeHi: string;
  rateType: "sqft" | "point" | "cuft" | "fixed";
  unitRate: number;
  totalQuantity: number;
  totalCost: number;
  estimatedManDays: number;
}

export interface LaborRole {
  id: string;
  nameEn: string;
  nameHi: string;
  category: "skilled" | "semi_skilled" | "unskilled" | "specialist";
  dailyWageINR: number;
}

export interface TaskLaborAllocation {
  taskId: string;
  taskTitleEn: string;
  taskTitleHi: string;
  roleDays: { [roleId: string]: number };
}

export interface CalculationResult {
  totalBuiltUpAreaSqFt: number;
  totalCost: number;
  costPerSqFt: number;
  
  materialCostTotal: number;
  labourCostTotal: number;
  contractorAndArchitectCost: number;
  contingencyCost: number;

  phases: PhaseCostDetail[];
  materials: MaterialItemQuantity[];
  labourBreakdown: LabourBreakdownItem[];
  electricalDetails: ElectricalPointDetails;

  estimatedDurationMonths: number;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  config: ProjectConfig;
  totalCost: number;
}
