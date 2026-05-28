function FinancialCard({ title, amount, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
      <h2 className="text-slate-500 dark:text-slate-400">{title}</h2>
      <p className={`text-3xl font-bold mt-3 ${color}`}>
        ${amount.toLocaleString()}
      </p>
    </div>
  );
}

export default FinancialCard;