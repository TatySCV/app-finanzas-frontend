import Modal from "./ui/Modal";
import FormInput from "./ui/FormInput";
import FormSelect from "./ui/FormSelect";

function EditModal({ isOpen, onClose, formData, setFormData, onSubmit, type }) {
  const categoryOptions = [
    { value: "Vivienda", label: "Vivienda" },
    { value: "Comida", label: "Comida" },
    { value: "Transporte", label: "Transporte" },
    { value: "Servicios", label: "Servicios" },
    { value: "Salud", label: "Salud" },
    { value: "Entretenimiento", label: "Entretenimiento" },
    { value: "Ahorro", label: "Ahorro" },
    { value: "Otros", label: "Otros" },
  ];

  const typeOptions = [
    { value: "Fijo", label: "Fijo" },
    { value: "Variable", label: "Variable" },
    { value: "Ahorro", label: "Ahorro" },
  ];

  const isIncome = type === "income";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar ${isIncome ? "ingreso" : "gasto"}`}>
      <form onSubmit={onSubmit}>
        <FormInput
          label="Monto"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <FormInput
          label="Fecha"
          name="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <FormInput
          label="Motivo"
          name="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />
        <FormInput
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required={!isIncome}
        />
        {!isIncome && (
          <FormSelect
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={typeOptions}
            required
          />
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 rounded-xl">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">Guardar cambios</button>
        </div>
      </form>
    </Modal>
  );
}

export default EditModal;