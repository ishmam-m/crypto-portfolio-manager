import { NavLink, useLocation } from 'react-router-dom'
import { cyanFocusRingClass } from '../lib/uiTheme'

const ROUTE_METADATA = {
  '/': {
    title: 'Dashboard',
    breadcrumb: 'Home / Dashboard',
    subtitle: 'Portfolio overview, recent activity, and allocation snapshot.',
  },
  '/trades': {
    title: 'Trades',
    breadcrumb: 'Home / Trades',
    subtitle: 'Review, edit, and manage your complete trade history.',
  },
  '/allocations': {
    title: 'Allocations',
    breadcrumb: 'Home / Allocations',
    subtitle: 'Analyze portfolio distribution and asset-level performance.',
  },
}

function navLinkClassName(isActive) {
  return [
    'rounded-lg px-4 py-2 text-sm font-medium transition',
    cyanFocusRingClass,
    isActive
      ? 'bg-cyan-400 text-slate-950 font-semibold shadow-[0_8px_20px_rgba(34,211,238,0.35)]'
      : 'text-slate-200 hover:bg-slate-800/90 hover:text-white',
  ].join(' ')
}

function DashboardHeader() {
  const location = useLocation()
  const currentRoute = ROUTE_METADATA[location.pathname] ?? ROUTE_METADATA['/']

  return (
    <header className="mb-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">{currentRoute.breadcrumb}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">{currentRoute.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200">{currentRoute.subtitle}</p>
        </div>

        <nav aria-label="Global" className="inline-flex flex-wrap gap-1.5 rounded-xl bg-slate-950/70 p-1.5 ring-1 ring-white/10">
          <NavLink to="/" end className={({ isActive }) => navLinkClassName(isActive)}>
            Dashboard
          </NavLink>
          <NavLink to="/trades" className={({ isActive }) => navLinkClassName(isActive)}>
            Trades
          </NavLink>
          <NavLink to="/allocations" className={({ isActive }) => navLinkClassName(isActive)}>
            Allocations
          </NavLink>
        </nav>
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.24em] text-cyan-200">
        Crypto Portfolio
      </p>
    </header>
  )
}

export default DashboardHeader
