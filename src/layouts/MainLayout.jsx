import {
  LayoutDashboard,
  Wallet,
  LogOut,
  Receipt,
  PiggyBank,
  CreditCard,
  HandCoins,
  Calendar,
  Settings,
} from "lucide-react"

import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom"

import { BarChart3 } from "lucide-react"

import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { useAuth } from "../context/AuthContext"
import ThemeToggle from "../components/ThemeToggle"

function MainLayout() {
  const { user } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut(auth)
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">
      <aside className="w-72 bg-white dark:bg-slate-800 shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            App Finanzas
          </h1>

          <p className="text-slate-400 dark:text-slate-500 mt-1">
            Control financiero
          </p>

          <nav className="mt-10 flex flex-col gap-3">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/dashboard")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              to="/estadisticas"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/estadisticas")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <BarChart3 size={20} />
              Estadisticas
            </Link>

            <Link
              to="/resumen-mensual"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/resumen-mensual")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Calendar size={20} />
              Resumen mensual
            </Link>

            <Link
              to="/ingresos"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/ingresos")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Wallet size={20} />
              Ingresos
            </Link>

            <Link
              to="/gastos"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/gastos")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Receipt size={20} />
              Gastos
            </Link>

            <Link
              to="/ahorros"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/ahorros")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <PiggyBank size={20} />
              Ahorros
            </Link>

            <Link
              to="/creditos"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/creditos")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <CreditCard size={20} />
              Créditos
            </Link>

            <Link
              to="/deudas"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                isActive("/deudas")
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <HandCoins size={20} />
              Deudas
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <Link
            to="/configuracion"
            className={`flex items-center gap-3 p-3 rounded-xl transition ${
              isActive("/configuracion")
                ? "bg-primary text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Settings size={20} />
            Configuración
          </Link>

          <div className="border-t dark:border-slate-700 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {user?.displayName}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {user?.email}
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout