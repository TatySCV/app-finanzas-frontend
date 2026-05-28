// src/utils/financialCharts.js

// Agrupar movimientos por mes (para ingresos y gastos)
export const groupByMonth = (movements, type) => {
  const months = {};
  movements.forEach(m => {
    const date = new Date(m.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!months[monthKey]) {
      months[monthKey] = { month: monthName, amount: 0 };
    }
    months[monthKey].amount += Number(m.amount);
  });
  // Convertir a array y ordenar por fecha
  return Object.values(months).sort((a, b) => {
    const aDate = new Date(a.month);
    const bDate = new Date(b.month);
    return aDate - bDate;
  });
};

// Resumir gastos por categoría (para gráfico de pastel)
export const groupByCategory = (expenses) => {
  const categories = {};
  expenses.forEach(e => {
    const cat = e.category || "Otros";
    if (!categories[cat]) categories[cat] = 0;
    categories[cat] += Number(e.amount);
  });
  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

// Evolución del saldo disponible (ingresos acumulados - gastos acumulados por mes)
export const getBalanceHistory = (incomes, expenses) => {
  const allMovements = [
    ...incomes.map(i => ({ ...i, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' }))
  ];
  allMovements.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let balance = 0;
  const history = [];
  allMovements.forEach(m => {
    if (m.type === 'income') balance += Number(m.amount);
    else balance -= Number(m.amount);
    history.push({
      date: m.date,
      balance
    });
  });
  return history;
};