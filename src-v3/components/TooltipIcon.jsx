import { cyanFocusRingClass } from '../lib/uiTheme'

function TooltipIcon({ text, label, className = '', focusable = true }) {
  return (
    <span
      aria-label={label}
      tabIndex={focusable ? 0 : -1}
      className={`group relative inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-500 text-[10px] font-semibold text-slate-300 ${cyanFocusRingClass} ${className}`}
    >
      ?
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-left text-[11px] font-normal leading-snug normal-case tracking-normal text-slate-100 opacity-0 shadow-lg transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100">
        {text}
      </span>
    </span>
  )
}

export default TooltipIcon
