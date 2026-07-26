import { Unit, Country, UnitType } from '../lib/types';
import { UNIT_TYPES } from '../lib/constants';

interface UnitPanelProps {
  selectedCountry: Country | null;
  units: Record<string, Unit>;
  playerFaction: 'usa' | 'ussr';
  selectedUnitId: string | null;
  countries: Record<string, Country>;
  onSelectUnit: (id: string | null) => void;
  onMoveUnit: (targetCountry: string) => void;
  onAttack: (targetCountry: string) => void;
  onBuildUnit: (unitType: UnitType, countryId: string) => void;
  productionPoints: number;
  actionPoints: number;
}

const TYPE_ICONS: Record<UnitType, string> = {
  infantry: 'I',
  armor: 'A',
  air: 'R',
  navy: 'N',
};

const TYPE_COLORS: Record<UnitType, string> = {
  infantry: '#4a8a4a',
  armor: '#4a6a8a',
  air: '#6a4a8a',
  navy: '#4a8a6a',
};

export function UnitPanel({ selectedCountry, units, playerFaction, selectedUnitId, countries, onSelectUnit, onMoveUnit, onAttack, onBuildUnit, productionPoints, actionPoints }: UnitPanelProps) {
  const countryUnits = selectedCountry
    ? Object.values(units).filter(u => u.countryId === selectedCountry.id && u.owner === playerFaction)
    : [];
  const enemyUnits = selectedCountry
    ? Object.values(units).filter(u => u.countryId === selectedCountry.id && u.owner !== playerFaction)
    : [];

  const selectedUnit = selectedUnitId ? units[selectedUnitId] : null;

  const canMoveTo = (unit: Unit | null, target: string) => {
    if (!unit || !countries[unit.countryId]) return false;
    const current = countries[unit.countryId];
    const dest = countries[target];
    if (!dest) return false;
    if (unit.movesThisTurn > 0) return false;
    const adjacent = current.neighbors.includes(target);
    const hasNavy = Object.values(units).some(u => u.owner === playerFaction && u.type === 'navy' && u.countryId === unit.countryId);
    const canReach = adjacent || (hasNavy && dest.coastal && current.coastal);
    if (!canReach) return false;
    const isOwn = (playerFaction === 'usa' && target === 'usa') || (playerFaction === 'ussr' && target === 'ussr');
    if (isOwn) return true;
    const isEnemy = playerFaction === 'usa'
      ? (dest.alignment === 'warsaw' || dest.alignment === 'communist')
      : (dest.alignment === 'nato' || dest.alignment === 'western');
    const isAllied = playerFaction === 'usa'
      ? ((dest.alignment === 'nato' || dest.alignment === 'western') && target !== 'usa')
      : ((dest.alignment === 'warsaw' || dest.alignment === 'communist') && target !== 'ussr');
    if (isAllied) return false;
    if (dest.alignment === 'nonaligned') return false;
    return isEnemy;
  };

  const canAttack = (unit: Unit | null, target: string) => {
    if (!unit || !countries[unit.countryId]) return false;
    const current = countries[unit.countryId];
    const dest = countries[target];
    if (!dest) return false;
    if (unit.movesThisTurn > 0) return false;
    const adjacent = current.neighbors.includes(target);
    const hasNavy = Object.values(units).some(u => u.owner === playerFaction && u.type === 'navy' && u.countryId === unit.countryId);
    const canReach = adjacent || (hasNavy && dest.coastal && current.coastal);
    const isEnemy = playerFaction === 'usa'
      ? (dest.alignment === 'warsaw' || dest.alignment === 'communist')
      : (dest.alignment === 'nato' || dest.alignment === 'western');
    return canReach && isEnemy;
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
        UNIT COMMAND
      </div>

      {selectedUnit && (
        <div className="border p-2" style={{ borderColor: '#00aa44', background: '#0d1a0d' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold" style={{ color: TYPE_COLORS[selectedUnit.type] }}>
              {TYPE_ICONS[selectedUnit.type]} {UNIT_TYPES.find(u => u.type === selectedUnit.type)?.name}
            </span>
            <span className="text-xs" style={{ color: selectedUnit.movesThisTurn === 0 ? '#4a8a4a' : '#8a4a4a' }}>
              {selectedUnit.movesThisTurn === 0 ? 'READY' : 'MOVED'}
            </span>
          </div>
          <div className="text-xs" style={{ color: '#4a5a4a' }}>
            Strength: {selectedUnit.strength}/{selectedUnit.maxStrength}
            <br />Location: {countries[selectedUnit.countryId]?.name}
          </div>
          {selectedUnit.movesThisTurn === 0 && (
            <div className="mt-2 space-y-1">
              <div className="text-xs uppercase tracking-widest" style={{ color: '#4a5a4a' }}>Move to:</div>
              <div className="flex flex-wrap gap-1">
                {selectedUnit.countryId && countries[selectedUnit.countryId]?.neighbors.map(n => {
                  if (!canMoveTo(selectedUnit, n)) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => onMoveUnit(n)}
                      className="text-xs px-2 py-1 border"
                      style={{ borderColor: '#1a3a1a', color: '#4a8a4a', background: '#0d1a0d' }}
                    >
                      {countries[n]?.name}
                    </button>
                  );
                })}
                {selectedUnit.countryId && countries[selectedUnit.countryId]?.neighbors.map(n => {
                  if (!canAttack(selectedUnit, n)) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => onAttack(n)}
                      className="text-xs px-2 py-1 border"
                      style={{ borderColor: '#3a1a1a', color: '#ff4444', background: '#2a0d0d' }}
                    >
                      ATTACK {countries[n]?.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-xs uppercase tracking-widest" style={{ color: '#4a5a4a' }}>
        Stationed in {selectedCountry?.name || '—'}
      </div>

      {countryUnits.length > 0 ? (
        <div className="space-y-1">
          {countryUnits.map(u => (
            <button
              key={u.id}
              onClick={() => onSelectUnit(selectedUnitId === u.id ? null : u.id)}
              className="w-full text-left px-2 py-1.5 border text-xs flex items-center justify-between transition-colors"
              style={{
                borderColor: selectedUnitId === u.id ? '#00aa44' : '#222',
                background: selectedUnitId === u.id ? '#0d1a0d' : '#0a0a0a',
                color: TYPE_COLORS[u.type],
              }}
            >
              <span>
                <span className="font-bold mr-2">{TYPE_ICONS[u.type]}</span>
                {UNIT_TYPES.find(ut => ut.type === u.type)?.name}
                <span className="ml-2" style={{ color: '#4a5a4a' }}>{u.strength}/{u.maxStrength}</span>
              </span>
              <span className="text-xs" style={{ color: u.movesThisTurn === 0 ? '#4a8a4a' : '#3a3a3a' }}>
                {u.movesThisTurn === 0 ? 'READY' : 'MOVED'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-xs italic" style={{ color: '#3a3a3a' }}>No friendly units stationed here.</div>
      )}

      {enemyUnits.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest mt-3 mb-1" style={{ color: '#8a4a4a' }}>Enemy Forces</div>
          <div className="space-y-1">
            {enemyUnits.map(u => (
              <div key={u.id} className="px-2 py-1.5 border text-xs" style={{ borderColor: '#2a0d0d', color: '#8a4a4a' }}>
                <span className="font-bold mr-2">{TYPE_ICONS[u.type]}</span>
                {UNIT_TYPES.find(ut => ut.type === u.type)?.name}
                <span className="ml-2" style={{ color: '#4a5a4a' }}>{u.strength}/{u.maxStrength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Build Units */}
      <div className="mt-2 pt-3 border-t border-border">
        <div className="text-xs uppercase tracking-widest mb-2 flex justify-between">
          <span style={{ color: '#4a5a4a' }}>Production</span>
          <span style={{ color: '#00e676' }}>{productionPoints} PP</span>
        </div>
        <div className="space-y-1">
          {UNIT_TYPES.map(u => (
            <button
              key={u.id}
              onClick={() => selectedCountry && onBuildUnit(u.type, selectedCountry.id)}
              disabled={productionPoints < u.cost || actionPoints < 1}
              className="w-full text-left px-2 py-1.5 border text-xs flex items-center justify-between disabled:opacity-30"
              style={{ borderColor: '#222', color: '#8aaa8a', background: '#0a0a0a' }}
            >
              <span>
                <span className="font-bold mr-2" style={{ color: TYPE_COLORS[u.type] }}>{TYPE_ICONS[u.type]}</span>
                {u.name}
              </span>
              <span style={{ color: productionPoints >= u.cost ? '#4a8a4a' : '#8a4a4a' }}>
                {u.cost} PP | {u.buildTime}t
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
