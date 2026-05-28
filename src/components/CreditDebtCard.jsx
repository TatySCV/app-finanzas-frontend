import { useState } from "react";
import { CreditCard, DollarSign, Trash2, Eye } from "lucide-react";
import toast from 'react-hot-toast';
import Modal from "./ui/Modal";
import FormInput from "./ui/FormInput";
import PaymentList from "./PaymentList";

function CreditDebtCard({ item, type, onAddPayment, onDelete }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const isCredit = type === "credit";
  const icon = isCredit ? <CreditCard className="text-green-600 dark:text-green-400" /> : <DollarSign className="text-red-600 dark:text-red-400" />;
  const progress = ((item.totalAmount - item.remaining) / item.totalAmount) * 100;

  const handleSubmitPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    if (parseFloat(paymentAmount) > item.remaining) {
      toast.error(`El pago no puede superar el saldo pendiente ($${item.remaining})`);
      return;
    }
    onAddPayment(item.id, {
      amount: parseFloat(paymentAmount),
      date: paymentDate,
      note: paymentNote,
    });
    setPaymentAmount("");
    setPaymentNote("");
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setShowPaymentModal(false);
    toast.success("Pago registrado correctamente");
  };

  const isCompleted = item.status === "paid";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
        </div>
        <button onClick={() => onDelete(item.id)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        <p>Monto total: ${item.totalAmount.toLocaleString()}</p>
        <p>Saldo pendiente: ${item.remaining.toLocaleString()}</p>
        {item.interestRate > 0 && <p>Tasa interés: {item.interestRate}%</p>}
        <p>Inicio: {item.startDate}</p>
        <p className={`font-semibold ${isCompleted ? "text-green-600 dark:text-green-400" : "text-orange-500 dark:text-orange-400"}`}>
          Estado: {isCompleted ? "Pagado" : "Pendiente"}
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {!isCompleted && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 py-2 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-800/50 flex items-center justify-center gap-1 transition"
          >
            💰 Pagar
          </button>
        )}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-1 transition"
        >
          <Eye size={16} /> Historial
        </button>
      </div>

      {/* Modal para registrar pago */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title={`Registrar pago - ${item.name}`}>
        <FormInput label="Monto" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" required />
        <FormInput label="Fecha" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
        <FormInput label="Nota (opcional)" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} placeholder="Ej. Cuota 1" />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 dark:text-slate-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition">Cancelar</button>
          <button onClick={handleSubmitPayment} className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition">Guardar pago</button>
        </div>
      </Modal>

      {/* Modal para ver historial */}
      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title={`Historial de pagos - ${item.name}`}>
        <PaymentList payments={item.payments} />
      </Modal>
    </div>
  );
}

export default CreditDebtCard;