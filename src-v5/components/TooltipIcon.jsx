import { useId, useState } from 'react'
import { cyanFocusRingClass } from '../lib/uiTheme'

function TooltipIcon({ text, label, className = '', focusable = true }) {
  const tooltipId = useId()
  const [isOpen, setIsOpen] = useState(false)

  function openTooltip() {
    setIsOpen(true)
  }

  function closeTooltip() {
    setIsOpen(false)
  }

  function toggleTooltip() {
    setIsOpen((current) => !current)
  }

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-describedby={tooltipId}
        tabIndex={focusable ? 0 : -1}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
        onClick={toggleTooltip}
        className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-800/80 text-xs font-semibold text-slate-100 ring-1 ring-white/18 transition hover:bg-slate-700/90 ${cyanFocusRingClass} ${className}`}
      >
        ?
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md bg-slate-950 px-2 py-1 text-left text-[11px] font-normal leading-snug normal-case tracking-normal text-slate-100 shadow-lg ring-1 ring-white/16 transition-opacity duration-100 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {text}
      </span>
    </span>
  )
}

export default TooltipIcon
