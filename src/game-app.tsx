import { useState } from 'react';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
import { useGameState } from './use-game';
import { WorldMap } from './components/WorldMap';
import { FocusTree } from './components/FocusTree';
import { CombatModal } from './components/CombatModal';
import { UnitPanel } from './components/UnitPanel';
import { EconomyPanel } from './components/EconomyPanel';
import { TabName } from './lib/types';

export function GameApp() {
  const {
    state, startGame, selectCountry, selectUnit, setTab, endTurn,
    resolveEvent, performAction, startFocus, dismissCombat, choosePoliticalPath,
  } = useGameState();
  const [showFocusTree, setShowFocusTree] = useState(false);

  if (state.status === 'menu') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground font-mono relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.05) 2px, rgba(0,255,0,0.05))' }} />
        <div className="text-xs text-primary/40 tracking-widest mb-8 uppercase">CLASSIFIED — EYES ONLY // COLD WAR SIMULATION v2.0</div>
        <h1 className="text-7xl font-bold text-primary tracking-widest uppercase mb-1" style={{ textShadow: '0 0 30px rgba(0,255,0,0.4)' }}>
          IRON CURTAIN
        </h1>
        <p className="text-lg text-primary/60 mb-2 tracking-wider">A Cold War Grand Strategy Simulation</p>
        <p className="text-sm text-primary/40 mb-12 tracking-widest">1947 – 1991</p>
        <div className="text-xs text-primary/50 mb-8 max-w-lg text-center leading-relaxed">
          Two superpowers. One world. Build armies, develop technologies, invade nations.
          Manage the global economy, deploy the Focus Tree, and avoid nuclear war.
        </div>
        <div className="flex gap-6">
          <button data-testid="button-play-usa" onClick={() => startGame('usa')}
            className="px-10 py-5 text-xl font-bold uppercase tracking-widest border-2 transition-all duration-200 cursor-pointer hover:scale-105"
            style={{ background: '#0d3b6e', borderColor: '#1a6abf', color: '#7ab8ff', boxShadow: '0 0 20px rgba(26,106,191,0.3)' }}>
            ★ PLAY AS USA
          </button>
          <button data-testid="button-play-ussr" onClick={() => startGame('ussr')}
            className="px-10 py-5 text-xl font-bold uppercase tracking-widest border-2 transition-all duration-200 cursor-pointer hover:scale-105"
            style={{ background: '#6e0d0d', borderColor: '#bf1a1a', color: '#ffaaaa', boxShadow: '0 0 20px rgba(191,26,26,0.3)' }}>
            ☭ PLAY AS USSR
          </button>
        </div>
      </div>
    );
  }

  if (state.status === 'gameover') {
    const isWin = state.winner === state.playerFaction;
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground font-mono">
        <div className="text-xs text-primary/40 mb-6 tracking-widest">TRANSMISSION ENDED</div>
        <h1 className={`text-6xl font-bold tracking-widest uppercase mb-4 ${isWin ? 'text-primary' : 'text-destructive'}`}
          style={{ textShadow: isWin ? '0 0 30px rgba(0,255,0,0.5)' : '0 0 30px rgba(255,0,0,0.5)' }}>
          {isWin ? 'VICTORY' : 'DEFEAT'}
        </h1>
        <p className="text-xl mb-2 text-primary/80">{state.victoryReason}</p>
        <p className="text-sm text-muted-foreground mb-10">Year: {state.year}</p>
        <button data-testid="button-restart" onClick={() => window.location.reload()}
          className="px-8 py-3 border border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-colors">
          NEW GAME
        </button>
      </div>
    );
  }

  const pStats = state.playerFaction === 'usa' ? state.usaStats : state.ussrStats;
  const selectedCountry = state.selectedCountryId ? state.countries[state.selectedCountryId] : null;
  const isUSA = state.playerFaction === 'usa';
  const tensionColor = state.tension >= 80 ? '#ff4444' : state.tension >= 60 ? '#ff9944' : state.tension >= 40 ? '#ffdd44' : '#44ff88';

  const tabs: { id: TabName; label: string }[] = [
    { id: 'intel', label: 'INTEL' },
    { id: 'units', label: 'UNITS' },
    { id: 'economy', label: 'ECONOMY' },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground font-mono overflow-hidden">

      {/* TOP BAR */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-primary tracking-widest">{MONTH_NAMES[(state.month ?? 1) - 1].toUpperCase()} {state.year}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {isUSA ? '★ USA' : '☭ USSR'} Command
          </span>
          <button
            data-testid="button-focus-tree"
            onClick={() => setShowFocusTree(true)}
            className="text-xs px-3 py-1 border border-primary/50 text-primary/80 uppercase tracking-widest hover:bg-primary/20"
          >
            FOCUS TREE
          </button>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground uppercase tracking-widest">Nuclear Tension</span>
            <span className="font-bold" style={{ color: tensionColor }}>{state.tension}%</span>
          </div>
          <div className="h-3 bg-input w-full relative border border-border/50">
            {[25, 50, 75].map(pct => (
              <div key={pct} className="absolute top-0 h-full border-l border-border/30" style={{ left: `${pct}%` }} />
            ))}
            <div className="absolute top-0 left-0 h-full transition-all duration-700"
              style={{ width: `${state.tension}%`, background: tensionColor, boxShadow: `0 0 8px ${tensionColor}80` }} />
          </div>
          <div className="flex justify-between text-xs mt-0.5 text-muted-foreground/50">
            <span>DEFCON 5</span><span>4</span><span>3</span><span>2</span><span style={{ color: '#ff4444' }}>1 — WAR</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground/60 tracking-widest uppercase">
          AP: <span className="text-primary font-bold text-lg">{pStats.actionPoints}</span>/3
          <span className="ml-4 text-primary font-bold">{pStats.productionPoints}</span> PP
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* LEFT PANEL */}
        <div className="w-72 border-r border-border bg-card p-3 flex flex-col gap-2 shrink-0 overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex gap-1 border-b border-border pb-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 text-xs py-1 font-bold uppercase tracking-widest transition-colors"
                style={{
                  background: state.activeTab === t.id ? '#0d3a1a' : '#0a0a0a',
                  color: state.activeTab === t.id ? '#00e676' : '#4a5a4a',
                  border: '1px solid #222',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {state.activeTab === 'intel' && (
              <div className="flex flex-col gap-3">
                {selectedCountry ? (
                  <>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">{selectedCountry.region}</div>
                      <h3 className="text-lg font-bold text-primary uppercase">{selectedCountry.name}</h3>
                      <div className="text-xs mt-1 uppercase tracking-widest" style={{
                        color: selectedCountry.alignment === 'nato' || selectedCountry.alignment === 'western' ? '#4a8abf'
                          : selectedCountry.alignment === 'warsaw' || selectedCountry.alignment === 'communist' ? '#bf4a4a'
                          : '#4a8a4a'
                      }}>
                        {selectedCountry.alignment === 'nato' ? '▲ NATO Alliance'
                          : selectedCountry.alignment === 'western' ? '▲ Western-Aligned'
                          : selectedCountry.alignment === 'warsaw' ? '▼ Warsaw Pact'
                          : selectedCountry.alignment === 'communist' ? '▼ Communist'
                          : '◆ Non-Aligned'}
                      </div>
                      {selectedCountry.isContested && (
                        <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: '#ffaa44' }}>⚡ CONTESTED</div>
                      )}
                      {selectedCountry.occupiedBy && (
                        <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: '#ff4444' }}>⚠ OCCUPIED</div>
                      )}
                    </div>
                    {[
                      { label: 'Stability', value: selectedCountry.stability },
                      { label: 'Military', value: selectedCountry.military },
                      { label: 'Economy', value: selectedCountry.economy },
                      { label: 'Production', value: selectedCountry.productionPoints },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground uppercase tracking-widest">{label}</span>
                          <span className="text-primary font-bold">{value}</span>
                        </div>
                        <div className="h-1.5 bg-input w-full">
                          <div className="h-full bg-primary/70 transition-all" style={{ width: `${Math.min(100, value)}%` }} />
                        </div>
                      </div>
                    ))}
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Influence</div>
                      <div className="h-3 w-full bg-input flex">
                        <div className="h-full transition-all" style={{ width: `${selectedCountry.influence.usa}%`, background: '#1a5a9e' }} />
                        <div className="h-full transition-all" style={{ width: `${selectedCountry.influence.ussr}%`, background: '#9e1a1a' }} />
                      </div>
                      <div className="flex justify-between text-xs mt-0.5">
                        <span style={{ color: '#4a8abf' }}>USA {selectedCountry.influence.usa}%</span>
                        <span style={{ color: '#bf4a4a' }}>USSR {selectedCountry.influence.ussr}%</span>
                      </div>
                    </div>
                    <div className="mt-1 space-y-1.5">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Operations</div>
                      <button data-testid={`button-diplomacy-${selectedCountry.id}`}
                        onClick={() => performAction('diplomacy', selectedCountry.id)}
                        disabled={pStats.actionPoints < 1}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#0d2a0d', color: '#4a8a4a' }}>
                        [1 AP] {(() => {
                          const playerAlliance = isUSA ? ['nato', 'western'] : ['warsaw', 'communist'];
                          const isOwnOrAlly = playerAlliance.includes(selectedCountry.alignment) ||
                            (isUSA && selectedCountry.id === 'usa') || (!isUSA && selectedCountry.id === 'ussr');
                          return isOwnOrAlly ? 'Propaganda Drive (+Stability)' : 'Diplomatic Mission (+3 Influence)';
                        })()}
                      </button>
                      <button data-testid={`button-proxy-${selectedCountry.id}`}
                        onClick={() => performAction('proxy', selectedCountry.id)}
                        disabled={pStats.actionPoints < 1 || selectedCountry.stability >= 10 || (isUSA ? selectedCountry.influence.usa : selectedCountry.influence.ussr) <= 80}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#2a0d0d', color: '#8a4a4a' }}>
                        [1 AP] Proxy War (+Tension)
                      </button>
                      <button data-testid={`button-intel-${selectedCountry.id}`}
                        onClick={() => performAction('intel', selectedCountry.id)}
                        disabled={pStats.actionPoints < 1}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#1a1a0d', color: '#8a8a4a' }}>
                        [1 AP] Intelligence Op (-3 Stability)
                      </button>
                    </div>
                  </>
                ) : null}

                {/* China Civil War Panel — only visible when China is selected */}
                {state.chinaCivilWar && !state.chinaCivilWar.resolved && state.selectedCountryId === 'china' && (
                  <div className="mt-3 border border-border p-3 space-y-2" style={{ background: '#0d1a0d' }}>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffaa44' }}>⚔ CHINESE CIVIL WAR</div>
                    <div className="text-xs" style={{ color: '#8a8a4a' }}>
                      Communist provinces: <span style={{ color: '#bf4a4a' }}>{state.chinaCivilWar.communistStates.length}</span>
                      {' / '}
                      Nationalist provinces: <span style={{ color: '#4a8abf' }}>{state.chinaCivilWar.nationalistStates.length}</span>
                    </div>
                    <div className="h-2 w-full bg-input flex">
                      <div className="h-full transition-all" style={{ width: `${Math.round(state.chinaCivilWar.communistStates.length / 10 * 100)}%`, background: '#bf1a1a' }} />
                      <div className="h-full transition-all" style={{ width: `${Math.round(state.chinaCivilWar.nationalistStates.length / 10 * 100)}%`, background: '#1a6abf' }} />
                    </div>
                    <div className="text-xs" style={{ color: '#4a5a4a' }}>Without aid, Communists advance each month.</div>
                    {isUSA ? (
                      <button
                        onClick={() => performAction('china_aid', 'nationalist')}
                        disabled={pStats.actionPoints < 1}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#0d1a2a', color: '#4a8abf' }}>
                        [1 AP] Send Military Aid to Nationalists
                      </button>
                    ) : (
                      <button
                        onClick={() => performAction('china_aid', 'communist')}
                        disabled={pStats.actionPoints < 1}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#2a0d0d', color: '#bf4a4a' }}>
                        [1 AP] Send Military Aid to Communists
                      </button>
                    )}
                  </div>
                )}
                {state.chinaCivilWar?.resolved && state.selectedCountryId === 'china' && (
                  <div className="mt-3 border border-border p-2 text-xs" style={{ background: '#0d1a0d', color: '#4a8a4a' }}>
                    ✓ Chinese Civil War resolved — {state.chinaCivilWar.winner === 'communist' ? "People's Republic of China" : 'Republic of China'} prevailed.
                  </div>
                )}

                {/* Cuban Revolution Panel — only visible when Cuba is selected */}
                {state.cubanRevolution && !state.cubanRevolution.resolved && state.selectedCountryId === 'cuba' && (
                  <div className="mt-3 border border-border p-3 space-y-2" style={{ background: '#0d1a0d' }}>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffaa44' }}>⚔ CUBAN REVOLUTION</div>
                    <div className="text-xs" style={{ color: '#8a8a4a' }}>
                      Communist provinces: <span style={{ color: '#bf4a4a' }}>{state.cubanRevolution.communistStates.length}</span>
                      {' / '}
                      Government provinces: <span style={{ color: '#4a8abf' }}>{state.cubanRevolution.westernStates.length}</span>
                    </div>
                    <div className="h-2 w-full bg-input flex">
                      <div className="h-full transition-all" style={{ width: `${Math.round(state.cubanRevolution.communistStates.length / 2 * 100)}%`, background: '#bf1a1a' }} />
                      <div className="h-full transition-all" style={{ width: `${Math.round(state.cubanRevolution.westernStates.length / 2 * 100)}%`, background: '#1a6abf' }} />
                    </div>
                    <div className="text-xs" style={{ color: '#4a5a4a' }}>Castro's guerrillas fight from the Sierra Maestra. Aid shapes the outcome.</div>
                    {isUSA ? (
                      <button
                        onClick={() => performAction('cuba_aid', 'western')}
                        disabled={pStats.actionPoints < 1}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#0d1a2a', color: '#4a8abf' }}>
                        [1 AP] Send Military Aid to Government
                      </button>
                    ) : (
                      <button
                        onClick={() => performAction('cuba_aid', 'communist')}
                        disabled={pStats.actionPoints < 1}
                        className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
                        style={{ background: '#2a0d0d', color: '#bf4a4a' }}>
                        [1 AP] Send Military Aid to Revolutionaries
                      </button>
                    )}
                  </div>
                )}
                {state.cubanRevolution?.resolved && state.selectedCountryId === 'cuba' && (
                  <div className="mt-3 border border-border p-2 text-xs" style={{ background: '#0d1a0d', color: '#4a8a4a' }}>
                    ✓ Cuban Revolution resolved — {state.cubanRevolution.winner === 'communist' ? "Communist Cuba" : 'Western-aligned Cuba'} prevailed.
                  </div>
                )}

                {!selectedCountry && (
                  <div className="text-muted-foreground/50 text-xs italic mt-4 leading-relaxed">
                    Click any nation on the map to access intel and operations...
                  </div>
                )}
                {false && (
                  <div className="text-muted-foreground/50 text-xs italic mt-4 leading-relaxed">
                    Click any nation on the map to access intel and operations...
                  </div>
                )}
              </div>
            )}

            {state.activeTab === 'units' && (
              <UnitPanel
                selectedCountry={selectedCountry}
                units={state.units}
                playerFaction={state.playerFaction!}
                selectedUnitId={state.selectedUnitId}
                countries={state.countries}
                onSelectUnit={selectUnit}
                onMoveUnit={(target) => performAction('move_unit', target)}
                onAttack={(target) => performAction('attack', target)}
                onBuildUnit={(type, country) => performAction('build_unit', country)}
                productionPoints={pStats.productionPoints}
                actionPoints={pStats.actionPoints}
              />
            )}

            {state.activeTab === 'economy' && (
              <EconomyPanel
                stats={pStats}
                countries={state.countries}
                playerFaction={state.playerFaction!}
                tradeRoutes={state.tradeRoutes}
                buildQueue={state.buildQueue}
              />
            )}
          </div>
        </div>

        {/* CENTER MAP */}
        <div className="flex-1 relative overflow-hidden bg-black">
          <WorldMap
            countries={state.countries}
            selectedCountryId={state.selectedCountryId}
            onCountryClick={selectCountry}
            chinaCivilWar={state.chinaCivilWar}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-72 border-l border-border bg-card p-3 flex flex-col gap-3 shrink-0">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
            COMMAND CENTER
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Prestige', value: pStats.prestige, max: 200, unit: '' },
              { label: 'GDP', value: pStats.gdp, max: 5000, unit: 'B' },
              { label: 'Manpower', value: pStats.manpower, max: 1000, unit: '' },
            ].map(({ label, value, max, unit }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground uppercase tracking-widest">{label}</span>
                  <span className="text-primary font-bold">{value}{unit}</span>
                </div>
                <div className="h-1.5 bg-input w-full">
                  <div className="h-full bg-primary/70 transition-all" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-xs py-1 border-t border-border mt-1">
              <span className="text-muted-foreground uppercase tracking-widest">Warheads</span>
              <span className="font-bold" style={{ color: '#ff4444' }}>{pStats.nuclearWarheads} ☢</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground uppercase tracking-widest">Units</span>
              <span className="text-primary font-bold">{pStats.totalUnits}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground uppercase tracking-widest">Maintenance</span>
              <span className="font-bold" style={{ color: '#ff9944' }}>-{pStats.maintenanceCost}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Global Orders</div>
            <button data-testid="button-military-buildup"
              onClick={() => performAction('military')}
              disabled={pStats.actionPoints < 1}
              className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
              style={{ background: '#0d1a2a', color: '#4a6a8a' }}>
              [1 AP] Military Buildup (+Tension)
            </button>
            <button data-testid="button-nuclear-dev"
              onClick={() => performAction('nukes')}
              disabled={pStats.actionPoints < 1}
              className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
              style={{ background: '#2a0d0d', color: '#8a4a4a' }}>
              [1 AP] Nuclear Development (+Tension)
            </button>
            <button data-testid="button-economy"
              onClick={() => performAction('economy')}
              disabled={pStats.actionPoints < 1}
              className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
              style={{ background: '#0d2a0d', color: '#4a8a4a' }}>
              [1 AP] Economic Investment
            </button>
            <button data-testid="button-space"
              onClick={() => performAction('space')}
              disabled={pStats.actionPoints < 2}
              className="w-full text-left px-3 py-2 text-xs border border-border uppercase tracking-widest disabled:opacity-40"
              style={{ background: '#0d0d2a', color: '#4a4a8a' }}>
              [2 AP] Space Program (+Prestige)
            </button>
          </div>
          <div className="mt-auto pt-3 border-t border-border">
            <button data-testid="button-end-turn" onClick={endTurn}
              className="w-full py-3 font-bold text-sm uppercase tracking-widest border-2 transition-all"
              style={{
                background: pStats.actionPoints > 0 ? (isUSA ? '#0d3b6e' : '#6e0d0d') : '#1a1a1a',
                borderColor: pStats.actionPoints > 0 ? (isUSA ? '#1a6abf' : '#bf1a1a') : '#333',
                color: pStats.actionPoints > 0 ? '#fff' : '#555',
              }}>
              END TURN →
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM LOG */}
      <div className="h-24 border-t border-border bg-card/80 px-4 py-2 overflow-y-auto shrink-0">
        <div className="space-y-0.5">
          {state.logs.slice(-8).reverse().map((log, i) => (
            <div key={i} className="text-xs" style={{ color: i === 0 ? '#8aaa8a' : '#4a5a4a' }}>
              &gt; {log}
            </div>
          ))}
        </div>
      </div>

      {/* EVENT MODAL */}
      {state.activeEvent && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full p-8 border-2" style={{ background: '#080f08', borderColor: '#00aa44', boxShadow: '0 0 60px rgba(0,170,68,0.15), 0 0 120px rgba(0,0,0,0.8)' }}>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#ff4444' }}>
              ⚠ CLASSIFIED TRANSMISSION // {state.year}
            </div>
            <h2 className="text-3xl font-bold uppercase mb-4 tracking-widest" style={{ color: '#00e676', textShadow: '0 0 20px rgba(0,230,118,0.3)' }}>
              {state.activeEvent.title}
            </h2>
            <div className="text-sm mb-8 leading-relaxed space-y-3" style={{ color: '#8aaa8a' }}>
              {state.activeEvent.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="space-y-3">
              {state.activeEvent.choices.map(c => (
                <button key={c.id} data-testid={`button-event-${c.id}`}
                  onClick={() => resolveEvent(c)}
                  className="w-full text-left px-5 py-3 border text-sm uppercase tracking-wider font-bold transition-all"
                  style={{ borderColor: '#00aa44', color: '#4a8a5a', background: '#0d1a0d' }}>
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMBAT MODAL */}
      {state.combatResult && (
        <CombatModal result={state.combatResult} onDismiss={dismissCombat} />
      )}

      {/* FOCUS TREE */}
      {showFocusTree && state.playerFaction && (
        <FocusTree
          tree={state.focusTrees[state.playerFaction]}
          playerFaction={state.playerFaction}
          onClose={() => setShowFocusTree(false)}
          onStartFocus={startFocus}
          onChoosePoliticalPath={choosePoliticalPath}
        />
      )}
    </div>
  );
}
