import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Flame,
  Database,
  Code2,
  FileCode,
  CheckCircle,
  Save,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { TargetArchitecture } from "../types";

interface ModernOutputViewerProps {
  target: TargetArchitecture;
  setTarget: (target: TargetArchitecture) => void;
  schemaCode: string;
  migrationScript: string;
  verificationSql: string;
  onSaveProject: () => void;
  isSaving: boolean;
}

export const ModernOutputViewer: React.FC<ModernOutputViewerProps> = ({
  target,
  setTarget,
  schemaCode,
  migrationScript,
  verificationSql,
  onSaveProject,
  isSaving,
}) => {
  const [activeTab, setActiveTab] = useState<"schema" | "etl" | "verify">("schema");
  const [copied, setCopied] = useState(false);

  const getCodeContent = () => {
    switch (activeTab) {
      case "etl":
        return migrationScript;
      case "verify":
        return verificationSql;
      case "schema":
      default:
        return schemaCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getCodeContent();
    let filename = `modernized_${target}_schema.sql`;
    let mime = "text/plain";

    if (activeTab === "etl") {
      filename = `migrate_${target}.js`;
      mime = "application/javascript";
    } else if (activeTab === "verify") {
      filename = `verify_parity.sql`;
      mime = "text/plain";
    } else if (target === "firestore") {
      filename = `firestore_model_and_rules.json`;
      mime = "application/json";
    } else if (target === "prisma") {
      filename = `schema.prisma`;
    } else if (target === "drizzle") {
      filename = `schema.ts`;
    }

    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      {/* Target Architecture Selector */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Target Cloud Architecture
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            Free-Tier Ready
          </span>
        </div>

        {/* 4 Architecture Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            id="target-firestore"
            onClick={() => setTarget("firestore")}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              target === "firestore"
                ? "bg-indigo-600/20 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Cloud Firestore</span>
          </button>

          <button
            id="target-postgres"
            onClick={() => setTarget("postgres")}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              target === "postgres"
                ? "bg-indigo-600/20 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">Cloud Postgres</span>
          </button>

          <button
            id="target-prisma"
            onClick={() => setTarget("prisma")}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              target === "prisma"
                ? "bg-indigo-600/20 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">Prisma ORM</span>
          </button>

          <button
            id="target-drizzle"
            onClick={() => setTarget("drizzle")}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              target === "drizzle"
                ? "bg-indigo-600/20 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Drizzle ORM</span>
          </button>
        </div>
      </div>

      {/* Code Sub-tabs */}
      <div className="px-4 pt-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex space-x-1">
          <button
            id="tab-schema"
            onClick={() => setActiveTab("schema")}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition ${
              activeTab === "schema"
                ? "bg-slate-900 text-white border-t border-x border-slate-800 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Modern Schema & Rules
          </button>
          <button
            id="tab-etl"
            onClick={() => setActiveTab("etl")}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === "etl"
                ? "bg-slate-900 text-white border-t border-x border-slate-800 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3 h-3 text-slate-500" />
            <span>ETL Streaming Script</span>
          </button>
          <button
            id="tab-verify"
            onClick={() => setActiveTab("verify")}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === "verify"
                ? "bg-slate-900 text-white border-t border-x border-slate-800 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            <span>Validation & Parity</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 pb-1.5">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800 transition"
            title="Copy Code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            id="btn-download-code"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800 transition"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-save-project-trigger"
            onClick={onSaveProject}
            disabled={isSaving}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm disabled:opacity-50"
            title="Save to Cloud Firestore"
          >
            <Save className="w-3 h-3 mr-1" />
            {isSaving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative flex-1 min-h-[350px] sm:min-h-[480px] bg-slate-950 overflow-auto">
        <pre className="p-4 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre selection:bg-indigo-900 selection:text-white">
          <code>{getCodeContent()}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Zero 2008 legacy types • Serverless Ready</span>
        </span>
        <span className="text-[11px] text-slate-500">
          Target: {target.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
