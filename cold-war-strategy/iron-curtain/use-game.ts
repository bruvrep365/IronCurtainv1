import { useState, useCallback } from 'react';
import { GameState, Faction, UnitType, CombatResult, EventChoice, FocusTree, FocusNode, Unit, ChinaCivilWar } from './lib/types.js';
import { INITIAL_STATE, EVENTS, UNIT_TYPES, getUnitBuild, CHINA_COMMUNIST_ADVANCE_ORDER, CHINA_NATIONALIST_ADVANCE_ORDER } from './lib/constants.js';

function resolveFocusNode(node: FocusNode, player: Faction, stats: GameState['usaStats']): GameState['usaStats'] {
  let nextStats = { ...stats };
  if (node.effects.gdp) nextStats.gdp += node.effects.gdp;
  if (node.effects.prestige) nextStats.prestige += node.effects.prestige;
  if (node.effects.military) nextStats.military = Math.min(100, nextStats.military + node.effects.military);
  if (node.effects.nuclearWarheads) nextStats.nuclearWarheads += node.effects.nuclearWarheads;
  if (node.effects.researchPoints) nextStats.researchPoints += node.effects.researchPoints;
  return nextStats;
}

function computeCombat(attacker: Unit[], defender: Unit[], attackerCountry: string, defenderCountry: string): CombatResult {
  const atkStrength = attacker.reduce((s, u) => s + u.strength, 0);
  const defStrength = defender.reduce((s, u) => s + u.strength, 0);
  const ratio = atkStrength / Math.max(1, defStrength);
  const atkRoll = Math.random() * 0.4 + 0.8;
  const defRoll = Math.random() * 0.4 + 0.8;
  const atkDamage = Math.round(atkStrength * 0.3 * atkRoll * ratio);
  const defDamage = Math.round(defStrength * 0.3 * defRoll / Math.max(0.5, ratio));
  const defLosses = Math.min(defDamage, defStrength);
  const atkLosses = Math.min(atkDamage, atkStrength);
  const defRemaining = Math.max(0, defStrength - defLosses);
  const atkRemaining = Math.max(0, atkStrength - atkLosses);
  const winner = atkRemaining > defRemaining ? 'attacker' as const : 'defender' as const;
  const conquered = winner === 'attacker' && defRemaining <= 0;
  return {
    attackerId: attacker.map(u => u.id).join(','),
    defenderId: defender.map(u => u.id).join(','),
    attackerState: attacker[0]?.countryId || '',
    defenderState: defender[0]?.countryId || '',
    attackerCountry,
    defenderCountry,
    attackerLosses: atkLosses,
    defenderLosses: defLosses,
    attackerRemaining: atkRemaining,
    defenderRemaining: defRemaining,
    winner,
    conquered,
    log: `${attackerCountry} ${conquered ? 'CONQUERED' : winner === 'attacker' ? 'defeated' : 'failed against'} ${defenderCountry} (${atkLosses} vs ${defLosses} losses)`,
  };
}

function getCountryUnits(state: GameState, countryId: string, faction: Faction): Unit[] {
  return Object.values(state.units).filter(u => u.countryId === countryId && u.owner === faction);
}

function canInvade(state: GameState, attackerCountry: string, targetCountry: string, attackerFaction: Faction): { ok: boolean; reason: string } {
  const attacker = state.countries[attackerCountry];
  const target = state.countries[targetCountry];
  if (!attacker || !target) return { ok: false, reason: 'Invalid target' };
  const isAttacker = attacker.alignment === 'nato' || attacker.alignment === 'western' || attacker.alignment === 'warsaw' || attacker.alignment === 'communist';
  const isTarget = target.alignment === 'nato' || target.alignment === 'western' || target.alignment === 'warsaw' || target.alignment === 'communist' || target.alignment === 'nonaligned';
  if (!isAttacker || !isTarget) return { ok: false, reason: 'Not invadable' };
  const sameFaction = attackerFaction === 'usa' && (attacker.alignment === 'nato' || attacker.alignment === 'western');
  const sameFactionUSSR = attackerFaction === 'ussr' && (attacker.alignment === 'warsaw' || attacker.alignment === 'communist');
  if (!sameFaction && !sameFactionUSSR) return { ok: false, reason: 'Not your territory' };
  const isEnemy = attackerFaction === 'usa' ? (target.alignment === 'warsaw' || target.alignment === 'communist') : (target.alignment === 'nato' || target.alignment === 'western');
  if (!isEnemy) return { ok: false, reason: 'Not an enemy' };
  const adjacent = attacker.neighbors.includes(targetCountry);
  const hasNavy = Object.values(state.units).some(u => u.owner === attackerFaction && u.type === 'navy' && u.countryId === attackerCountry);
  const canReach = adjacent || (hasNavy && target.coastal && attacker.coastal);
  if (!canReach) return { ok: false, reason: 'Not reachable (no border or navy)' };
  const atkUnits = getCountryUnits(state, attackerCountry, attackerFaction);
  if (atkUnits.length === 0) return { ok: false, reason: 'No units to attack' };
  return { ok: true, reason: '' };
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const DEFAULT_CCW: ChinaCivilWar = {
  communistStates: ['cn_manchuria', 'cn_mongolia', 'cn_beijing'],
  nationalistStates: ['cn_shanghai', 'cn_shanxi', 'cn_sichuan', 'cn_tibet', 'cn_yunnan', 'cn_guangdong', 'cn_xinjiang'],
  communistAid: 0,
  nationalistAid: 0,
  totalCommunistAid: 0,
  totalNationalistAid: 0,
  resolved: false,
  winner: null,
  consolidationMonths: 0,
  consolidated: false,
  stalemateStreak: 0,
  lastBattleDirection: 0,
  lastCommunistCount: 3,
};

/** Advance the Chinese Civil War one month based on aid balance. */
/**
 * How many months after the civil war ends before China fully consolidates.
 * 24 months = 2 in-game years of post-war stabilisation.
 */
const CHINA_CONSOLIDATION_MONTHS = 24;

/**
 * The war cannot resolve before October 1949 without significant outside support.
 * Historically accurate: the PRC was founded 1 October 1949.
 */
const CHINA_WAR_EARLY_END_YEAR = 1949;
const CHINA_WAR_EARLY_END_MONTH = 10;

/**
 * Net aid advantage required for a side to force an early (pre-deadline) win.
 * Below this threshold the losing side always bounces back with 1 province.
 */
const CHINA_AID_EARLY_WIN_THRESHOLD = 3;

/**
 * Base monthly chance that the communists advance one province (70%).
 * Each 1-point net aid advantage shifts the odds by 5%, capped at ±25%.
 */
const BASE_COMMUNIST_MONTHLY_WIN_CHANCE = 0.62;

function resolveChinaCivilWar(state: GameState, newYear: number, newMonth: number): { ccw: ChinaCivilWar; newEvent: GameState['activeEvent'] | undefined } {
  // Guard: if chinaCivilWar is missing (old save / pre-feature state), start fresh
  const ccw: ChinaCivilWar = state.chinaCivilWar
    ? {
        ...state.chinaCivilWar,
        consolidationMonths: state.chinaCivilWar.consolidationMonths ?? 0,
        consolidated: state.chinaCivilWar.consolidated ?? false,
        totalCommunistAid: state.chinaCivilWar.totalCommunistAid ?? 0,
        totalNationalistAid: state.chinaCivilWar.totalNationalistAid ?? 0,
        stalemateStreak: state.chinaCivilWar.stalemateStreak ?? 0,
        lastBattleDirection: state.chinaCivilWar.lastBattleDirection ?? 0,
        lastCommunistCount: state.chinaCivilWar.lastCommunistCount ?? state.chinaCivilWar.communistStates.length,
      }
    : { ...DEFAULT_CCW };

  // If already fully consolidated, nothing left to do
  if (ccw.consolidated) return { ccw, newEvent: undefined };

  // If war is resolved but not yet consolidated, advance consolidation
  if (ccw.resolved) {
    ccw.consolidationMonths = (ccw.consolidationMonths ?? 0) + 1;
    if (ccw.consolidationMonths >= CHINA_CONSOLIDATION_MONTHS) {
      ccw.consolidated = true;
    }
    return { ccw, newEvent: undefined };
  }

  // Guard: ensure arrays are always real arrays
  if (!Array.isArray(ccw.communistStates)) ccw.communistStates = [...DEFAULT_CCW.communistStates];
  if (!Array.isArray(ccw.nationalistStates)) ccw.nationalistStates = [...DEFAULT_CCW.nationalistStates];

  // --- Monthly battle roll ---
  // Province-win probability is determined by how much aid the player sent this turn:
  //   0 aid  → communists win 65% (historical lean, no intervention)
  //   1 aid  → player's allied side wins 55%
  //   2 aid  → player's allied side wins 60%
  //   3 aid  → player's allied side wins 65%
  const monthlyAdvantage = ccw.communistAid - ccw.nationalistAid;
  const playerFaction = state.playerFaction;
  const playerAid = playerFaction === 'ussr' ? ccw.communistAid : ccw.nationalistAid;

  let communistChance: number;
  if (playerAid === 0) {
    // No intervention this turn — communists have the historical 65% lean
    communistChance = 0.65;
  } else if (playerFaction === 'ussr') {
    // USSR backing communists
    communistChance = playerAid >= 3 ? 0.65 : playerAid === 2 ? 0.60 : 0.55;
  } else {
    // USA backing nationalists (flip: nationalist advantage)
    const nationalistChance = playerAid >= 3 ? 0.65 : playerAid === 2 ? 0.60 : 0.55;
    communistChance = 1 - nationalistChance;
  }

  // Stalemate-breaker: detect back-and-forth oscillation by tracking direction reversals.
  // If the battle has swapped direction (comm gain → nat gain → comm gain, or vice versa)
  // for 2 consecutive reversals, force the favoured side to push through unconditionally.
  const isStalemate = ccw.stalemateStreak >= 2;

  const communistAdvances = isStalemate
    ? (communistChance >= 0.5)   // break stalemate: favoured side always wins
    : (Math.random() < communistChance);

  const preBattleCount = ccw.communistStates.length;

  if (communistAdvances) {
    // Communists advance: take the next nationalist province
    const nextTarget = CHINA_COMMUNIST_ADVANCE_ORDER.find(p => ccw.nationalistStates.includes(p));
    if (nextTarget) {
      ccw.nationalistStates = ccw.nationalistStates.filter(p => p !== nextTarget);
      ccw.communistStates = [...ccw.communistStates, nextTarget];
    }
  } else {
    // Nationalists advance: take the next communist province (full list, not just the original 3)
    const nextTarget = CHINA_NATIONALIST_ADVANCE_ORDER.find(p => ccw.communistStates.includes(p));
    if (nextTarget) {
      ccw.communistStates = ccw.communistStates.filter(p => p !== nextTarget);
      ccw.nationalistStates = [...ccw.nationalistStates, nextTarget];
    }
  }

  // Track direction reversal for oscillation detection.
  // direction: +1 = communists gained, -1 = nationalists gained, 0 = no change.
  const thisDirection = ccw.communistStates.length > preBattleCount ? 1
    : ccw.communistStates.length < preBattleCount ? -1
    : 0;
  const lastDir = ccw.lastBattleDirection ?? 0;
  const reversed = thisDirection !== 0 && lastDir !== 0 && thisDirection !== lastDir;
  ccw.stalemateStreak = isStalemate ? 0 : (reversed ? ccw.stalemateStreak + 1 : ccw.stalemateStreak);
  ccw.lastBattleDirection = thisDirection !== 0 ? thisDirection : lastDir;
  ccw.lastCommunistCount = ccw.communistStates.length;

  // --- Check for resolution ---
  // Before October 1949, the war cannot end without significant outside support.
  // The losing side bounces back with 1 province instead of being eliminated.
  const beforeDeadline =
    newYear < CHINA_WAR_EARLY_END_YEAR ||
    (newYear === CHINA_WAR_EARLY_END_YEAR && newMonth < CHINA_WAR_EARLY_END_MONTH);
  // Sending max aid (3) in one turn counts as significant outside support,
  // allowing an early resolution before the October 1949 deadline.
  const hasOutsideSupport = playerAid >= CHINA_AID_EARLY_WIN_THRESHOLD;

  let newEvent: GameState['activeEvent'] | undefined;

  if (ccw.nationalistStates.length === 0) {
    if (beforeDeadline && !hasOutsideSupport) {
      // Bounce back: nationalists cling on with one province
      const bounce = CHINA_NATIONALIST_ADVANCE_ORDER.find(p => ccw.communistStates.includes(p));
      const fallback = CHINA_COMMUNIST_ADVANCE_ORDER[CHINA_COMMUNIST_ADVANCE_ORDER.length - 1];
      const retreat = bounce ?? fallback;
      ccw.communistStates = ccw.communistStates.filter(p => p !== retreat);
      ccw.nationalistStates = [retreat];
    } else {
      ccw.resolved = true;
      ccw.winner = 'communist';
      newEvent = {
        id: 'e_prc',
        year: newYear,
        month: newMonth,
        title: "People's Republic of China Founded",
        description: '"Without the Communist Party, there would be no new China."\n\n\u2014 Mao Zedong\n\nThe Communist Party of China has won the civil war. The People\'s Republic of China is proclaimed in Beijing. Taiwan becomes the last stronghold of the Nationalist government.',
        faction: 'both',
        choices: [
          { id: 'c1', text: 'Recognize the new government (reduce tension)', effect: (s) => ({ tension: Math.max(0, s.tension - 5), ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 10 } }) },
          { id: 'c2', text: 'Support Taiwan \u2014 do not recognize the PRC', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 10 } }) },
        ],
      };
    }
  } else if (ccw.communistStates.length === 0) {
    if (beforeDeadline && !hasOutsideSupport) {
      // Bounce back: communists cling on with one province
      const bounce = CHINA_COMMUNIST_ADVANCE_ORDER.find(p => ccw.nationalistStates.includes(p));
      const fallback = CHINA_NATIONALIST_ADVANCE_ORDER[CHINA_NATIONALIST_ADVANCE_ORDER.length - 1];
      const retreat = bounce ?? fallback;
      ccw.nationalistStates = ccw.nationalistStates.filter(p => p !== retreat);
      ccw.communistStates = [retreat];
    } else {
      ccw.resolved = true;
      ccw.winner = 'nationalist';
      newEvent = {
        id: 'e_roc',
        year: newYear,
        month: newMonth,
        title: 'Nationalist Victory in China',
        description: '"Externally China desires independence, internally she seeks to maintain her existence as a nation; China therefore strives to loose the bonds that bind her people, and to complete the establishment of a new State."\n\n\u2014 Chiang Kai-shek\n\nThe Republic of China has defeated the Communist insurgency. The Nationalist government under Chiang Kai-shek retains control of the Chinese mainland. The communists have been driven from their strongholds.',
        faction: 'both',
        choices: [
          { id: 'c1', text: 'Strengthen ties with Nationalist China', effect: (s) => ({ tension: Math.max(0, s.tension - 5), usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 15 } }) },
          { id: 'c2', text: 'Acknowledge the result, maintain distance', effect: (s) => ({ tension: s.tension, ussrStats: { ...s.ussrStats, prestige: Math.max(0, s.ussrStats.prestige - 10) } }) },
        ],
      };
    }
  }

  // Reset monthly aid counters so next month starts fresh
  ccw.communistAid = 0;
  ccw.nationalistAid = 0;

  return { ccw, newEvent };
}

function resolveTurnEnd(state: GameState): Partial<GameState> {
  const newMonth = (state.month % 12) + 1;
  const newYear = newMonth === 1 ? state.year + 1 : state.year;
  // Each turn the Cold War ratchets up: either +1 or +1.5 baseline tension.
  const baseTensionRise = Math.random() < 0.5 ? 1 : 1.5;
  let newTension = state.tension + baseTensionRise;
  let newStatus = state.status;
  let winner: GameState['winner'] = null;
  let reason: string | null = null;

  if (newTension >= 100) {
    newStatus = 'gameover';
    winner = 'none';
    reason = 'Nuclear Annihilation. Tension reached 100.';
  } else if (newYear > 1991) {
    newStatus = 'gameover';
    const usaP = state.usaStats.prestige;
    const ussrP = state.ussrStats.prestige;
    if (usaP > ussrP + 60) { winner = 'usa'; reason = 'Prestige Victory (USA)'; }
    else if (ussrP > usaP + 60) { winner = 'ussr'; reason = 'Prestige Victory (USSR)'; }
    else { winner = 'none'; reason = 'Stalemate'; }
  }

  // Trigger events at their historically accurate year + month
  const scheduledEvent = EVENTS.find(e => e.year === newYear && e.month === newMonth && (e.faction === state.playerFaction || e.faction === 'both'));

  // Resolve the Chinese Civil War for this month
  const { ccw, newEvent: chinaEvent } = resolveChinaCivilWar(state, newYear, newMonth);

  const event = chinaEvent || scheduledEvent;

  const nextUSA = { ...state.usaStats, actionPoints: 3 };
  const nextUSSR = { ...state.ussrStats, actionPoints: 3 };

  const updatedUnits: Record<string, Unit> = {};
  Object.values(state.units).forEach(u => {
    updatedUnits[u.id] = { ...u, movesThisTurn: 0 };
  });

  // Resolve build queue
  let updatedCountries = { ...state.countries };

  // Apply China alignment changes based on civil war state:
  // - As soon as the war ends, mark China as contested under the winner's alignment.
  // - After CHINA_CONSOLIDATION_MONTHS months, fully consolidate: uncontested + aligned.
  if (ccw.resolved) {
    const c = updatedCountries['china'];
    if (c) {
      const winnerAlignment: Country['alignment'] = ccw.winner === 'communist' ? 'communist' : 'western';
      if (ccw.consolidated) {
        // Fully consolidated: no longer contested, full alignment locked in
        updatedCountries['china'] = {
          ...c,
          alignment: winnerAlignment,
          isContested: false,
          influence: ccw.winner === 'communist'
            ? { usa: 0, ussr: 100 }
            : { usa: 100, ussr: 0 },
          stability: Math.min(100, c.stability + 1), // slow stability climb
        };
      } else {
        // Still consolidating: contested, winner's alignment but influence still contested
        const consolidationProgress = (ccw.consolidationMonths ?? 0) / CHINA_CONSOLIDATION_MONTHS;
        const winnerInfluence = Math.round(50 + consolidationProgress * 50);
        const loserInfluence = 100 - winnerInfluence;
        updatedCountries['china'] = {
          ...c,
          alignment: winnerAlignment,
          isContested: true,
          influence: ccw.winner === 'communist'
            ? { usa: loserInfluence, ussr: winnerInfluence }
            : { usa: winnerInfluence, ussr: loserInfluence },
        };
      }
    }
  }

  const remainingQueue: GameState['buildQueue'] = [];
  state.buildQueue.forEach(q => {
    const q2 = { ...q, turnsRemaining: q.turnsRemaining - 1 };
    if (q2.turnsRemaining <= 0) {
      const b = getUnitBuild(q2.unitType);
      const fid = (state.playerFaction === 'usa' ? 'usa' : 'ussr') + '_u' + Math.floor(Math.random() * 100000);
      updatedUnits[fid] = {
        id: fid,
        type: q2.unitType,
        strength: b.strength,
        maxStrength: b.strength,
        stateId: state.countries[q2.countryId]?.states[0] || q2.countryId,
        countryId: q2.countryId,
        owner: state.playerFaction!,
        movesThisTurn: 0,
        name: b.name,
      };
      const country = updatedCountries[q2.countryId];
      if (country) {
        updatedCountries[q2.countryId] = { ...country, military: Math.min(100, country.military + 5) };
      }
    } else {
      remainingQueue.push(q2);
    }
  });

  // Resolve focus trees
  const updatedTrees: Record<Faction, FocusTree> = { ...state.focusTrees };
  (['usa', 'ussr'] as Faction[]).forEach(faction => {
    const tree = { ...state.focusTrees[faction] };
    if (tree.activeNodeId) {
      const activeNode = tree.nodes.find(n => n.id === tree.activeNodeId);
      if (activeNode) {
        const updated = tree.nodes.map(n => {
          if (n.id === tree.activeNodeId) {
            const remaining = n.turnsRemaining - 1;
            if (remaining <= 0) {
              return { ...n, status: 'completed' as const, turnsRemaining: 0 };
            }
            return { ...n, turnsRemaining: remaining };
          }
          return n;
        });
        // Check if active node just completed
        const justCompleted = updated.find(n => n.id === tree.activeNodeId && n.status === 'completed');
        if (justCompleted) {
          const stats = faction === 'usa' ? nextUSA : nextUSSR;
          const resolvedStats = resolveFocusNode(justCompleted, faction, stats);
          if (faction === 'usa') { nextUSA.gdp = resolvedStats.gdp; nextUSA.prestige = resolvedStats.prestige; nextUSA.military = resolvedStats.military; nextUSA.nuclearWarheads = resolvedStats.nuclearWarheads; nextUSA.researchPoints = resolvedStats.researchPoints; }
          else { nextUSSR.gdp = resolvedStats.gdp; nextUSSR.prestige = resolvedStats.prestige; nextUSSR.military = resolvedStats.military; nextUSSR.nuclearWarheads = resolvedStats.nuclearWarheads; nextUSSR.researchPoints = resolvedStats.researchPoints; }
        }
        // Unlock prerequisites
        const updatedNodes = updated.map(n => {
          if (n.status === 'locked') {
            const prereqsMet = n.prerequisites.every(pid => updated.find(x => x.id === pid)?.status === 'completed');
            if (prereqsMet) return { ...n, status: 'available' as const };
          }
          return n;
        });
        updatedTrees[faction] = { ...tree, nodes: updatedNodes, activeNodeId: justCompleted ? null : tree.activeNodeId };
      }
    }
  });

  // Trade income
  const tradeIncome = { usa: 0, ussr: 0 };
  state.tradeRoutes.forEach(route => {
    const from = state.countries[route.from];
    const to = state.countries[route.to];
    if (!from || !to) return;
    const isUSA = (from.alignment === 'nato' || from.alignment === 'western') && (to.alignment === 'nato' || to.alignment === 'western');
    const isUSSR = (from.alignment === 'warsaw' || from.alignment === 'communist') && (to.alignment === 'warsaw' || to.alignment === 'communist');
    if (isUSA) tradeIncome.usa += route.value;
    if (isUSSR) tradeIncome.ussr += route.value;
  });

  // AI opponent
  const aiFaction = state.playerFaction === 'usa' ? 'ussr' : 'usa';
  const aiStats = aiFaction === 'usa' ? nextUSA : nextUSSR;
  const aiRoll = Math.random();
  if (aiRoll < 0.4) {
    const targets = Object.values(updatedCountries).filter(c => c.alignment === 'nonaligned');
    const target = targets[Math.floor(Math.random() * targets.length)];
    if (target) {
      const newInfluence = { ...target.influence };
      if (aiFaction === 'usa') newInfluence.usa = Math.min(100, newInfluence.usa + 20);
      else newInfluence.ussr = Math.min(100, newInfluence.ussr + 20);
      updatedCountries[target.id] = { ...target, influence: newInfluence };
    }
  } else if (aiRoll < 0.7) {
    aiStats.military = Math.min(100, aiStats.military + 5);
    newTension += 3;
  } else {
    aiStats.nuclearWarheads += 1;
    newTension += 5;
  }

  // Production points
  const usaProduction = Object.values(updatedCountries)
    .filter(c => c.alignment === 'nato' || c.alignment === 'western')
    .reduce((sum, c) => sum + c.productionPoints, 0);
  const ussrProduction = Object.values(updatedCountries)
    .filter(c => c.alignment === 'warsaw' || c.alignment === 'communist')
    .reduce((sum, c) => sum + c.productionPoints, 0);
  nextUSA.productionPoints = usaProduction;
  nextUSSR.productionPoints = ussrProduction;
  nextUSA.totalUnits = Object.values(updatedUnits).filter(u => u.owner === 'usa').length;
  nextUSSR.totalUnits = Object.values(updatedUnits).filter(u => u.owner === 'ussr').length;
  nextUSA.maintenanceCost = Object.values(updatedUnits).filter(u => u.owner === 'usa').reduce((sum, u) => sum + UNIT_TYPES.find(ut => ut.type === u.type)!.maintenance, 0);
  nextUSSR.maintenanceCost = Object.values(updatedUnits).filter(u => u.owner === 'ussr').reduce((sum, u) => sum + UNIT_TYPES.find(ut => ut.type === u.type)!.maintenance, 0);
  nextUSA.gdp = Math.round(nextUSA.gdp + tradeIncome.usa - nextUSA.maintenanceCost);
  nextUSSR.gdp = Math.round(nextUSSR.gdp + tradeIncome.ussr - nextUSSR.maintenanceCost);

  return {
    year: newYear,
    month: newMonth,
    tension: Math.min(100, Math.max(0, newTension)),
    status: newStatus,
    winner,
    victoryReason: reason,
    usaStats: nextUSA,
    ussrStats: nextUSSR,
    countries: updatedCountries,
    units: updatedUnits,
    focusTrees: updatedTrees,
    buildQueue: remainingQueue,
    chinaCivilWar: ccw,
    activeEvent: event || null,
    logs: [...state.logs, `[${MONTH_NAMES[newMonth - 1]} ${newYear}] AI opponent takes action. Tension: ${Math.min(100, newTension)}%`],
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const startGame = useCallback((faction: Faction) => {
    setState(s => {
      const base = { ...INITIAL_STATE };
      const countries = { ...base.countries };
      const usaUnits = Object.values(base.units).filter(u => u.owner === 'usa');
      const ussrUnits = Object.values(base.units).filter(u => u.owner === 'ussr');
      const units: Record<string, Unit> = {};
      usaUnits.forEach(u => { units[u.id] = { ...u, movesThisTurn: 0 }; });
      ussrUnits.forEach(u => { units[u.id] = { ...u, movesThisTurn: 0 }; });
      return {
        ...base,
        status: 'playing',
        playerFaction: faction,
        units,
        logs: [`[${base.year}] Started game as ${faction.toUpperCase()}. ${faction === 'usa' ? 'The free world looks to you.' : 'The revolution depends on you.'}`],
      };
    });
  }, []);

  const selectCountry = useCallback((id: string | null) => {
    setState(s => ({ ...s, selectedCountryId: id, selectedUnitId: null }));
  }, []);

  const selectUnit = useCallback((id: string | null) => {
    setState(s => ({ ...s, selectedUnitId: id }));
  }, []);

  const setTab = useCallback((tab: GameState['activeTab']) => {
    setState(s => ({ ...s, activeTab: tab }));
  }, []);

  const endTurn = useCallback(() => {
    setState(s => {
      const updates = resolveTurnEnd(s);
      return { ...s, ...updates, combatResult: null };
    });
  }, []);

  const resolveEvent = useCallback((choice: EventChoice) => {
    setState(s => {
      const updates = choice.effect(s);
      return {
        ...s,
        ...updates,
        activeEvent: null,
        logs: [...s.logs, `Event resolved: ${choice.text}`],
      };
    });
  }, []);

  const performAction = useCallback((actionId: string, targetId?: string) => {
    setState(s => {
      if (!s.playerFaction) return s;
      const stats = s.playerFaction === 'usa' ? s.usaStats : s.ussrStats;
      if (stats.actionPoints < 1) return s;
      let newStats = { ...stats, actionPoints: stats.actionPoints - 1 };
      let newTension = s.tension;
      let logMsg = '';
      let updatedCountries = { ...s.countries };
      let updatedUnits = { ...s.units };

      if (actionId === 'military') {
        newStats.military = Math.min(100, newStats.military + 5);
        const militaryTensionRise = 1 + Math.floor(Math.random() * 2);
        newTension += militaryTensionRise;
        logMsg = `Military buildup complete. Tension +${militaryTensionRise}.`;
      } else if (actionId === 'nukes') {
        newStats.nuclearWarheads += 1;
        newTension += 10;
        logMsg = 'Nuclear warhead developed. Tension +10.';
      } else if (actionId === 'diplomacy') {
        if (targetId) {
          const c = updatedCountries[targetId];
          if (c) {
            const newInfluence = { ...c.influence };
            if (s.playerFaction === 'usa') newInfluence.usa = Math.min(100, newInfluence.usa + 20);
            else newInfluence.ussr = Math.min(100, newInfluence.ussr + 20);
            updatedCountries[targetId] = { ...c, influence: newInfluence };
          }
        }
        newStats.prestige += 5;
        newTension -= 5;
        logMsg = 'Diplomatic mission complete. Influence shifted.';
      } else if (actionId === 'proxy') {
        if (targetId) {
          const c = updatedCountries[targetId];
          if (c) {
            const newInfluence = { ...c.influence };
            if (s.playerFaction === 'usa') {
              newInfluence.usa = Math.min(100, newInfluence.usa + 15);
              newInfluence.ussr = Math.max(0, newInfluence.ussr - 10);
            } else {
              newInfluence.ussr = Math.min(100, newInfluence.ussr + 15);
              newInfluence.usa = Math.max(0, newInfluence.usa - 10);
            }
            updatedCountries[targetId] = { ...c, influence: newInfluence, isContested: true };
          }
        }
        newStats.prestige += 3;
        newTension += 8;
        logMsg = 'Proxy war initiated. Tension +8.';
      } else if (actionId === 'intel') {
        if (targetId) {
          const c = updatedCountries[targetId];
          if (c) {
            logMsg = `Intelligence report: ${c.name} - Military: ${c.military}, Stability: ${c.stability}, USSR: ${c.influence.ussr}%`;
            if (Math.random() < 0.3) {
              newStats.prestige = Math.max(0, newStats.prestige - 10);
              logMsg = 'Intelligence operation compromised! Prestige -10.';
            } else {
              newStats.prestige += 5;
              logMsg = 'Intelligence operation successful. Prestige +5.';
            }
          }
        }
      } else if (actionId === 'china_aid') {
        const ccw = {
          ...s.chinaCivilWar,
          totalCommunistAid: s.chinaCivilWar.totalCommunistAid ?? 0,
          totalNationalistAid: s.chinaCivilWar.totalNationalistAid ?? 0,
        };
        if (!ccw.resolved) {
          if (s.playerFaction === 'ussr' && targetId === 'communist') {
            ccw.communistAid += 1;
            ccw.totalCommunistAid += 1;
            logMsg = 'Military aid sent to Communist China. Their forces are emboldened.';
            newTension += 1;
          } else if (s.playerFaction === 'usa' && targetId === 'nationalist') {
            ccw.nationalistAid += 1;
            ccw.totalNationalistAid += 1;
            logMsg = 'Military aid sent to Nationalist China. Their forces are reinforced.';
            newTension += 1;
          } else {
            logMsg = 'Aid dispatched to allied Chinese faction.';
          }
          // Fall through to the shared return at the bottom with chinaCivilWar included
          updatedCountries = { ...s.countries };
          return {
            ...s,
            chinaCivilWar: ccw,
            usaStats: s.playerFaction === 'usa' ? newStats : s.usaStats,
            ussrStats: s.playerFaction === 'ussr' ? newStats : s.ussrStats,
            tension: Math.min(100, Math.max(0, newTension)),
            logs: [...s.logs, logMsg],
          };
        } else {
          logMsg = 'The Chinese Civil War is already resolved.';
        }
      } else if (actionId === 'economy') {
        newStats.gdp += 100;
        if (targetId) {
          const c = updatedCountries[targetId];
          if (c) {
            updatedCountries[targetId] = { ...c, economy: Math.min(100, c.economy + 10), productionPoints: c.productionPoints + 5 };
          }
        }
        logMsg = 'Economic investment complete. GDP +100.';
      } else if (actionId === 'space') {
        if (stats.actionPoints < 2) return s;
        newStats = { ...newStats, actionPoints: newStats.actionPoints - 1 };
        newStats.prestige += 30;
        logMsg = 'Space program launch. Prestige +30.';
      } else if (actionId === 'move_unit') {
        if (targetId && s.selectedUnitId) {
          const unit = updatedUnits[s.selectedUnitId];
          if (unit && unit.movesThisTurn === 0) {
            updatedUnits[s.selectedUnitId] = { ...unit, stateId: targetId, countryId: targetId, movesThisTurn: 1 };
            logMsg = `${UNIT_TYPES.find(u => u.type === unit.type)?.name} moved to ${updatedCountries[targetId]?.name}.`;
          }
        }
      } else if (actionId === 'attack') {
        if (s.selectedUnitId && targetId) {
          const unit = updatedUnits[s.selectedUnitId];
          const target = updatedCountries[targetId];
          if (unit && target) {
            const attackerCountry = unit.countryId;
            const can = canInvade(s, attackerCountry, targetId, s.playerFaction);
            if (!can.ok) {
              logMsg = `Cannot attack: ${can.reason}`;
              return { ...s, logs: [...s.logs, logMsg] };
            }
            const attackers = getCountryUnits(s, attackerCountry, s.playerFaction).filter(u => u.movesThisTurn === 0);
            const defenders = Object.values(s.units).filter(u => u.countryId === targetId && u.owner !== s.playerFaction);
            if (attackers.length === 0) {
              logMsg = 'No fresh units available to attack.';
              return { ...s, logs: [...s.logs, logMsg] };
            }
            const result = computeCombat(attackers, defenders, updatedCountries[attackerCountry]?.name || '', target.name);
            // Apply casualties
            const totalAtkLoss = result.attackerLosses;
            const totalDefLoss = result.defenderLosses;
            let atkLost = 0;
            let defLost = 0;
            const nextUnits: Record<string, Unit> = { ...updatedUnits };
            attackers.forEach(u => {
              if (atkLost >= totalAtkLoss) return;
              const loss = Math.min(totalAtkLoss - atkLost, u.strength);
              atkLost += loss;
              nextUnits[u.id] = { ...u, strength: u.strength - loss, movesThisTurn: 1 };
              if (nextUnits[u.id].strength <= 0) delete nextUnits[u.id];
            });
            defenders.forEach(u => {
              if (defLost >= totalDefLoss) return;
              const loss = Math.min(totalDefLoss - defLost, u.strength);
              defLost += loss;
              nextUnits[u.id] = { ...u, strength: u.strength - loss };
              if (nextUnits[u.id].strength <= 0) delete nextUnits[u.id];
            });
            updatedUnits = nextUnits;
            if (result.conquered) {
              const newAlignment = s.playerFaction === 'usa' ? 'nato' : 'warsaw';
              updatedCountries[targetId] = { ...target, alignment: newAlignment, occupiedBy: s.playerFaction, isContested: false, influence: s.playerFaction === 'usa' ? { usa: 80, ussr: 10 } : { usa: 10, ussr: 80 } };
              const allyList = s.playerFaction === 'usa' ? [...newStats.allies, targetId] : [...newStats.allies, targetId];
              newStats.allies = allyList;
              newStats.prestige += 25;
              newStats.productionPoints += target.productionPoints;
              newTension += 15;
              logMsg = `${target.name} CONQUERED! ${s.playerFaction.toUpperCase()} gains +${target.productionPoints} PP. Tension +15.`;
            } else {
              newTension += 10;
              logMsg = result.log;
            }
            return {
              ...s,
              tension: Math.min(100, Math.max(0, newTension)),
              logs: [...s.logs, logMsg],
              countries: updatedCountries,
              units: updatedUnits,
              combatResult: result,
              ...(s.playerFaction === 'usa' ? { usaStats: newStats } : { ussrStats: newStats }),
            };
          }
        }
      } else if (actionId === 'build_unit') {
        if (targetId && s.selectedUnitId) {
          const b = UNIT_TYPES.find(u => u.type === s.selectedUnitId as UnitType);
          if (!b) return s;
          if (newStats.productionPoints < b.cost) {
            logMsg = `Not enough Production Points. Need ${b.cost}, have ${newStats.productionPoints}.`;
            return { ...s, logs: [...s.logs, logMsg] };
          }
          const country = targetId;
          newStats.productionPoints -= b.cost;
          const queue = [...s.buildQueue, { unitType: b.type, countryId: country, turnsRemaining: b.buildTime }];
          logMsg = `${b.name} queued in ${updatedCountries[country]?.name}. ${b.buildTime} turns.`;
          return {
            ...s,
            logs: [...s.logs, logMsg],
            buildQueue: queue,
            ...(s.playerFaction === 'usa' ? { usaStats: newStats } : { ussrStats: newStats }),
          };
        }
      }

      return {
        ...s,
        tension: Math.min(100, Math.max(0, newTension)),
        logs: [...s.logs, logMsg],
        countries: updatedCountries,
        units: updatedUnits,
        ...(s.playerFaction === 'usa' ? { usaStats: newStats } : { ussrStats: newStats }),
      };
    });
  }, []);

  const startFocus = useCallback((nodeId: string) => {
    setState(s => {
      if (!s.playerFaction) return s;
      const tree = { ...s.focusTrees[s.playerFaction] };
      const node = tree.nodes.find(n => n.id === nodeId);
      if (!node || node.status !== 'available') return s;
      if (tree.activeNodeId) return s;
      const updatedNodes = tree.nodes.map(n => n.id === nodeId ? { ...n, status: 'researching' as const } : n);
      return {
        ...s,
        focusTrees: {
          ...s.focusTrees,
          [s.playerFaction]: { ...tree, nodes: updatedNodes, activeNodeId: nodeId },
        },
        logs: [...s.logs, `Focus started: ${node.name} (${node.turnsRequired} turns)`],
      };
    });
  }, []);

  const dismissCombat = useCallback(() => {
    setState(s => ({ ...s, combatResult: null }));
  }, []);

  return {
    state,
    startGame,
    selectCountry,
    selectUnit,
    setTab,
    endTurn,
    resolveEvent,
    performAction,
    startFocus,
    dismissCombat,
  };
}
