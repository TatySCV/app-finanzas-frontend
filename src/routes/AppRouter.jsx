import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import DashboardPage from "../pages/DashboardPage"
import IncomePage from "../pages/IncomePage"
import ExpensesPage from "../pages/ExpensesPage"
import SavingsPage from "../pages/SavingsPage"
import CreditsPage from "../pages/CreditsPage"
import DebtsPage from "../pages/DebtsPage"
import StatisticsPage from '../pages/StatisticsPage';
import MonthlySummaryPage from "../pages/MonthlySummaryPage";
import SettingsPage from "../pages/SettingsPage"

import ProtectedRoute from "./ProtectedRoute"
import MainLayout from "../layouts/MainLayout"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />
          <Route path="/resumen-mensual" element={<MonthlySummaryPage />} />

          <Route path="/ingresos" element={<IncomePage />} />
          <Route path="/gastos" element={<ExpensesPage />} />
          <Route path="/ahorros" element={<SavingsPage />} />
          <Route path="/creditos" element={<CreditsPage />} />
          <Route path="/deudas" element={<DebtsPage />} />

          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter