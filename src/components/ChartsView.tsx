import React from "react";
import { CalculationResult, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import { BarChart3 } from "lucide-react";
import {
  PieChart as PieChartIcon,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface ChartsViewProps {
  result: CalculationResult;
  currency: CurrencyCode;
  language: LanguageMode;
}

export const ChartsView: React.FC<ChartsViewProps> = ({
  result,
  currency,
  language
}) => {
  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";

  const pieData = [
    {
      name: language === "hi" ? "सामग्री लागत (Material)" : "Material Cost",
      value: Math.round(result.materialCostTotal),
      color: "#0f172a", // Slate 900
    },
    {
      name: language === "hi" ? "मजदूरी लागत (Labour)" : "Labour Cost",
      value: Math.round(result.labourCostTotal),
      color: "#f59e0b", // Amber 500
    },
    {
      name: language === "hi" ? "आर्किटेक्ट व ठेकेदार" : "Contractor & Architect",
      value: Math.round(result.contractorAndArchitectCost),
      color: "#3b82f6", // Blue 500
    },
    {
      name: language === "hi" ? "आकस्मिक फंड (Contingency)" : "Contingency Buffer",
      value: Math.round(result.contingencyCost),
      color: "#10b981", // Emerald 500
    },
  ];

  const barData = result.phases.map((p) => ({
    phaseName: `#${p.phaseNumber}`,
    fullName: language === "hi" ? p.titleHi : p.titleEn,
    Material: Math.round(p.materialCost),
    Labour: Math.round(p.labourCost),
    Total: Math.round(p.totalCost),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border-2 border-slate-900 p-3 shadow-[4px_4px_0px_0px_#0F172A] text-xs font-mono space-y-1 text-white">
          <p className="font-bold text-amber-400 uppercase">{data.fullName || data.name}</p>
          {data.value !== undefined && (
            <p className="font-black text-sm">
              {symbol}{data.value.toLocaleString("en-IN")}
            </p>
          )}
          {data.Material !== undefined && (
            <>
              <p className="text-slate-300">
                Material: {symbol}{data.Material.toLocaleString("en-IN")}
              </p>
              <p className="text-amber-400">
                Labour: {symbol}{data.Labour.toLocaleString("en-IN")}
              </p>
              <p className="text-white font-black pt-1 border-t border-slate-700">
                Total Phase: {symbol}{data.Total.toLocaleString("en-IN")}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Pie Chart Card */}
      <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 flex flex-col justify-between">
        <div className="flex items-center space-x-2.5 pb-4 border-b-2 border-slate-900">
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi" ? "लागत विभाजन (Pie Chart Breakdown)" : "Cost Distribution Ratio"}
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "सामान, मजदूरी, ठेकेदार मार्जिन व आकस्मिक फंड का प्रतिशत"
                : "Percentage breakdown of Material vs Labour vs Contractor Margin"}
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80 my-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="#0f172a"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: 'bold', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 flex flex-col justify-between">
        <div className="flex items-center space-x-2.5 pb-4 border-b-2 border-slate-900">
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi" ? "चरण-वार लागत बार चार्ट (Phase-Wise Comparison)" : "Phase-Wise Cost Comparison Bar Chart"}
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "सफाई, नींव, ढांचा, ईंट, प्लास्टर से लेकर स्विच तक तुलना"
                : "Cost per construction phase from clearance to switchboard fittings"}
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80 my-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="phaseName" stroke="#0f172a" fontSize={11} fontWeight="bold" tickLine={false} />
              <YAxis stroke="#0f172a" fontSize={11} fontWeight="bold" tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Material" fill="#0f172a" stackId="a" />
              <Bar dataKey="Labour" fill="#f59e0b" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
