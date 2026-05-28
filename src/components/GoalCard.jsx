import { Target, Trash2, DollarSign } from "lucide-react";

function GoalCard({ goal, unallocated, onAllocate, onDelete }) {
  // Valores por defecto si faltan propiedades
  const allocated = goal.allocated ?? 0;
  const target = goal.target ?? 1; // evitar división por cero
  const percentage = (allocated / target) * 100;
  const isCompleted = percentage >= 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Target size={20} className="text-blue-600 dark:text-blue-400" /> {goal.name || "Sin nombre"}
          </h3>
          {goal.deadline && (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              📅 {new Date(goal.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
        <button onClick={() => onDelete(goal.id)} className="text-red-500 dark:text-red-400 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-300">
          <span>Asignado</span>
          <span>${allocated.toLocaleString()} / ${target.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-600 dark:bg-blue-500"}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {isCompleted && <p className="text-green-600 dark:text-green-400 text-sm mt-1">¡Meta alcanzada!</p>}
      </div>

      <button
        onClick={() => onAllocate(goal.id)}
        disabled={unallocated <= 0}
        className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl transition ${
          unallocated > 0
            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50"
            : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
        }`}
      >
        <DollarSign size={18} /> Asignar dinero
      </button>
    </div>
  );
}

export default GoalCard;