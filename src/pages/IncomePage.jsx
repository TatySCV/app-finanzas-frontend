import { useState, useMemo } from "react";
import { useFinancial } from "../context/FinancialContext";
import toast from 'react-hot-toast';
import FormInput from "../components/ui/FormInput";
import MovementList from "../components/MovementList";
import EditModal from "../components/EditModal";
import ConfirmDeleteModal from "../components/ui/ConfirmDeleteModal";

function IncomePage() {
  const { incomeList, setIncomeList } = useFinancial();
  const [formData, setFormData] = useState({ amount: "", date: "", reason: "", category: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Filtros y ordenamiento
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.date || !formData.reason) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    const newIncome = {
      id: Date.now(),
      amount: Number(formData.amount),
      date: formData.date,
      reason: formData.reason.trim(),
      category: formData.category || "General",
    };
    setIncomeList([...incomeList, newIncome]);
    setFormData({ amount: "", date: "", reason: "", category: "" });
    toast.success("Ingreso guardado correctamente");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      amount: item.amount,
      date: item.date,
      reason: item.reason,
      category: item.category,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = {
      ...editingItem,
      amount: Number(formData.amount),
      date: formData.date,
      reason: formData.reason.trim(),
      category: formData.category || "General",
    };
    setIncomeList(incomeList.map(i => i.id === editingItem.id ? updated : i));
    setEditingItem(null);
    setFormData({ amount: "", date: "", reason: "", category: "" });
    toast.success("Ingreso actualizado");
  };

  const handleDelete = (id) => {
    setIncomeList(incomeList.filter(i => i.id !== id));
    setDeleteId(null);
    toast.success("Ingreso eliminado");
  };

  // Filtrar y ordenar la lista
  const filteredIncomes = useMemo(() => {
    let filtered = [...incomeList];
    if (filterCategory) {
      filtered = filtered.filter(i => i.category?.toLowerCase().includes(filterCategory.toLowerCase()));
    }
    // Ordenar
    filtered.sort((a, b) => {
      let valA, valB;
      if (sortBy === "date") {
        valA = new Date(a.date);
        valB = new Date(b.date);
      } else if (sortBy === "amount") {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = a.reason?.toLowerCase() || "";
        valB = b.reason?.toLowerCase() || "";
      }
      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
    return filtered;
  }, [incomeList, filterCategory, sortBy, sortOrder]);

  // Obtener categorías únicas para el filtro
  const uniqueCategories = useMemo(() => {
    const cats = new Set(incomeList.map(i => i.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [incomeList]);

  const resetFilters = () => {
    setFilterCategory("");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Registro de ingresos</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">Registra tus ingresos para llevar el control financiero.</p>

      {/* Formulario de nuevo ingreso */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 mt-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput label="Monto" name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="0.00" required />
          <FormInput label="Fecha" name="date" type="date" value={formData.date} onChange={handleChange} required />
          <FormInput label="Motivo" name="reason" type="text" value={formData.reason} onChange={handleChange} placeholder="Ej. Salario, Freelance" required />
          <FormInput label="Categoría (opcional)" name="category" type="text" value={formData.category} onChange={handleChange} placeholder="Trabajo, Inversiones, etc." />
        </div>
        <button onClick={handleSubmit} className="w-full bg-emerald-600 dark:bg-emerald-500 text-white py-3 rounded-xl mt-6 hover:bg-emerald-700 transition">Guardar ingreso</button>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Categoría</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl p-2"
          >
            <option value="">Todas</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl p-2"
          >
            <option value="date">Fecha</option>
            <option value="amount">Monto</option>
            <option value="reason">Motivo</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Orden</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl p-2"
          >
            <option value="desc">Más reciente / Mayor monto</option>
            <option value="asc">Más antiguo / Menor monto</option>
          </select>
        </div>
        <button
          onClick={resetFilters}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition"
        >
          Restablecer
        </button>
      </div>

      {/* Lista de ingresos */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Historial de ingresos</h2>
        <MovementList
          movements={filteredIncomes}
          type="income"
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      {/* Modales */}
      <EditModal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdate}
        type="income"
      />
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        itemName="este ingreso"
        itemType="ingreso"
      />
    </div>
  );
}

export default IncomePage;