import AddTradeModal from './components/AddTradeModal'
import AllTradesScreen from './components/AllTradesScreen'
import AllocationPanel from './components/AllocationPanel'
import DashboardHeader from './components/DashboardHeader'
import PortfolioStats from './components/PortfolioStats'
import RecentTradesPanel from './components/RecentTradesPanel'
import usePortfolioDashboard from './hooks/usePortfolioDashboard'

function App() {
  const {
    allocations,
    compactMoney,
    deleteTrade,
    defaultTag,
    editTrade,
    formData,
    formatTradeTimestamp,
    handleAddTrade,
    isDashboardScreen,
    isEditMode,
    isModalOpen,
    money,
    onInputChange,
    openDashboardScreen,
    openTradeModal,
    openTradesScreen,
    portfolioStats,
    renderTradeLine,
    tagOptions,
    trades,
    closeTradeModal,
  } = usePortfolioDashboard()

  return (
    <main className="min-h-screen px-4 py-8 text-slate-100">
      <section
          className="
            mx-auto w-full max-w-480
            px-4 sm:px-6 lg:px-10
            rounded-3xl border border-slate-800/80
            bg-slate-950/70
            p-6 lg:p-8
            shadow-2xl backdrop-blur-sm
          "
      >
        <DashboardHeader />

        {isDashboardScreen ? (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <section className="space-y-6">
              <PortfolioStats
                portfolioStats={portfolioStats}
                compactMoney={compactMoney}
                money={money}
              />

              <AllocationPanel allocations={allocations} money={money} />
            </section>

            <RecentTradesPanel
              trades={trades}
              defaultTag={defaultTag}
              onOpenTradeModal={openTradeModal}
              onOpenTradesScreen={openTradesScreen}
              renderTradeLine={renderTradeLine}
              formatTradeTimestamp={formatTradeTimestamp}
            />
          </div>
        ) : (
          <AllTradesScreen
            trades={trades}
            defaultTag={defaultTag}
            portfolioStats={portfolioStats}
            compactMoney={compactMoney}
            money={money}
            renderTradeLine={renderTradeLine}
            formatTradeTimestamp={formatTradeTimestamp}
            onBackToDashboard={openDashboardScreen}
            onOpenTradeModal={openTradeModal}
            onEditTrade={editTrade}
            onDeleteTrade={deleteTrade}
          />
        )}
      </section>

      <AddTradeModal
        isOpen={isModalOpen}
        formData={formData}
        tagOptions={tagOptions}
        onClose={closeTradeModal}
        onInputChange={onInputChange}
        onSubmit={handleAddTrade}
        title={isEditMode ? 'Edit Trade' : 'Add Trade'}
        submitLabel={isEditMode ? 'Save Changes' : 'Confirm Trade'}
      />
    </main>
  )
}

export default App
