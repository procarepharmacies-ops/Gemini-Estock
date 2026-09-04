import React from "react";
import { X, Trash2, FolderArchive, ArrowRight, Calendar, Flame, Database, Code2 } from "lucide-react";
import { MigrationProject } from "../types";

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: MigrationProject[];
  onSelectProject: (p: MigrationProject) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Saved Cloud Projects</h3>
              <p className="text-[11px] text-slate-500 font-mono">Persisted in Firestore & Local Cloud Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">No Saved Migrations Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Modernize any SQL Server 2008 schema and click "Save Project" to store your architecture specifications.
              </p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-indigo-600/60 transition group relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-white group-hover:text-indigo-400 transition">
                        {proj.title}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-950/60 border border-indigo-800 text-indigo-400">
                        {proj.targetPlatform}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-500 font-mono">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-500 flex justify-between items-center font-mono">
          <span>{projects.length} Saved {projects.length === 1 ? "project" : "projects"}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-medium hover:bg-slate-800 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
