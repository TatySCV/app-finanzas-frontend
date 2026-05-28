// src/components/ui/EmptyState.jsx
function EmptyState({ message, icon = "📭", actionText, onAction }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-lg mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;