import React, { useState } from "react";
import { PhaseCostDetail, LanguageMode } from "../types";
import {
  Calendar,
  CheckSquare,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface TimelinePlanningProps {
  phases: PhaseCostDetail[];
  totalMonths: number;
  language: LanguageMode;
}

export const TimelinePlanning: React.FC<TimelinePlanningProps> = ({
  phases,
  totalMonths,
  language
}) => {
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);

  const togglePhaseComplete = (id: string) => {
    setCompletedPhases((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((completedPhases.length / phases.length) * 100);

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi"
                ? "निर्माण समय-सारणी व चेकलिस्ट (Timeline Roadmap)"
                : "Construction Schedule & Stage Milestone Tracker"}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "अनुमानित कुल समय: " + totalMonths + " महीने | प्रत्येक चरण की गुणवत्ता जांच सूची"
                : `Total Estimated Schedule: ${totalMonths} Months | Site Quality Inspection Checklist`}
            </p>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-slate-50 p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] min-w-[220px]">
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-slate-900">
              {language === "hi" ? "साइट प्रगति (Progress):" : "Project Progress:"}
            </span>
            <span className="text-amber-600 font-mono font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 border border-slate-900 h-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-600 block mt-1 text-right uppercase">
            {completedPhases.length} / {phases.length} {language === "hi" ? "चरण पूर्ण" : "stages completed"}
          </span>
        </div>
      </div>

      {/* Stepper Timeline Grid */}
      <div className="space-y-4">
        {phases.map((p, idx) => {
          const isDone = completedPhases.includes(p.id);

          return (
            <div
              key={p.id}
              className={`p-4 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition-all ${
                isDone ? "bg-amber-100/80" : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => togglePhaseComplete(p.id)}
                    className={`mt-0.5 p-1 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] transition ${
                      isDone
                        ? "bg-slate-900 text-amber-400"
                        : "bg-white text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-600 uppercase">
                        Week {idx * 2 + 1} - {(idx + 1) * 2}
                      </span>
                      <h3
                        className={`text-sm font-black uppercase ${
                          isDone ? "line-through text-slate-500" : "text-slate-900"
                        }`}
                      >
                        #{p.phaseNumber} {language === "hi" ? p.titleHi : p.titleEn}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {language === "hi" ? p.descriptionHi : p.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs self-end sm:self-center">
                  <span className="px-2.5 py-1 bg-slate-100 border-2 border-slate-900 text-slate-900 font-mono font-bold text-[11px] uppercase">
                    {p.durationWeeks} {language === "hi" ? "सप्ताह" : "Weeks"}
                  </span>
                  <button
                    onClick={() => togglePhaseComplete(p.id)}
                    className={`text-xs font-black px-3 py-1 uppercase border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition ${
                      isDone
                        ? "bg-slate-900 text-white"
                        : "bg-amber-400 hover:bg-amber-300 text-slate-900"
                    }`}
                  >
                    {isDone
                      ? language === "hi"
                        ? "पूर्ण हुआ"
                        : "Completed"
                      : language === "hi"
                      ? "मार्क करें"
                      : "Mark Done"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
