import React from "react";
import { ProjectConfig, QualityGrade, LanguageMode } from "../types";
import { calculateConstructionCost } from "../utils/calculator";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import { Scale, X, CheckCircle2, ArrowRight } from "lucide-react";

interface ProjectCompareModalProps {
  config: ProjectConfig;
  onSelectGrade: (grade: QualityGrade) => void;
  onClose: () => void;
  language: LanguageMode;
}

export const ProjectCompareModal: React.FC<ProjectCompareModalProps> = ({
  config,
  onSelectGrade,
  onClose,
  language
}) => {
  const grades: QualityGrade[] = ["economy", "standard", "premium", "luxury"];
  const symbol = CURRENCY_CONVERSION[config.currency]?.symbol || "₹";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-900 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_#0F172A] text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
                {language === "hi"
                  ? "निर्माण ग्रेड तुलना (Economy vs Standard vs Premium vs Luxury)"
                  : "Compare Quality Grades Side-by-Side"}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi"
                  ? "विभिन्न बजट ग्रेड की तुलना करें और सही चयन करें"
                  : "Analyze budget vs premium specs for your " +
                    config.builtUpAreaPerFloorFt * (config.floors + 1) +
                    " sq.ft house"}
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

        {/* Body Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {grades.map((g) => {
              const res = calculateConstructionCost({ ...config, grade: g });
              const isCurrent = config.grade === g;

              return (
                <div
                  key={g}
                  className={`p-4 border-2 border-slate-900 flex flex-col justify-between transition ${
                    isCurrent
                      ? "bg-amber-100 shadow-[4px_4px_0px_0px_#0F172A]"
                      : "bg-slate-50 shadow-[2px_2px_0px_0px_#0F172A]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                        {g}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-slate-900 text-amber-400 font-mono text-[10px] font-bold border border-slate-900 uppercase">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 my-1">
                      {symbol}{Math.round(res.totalCost).toLocaleString("en-IN")}
                    </div>
                    <p className="text-slate-600 font-mono text-[11px] font-bold mb-3 uppercase">
                      {symbol}{Math.round(res.costPerSqFt).toLocaleString("en-IN")} / sq.ft
                    </p>

                    <div className="space-y-2 border-t-2 border-slate-900 pt-3 text-[11px] text-slate-900">
                      <div>
                        <span className="text-slate-600 block font-bold uppercase">Material:</span>
                        <span className="font-mono font-bold text-slate-900">{symbol}{Math.round(res.materialCostTotal).toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block font-bold uppercase">Labour:</span>
                        <span className="font-mono font-bold text-slate-900">{symbol}{Math.round(res.labourCostTotal).toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block font-bold uppercase">Duration:</span>
                        <span className="font-mono font-bold text-slate-900">{res.estimatedDurationMonths} Months</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectGrade(g);
                      onClose();
                    }}
                    className={`mt-4 w-full py-2 text-xs font-black uppercase border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? "bg-slate-900 text-white"
                        : "bg-amber-400 hover:bg-amber-300 text-slate-900"
                    }`}
                  >
                    <span>{isCurrent ? (language === "hi" ? "चयनित" : "Selected") : (language === "hi" ? "यह ग्रेड चुनें" : "Select Grade")}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5 text-slate-900" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
