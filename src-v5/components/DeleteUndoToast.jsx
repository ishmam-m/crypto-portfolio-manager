import { createPortal } from 'react-dom'
import { primaryButtonClass, secondaryButtonClass } from '../lib/uiTheme'

function DeleteUndoToast({ deletedTrade, onUndo, onDismiss, renderTradeLine }) {
  if (!deletedTrade) {
    return null
  }

  return createPortal(
    <aside
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto w-full max-w-lg rounded-xl bg-slate-900/95 p-4 shadow-2xl ring-1 ring-white/12"
    >
      <p className="text-sm text-slate-100">Trade deleted: {renderTradeLine(deletedTrade)}</p>
      <p className="mt-1 text-xs text-slate-300">Undo is available for 10 seconds.</p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={onDismiss} className={`${secondaryButtonClass} px-3 py-2 text-xs`}>
          Dismiss
        </button>
        <button type="button" onClick={onUndo} className={`${primaryButtonClass} px-3 py-2 text-xs`}>
          Undo Delete
        </button>
      </div>
    </aside>,
    document.body,
  )
}

export default DeleteUndoToast
