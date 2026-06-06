export type Faction = 'usa' | 'ussr';
export type Alignment = 'nato' | 'warsaw' | 'nonaligned' | 'communist' | 'western' | 'occupied';
export type UnitType = 'infantry' | 'armor' | 'air' | 'navy';
export type FocusCategory = 'economic' | 'military' | 'intelligence' | 'political';
export type PoliticalPath = 'stalinist' | 'reformist' | null;
export type FocusStatus = 'locked' | 'available' | 'researching' | 'completed';
export type TabName = 'intel' | 'units' | 'economy' | 'focus';

export interface State {
  id: string;
  name: string;
  countryId: string;
  lat: number;
  lon: number;
  economy: number;
  population: number;
  industrialCapacity: number;
  productionPoints: number;
  owner: Faction;
  isCapital: boolean;
  neighbors: string[];
  terrain: 'plains' | 'forest' | 'mountain' | 'desert' | 'urban' | 'coastal';
}

export interface Unit {
  id: string;
  type: UnitType;
  strength: number;
  maxStrength: number;
  stateId: string;
  countryId: string;
  owner: Faction;
  movesThisTurn: number;
  name: string;
}

export interface FocusNode {
  id: string;
  name: string;
  description: string;
  category: FocusCategory;
  status: FocusStatus;
  turnsRequired: number;
  turnsRemaining: number;
  prerequisites: string[];
  effects: FocusEffect;
  x: number;
  y: number;
  icon: string;
}

export interface FocusEffect {
  gdp?: number;
  prestige?: number;
  military?: number;
  nuclearWarheads?: number;
  unitDiscount?: number;
  unlockUnit?: UnitType;
  tension?: number;
  researchPoints?: number;
}

export interface FocusTree {
  faction: Faction;
  nodes: FocusNode[];
  activeNodeId: string | null;
  politicalPath: PoliticalPath;
}

export interface UnitBuild {
  id: string;
  type: UnitType;
  name: string;
  icon: string;
  cost: number;
  strength: number;
  buildTime: number;
  maintenance: number;
  terrain: 'land' | 'sea' | 'air';
  description: string;
}

export interface CombatResult {
  attackerId: string;
  defenderId: string;
  attackerState: string;
  defenderState: string;
  attackerCountry: string;
  defenderCountry: string;
  attackerLosses: number;
  defenderLosses: number;
  attackerRemaining: number;
  defenderRemaining: number;
  winner: 'attacker' | 'defender';
  conquered: boolean;
  log: string;
}

export interface Country {
  id: string;
  name: string;
  isoCode: string;
  alignment: Alignment;
  stability: number;
  military: number;
  economy: number;
  nukes: number;
  influence: { usa: number; ussr: number };
  isContested: boolean;
  region: string;
  occupiedBy: Faction | null;
  states: string[];
  coastal: boolean;
  neighbors: string[];
  productionPoints: number;
  /** Whether a civil war is active in this country */
  inCivilWar?: boolean;
  /** Current leader/alignment control in civil war */
  civilWarSide?: Faction | null;
}

export interface PlayerStats {
  actionPoints: number;
  prestige: number;
  gdp: number;
  nuclearWarheads: number;
  researchPoints: number;
  allies: string[];
  manpower: number;
  productionPoints: number;
  totalUnits: number;
  maintenanceCost: number;
  military: number;
}

export interface ChinaCivilWar {
  /** Which Chinese provinces the communists currently hold */
  communistStates: string[];
  /** Which Chinese provinces the nationalists currently hold */
  nationalistStates: string[];
  /** Aid sent this month to communists (reset each turn after the battle roll) */
  communistAid: number;
  /** Aid sent this month to nationalists (reset each turn after the battle roll) */
  nationalistAid: number;
  /** Total aid ever sent to communists — grows permanently, shifts base odds */
  totalCommunistAid: number;
  /** Total aid ever sent to nationalists — grows permanently, shifts base odds */
  totalNationalistAid: number;
  /** Whether the civil war is still ongoing */
  resolved: boolean;
  /** Who won — 'communist' | 'nationalist' | null */
  winner: 'communist' | 'nationalist' | null;
  /**
   * Months elapsed since the civil war ended. China spends ~24 months
   * consolidating before it becomes uncontested and fully locked in.
   */
  consolidationMonths: number;
  /** Whether China has fully consolidated (uncontested, alignment locked) */
  consolidated: boolean;
  /**
   * How many consecutive direction reversals have happened (comm gains then nat gains, or vice versa).
   * When this hits 2 the battle is forced so the war breaks out of its oscillation.
   */
  stalemateStreak: number;
  /** Direction of the last battle: 1 = communists gained, -1 = nationalists gained, 0 = no change. */
  lastBattleDirection: number;
  /** Communist province count at the end of the previous turn (stalemate detection). */
  lastCommunistCount: number;
}

export interface CubanRevolution {
  /** Aid sent this month to communists (reset each turn after the battle roll) */
  communistAid: number;
  /** Aid sent this month to western forces (reset each turn after the battle roll) */
  westernAid: number;
  /** Total aid ever sent to communists */
  totalCommunistAid: number;
  /** Total aid ever sent to western forces */
  totalWesternAid: number;
  /** Whether the revolution is still ongoing */
  resolved: boolean;
  /** Who won — 'communist' | 'western' | null */
  winner: 'communist' | 'western' | null;
  /** Months elapsed since the revolution started */
  monthsElapsed: number;
  /** Whether Cuba's alignment is locked in */
  consolidated: boolean;
}

export interface GameState {
  status: 'menu' | 'playing' | 'gameover';
  winner: Faction | 'none' | null;
  victoryReason: string | null;
  playerFaction: Faction | null;
  year: number;
  month: number;
  tension: number;
  chinaCivilWar: ChinaCivilWar;
  cubanRevolution: CubanRevolution;
  usaStats: PlayerStats;
  ussrStats: PlayerStats;
  countries: Record<string, Country>;
  states: Record<string, State>;
  units: Record<string, Unit>;
  focusTrees: Record<Faction, FocusTree>;
  logs: string[];
  activeEvent: GameEvent | null;
  selectedCountryId: string | null;
  selectedStateId: string | null;
  selectedUnitId: string | null;
  combatResult: CombatResult | null;
  activeTab: TabName;
  buildQueue: { unitType: UnitType; countryId: string; turnsRemaining: number }[];
  tradeRoutes: { from: string; to: string; value: number }[];
  zoom: number;
  center: [number, number];
}

export interface GameEvent {
  id: string;
  year: number;
  month: number;
  title: string;
  description: string;
  faction: Faction | 'both';
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  effect: (state: GameState) => Partial<GameState>;
}
