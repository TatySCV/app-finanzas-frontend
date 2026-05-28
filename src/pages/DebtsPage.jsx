import { useState } from "react";
import { useFinancial } from "../context/FinancialContext";
import { PlusCircle } from "lucide-react";
import toast from 'react-hot-toast';
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import CreditDebtCard from "../components/CreditDebtCard";
import FinancialSummary from "../components/FinancialSummary";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDeleteModal from "../components/ui/ConfirmDeleteModal";

function DebtsPage() {
  const { debtList, addDebt, addDebtPayment, deleteDebt } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  const [newDebt, setNewDebt] = useState({ name: "", totalAmount: "", interestRate: "", startDate: "" });
  const [deleteId, setDeleteId] = useState(null);

  const totalDebts = debtList.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPending = debtList.reduce((sum, d) => sum + d.remaining, 0);
  const totalPaid = totalDebts - totalPending;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDebt.name || !newDebt.totalAmount || !newDebt.startDate) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    addDebt(newDebt);
    setNewDebt({ name: "", totalAmount: "", interestRate: "", startDate: "" });
    setShowForm(false);
    toast.success("Deuda registrada correctamente");
  };

  const debtToDelete = debtList.find(d => d.id === deleteId);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Deudas pendientes</h1>
          <FinancialSummary items={[
            { label: "Total deudas", value: totalDebts, icon: "💸", color: "text-slate-600 dark:text-slate-300" },
            { label: "Pagado", value: totalPaid, icon: "✅", color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Pendiente", value: totalPending, icon: "⏳", color: "text-orange-500 dark:text-orange-400" },
          ]} />
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex gap-2 items-center transition">
          <PlusCircle size={20} /> Nueva deuda
        </button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Registrar deuda">
        <form onSubmit={handleAdd}>
          <FormInput label="Nombre / Concepto" value={newDebt.name} onChange={e => setNewDebt({...newDebt, name: e.target.value})} required />
          <FormInput label="Monto total" type="number" value={newDebt.totalAmount} onChange={e => setNewDebt({...newDebt, totalAmount: e.target.value})} required />
          <FormInput label="Tasa de interés (%)" type="number" value={newDebt.interestRate} onChange={e => setNewDebt({...newDebt, interestRate: e.target.value})} />
          <FormInput label="Fecha de inicio" type="date" value={newDebt.startDate} onChange={e => setNewDebt({...newDebt, startDate: e.target.value})} required />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 dark:text-slate-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition">Guardar</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {debtList.length === 0 ? (
          <div className="col-span-2">
            <EmptyState message="No hay deudas registradas." icon="💸" actionText="Agregar deuda" onAction={() => setShowForm(true)} />
          </div>
        ) : (
          debtList.map(debt => (
            <CreditDebtCard key={debt.id} item={debt} type="debt" onAddPayment={addDebtPayment} onDelete={setDeleteId} />
          ))
        )}
      </div>

      <ConfirmDeleteModal 
        isOpen={deleteId !== null} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => { 
          deleteDebt(deleteId); 
          setDeleteId(null);
          toast.success("Deuda eliminada");
        }} 
        itemName={debtToDelete?.name || ""} 
        itemType="deuda" 
      />
    </div>
  );
}

export default DebtsPage;