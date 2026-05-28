import { useState, useMemo } from "react";
import { useFinancial } from "../context/FinancialContext";
import toast from 'react-hot-toast';
import FormInput from "../components/ui/FormInput";
import FormSelect from "../components/ui/FormSelect";
import MovementList from "../components/MovementList";
import EditModal from "../components/EditModal";
import ConfirmDeleteModal from "../components/ui/ConfirmDeleteModal";

function ExpensesPage() {
  const { expenseList, setExpenseList } = useFinancial();

  const [formData, setFormData] = useState({
    amount: "", date: "", reason: "", category: "", type: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Filtros y ordenamiento
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.date || !formData.reason || !formData.category || !formData.type) {
      toast.error("Completa todos los campos");
      return;
    }
    const newExpense = {
      id: Date.now(),
      amount: Number(formData.amount),
      date: formData.date,
      reason: formData.reason.trim(),
      category: formData.category,
      type: formData.type.trim().toLowerCase(),
    };
    setExpenseList([...expenseList, newExpense]);
    setFormData({ amount: "", date: "", reason: "", category: "", type: "" });
    toast.success("Gasto guardado correctamente");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      amount: item.amount,
      date: item.date,
      reason: item.reason,
      category: item.category,
      type: item.type,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = {
      ...editingItem,
      amount: Number(formData.amount),
      date: formData.date,
      reason: formData.reason.trim(),
      category: formData.category,
      type: formData.type.trim().toLowerCase(),
    };
    setExpenseList(expenseList.map(e => e.id === editingItem.id ? updated : e));
    setEditingItem(null);
    setFormData({ amount: "", date: "", reason: "", category: "", type: "" });
    toast.success("Gasto actualizado");
  };

  const handleDelete = (id) => {
    setExpenseList(expenseList.filter(e => e.id !== id));
    setDeleteId(null);
    toast.success("Gasto eliminado");
  };

  // Filtrar y ordenar
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenseList];
    if (filterCategory) {
      filtered = filtered.filter(e => e.category === filterCategory);
    }
    if (filterType) {
      filtered = filtered.filter(e => e.type?.toLowerCase() === filterType.toLowerCase());
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
  }, [expenseList, filterCategory, filterType, sortBy, sortOrder]);

  const categoryOptionsFull = [
    { value: "Vivienda", label: "Vivienda" }, { value: "Comida", label: "Comida" },
    { value: "Transporte", label: "Transporte" }, { value: "Servicios", label: "Servicios" },
    { value: "Salud", label: "Salud" }, { value: "Entretenimiento", label: "Entretenimiento" },
    { value: "Ahorro", label: "Ahorro" }, { value: "Otros", label: "Otros" },
  ];
  const typeOptions = [
    { value: "Fijo", label: "Fijo" }, { value: "Variable", label: "Variable" }, { value: "Ahorro", label: "Ahorro" },
  ];

  const resetFilters = () => {
    setFilterCategory("");
    setFilterType("");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Gastos y distribución</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">Registra gastos fijos, variables o montos destinados al ahorro.</p>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 mt-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput label="Monto" name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="0.00" required />
          <FormInput label="Fecha" name="date" type="date" value={formData.date} onChange={handleChange} required />
          <FormInput label="Motivo" name="reason" value={formData.reason} onChange={handleChange} placeholder="Ej. Supermercado" required />
          <FormSelect label="Categoría" name="category" value={formData.category} onChange={handleChange} options={categoryOptionsFull} required />
          <FormSelect label="Tipo" name="type" value={formData.type} onChange={handleChange} options={typeOptions} required />
        </div>
        <button onClick={handleSubmit} className="w-full bg-red-500 dark:bg-red-600 text-white py-3 rounded-xl mt-6 hover:bg-red-600 transition">Guardar movimiento</button>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Categoría</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl p-2"
          >
            <option value="">Todas</option>
            {categoryOptionsFull.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Tipo</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl p-2"
          >
            <option value="">Todos</option>
            <option value="Fijo">Fijo</option>
            <option value="Variable">Variable</option>
            <option value="Ahorro">Ahorro</option>
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
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
        <div className="flex-1 min-w-[140px]">
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

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Historial de movimientos</h2>
        <MovementList
          movements={filteredExpenses}
          type="expense"
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      <EditModal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdate}
        type="expense"
      />
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        itemName="este gasto"
        itemType="gasto"
      />
    </div>
  );
}

export default ExpensesPage;