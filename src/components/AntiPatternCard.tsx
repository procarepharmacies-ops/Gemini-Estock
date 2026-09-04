import React from "react";
import { AlertTriangle, AlertCircle, Info, ArrowRight, CheckCircle2 } from "lucide-react";
import { AntiPatternFinding } from "../types";

interface AntiPatternCardProps {
  finding: AntiPatternFinding;
}

export const AntiPatternCard: React.FC<AntiPatternCardProps> = ({ finding }) => {
  const getSeverityBadge = () => {
    switch (finding.severity) {
      case "critical":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          bg: "bg-rose-950/40 border-rose-800/80 text-rose-400",
          tag: "Critical Deprecation",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          bg: "bg-amber-950/40 border-amber-800/80 text-amber-400",
          tag: "Precision / Locking Hazard",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
          bg: "bg-indigo-950/40 border-indigo-800/80 text-indigo-400",
          tag: "Scale Bottleneck",
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div
      id={`card-${finding.id}`}
      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition shadow-xs"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          {badge.icon}
          <h4 className="text-sm font-bold text-white tracking-tight">{finding.title}</h4>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${badge.bg}`}>
          {badge.tag}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-3">
        {finding.description}
      </p>

      <div className="border border-slate-800 flex items-start space-x-2.5 bg-slate-900/90 p-3 rounded-xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-semibold text-slate-200">Modern Cloud Remedy: </span>
          <span className="text-slate-300">{finding.remedy}</span>
        </div>
      </div>
    </div>
  );
};
