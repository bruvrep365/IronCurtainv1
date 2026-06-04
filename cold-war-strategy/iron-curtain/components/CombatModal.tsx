import { CombatResult } from '../lib/types.js';

interface CombatModalProps {
  result: CombatResult;
  onDismiss: () => void;
}

export function CombatModal({ result, onDismiss }: CombatModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full border-2 p-6" style={{ background: '#080f08', borderColor: '#00aa44' }}>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#ff4444' }}>BATTLE REPORT</div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4" style={{ color: '#00e676' }}>
          {result.attackerCountry} vs {result.defenderCountry}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border p-3" style={{ borderColor: '#1a3a1a' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a8a4a' }}>ATTACKER</div>
            <div className="text-sm font-bold mb-1">{result.attackerCountry}</div>
            <div className="text-xs" style={{ color: '#4a5a4a' }}>Losses: {result.attackerLosses}</div>
            <div className="text-xs" style={{ color: '#4a5a4a' }}>Remaining: {result.attackerRemaining}</div>
          </div>
          <div className="border p-3" style={{ borderColor: '#3a1a1a' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#8a4a4a' }}>DEFENDER</div>
            <div className="text-sm font-bold mb-1">{result.defenderCountry}</div>
            <div className="text-xs" style={{ color: '#4a5a4a' }}>Losses: {result.defenderLosses}</div>
            <div className="text-xs" style={{ color: '#4a5a4a' }}>Remaining: {result.defenderRemaining}</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-lg font-bold uppercase tracking-widest" style={{ color: result.winner === 'attacker' ? '#00e676' : '#ff4444' }}>
            {result.conquered ? 'VICTORY — TERRITORY CONQUERED' : result.winner === 'attacker' ? 'TACTICAL VICTORY' : 'DEFEAT'}
          </div>
          <div className="text-xs mt-1" style={{ color: '#4a5a4a' }}>{result.log}</div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3 font-bold text-sm uppercase tracking-widest border transition-colors hover:bg-primary hover:text-background"
          style={{ borderColor: '#00aa44', color: '#00e676' }}
        >
          DISMISS
        </button>
      </div>
    </div>
  );
}
