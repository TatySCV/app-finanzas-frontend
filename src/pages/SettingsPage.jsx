import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useColor } from '../context/ColorContext';
import { useFinancial } from '../context/FinancialContext';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

function SettingsPage() {
  const { darkMode } = useTheme();
  const { primaryColor, setPrimaryColor } = useColor();
  const { 
    incomeList, setIncomeList,
    expenseList, setExpenseList,
    savingGoals, setSavingGoals,
    creditList, setCreditList,
    debtList, setDebtList
  } = useFinancial();
  const [tempColor, setTempColor] = useState(primaryColor);
  const fileInputRef = useRef(null);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setTempColor(newColor);
    setPrimaryColor(newColor);
  };

  const handleExportData = () => {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      incomes: incomeList,
      expenses: expenseList,
      savingGoals: savingGoals,
      credits: creditList,
      debts: debtList,
    };
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `finanzas_backup_${new Date().toISOString().slice(0,19)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Datos exportados correctamente");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (!importedData.version || !importedData.exportDate || 
            !Array.isArray(importedData.incomes) ||
            !Array.isArray(importedData.expenses) ||
            !Array.isArray(importedData.savingGoals) ||
            !Array.isArray(importedData.credits) ||
            !Array.isArray(importedData.debts)) {
          toast.error("El archivo no tiene el formato esperado. No se importaron datos.");
          return;
        }
        
        if (window.confirm("¿Estás seguro de que quieres importar estos datos? Se reemplazarán TODOS los datos actuales.")) {
          setIncomeList(importedData.incomes);
          setExpenseList(importedData.expenses);
          setSavingGoals(importedData.savingGoals);
          setCreditList(importedData.credits);
          setDebtList(importedData.debts);
          toast.success("Datos importados correctamente.");
        }
      } catch (error) {
        toast.error("Error al leer el archivo. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Configuración</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tema */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Tema</h2>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Modo oscuro</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Color primario */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Color primario</h2>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={tempColor}
              onChange={handleColorChange}
              className="w-12 h-12 rounded cursor-pointer border border-slate-300 dark:border-slate-600"
            />
            <span className="text-slate-600 dark:text-slate-400">Elige el color principal de la aplicación</span>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary text-white text-center">
            Vista previa del color primario
          </div>
        </div>

        {/* Exportar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Exportar datos</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Descarga todos tus datos financieros en un archivo JSON.
          </p>
          <button
            onClick={handleExportData}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition"
          >
            Exportar a JSON
          </button>
        </div>

        {/* Importar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Importar datos</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Restaura una copia de seguridad previamente exportada. Reemplazará todos tus datos actuales.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition"
          >
            Importar desde JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;