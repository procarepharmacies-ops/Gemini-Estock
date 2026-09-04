import React, { useState, useMemo } from "react";
import {
  Store,
  Pill,
  TrendingUp,
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Package,
  Activity,
  Zap,
  Info,
  ExternalLink,
  Plus,
  RefreshCw,
} from "lucide-react";
import { ESTOCK_PHARMACY_PRODUCTS, EStockProduct } from "../data/estockCatalog";

interface PharmacyDashboardProps {
  onOpenCounselor: (medicationQuery?: string) => void;
  onOpenModernizer: () => void;
  showToast: (msg: string) => void;
}

interface TransferModalState {
  isOpen: boolean;
  product: EStockProduct | null;
  fromStore: string;
  toStore: string;
  quantity: number;
}

export const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({
  onOpenCounselor,
  onOpenModernizer,
  showToast,
}) => {
  const [products, setProducts] = useState<EStockProduct[]>(ESTOCK_PHARMACY_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"inventory" | "fefo" | "transfers">("inventory");

  // Transfer state
  const [transferModal, setTransferModal] = useState<TransferModalState>({
    isOpen: false,
    product: null,
    fromStore: "Main Store",
    toStore: "Branch 2 (North Plaza)",
    quantity: 10,
  });

  // Recent Transfer Log
  const [transferLogs, setTransferLogs] = useState<
    Array<{
      id: string;
      productName: string;
      from: string;
      to: string;
      qty: number;
      timestamp: string;
      status: "In Transit" | "Completed";
    }>
  >([
    {
      id: "TRX-8921",
      productName: "Curam 1g Tablets",
      from: "Main Store",
      to: "Branch 2 (North Plaza)",
      qty: 15,
      timestamp: "Today, 14:32",
      status: "Completed",
    },
    {
      id: "TRX-8920",
      productName: "Panadol Extra",
      from: "Main Store",
      to: "Branch 1 (Downtown)",
      qty: 50,
      timestamp: "Today, 11:15",
      status: "Completed",
    },
    {
      id: "TRX-8919",
      productName: "Lipitor 20mg",
      from: "Branch 2 (North Plaza)",
      to: "Branch 1 (Downtown)",
      qty: 8,
      timestamp: "Yesterday, 16:45",
      status: "Completed",
    },
  ]);

  // Selected product for detailed modal inspection
  const [inspectedProduct, setInspectedProduct] = useState<EStockProduct | null>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.therapeuticClass.split(" ")[0]));
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameAr.includes(searchQuery) ||
        p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || p.therapeuticClass.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesBranch =
        selectedBranch === "all" ||
        p.batches.some(
          (b) => b.store.toLowerCase().includes(selectedBranch.toLowerCase()) && b.amount > 0
        );

      return matchesSearch && matchesCategory && matchesBranch;
    });
  }, [products, searchQuery, selectedCategory, selectedBranch]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    let totalStock = 0;
    let totalValue = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;

    products.forEach((p) => {
      p.batches.forEach((b) => {
        totalStock += b.amount;
        totalValue += b.amount * b.sellPrice;
        if (b.amount === 0) outOfStockCount++;
        else if (b.amount < 15) lowStockCount++;
      });
    });

    return {
      totalProducts: 53474, // total catalog items in eStock
      displayedSku: products.length,
      unitsInStock: totalStock + 52400, // scaled representative pharmacy stock
      stockValueFormatted: "$" + (totalValue + 798400).toLocaleString(),
      prescriptionsToday: 184,
      genericSubstitutionsToday: 23,
      patientSavingsToday: "$612.80",
      outOfStockBranches: outOfStockCount,
      lowStockBatches: lowStockCount,
    };
  }, [products]);

  // Handle Transfer Confirmation
  const executeTransfer = () => {
    if (!transferModal.product) return;
    const { product, fromStore, toStore, quantity } = transferModal;

    if (fromStore === toStore) {
      showToast("Source and destination stores must be different.");
      return;
    }

    // Verify source stock
    const sourceBatch = product.batches.find((b) => b.store === fromStore);
    if (!sourceBatch || sourceBatch.amount < quantity) {
      showToast(`Insufficient stock in ${fromStore}. Available: ${sourceBatch?.amount || 0}`);
      return;
    }

    // Update product batches state
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== product.productId) return p;
        const updatedBatches = p.batches.map((b) => {
          if (b.store === fromStore) {
            return { ...b, amount: b.amount - quantity };
          }
          if (b.store === toStore) {
            return { ...b, amount: b.amount + quantity };
          }
          return b;
        });
        return { ...p, batches: updatedBatches };
      })
    );

    // Add log
    const newLog = {
      id: "TRX-" + Math.floor(1000 + Math.random() * 9000),
      productName: product.nameEn,
      from: fromStore,
      to: toStore,
      qty: quantity,
      timestamp: "Just now",
      status: "In Transit" as const,
    };

    setTransferLogs((prev) => [newLog, ...prev]);
    setTransferModal({ ...transferModal, isOpen: false, product: null });
    showToast(`Transfer order generated: ${quantity} units of ${product.nameEn} dispatched from ${fromStore.split(" ")[0]} to ${toStore.split(" ")[0]}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Pharmacy Multi-Branch Live Operations */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                <Activity className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                Live eStock Multi-Branch Network
              </span>
              <span className="text-xs text-slate-400 font-mono">stock_phy_ver1.8.0.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ProCare Pharmacy Multi-Branch Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time branch inventory control across 3 active locations. Grounded with automated FEFO batch tracking,
              instant generic substitutions, customer savings tracking, and seamless cross-branch stock rebalancing.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenCounselor()}
              className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition group"
            >
              <Pill className="w-4 h-4 mr-2 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Prescription Scanner & AI Chat</span>
              <ArrowRightLeft className="w-3.5 h-3.5 ml-2 opacity-70" />
            </button>

            <button
              onClick={onOpenModernizer}
              className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <Layers className="w-4 h-4 mr-2 text-indigo-400" />
              <span>SQL 2008 Cloud Modernizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total SKUs & Valuation */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">eStock Active Catalog</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">53,474</span>
              <span className="text-xs text-emerald-400 font-medium">SKUs Active</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total Valuation: {stats.stockValueFormatted}</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Central Warehouse</span>
            <span className="font-mono text-indigo-300 font-semibold">3 Stores Synced</span>
          </div>
        </div>

        {/* Metric 2: Branch Fill Rate & Stock Allocation */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Network Fill Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">97.8%</span>
              <span className="text-xs text-slate-400 font-medium">On-Shelf</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">184 Prescriptions Filled Today</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Out of Stock Alerts</span>
            <span className="font-mono text-rose-400 font-bold">{stats.outOfStockBranches} branch lines</span>
          </div>
        </div>

        {/* Metric 3: Patient Savings via Generic Substitution */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Generic Substitution Savings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-amber-300 font-mono tracking-tight">
                {stats.patientSavingsToday}
              </span>
              <span className="text-xs text-slate-400 font-medium">Saved Today</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{stats.genericSubstitutionsToday} Brand-to-Generic Switches</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Avg. Patient Discount</span>
            <span className="font-mono text-emerald-400 font-bold">34.2% Saved</span>
          </div>
        </div>

        {/* Metric 4: FEFO Expiry & Quality Compliance */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">FEFO Batch Quality</span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">100%</span>
              <span className="text-xs text-purple-400 font-medium">Compliant</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">First-Expired First-Out Rules Enforced</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Next Expiring Batch</span>
            <span className="font-mono text-amber-400 font-semibold">Aug 2026</span>
          </div>
        </div>
      </div>

      {/* 3 Active Branches Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Branch 1: Main Store */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Main Store (Central)</h4>
                <p className="text-[10px] text-slate-400">Central Pharmacy & Warehouse</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Optimal (99.4%)
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Inventory Units:</span>
              <span className="font-mono font-bold text-white">1,182 boxes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Volume:</span>
              <span className="font-mono text-slate-300">92 Prescriptions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Stock Status:</span>
              <span className="text-emerald-400 font-medium">All critical lines available</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedBranch("Main Store")}
            className="w-full mt-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Filter Main Store Stock
          </button>
        </div>

        {/* Branch 2: Downtown Clinic */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Branch 1 (Downtown)</h4>
                <p className="text-[10px] text-slate-400">Clinic District Dispensary</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Good (96.8%)
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Inventory Units:</span>
              <span className="font-mono font-bold text-white">470 boxes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Volume:</span>
              <span className="font-mono text-slate-300">58 Prescriptions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Low Stock Notice:</span>
              <span className="text-amber-400 font-medium">Nexium 40mg (0 box - Curam OK)</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedBranch("Branch 1")}
            className="w-full mt-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Filter Downtown Stock
          </button>
        </div>

        {/* Branch 3: North Plaza */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Branch 2 (North Plaza)</h4>
                <p className="text-[10px] text-slate-400">Residential Express Branch</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Needs Rebalance
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Inventory Units:</span>
              <span className="font-mono font-bold text-white">407 boxes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Volume:</span>
              <span className="font-mono text-slate-300">34 Prescriptions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Out of Stock:</span>
              <span className="text-rose-400 font-medium">Augmentin 1g & Concor 5mg</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedBranch("Branch 2")}
            className="w-full mt-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Filter North Plaza Stock
          </button>
        </div>
      </div>

      {/* Main Table & Tabs: Master Inventory / FEFO Batch Explorer / Branch Transfers */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        {/* Navigation Tabs and Search Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          {/* Subtabs */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === "inventory"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog & Branch Stock</span>
            </button>

            <button
              onClick={() => setActiveTab("fefo")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === "fefo"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>FEFO Expiry Management</span>
            </button>

            <button
              onClick={() => setActiveTab("transfers")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === "transfers"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Branch Transfers ({transferLogs.length})</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drug, generic salt, barcode..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Branch Filter Dropdown */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Branches</option>
              <option value="Main Store">Main Store</option>
              <option value="Branch 1">Branch 1 (Downtown)</option>
              <option value="Branch 2">Branch 2 (North Plaza)</option>
            </select>

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Therapeutic Classes</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Reset Filters */}
            {(searchQuery || selectedBranch !== "all" || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBranch("all");
                  setSelectedCategory("all");
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Catalog & Multi-Branch Inventory Table */}
        {activeTab === "inventory" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Medication & Scientific Salt</th>
                  <th className="py-3 px-3">Therapeutic Class</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3 text-center">Main Store</th>
                  <th className="py-3 px-3 text-center">Branch 1 (Downtown)</th>
                  <th className="py-3 px-3 text-center">Branch 2 (North)</th>
                  <th className="py-3 px-3">Generic Substitutes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => {
                  const mainQty = prod.batches.find((b) => b.store === "Main Store")?.amount || 0;
                  const b1Qty = prod.batches.find((b) => b.store === "Branch 1 (Downtown)")?.amount || 0;
                  const b2Qty = prod.batches.find((b) => b.store === "Branch 2 (North Plaza)")?.amount || 0;

                  return (
                    <tr key={prod.productId} className="hover:bg-slate-800/40 transition">
                      {/* Name & Formula */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs sm:text-sm">{prod.nameEn}</div>
                        <div className="text-[11px] text-slate-400">{prod.nameAr}</div>
                        <div className="text-[10px] font-mono text-indigo-400 mt-0.5">{prod.scientificName}</div>
                      </td>

                      {/* Therapeutic Class */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                          {prod.therapeuticClass.split("(")[0].trim()}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        ${prod.sellPrice.toFixed(2)}
                      </td>

                      {/* Main Store Stock */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                            mainQty > 0
                              ? "bg-slate-950 text-white border border-slate-800"
                              : "bg-rose-950/40 text-rose-400 border border-rose-900"
                          }`}
                        >
                          {mainQty}
                        </span>
                      </td>

                      {/* Branch 1 Stock */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                            b1Qty > 0
                              ? "bg-slate-950 text-white border border-slate-800"
                              : "bg-rose-950/40 text-rose-400 border border-rose-900"
                          }`}
                        >
                          {b1Qty}
                        </span>
                      </td>

                      {/* Branch 2 Stock */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                            b2Qty > 0
                              ? "bg-slate-950 text-white border border-slate-800"
                              : "bg-rose-950/40 text-rose-400 border border-rose-900"
                          }`}
                        >
                          {b2Qty}
                        </span>
                      </td>

                      {/* Generic Substitutes */}
                      <td className="py-3.5 px-3">
                        {prod.substitutes.length > 0 ? (
                          <div className="space-y-1">
                            {prod.substitutes.slice(0, 1).map((sub, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  onOpenCounselor(
                                    `Compare ${prod.nameEn} with generic substitute ${sub.name}. Check branch stock and calculate customer savings.`
                                  )
                                }
                                className="text-[11px] text-indigo-300 hover:text-indigo-200 flex items-center space-x-1"
                              >
                                <span className="underline decoration-dotted">{sub.name}</span>
                                <span className="font-mono text-emerald-400 font-bold">
                                  (-{sub.savingsPercent}%)
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Sole source</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setInspectedProduct(prod)}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition inline-flex items-center"
                          title="View clinical monograph & batch data"
                        >
                          <Info className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() =>
                            setTransferModal({
                              isOpen: true,
                              product: prod,
                              fromStore: mainQty > 0 ? "Main Store" : "Branch 1 (Downtown)",
                              toStore: b2Qty === 0 ? "Branch 2 (North Plaza)" : "Branch 1 (Downtown)",
                              quantity: 10,
                            })
                          }
                          className="px-2.5 py-1 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-xs font-medium border border-indigo-800 transition inline-flex items-center"
                          title="Initiate cross-branch transfer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                          <span>Transfer</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: FEFO Expiry Management Center */}
        {activeTab === "fefo" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/60 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 space-y-1">
                <p className="font-bold">FEFO (First-Expired First-Out) Regulatory Rule Active</p>
                <p className="text-amber-300/80">
                  Medications must be dispensed according to batch expiration date rather than arrival date. Batches
                  within 6 months of expiration are prioritized or offered for inter-branch transfer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .flatMap((p) =>
                  p.batches.map((b) => ({
                    product: p,
                    batch: b,
                  }))
                )
                .sort((a, b) => new Date(a.batch.expDate).getTime() - new Date(b.batch.expDate).getTime())
                .map((item, idx) => {
                  const isSoon = new Date(item.batch.expDate) < new Date("2026-12-31");
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.product.nameEn}</h4>
                          <p className="text-[10px] text-slate-400">{item.batch.store}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isSoon
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          }`}
                        >
                          Exp: {item.batch.expDate}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-500 text-[9px] block">Batch ID</span>
                          <span className="text-indigo-300 font-bold">{item.batch.batchId}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-500 text-[9px] block">Stock Qty</span>
                          <span className="text-white font-bold">{item.batch.amount} boxes</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                        <span className="text-slate-500">Retail: ${item.batch.sellPrice.toFixed(2)}</span>
                        <button
                          onClick={() =>
                            onOpenCounselor(
                              `Check FEFO status for batch ${item.batch.batchId} of ${item.product.nameEn} expiring ${item.batch.expDate}. Should we discount or transfer?`
                            )
                          }
                          className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Ask AI Advisor →
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 3: Branch Transfer Requests & Audit Log */}
        {activeTab === "transfers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Cross-Branch Transfer Orders</h3>
              <button
                onClick={() =>
                  setTransferModal({
                    isOpen: true,
                    product: products[0],
                    fromStore: "Main Store",
                    toStore: "Branch 2 (North Plaza)",
                    quantity: 15,
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition inline-flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New Branch Transfer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Medication</th>
                    <th className="py-2.5 px-3">From Branch</th>
                    <th className="py-2.5 px-3">Destination Branch</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {transferLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 text-indigo-400 font-bold">{log.id}</td>
                      <td className="py-3 px-3 font-sans font-semibold text-white">{log.productName}</td>
                      <td className="py-3 px-3 text-slate-400">{log.from}</td>
                      <td className="py-3 px-3 text-emerald-400">{log.to}</td>
                      <td className="py-3 px-3 font-bold text-white">{log.qty} boxes</td>
                      <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                            log.status === "Completed"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cross-Branch Stock Transfer Modal */}
      {transferModal.isOpen && transferModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Create Branch Stock Transfer</h3>
                  <p className="text-[10px] text-slate-400">Rebalance multi-branch pharmacy inventory</p>
                </div>
              </div>
              <button
                onClick={() => setTransferModal({ ...transferModal, isOpen: false })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="text-xs font-bold text-white">{transferModal.product.nameEn}</p>
              <p className="text-[10px] text-indigo-400 font-mono">{transferModal.product.scientificName}</p>
              <p className="text-[10px] text-slate-500">Retail Unit Price: ${transferModal.product.sellPrice.toFixed(2)}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Source Store (Dispatched From):</label>
                <select
                  value={transferModal.fromStore}
                  onChange={(e) => setTransferModal({ ...transferModal, fromStore: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Main Store">Main Store (Central)</option>
                  <option value="Branch 1 (Downtown)">Branch 1 (Downtown)</option>
                  <option value="Branch 2 (North Plaza)">Branch 2 (North Plaza)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Destination Store (Receiving):</label>
                <select
                  value={transferModal.toStore}
                  onChange={(e) => setTransferModal({ ...transferModal, toStore: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Branch 2 (North Plaza)">Branch 2 (North Plaza)</option>
                  <option value="Branch 1 (Downtown)">Branch 1 (Downtown)</option>
                  <option value="Main Store">Main Store (Central)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Transfer Quantity (Boxes):</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={transferModal.quantity}
                  onChange={(e) =>
                    setTransferModal({ ...transferModal, quantity: parseInt(e.target.value) || 1 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setTransferModal({ ...transferModal, isOpen: false })}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeTransfer}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Monograph & Batch Inspection Drawer / Modal */}
      {inspectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                  {inspectedProduct.therapeuticClass}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{inspectedProduct.nameEn}</h3>
                <p className="text-xs text-slate-400">{inspectedProduct.nameAr}</p>
                <p className="text-xs font-mono text-indigo-400 mt-0.5">{inspectedProduct.scientificName}</p>
              </div>
              <button onClick={() => setInspectedProduct(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {/* Pricing and Branch Stock Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Retail Price</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${inspectedProduct.sellPrice.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Pharmacy Buy Cost</span>
                <span className="text-base font-bold text-slate-300 font-mono">
                  ${inspectedProduct.buyPrice.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Requires Prescription</span>
                <span className="text-base font-bold text-indigo-400">
                  {inspectedProduct.requiresPrescription ? "Yes (Rx Only)" : "OTC"}
                </span>
              </div>
            </div>

            {/* Patient Counseling Monograph */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Clinical Pharmacist Counseling Guide</span>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Primary Indications:</p>
                <p className="text-slate-200 mt-0.5">{inspectedProduct.counseling.indications}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Dosage & Administration:</p>
                <p className="text-slate-200 mt-0.5">{inspectedProduct.counseling.dosageInstructions}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Food & Meal Timing (Crucial):</p>
                <p className="text-amber-300 mt-0.5">{inspectedProduct.counseling.foodTiming}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold text-[11px]">Critical Warnings:</p>
                <ul className="list-disc list-inside text-rose-300 mt-0.5 space-y-0.5">
                  {inspectedProduct.counseling.criticalWarnings.map((w, wIdx) => (
                    <li key={wIdx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA to consult Gemini */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectedProduct(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const prod = inspectedProduct;
                  setInspectedProduct(null);
                  onOpenCounselor(
                    `Provide detailed clinical consultation for ${prod.nameEn} (${prod.scientificName}). Check in-stock generic substitutes and branch stock across all 3 stores.`
                  );
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Ask Clinical AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
