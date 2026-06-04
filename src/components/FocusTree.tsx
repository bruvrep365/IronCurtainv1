import { FocusTree as FocusTreeType, FocusNode, FocusCategory } from '../lib/types';

interface FocusTreeProps {
  tree: FocusTreeType;
  playerFaction: 'usa' | 'ussr';
  onClose: () => void;
  onStartFocus: (nodeId: string) => void;
}

const COLORS: Record<FocusCategory, { bg: string; border: string; text: string }> = {
  economic: { bg: '#0d2a0d', border: '#1a5a1a', text: '#4a8a4a' },
  military: { bg: '#0d1a2a', border: '#1a3a5a', text: '#4a6a8a' },
  intelligence: { bg: '#1a0d2a', border: '#3a1a5a', text: '#6a4a8a' },
};

const STATUS_COLORS: Record<string, string> = {
  locked: '#333',
  available: '#00e676',
  researching: '#ffdd44',
  completed: '#00ff88',
};

export function FocusTree({ tree, playerFaction, onClose, onStartFocus }: FocusTreeProps) {
  const cols: FocusCategory[] = ['economic', 'military', 'intelligence'];
  const colNames = ['ECONOMIC', 'MILITARY', 'INTELLIGENCE'];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-widest uppercase" style={{ color: '#00e676', textShadow: '0 0 20px rgba(0,230,118,0.3)' }}>
          NATIONAL FOCUS TREE
        </h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-primary text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-background"
        >
          CLOSE
        </button>
      </div>
      <div className="text-xs mb-4" style={{ color: '#4a8a4a' }}>
        Active focus: {tree.activeNodeId ? tree.nodes.find(n => n.id === tree.activeNodeId)?.name : 'NONE'}
      </div>

      <div className="flex-1 flex gap-6 overflow-auto">
        {cols.map((cat, ci) => {
          const nodes = tree.nodes.filter(n => n.category === cat).sort((a, b) => a.y - b.y);
          const color = COLORS[cat];
          return (
            <div key={cat} className="flex-1 flex flex-col gap-4 min-w-[280px]">
              <div className="text-center text-xs font-bold uppercase tracking-widest py-2 border-b-2" style={{ borderColor: color.border, color: color.text }}>
                {colNames[ci]}
              </div>
              {nodes.map((node, ni) => {
                const isLocked = node.status === 'locked';
                const isResearching = node.status === 'researching';
                const isCompleted = node.status === 'completed';
                const canStart = node.status === 'available' && !tree.activeNodeId;
                return (
                  <div key={node.id} className="relative">
                    {ni > 0 && (
                      <div className="absolute -top-4 left-1/2 w-px h-4" style={{ background: isCompleted ? color.text : '#333' }} />
                    )}
                    <div
                      className="border p-3 cursor-pointer transition-all"
                      style={{
                        background: isCompleted ? color.bg + '88' : isResearching ? color.bg + 'cc' : isLocked ? '#0a0a0a' : color.bg,
                        borderColor: isCompleted ? color.text : isResearching ? '#ffdd44' : isLocked ? '#222' : color.border,
                        opacity: isLocked ? 0.5 : 1,
                      }}
                      onClick={() => canStart && onStartFocus(node.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isCompleted ? color.text : '#8aaa8a' }}>
                          {node.name}
                        </span>
                        <span className="text-xs" style={{ color: STATUS_COLORS[node.status] }}>
                          {isCompleted ? 'COMPLETED' : isResearching ? `${node.turnsRemaining} TURNS` : isLocked ? 'LOCKED' : 'AVAILABLE'}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#4a5a4a', lineHeight: 1.4 }}>{node.description}</p>
                      {node.prerequisites.length > 0 && (
                        <div className="text-xs mt-1" style={{ color: '#333' }}>
                          Requires: {node.prerequisites.map(p => tree.nodes.find(n => n.id === p)?.name).join(', ')}
                        </div>
                      )}
                      {node.effects && (
                        <div className="text-xs mt-1 flex gap-2 flex-wrap">
                          {node.effects.gdp && <span style={{ color: '#4a8a4a' }}>GDP +{node.effects.gdp}</span>}
                          {node.effects.prestige && <span style={{ color: '#4a8a4a' }}>PRE +{node.effects.prestige}</span>}
                          {node.effects.military && <span style={{ color: '#4a6a8a' }}>MIL +{node.effects.military}</span>}
                          {node.effects.tension && <span style={{ color: '#8a4a4a' }}>TENS {node.effects.tension > 0 ? '+' : ''}{node.effects.tension}</span>}
                          {node.effects.unlockUnit && <span style={{ color: '#4a6a8a' }}>UNLOCK {node.effects.unlockUnit}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
