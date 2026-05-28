function FinancialSummary({ items }) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <p key={index} className={item.color || "text-slate-600 dark:text-slate-300"}>
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}: ${item.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default FinancialSummary;