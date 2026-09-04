/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { CloudTierBadge } from "./components/CloudTierBadge";
import { SchemaEditor } from "./components/SchemaEditor";
import { AntiPatternCard } from "./components/AntiPatternCard";
import { ModernOutputViewer } from "./components/ModernOutputViewer";
import { AiArchitectPanel } from "./components/AiArchitectPanel";
import { ProjectsDrawer } from "./components/ProjectsDrawer";
import { FirebaseConfigModal } from "./components/FirebaseConfigModal";
import { PrescriptionCounselingChat } from "./components/PrescriptionCounselingChat";
import { PharmacyDashboard } from "./components/PharmacyDashboard";
import { PHARMACY_SQL_2008 } from "./lib/sampleSchemas";
import {
  parseSql2008Schema,
  generateFirestoreSchema,
  generatePostgresSchema,
  generatePrismaSchema,
  generateDrizzleSchema,
  generateMigrationScript,
  generateVerificationQueries,
} from "./lib/parser";
import {
  subscribeToAuthState,
  loginWithGoogle,
  logOutUser,
  fetchProjects,
  saveProject,
  deleteProject,
} from "./lib/firebase";
import { TargetArchitecture, MigrationProject, UserProfile } from "./types";
import { AlertCircle, CheckCircle2, Layers, Lightbulb, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "counselor" | "modernizer">("dashboard");
  const [counselorInitialQuery, setCounselorInitialQuery] = useState<string | undefined>(undefined);
  const [sqlText, setSqlText] = useState<string>(PHARMACY_SQL_2008);
  const [targetPlatform, setTargetPlatform] = useState<TargetArchitecture>("firestore");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<MigrationProject[]>([]);
  const [isProjectsDrawerOpen, setIsProjectsDrawerOpen] = useState(false);
  const [isFirebaseConfigModalOpen, setIsFirebaseConfigModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch saved projects
  const loadProjects = async () => {
    try {
      const data = await fetchProjects(user?.uid);
      setProjects(data);
    } catch (e) {
      console.warn("Could not fetch projects:", e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live parsing of SQL Server 2008 schema
  const analysis = useMemo(() => {
    return parseSql2008Schema(sqlText);
  }, [sqlText]);

  // Code generation for target
  const schemaCode = useMemo(() => {
    switch (targetPlatform) {
      case "firestore":
        return generateFirestoreSchema(analysis);
      case "postgres":
        return generatePostgresSchema(analysis);
      case "prisma":
        return generatePrismaSchema(analysis);
      case "drizzle":
        return generateDrizzleSchema(analysis);
    }
  }, [analysis, targetPlatform]);

  const migrationScript = useMemo(() => {
    return generateMigrationScript(analysis, targetPlatform);
  }, [analysis, targetPlatform]);

  const verificationSql = useMemo(() => {
    return generateVerificationQueries(analysis);
  }, [analysis]);

  // Auth handlers
  const handleLogin = async () => {
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
      showToast(`Welcome, ${loggedUser.displayName || "Architect"}!`);
    } catch (err: any) {
      showToast("Authentication failed: " + (err.message || "Unknown error"));
    }
  };

  const handleLogout = async () => {
    await logOutUser();
    setUser(null);
    showToast("Signed out successfully.");
  };

  // Project persistence handlers
  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      const firstTable = analysis.tables[0]?.name || "Database";
      const title = `${firstTable} Modernization (${targetPlatform.toUpperCase()})`;
      const newProj = await saveProject(
        {
          title,
          originalSql: sqlText,
          targetPlatform,
          targetOutput: schemaCode,
          migrationScript,
          verificationQueries: verificationSql,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: user?.uid,
        },
        user?.uid
      );
      setProjects((prev) => [newProj, ...prev]);
      showToast("Project saved to Cloud Firestore successfully!");
    } catch (err: any) {
      showToast("Failed to save project: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectProject = (p: MigrationProject) => {
    setSqlText(p.originalSql);
    setTargetPlatform(p.targetPlatform);
    showToast(`Loaded "${p.title}"`);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Project deleted.");
    } catch (err: any) {
      showToast("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-indigo-900 selection:text-white antialiased">
      {/* Navigation */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenProjects={() => setIsProjectsDrawerOpen(true)}
        onOpenConfig={() => setIsFirebaseConfigModalOpen(true)}
        savedCount={projects.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === "dashboard" ? (
          <PharmacyDashboard
            onOpenCounselor={(query) => {
              if (query) setCounselorInitialQuery(query);
              setActiveTab("counselor");
            }}
            onOpenModernizer={() => setActiveTab("modernizer")}
            showToast={showToast}
          />
        ) : activeTab === "counselor" ? (
          <PrescriptionCounselingChat
            initialQuery={counselorInitialQuery}
            onClearInitialQuery={() => setCounselorInitialQuery(undefined)}
          />
        ) : (
          <>
            {/* Cloud Free Tier Banner & Readiness Score */}
            <CloudTierBadge score={analysis.cloudFreeTierScore} />

        {/* AI Architect Advisory Banner */}
        <AiArchitectPanel
          sqlText={sqlText}
          targetPlatform={targetPlatform}
        />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Legacy SQL 2008 Ingestion & Anti-Pattern Analysis */}
          <div className="space-y-6">
            <SchemaEditor
              sqlText={sqlText}
              setSqlText={setSqlText}
              analysis={analysis}
              onReset={(val) => {
                setSqlText(val);
                showToast("Sample schema loaded.");
              }}
            />

            {/* Anti-Pattern Audit Findings List (Bento Box) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Legacy 2008 Deprecations & Anti-Patterns
                    </h3>
                    <p className="text-xs text-slate-400">
                      {analysis.antiPatterns.length === 0
                        ? "No critical legacy deprecations found in this DDL."
                        : `Identified ${analysis.antiPatterns.length} schema hazards needing cloud remediation.`}
                    </p>
                  </div>
                </div>
              </div>

              {analysis.antiPatterns.length > 0 ? (
                <div className="space-y-3">
                  {analysis.antiPatterns.map((finding) => (
                    <AntiPatternCard key={finding.id} finding={finding} />
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clean schema! Ready for immediate deployment to modern cloud architectures.</span>
                </div>
              )}

              {/* Modern Architecture Recommendations */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center">
                  <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Cloud Modernization Best Practices
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Cloud Target & Migration Outputs */}
          <div className="space-y-6">
            <ModernOutputViewer
              target={targetPlatform}
              setTarget={(t) => {
                setTargetPlatform(t);
                showToast(`Target switched to ${t.toUpperCase()}`);
              }}
              schemaCode={schemaCode}
              migrationScript={migrationScript}
              verificationSql={verificationSql}
              onSaveProject={handleSaveProject}
              isSaving={isSaving}
            />

            {/* Architecture Comparison Guide (Bento Box) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm text-xs text-slate-400 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Architecture Comparison & ROI
                </h4>
                <span className="text-[10px] uppercase font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded-full">
                  Zero License Fee
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-rose-950/30 border border-rose-900/60 rounded-2xl">
                  <p className="font-bold text-rose-300 text-xs">Old SQL Server 2008 Bottlenecks</p>
                  <ul className="mt-2 space-y-1.5 text-[11px] text-rose-400/90 list-disc list-inside">
                    <li>End of Life (No security patches)</li>
                    <li>Expensive hardware & Windows CALs</li>
                    <li>IMAGE and TEXT binary table bloat</li>
                    <li>Monolithic clustered index lock contention</li>
                  </ul>
                </div>
                <div className="p-4 bg-emerald-950/30 border border-emerald-900/60 rounded-2xl">
                  <p className="font-bold text-emerald-300 text-xs">Modern Cloud Architecture</p>
                  <ul className="mt-2 space-y-1.5 text-[11px] text-emerald-400/90 list-disc list-inside">
                    <li>100% Free Tiers (Firestore / Neon Postgres)</li>
                    <li>Automated cloud backups & multi-region failover</li>
                    <li>Decoupled binary blobs (Cloud Storage CDN)</li>
                    <li>Distributed UUIDv4 keys & auto-scaling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </main>

      {/* Saved Projects Drawer */}
      <ProjectsDrawer
        isOpen={isProjectsDrawerOpen}
        onClose={() => setIsProjectsDrawerOpen(false)}
        projects={projects}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Firebase Configuration Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseConfigModalOpen}
        onClose={() => setIsFirebaseConfigModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-medium shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
