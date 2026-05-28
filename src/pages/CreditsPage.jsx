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

function CreditsPage() {
  const { creditList, addCredit, addCreditPayment, deleteCredit } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  const [newCredit, setNewCredit] = useState({ name: "", totalAmount: "", interestRate: "", startDate: "" });
  const [deleteId, setDeleteId] = useState(null);

  const totalCredits = creditList.reduce((sum, c) => sum + c.totalAmount, 0);
  const totalPending = creditList.reduce((sum, c) => sum + c.remaining, 0);
  const totalPaid = totalCredits - totalPending;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCredit.name || !newCredit.totalAmount || !newCredit.startDate) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    addCredit(newCredit);
    setNewCredit({ name: "", totalAmount: "", interestRate: "", startDate: "" });
    setShowForm(false);
    toast.success("Crédito registrado correctamente");
  };

  const creditToDelete = creditList.find(c => c.id === deleteId);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Créditos recibidos</h1>
          <FinancialSummary items={[
            { label: "Total créditos", value: totalCredits, icon: "🏦", color: "text-slate-600 dark:text-slate-300" },
            { label: "Pagado", value: totalPaid, icon: "✅", color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Pendiente", value: totalPending, icon: "⏳", color: "text-orange-500 dark:text-orange-400" },
          ]} />
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex gap-2 items-center transition">
          <PlusCircle size={20} /> Nuevo crédito
        </button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Registrar crédito">
        <form onSubmit={handleAdd}>
          <FormInput label="Nombre / Concepto" value={newCredit.name} onChange={e => setNewCredit({...newCredit, name: e.target.value})} required />
          <FormInput label="Monto total" type="number" value={newCredit.totalAmount} onChange={e => setNewCredit({...newCredit, totalAmount: e.target.value})} required />
          <FormInput label="Tasa de interés (%)" type="number" value={newCredit.interestRate} onChange={e => setNewCredit({...newCredit, interestRate: e.target.value})} />
          <FormInput label="Fecha de inicio" type="date" value={newCredit.startDate} onChange={e => setNewCredit({...newCredit, startDate: e.target.value})} required />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 dark:text-slate-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition">Guardar</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {creditList.length === 0 ? (
          <div className="col-span-2">
            <EmptyState message="No hay créditos registrados." icon="🏦" actionText="Agregar crédito" onAction={() => setShowForm(true)} />
          </div>
        ) : (
          creditList.map(credit => (
            <CreditDebtCard key={credit.id} item={credit} type="credit" onAddPayment={addCreditPayment} onDelete={setDeleteId} />
          ))
        )}
      </div>

      <ConfirmDeleteModal 
        isOpen={deleteId !== null} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => { 
          deleteCredit(deleteId); 
          setDeleteId(null);
          toast.success("Crédito eliminado");
        }} 
        itemName={creditToDelete?.name || ""} 
        itemType="crédito" 
      />
    </div>
  );
}

export default CreditsPage;