function DashboardHeader() {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-slate-800 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Crypto Portfolio</p>
        <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Dashboard</h1>
      </div>
    </header>
  )
}

export default DashboardHeader
