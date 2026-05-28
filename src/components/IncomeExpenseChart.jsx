import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useFinancial } from '../context/FinancialContext';
import { groupByMonth } from '../utils/financialCharts';
import { useTheme } from '../context/ThemeContext'; // Importa el hook del tema

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function IncomeExpenseChart() {
  const { incomeList, expenseList } = useFinancial();
  const { darkMode } = useTheme(); // Obtener el estado del tema

  const incomeByMonth = groupByMonth(incomeList);
  const expenseByMonth = groupByMonth(expenseList);
  
  const allMonths = [...new Set([...incomeByMonth.map(i => i.month), ...expenseByMonth.map(e => e.month)])].sort();
  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Ingresos',
        data: allMonths.map(month => incomeByMonth.find(i => i.month === month)?.amount || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Gastos',
        data: allMonths.map(month => expenseByMonth.find(e => e.month === month)?.amount || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  // Configuración dinámica de colores según el tema
  const textColor = darkMode ? '#e2e8f0' : '#1e293b';
  const gridColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.raw.toLocaleString()}`,
        },
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        Evolución ingresos vs gastos
      </h2>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default IncomeExpenseChart;