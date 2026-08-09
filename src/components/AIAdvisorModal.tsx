import React, { useState } from "react";
import { ProjectConfig, CalculationResult, LanguageMode } from "../types";
import {
  Sparkles,
  X,
  Send,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Bot
} from "lucide-react";

interface AIAdvisorModalProps {
  config: ProjectConfig;
  result: CalculationResult;
  onClose: () => void;
  language: LanguageMode;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  config,
  result,
  onClose,
  language
}) => {
  const [question, setQuestion] = useState("");
  const [promptType, setPromptType] = useState<"cost_saving" | "material_guidance" | "custom">("cost_saving");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAdvice = async (type: "cost_saving" | "material_guidance" | "custom", customQ?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptType: type,
          userQuestion: customQ || question,
          projectDetails: {
            totalArea: result.totalBuiltUpAreaSqFt,
            floors: config.floors + 1,
            qualityGrade: config.grade,
            totalCost: result.totalCost,
          }
        })
      });

      const data = await response.json();
      if (data.advice) {
        setAdvice(data.advice);
      } else if (data.error) {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to AI Advisor backend service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-900 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_#0F172A] text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <Sparkles className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900 flex items-center gap-2">
                {language === "hi" ? "AI कंस्ट्रक्शन एडवाइजर" : "AI Construction Consultant"}
                <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold border border-slate-900">
                  Gemini 2.5
                </span>
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi"
                  ? "लागत घटाने के उपाय, सही सामग्री चयन व एक्सपर्ट सिविल सलाह"
                  : "Smart cost reduction tips, material guidance & civil engineer suggestions"}
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                setPromptType("cost_saving");
                fetchAdvice("cost_saving");
              }}
              className="p-3 bg-slate-50 hover:bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] text-left text-slate-900 transition font-black uppercase flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-slate-900 flex-shrink-0" />
              <span>
                {language === "hi"
                  ? "लागत 10-15% घटाने के तरीके बताएं"
                  : "How to save 10-15% on construction?"}
              </span>
            </button>

            <button
              onClick={() => {
                setPromptType("material_guidance");
                fetchAdvice("material_guidance");
              }}
              className="p-3 bg-slate-50 hover:bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] text-left text-slate-900 transition font-black uppercase flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-900 flex-shrink-0" />
              <span>
                {language === "hi"
                  ? "ईंट बनाम AAC ब्लॉक और सीमेंट गाइड"
                  : "AAC Blocks vs Red Bricks & Cement guide"}
              </span>
            </button>
          </div>

          {/* AI Response Box */}
          {loading && (
            <div className="p-8 text-center space-y-3 bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
              <Loader2 className="w-8 h-8 text-slate-900 animate-spin mx-auto" />
              <p className="text-slate-900 font-bold uppercase">
                {language === "hi"
                  ? "AI सिविल इंजीनियर प्रोजेक्ट डेटा का विश्लेषण कर रहा है..."
                  : "AI Consultant is analyzing project structural parameters..."}
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-amber-100 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center gap-2 font-bold">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-slate-900" />
              <span>{errorMsg}</span>
            </div>
          )}

          {advice && !loading && (
            <div className="bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase border-b-2 border-slate-900 pb-2">
                <Bot className="w-4 h-4 text-slate-900" />
                <span>
                  {language === "hi" ? "सिविल एडवाइजर की सलाह:" : "AI Consultant Recommendation:"}
                </span>
              </div>
              <div className="text-slate-900 leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm font-semibold">
                {advice}
              </div>
            </div>
          )}

          {/* Custom Question Input */}
          <div className="pt-2 border-t-2 border-slate-900">
            <span className="text-slate-900 font-bold uppercase block mb-1">
              {language === "hi" ? "अपना सवाल पूछें:" : "Ask a custom question:"}
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={
                  language === "hi"
                    ? "जैसे: क्या PPC सीमेंट ढलाई के लिए बेहतर है?"
                    : "e.g. Is PPC cement good for roof slab?"
                }
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && question.trim()) {
                    fetchAdvice("custom", question);
                  }
                }}
                className="w-full bg-slate-50 border-2 border-slate-900 p-2 text-xs font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] focus:outline-none"
              />
              <button
                onClick={() => fetchAdvice("custom", question)}
                disabled={!question.trim() || loading}
                className="p-2.5 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 text-slate-900 font-bold shadow-[2px_2px_0px_0px_#0F172A] disabled:opacity-50 transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Send className="w-4 h-4 text-slate-900" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
