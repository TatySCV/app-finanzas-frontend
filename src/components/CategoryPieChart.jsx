import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFinancial } from '../context/FinancialContext';
import { groupByCategory } from '../utils/financialCharts';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryPieChart() {
  const { expenseList } = useFinancial();
  const data = groupByCategory(expenseList);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow text-center text-slate-500 dark:text-slate-400">
        No hay datos de gastos para mostrar.
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F06292', '#BA68C8'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: $${context.raw.toLocaleString()}`,
        },
      },
      legend: {
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        Distribución de gastos por categoría
      </h2>
      <div style={{ height: '300px' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

export default CategoryPieChart;