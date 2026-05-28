// src/components/ui/ConfirmDeleteModal.jsx
import Modal from "./Modal";

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName, itemType = "elemento" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar eliminación">
      <p className="text-slate-700 mb-6">
        ¿Estás seguro de que deseas eliminar {itemType} <span className="font-bold">"{itemName}"</span>?
        <br />
        Esta acción no se puede deshacer.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;