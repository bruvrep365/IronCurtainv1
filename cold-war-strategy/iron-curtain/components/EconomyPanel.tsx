import { PlayerStats, Country, GameState } from '../lib/types.js';

interface EconomyPanelProps {
  stats: PlayerStats;
  countries: Record<string, Country>;
  playerFaction: 'usa' | 'ussr';
  tradeRoutes: GameState['tradeRoutes'];
  buildQueue: GameState['buildQueue'];
}

export function EconomyPanel({ stats, countries, playerFaction, tradeRoutes, buildQueue }: EconomyPanelProps) {
  const aligned = Object.values(countries).filter(c =>
    playerFaction === 'usa'
      ? (c.alignment === 'nato' || c.alignment === 'western')
      : (c.alignment === 'warsaw' || c.alignment === 'communist')
  );

  const tradeIncome = tradeRoutes.reduce((sum, r) => {
    const from = countries[r.from];
    const to = countries[r.to];
    if (!from || !to) return sum;
    const isAligned = playerFaction === 'usa'
      ? (from.alignment === 'nato' || from.alignment === 'western') && (to.alignment === 'nato' || to.alignment === 'western')
      : (from.alignment === 'warsaw' || from.alignment === 'communist') && (to.alignment === 'warsaw' || to.alignment === 'communist');
    return isAligned ? sum + r.value : sum;
  }, 0);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
        ECONOMY OVERVIEW
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-widest">GDP</span>
          <span className="text-primary font-bold">${stats.gdp}B</span>
        </div>
        <div className="h-1.5 bg-input w-full">
          <div className="h-full bg-primary/70" style={{ width: `${Math.min(100, (stats.gdp / 5000) * 100)}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-widest">Production Points</span>
          <span className="font-bold" style={{ color: '#00e676' }}>{stats.productionPoints}</span>
        </div>
        <div className="h-1.5 bg-input w-full">
          <div className="h-full bg-primary/70" style={{ width: `${Math.min(100, (stats.productionPoints / 300) * 100)}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-widest">Maintenance Cost</span>
          <span className="font-bold" style={{ color: '#ff4444' }}>-{stats.maintenanceCost}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-widest">Trade Income</span>
          <span className="font-bold" style={{ color: '#4a8a4a' }}>+{tradeIncome}</span>
        </div>
      </div>

      <div className="border-t border-border pt-2 mt-1">
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4a5a4a' }}>Controlled Territories</div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {aligned.map(c => (
            <div key={c.id} className="flex justify-between text-xs px-2 py-1" style={{ background: '#0a0a0a' }}>
              <span style={{ color: '#8aaa8a' }}>{c.name}</span>
              <span style={{ color: '#4a8a4a' }}>{c.productionPoints} PP</span>
            </div>
          ))}
        </div>
      </div>

      {buildQueue.length > 0 && (
        <div className="border-t border-border pt-2 mt-1">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4a5a4a' }}>Build Queue</div>
          <div className="space-y-1">
            {buildQueue.map((q, i) => (
              <div key={i} className="flex justify-between text-xs px-2 py-1" style={{ background: '#0a0a0a' }}>
                <span style={{ color: '#8aaa8a' }}>{q.unitType} in {countries[q.countryId]?.name}</span>
                <span style={{ color: '#ffdd44' }}>{q.turnsRemaining}t</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
