// src/components/ui/FormSelect.jsx
function FormSelect({ label, name, value, onChange, options, required = false }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Selecciona...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;