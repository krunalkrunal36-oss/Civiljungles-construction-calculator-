import React, { useState, useEffect, useMemo } from "react";
import { MaterialItemQuantity, CurrencyCode, LanguageMode } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Boxes,
  Search,
  FileSpreadsheet,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Layers,
  DollarSign
} from "lucide-react";

interface MaterialQuantityTableProps {
  materials: MaterialItemQuantity[];
  currency: CurrencyCode;
  language: LanguageMode;
}

const COMMON_UNITS = [
  "Bags (50kg)",
  "Kg",
  "Pcs",
  "Cu.Ft",
  "Sq.Ft",
  "Liters",
  "Rolls (90m)",
  "Units",
  "Feet",
  "Per Brick",
  "Per Bag",
  "Per Kg",
  "Per Sq.Ft",
  "Per Liter",
  "Per Meter"
];

export const MaterialQuantityTable: React.FC<MaterialQuantityTableProps> = ({
  materials: initialMaterials,
  currency,
  language
}) => {
  const [materialsList, setMaterialsList] = useState<MaterialItemQuantity[]>(initialMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Keep synced if props change initially
  useEffect(() => {
    setMaterialsList(initialMaterials);
  }, [initialMaterials]);

  // Form state for adding custom material
  const [showAddForm, setShowAddForm] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [category, setCategory] = useState<MaterialItemQuantity["category"]>("civil");
  const [unit, setUnit] = useState("Pcs");
  const [quantity, setQuantity] = useState<number>(100);
  const [rate, setRate] = useState<number>(10);

  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";

  const formatMoney = (val: number) => {
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  // Inline edit handlers
  const handleQuantityChange = (id: string, newQty: number) => {
    setMaterialsList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const validQty = Math.max(0, newQty);
          return {
            ...m,
            quantity: validQty,
            totalCost: validQty * m.rate
          };
        }
        return m;
      })
    );
  };

  const handleRateChange = (id: string, newRate: number) => {
    setMaterialsList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const validRate = Math.max(0, newRate);
          return {
            ...m,
            rate: validRate,
            totalCost: m.quantity * validRate
          };
        }
        return m;
      })
    );
  };

  const handleUnitChange = (id: string, newUnit: string) => {
    setMaterialsList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unit: newUnit } : m))
    );
  };

  // Add custom material
  const handleAddCustomMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;

    const newItem: MaterialItemQuantity = {
      id: `custom_mat_${Date.now()}`,
      nameEn: nameEn.trim(),
      nameHi: nameHi.trim() || nameEn.trim(),
      category,
      quantity: Number(quantity) || 0,
      unit,
      rate: Number(rate) || 0,
      totalCost: (Number(quantity) || 0) * (Number(rate) || 0)
    };

    setMaterialsList((prev) => [newItem, ...prev]);
    setNameEn("");
    setNameHi("");
    setShowAddForm(false);
  };

  // Delete custom or any item
  const handleDeleteItem = (id: string) => {
    setMaterialsList((prev) => prev.filter((m) => m.id !== id));
  };

  // Reset to original generated list
  const handleReset = () => {
    setMaterialsList(initialMaterials);
  };

  // Filtered materials
  const filteredMaterials = materialsList.filter((m) => {
    const matchesSearch = `${m.nameEn} ${m.nameHi} ${m.unit}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Consolidated Stage / Category Totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {
      civil: 0,
      finishing: 0,
      electrical: 0,
      plumbing: 0,
      doors_windows: 0
    };

    materialsList.forEach((m) => {
      const cat = m.category || "civil";
      totals[cat] = (totals[cat] || 0) + m.totalCost;
    });

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

    return {
      totals,
      grandTotal
    };
  }, [materialsList]);

  // CSV Export
  const exportCSV = () => {
    const headers = ["ID", "Material Name (English)", "Material Name (Hindi)", "Category", "Quantity", "Unit", "Unit Rate", "Total Cost"];
    const rows = materialsList.map((m) => [
      m.id,
      `"${m.nameEn}"`,
      `"${m.nameHi}"`,
      m.category,
      m.quantity,
      `"${m.unit}"`,
      m.rate,
      m.totalCost
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `construction_materials_list_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi"
                ? "चरण-वार सामग्री सूची और लागत कैलकुलेटर (Detailed Material Stage Lists)"
                : "Stage-wise Material Input & Quantity Lists"}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "इकाई (Per Brick/Bag/Kg), आवश्यक मात्रा और प्रति इकाई मूल्य एडिट करें या नई सामग्री जोड़ें"
                : "Specify unit, quantity & unit cost per material with automated cost consolidation"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition uppercase"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            <span>{language === "hi" ? "+ नई सामग्री जोड़ें" : "+ Add Material"}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition uppercase"
            title="Reset to default calculations"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-900" />
            <span>{language === "hi" ? "रीसेट करें" : "Reset"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-amber-300 text-slate-900 font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] transition uppercase"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-900" />
            <span>{language === "hi" ? "Excel / CSV" : "Export CSV"}</span>
          </button>

        </div>
      </div>

      {/* Add Custom Material Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomMaterial} className="bg-amber-50 border-2 border-slate-900 p-4 shadow-[4px_4px_0px_0px_#0F172A] space-y-3 text-xs">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <h3 className="font-black italic uppercase text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              {language === "hi" ? "नई निर्माण सामग्री दर्ज करें (Input Custom Material)" : "Input Custom Material Item"}
            </h3>
            <span className="text-[10px] font-bold uppercase text-slate-500">Auto Calculates Total Cost</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-900 uppercase mb-1">Material Name (EN)</label>
              <input
                type="text"
                required
                placeholder="e.g. Waterproofing Mortar"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 px-2.5 py-1.5 font-bold focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 uppercase mb-1">Stage / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialItemQuantity["category"])}
                className="w-full bg-white border-2 border-slate-900 px-2.5 py-1.5 font-bold focus:outline-none uppercase"
              >
                <option value="civil">Civil Structure</option>
                <option value="anti_termite">Anti-Termite Treatment</option>
                <option value="plaster">Plaster & Chicken Mesh</option>
                <option value="tiles">Tiles, Dado & Granite</option>
                <option value="plumbing">Plumbing Work</option>
                <option value="electrical">Electrical Work</option>
                <option value="finishing">Paint & Putty Finishing</option>
                <option value="doors_windows">Doors & Windows</option>
                <option value="waterproofing">Waterproofing</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 uppercase mb-1">Unit Type</label>
              <input
                type="text"
                list="units_list"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 px-2.5 py-1.5 font-bold focus:outline-none"
                placeholder="per brick, bag, kg..."
              />
              <datalist id="units_list">
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-bold text-slate-900 uppercase mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border-2 border-slate-900 px-2.5 py-1.5 font-mono font-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 uppercase mb-1">Unit Cost ({symbol})</label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-white border-2 border-slate-900 px-2.5 py-1.5 font-mono font-black focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-slate-200 border-2 border-slate-900 font-bold uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#0F172A]"
            >
              + Add to Material List
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A]">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === "hi" ? "सामग्री या इकाई खोजें..." : "Search material or unit..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-900 pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none uppercase"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border-2 border-slate-900 px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer uppercase"
        >
          <option value="all">{language === "hi" ? "सभी श्रेणियां (All Items)" : "All Items & Stages"}</option>
          <option value="civil">{language === "hi" ? "सिविल ढांचा (Civil Structure)" : "Civil Structure"}</option>
          <option value="anti_termite">{language === "hi" ? "दीमक रोधी इलाज (Anti-Termite)" : "Anti-Termite Treatment"}</option>
          <option value="plaster">{language === "hi" ? "प्लास्टर व मुर्गा जाली (Plaster Details)" : "Plaster & Mesh"}</option>
          <option value="tiles">{language === "hi" ? "टाइल्स, मार्बल व ग्रेनाइट (Tiles & Granite)" : "Tiles, Dado & Granite"}</option>
          <option value="plumbing">{language === "hi" ? "प्लंबिंग व ड्रेनेज (Plumbing & Sanitary)" : "Plumbing & Sanitary"}</option>
          <option value="electrical">{language === "hi" ? "इलेक्ट्रिकल व स्विच (Electrical)" : "Electrical & Switches"}</option>
          <option value="finishing">{language === "hi" ? "पेंटिंग व वॉल पुट्टी (Finishing & Paint)" : "Paint & Putty"}</option>
          <option value="doors_windows">{language === "hi" ? "दरवाजे व खिड़कियां (Doors & Windows)" : "Doors & Windows"}</option>
          <option value="waterproofing">{language === "hi" ? "वाटरप्रूफिंग (Waterproofing)" : "Waterproofing"}</option>
        </select>
      </div>

      {/* Interactive Material List Table */}
      <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
              <th className="p-3">#</th>
              <th className="p-3">{language === "hi" ? "सामग्री नाम (Material Name)" : "Material Name"}</th>
              <th className="p-3">{language === "hi" ? "चरण / वर्ग" : "Stage / Category"}</th>
              <th className="p-3 text-center">{language === "hi" ? "इकाई (Unit)" : "Unit"}</th>
              <th className="p-3 text-right">{language === "hi" ? "आवश्यक मात्रा" : "Quantity"}</th>
              <th className="p-3 text-right">{language === "hi" ? "इकाई मूल्य" : "Unit Cost"}</th>
              <th className="p-3 text-right">{language === "hi" ? "कुल मूल्य (Total Cost)" : "Total Cost"}</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
            {filteredMaterials.map((m, idx) => (
              <tr key={m.id} className="hover:bg-amber-50/60 transition">
                <td className="p-3 text-slate-500 font-mono font-bold">{idx + 1}</td>
                
                {/* Material Name */}
                <td className="p-3">
                  <span className="font-black text-slate-900 uppercase block">
                    {language === "hi" ? m.nameHi : m.nameEn}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {language === "hi" ? m.nameEn : m.nameHi}
                  </span>
                </td>

                {/* Category Badge */}
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-900 text-[10px] font-mono font-bold border border-slate-900 uppercase">
                    {m.category}
                  </span>
                </td>

                {/* Unit Edit */}
                <td className="p-3 text-center">
                  <input
                    type="text"
                    value={m.unit}
                    onChange={(e) => handleUnitChange(m.id, e.target.value)}
                    className="w-24 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 font-mono text-[11px] text-center focus:bg-amber-100 focus:outline-none"
                  />
                </td>

                {/* Quantity Edit */}
                <td className="p-3 text-right">
                  <input
                    type="number"
                    min="0"
                    value={m.quantity}
                    onChange={(e) => handleQuantityChange(m.id, Number(e.target.value))}
                    className="w-24 bg-white border-2 border-slate-900 px-2 py-1 font-mono font-black text-right text-amber-700 focus:bg-amber-200 focus:outline-none"
                  />
                </td>

                {/* Unit Rate Edit */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-mono text-slate-500 font-bold">{symbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={m.rate}
                      onChange={(e) => handleRateChange(m.id, Number(e.target.value))}
                      className="w-20 bg-white border-2 border-slate-900 px-1.5 py-1 font-mono font-bold text-right text-slate-800 focus:bg-amber-200 focus:outline-none"
                    />
                  </div>
                </td>

                {/* Auto Calculated Total Cost */}
                <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">
                  {formatMoney(m.totalCost)}
                </td>

                {/* Action Delete */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteItem(m.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition"
                    title="Delete Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
              <td colSpan={6} className="p-3 text-right uppercase">
                {language === "hi" ? "कुल सामग्री लागत योग (Total Consolidated Material Sum):" : "Consolidated Material Total Sum:"}
              </td>
              <td className="p-3 text-right text-slate-900 text-sm sm:text-base" colSpan={2}>
                {formatMoney(categoryTotals.grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* SECTION B: Stage-wise Consolidated Material Summary Cards */}
      <div className="bg-slate-50 border-2 border-slate-900 p-4 shadow-[2px_2px_0px_0px_#0F172A] space-y-3">
        <h3 className="font-black italic uppercase text-slate-900 text-sm flex items-center gap-2 border-b-2 border-slate-900 pb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          {language === "hi"
            ? "श्रेणी-वार सामग्री लागत सारांश (Consolidated Category Breakdown)"
            : "Consolidated Category Material Summary"}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Civil Structure</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.civil || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Anti-Termite</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.anti_termite || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Plaster Details</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.plaster || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Tiles & Granite</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.tiles || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Plumbing & Sanitary</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.plumbing || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Electrical & Switches</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.electrical || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Paint & Putty</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.finishing || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Doors & Windows</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.doors_windows || 0)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-2.5 shadow-[2px_2px_0px_0px_#0F172A]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Waterproofing</span>
            <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
              {formatMoney(categoryTotals.totals.waterproofing || 0)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
