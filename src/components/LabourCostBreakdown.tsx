import React, { useState, useMemo } from "react";
import { LabourBreakdownItem, CurrencyCode, LanguageMode, LaborRole } from "../types";
import { CURRENCY_CONVERSION } from "../data/defaultRates";
import {
  Users,
  HardHat,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Check,
  Briefcase,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface TaskLaborData {
  id: string;
  taskTitleEn: string;
  taskTitleHi: string;
  roleDays: Record<string, number>;
}

interface LabourCostBreakdownProps {
  labourList: LabourBreakdownItem[];
  currency: CurrencyCode;
  language: LanguageMode;
  totalBuiltUpAreaSqFt?: number;
}

const DEFAULT_LABOR_ROLES: LaborRole[] = [
  { id: "role_mason", nameEn: "Skilled Mason / Mistri", nameHi: "कुशल राजमिस्त्री", category: "skilled", dailyWageINR: 900 },
  { id: "role_barbender", nameEn: "Bar Bender & Steel Fixer", nameHi: "सरिया बाइंडिंग मिस्त्री", category: "skilled", dailyWageINR: 950 },
  { id: "role_carpenter", nameEn: "Carpenter & Shuttering Expert", nameHi: "कारपेंटर व शटरिंग कारीगर", category: "skilled", dailyWageINR: 900 },
  { id: "role_electrician", nameEn: "Electrician & Technician", nameHi: "इलेक्ट्रीशियन", category: "specialist", dailyWageINR: 850 },
  { id: "role_plumber", nameEn: "Plumber & Sanitary Expert", nameHi: "प्लंबर व सैनिटरी मिस्त्री", category: "specialist", dailyWageINR: 850 },
  { id: "role_tiler", nameEn: "Tile & Marble Fitter", nameHi: "टाइल्स व मार्बल मिस्त्री", category: "skilled", dailyWageINR: 920 },
  { id: "role_painter", nameEn: "Painter & Putty Finisher", nameHi: "पेंटर व पुट्टी मिस्त्री", category: "semi_skilled", dailyWageINR: 800 },
  { id: "role_semiskilled", nameEn: "Semi-Skilled Assistant", nameHi: "अर्ध-कुशल सहायक", category: "semi_skilled", dailyWageINR: 700 },
  { id: "role_helper", nameEn: "Unskilled Helper / Mazdoor", nameHi: "अकुशल मजदूर / हेल्पर", category: "unskilled", dailyWageINR: 500 },
];

export const LabourCostBreakdown: React.FC<LabourCostBreakdownProps> = ({
  labourList,
  currency,
  language,
  totalBuiltUpAreaSqFt = 1000
}) => {
  const symbol = CURRENCY_CONVERSION[currency]?.symbol || "₹";
  const rateFromINR = CURRENCY_CONVERSION[currency]?.rateFromINR || 1.0;

  const [activeSubTab, setActiveSubTab] = useState<"roles_and_tasks" | "contract_trades">("roles_and_tasks");
  const [roles, setRoles] = useState<LaborRole[]>(DEFAULT_LABOR_ROLES);

  // New custom role form state
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleNameEn, setNewRoleNameEn] = useState("");
  const [newRoleNameHi, setNewRoleNameHi] = useState("");
  const [newRoleCategory, setNewRoleCategory] = useState<LaborRole["category"]>("skilled");
  const [newRoleWage, setNewRoleWage] = useState<number>(800);

  // Expanded task ID in the accordion
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>("task_1");

  // Multiplier based on area
  const areaFactor = Math.max(0.5, totalBuiltUpAreaSqFt / 1000);

  // Task-wise labor days initial state
  const [tasks, setTasks] = useState<TaskLaborData[]>([
    {
      id: "task_1",
      taskTitleEn: "1. Site Clearance & Earthwork Excavation",
      taskTitleHi: "1. साइट सफाई और नींव की खुदाई",
      roleDays: {
        role_semiskilled: Math.round(6 * areaFactor),
        role_helper: Math.round(18 * areaFactor)
      }
    },
    {
      id: "task_2",
      taskTitleEn: "2. Foundation & Substructure (Plinth Beam)",
      taskTitleHi: "2. नींव, फुटिंग और प्लिंथ बीम",
      roleDays: {
        role_mason: Math.round(12 * areaFactor),
        role_barbender: Math.round(8 * areaFactor),
        role_carpenter: Math.round(10 * areaFactor),
        role_helper: Math.round(28 * areaFactor)
      }
    },
    {
      id: "task_3",
      taskTitleEn: "3. Superstructure RCC Columns, Beams & Slab",
      taskTitleHi: "3. कॉलम, बीम और छत की ढलाई (RCC)",
      roleDays: {
        role_mason: Math.round(22 * areaFactor),
        role_barbender: Math.round(18 * areaFactor),
        role_carpenter: Math.round(25 * areaFactor),
        role_helper: Math.round(55 * areaFactor)
      }
    },
    {
      id: "task_4",
      taskTitleEn: "4. Masonry & Wall Construction (Bricks / AAC)",
      taskTitleHi: "4. ईंट की दीवारें (ब्रिकवर्क / AAC ब्लॉक्स)",
      roleDays: {
        role_mason: Math.round(20 * areaFactor),
        role_helper: Math.round(30 * areaFactor)
      }
    },
    {
      id: "task_5",
      taskTitleEn: "5. Plastering & Waterproofing Work",
      taskTitleHi: "5. प्लास्टर व वाटरप्रूफिंग",
      roleDays: {
        role_mason: Math.round(18 * areaFactor),
        role_semiskilled: Math.round(10 * areaFactor),
        role_helper: Math.round(25 * areaFactor)
      }
    },
    {
      id: "task_6",
      taskTitleEn: "6. Flooring, Tiling & Kitchen Granite",
      taskTitleHi: "6. टाइल्स, मार्बल और ग्रेनाइट फिटिंग",
      roleDays: {
        role_tiler: Math.round(16 * areaFactor),
        role_helper: Math.round(20 * areaFactor)
      }
    },
    {
      id: "task_7",
      taskTitleEn: "7. Doors, Windows & Carpentry Fittings",
      taskTitleHi: "7. दरवाजे, खिड़कियां और कारपेंटरी",
      roleDays: {
        role_carpenter: Math.round(14 * areaFactor),
        role_semiskilled: Math.round(8 * areaFactor)
      }
    },
    {
      id: "task_8",
      taskTitleEn: "8. Electrical Wiring, Switchboards & Switches",
      taskTitleHi: "8. वायरिंग, स्विचबोर्ड, स्विच व एमसीबी",
      roleDays: {
        role_electrician: Math.round(12 * areaFactor),
        role_helper: Math.round(10 * areaFactor)
      }
    },
    {
      id: "task_9",
      taskTitleEn: "9. Plumbing, Drainage, Sanitary & Water Tank",
      taskTitleHi: "9. प्लंबिंग, ड्रेनेज, कमोड व वाटर टैंक",
      roleDays: {
        role_plumber: Math.round(12 * areaFactor),
        role_helper: Math.round(10 * areaFactor)
      }
    },
    {
      id: "task_10",
      taskTitleEn: "10. Painting, Wall Putty & Wall Finishes",
      taskTitleHi: "10. पेंटिंग, पुट्टी व वाशिंग",
      roleDays: {
        role_painter: Math.round(18 * areaFactor),
        role_helper: Math.round(15 * areaFactor)
      }
    },
    {
      id: "task_11",
      taskTitleEn: "11. Final Site Deep Cleaning & Handover",
      taskTitleHi: "11. अंतिम सफाई व साइट हैंडओवर",
      roleDays: {
        role_semiskilled: Math.round(5 * areaFactor),
        role_helper: Math.round(10 * areaFactor)
      }
    }
  ]);

  const formatMoney = (valINR: number) => {
    const val = valINR * rateFromINR;
    return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
  };

  // Update daily wage for a role
  const handleWageChange = (roleId: string, newWage: number) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, dailyWageINR: Math.max(0, newWage) } : r))
    );
  };

  // Add custom labor role
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleNameEn.trim()) return;
    const newId = `role_custom_${Date.now()}`;
    const newRoleObj: LaborRole = {
      id: newId,
      nameEn: newRoleNameEn.trim(),
      nameHi: newRoleNameHi.trim() || newRoleNameEn.trim(),
      category: newRoleCategory,
      dailyWageINR: Number(newRoleWage) || 800
    };
    setRoles((prev) => [...prev, newRoleObj]);
    setNewRoleNameEn("");
    setNewRoleNameHi("");
    setShowAddRole(false);
  };

  // Delete custom role
  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    // Remove role from task allocations
    setTasks((prev) =>
      prev.map((t) => {
        const updatedDays = { ...t.roleDays };
        delete updatedDays[roleId];
        return { ...t, roleDays: updatedDays };
      })
    );
  };

  // Update days required for a role in a task
  const handleTaskRoleDaysChange = (taskId: string, roleId: string, days: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedDays = { ...t.roleDays, [roleId]: Math.max(0, days) };
          return { ...t, roleDays: updatedDays };
        }
        return t;
      })
    );
  };

  // Calculations: Task costs & Role-wise totals
  const roleMap = useMemo(() => {
    const map = new Map<string, LaborRole>();
    roles.forEach((r) => map.set(r.id, r));
    return map;
  }, [roles]);

  // Calculate task totals
  const taskCalculatedData = useMemo(() => {
    return tasks.map((t) => {
      let taskCostINR = 0;
      let taskTotalDays = 0;
      Object.entries(t.roleDays).forEach(([roleId, days]) => {
        const role = roleMap.get(roleId);
        const wage = role ? role.dailyWageINR : 0;
        const numDays = Number(days) || 0;
        taskCostINR += numDays * wage;
        taskTotalDays += numDays;
      });
      return {
        ...t,
        taskCostINR,
        taskTotalDays
      };
    });
  }, [tasks, roleMap]);

  // Total labor cost from role & task calculator
  const grandTotalLaborCostINR = useMemo(() => {
    return taskCalculatedData.reduce((acc, t) => acc + t.taskCostINR, 0);
  }, [taskCalculatedData]);

  const grandTotalManDays = useMemo(() => {
    return taskCalculatedData.reduce((acc, t) => acc + t.taskTotalDays, 0);
  }, [taskCalculatedData]);

  // Role-wise totals across all tasks
  const roleSummaryData = useMemo(() => {
    return roles.map((role) => {
      let totalDays = 0;
      tasks.forEach((t) => {
        totalDays += t.roleDays[role.id] || 0;
      });
      const totalCostINR = totalDays * role.dailyWageINR;
      return {
        role,
        totalDays,
        totalCostINR
      };
    });
  }, [roles, tasks]);

  // Trade Contract List Total
  const tradeListCostSum = labourList.reduce((acc, l) => acc + l.totalCost, 0);
  const tradeListManDaysSum = labourList.reduce((acc, l) => acc + l.estimatedManDays, 0);

  return (
    <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-5 text-slate-900 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tight text-slate-900">
              {language === "hi"
                ? "मजदूरी व मिस्त्री खर्चा कैलकुलेटर (Labor Cost & Man-Days Estimation)"
                : "Labor Cost & Man-Days Estimation Engine"}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi"
                ? "कारीगरों की दैनिक मजदूरी, चरण-वार मिस्त्री दिन (Man-Days) और कुल श्रम लागत की गणना"
                : "Define labor roles, daily wages, task-wise required days & compute total labor costs"}
            </p>
          </div>
        </div>

        {/* Total Summary Badge */}
        <div className="flex items-center space-x-3 bg-amber-400 p-2.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] text-xs font-bold">
          <div className="text-slate-900 uppercase">
            {language === "hi" ? "कुल अनुमानित मैन-डेज:" : "Total Est. Man-Days:"}
          </div>
          <div className="text-slate-900 font-mono font-black text-sm sm:text-base flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-900" />
            {activeSubTab === "roles_and_tasks" ? grandTotalManDays : tradeListManDaysSum} Days
          </div>
        </div>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
        <button
          onClick={() => setActiveSubTab("roles_and_tasks")}
          className={`px-4 py-2 text-xs font-black uppercase transition border-2 border-slate-900 flex items-center gap-2 ${
            activeSubTab === "roles_and_tasks"
              ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>
            {language === "hi"
              ? "1. रोल-वार मजदूरी व टास्क कैलकुलेटर (Interactive)"
              : "1. Role & Task-wise Labor Estimator"}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("contract_trades")}
          className={`px-4 py-2 text-xs font-black uppercase transition border-2 border-slate-900 flex items-center gap-2 ${
            activeSubTab === "contract_trades"
              ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>
            {language === "hi"
              ? "2. ठेका दर दर-सूची (Contract Trade Rates)"
              : "2. Contract Trade Unit Rates"}
          </span>
        </button>
      </div>

      {/* SUB TAB 1: ROLES AND TASKS CALCULATOR */}
      {activeSubTab === "roles_and_tasks" && (
        <div className="space-y-8">
          
          {/* SECTION A: Labor Roles & Daily Wages Configurator */}
          <div className="bg-slate-50 border-2 border-slate-900 p-4 shadow-[2px_2px_0px_0px_#0F172A] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-slate-900 pb-3">
              <div>
                <h3 className="font-black italic uppercase text-slate-900 text-sm flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-amber-600" />
                  {language === "hi" ? "कारीगर रोल व दैनिक मजदूरी (Labor Roles & Daily Wages)" : "Labor Roles & Daily Wage Rates"}
                </h3>
                <p className="text-[11px] font-bold text-slate-600 uppercase">
                  {language === "hi"
                    ? "दैनिक मजदूरी बदलें या अपनी आवश्यकतानुसार नया मिस्त्री / मजदूर रोल जोड़ें"
                    : "Edit daily wages or add custom labor roles required for your site"}
                </p>
              </div>

              <button
                onClick={() => setShowAddRole(!showAddRole)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Plus className="w-4 h-4" />
                <span>{language === "hi" ? "+ नया रोल जोड़ें" : "+ Add Custom Role"}</span>
              </button>
            </div>

            {/* Add Custom Role Modal/Form */}
            {showAddRole && (
              <form onSubmit={handleAddRole} className="bg-white border-2 border-slate-900 p-4 shadow-[2px_2px_0px_0px_#0F172A] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">
                    {language === "hi" ? "रोल नाम (English)" : "Role Name (EN)"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welder / Fabrication"
                    value={newRoleNameEn}
                    onChange={(e) => setNewRoleNameEn(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 px-2.5 py-1.5 font-bold focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">
                    {language === "hi" ? "रोल नाम (हिंदी)" : "Role Name (HI)"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. वेल्डर"
                    value={newRoleNameHi}
                    onChange={(e) => setNewRoleNameHi(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 px-2.5 py-1.5 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">
                    {language === "hi" ? "दैनिक मजदूरी (Daily Wage ₹)" : "Daily Wage (INR ₹)"}
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newRoleWage}
                    onChange={(e) => setNewRoleWage(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-900 px-2.5 py-1.5 font-mono font-black focus:outline-none"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#0F172A]"
                  >
                    {language === "hi" ? "सेव करें" : "Save Role"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRole(false)}
                    className="px-3 py-1.5 bg-slate-200 border-2 border-slate-900 font-bold uppercase text-xs"
                  >
                    {language === "hi" ? "रद्द करें" : "Cancel"}
                  </button>
                </div>
              </form>
            )}

            {/* Roles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border-2 border-slate-900 p-3 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 text-xs uppercase block">
                      {language === "hi" ? r.nameHi : r.nameEn}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      {r.category.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-bold text-slate-700">{symbol}</span>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={r.dailyWageINR}
                      onChange={(e) => handleWageChange(r.id, Number(e.target.value))}
                      className="w-20 bg-slate-100 border-2 border-slate-900 px-2 py-1 font-mono font-black text-xs text-right focus:bg-amber-100 focus:outline-none"
                    />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">/day</span>

                    {r.id.startsWith("role_custom_") && (
                      <button
                        onClick={() => handleDeleteRole(r.id)}
                        className="p-1 text-red-600 hover:text-red-800 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: Construction Task / Phase Labor Days Allocator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <h3 className="font-black italic uppercase text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  {language === "hi"
                    ? "निर्माण चरण-वार आवश्यक मैन-डेज आवंटन (Task-wise Labor Days Matrix)"
                    : "Construction Stage-wise Labor Days Allocation"}
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  {language === "hi"
                    ? "प्रत्येक निर्माण कार्य के लिए विभिन्न कारीगरों के आवश्यक कार्य दिवस (Days) दर्ज करें"
                    : "Specify estimated days required per labor role for each construction task"}
                </p>
              </div>

              <span className="bg-amber-400 border-2 border-slate-900 px-3 py-1 font-mono font-black text-xs shadow-[2px_2px_0px_0px_#0F172A]">
                {formatMoney(grandTotalLaborCostINR)} Total
              </span>
            </div>

            {/* Task Accordion List */}
            <div className="space-y-3">
              {taskCalculatedData.map((task, idx) => {
                const isExpanded = expandedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-hidden"
                  >
                    {/* Accordion Header */}
                    <div
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-3.5 bg-slate-100 hover:bg-amber-100/60 transition cursor-pointer flex items-center justify-between border-b-2 border-slate-900"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-slate-900 text-amber-400 font-mono font-black text-xs flex items-center justify-center border border-slate-900">
                          {idx + 1}
                        </span>
                        <span className="font-black uppercase text-xs sm:text-sm text-slate-900">
                          {language === "hi" ? task.taskTitleHi : task.taskTitleEn}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="font-mono font-black text-amber-700 text-xs sm:text-sm block">
                            {formatMoney(task.taskCostINR)}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
                            {task.taskTotalDays} Man-Days
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-900" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-900" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Body: Roles Days Inputs Grid */}
                    {isExpanded && (
                      <div className="p-4 bg-white space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {roles.map((r) => {
                            const days = task.roleDays[r.id] || 0;
                            const roleTotalCost = days * r.dailyWageINR;

                            return (
                              <div
                                key={r.id}
                                className={`p-2.5 border-2 border-slate-900 transition ${
                                  days > 0 ? "bg-amber-50/80 shadow-[2px_2px_0px_0px_#0F172A]" : "bg-slate-50 opacity-75"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-slate-900 text-[11px] uppercase">
                                    {language === "hi" ? r.nameHi : r.nameEn}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-600 font-bold">
                                    @{symbol}{r.dailyWageINR}/d
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="number"
                                      min="0"
                                      value={days}
                                      onChange={(e) =>
                                        handleTaskRoleDaysChange(task.id, r.id, Number(e.target.value))
                                      }
                                      className="w-16 bg-white border-2 border-slate-900 px-2 py-1 font-mono font-black text-xs text-center focus:bg-amber-200 focus:outline-none"
                                    />
                                    <span className="font-bold text-slate-700 uppercase text-[10px]">Days</span>
                                  </div>

                                  <span className="font-mono font-black text-slate-900 text-xs">
                                    {formatMoney(roleTotalCost)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C: Role-wise Consolidated Summary Table */}
          <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] p-4 space-y-3">
            <h3 className="font-black italic uppercase text-slate-900 text-sm flex items-center gap-2 border-b-2 border-slate-900 pb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              {language === "hi"
                ? "रोल-वार कुल श्रम लागत सारांश (Consolidated Labor Summary by Role)"
                : "Consolidated Labor Summary by Role"}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">{language === "hi" ? "कारीगर रोल" : "Labor Role"}</th>
                    <th className="p-2.5">{language === "hi" ? "कैटेगिरी" : "Category"}</th>
                    <th className="p-2.5 text-right">{language === "hi" ? "दैनिक दर" : "Daily Wage"}</th>
                    <th className="p-2.5 text-right">{language === "hi" ? "कुल मैन-डेज" : "Total Man-Days"}</th>
                    <th className="p-2.5 text-right">{language === "hi" ? "कुल श्रम लागत" : "Total Cost"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                  {roleSummaryData.map((item, i) => (
                    <tr key={item.role.id} className="hover:bg-amber-50/50">
                      <td className="p-2.5 font-mono text-slate-500 font-bold">{i + 1}</td>
                      <td className="p-2.5 font-black uppercase text-slate-900">
                        {language === "hi" ? item.role.nameHi : item.role.nameEn}
                      </td>
                      <td className="p-2.5 font-mono text-[10px] uppercase font-bold text-slate-600">
                        {item.role.category.replace("_", " ")}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-700">
                        {formatMoney(item.role.dailyWageINR)} / day
                      </td>
                      <td className="p-2.5 text-right font-mono font-black text-amber-700 text-sm">
                        {item.totalDays} Days
                      </td>
                      <td className="p-2.5 text-right font-mono font-black text-slate-900 text-sm">
                        {formatMoney(item.totalCostINR)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
                    <td colSpan={4} className="p-3 text-right uppercase">
                      {language === "hi" ? "कुल योग (Grand Total):" : "Grand Total Labor Summary:"}
                    </td>
                    <td className="p-3 text-right text-slate-900 text-sm">
                      {grandTotalManDays} Days
                    </td>
                    <td className="p-3 text-right text-slate-900 text-base">
                      {formatMoney(grandTotalLaborCostINR)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 2: CONTRACT TRADE RATES TABLE */}
      {activeSubTab === "contract_trades" && (
        <div className="bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase font-bold border-b-2 border-slate-900">
                <th className="p-3">#</th>
                <th className="p-3">{language === "hi" ? "काम का प्रकार / मिस्त्री (Trade)" : "Trade / Work Description"}</th>
                <th className="p-3 text-right">{language === "hi" ? "अनुमानित मैन-डेज" : "Est. Man-Days"}</th>
                <th className="p-3 text-right">{language === "hi" ? "ठेका दर (Unit Rate)" : "Unit Rate"}</th>
                <th className="p-3 text-right">{language === "hi" ? "कुल मजदूरी लागत" : "Total Labour Cost"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
              {labourList.map((item, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition">
                  <td className="p-3 text-slate-500 font-mono font-bold">{idx + 1}</td>
                  <td className="p-3">
                    <span className="font-black text-slate-900 uppercase block">
                      {language === "hi" ? item.tradeHi : item.tradeEn}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {language === "hi" ? item.tradeEn : item.tradeHi}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-black text-amber-600 text-sm">
                    {item.estimatedManDays} Days
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-700">
                    {symbol}{Math.round(item.unitRate).toLocaleString("en-IN")} / {item.rateType}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">
                    {`${symbol}${Math.round(item.totalCost).toLocaleString("en-IN")}`}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-amber-400 text-slate-900 border-t-2 border-slate-900 font-mono font-black text-xs sm:text-sm">
                <td colSpan={4} className="p-3 text-right uppercase">
                  {language === "hi" ? "कुल मजदूरी योग (Total Labour Sum):" : "Total Labour Cost Sum:"}
                </td>
                <td className="p-3 text-right text-slate-900 text-sm sm:text-base">
                  {`${symbol}${Math.round(tradeListCostSum).toLocaleString("en-IN")}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

    </div>
  );
};
