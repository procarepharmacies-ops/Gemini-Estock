import React, { useState } from "react";
import { Sparkles, Send, Loader2, Bot, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { TargetArchitecture } from "../types";

interface AiArchitectPanelProps {
  sqlText: string;
  targetPlatform: TargetArchitecture;
}

export const AiArchitectPanel: React.FC<AiArchitectPanelProps> = ({
  sqlText,
  targetPlatform,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("gemini-3.8-flash");
  const [error, setError] = useState<string | null>(null);

  const handleRunAiAnalysis = async (customQuestion?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/modernize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaSql: sqlText,
          targetPlatform,
          customizationPrompt: customQuestion || customPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        let msg = data.error || "Failed to analyze schema with AI";
        if (msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")) {
          msg = "The AI service is experiencing high demand. Please retry in a few seconds.";
        }
        throw new Error(msg);
      }
      setAiAnalysis(data.analysis);
      if (data.modelUsed) {
        setModelUsed(data.modelUsed);
      }
      setIsOpen(true);
    } catch (err: any) {
      let rawMsg = err.message || "An error occurred calling Gemini AI Architect";
      if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
        rawMsg = "Gemini model is currently experiencing a temporary demand spike. Please retry shortly.";
      }
      setError(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Gemini Cloud Database Architect
              </h3>
              <span className="text-[10px] uppercase font-mono font-semibold bg-indigo-900/40 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full">
                AI Advisory
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Refactoring analysis for stored procedures, binary decoupling, and free-tier cloud limits.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-trigger-ai-audit"
            onClick={() => handleRunAiAnalysis()}
            disabled={loading || !sqlText.trim()}
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Analyzing Schema...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-200" />
                Run AI Modernization Audit
              </>
            )}
          </button>
          {aiAnalysis && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition"
              title={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-slate-800/80 text-xs">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mr-1">Inquiries:</span>
        <button
          onClick={() => {
            const q = "How do we decouple high-volume legacy IMAGE photos into Cloud Storage & Firestore safely?";
            setCustomPrompt(q);
            handleRunAiAnalysis(q);
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-800 transition text-[11px]"
        >
          📷 Migrate IMAGE to Cloud Storage
        </button>
        <button
          onClick={() => {
            const q = "Optimize this schema to stay 100% within Firebase Firestore free-tier limits (50k reads/day).";
            setCustomPrompt(q);
            handleRunAiAnalysis(q);
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-800 transition text-[11px]"
        >
          ⚡ Firestore Free-Tier Cost Optimization
        </button>
        <button
          onClick={() => {
            const q = "How to replace SQL Server 2008 clustered index and IDENTITY locks with distributed cloud indexing?";
            setCustomPrompt(q);
            handleRunAiAnalysis(q);
          }}
          className="px-2.5 py-1 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-800 transition text-[11px]"
        >
          🔑 Distributed UUIDs vs Clustered Index
        </button>
        <button
          onClick={() => {
            const q = "Review the eStock database report (8 modules, 53k products, 8 broken views, NULL bill_dates, expired batches). Provide an actionable cloud modernization and remediation roadmap.";
            setCustomPrompt(q);
            handleRunAiAnalysis(q);
          }}
          className="px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800 text-indigo-300 hover:text-indigo-200 hover:border-indigo-700 transition text-[11px]"
        >
          💊 eStock Audit & Remediation
        </button>
      </div>

      {/* Custom Prompt Input */}
      <div className="mt-3 flex gap-2">
        <input
          id="ai-prompt-input"
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ask Gemini Architect about custom schema constraints, indexing, or migration hurdles..."
          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleRunAiAnalysis();
            }
          }}
        />
        <button
          id="btn-send-ai-prompt"
          onClick={() => handleRunAiAnalysis()}
          disabled={loading || !customPrompt.trim()}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold flex items-center transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <span className="font-semibold">AI Assistant Notice: </span>
              {error}
            </div>
          </div>
          <button
            onClick={() => handleRunAiAnalysis()}
            disabled={loading}
            className="ml-3 px-3 py-1 bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 text-xs font-medium rounded-lg transition shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* AI Analysis Result Output */}
      {isOpen && aiAnalysis && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner max-h-[420px] overflow-auto">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center">
              <Bot className="w-4 h-4 mr-1.5 text-indigo-400" />
              Gemini Architecture Report
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
              {modelUsed === "architect-engine-fallback" ? "Resilient Architect Engine" : modelUsed}
            </span>
          </div>
          <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-xs">
            {aiAnalysis}
          </div>
        </div>
      )}
    </div>
  );
};
