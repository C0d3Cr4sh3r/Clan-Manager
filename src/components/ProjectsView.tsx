import React, { useState } from 'react';
import { useClan } from '../context/ClanContext';
import { Project, Task } from '../types';
import { Plus, Edit2, Trash2, Calendar, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { TaskCard } from './TaskCard';

interface ProjectsViewProps {
  onOpenTaskModalWithProject: (projectId: string) => void;
  onEditTask: (task: Task) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenTaskModalWithProject,
  onEditTask,
}) => {
  const { projects, activeGameId, games, tasks, deleteProject } = useClan();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const activeGame = games.find(g => g.id === activeGameId) || games[0];
  const gameProjects = projects.filter(p => p.gameId === activeGameId);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Großprojekte & Boss-Raids ({activeGame?.name})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Bündele Ressourcen, Quoten und Ablauf-Phasen für große Bauvorhaben und gemeinsame Events.
          </p>
        </div>

        <button
          onClick={() => {
            setProjectToEdit(null);
            setProjectModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Neues Projekt anlegen</span>
        </button>
      </div>

      {/* Projects List */}
      {gameProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="text-3xl mb-2">🏛️</div>
          <h3 className="text-base font-bold text-white mb-1">
            Noch keine Projekte in {activeGame?.name}
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            Erstelle Großprojekte wie Basenbau, Verteidigungsanlagen oder Boss-Raids, um Aufgaben gebündelt zu steuern.
          </p>
          <button
            onClick={() => {
              setProjectToEdit(null);
              setProjectModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Erstes Projekt starten
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {gameProjects.map(project => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const completedTasks = projectTasks.filter(
              t => t.status === 'completed' || t.currentAmount >= t.targetAmount
            );

            let totalCurrent = 0;
            let totalTarget = 0;
            projectTasks.forEach(t => {
              totalCurrent += t.currentAmount;
              totalTarget += t.targetAmount;
            });

            const projectPercentage =
              totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

            return (
              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
              >
                {/* Project Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800 shadow-inner shrink-0">
                      {project.icon || '🏛️'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white">
                          {project.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            project.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : project.status === 'paused'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {project.status === 'completed'
                            ? 'Abgeschlossen'
                            : project.status === 'paused'
                            ? 'Pausiert'
                            : 'In Arbeit'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        {project.description}
                      </p>
                      {project.targetDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>Zieltermin: {project.targetDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project KPI & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right pr-3 border-r border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Fortschritt</div>
                      <div className="text-xl font-bold font-mono tabular-nums text-white flex items-center justify-end gap-1">
                        <span>{projectPercentage}%</span>
                        {projectPercentage >= 100 && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {completedTasks.length} / {projectTasks.length} Aufgaben
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenTaskModalWithProject(project.id)}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Aufgabe</span>
                      </button>

                      <button
                        onClick={() => {
                          setProjectToEdit(project);
                          setProjectModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Projekt "${project.title}" wirklich löschen?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 my-4 overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      projectPercentage >= 100
                        ? 'bg-emerald-400'
                        : projectPercentage > 50
                        ? 'bg-emerald-500'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${projectPercentage}%` }}
                  />
                </div>

                {/* Sub-Tasks for this Project */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    <span>Zugehörige Aufgaben & Quoten ({projectTasks.length})</span>
                    {projectTasks.length > 0 && (
                      <span className="font-mono text-slate-400 font-normal">
                        {totalCurrent} / {totalTarget} Einheiten
                      </span>
                    )}
                  </div>

                  {projectTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/50">
                      Diesem Projekt wurden noch keine Aufgaben zugewiesen.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projectTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={onEditTask}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />
    </div>
  );
};
