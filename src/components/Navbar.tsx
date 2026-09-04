import React from "react";
import { Database, Cloud, Flame, LogIn, LogOut, User, FolderArchive, Settings, ShieldCheck, Sparkles, Pill, LayoutDashboard } from "lucide-react";
import { UserProfile } from "../types";
import { isFirebaseConfigured } from "../lib/firebase";

interface NavbarProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenProjects: () => void;
  onOpenConfig: () => void;
  savedCount: number;
  activeTab: "dashboard" | "counselor" | "modernizer";
  setActiveTab: (tab: "dashboard" | "counselor" | "modernizer") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogin,
  onLogout,
  onOpenProjects,
  onOpenConfig,
  savedCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header id="main-header" className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-md shadow-indigo-600/30">
            {activeTab === "dashboard" ? (
              <LayoutDashboard className="w-5 h-5" />
            ) : activeTab === "counselor" ? (
              <Pill className="w-5 h-5" />
            ) : (
              <Database className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
                ProCare Pharmacy AI
              </h1>
              <span className="text-indigo-400 font-mono text-xs hidden sm:inline">eStock System</span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block mt-0.5">
              Multi-Branch Operations • Prescription AI • Cloud Migration
            </p>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="tab-counselor"
            onClick={() => setActiveTab("counselor")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === "counselor"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prescription &</span>
            <span>AI Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
          </button>

          <button
            id="tab-modernizer"
            onClick={() => setActiveTab("modernizer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === "modernizer"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Database</span>
            <span>Modernizer</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Cloud Projects Button */}
          <button
            id="btn-saved-projects"
            onClick={onOpenProjects}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
            title="View saved cloud migration projects"
          >
            <FolderArchive className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span className="hidden md:inline">Saved Projects</span>
            {savedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-900/60 border border-indigo-700 text-indigo-300 font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Firebase Settings button */}
          <button
            id="btn-firebase-settings"
            onClick={onOpenConfig}
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isFirebaseConfigured
                ? "bg-amber-950/30 text-amber-300 border-amber-800/80 hover:bg-amber-900/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            }`}
            title="Firebase Project Configuration"
          >
            <Flame className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span className="hidden sm:inline">
              {isFirebaseConfigured ? "Firebase Connected" : "Firebase Setup"}
            </span>
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User avatar"}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-700 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-slate-200 leading-tight">
                  {user.displayName || "Architect"}
                </p>
                <p className="text-slate-500 text-[11px] truncate max-w-[130px]">
                  {user.email || (user.isAnonymous ? "Guest Mode" : "User")}
                </p>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-login-google"
              onClick={onLogin}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
