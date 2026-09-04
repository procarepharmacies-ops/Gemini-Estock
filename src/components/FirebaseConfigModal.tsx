import React, { useState } from "react";
import { X, Flame, ShieldCheck, Check, Key, HelpCircle, RefreshCw } from "lucide-react";
import { activeFirebaseConfig, isFirebaseConfigured, saveCustomFirebaseConfig } from "../lib/firebase";

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState(activeFirebaseConfig?.apiKey || "");
  const [projectId, setProjectId] = useState(activeFirebaseConfig?.projectId || "");
  const [authDomain, setAuthDomain] = useState(activeFirebaseConfig?.authDomain || "");
  const [storageBucket, setStorageBucket] = useState(activeFirebaseConfig?.storageBucket || "");
  const [appId, setAppId] = useState(activeFirebaseConfig?.appId || "");

  if (!isOpen) return null;

  const handleSave = () => {
    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim(),
      storageBucket: storageBucket.trim(),
      appId: appId.trim(),
    });
  };

  const handleResetToDemo = () => {
    localStorage.removeItem("firebase_custom_config");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Firebase Cloud Persistence</h3>
              <p className="text-xs text-amber-400/90 font-mono">Google Auth & Firestore Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-xs text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-200">
                Status: {isFirebaseConfigured ? "Live Firebase Connected" : "Interactive Demo & Local Cloud Sync Active"}
              </p>
              <p className="text-[11px] text-emerald-400/90 mt-0.5 leading-relaxed">
                Full schema modernization and persistence are active. You can optionally link your own Firebase project credentials to sync directly with Google Cloud Firestore.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-400 mb-1">
                Firebase Web API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-db-modernizer"
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="my-db-modernizer.firebaseapp.com"
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="my-db-modernizer.appspot.com"
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789:web:abcdef"
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-1 text-slate-500 text-[11px] leading-relaxed font-mono">
            Firebase free tier includes 50,000 document reads/day, 20,000 writes/day, and 1GB storage—ideal for migrating legacy databases with zero cloud costs.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetToDemo}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center transition"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reset to Default
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 text-xs font-medium hover:bg-slate-800 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              id="btn-save-firebase-config"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition shadow-sm"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
