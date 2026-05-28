import EmptyState from "./ui/EmptyState";

function PaymentList({ payments }) {
  if (!payments || payments.length === 0) {
    return <EmptyState message="No hay pagos registrados." icon="💸" />;
  }

  return (
    <div className="space-y-3">
      {payments.map(payment => (
        <div key={payment.id} className="bg-slate-50 dark:bg-slate-700 p-3 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">${payment.amount}</p>
            <p className="text-xs text-slate-400 dark:text-slate-400">{payment.date}</p>
          </div>
          {payment.note && <p className="text-sm text-slate-500 dark:text-slate-300">{payment.note}</p>}
        </div>
      ))}
    </div>
  );
}

export default PaymentList;