import React, { useRef } from "react";
import { Upload, FileCode, Check, RefreshCw, Layers, FileText } from "lucide-react";
import { PHARMACY_SQL_2008, ECOMMERCE_SQL_2008, ESTOCK_PHARMACY_SQL_2008 } from "../lib/sampleSchemas";
import { SchemaAnalysis } from "../types";

interface SchemaEditorProps {
  sqlText: string;
  setSqlText: (val: string) => void;
  analysis: SchemaAnalysis;
  onReset: (val: string) => void;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({
  sqlText,
  setSqlText,
  analysis,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSqlText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
            Source: Legacy SQL Server 2008 DDL
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/80 text-indigo-400 font-mono">
            {analysis.totalTables} {analysis.totalTables === 1 ? "table" : "tables"}
          </span>
        </div>

        {/* Presets and Upload */}
        <div className="flex items-center space-x-1.5">
          <button
            id="preset-estock"
            onClick={() => onReset(ESTOCK_PHARMACY_SQL_2008)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-950/70 border border-indigo-700 text-indigo-300 hover:bg-indigo-900 hover:text-white transition flex items-center"
            title="Load eStock Pharmacy (8 Modules, 53k Products, 95k Sales)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5"></span>
            eStock Schema
          </button>
          <button
            id="preset-pharmacy"
            onClick={() => onReset(PHARMACY_SQL_2008)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            title="Load Pharmacy & Healthcare SQL 2008 Schema"
          >
            Pharmacy Sample
          </button>
          <button
            id="preset-ecommerce"
            onClick={() => onReset(ECOMMERCE_SQL_2008)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            title="Load Retail & Orders SQL 2008 Schema"
          >
            Retail Sample
          </button>
          <button
            id="btn-upload-sql"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center"
            title="Upload .sql file"
          >
            <Upload className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Upload .sql
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".sql,.txt"
            className="hidden"
          />
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[350px] sm:min-h-[480px]">
        <textarea
          id="legacy-sql-input"
          value={sqlText}
          onChange={(e) => setSqlText(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 font-mono text-xs leading-relaxed text-slate-200 bg-slate-950 resize-none focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition"
          placeholder="Paste your legacy SQL Server 2008 DDL here (CREATE TABLE ...)..."
        />
      </div>

      {/* Footer Details */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-3">
          <span>{analysis.totalColumns} Total Columns</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-medium">
            {analysis.antiPatterns.length} 2008 Deprecations
          </span>
        </div>
        <button
          id="btn-format-clear"
          onClick={() => setSqlText("")}
          className="text-slate-500 hover:text-slate-300 transition text-[11px]"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
