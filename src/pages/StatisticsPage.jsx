import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';

function StatisticsPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Estadísticas financieras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart />
        <CategoryPieChart />
      </div>
    </div>
  );
}

export default StatisticsPage;