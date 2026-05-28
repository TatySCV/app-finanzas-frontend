// src/components/ui/FormInput.jsx
function FormInput({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

export default FormInput;