import { useState, useRef, type JSX } from 'react';
import { FocusTree as FocusTreeType, FocusNode, FocusCategory, PoliticalPath } from '../lib/types';

interface FocusTreeProps {
  tree: FocusTreeType;
  playerFaction: 'usa' | 'ussr';
  onClose: () => void;
  onStartFocus: (nodeId: string) => void;
  onChoosePoliticalPath?: (path: PoliticalPath) => void;
}

type Tab = 'economic' | 'military' | 'intelligence' | 'political';

const TAB_CONFIG: { id: Tab; label: string; color: { bg: string; border: string; text: string; accent: string } }[] = [
  { id: 'economic',     label: 'ECONOMIC',     color: { bg: '#0d2a0d', border: '#1a5a1a', text: '#4ab84a', accent: '#00e676' } },
  { id: 'military',     label: 'MILITARY',     color: { bg: '#0d1a2a', border: '#1a3a5a', text: '#4a7abf', accent: '#4a9aff' } },
  { id: 'intelligence', label: 'INTELLIGENCE', color: { bg: '#1a0d2a', border: '#3a1a5a', text: '#8a4abf', accent: '#b07aff' } },
  { id: 'political',    label: 'POLITICAL',    color: { bg: '#2a1a0d', border: '#5a3a1a', text: '#bf8a30', accent: '#e6c060' } },
];

const STATUS_COLORS: Record<string, string> = {
  locked:      '#3a3a3a',
  available:   '#00e676',
  researching: '#ffdd44',
  completed:   '#00ff88',
};

// --- Static tree (original style) for economic/military/intelligence ---

function EffectTags({ effects }: { effects: FocusNode['effects'] }) {
  const tags: { label: string; color: string }[] = [];
  if (effects.gdp)            tags.push({ label: `GDP +${effects.gdp}`,         color: '#4ab84a' });
  if (effects.prestige)       tags.push({ label: `PRE +${effects.prestige}`,     color: '#4ab84a' });
  if (effects.military)       tags.push({ label: `MIL +${effects.military}`,     color: '#4a7abf' });
  if (effects.tension && effects.tension > 0) tags.push({ label: `TENS +${effects.tension}`, color: '#bf4a4a' });
  if (effects.tension && effects.tension < 0) tags.push({ label: `TENS ${effects.tension}`,  color: '#4ab84a' });
  if (effects.nuclearWarheads)  tags.push({ label: `NUKES +${effects.nuclearWarheads}`, color: '#ff4444' });
  if (effects.researchPoints)   tags.push({ label: `RES +${effects.researchPoints}`,    color: '#8a4abf' });
  if (effects.unlockUnit)       tags.push({ label: `UNLOCK ${effects.unlockUnit.toUpperCase()}`, color: '#4a7abf' });
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map((t, i) => (
        <span key={i} className="text-xs px-1" style={{ color: t.color, background: t.color + '18', border: `1px solid ${t.color}44` }}>
          {t.label}
        </span>
      ))}
    </div>
  );
}

function StaticNode({
  node, tree, color, onStartFocus,
}: {
  node: FocusNode;
  tree: FocusTreeType;
  color: { bg: string; border: string; text: string; accent: string };
  onStartFocus: (id: string) => void;
}) {
  const isLocked      = node.status === 'locked';
  const isResearching = node.status === 'researching';
  const isCompleted   = node.status === 'completed';
  const isAvailable   = node.status === 'available';
  const canStart      = isAvailable && !tree.activeNodeId;
  const isActive      = tree.activeNodeId === node.id;

  const borderColor = isCompleted   ? color.accent
                    : isResearching ? '#ffdd44'
                    : isActive      ? '#ffdd44'
                    : isAvailable   ? color.border
                    : '#1e1e1e';

  const bgColor = isCompleted   ? color.bg + 'cc'
                : isResearching ? color.bg + 'dd'
                : isAvailable   ? color.bg
                : '#090909';

  return (
    <div
      className="transition-all duration-150 select-none"
      style={{
        border: `1px solid ${borderColor}`,
        background: bgColor,
        opacity: isLocked ? 0.4 : 1,
        cursor: canStart ? 'pointer' : 'default',
        padding: '10px 14px',
        boxShadow: isAvailable ? `0 0 10px ${color.border}44` : isActive ? `0 0 12px rgba(255,221,68,0.25)` : 'none',
      }}
      onClick={() => canStart && onStartFocus(node.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: isCompleted ? color.accent : isLocked ? '#3a4a3a' : '#aacaaa' }}>
              {node.icon} {node.name}
            </span>
            <span className="text-xs font-mono shrink-0" style={{ color: STATUS_COLORS[node.status] }}>
              {isCompleted   ? '✓ DONE'
              : isResearching ? `${node.turnsRemaining}t left`
              : isAvailable   ? 'AVAILABLE'
              : 'LOCKED'}
            </span>
          </div>
          <p className="text-xs leading-snug mb-1" style={{ color: isLocked ? '#2a3a2a' : '#5a6a5a' }}>{node.description}</p>
          {node.prerequisites.length > 0 && (
            <div className="text-xs" style={{ color: '#3a4a3a' }}>
              Requires: {node.prerequisites.map(p => tree.nodes.find(n => n.id === p)?.name ?? p).join(', ')}
            </div>
          )}
          <EffectTags effects={node.effects} />
        </div>
        <div className="shrink-0 text-right">
          {canStart && (
            <div className="text-xs font-bold px-2 py-1 border mt-1" style={{ borderColor: color.border, color: color.accent, background: color.bg }}>
              {node.turnsRequired}T — START
            </div>
          )}
          {isResearching && (
            <div className="text-xs font-bold px-2 py-1 border mt-1" style={{ borderColor: '#ffdd4466', color: '#ffdd44', background: '#1a1a0a' }}>
              IN PROGRESS
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StaticTreePanel({
  nodes, tree, color, onStartFocus,
}: {
  nodes: FocusNode[];
  tree: FocusTreeType;
  color: { bg: string; border: string; text: string; accent: string };
  onStartFocus: (id: string) => void;
}) {
  // Group nodes by row (y-coord) for a clean tier layout
  const rows = new Map<number, FocusNode[]>();
  nodes.forEach(n => {
    if (!rows.has(n.y)) rows.set(n.y, []);
    rows.get(n.y)!.push(n);
  });
  const sortedRows = [...rows.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {sortedRows.map(([row, rowNodes]) => (
          <div key={row}>
            <div className="text-xs uppercase tracking-widest mb-2 font-bold" style={{ color: color.border }}>
              Tier {row + 1}
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(rowNodes.length, 3)}, 1fr)` }}>
              {rowNodes.sort((a, b) => a.x - b.x).map(node => (
                <StaticNode key={node.id} node={node} tree={tree} color={color} onStartFocus={onStartFocus} />
              ))}
            </div>
          </div>
        ))}
        {nodes.length === 0 && (
          <div className="text-xs text-center py-12" style={{ color: '#3a4a3a' }}>No nodes in this category.</div>
        )}
      </div>
    </div>
  );
}

// --- Political subtree (draggable canvas + choice screen) ---

const POL_NODE_W = 220;
const POL_NODE_H = 110;
const POL_COL_GAP = 60;
const POL_ROW_GAP = 24;

function PolNodeCard({
  node, tree, onStartFocus,
}: {
  node: FocusNode;
  tree: FocusTreeType;
  onStartFocus: (id: string) => void;
}) {
  const pathColor = node.id.startsWith('sp_s') ? { bg: '#1a0808', border: '#8a1a1a', text: '#ff6666', accent: '#ff4444' }
                  : node.id.startsWith('sp_r') ? { bg: '#081a10', border: '#1a5a3a', text: '#4ab84a', accent: '#00e676' }
                  : { bg: '#2a1a0d', border: '#5a3a1a', text: '#bf8a30', accent: '#e6c060' };

  const isLocked      = node.status === 'locked';
  const isResearching = node.status === 'researching';
  const isCompleted   = node.status === 'completed';
  const isAvailable   = node.status === 'available';
  const canStart      = isAvailable && !tree.activeNodeId;
  const isActive      = tree.activeNodeId === node.id;

  const borderColor = isCompleted   ? pathColor.accent
                    : isResearching ? '#ffdd44'
                    : isActive      ? '#ffdd44'
                    : isAvailable   ? pathColor.border
                    : '#1e1e1e';

  return (
    <div
      className="transition-all duration-150 select-none"
      style={{
        width: POL_NODE_W,
        minHeight: POL_NODE_H,
        border: `1px solid ${borderColor}`,
        background: isCompleted ? pathColor.bg + 'cc' : isAvailable ? pathColor.bg : '#090909',
        opacity: isLocked ? 0.4 : 1,
        cursor: canStart ? 'pointer' : 'default',
        padding: '10px 12px',
        boxShadow: isAvailable ? `0 0 8px ${pathColor.border}55` : 'none',
      }}
      onClick={() => canStart && onStartFocus(node.id)}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="text-xs font-bold uppercase tracking-wide leading-tight" style={{ color: isCompleted ? pathColor.accent : '#aacaaa', maxWidth: 130 }}>
          {node.name}
        </span>
        <span className="text-xs shrink-0 font-mono" style={{ color: STATUS_COLORS[node.status] }}>
          {isCompleted   ? '✓ DONE'
          : isResearching ? `${node.turnsRemaining}t`
          : isAvailable   ? 'START'
          : 'LOCKED'}
        </span>
      </div>
      <p className="text-xs leading-snug" style={{ color: '#5a6a5a' }}>{node.description}</p>
      {node.prerequisites.length > 0 && (
        <div className="text-xs mt-1" style={{ color: '#3a3a3a' }}>
          Req: {node.prerequisites.map(p => tree.nodes.find(n => n.id === p)?.name ?? p).join(', ')}
        </div>
      )}
      <EffectTags effects={node.effects} />
      {canStart && (
        <div className="text-xs mt-2 font-bold tracking-widest" style={{ color: pathColor.accent }}>
          [{node.turnsRequired} TURNS] CLICK TO START
        </div>
      )}
    </div>
  );
}

function PolConnectorLines({
  nodes, positions,
}: {
  nodes: FocusNode[];
  positions: Map<string, { x: number; y: number }>;
}) {
  const lines: JSX.Element[] = [];
  nodes.forEach(node => {
    const to = positions.get(node.id);
    if (!to) return;
    node.prerequisites.forEach(prereqId => {
      const from = positions.get(prereqId);
      if (!from) return;
      const x1 = from.x + POL_NODE_W / 2;
      const y1 = from.y + POL_NODE_H;
      const x2 = to.x + POL_NODE_W / 2;
      const y2 = to.y;
      const prereqNode = nodes.find(n => n.id === prereqId);
      const lineColor = prereqNode?.status === 'completed'
        ? (node.id.startsWith('sp_s') ? '#8a1a1a' : node.id.startsWith('sp_r') ? '#1a5a3a' : '#5a3a1a')
        : '#2a2a2a';
      lines.push(
        <path
          key={`${prereqId}->${node.id}`}
          d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.5}
          strokeDasharray={prereqNode?.status === 'completed' ? undefined : '4 3'}
          opacity={0.7}
        />
      );
    });
  });
  return <>{lines}</>;
}

function buildPolPositions(nodes: FocusNode[]): { positions: Map<string, { x: number; y: number }>; totalW: number; totalH: number } {
  const positions = new Map<string, { x: number; y: number }>();
  let maxX = 0;
  let maxY = 0;
  nodes.forEach(n => {
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  });
  nodes.forEach(n => {
    positions.set(n.id, {
      x: n.x * (POL_NODE_W + POL_COL_GAP),
      y: n.y * (POL_NODE_H + POL_ROW_GAP),
    });
  });
  return {
    positions,
    totalW: (maxX + 1) * (POL_NODE_W + POL_COL_GAP),
    totalH: (maxY + 1) * (POL_NODE_H + POL_ROW_GAP),
  };
}

function PoliticalCanvas({
  nodes, tree, onStartFocus,
}: {
  nodes: FocusNode[];
  tree: FocusTreeType;
  onStartFocus: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollX: 0, scrollY: 0 });

  const { positions, totalW, totalH } = buildPolPositions(nodes);
  const canvasW = totalW + POL_COL_GAP;
  const canvasH = totalH + POL_ROW_GAP + 40;

  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, scrollX: scrollRef.current?.scrollLeft ?? 0, scrollY: scrollRef.current?.scrollTop ?? 0 });
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging || !scrollRef.current) return;
    scrollRef.current.scrollLeft = dragStart.scrollX - (e.clientX - dragStart.x);
    scrollRef.current.scrollTop  = dragStart.scrollY - (e.clientY - dragStart.y);
  }
  function onMouseUp() { setIsDragging(false); }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-auto relative"
      style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div style={{ width: canvasW, height: canvasH, position: 'relative', minWidth: '100%', minHeight: '100%' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: canvasW, height: canvasH, pointerEvents: 'none' }}>
          <PolConnectorLines nodes={nodes} positions={positions} />
        </svg>
        {nodes.map(node => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          return (
            <div key={node.id} data-node="true" style={{ position: 'absolute', left: pos.x, top: pos.y }}>
              <PolNodeCard node={node} tree={tree} onStartFocus={onStartFocus} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PoliticalChoiceScreen({ onChoose }: { onChoose: (path: PoliticalPath) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8" style={{ background: '#08100a' }}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#bf8a30' }}>IDEOLOGICAL CROSSROADS</div>
        <h3 className="text-2xl font-bold uppercase tracking-widest mb-3" style={{ color: '#e6c060', textShadow: '0 0 20px rgba(230,192,96,0.3)' }}>
          Choose the Soviet Path
        </h3>
        <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#5a6a5a' }}>
          The direction of the Soviet state must be decided. This choice is permanent and will define your political strategy for the remainder of the Cold War.
        </p>
      </div>
      <div className="flex gap-8">
        <button
          onClick={() => onChoose('stalinist')}
          className="flex flex-col gap-3 p-6 border-2 text-left transition-all duration-200 hover:scale-105"
          style={{ width: 280, borderColor: '#8a1a1a', background: '#1a0808', boxShadow: '0 0 20px rgba(138,26,26,0.2)' }}
        >
          <div className="text-3xl text-center" style={{ color: '#ff4444' }}>☭</div>
          <div className="text-lg font-bold uppercase tracking-widest" style={{ color: '#ff6666' }}>STALINIST PATH</div>
          <div className="text-xs leading-relaxed" style={{ color: '#8a5a5a' }}>
            Rule through fear and iron discipline. Purges, collectivization, and the cult of personality. High tension but overwhelming military and economic power.
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-xs" style={{ color: '#bf4a4a' }}>+ Strong GDP & Military</div>
            <div className="text-xs" style={{ color: '#bf4a4a' }}>+ Nuclear superiority</div>
            <div className="text-xs" style={{ color: '#ff9944' }}>– High tension risk</div>
            <div className="text-xs" style={{ color: '#ff9944' }}>– Alienates neutral nations</div>
          </div>
        </button>
        <button
          onClick={() => onChoose('reformist')}
          className="flex flex-col gap-3 p-6 border-2 text-left transition-all duration-200 hover:scale-105"
          style={{ width: 280, borderColor: '#1a5a3a', background: '#081a10', boxShadow: '0 0 20px rgba(26,90,58,0.2)' }}
        >
          <div className="text-3xl text-center" style={{ color: '#4ab84a' }}>☀</div>
          <div className="text-lg font-bold uppercase tracking-widest" style={{ color: '#4ab84a' }}>REFORMIST PATH</div>
          <div className="text-xs leading-relaxed" style={{ color: '#4a6a4a' }}>
            Glasnost, Perestroika, and de-Stalinization. Build soft power through diplomacy, economic openness, and arms reduction. Lower tension but slower military growth.
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-xs" style={{ color: '#4ab84a' }}>+ Tension reduction</div>
            <div className="text-xs" style={{ color: '#4ab84a' }}>+ Diplomatic prestige</div>
            <div className="text-xs" style={{ color: '#bf9944' }}>– Weaker military</div>
            <div className="text-xs" style={{ color: '#bf9944' }}>– Slower economic growth</div>
          </div>
        </button>
      </div>
    </div>
  );
}

function PoliticalTab({
  tree, onStartFocus, onChoosePoliticalPath,
}: {
  tree: FocusTreeType;
  onStartFocus: (id: string) => void;
  onChoosePoliticalPath?: (path: PoliticalPath) => void;
}) {
  const sp0 = tree.nodes.find(n => n.id === 'sp0');
  const sp0Done = sp0?.status === 'completed';
  const pathChosen = !!tree.politicalPath;

  if (sp0Done && !pathChosen && onChoosePoliticalPath) {
    return <PoliticalChoiceScreen onChoose={onChoosePoliticalPath} />;
  }

  const allPolitical = tree.nodes.filter(n => n.category === 'political');
  const visibleNodes = pathChosen
    ? allPolitical.filter(n => n.id === 'sp0' || (tree.politicalPath === 'stalinist' ? n.id.startsWith('sp_s') : n.id.startsWith('sp_r')))
    : allPolitical.filter(n => n.id === 'sp0');

  const remapped = visibleNodes.map(n => {
    if (n.id === 'sp0') return { ...n, x: 0, y: 0 };
    return { ...n, x: 0 };
  });

  const pathLabel = tree.politicalPath === 'stalinist' ? 'STALINIST PATH'
                  : tree.politicalPath === 'reformist'  ? 'REFORMIST PATH'
                  : 'CHOOSE YOUR PATH';
  const pathColor = tree.politicalPath === 'stalinist' ? '#ff6666'
                  : tree.politicalPath === 'reformist'  ? '#4ab84a'
                  : '#bf8a30';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-2 border-b shrink-0" style={{ borderColor: '#3a2a0d' }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: pathColor }}>{pathLabel}</span>
        {!pathChosen && sp0 && sp0.status !== 'completed' && (
          <span className="text-xs" style={{ color: '#4a4a3a' }}>
            Complete "Ideological Direction" to unlock path choice
          </span>
        )}
        {pathChosen && (
          <span className="text-xs" style={{ color: '#4a4a3a' }}>DRAG OR SCROLL TO NAVIGATE</span>
        )}
      </div>
      <PoliticalCanvas nodes={remapped} tree={tree} onStartFocus={onStartFocus} />
    </div>
  );
}

// --- Main FocusTree component ---

export function FocusTree({ tree, playerFaction, onClose, onStartFocus, onChoosePoliticalPath }: FocusTreeProps) {
  const [activeTab, setActiveTab] = useState<Tab>('economic');
  const tabConfig = TAB_CONFIG.find(t => t.id === activeTab)!;

  const activeNode = tree.activeNodeId ? tree.nodes.find(n => n.id === tree.activeNodeId) : null;
  const tabNodes = tree.nodes.filter(n => n.category === (activeTab as FocusCategory));

  return (
    <div className="fixed inset-0 bg-black/92 z-50 flex flex-col overflow-hidden" style={{ fontFamily: 'Space Mono, monospace' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ borderColor: '#1a2a1a', background: '#060e06' }}>
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-widest uppercase" style={{ color: '#00e676', textShadow: '0 0 16px rgba(0,230,118,0.3)' }}>
            NATIONAL FOCUS TREE
          </h2>
          <span className="text-xs uppercase tracking-widest" style={{ color: '#3a5a3a' }}>
            {playerFaction === 'ussr' ? '☭ USSR' : '★ USA'}
          </span>
        </div>
        <div className="flex items-center gap-6">
          {activeNode ? (
            <div className="text-xs" style={{ color: '#ffdd44' }}>
              ACTIVE: <span className="font-bold">{activeNode.name}</span>
              <span className="ml-2" style={{ color: '#4a5a4a' }}>({activeNode.turnsRemaining} turns left)</span>
            </div>
          ) : (
            <div className="text-xs" style={{ color: '#3a4a3a' }}>No active focus</div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ borderColor: '#1a5a1a', color: '#4a8a4a', background: '#0d1a0d' }}
          >
            CLOSE [ESC]
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b shrink-0" style={{ borderColor: '#1a2a1a', background: '#060e06' }}>
        {TAB_CONFIG.map(tab => {
          if (tab.id === 'political' && playerFaction !== 'ussr') return null;
          const isActive = activeTab === tab.id;
          const hasPoliticalAlert = tab.id === 'political'
            && !!tree.nodes.find(n => n.id === 'sp0' && n.status === 'completed')
            && !tree.politicalPath;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors relative"
              style={{
                background: isActive ? tab.color.bg : 'transparent',
                color: isActive ? tab.color.accent : '#3a4a3a',
                borderBottom: isActive ? `2px solid ${tab.color.accent}` : '2px solid transparent',
              }}
            >
              {tab.label}
              {hasPoliticalAlert && (
                <span className="ml-1 text-xs" style={{ color: '#ffdd44' }}>●</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'political' ? (
        <PoliticalTab tree={tree} onStartFocus={onStartFocus} onChoosePoliticalPath={onChoosePoliticalPath} />
      ) : (
        <StaticTreePanel
          nodes={tabNodes}
          tree={tree}
          color={tabConfig.color}
          onStartFocus={onStartFocus}
        />
      )}
    </div>
  );
}
