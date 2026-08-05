import { UnitType, Faction } from './types';

// Historically accurate unit names. For the USA and major allies we use real
// division/wing/fleet designations. For the USSR and Warsaw Pact we use the
// Soviet numbering system with Guards and honorific titles. For smaller allies
// we fall back to realistic national naming conventions.

type NameEntry = { name: string; used?: boolean };

// --- USA: real US Army divisions and USAF wings / USN fleets ---
const USA_NAMES: Record<UnitType, string[]> = {
  infantry: [
    '1st Infantry Division', '2nd Infantry Division', '3rd Infantry Division',
    '4th Infantry Division', '5th Infantry Division', '6th Infantry Division',
    '7th Infantry Division', '9th Infantry Division', '10th Mountain Division',
    '24th Infantry Division', '25th Infantry Division', '82nd Airborne Division',
    '101st Airborne Division', '1st Marine Division', '2nd Marine Division',
    '3rd Marine Division', '4th Marine Division', '1st Cavalry Division (Airmobile)',
  ],
  armor: [
    '1st Armored Division', '2nd Armored Division', '3rd Armored Division',
    '1st Cavalry Division', '2nd Cavalry Regiment', '3rd Cavalry Regiment',
    '11th Armored Cavalry Regiment', '1st Infantry Division (Mechanized)',
    '4th Infantry Division (Mechanized)', '5th Infantry Division (Mechanized)',
  ],
  air: [
    '1st Fighter Wing', '4th Fighter Wing', '7th Bomb Wing', '8th Fighter Wing',
    '19th Bomb Wing', '22nd Bomb Wing', '49th Fighter Wing', '50th Fighter Wing',
    '52nd Fighter Wing', '57th Fighter Wing', '354th Fighter Wing', '366th Fighter Wing',
    '8th Air Force', '9th Air Force', '12th Air Force', 'Strategic Air Command',
  ],
  navy: [
    '2nd Fleet', '3rd Fleet', '5th Fleet', '6th Fleet', '7th Fleet',
    '1st Carrier Group', '2nd Carrier Group', '3rd Carrier Group',
    'Amphibious Force Atlantic', 'Amphibious Force Pacific',
  ],
};

// --- Soviet: real Soviet Army designations with Guards honors ---
const USSR_NAMES: Record<UnitType, string[]> = {
  infantry: [
    '1st Guards Rifle Division', '2nd Guards Rifle Division', '3rd Guards Rifle Division',
    '5th Guards Rifle Division', '6th Guards Rifle Division', '8th Guards Rifle Division',
    '13th Guards Rifle Division', '42nd Guards Rifle Division', '75th Guards Rifle Division',
    '1st Motorized Rifle Division', '2nd Motorized Rifle Division', '3rd Motorized Rifle Division',
    '20th Motorized Rifle Division', '150th Motorized Rifle Division',
    '7th Guards Airborne Division', '76th Guards Air Assault Division', '106th Guards Airborne Division',
  ],
  armor: [
    '1st Guards Tank Division', '2nd Guards Tank Division', '3rd Guards Tank Division',
    '4th Guards Tank Division', '5th Guards Tank Division', '6th Guards Tank Division',
    '9th Guards Tank Division', '10th Guards Tank Division', '11th Guards Tank Division',
    '1st Tank Division', '2nd Tank Division', '3rd Tank Division', '4th Tank Division',
  ],
  air: [
    '1st Guards Fighter Aviation Division', '3rd Guards Fighter Aviation Division',
    '4th Guards Fighter Aviation Division', '5th Guards Bomber Aviation Division',
    '6th Guards Bomber Aviation Division', '1st Air Army', '2nd Air Army',
    '16th Air Army', '17th Air Army', 'VVS Moscow District',
    '1st Guards Fighter Aviation Regiment', '176th Guards Fighter Aviation Regiment',
  ],
  navy: [
    'Red Banner Northern Fleet', 'Red Banner Baltic Fleet', 'Red Banner Black Sea Fleet',
    'Red Banner Pacific Fleet', '4th Squadron Red Banner', '5th Squadron Red Banner',
    '1st Submarine Flotilla', '2nd Submarine Flotilla',
  ],
};

// --- British / NATO allies: historically accurate where possible ---
const UK_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Infantry Division', '2nd Infantry Division', '3rd Infantry Division',
    'Guards Division', 'Scottish Division', '50th (Northumbrian) Division', '51st (Highland) Division'],
  armor: ['1st Armoured Division', '7th Armoured Division "Desert Rats"', 'Guards Armoured Division',
    '11th Armoured Division'],
  air: ['RAF Fighter Command', 'RAF Bomber Command', 'No. 11 Group RAF', 'No. 12 Group RAF'],
  navy: ['Home Fleet', 'Mediterranean Fleet', 'Fleet Air Arm', 'Royal Navy 1st Flotilla'],
};

const FRANCE_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Marine Infantry Regiment', '2nd Infantry Division', '27th Alpine Division',
    '1st Foreign Infantry Regiment', '2nd Foreign Infantry Regiment', 'Troupes de Marine'],
  armor: ['1st Armored Division', '2nd Armored Division', '3rd Armored Division', '501st Tank Regiment'],
  air: ['Escadre de Chasse 1/2', 'Escadre de Chasse 1/7', 'Escadre de Bombardement 1/91'],
  navy: ['Force d\'Action Navale', 'Escadre de l\'Atlantique', 'Escadre de la Méditerranée'],
};

const ITALY_NAMES: Record<UnitType, string[]> = {
  infantry: ['Ariete Division', 'Folgore Airborne Brigade', 'Garibaldi Bersaglieri Brigade',
    'Granatieri di Sardegna Brigade'],
  armor: ['Ariete Armoured Division', 'Centauro Armoured Division', 'Pozzuolo del Friuli Cavalry Brigade'],
  air: ['36th Wing', '37th Wing', '51st Wing'],
  navy: ['Marina Militare 1st Squadron', 'Marina Militare 2nd Squadron'],
};

const WEST_GERMANY_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Panzergrenadier Division', '3rd Panzergrenadier Division', '10th Panzergrenadier Division',
    'Gebirgsjäger Brigade', 'Fallschirmjäger Brigade'],
  armor: ['1st Panzer Division', '3rd Panzer Division', '5th Panzer Division', '7th Panzer Division'],
  air: ['Richthofen Wing', 'Mölders Wing', 'Boelcke Wing', 'JaBoG 31 "Boelcke"'],
  navy: ['1st Fast Patrol Boat Squadron', 'Marinefliegergeschwader 1'],
};

const JAPAN_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Infantry Regiment', '9th Division', '10th Division', '11th Division',
    '1st Airborne Brigade'],
  armor: ['1st Tank Group', '2nd Tank Group', '71st Tank Regiment', '72nd Tank Regiment'],
  air: ['1st Air Wing', '2nd Air Wing', '3rd Air Wing', '4th Air Wing', 'Blue Impulse'],
  navy: ['Escort Flotilla 1', 'Escort Flotilla 2', 'Escort Flotilla 3', 'Submarine Flotilla 1'],
};

const SOUTH_KOREA_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Infantry Division', '2nd Infantry Division', '3rd Infantry Division',
    '5th Infantry Division', '7th Infantry Division', 'Capital Infantry Division'],
  armor: ['1st Armored Brigade', '2nd Armored Brigade', '3rd Armored Brigade', 'Capital Armored Brigade'],
  air: ['1st Fighter Wing', '11th Fighter Wing', '16th Fighter Wing'],
  navy: ['1st Fleet', '2nd Fleet', '3rd Fleet', 'Marine Corps 1st Division'],
};

const TURKEY_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Army', '2nd Army', '3rd Army', '9th Corps Commando Brigade', 'Bolu Mountain Brigade'],
  armor: ['1st Armored Brigade', '2nd Armored Brigade', '3rd Armored Brigade'],
  air: ['1st Tactical Air Force', '2nd Tactical Air Force'],
  navy: ['Turkish Navy Northern Command', 'Turkish Navy Southern Command'],
};

const CANADA_NAMES: Record<UnitType, string[]> = {
  infantry: ['Princess Patricia\'s Canadian Light Infantry', 'Royal 22e Régiment',
    '1st Canadian Infantry Brigade', '2nd Canadian Infantry Brigade'],
  armor: ['Royal Canadian Dragoons', 'Lord Strathcona\'s Horse', '1st Canadian Armoured Brigade'],
  air: ['1st Air Division', 'No. 401 Squadron RCAF', 'No. 424 Squadron RCAF'],
  navy: ['Maritime Command Atlantic', 'Maritime Command Pacific', 'RCN 1st Destroyer Squadron'],
};

// Warsaw Pact minor allies
const POLAND_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Tadeusz Kościuszko Infantry Division', '2nd Warsaw Infantry Division',
    '6th Pomeranian Infantry Division', '8th Drezden Infantry Division'],
  armor: ['1st Warsaw Armoured Division', '16th Armoured Division', '20th Armoured Division'],
  air: ['1st Fighter Aviation Division', '2nd Fighter Bomber Aviation Division'],
  navy: ['Polish Navy 3rd Flotilla', 'Polish Navy Coastal Defense'],
};

const CZECHOSLOVAKIA_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Prague Infantry Division', '2nd Infantry Division', '14th Infantry Division'],
  armor: ['1st Tank Division', '2nd Tank Division', '9th Tank Division'],
  air: ['1st Fighter Aviation Regiment', '2nd Fighter Bomber Aviation Regiment'],
  navy: ['Danube Flotilla'],
};

const EAST_GERMANY_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Motor Rifle Division', '8th Motor Rifle Division', '9th Motor Rifle Division',
    '40th Air Assault Regiment "Willi Sänger"'],
  armor: ['1st Tank Division', '7th Tank Division', '12th Tank Division'],
  air: ['Jagdfliegergeschwader 1', 'Jagdfliegergeschwader 3'],
  navy: ['1st Border Brigade Coast', '4th Fleet Volksmarine'],
};

const CHINA_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Field Army', '2nd Field Army', '3rd Field Army', '4th Field Army',
    '38th Group Army', '39th Group Army', '54th Group Army'],
  armor: ['1st Armored Division', '2nd Armored Division', '3rd Armored Division', '6th Armored Division'],
  air: ['1st Air Division', '2nd Air Division', '3rd Air Division', '8th Air Division'],
  navy: ['North Sea Fleet', 'East Sea Fleet', 'South Sea Fleet'],
};

const NORTH_KOREA_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Infantry Division', '2nd Infantry Division', '3rd Infantry Division',
    '4th Infantry Division', '5th Infantry Division', '12th Infantry Corps'],
  armor: ['105th Seoul Tank Division', '1st Tank Brigade', '2nd Tank Brigade'],
  air: ['1st Air Division', '2nd Air Division'],
  navy: ['West Sea Fleet', 'East Sea Fleet'],
};

const VIETNAM_NAMES: Record<UnitType, string[]> = {
  infantry: ['308th Infantry Division', '312th Infantry Division', '304th Infantry Division',
    '325th Infantry Division', '7th Infantry Division'],
  armor: ['202nd Tank Brigade', '203rd Tank Brigade'],
  air: ['921st Fighter Regiment', '923rd Fighter Regiment'],
  navy: ['126th Naval Brigade', '147th Naval Brigade'],
};

// Fallback generic names for any country without a dedicated list
const GENERIC_NATO_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Infantry Division', '2nd Infantry Brigade', '3rd Rifle Regiment', '4th Mountain Brigade'],
  armor: ['1st Armored Brigade', '2nd Tank Battalion', '3rd Cavalry Regiment'],
  air: ['1st Tactical Wing', '2nd Fighter Squadron', '3rd Bomb Squadron'],
  navy: ['1st Naval Squadron', '2nd Coastal Flotilla', '3rd Patrol Group'],
};

const GENERIC_WARSAW_NAMES: Record<UnitType, string[]> = {
  infantry: ['1st Motor Rifle Division', '2nd Rifle Division', '3rd Guards Rifle Regiment'],
  armor: ['1st Tank Brigade', '2nd Armored Regiment', '3rd Guards Tank Battalion'],
  air: ['1st Fighter Aviation Regiment', '2nd Bomber Aviation Regiment'],
  navy: ['1st Naval Flotilla', '2nd Patrol Squadron'],
};

// ---- dispatcher ----
const NATO_MAP: Record<string, Record<UnitType, string[]>> = {
  usa: USA_NAMES,
  uk: UK_NAMES,
  france: FRANCE_NAMES,
  italy: ITALY_NAMES,
  west_germany: WEST_GERMANY_NAMES,
  japan: JAPAN_NAMES,
  south_korea: SOUTH_KOREA_NAMES,
  turkey: TURKEY_NAMES,
  canada: CANADA_NAMES,
};

const WARSAW_MAP: Record<string, Record<UnitType, string[]>> = {
  ussr: USSR_NAMES,
  poland: POLAND_NAMES,
  czechoslovakia: CZECHOSLOVAKIA_NAMES,
  east_germany: EAST_GERMANY_NAMES,
  china: CHINA_NAMES,
  north_korea: NORTH_KOREA_NAMES,
  vietnam: VIETNAM_NAMES,
};

// Global consumed-name tracking so no two units ever share the same name
const usedNames = new Set<string>();

export function generateUnitName(type: UnitType, countryId: string, owner: Faction): string {
  const map = owner === 'usa' ? NATO_MAP : WARSAW_MAP;
  const list = (map[countryId]?.[type]) || (owner === 'usa' ? GENERIC_NATO_NAMES[type] : GENERIC_WARSAW_NAMES[type]);

  // Shuffle the list so the order is random each game rather than always
  // picking the first historical entry in sequence.
  const shuffled = [...list].sort(() => Math.random() - 0.5);

  // Pick the first unused historical name (globally unique)
  for (const candidate of shuffled) {
    if (!usedNames.has(candidate)) {
      usedNames.add(candidate);
      return candidate;
    }
  }

  // All historical names exhausted — synthesize a unique one with a random high number
  let extra = list.length + 1 + Math.floor(Math.random() * 900);
  const base = list[Math.floor(Math.random() * list.length)];
  const match = base.match(/^(\d+)/);
  let name: string;
  do {
    if (match) {
      name = base.replace(/^\d+/, String(extra));
    } else {
      name = `${extra}th ${base}`;
    }
    extra++;
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
}
