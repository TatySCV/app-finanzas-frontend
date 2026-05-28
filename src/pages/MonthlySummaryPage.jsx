import { useState, useMemo } from "react";
import { useFinancial } from "../context/FinancialContext";
import FinancialCard from "../components/FinancialCard";
import EmptyState from "../components/ui/EmptyState";

function MonthlySummaryPage() {
  const { incomeList, expenseList } = useFinancial();

  // Obtener años únicos de los movimientos (para el selector)
  const availableYears = useMemo(() => {
    const years = new Set();
    [...incomeList, ...expenseList].forEach(m => {
      if (m.date) years.add(new Date(m.date).getFullYear());
    });
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [incomeList, expenseList]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Filtrar movimientos por mes/año
  const filteredIncomes = incomeList.filter(inc => {
    const d = new Date(inc.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });
  const filteredExpenses = expenseList.filter(exp => {
    const d = new Date(exp.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });

  // Totales del mes
  const totalIncome = filteredIncomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const savingsReserved = filteredExpenses
    .filter(e => e.type?.toLowerCase() === "ahorro")
    .reduce((s, e) => s + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Totales del mes anterior (para comparación)
  let prevMonth = selectedMonth - 1;
  let prevYear = selectedYear;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = selectedYear - 1;
  }
  const prevIncomes = incomeList.filter(inc => {
    const d = new Date(inc.date);
    return d.getFullYear() === prevYear && d.getMonth() + 1 === prevMonth;
  });
  const prevExpenses = expenseList.filter(exp => {
    const d = new Date(exp.date);
    return d.getFullYear() === prevYear && d.getMonth() + 1 === prevMonth;
  });
  const prevTotalIncome = prevIncomes.reduce((s, i) => s + i.amount, 0);
  const prevTotalExpense = prevExpenses.reduce((s, e) => s + e.amount, 0);
  const prevNetBalance = prevTotalIncome - prevTotalExpense;

  const incomeDiff = totalIncome - prevTotalIncome;
  const expenseDiff = totalExpense - prevTotalExpense;
  const netDiff = netBalance - prevNetBalance;

  // Combinar movimientos para la lista
  const allMovements = [
    ...filteredIncomes.map(m => ({ ...m, type: "income" })),
    ...filteredExpenses.map(m => ({ ...m, type: "expense" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Nombres de meses
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value));
  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Resumen mensual</h1>
        <div className="flex gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl shadow">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx + 1}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <FinancialCard title="Ingresos" amount={totalIncome} color="text-emerald-600 dark:text-emerald-400" />
        <FinancialCard title="Gastos" amount={totalExpense} color="text-red-500 dark:text-red-400" />
        <FinancialCard title="Ahorro" amount={savingsReserved} color="text-blue-600 dark:text-blue-400" />
        <FinancialCard title="Saldo neto" amount={netBalance} color="text-slate-800 dark:text-slate-200" />
      </div>

      {/* Comparativa con mes anterior */}
      {(prevTotalIncome > 0 || prevTotalExpense > 0) && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Comparación con mes anterior</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Ingresos</p>
              <p className={`font-semibold ${incomeDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {incomeDiff >= 0 ? `+$${incomeDiff}` : `-$${Math.abs(incomeDiff)}`}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Gastos</p>
              <p className={`font-semibold ${expenseDiff <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {expenseDiff <= 0 ? `-$${Math.abs(expenseDiff)}` : `+$${expenseDiff}`}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Saldo neto</p>
              <p className={`font-semibold ${netDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {netDiff >= 0 ? `+$${netDiff}` : `-$${Math.abs(netDiff)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de movimientos del mes */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Movimientos del mes</h2>
        {allMovements.length === 0 ? (
          <EmptyState message="No hay movimientos en este período" icon="📅" />
        ) : (
          <div className="space-y-3">
            {allMovements.map(m => (
              <div key={m.id} className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{m.reason}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{m.date} {m.category && `· ${m.category}`}</p>
                </div>
                <p className={`font-bold ${m.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {m.type === 'income' ? '+' : '-'}${m.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlySummaryPage;