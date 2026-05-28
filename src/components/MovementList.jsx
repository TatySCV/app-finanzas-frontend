import EmptyState from "./ui/EmptyState";
import { Pencil, Trash2 } from "lucide-react";

function MovementList({ movements, type, onEdit, onDelete }) {
  if (movements.length === 0) {
    const message = type === "income" 
      ? "No hay ingresos registrados." 
      : "No hay gastos registrados.";
    const icon = type === "income" ? "💰" : "📉";
    return <EmptyState message={message} icon={icon} />;
  }

  const amountColor = type === "income" 
    ? "text-emerald-600 dark:text-emerald-400" 
    : "text-red-500 dark:text-red-400";

  return (
    <div className="space-y-4">
      {movements.map((movement) => (
        <div key={movement.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow flex justify-between items-center">
          <div className="flex-1">
            <p className="font-bold text-slate-800 dark:text-slate-100">{movement.reason}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {movement.category} {movement.type && `· ${movement.type}`}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{movement.date}</p>
          </div>
          <div className="text-right flex items-center gap-3">
            <p className={`font-bold ${amountColor}`}>${movement.amount}</p>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(movement)}
                className="p-1 text-slate-400 hover:text-blue-500 transition"
                title="Editar"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(movement.id)}
                className="p-1 text-slate-400 hover:text-red-500 transition"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovementList;