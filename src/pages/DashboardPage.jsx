import { useAuth } from "../context/AuthContext";
import FinancialCard from "../components/FinancialCard";
import { useFinancial } from "../context/FinancialContext";

function DashboardPage() {
  const { user } = useAuth();
  const { incomeList, expenseList } = useFinancial();

  const totalIncome = incomeList.reduce(
    (total, income) => total + Number(income.amount),
    0
  );

  const fixedExpenses = expenseList
    .filter((e) => e.type?.trim().toLowerCase() === "fijo")
    .reduce((t, e) => t + (Number(e.amount) || 0), 0);

  const variableExpenses = expenseList
    .filter((e) => e.type?.trim().toLowerCase() === "variable")
    .reduce((t, e) => t + (Number(e.amount) || 0), 0);

  const savingsReserved = expenseList
    .filter((e) => e.type?.trim().toLowerCase() === "ahorro")
    .reduce((t, e) => t + (Number(e.amount) || 0), 0);

  const availableBalance =
    totalIncome - fixedExpenses - variableExpenses - savingsReserved;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="flex items-center gap-4">
        <img
          src={user?.photoURL}
          alt="profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Bienvenida {user?.displayName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        <FinancialCard
          title="Ingresos"
          amount={totalIncome}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <FinancialCard
          title="Gastos"
          amount={fixedExpenses + variableExpenses}
          color="text-red-500 dark:text-red-400"
        />
        <FinancialCard
          title="Ahorros"
          amount={savingsReserved}
          color="text-blue-600 dark:text-blue-400"
        />
        <FinancialCard
          title="Saldo disponible"
          amount={availableBalance}
          color="text-slate-800 dark:text-slate-200"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Últimos ingresos</h2>
        <div className="mt-5 space-y-4">
          {incomeList.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
              <p className="text-slate-500 dark:text-slate-400">No existen ingresos registrados.</p>
            </div>
          ) : (
            incomeList
              .slice()
              .reverse()
              .slice(0, 5)
              .map((income) => (
                <div key={income.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">
                        {income.reason}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {income.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${income.amount}
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">{income.date}</p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;