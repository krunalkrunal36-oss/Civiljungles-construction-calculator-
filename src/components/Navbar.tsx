import React, { useState } from "react";
import {
  HardHat,
  Sparkles,
  Printer,
  SlidersHorizontal,
  BookmarkPlus,
  Scale,
  Languages,
  Globe,
  Menu,
  X
} from "lucide-react";
import { CurrencyCode, LanguageMode } from "../types";

interface NavbarProps {
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  language: LanguageMode;
  onLanguageToggle: () => void;
  onOpenCustomRates: () => void;
  onOpenAIAdvisor: () => void;
  onOpenCompareModal: () => void;
  onSaveProject: () => void;
  onPrintReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  language,
  onLanguageToggle,
  onOpenCustomRates,
  onOpenAIAdvisor,
  onOpenCompareModal,
  onSaveProject,
  onPrintReport
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-900 text-slate-900 shadow-[0_4px_0_0_#0F172A] w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name with CivilJungles.com branding */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center text-slate-900 font-black shrink-0">
            <HardHat className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <a
                href="https://civiljungles.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-xl font-black italic uppercase tracking-tight text-slate-900 hover:text-amber-600 transition flex items-center gap-1"
              >
                <span>Civil Jungles</span>
              </a>
              <span className="px-1.5 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] uppercase">
                Estimator
              </span>
            </div>
            <a
              href="https://civiljungles.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-amber-600" />
              <span>civiljungles.com</span>
            </a>
          </div>
        </div>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center space-x-2">
          
          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Toggle Language"
          >
            <Languages className="w-4 h-4 text-amber-600" />
            <span className="uppercase">{language === "en" ? "ENG" : "हिंदी"}</span>
          </button>

          {/* Currency Dropdown */}
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-mono font-bold px-2 py-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none cursor-pointer uppercase"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>

          {/* Custom Rates Button */}
          <button
            onClick={onOpenCustomRates}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span className="uppercase">{language === "hi" ? "दरें बदलें" : "Custom Rates"}</span>
          </button>

          {/* Compare Grades */}
          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase">{language === "hi" ? "तुलना करें" : "Compare"}</span>
          </button>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition uppercase active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
            <span>{language === "hi" ? "AI सलाह" : "AI Advisor"}</span>
          </button>

          {/* Save Project */}
          <button
            onClick={onSaveProject}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Save Estimate"
          >
            <BookmarkPlus className="w-4 h-4 text-slate-900" />
          </button>

          {/* Print/Export */}
          <button
            onClick={onPrintReport}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Print / Export PDF Estimate"
          >
            <Printer className="w-4 h-4 text-slate-900" />
          </button>

        </div>

        {/* Mobile Compact Controls */}
        <div className="flex md:hidden items-center space-x-1.5">
          <button
            onClick={onLanguageToggle}
            className="px-2 py-1 bg-white text-slate-900 text-[11px] font-bold border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] uppercase"
          >
            {language === "en" ? "ENG" : "हिंदी"}
          </button>

          <button
            onClick={onOpenAIAdvisor}
            className="px-2 py-1 bg-amber-400 text-slate-900 text-[11px] font-black border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] uppercase flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-slate-900 fill-slate-900" />
            <span>AI</span>
          </button>

          <button
            onClick={onPrintReport}
            className="p-1 bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]"
            title="Print"
          >
            <Printer className="w-4 h-4 text-slate-900" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 bg-slate-900 text-white border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu when Toggled */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-slate-900 bg-slate-50 p-3 space-y-2 text-xs font-bold text-slate-900">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenCustomRates();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center gap-1.5 uppercase"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === "hi" ? "दरें बदलें" : "Custom Rates"}</span>
            </button>

            <button
              onClick={() => {
                onOpenCompareModal();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center gap-1.5 uppercase"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === "hi" ? "तुलना करें" : "Compare"}</span>
            </button>

            <button
              onClick={() => {
                onSaveProject();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center gap-1.5 uppercase"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === "hi" ? "अनुमान सेव करें" : "Save Estimate"}</span>
            </button>

            <div className="p-1.5 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-between">
              <span className="uppercase text-[10px] text-slate-500 font-bold">Currency:</span>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-amber-100 font-mono font-black text-slate-900 text-xs px-1 py-0.5 border border-slate-900 focus:outline-none"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <a
            href="https://civiljungles.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-1.5 bg-amber-400 border-2 border-slate-900 font-black uppercase text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
          >
            Visit Official Website: civiljungles.com
          </a>
        </div>
      )}
    </header>
  );
};

