// src/pages/SavingsPage.jsx
import { useState } from "react";
import { useFinancial } from "../context/FinancialContext";
import { PlusCircle } from "lucide-react";
import toast from 'react-hot-toast';
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import GoalCard from "../components/GoalCard";
import FinancialSummary from "../components/FinancialSummary";
import ConfirmDeleteModal from "../components/ui/ConfirmDeleteModal";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function SavingsPage() {
  const {
    savingGoals,
    addSavingGoal,
    allocateToGoal,
    deleteSavingGoal,
    expenseList,
  } = useFinancial();

  // Estados de carga (simulados, útiles para futuras peticiones asíncronas)
  const [isLoading, setIsLoading] = useState(false);

  // Calcular total ahorrado desde gastos tipo "ahorro"
  const totalSavings = expenseList
    .filter(e => e.type?.toLowerCase() === "ahorro")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const totalAllocated = savingGoals.reduce((sum, g) => sum + g.allocated, 0);
  const unallocated = totalSavings - totalAllocated;

  // Estados para modales
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", deadline: "" });
  const [allocateAmount, setAllocateAmount] = useState({});
  const [showAllocateFor, setShowAllocateFor] = useState(null);
  const [deleteGoalId, setDeleteGoalId] = useState(null);

  const goalToDelete = savingGoals.find(g => g.id === deleteGoalId);

  // Handlers
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) {
      toast.error("Completa el nombre y monto objetivo");
      return;
    }
    addSavingGoal({
      name: newGoal.name,
      target: Number(newGoal.target),
      deadline: newGoal.deadline || null,
    });
    setNewGoal({ name: "", target: "", deadline: "" });
    setShowForm(false);
    toast.success("Meta creada correctamente");
  };

  const handleAllocate = (goalId) => {
    const amount = allocateAmount[goalId];
    if (!amount || amount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    if (amount > unallocated) {
      toast.error(`Solo puedes asignar $${unallocated} disponible.`);
      return;
    }
    allocateToGoal(goalId, Number(amount));
    setAllocateAmount(prev => ({ ...prev, [goalId]: "" }));
    setShowAllocateFor(null);
    toast.success(`Asignados $${amount} a la meta`);
  };

  const handleConfirmDelete = () => {
    if (deleteGoalId) {
      deleteSavingGoal(deleteGoalId);
      setDeleteGoalId(null);
      toast.success("Meta eliminada");
    }
  };

  // Mostrar spinner mientras carga (simulación, cambiar cuando haya llamadas reales)
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Metas de ahorro</h1>
          <FinancialSummary
            items={[
              { label: "Total ahorrado", value: totalSavings, icon: "💰", color: "text-slate-600 dark:text-slate-300" },
              { label: "Asignado a metas", value: totalAllocated, icon: "✅", color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Disponible para asignar", value: unallocated, icon: "📌", color: "text-blue-600 dark:text-blue-400" },
            ]}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <PlusCircle size={20} /> Nueva meta
        </button>
      </div>

      {/* Modal para crear nueva meta */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Crear meta de ahorro">
        <form onSubmit={handleAddGoal}>
          <FormInput
            label="Nombre"
            name="name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            required
          />
          <FormInput
            label="Monto objetivo ($)"
            name="target"
            type="number"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
            required
          />
          <FormInput
            label="Fecha límite (opcional)"
            name="deadline"
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 dark:text-slate-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition">Guardar meta</button>
          </div>
        </form>
      </Modal>

      {/* Modal para asignar dinero */}
      <Modal isOpen={showAllocateFor !== null} onClose={() => setShowAllocateFor(null)} title="Asignar ahorro a meta">
        <p className="text-slate-600 dark:text-slate-300 mb-2">Disponible: ${unallocated}</p>
        <FormInput
          label="Monto a asignar ($)"
          name="amount"
          type="number"
          value={allocateAmount[showAllocateFor] || ""}
          onChange={(e) => setAllocateAmount(prev => ({ ...prev, [showAllocateFor]: e.target.value }))}
          placeholder="0.00"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowAllocateFor(null)} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 dark:text-slate-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition">Cancelar</button>
          <button onClick={() => handleAllocate(showAllocateFor)} className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition">Asignar</button>
        </div>
      </Modal>

      {/* Lista de metas con EmptyState integrado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {savingGoals.length === 0 ? (
          <div className="col-span-2">
            <EmptyState
              message="No tienes metas. Crea una y asigna tu ahorro."
              icon="🎯"
              actionText="Crear primera meta"
              onAction={() => setShowForm(true)}
            />
          </div>
        ) : (
          savingGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              unallocated={unallocated}
              onAllocate={(goalId) => setShowAllocateFor(goalId)}
              onDelete={(goalId) => setDeleteGoalId(goalId)}
            />
          ))
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={deleteGoalId !== null}
        onClose={() => setDeleteGoalId(null)}
        onConfirm={handleConfirmDelete}
        itemName={goalToDelete?.name || ""}
        itemType="meta"
      />
    </div>
  );
}

export default SavingsPage;