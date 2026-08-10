import React, { useState, useMemo, useEffect } from "react";
import {
  ProjectConfig,
  CurrencyCode,
  LanguageMode,
  SavedProject,
  QualityGrade,
  MaterialAndLabourRates
} from "./types";
import { DEFAULT_RATES_BY_GRADE } from "./data/defaultRates";
import { calculateConstructionCost } from "./utils/calculator";

import { Navbar } from "./components/Navbar";
import { ProjectInputForm } from "./components/ProjectInputForm";
import { SummaryCards } from "./components/SummaryCards";
import { PhaseBreakdown } from "./components/PhaseBreakdown";
import { ElectricalSwitchCalculator } from "./components/ElectricalSwitchCalculator";
import { PlumbingSanitaryCalculator } from "./components/PlumbingSanitaryCalculator";
import { DoorsWindowsCalculator } from "./components/DoorsWindowsCalculator";
import { TilesFlooringCalculator } from "./components/TilesFlooringCalculator";
import { PlasterTermiteWaterproofingCalculator } from "./components/PlasterTermiteWaterproofingCalculator";
import { FinishingPaintCalculator } from "./components/FinishingPaintCalculator";
import { MaterialQuantityTable } from "./components/MaterialQuantityTable";
import { LabourCostBreakdown } from "./components/LabourCostBreakdown";
import { ChartsView } from "./components/ChartsView";
import { TimelinePlanning } from "./components/TimelinePlanning";

import { RateCustomizerModal } from "./components/RateCustomizerModal";
import { AIAdvisorModal } from "./components/AIAdvisorModal";
import { ProjectCompareModal } from "./components/ProjectCompareModal";
import { PrintReportView } from "./components/PrintReportView";
import { AdSlot } from "./components/AdSlot";

import {
  Layers,
  Zap,
  Droplets,
  DoorOpen,
  Grid,
  Bug,
  Paintbrush,
  Boxes,
  Users,
  PieChart,
  Calendar,
  Bookmark,
  Trash2,
  X,
  CheckCircle2,
  HardHat,
  Info
} from "lucide-react";

export default function App() {
  // App State
  const [language, setLanguage] = useState<LanguageMode>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [activeTab, setActiveTab] = useState<
    "phases" | "electrical" | "plumbing" | "doors" | "tiles" | "plaster" | "paint" | "materials" | "labour" | "charts" | "timeline"
  >("phases");

  // Project Config State
  const [config, setConfig] = useState<ProjectConfig>({
    plotLengthFt: 30,
    plotWidthFt: 40,
    builtUpAreaPerFloorFt: 1200,
    floors: 1, // Ground + 1 (2 floors total = 2,400 sq.ft)
    grade: "standard",
    cityType: "tier1",
    currency: "INR",
    
    bedrooms: 3,
    bathrooms: 3,
    kitchens: 1,
    livingRooms: 1,
    balconies: 2,
    parkingSpaces: 1,

    customRates: {},
  });

  // Saved Projects State
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const stored = localStorage.getItem("construction_saved_estimates");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);

  // Modals
  const [showCustomRatesModal, setShowCustomRatesModal] = useState(false);
  const [showAIAdvisorModal, setShowAIAdvisorModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto calculation
  const result = useMemo(() => {
    return calculateConstructionCost(config);
  }, [config]);

  // Save project estimate to LocalStorage
  const handleSaveProject = () => {
    const newProject: SavedProject = {
      id: "proj_" + Date.now(),
      name: `${config.builtUpAreaPerFloorFt * (config.floors + 1)} sq.ft (${config.grade.toUpperCase()}) - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toLocaleString(),
      config: { ...config },
      totalCost: result.totalCost,
    };

    const updatedList = [newProject, ...savedProjects];
    setSavedProjects(updatedList);
    try {
      localStorage.setItem("construction_saved_estimates", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    setToastMessage(language === "hi" ? "प्रोजेक्ट लागत अनुमान सुरक्षित हो गया!" : "Estimate saved successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteSavedProject = (id: string) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(updated);
    try {
      localStorage.setItem("construction_saved_estimates", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSavedProject = (p: SavedProject) => {
    setConfig({ ...p.config });
    setShowSavedDrawer(false);
    setToastMessage(language === "hi" ? "सुरक्षित प्रोजेक्ट लोड हो गया!" : "Loaded saved estimate!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentEffectiveRates: MaterialAndLabourRates = {
    ...DEFAULT_RATES_BY_GRADE[config.grade],
    ...config.customRates,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-900 flex flex-col">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 border-2 border-slate-900 text-slate-900 font-black px-4 py-3 shadow-[4px_4px_0px_0px_#0F172A] flex items-center gap-2 animate-bounce uppercase text-xs">
          <CheckCircle2 className="w-5 h-5 text-slate-900" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        currency={currency}
        onCurrencyChange={(c) => {
          setCurrency(c);
          setConfig((prev) => ({ ...prev, currency: c }));
        }}
        language={language}
        onLanguageToggle={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
        onOpenCustomRates={() => setShowCustomRatesModal(true)}
        onOpenAIAdvisor={() => setShowAIAdvisorModal(true)}
        onOpenCompareModal={() => setShowCompareModal(true)}
        onSaveProject={handleSaveProject}
        onPrintReport={() => setShowPrintView(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 overflow-x-hidden">
        
        {/* Ad Placement 1: Top Header Banner */}
        <AdSlot location="top-header" labelEn="Top Header Leaderboard Banner Ad" />

        {/* Saved Estimates Banner Bar */}
        {savedProjects.length > 0 && (
          <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-900">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>
                {language === "hi"
                  ? `आपके पास ${savedProjects.length} सुरक्षित अनुमान हैं`
                  : `You have ${savedProjects.length} saved project estimates`}
              </span>
            </div>
            <button
              onClick={() => setShowSavedDrawer(true)}
              className="text-amber-700 hover:underline font-black uppercase"
            >
              {language === "hi" ? "देखें और लोड करें" : "View Saved Estimates"}
            </button>
          </div>
        )}

        {/* 1. Dimensions & Input Controls Form */}
        <ProjectInputForm
          config={config}
          onChange={(updated) => setConfig(updated)}
          language={language}
          onOpenCustomRates={() => setShowCustomRatesModal(true)}
        />

        {/* 2. Key Numbers Summary Cards */}
        <SummaryCards
          result={result}
          currency={currency}
          language={language}
        />

        {/* Ad Placement 2: Mid-Content Banner */}
        <AdSlot location="mid-content" labelEn="Mid-Page Content Banner Ad" />

        {/* 3. Section Navigation Tabs */}
        <div className="bg-white p-3 sm:p-4 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] space-y-3 text-slate-900">
          
          {/* Mobile Quick Dropdown Select */}
          <div className="sm:hidden space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
              {language === "hi" ? "कैलकुलेटर मॉड्यूल चुनें:" : "Select Calculator Module:"}
            </label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full p-2.5 bg-amber-400 font-black text-slate-900 text-xs uppercase border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
            >
              <optgroup label={language === "hi" ? "मुख्य अनुमान व रिपोत" : "Core Estimate Views"}>
                <option value="phases">{language === "hi" ? "1. चरण-वार (Phase Breakdown)" : "1. Phase Breakdown"}</option>
                <option value="materials">{language === "hi" ? "2. कुल सामान (Material Quantities)" : "2. Material Quantities"}</option>
                <option value="labour">{language === "hi" ? "3. मजदूरी (Labour Breakdown)" : "3. Labour Costs"}</option>
                <option value="charts">{language === "hi" ? "4. चार्ट्स (Visual Cost Charts)" : "4. Visual Cost Charts"}</option>
                <option value="timeline">{language === "hi" ? "5. समय-सारणी (Timeline Roadmap)" : "5. Timeline Roadmap"}</option>
              </optgroup>
              <optgroup label={language === "hi" ? "6 विशेष वर्क कैलकुलेटर" : "Specialized Work Calculators"}>
                <option value="electrical">{language === "hi" ? "6. स्विच व वायरिंग (Electrical)" : "6. Switches & Wiring"}</option>
                <option value="plumbing">{language === "hi" ? "7. प्लंबिंग व टैंक (Plumbing)" : "7. Plumbing & Sanitary"}</option>
                <option value="doors">{language === "hi" ? "8. दरवाजे व खिड़कियां (Doors & Windows)" : "8. Doors & Windows"}</option>
                <option value="tiles">{language === "hi" ? "9. टाइल्स व ग्रेनाइट (Tiles & Granite)" : "9. Tiles & Granite"}</option>
                <option value="plaster">{language === "hi" ? "10. प्लास्टर व दीमक (Plaster & Defense)" : "10. Plaster & Defense"}</option>
                <option value="paint">{language === "hi" ? "11. पेंटिंग व पुट्टी (Paint & Finishing)" : "11. Paint & Finishing"}</option>
              </optgroup>
            </select>
          </div>

          {/* Clean Wrapped Buttons for Mobile Grid & Desktop Flex */}
          <div className="space-y-2">
            
            {/* Category 1: Main Core Views */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 border border-slate-900 hidden lg:inline-block">
                {language === "hi" ? "मुख्य रिपोर्ट:" : "CORE ESTIMATES:"}
              </span>

              <button
                onClick={() => setActiveTab("phases")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "phases"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "1. चरण-वार" : "1. Phase Breakdown"}</span>
              </button>

              <button
                onClick={() => setActiveTab("materials")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "materials"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "2. कुल सामान" : "2. All Materials"}</span>
              </button>

              <button
                onClick={() => setActiveTab("labour")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "labour"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "3. मजदूरी" : "3. Labour Costs"}</span>
              </button>

              <button
                onClick={() => setActiveTab("charts")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "charts"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "4. चार्ट्स" : "4. Cost Charts"}</span>
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "timeline"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "5. समय-सारणी" : "5. Timeline Schedule"}</span>
              </button>
            </div>

            {/* Category 2: Specialized Calculators */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-amber-100 px-2 py-1 border border-slate-900 hidden lg:inline-block">
                {language === "hi" ? "विशेष कार्य:" : "SPECIALIZED WORKS:"}
              </span>

              <button
                onClick={() => setActiveTab("electrical")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "electrical"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "6. वायरिंग" : "6. Switches & Wiring"}</span>
              </button>

              <button
                onClick={() => setActiveTab("plumbing")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "plumbing"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "7. प्लंबिंग" : "7. Plumbing & Sanitary"}</span>
              </button>

              <button
                onClick={() => setActiveTab("doors")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "doors"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "8. दरवाजे" : "8. Doors & Windows"}</span>
              </button>

              <button
                onClick={() => setActiveTab("tiles")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "tiles"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "9. टाइल्स" : "9. Tiles & Granite"}</span>
              </button>

              <button
                onClick={() => setActiveTab("plaster")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "plaster"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "10. दीमक/प्लास्टर" : "10. Plaster & Defense"}</span>
              </button>

              <button
                onClick={() => setActiveTab("paint")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase transition border-2 border-slate-900 ${
                  activeTab === "paint"
                    ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#0F172A]"
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "11. पेंटिंग" : "11. Paint & Finishing"}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Tab Content Display */}
        {activeTab === "phases" && (
          <PhaseBreakdown
            phases={result.phases}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "electrical" && (
          <ElectricalSwitchCalculator
            config={config}
            onChangeConfig={(up) => setConfig(up)}
            electricalDetails={result.electricalDetails}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "plumbing" && (
          <PlumbingSanitaryCalculator
            config={config}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "doors" && (
          <DoorsWindowsCalculator
            config={config}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "tiles" && (
          <TilesFlooringCalculator
            config={config}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "plaster" && (
          <PlasterTermiteWaterproofingCalculator
            config={config}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "paint" && (
          <FinishingPaintCalculator
            config={config}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "materials" && (
          <MaterialQuantityTable
            materials={result.materials}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "labour" && (
          <LabourCostBreakdown
            labourList={result.labourBreakdown}
            currency={currency}
            language={language}
            totalBuiltUpAreaSqFt={result.totalBuiltUpAreaSqFt}
          />
        )}

        {activeTab === "charts" && (
          <ChartsView
            result={result}
            currency={currency}
            language={language}
          />
        )}

        {activeTab === "timeline" && (
          <TimelinePlanning
            phases={result.phases}
            totalMonths={result.estimatedDurationMonths}
            language={language}
          />
        )}

        {/* Ad Placement 3: Bottom of Active Calculator Module */}
        <AdSlot location="calculator-bottom" labelEn="Calculator Results Banner Ad" />

      </main>

      {/* Ad Placement 4: Above Footer Sticky/Anchor Ad */}
      <AdSlot location="bottom-sticky" labelEn="Bottom Anchor Mobile Ad" />

      {/* Footer */}
      <footer className="border-t-2 border-slate-900 bg-white py-6 px-4 text-center text-xs text-slate-700 space-y-2 font-bold">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>
            {language === "hi"
              ? "सिविल जंगल्स हाउस कंस्ट्रक्शन कॉस्ट कैलकुलेटर — प्लॉट सफाई से लेकर स्विच बोर्ड तक की संपूर्ण सटीक गणना"
              : "Civil Jungles House Construction Cost Estimator — Plot Clearance to Switchboards Detailed Civil Estimation"}
          </span>
        </p>
        <p className="text-xs font-mono font-bold text-slate-900">
          Official Tool Published for{" "}
          <a
            href="https://civiljungles.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-black"
          >
            CivilJungles.com
          </a>
          {" "}• Powered by IS 456 & CPWD Standards
        </p>
      </footer>

      {/* MODALS */}

      {/* Custom Rates Modal */}
      {showCustomRatesModal && (
        <RateCustomizerModal
          currentRates={currentEffectiveRates}
          onSave={(updated) => setConfig((prev) => ({ ...prev, customRates: updated }))}
          onReset={() => setConfig((prev) => ({ ...prev, customRates: {} }))}
          onClose={() => setShowCustomRatesModal(false)}
          language={language}
        />
      )}

      {/* AI Advisor Modal */}
      {showAIAdvisorModal && (
        <AIAdvisorModal
          config={config}
          result={result}
          onClose={() => setShowAIAdvisorModal(false)}
          language={language}
        />
      )}

      {/* Compare Grades Modal */}
      {showCompareModal && (
        <ProjectCompareModal
          config={config}
          onSelectGrade={(g) => setConfig((prev) => ({ ...prev, grade: g }))}
          onClose={() => setShowCompareModal(false)}
          language={language}
        />
      )}

      {/* Printable Report Modal */}
      {showPrintView && (
        <PrintReportView
          config={config}
          result={result}
          currency={currency}
          language={language}
          onClose={() => setShowPrintView(false)}
        />
      )}

      {/* Saved Projects Drawer */}
      {showSavedDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white border-l-2 border-slate-900 h-full p-6 flex flex-col shadow-[-8px_0px_0px_0px_#0F172A] space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <h3 className="font-black italic uppercase text-slate-900 text-base">
                {language === "hi" ? "सुरक्षित प्रोजेक्ट अनुमान" : "Saved Project Estimates"}
              </h3>
              <button
                onClick={() => setShowSavedDrawer(false)}
                className="p-1.5 bg-slate-100 hover:bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {savedProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-50 p-4 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] space-y-2"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                    <span>{p.name}</span>
                    <button
                      onClick={() => handleDeleteSavedProject(p.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-amber-700 font-mono font-black text-sm">
                    ₹{Math.round(p.totalCost).toLocaleString("en-IN")}
                  </p>
                  <button
                    onClick={() => handleLoadSavedProject(p)}
                    className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    {language === "hi" ? "यह अनुमान लोड करें" : "Load Estimate"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
