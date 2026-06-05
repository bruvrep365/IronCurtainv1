import { Country, GameState, GameEvent, PlayerStats, UnitBuild, FocusTree, State, Unit, UnitType, Alignment, Faction } from './types';

export const UNIT_TYPES: UnitBuild[] = [
  { id: 'infantry', type: 'infantry', name: 'Infantry Division', icon: 'swords', cost: 50, strength: 20, buildTime: 1, maintenance: 3, terrain: 'land', description: 'Basic ground force. Cheap and reliable. Best for defense and garrison duty.' },
  { id: 'armor', type: 'armor', name: 'Armored Brigade', icon: 'shield', cost: 120, strength: 50, buildTime: 2, maintenance: 8, terrain: 'land', description: 'Heavy armored force. Expensive but devastating on the attack. Strong vs. Infantry.' },
  { id: 'air', type: 'air', name: 'Air Wing', icon: 'plane', cost: 100, strength: 40, buildTime: 2, maintenance: 6, terrain: 'air', description: 'Air power. Can strike across any terrain. Strong vs. Armor. No ground holding power.' },
  { id: 'navy', type: 'navy', name: 'Carrier Group', icon: 'ship', cost: 150, strength: 30, buildTime: 3, maintenance: 10, terrain: 'sea', description: 'Naval power. Required for cross-ocean invasions. Only works on coastal nations.' },
];

export function getUnitBuild(type: UnitBuild['type']): UnitBuild {
  return UNIT_TYPES.find(u => u.type === type)!;
}

function s(id: string, name: string, countryId: string, lat: number, lon: number, economy: number, population: number, ic: number, pp: number, owner: 'usa' | 'ussr', isCapital: boolean, neighbors: string[], terrain: State['terrain']): State {
  return { id, name, countryId, lat, lon, economy, population, industrialCapacity: ic, productionPoints: pp, owner, isCapital, neighbors, terrain };
}

const ALL_STATES: State[] = [
  // ===== NORTH AMERICA =====
  // USA
  s('us_northeast', 'Northeast', 'usa', 42.0, -74.5, 40, 45, 40, 42, 'usa', false, ['us_southeast', 'us_midwest', 'us_midatlantic'], 'urban'),
  s('us_midatlantic', 'Mid-Atlantic', 'usa', 39.0, -77.5, 35, 30, 38, 36, 'usa', false, ['us_northeast', 'us_southeast', 'us_midwest'], 'urban'),
  s('us_southeast', 'Southeast', 'usa', 33.0, -83.5, 25, 35, 25, 25, 'usa', false, ['us_northeast', 'us_midatlantic', 'us_southcentral', 'us_southwest'], 'plains'),
  s('us_midwest', 'Midwest', 'usa', 41.5, -90.0, 35, 40, 38, 36, 'usa', false, ['us_northeast', 'us_midatlantic', 'us_southcentral', 'us_northwest'], 'plains'),
  s('us_southcentral', 'South Central', 'usa', 32.0, -97.0, 30, 30, 32, 30, 'usa', false, ['us_midwest', 'us_southeast', 'us_southwest', 'us_mountain'], 'plains'),
  s('us_southwest', 'Southwest', 'usa', 34.0, -112.0, 20, 20, 22, 20, 'usa', false, ['us_southcentral', 'us_mountain', 'us_pacific'], 'desert'),
  s('us_mountain', 'Mountain West', 'usa', 40.0, -110.0, 18, 15, 20, 18, 'usa', false, ['us_midwest', 'us_southcentral', 'us_southwest', 'us_northwest', 'us_pacific'], 'mountain'),
  s('us_northwest', 'Northwest', 'usa', 47.0, -118.0, 22, 18, 24, 22, 'usa', false, ['us_midwest', 'us_mountain', 'us_pacific'], 'forest'),
  s('us_pacific', 'Pacific Coast', 'usa', 37.0, -122.0, 40, 35, 42, 40, 'usa', false, ['us_northwest', 'us_mountain', 'us_southwest'], 'coastal'),
  s('us_alaska', 'Alaska', 'usa', 64.0, -152.0, 10, 5, 8, 8, 'usa', false, ['us_pacific'], 'forest'),
  s('us_hawaii', 'Hawaii', 'usa', 21.0, -158.0, 12, 8, 10, 10, 'usa', false, ['us_pacific'], 'coastal'),
  // Canada
  s('ca_ontario', 'Ontario', 'canada', 45.0, -81.0, 25, 25, 28, 25, 'usa', false, ['ca_quebec', 'ca_prairies', 'us_northeast', 'us_midwest'], 'forest'),
  s('ca_quebec', 'Quebec', 'canada', 52.0, -72.0, 22, 22, 24, 22, 'usa', false, ['ca_ontario', 'ca_maritimes', 'us_northeast'], 'forest'),
  s('ca_maritimes', 'Maritimes', 'canada', 46.0, -63.0, 15, 12, 15, 14, 'usa', false, ['ca_quebec', 'us_northeast'], 'coastal'),
  s('ca_prairies', 'Prairies', 'canada', 53.0, -106.0, 18, 15, 20, 18, 'usa', false, ['ca_ontario', 'ca_western', 'us_midwest', 'us_northwest'], 'plains'),
  s('ca_western', 'Western Canada', 'canada', 55.0, -122.0, 20, 12, 22, 20, 'usa', false, ['ca_prairies', 'us_northwest'], 'mountain'),
  // Mexico
  s('mx_north', 'Northern Mexico', 'mexico', 28.0, -102.0, 20, 25, 18, 20, 'usa', false, ['mx_central', 'us_southwest', 'us_southcentral'], 'desert'),
  s('mx_central', 'Central Mexico', 'mexico', 20.0, -100.0, 22, 30, 22, 22, 'usa', false, ['mx_north', 'mx_south', 'us_southwest'], 'mountain'),
  s('mx_south', 'Southern Mexico', 'mexico', 16.5, -95.0, 15, 20, 12, 14, 'usa', false, ['mx_central', 'mx_yucatan'], 'forest'),
  s('mx_yucatan', 'Yucatan', 'mexico', 20.0, -89.0, 12, 15, 10, 11, 'usa', false, ['mx_south'], 'coastal'),

  // ===== EUROPE - WEST =====
  s('uk_england', 'England', 'uk', 52.5, -1.5, 35, 40, 38, 35, 'usa', false, ['uk_scotland', 'uk_wales', 'fr_north'], 'urban'),
  s('uk_scotland', 'Scotland', 'uk', 57.0, -4.0, 20, 15, 22, 20, 'usa', false, ['uk_england', 'uk_northern'], 'mountain'),
  s('uk_wales', 'Wales', 'uk', 52.5, -3.8, 15, 10, 16, 14, 'usa', false, ['uk_england'], 'mountain'),
  s('uk_northern', 'Northern Ireland', 'uk', 54.8, -6.7, 12, 8, 12, 11, 'usa', false, ['uk_scotland', 'ie_dublin'], 'plains'),
  s('ie_dublin', 'Ireland', 'ireland', 53.5, -7.5, 14, 10, 14, 13, 'usa', false, ['uk_northern'], 'plains'),
  s('fr_paris', 'Paris Region', 'france', 48.8, 2.3, 35, 35, 38, 35, 'usa', false, ['fr_north', 'fr_normandy', 'fr_brittany', 'fr_central', 'fr_lorraine', 'be_brussels'], 'urban'),
  s('fr_north', 'Northern France', 'france', 50.5, 2.5, 25, 25, 28, 25, 'usa', false, ['fr_paris', 'fr_normandy', 'uk_england', 'be_brussels', 'nl_amsterdam'], 'plains'),
  s('fr_normandy', 'Normandy', 'france', 49.2, -0.4, 20, 18, 22, 20, 'usa', false, ['fr_north', 'fr_paris', 'fr_brittany', 'uk_england'], 'coastal'),
  s('fr_brittany', 'Brittany', 'france', 48.2, -3.0, 15, 12, 16, 14, 'usa', false, ['fr_normandy', 'fr_paris', 'fr_central'], 'coastal'),
  s('fr_central', 'Central France', 'france', 45.5, 2.5, 20, 18, 22, 20, 'usa', false, ['fr_paris', 'fr_brittany', 'fr_south', 'fr_lorraine', 'fr_alps'], 'mountain'),
  s('fr_south', 'Southern France', 'france', 43.5, 3.5, 22, 22, 24, 22, 'usa', false, ['fr_central', 'fr_alps', 'es_catalonia', 'it_north'], 'coastal'),
  s('fr_lorraine', 'Lorraine', 'france', 49.0, 6.0, 22, 20, 24, 22, 'usa', false, ['fr_paris', 'fr_central', 'fr_alps', 'de_west_rhine', 'lu_luxembourg'], 'plains'),
  s('fr_alps', 'French Alps', 'france', 45.0, 6.5, 15, 12, 16, 14, 'usa', false, ['fr_central', 'fr_south', 'fr_lorraine', 'it_north', 'ch_geneva'], 'mountain'),
  s('dz_algiers', 'Algiers', 'algeria', 36.8, 3.1, 15, 18, 12, 13, 'usa', false, ['dz_oran', 'dz_sahara', 'tn_tunis'], 'coastal'),
  s('dz_oran', 'Oran', 'algeria', 35.7, -0.6, 12, 14, 10, 11, 'usa', false, ['dz_algiers', 'dz_sahara', 'ma_casablanca'], 'coastal'),
  s('dz_sahara', 'Algerian Sahara', 'algeria', 28.0, 2.0, 8, 8, 6, 7, 'usa', false, ['dz_algiers', 'dz_oran'], 'desert'),
  s('nl_amsterdam', 'Netherlands', 'netherlands', 52.3, 5.0, 22, 20, 24, 22, 'usa', false, ['nl_rotterdam', 'be_brussels', 'de_west_rhine', 'fr_north'], 'urban'),
  s('nl_rotterdam', 'Rotterdam', 'netherlands', 51.9, 4.5, 20, 18, 22, 20, 'usa', false, ['nl_amsterdam', 'be_brussels', 'de_west_rhine'], 'coastal'),
  s('be_brussels', 'Belgium', 'belgium', 50.8, 4.4, 20, 18, 22, 20, 'usa', false, ['be_antwerp', 'nl_amsterdam', 'nl_rotterdam', 'fr_north', 'fr_lorraine', 'de_west_rhine', 'lu_luxembourg'], 'urban'),
  s('be_antwerp', 'Antwerp', 'belgium', 51.2, 4.4, 18, 15, 20, 18, 'usa', false, ['be_brussels', 'nl_amsterdam', 'nl_rotterdam'], 'coastal'),
  s('lu_luxembourg', 'Luxembourg', 'luxembourg', 49.6, 6.1, 10, 6, 12, 10, 'usa', false, ['be_brussels', 'fr_lorraine', 'de_west_rhine'], 'plains'),
  s('de_west_rhine', 'Rhineland', 'west_germany', 50.7, 7.1, 30, 30, 32, 30, 'usa', false, ['de_west_ruhr', 'de_west_bavaria', 'de_west_hanover', 'fr_lorraine', 'fr_alps', 'be_brussels', 'be_antwerp', 'nl_amsterdam', 'nl_rotterdam', 'lu_luxembourg'], 'urban'),
  s('de_west_ruhr', 'Ruhr', 'west_germany', 51.5, 7.5, 32, 35, 34, 32, 'usa', false, ['de_west_rhine', 'de_west_hanover', 'nl_amsterdam', 'nl_rotterdam'], 'urban'),
  s('de_west_hanover', 'Hanover', 'west_germany', 52.4, 9.7, 25, 25, 28, 25, 'usa', false, ['de_west_ruhr', 'de_west_rhine', 'de_west_bavaria', 'de_west_berlin', 'nl_amsterdam'], 'plains'),
  s('de_west_bavaria', 'Bavaria', 'west_germany', 49.8, 11.0, 25, 28, 26, 25, 'usa', false, ['de_west_rhine', 'de_west_hanover', 'de_west_berlin', 'at_vienna', 'cz_prague', 'fr_alps'], 'mountain'),
  s('de_west_berlin', 'West Berlin', 'west_germany', 52.5, 13.4, 20, 18, 22, 20, 'usa', false, ['de_west_hanover', 'de_west_bavaria', 'de_east_brandenburg', 'de_east_saxony'], 'urban'),
  s('de_east_brandenburg', 'Brandenburg', 'east_germany', 52.4, 12.5, 18, 18, 18, 18, 'ussr', false, ['de_east_saxony', 'de_east_mecklenburg', 'de_west_berlin', 'pl_pomerania', 'pl_poznan'], 'plains'),
  s('de_east_saxony', 'Saxony', 'east_germany', 51.0, 13.3, 20, 20, 20, 20, 'ussr', false, ['de_east_brandenburg', 'de_east_thuringia', 'de_west_berlin', 'de_west_bavaria', 'cz_prague'], 'urban'),
  s('de_east_thuringia', 'Thuringia', 'east_germany', 51.0, 11.0, 16, 15, 16, 15, 'ussr', false, ['de_east_saxony', 'de_west_bavaria', 'de_west_hanover'], 'mountain'),
  s('de_east_mecklenburg', 'Mecklenburg', 'east_germany', 53.8, 12.4, 15, 12, 15, 14, 'ussr', false, ['de_east_brandenburg', 'pl_pomerania'], 'coastal'),

  // ===== EUROPE - EAST & USSR =====
  s('pl_warsaw', 'Warsaw', 'poland', 52.2, 21.0, 20, 22, 20, 20, 'ussr', false, ['pl_poznan', 'pl_krakow', 'pl_pomerania', 'de_east_brandenburg', 'by_minsk', 'ua_kiev', 'cz_prague'], 'urban'),
  s('pl_poznan', 'Poznan', 'poland', 52.4, 16.9, 18, 18, 18, 18, 'ussr', false, ['pl_warsaw', 'pl_pomerania', 'pl_wroclaw', 'de_east_brandenburg'], 'plains'),
  s('pl_pomerania', 'Pomerania', 'poland', 54.4, 18.6, 15, 15, 14, 14, 'ussr', false, ['pl_poznan', 'pl_warsaw', 'de_east_mecklenburg'], 'coastal'),
  s('pl_krakow', 'Krakow', 'poland', 50.1, 19.9, 18, 18, 18, 18, 'ussr', false, ['pl_warsaw', 'pl_wroclaw', 'cz_prague', 'sk_bratislava', 'ua_kiev'], 'urban'),
  s('pl_wroclaw', 'Wroclaw', 'poland', 51.1, 17.0, 16, 15, 16, 15, 'ussr', false, ['pl_poznan', 'pl_krakow', 'cz_prague', 'de_east_thuringia'], 'plains'),
  s('cz_prague', 'Bohemia', 'czechoslovakia', 50.1, 14.4, 20, 20, 20, 20, 'ussr', false, ['cz_moravia', 'pl_wroclaw', 'pl_krakow', 'pl_warsaw', 'de_east_saxony', 'de_west_bavaria', 'at_vienna'], 'urban'),
  s('cz_moravia', 'Moravia', 'czechoslovakia', 49.2, 16.6, 18, 18, 18, 18, 'ussr', false, ['cz_prague', 'sk_bratislava', 'pl_krakow', 'pl_wroclaw'], 'mountain'),
  s('sk_bratislava', 'Slovakia', 'czechoslovakia', 48.1, 17.1, 16, 16, 16, 16, 'ussr', false, ['sk_kosice', 'cz_moravia', 'cz_prague', 'pl_krakow', 'hu_budapest', 'at_vienna', 'ua_kiev'], 'mountain'),
  s('sk_kosice', 'Eastern Slovakia', 'czechoslovakia', 48.7, 21.3, 14, 12, 14, 13, 'ussr', false, ['sk_bratislava', 'hu_budapest', 'ua_kiev', 'pl_krakow'], 'mountain'),
  s('hu_budapest', 'Budapest', 'hungary', 47.5, 19.0, 18, 18, 16, 17, 'ussr', false, ['hu_debrecen', 'sk_bratislava', 'sk_kosice', 'ro_transylvania', 'ro_bucharest', 'yu_croatia', 'at_vienna', 'ua_kiev'], 'urban'),
  s('hu_debrecen', 'Debrecen', 'hungary', 47.5, 21.6, 14, 12, 12, 12, 'ussr', false, ['hu_budapest', 'ro_transylvania', 'ro_bucharest', 'sk_kosice', 'ua_kiev'], 'plains'),
  s('ro_bucharest', 'Wallachia', 'romania', 44.4, 26.1, 16, 18, 14, 15, 'ussr', false, ['ro_transylvania', 'ro_moldova', 'hu_budapest', 'hu_debrecen', 'bg_sofia', 'ua_kiev', 'ua_odessa'], 'plains'),
  s('ro_transylvania', 'Transylvania', 'romania', 46.8, 23.6, 16, 16, 14, 15, 'ussr', false, ['ro_bucharest', 'ro_moldova', 'hu_budapest', 'hu_debrecen', 'yu_romania', 'ua_kiev'], 'mountain'),
  s('ro_moldova', 'Moldova', 'romania', 47.0, 28.5, 14, 14, 12, 13, 'ussr', false, ['ro_bucharest', 'ro_transylvania', 'ua_odessa', 'ua_kiev'], 'plains'),
  s('bg_sofia', 'Sofia', 'bulgaria', 42.7, 23.3, 14, 14, 12, 13, 'ussr', false, ['bg_plovdiv', 'ro_bucharest', 'yu_macedonia', 'yu_serbia', 'gr_thessaloniki', 'tr_istanbul', 'tr_izmir'], 'mountain'),
  s('bg_plovdiv', 'Plovdiv', 'bulgaria', 42.1, 24.7, 12, 12, 10, 11, 'ussr', false, ['bg_sofia', 'ro_bucharest', 'gr_thessaloniki', 'tr_istanbul'], 'plains'),
  s('al_tirana', 'Albania', 'albania', 41.3, 19.8, 10, 8, 8, 8, 'ussr', false, ['yu_montenegro', 'gr_thessaloniki'], 'mountain'),
  s('yu_serbia', 'Serbia', 'yugoslavia', 44.8, 20.5, 16, 18, 14, 15, 'usa', false, ['yu_croatia', 'yu_bosnia', 'yu_montenegro', 'yu_macedonia', 'ro_bucharest', 'ro_transylvania', 'hu_budapest', 'bg_sofia', 'bg_plovdiv'], 'mountain'),
  s('yu_croatia', 'Croatia', 'yugoslavia', 45.8, 16.0, 14, 14, 12, 13, 'usa', false, ['yu_serbia', 'yu_bosnia', 'yu_slovenia', 'at_vienna', 'hu_budapest'], 'coastal'),
  s('yu_bosnia', 'Bosnia', 'yugoslavia', 43.9, 18.4, 12, 12, 10, 11, 'usa', false, ['yu_croatia', 'yu_serbia', 'yu_montenegro'], 'mountain'),
  s('yu_montenegro', 'Montenegro', 'yugoslavia', 42.7, 19.4, 10, 8, 8, 8, 'usa', false, ['yu_bosnia', 'yu_serbia', 'yu_macedonia', 'al_tirana'], 'mountain'),
  s('yu_macedonia', 'Macedonia', 'yugoslavia', 41.6, 21.7, 12, 12, 10, 11, 'usa', false, ['yu_serbia', 'yu_montenegro', 'bg_sofia', 'gr_thessaloniki', 'gr_athens'], 'mountain'),
  s('yu_slovenia', 'Slovenia', 'yugoslavia', 46.1, 14.5, 12, 10, 12, 11, 'usa', false, ['yu_croatia', 'at_vienna', 'it_northeast'], 'mountain'),
  s('at_vienna', 'Austria', 'austria', 48.2, 16.4, 16, 16, 16, 16, 'usa', false, ['at_salzburg', 'de_west_bavaria', 'cz_prague', 'hu_budapest', 'it_northeast', 'yu_slovenia', 'yu_croatia'], 'mountain'),
  s('at_salzburg', 'Salzburg', 'austria', 47.8, 13.0, 14, 12, 14, 13, 'usa', false, ['at_vienna', 'de_west_bavaria', 'it_northeast'], 'mountain'),
  s('ch_zurich', 'Swiss Plateau', 'switzerland', 47.4, 8.5, 18, 16, 18, 17, 'usa', false, ['ch_geneva', 'ch_ticino', 'de_west_bavaria', 'fr_alps', 'fr_lorraine', 'it_northeast'], 'mountain'),
  s('ch_geneva', 'Geneva', 'switzerland', 46.2, 6.1, 16, 14, 16, 15, 'usa', false, ['ch_zurich', 'fr_alps', 'fr_south', 'it_northeast'], 'mountain'),
  s('ch_ticino', 'Ticino', 'switzerland', 46.3, 9.0, 14, 12, 14, 13, 'usa', false, ['ch_zurich', 'it_northeast', 'it_north'], 'mountain'),
  s('it_north', 'Northern Italy', 'italy', 45.5, 9.2, 22, 25, 24, 22, 'usa', false, ['it_northeast', 'it_central', 'ch_ticino', 'fr_alps', 'fr_south'], 'urban'),
  s('it_northeast', 'Northeast Italy', 'italy', 45.4, 11.9, 20, 20, 22, 20, 'usa', false, ['it_north', 'it_central', 'at_salzburg', 'at_vienna', 'yu_slovenia', 'ch_ticino'], 'plains'),
  s('it_central', 'Central Italy', 'italy', 42.0, 12.5, 18, 18, 18, 18, 'usa', false, ['it_north', 'it_northeast', 'it_south', 'it_rome'], 'mountain'),
  s('it_rome', 'Rome', 'italy', 41.9, 12.5, 18, 18, 18, 18, 'usa', false, ['it_central', 'it_south'], 'urban'),
  s('it_south', 'Southern Italy', 'italy', 40.0, 16.0, 15, 18, 12, 14, 'usa', false, ['it_rome', 'it_central', 'it_sicily', 'it_naples'], 'mountain'),
  s('it_naples', 'Naples', 'italy', 40.9, 14.3, 16, 16, 14, 15, 'usa', false, ['it_south', 'it_sicily'], 'coastal'),
  s('it_sicily', 'Sicily', 'italy', 37.5, 14.0, 14, 14, 12, 13, 'usa', false, ['it_naples', 'it_south'], 'coastal'),
  s('es_madrid', 'Madrid', 'spain', 40.4, -3.7, 22, 25, 22, 22, 'usa', false, ['es_catalonia', 'es_andalusia', 'es_basque', 'es_valencia', 'pt_lisbon'], 'urban'),
  s('es_catalonia', 'Catalonia', 'spain', 41.4, 2.2, 20, 22, 20, 20, 'usa', false, ['es_madrid', 'es_valencia', 'fr_south', 'fr_alps', 'andorra'], 'coastal'),
  s('es_valencia', 'Valencia', 'spain', 39.5, -0.4, 18, 20, 16, 18, 'usa', false, ['es_madrid', 'es_catalonia', 'es_andalusia'], 'coastal'),
  s('es_andalusia', 'Andalusia', 'spain', 37.4, -5.9, 18, 20, 16, 18, 'usa', false, ['es_madrid', 'es_valencia', 'pt_lisbon'], 'coastal'),
  s('es_basque', 'Basque Country', 'spain', 43.3, -2.5, 16, 14, 16, 15, 'usa', false, ['es_madrid', 'fr_south', 'fr_alps', 'fr_brittany'], 'mountain'),
  s('pt_lisbon', 'Lisbon', 'portugal', 38.7, -9.1, 16, 16, 14, 15, 'usa', false, ['pt_porto', 'es_andalusia', 'es_madrid'], 'coastal'),
  s('pt_porto', 'Porto', 'portugal', 41.1, -8.6, 14, 14, 12, 13, 'usa', false, ['pt_lisbon', 'es_andalusia'], 'coastal'),
  s('ad_andorra', 'Andorra', 'andorra', 42.5, 1.5, 8, 4, 8, 7, 'usa', false, ['es_catalonia', 'fr_south'], 'mountain'),
  s('gr_athens', 'Athens', 'greece', 37.9, 23.7, 16, 18, 14, 15, 'usa', false, ['gr_thessaloniki', 'gr_peloponnese', 'gr_crete', 'yu_macedonia', 'tr_izmir'], 'coastal'),
  s('gr_thessaloniki', 'Thessaloniki', 'greece', 40.6, 23.0, 14, 14, 12, 13, 'usa', false, ['gr_athens', 'gr_peloponnese', 'yu_macedonia', 'bg_sofia', 'bg_plovdiv', 'tr_istanbul', 'tr_izmir'], 'coastal'),
  s('gr_peloponnese', 'Peloponnese', 'greece', 37.5, 22.0, 12, 12, 10, 11, 'usa', false, ['gr_athens', 'gr_thessaloniki'], 'mountain'),
  s('gr_crete', 'Crete', 'greece', 35.2, 24.8, 10, 10, 8, 9, 'usa', false, ['gr_athens'], 'coastal'),
  s('tr_istanbul', 'Istanbul', 'turkey', 41.0, 28.9, 18, 22, 16, 17, 'usa', false, ['tr_ankara', 'tr_izmir', 'bg_sofia', 'bg_plovdiv', 'gr_thessaloniki', 'gr_athens', 'ro_bucharest', 'ro_transylvania', 'ua_odessa'], 'coastal'),
  s('tr_ankara', 'Ankara', 'turkey', 39.9, 32.9, 16, 18, 14, 15, 'usa', false, ['tr_istanbul', 'tr_izmir', 'tr_east', 'sy_damascus', 'ua_kiev', 'ua_odessa'], 'mountain'),
  s('tr_izmir', 'Izmir', 'turkey', 38.4, 27.1, 14, 16, 12, 13, 'usa', false, ['tr_ankara', 'tr_istanbul', 'gr_athens', 'gr_thessaloniki'], 'coastal'),
  s('tr_east', 'Eastern Turkey', 'turkey', 39.0, 41.0, 12, 14, 10, 11, 'usa', false, ['tr_ankara', 'sy_damascus', 'iq_mosul', 'iq_baghdad', 'ir_tehran', 'ua_kiev'], 'mountain'),

  // Scandinavia
  s('no_oslo', 'Oslo', 'norway', 59.9, 10.8, 18, 16, 18, 17, 'usa', false, ['no_bergen', 'no_north', 'se_stockholm', 'se_gothenburg', 'dk_copenhagen', 'dk_jutland'], 'coastal'),
  s('no_bergen', 'Bergen', 'norway', 60.4, 5.3, 14, 12, 14, 13, 'usa', false, ['no_oslo', 'no_north', 'uk_scotland'], 'coastal'),
  s('no_north', 'Northern Norway', 'norway', 69.0, 23.0, 10, 8, 10, 9, 'usa', false, ['no_bergen', 'no_oslo', 'su_murmansk', 'fi_lapland'], 'forest'),
  s('se_stockholm', 'Stockholm', 'sweden', 59.3, 18.1, 18, 18, 18, 18, 'usa', false, ['se_gothenburg', 'se_north', 'no_oslo', 'fi_helsinki', 'fi_tampere'], 'coastal'),
  s('se_gothenburg', 'Gothenburg', 'sweden', 57.7, 11.9, 16, 16, 16, 16, 'usa', false, ['se_stockholm', 'se_north', 'no_oslo', 'no_bergen', 'dk_jutland'], 'coastal'),
  s('se_north', 'Northern Sweden', 'sweden', 66.0, 18.0, 12, 10, 12, 11, 'usa', false, ['se_stockholm', 'se_gothenburg', 'fi_lapland', 'no_north'], 'forest'),
  s('dk_copenhagen', 'Copenhagen', 'denmark', 55.7, 12.6, 16, 14, 16, 15, 'usa', false, ['dk_jutland', 'no_oslo', 'se_stockholm', 'de_west_hanover'], 'coastal'),
  s('dk_jutland', 'Jutland', 'denmark', 56.3, 9.5, 14, 12, 14, 13, 'usa', false, ['dk_copenhagen', 'de_west_hanover', 'se_gothenburg', 'no_oslo'], 'coastal'),
  s('fi_helsinki', 'Helsinki', 'finland', 60.2, 24.9, 16, 14, 16, 15, 'usa', false, ['fi_tampere', 'fi_lapland', 'se_stockholm', 'no_oslo', 'su_leningrad', 'su_murmansk'], 'coastal'),
  s('fi_tampere', 'Tampere', 'finland', 61.5, 23.8, 14, 12, 14, 13, 'usa', false, ['fi_helsinki', 'fi_lapland', 'su_leningrad', 'su_murmansk'], 'forest'),
  s('fi_lapland', 'Lapland', 'finland', 67.0, 26.0, 10, 6, 10, 8, 'usa', false, ['fi_helsinki', 'fi_tampere', 'no_north', 'su_murmansk', 'su_leningrad'], 'forest'),

  // ===== USSR =====
  s('su_moscow', 'Moscow', 'ussr', 55.8, 37.6, 35, 40, 35, 35, 'ussr', true, ['su_leningrad', 'su_ukraine', 'su_belarus', 'su_volga', 'su_central', 'su_kazan'], 'urban'),
  s('su_leningrad', 'Leningrad', 'ussr', 59.9, 30.3, 28, 30, 28, 28, 'ussr', false, ['su_moscow', 'su_karelia', 'su_baltic', 'su_ukraine', 'su_belarus', 'fi_helsinki', 'fi_tampere', 'fi_lapland', 'no_oslo', 'no_bergen', 'no_north'], 'coastal'),
  s('su_karelia', 'Karelia', 'ussr', 66.0, 32.0, 12, 10, 10, 10, 'ussr', false, ['su_leningrad', 'su_murmansk', 'su_arkhangelsk', 'fi_lapland'], 'forest'),
  s('su_murmansk', 'Murmansk', 'ussr', 68.9, 33.1, 10, 8, 10, 9, 'ussr', false, ['su_karelia', 'su_arkhangelsk', 'no_north', 'fi_lapland', 'fi_tampere', 'fi_helsinki'], 'forest'),
  s('su_arkhangelsk', 'Arkhangelsk', 'ussr', 64.5, 40.5, 12, 10, 12, 11, 'ussr', false, ['su_murmansk', 'su_karelia', 'su_ural', 'su_volga', 'su_leningrad'], 'forest'),
  s('su_baltic', 'Baltic', 'ussr', 56.0, 24.0, 18, 18, 18, 18, 'ussr', false, ['su_leningrad', 'su_belarus', 'su_moscow', 'pl_pomerania', 'pl_poznan', 'pl_warsaw'], 'coastal'),
  s('su_belarus', 'Belarus', 'ussr', 53.9, 27.6, 20, 22, 18, 20, 'ussr', false, ['su_baltic', 'su_moscow', 'su_ukraine', 'su_volga', 'pl_warsaw', 'pl_poznan', 'pl_krakow'], 'forest'),
  s('su_ukraine', 'Ukraine', 'ussr', 50.4, 30.5, 25, 30, 22, 25, 'ussr', false, ['su_belarus', 'su_moscow', 'su_volga', 'su_caucasus', 'su_moldova', 'pl_krakow', 'pl_warsaw', 'ro_bucharest', 'ro_transylvania', 'ro_moldova'], 'plains'),
  s('su_moldova', 'Moldavian SSR', 'ussr', 47.0, 28.5, 14, 16, 12, 13, 'ussr', false, ['su_ukraine', 'su_caucasus', 'ro_bucharest', 'ro_moldova'], 'plains'),
  s('su_volga', 'Volga', 'ussr', 53.0, 50.0, 18, 20, 16, 18, 'ussr', false, ['su_moscow', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_kazakh', 'su_central', 'su_ural', 'su_arkhangelsk'], 'plains'),
  s('su_caucasus', 'Caucasus', 'ussr', 42.0, 45.0, 18, 22, 16, 18, 'ussr', false, ['su_ukraine', 'su_moldova', 'su_volga', 'su_kazakh', 'tr_east', 'tr_ankara', 'tr_izmir', 'ir_tehran', 'ir_tabriz'], 'mountain'),
  s('su_kazakh', 'Kazakhstan', 'ussr', 48.0, 68.0, 15, 18, 12, 14, 'ussr', false, ['su_volga', 'su_caucasus', 'su_central', 'su_siberia', 'tr_east', 'tr_ankara', 'tr_izmir', 'ir_tehran', 'ir_tabriz', 'cn_xinjiang', 'mn_ulaanbaatar'], 'desert'),
  s('su_ural', 'Ural', 'ussr', 60.0, 60.0, 16, 14, 16, 15, 'ussr', false, ['su_arkhangelsk', 'su_volga', 'su_central', 'su_siberia', 'su_karelia', 'su_leningrad'], 'mountain'),
  s('su_central', 'Central Russia', 'ussr', 55.0, 45.0, 18, 18, 16, 17, 'ussr', false, ['su_moscow', 'su_volga', 'su_ural', 'su_siberia', 'su_kazan'], 'forest'),
  s('su_kazan', 'Kazan', 'ussr', 55.0, 49.0, 16, 16, 14, 15, 'ussr', false, ['su_moscow', 'su_central', 'su_ural', 'su_volga'], 'urban'),
  s('su_siberia', 'Siberia', 'ussr', 60.0, 90.0, 14, 14, 12, 13, 'ussr', false, ['su_ural', 'su_central', 'su_volga', 'su_kazakh', 'su_far_east', 'su_lake_baikal', 'cn_manchuria', 'mn_ulaanbaatar'], 'forest'),
  s('su_far_east', 'Far East', 'ussr', 60.0, 140.0, 12, 10, 12, 11, 'ussr', false, ['su_siberia', 'su_lake_baikal', 'su_kamchatka', 'cn_manchuria', 'cn_beijing', 'jp_hokkaido', 'jp_tokyo', 'kr_north', 'mn_ulaanbaatar'], 'forest'),
  s('su_kamchatka', 'Kamchatka', 'ussr', 56.0, 160.0, 8, 4, 8, 6, 'ussr', false, ['su_far_east', 'jp_hokkaido', 'us_alaska', 'us_hawaii'], 'forest'),
  s('su_lake_baikal', 'Lake Baikal', 'ussr', 53.0, 108.0, 10, 8, 10, 9, 'ussr', false, ['su_siberia', 'su_far_east', 'su_mongolia', 'cn_manchuria', 'cn_mongolia', 'mn_ulaanbaatar'], 'forest'),
  s('su_mongolia', 'Soviet Mongolia', 'ussr', 46.0, 110.0, 10, 8, 10, 9, 'ussr', false, ['su_lake_baikal', 'su_far_east', 'cn_mongolia', 'cn_manchuria', 'mn_ulaanbaatar'], 'desert'),

  // ===== ASIA =====
  s('cn_beijing', 'Beijing', 'china', 39.9, 116.4, 22, 30, 20, 22, 'ussr', false, ['cn_shanghai', 'cn_manchuria', 'cn_mongolia', 'cn_xinjiang', 'cn_sichuan', 'cn_shanxi', 'kr_north', 'mn_ulaanbaatar', 'su_far_east', 'su_mongolia', 'su_lake_baikal'], 'urban'),
  s('cn_shanghai', 'Shanghai', 'china', 31.2, 121.5, 20, 28, 18, 20, 'usa', false, ['cn_beijing', 'cn_sichuan', 'cn_guangdong', 'cn_shanxi', 'tw_taipei', 'kr_north', 'kr_south', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido'], 'coastal'),
  s('cn_manchuria', 'Manchuria', 'china', 43.0, 125.0, 18, 22, 16, 18, 'ussr', false, ['cn_beijing', 'cn_mongolia', 'cn_shanxi', 'kr_north', 'su_far_east', 'su_lake_baikal', 'su_mongolia', 'mn_ulaanbaatar'], 'urban'),
  s('cn_mongolia', 'Inner Mongolia', 'china', 43.0, 112.0, 12, 14, 10, 11, 'ussr', false, ['cn_beijing', 'cn_manchuria', 'cn_xinjiang', 'cn_shanxi', 'su_mongolia', 'su_lake_baikal', 'su_far_east', 'mn_ulaanbaatar'], 'desert'),
  s('cn_xinjiang', 'Xinjiang', 'china', 42.0, 85.0, 10, 12, 8, 9, 'ussr', false, ['cn_mongolia', 'cn_shanxi', 'cn_tibet', 'cn_sichuan', 'su_kazakh', 'su_siberia', 'su_mongolia', 'su_lake_baikal', 'mn_ulaanbaatar', 'ir_tehran', 'ir_tabriz', 'af_kabul', 'in_kashmir', 'pk_karachi', 'pk_lahore'], 'desert'),
  s('cn_shanxi', 'Shanxi', 'china', 37.0, 112.0, 14, 18, 12, 13, 'usa', false, ['cn_beijing', 'cn_shanghai', 'cn_manchuria', 'cn_mongolia', 'cn_xinjiang', 'cn_sichuan', 'cn_guangdong', 'kr_north', 'kr_south'], 'mountain'),
  s('cn_sichuan', 'Sichuan', 'china', 30.7, 104.1, 16, 22, 14, 16, 'usa', false, ['cn_beijing', 'cn_shanghai', 'cn_shanxi', 'cn_guangdong', 'cn_tibet', 'cn_xinjiang', 'cn_yunnan'], 'mountain'),
  s('cn_tibet', 'Tibet', 'china', 30.0, 90.0, 8, 10, 6, 7, 'usa', false, ['cn_xinjiang', 'cn_sichuan', 'cn_yunnan', 'cn_guangdong', 'in_kashmir', 'in_delhi', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'my_yangon', 'th_bangkok', 'la_vientiane', 'vn_hanoi', 'vn_saigon'], 'mountain'),
  s('cn_yunnan', 'Yunnan', 'china', 25.0, 102.0, 12, 16, 10, 11, 'usa', false, ['cn_sichuan', 'cn_tibet', 'cn_guangdong', 'my_yangon', 'la_vientiane', 'vn_hanoi', 'vn_saigon', 'th_bangkok'], 'forest'),
  s('cn_guangdong', 'Guangdong', 'china', 23.1, 113.3, 18, 24, 16, 18, 'usa', false, ['cn_shanghai', 'cn_shanxi', 'cn_sichuan', 'cn_yunnan', 'cn_tibet', 'hk_hongkong', 'tw_taipei', 'kr_north', 'kr_south', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'vn_hanoi', 'vn_saigon', 'vn_hue', 'my_yangon', 'la_vientiane', 'th_bangkok', 'ph_manila', 'ph_cebu'], 'coastal'),
  s('tw_taipei', 'Taiwan', 'taiwan', 25.0, 121.5, 14, 16, 12, 13, 'usa', false, ['cn_shanghai', 'cn_guangdong', 'hk_hongkong', 'jp_tokyo', 'jp_osaka', 'ph_manila', 'ph_cebu'], 'coastal'),
  s('hk_hongkong', 'Hong Kong', 'hongkong', 22.3, 114.2, 12, 14, 12, 12, 'usa', false, ['cn_guangdong', 'tw_taipei', 'ph_manila', 'ph_cebu'], 'coastal'),
  s('kr_north', 'North Korea', 'north_korea', 40.0, 127.0, 14, 18, 12, 13, 'ussr', false, ['kr_south', 'cn_manchuria', 'cn_beijing', 'cn_shanxi', 'su_far_east', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido'], 'mountain'),
  s('kr_south', 'South Korea', 'south_korea', 36.0, 128.0, 16, 22, 14, 16, 'usa', false, ['kr_north', 'cn_shanxi', 'cn_shanghai', 'cn_guangdong', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido'], 'coastal'),
  s('jp_tokyo', 'Honshu', 'japan', 36.0, 138.0, 22, 30, 20, 22, 'usa', false, ['jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'kr_south', 'kr_north', 'cn_shanghai', 'cn_guangdong', 'tw_taipei', 'hk_hongkong', 'ph_manila', 'su_far_east', 'su_kamchatka', 'us_alaska', 'us_hawaii'], 'coastal'),
  s('jp_osaka', 'Kyushu', 'japan', 33.0, 131.0, 18, 22, 16, 18, 'usa', false, ['jp_tokyo', 'jp_hokkaido', 'jp_okinawa', 'kr_south', 'kr_north', 'cn_shanghai', 'cn_guangdong', 'tw_taipei', 'hk_hongkong', 'ph_manila', 'su_far_east', 'su_kamchatka', 'us_alaska', 'us_hawaii'], 'coastal'),
  s('jp_hokkaido', 'Hokkaido', 'japan', 43.0, 142.0, 14, 14, 12, 13, 'usa', false, ['jp_tokyo', 'jp_osaka', 'su_far_east', 'su_kamchatka', 'kr_north', 'us_alaska', 'us_hawaii'], 'coastal'),
  s('jp_okinawa', 'Okinawa', 'japan', 26.0, 128.0, 10, 10, 8, 9, 'usa', false, ['jp_tokyo', 'jp_osaka', 'cn_guangdong', 'tw_taipei', 'ph_manila', 'ph_cebu', 'hk_hongkong', 'us_hawaii'], 'coastal'),
  s('vn_hanoi', 'Tonkin', 'vietnam', 21.0, 105.8, 14, 18, 12, 13, 'ussr', false, ['vn_hue', 'vn_saigon', 'cn_guangdong', 'cn_yunnan', 'cn_sichuan', 'cn_tibet', 'la_vientiane', 'th_bangkok', 'my_yangon', 'kh_phnom_penh'], 'coastal'),
  s('vn_hue', 'Annam', 'vietnam', 16.5, 107.6, 12, 16, 10, 11, 'ussr', false, ['vn_hanoi', 'vn_saigon', 'cn_guangdong', 'cn_yunnan', 'la_vientiane', 'kh_phnom_penh', 'th_bangkok', 'my_yangon'], 'mountain'),
  s('vn_saigon', 'Cochinchina', 'vietnam', 10.8, 106.7, 14, 20, 12, 14, 'ussr', false, ['vn_hanoi', 'vn_hue', 'cn_guangdong', 'cn_yunnan', 'kh_phnom_penh', 'th_bangkok', 'my_yangon', 'la_vientiane', 'ph_manila', 'ph_cebu', 'id_java', 'id_sumatra', 'sg_singapore'], 'coastal'),
  s('la_vientiane', 'Laos', 'laos', 19.0, 102.5, 8, 8, 6, 7, 'ussr', false, ['vn_hanoi', 'vn_hue', 'vn_saigon', 'cn_yunnan', 'cn_tibet', 'th_bangkok', 'kh_phnom_penh', 'my_yangon'], 'forest'),
  s('kh_phnom_penh', 'Cambodia', 'cambodia', 12.0, 105.0, 10, 12, 8, 9, 'ussr', false, ['vn_saigon', 'vn_hue', 'vn_hanoi', 'la_vientiane', 'th_bangkok', 'my_yangon'], 'forest'),
  s('th_bangkok', 'Thailand', 'thailand', 13.8, 100.5, 14, 20, 12, 14, 'usa', false, ['th_chiangmai', 'vn_hanoi', 'vn_hue', 'vn_saigon', 'la_vientiane', 'kh_phnom_penh', 'my_yangon', 'cn_yunnan', 'cn_tibet', 'sg_singapore'], 'coastal'),
  s('th_chiangmai', 'Chiang Mai', 'thailand', 18.8, 98.9, 12, 14, 10, 11, 'usa', false, ['th_bangkok', 'vn_hanoi', 'vn_hue', 'cn_yunnan', 'cn_tibet', 'my_yangon', 'la_vientiane', 'kh_phnom_penh'], 'mountain'),
  s('my_yangon', 'Burma', 'myanmar', 17.0, 96.0, 12, 16, 10, 11, 'usa', false, ['th_bangkok', 'th_chiangmai', 'vn_hanoi', 'vn_hue', 'vn_saigon', 'la_vientiane', 'kh_phnom_penh', 'cn_yunnan', 'cn_tibet', 'cn_sichuan', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'sg_singapore'], 'forest'),
  s('my_kl', 'Malaya', 'malaysia', 3.1, 101.7, 14, 16, 12, 13, 'usa', false, ['th_bangkok', 'th_chiangmai', 'vn_saigon', 'cn_guangdong', 'cn_yunnan', 'cn_tibet', 'sg_singapore', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'ph_manila', 'ph_cebu', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'coastal'),
  s('sg_singapore', 'Singapore', 'singapore', 1.3, 103.8, 12, 10, 12, 11, 'usa', false, ['my_kl', 'th_bangkok', 'th_chiangmai', 'vn_saigon', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'ph_manila', 'ph_cebu', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'coastal'),
  s('id_java', 'Java', 'indonesia', -7.3, 110.0, 14, 24, 12, 14, 'usa', false, ['id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'cn_guangdong', 'cn_yunnan', 'cn_tibet', 'ph_manila', 'ph_cebu', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'coastal'),
  s('id_sumatra', 'Sumatra', 'indonesia', 0.5, 101.0, 12, 18, 10, 11, 'usa', false, ['id_java', 'id_kalimantan', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'cn_guangdong', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'coastal'),
  s('id_kalimantan', 'Kalimantan', 'indonesia', -1.0, 113.0, 10, 14, 8, 9, 'usa', false, ['id_java', 'id_sumatra', 'id_sulawesi', 'id_bali', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'cn_guangdong', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas', 'ph_manila', 'ph_cebu', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'forest'),
  s('id_sulawesi', 'Sulawesi', 'indonesia', -2.0, 121.0, 10, 12, 8, 9, 'usa', false, ['id_java', 'id_kalimantan', 'id_bali', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'cn_guangdong', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas', 'ph_manila', 'ph_cebu', 'in_bombay', 'in_madras', 'in_kolkata', 'in_delhi', 'in_kashmir', 'pk_karachi', 'pk_lahore', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'coastal'),
  s('id_bali', 'Bali', 'indonesia', -8.5, 115.0, 8, 10, 6, 7, 'usa', false, ['id_java', 'id_kalimantan', 'id_sulawesi', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas'], 'coastal'),
  s('ph_manila', 'Luzon', 'philippines', 14.6, 121.0, 14, 22, 12, 14, 'usa', false, ['ph_cebu', 'ph_mindanao', 'cn_guangdong', 'cn_shanghai', 'cn_yunnan', 'cn_tibet', 'tw_taipei', 'hk_hongkong', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas'], 'coastal'),
  s('ph_cebu', 'Visayas', 'philippines', 10.3, 123.9, 12, 18, 10, 11, 'usa', false, ['ph_manila', 'ph_mindanao', 'cn_guangdong', 'cn_shanghai', 'cn_yunnan', 'cn_tibet', 'tw_taipei', 'hk_hongkong', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas'], 'coastal'),
  s('ph_mindanao', 'Mindanao', 'philippines', 7.0, 125.0, 10, 14, 8, 9, 'usa', false, ['ph_manila', 'ph_cebu', 'cn_guangdong', 'cn_shanghai', 'cn_yunnan', 'cn_tibet', 'tw_taipei', 'hk_hongkong', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'my_kl', 'sg_singapore', 'th_bangkok', 'vn_saigon', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'au_nsw', 'au_vic', 'au_qld', 'au_wa', 'au_nt', 'au_tas'], 'coastal'),
  s('mn_ulaanbaatar', 'Mongolia', 'mongolia', 47.9, 106.9, 8, 8, 6, 7, 'ussr', false, ['cn_mongolia', 'cn_manchuria', 'cn_beijing', 'cn_shanxi', 'cn_xinjiang', 'su_far_east', 'su_lake_baikal', 'su_siberia', 'su_kazakh', 'su_mongolia', 'su_central', 'su_ural', 'su_volga', 'su_moscow', 'su_leningrad', 'su_baltic', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_moldova', 'kz_almaty'], 'desert'),
  s('in_delhi', 'Delhi', 'india', 28.6, 77.2, 18, 30, 16, 18, 'usa', false, ['in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'urban'),
  s('in_bombay', 'Bombay', 'india', 19.1, 72.9, 16, 28, 14, 16, 'usa', false, ['in_delhi', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'coastal'),
  s('in_madras', 'Madras', 'india', 13.1, 80.3, 14, 26, 12, 14, 'usa', false, ['in_delhi', 'in_bombay', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'coastal'),
  s('in_kolkata', 'Calcutta', 'india', 22.6, 88.4, 16, 28, 14, 16, 'usa', false, ['in_delhi', 'in_bombay', 'in_madras', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'coastal'),
  s('in_kashmir', 'Kashmir', 'india', 34.5, 76.5, 10, 14, 8, 9, 'usa', false, ['in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'pk_lahore', 'pk_karachi', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'mountain'),
  s('pk_lahore', 'Punjab', 'pakistan', 31.5, 74.3, 14, 22, 12, 14, 'usa', false, ['pk_karachi', 'pk_islamabad', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'plains'),
  s('pk_karachi', 'Sindh', 'pakistan', 24.9, 67.0, 12, 20, 10, 11, 'usa', false, ['pk_lahore', 'pk_islamabad', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'coastal'),
  s('pk_islamabad', 'North-West Frontier', 'pakistan', 33.7, 73.1, 10, 14, 8, 9, 'usa', false, ['pk_lahore', 'pk_karachi', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'np_kathmandu', 'bt_thimphu', 'bd_dhaka', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'mountain'),
  s('bd_dhaka', 'East Bengal', 'bangladesh', 24.0, 90.0, 12, 20, 10, 11, 'usa', false, ['in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'np_kathmandu', 'bt_thimphu', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'coastal'),
  s('np_kathmandu', 'Nepal', 'nepal', 27.7, 85.3, 8, 10, 6, 7, 'usa', false, ['in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'bt_thimphu', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'mountain'),
  s('bt_thimphu', 'Bhutan', 'bhutan', 27.5, 90.5, 6, 6, 4, 5, 'usa', false, ['in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'af_kabul', 'af_kandahar', 'af_herat', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'mountain'),
  s('af_kabul', 'Kabul', 'afghanistan', 34.5, 69.2, 10, 14, 8, 9, 'usa', false, ['af_kandahar', 'af_herat', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'mountain'),
  s('af_kandahar', 'Kandahar', 'afghanistan', 31.6, 65.7, 8, 10, 6, 7, 'usa', false, ['af_kabul', 'af_herat', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'desert'),
  s('af_herat', 'Herat', 'afghanistan', 34.3, 62.2, 8, 10, 6, 7, 'usa', false, ['af_kabul', 'af_kandahar', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad'], 'desert'),
  s('ir_tehran', 'Tehran', 'iran', 35.7, 51.4, 16, 22, 14, 16, 'usa', false, ['ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'af_kabul', 'af_kandahar', 'af_herat', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra'], 'urban'),
  s('ir_tabriz', 'Tabriz', 'iran', 38.1, 46.3, 14, 18, 12, 13, 'usa', false, ['ir_tehran', 'ir_isfahan', 'ir_mashhad', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'af_kabul', 'af_kandahar', 'af_herat', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra'], 'mountain'),
  s('ir_isfahan', 'Isfahan', 'iran', 32.7, 51.7, 14, 18, 12, 13, 'usa', false, ['ir_tehran', 'ir_tabriz', 'ir_mashhad', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'af_kabul', 'af_kandahar', 'af_herat', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra'], 'desert'),
  s('ir_mashhad', 'Mashhad', 'iran', 36.3, 59.6, 12, 16, 10, 11, 'usa', false, ['ir_tehran', 'ir_tabriz', 'ir_isfahan', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'af_kabul', 'af_kandahar', 'af_herat', 'cn_tibet', 'cn_sichuan', 'cn_xinjiang', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra'], 'mountain'),
  s('iq_baghdad', 'Baghdad', 'iraq', 33.3, 44.4, 14, 18, 12, 13, 'usa', false, ['iq_mosul', 'iq_basra', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'sy_damascus', 'sy_aleppo', 'jo_amman', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'urban'),
  s('iq_mosul', 'Mosul', 'iraq', 36.3, 43.1, 12, 14, 10, 11, 'usa', false, ['iq_baghdad', 'iq_basra', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'sy_damascus', 'sy_aleppo', 'jo_amman', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'mountain'),
  s('iq_basra', 'Basra', 'iraq', 30.5, 47.8, 12, 14, 10, 11, 'usa', false, ['iq_baghdad', 'iq_mosul', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'sy_damascus', 'sy_aleppo', 'jo_amman', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'coastal'),
  s('sy_damascus', 'Damascus', 'syria', 33.5, 36.3, 12, 16, 10, 11, 'usa', false, ['sy_aleppo', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'jo_amman', 'il_jerusalem', 'il_telaviv', 'lb_beirut', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'urban'),
  s('sy_aleppo', 'Aleppo', 'syria', 36.2, 37.2, 10, 14, 8, 9, 'usa', false, ['sy_damascus', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'jo_amman', 'il_jerusalem', 'il_telaviv', 'lb_beirut', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'urban'),
  s('lb_beirut', 'Lebanon', 'lebanon', 33.9, 35.5, 10, 12, 10, 10, 'usa', false, ['sy_damascus', 'sy_aleppo', 'il_jerusalem', 'il_telaviv', 'jo_amman', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'coastal'),
  s('il_jerusalem', 'Palestine', 'israel', 31.8, 35.2, 12, 14, 10, 11, 'usa', false, ['il_telaviv', 'sy_damascus', 'sy_aleppo', 'jo_amman', 'lb_beirut', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'eg_cairo', 'eg_alexandria', 'eg_suez', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'urban'),
  s('il_telaviv', 'Tel Aviv', 'israel', 32.1, 34.8, 12, 14, 10, 11, 'usa', false, ['il_jerusalem', 'sy_damascus', 'sy_aleppo', 'jo_amman', 'lb_beirut', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'eg_cairo', 'eg_alexandria', 'eg_suez', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'coastal'),
  s('jo_amman', 'Jordan', 'jordan', 31.9, 35.9, 10, 12, 8, 9, 'usa', false, ['il_jerusalem', 'il_telaviv', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'desert'),
  s('sa_riyadh', 'Riyadh', 'saudi_arabia', 24.7, 46.7, 14, 18, 12, 13, 'usa', false, ['sa_jeddah', 'sa_dhahran', 'jo_amman', 'il_jerusalem', 'il_telaviv', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'desert'),
  s('sa_jeddah', 'Jeddah', 'saudi_arabia', 21.5, 39.2, 12, 16, 10, 11, 'usa', false, ['sa_riyadh', 'sa_dhahran', 'jo_amman', 'il_jerusalem', 'il_telaviv', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'coastal'),
  s('sa_dhahran', 'Dhahran', 'saudi_arabia', 26.3, 50.2, 12, 16, 10, 11, 'usa', false, ['sa_riyadh', 'sa_jeddah', 'jo_amman', 'il_jerusalem', 'il_telaviv', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'iq_baghdad', 'iq_mosul', 'iq_basra', 'tr_ankara', 'tr_izmir', 'tr_istanbul', 'tr_east', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'coastal'),
  s('kz_almaty', 'Kazakhstan', 'kazakhstan', 43.2, 76.9, 12, 14, 10, 11, 'ussr', false, ['cn_xinjiang', 'cn_mongolia', 'cn_manchuria', 'cn_beijing', 'cn_shanxi', 'su_kazakh', 'su_siberia', 'su_far_east', 'su_lake_baikal', 'su_mongolia', 'su_moscow', 'su_leningrad', 'su_baltic', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_moldova', 'su_volga', 'su_central', 'su_ural', 'su_kazan', 'su_murmansk', 'su_arkhangelsk', 'su_karelia', 'su_mongolia', 'su_lake_baikal', 'mn_ulaanbaatar', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'af_kabul', 'af_kandahar', 'af_herat', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu'], 'desert'),
  s('uz_tashkent', 'Uzbekistan', 'uzbekistan', 41.3, 69.3, 10, 14, 8, 9, 'ussr', false, ['kz_almaty', 'su_kazakh', 'su_siberia', 'su_far_east', 'su_lake_baikal', 'su_mongolia', 'su_moscow', 'su_leningrad', 'su_baltic', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_moldova', 'su_volga', 'su_central', 'su_ural', 'su_kazan', 'su_murmansk', 'su_arkhangelsk', 'su_karelia', 'su_mongolia', 'su_lake_baikal', 'mn_ulaanbaatar', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'af_kabul', 'af_kandahar', 'af_herat', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'cn_xinjiang', 'cn_mongolia', 'cn_manchuria', 'cn_beijing', 'cn_shanxi'], 'desert'),
  s('tm_ashgabat', 'Turkmenistan', 'turkmenistan', 37.9, 58.4, 8, 10, 6, 7, 'ussr', false, ['kz_almaty', 'su_kazakh', 'su_siberia', 'su_far_east', 'su_lake_baikal', 'su_mongolia', 'su_moscow', 'su_leningrad', 'su_baltic', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_moldova', 'su_volga', 'su_central', 'su_ural', 'su_kazan', 'su_murmansk', 'su_arkhangelsk', 'su_karelia', 'su_mongolia', 'su_lake_baikal', 'mn_ulaanbaatar', 'ir_tehran', 'ir_tabriz', 'ir_isfahan', 'ir_mashhad', 'af_kabul', 'af_kandahar', 'af_herat', 'in_delhi', 'in_bombay', 'in_madras', 'in_kolkata', 'in_kashmir', 'pk_lahore', 'pk_karachi', 'pk_islamabad', 'bd_dhaka', 'np_kathmandu', 'bt_thimphu', 'cn_xinjiang', 'cn_mongolia', 'cn_manchuria', 'cn_beijing', 'cn_shanxi', 'uz_tashkent'], 'desert'),

  // ===== MIDDLE EAST & NORTH AFRICA =====
  s('eg_cairo', 'Cairo', 'egypt', 30.0, 31.2, 16, 22, 14, 16, 'usa', false, ['eg_alexandria', 'eg_suez', 'eg_upper', 'il_jerusalem', 'il_telaviv', 'jo_amman', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'urban'),
  s('eg_alexandria', 'Alexandria', 'egypt', 31.2, 29.9, 14, 18, 12, 13, 'usa', false, ['eg_cairo', 'eg_suez', 'eg_upper', 'il_jerusalem', 'il_telaviv', 'jo_amman', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'coastal'),
  s('eg_suez', 'Suez', 'egypt', 29.9, 32.5, 14, 16, 12, 13, 'usa', false, ['eg_cairo', 'eg_alexandria', 'eg_upper', 'il_jerusalem', 'il_telaviv', 'jo_amman', 'sy_damascus', 'sy_aleppo', 'lb_beirut', 'sa_riyadh', 'sa_jeddah', 'sa_dhahran'], 'coastal'),
  s('eg_upper', 'Upper Egypt', 'egypt', 26.0, 32.0, 12, 16, 10, 11, 'usa', false, ['eg_cairo', 'eg_alexandria', 'eg_suez', 'sd_khartoum'], 'desert'),
  s('sd_khartoum', 'Sudan', 'sudan', 15.5, 32.5, 10, 14, 8, 9, 'usa', false, ['eg_upper', 'eg_cairo', 'eg_alexandria', 'eg_suez', 'et_addis', 'et_eritrea', 'et_ogaden'], 'desert'),
  s('ly_tripoli', 'Tripoli', 'libya', 32.9, 13.2, 12, 14, 10, 11, 'usa', false, ['ly_benghazi', 'ly_fezan', 'dz_algiers', 'dz_oran', 'dz_sahara', 'tn_tunis', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'coastal'),
  s('ly_benghazi', 'Benghazi', 'libya', 32.1, 20.1, 12, 14, 10, 11, 'usa', false, ['ly_tripoli', 'ly_fezan', 'dz_algiers', 'dz_oran', 'dz_sahara', 'tn_tunis', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'coastal'),
  s('ly_fezan', 'Fezzan', 'libya', 26.0, 14.0, 8, 8, 6, 7, 'usa', false, ['ly_tripoli', 'ly_benghazi', 'dz_algiers', 'dz_oran', 'dz_sahara', 'tn_tunis', 'eg_cairo', 'eg_alexandria', 'eg_suez', 'eg_upper'], 'desert'),
  s('tn_tunis', 'Tunisia', 'tunisia', 36.8, 10.2, 12, 14, 10, 11, 'usa', false, ['dz_algiers', 'dz_oran', 'dz_sahara', 'ly_tripoli', 'ly_benghazi', 'ly_fezan', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'coastal'),
  s('ma_casablanca', 'Casablanca', 'morocco', 33.6, -7.6, 12, 16, 10, 11, 'usa', false, ['ma_rabat', 'ma_marrakech', 'dz_oran', 'dz_algiers', 'dz_sahara', 'pt_lisbon', 'pt_porto', 'es_andalusia', 'es_madrid', 'es_catalonia', 'fr_south', 'fr_alps'], 'coastal'),
  s('ma_rabat', 'Rabat', 'morocco', 34.0, -6.8, 12, 14, 10, 11, 'usa', false, ['ma_casablanca', 'ma_marrakech', 'dz_oran', 'dz_algiers', 'dz_sahara', 'pt_lisbon', 'pt_porto', 'es_andalusia', 'es_madrid', 'es_catalonia', 'fr_south', 'fr_alps'], 'coastal'),
  s('ma_marrakech', 'Marrakech', 'morocco', 31.6, -8.0, 10, 12, 8, 9, 'usa', false, ['ma_casablanca', 'ma_rabat', 'dz_oran', 'dz_algiers', 'dz_sahara', 'pt_lisbon', 'pt_porto', 'es_andalusia', 'es_madrid', 'es_catalonia', 'fr_south', 'fr_alps'], 'mountain'),

  // ===== SUB-SAHARAN AFRICA =====
  s('et_addis', 'Addis Ababa', 'ethiopia', 9.0, 38.8, 12, 18, 10, 11, 'usa', false, ['et_eritrea', 'et_ogaden', 'sd_khartoum', 'eg_upper', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'mountain'),
  s('et_eritrea', 'Eritrea', 'ethiopia', 15.3, 38.9, 10, 14, 8, 9, 'usa', false, ['et_addis', 'et_ogaden', 'sd_khartoum', 'eg_upper', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'coastal'),
  s('et_ogaden', 'Ogaden', 'ethiopia', 7.0, 44.0, 8, 10, 6, 7, 'usa', false, ['et_addis', 'et_eritrea', 'sd_khartoum', 'eg_upper', 'eg_cairo', 'eg_alexandria', 'eg_suez'], 'desert'),
  s('ng_lagos', 'Lagos', 'nigeria', 6.5, 3.4, 14, 22, 12, 14, 'usa', false, ['ng_kano', 'ng_east'], 'coastal'),
  s('ng_kano', 'Kano', 'nigeria', 12.0, 8.6, 12, 18, 10, 11, 'usa', false, ['ng_lagos', 'ng_east'], 'desert'),
  s('ng_east', 'Eastern Nigeria', 'nigeria', 5.0, 8.0, 10, 14, 8, 9, 'usa', false, ['ng_lagos', 'ng_kano'], 'forest'),
  s('cd_kinshasa', 'Kinshasa', 'congo', -4.3, 15.3, 10, 16, 8, 9, 'usa', false, ['cd_lubumbashi'], 'forest'),
  s('cd_lubumbashi', 'Katanga', 'congo', -11.7, 27.5, 10, 14, 8, 9, 'usa', false, ['cd_kinshasa'], 'forest'),
  s('ke_nairobi', 'Nairobi', 'kenya', -1.3, 36.8, 10, 14, 8, 9, 'usa', false, ['ke_mombasa'], 'mountain'),
  s('ke_mombasa', 'Mombasa', 'kenya', -4.1, 39.7, 10, 12, 8, 9, 'usa', false, ['ke_nairobi'], 'coastal'),
  s('tz_dar', 'Dar es Salaam', 'tanzania', -6.8, 39.3, 10, 14, 8, 9, 'usa', false, ['tz_dodoma'], 'coastal'),
  s('tz_dodoma', 'Dodoma', 'tanzania', -6.2, 35.7, 10, 12, 8, 9, 'usa', false, ['tz_dar'], 'mountain'),
  s('za_cape', 'Cape Town', 'south_africa', -33.9, 18.4, 14, 18, 12, 13, 'usa', false, ['za_johannesburg', 'za_pretoria'], 'coastal'),
  s('za_johannesburg', 'Johannesburg', 'south_africa', -26.2, 28.0, 14, 20, 12, 13, 'usa', false, ['za_cape', 'za_pretoria'], 'urban'),
  s('za_pretoria', 'Pretoria', 'south_africa', -25.7, 28.2, 14, 18, 12, 13, 'usa', false, ['za_cape', 'za_johannesburg'], 'urban'),

  // ===== SOUTH AMERICA =====
  s('br_sao', 'Sao Paulo', 'brazil', -23.5, -46.6, 18, 30, 16, 18, 'usa', false, ['br_rio', 'br_amazon', 'br_brasilia', 'br_recife', 'br_porto', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'pe_lima', 'co_bogota', 've_caracas', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'coastal'),
  s('br_rio', 'Rio de Janeiro', 'brazil', -22.9, -43.2, 18, 28, 16, 18, 'usa', false, ['br_sao', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'pe_lima', 'co_bogota', 've_caracas', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'coastal'),
  s('br_brasilia', 'Brasilia', 'brazil', -15.8, -47.9, 14, 22, 12, 14, 'usa', false, ['br_sao', 'br_rio', 'br_amazon', 'br_recife', 'br_porto', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'pe_lima', 'co_bogota', 've_caracas', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'plains'),
  s('br_amazon', 'Amazon', 'brazil', -3.4, -65.1, 10, 18, 8, 9, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_recife', 'br_porto', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'pe_lima', 'co_bogota', 've_caracas', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'forest'),
  s('br_recife', 'Recife', 'brazil', -8.0, -35.0, 12, 20, 10, 11, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_porto', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'pe_lima', 'co_bogota', 've_caracas', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'coastal'),
  s('br_porto', 'Porto Alegre', 'brazil', -30.0, -51.2, 12, 16, 10, 11, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'pe_lima', 'co_bogota', 've_caracas', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'coastal'),
  s('ar_buenos', 'Buenos Aires', 'argentina', -34.6, -58.4, 16, 24, 14, 16, 'usa', false, ['ar_cordoba', 'ar_patagonia', 'ar_rosario', 'uy_montevideo', 'py_asuncion', 'bo_la', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'cl_santiago', 'cl_valpo', 'pe_lima'], 'coastal'),
  s('ar_cordoba', 'Cordoba', 'argentina', -31.4, -64.2, 14, 20, 12, 14, 'usa', false, ['ar_buenos', 'ar_patagonia', 'ar_rosario', 'uy_montevideo', 'py_asuncion', 'bo_la', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'cl_santiago', 'cl_valpo', 'pe_lima'], 'mountain'),
  s('ar_patagonia', 'Patagonia', 'argentina', -46.5, -70.0, 10, 10, 8, 9, 'usa', false, ['ar_buenos', 'ar_cordoba', 'ar_rosario', 'uy_montevideo', 'py_asuncion', 'bo_la', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'cl_santiago', 'cl_valpo', 'pe_lima'], 'desert'),
  s('ar_rosario', 'Rosario', 'argentina', -32.9, -60.7, 12, 18, 10, 11, 'usa', false, ['ar_buenos', 'ar_cordoba', 'ar_patagonia', 'uy_montevideo', 'py_asuncion', 'bo_la', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'cl_santiago', 'cl_valpo', 'pe_lima'], 'plains'),
  s('uy_montevideo', 'Uruguay', 'uruguay', -34.9, -56.2, 10, 12, 10, 10, 'usa', false, ['ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto'], 'coastal'),
  s('py_asuncion', 'Paraguay', 'paraguay', -25.3, -57.6, 10, 12, 8, 9, 'usa', false, ['ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'uy_montevideo', 'bo_la'], 'plains'),
  s('bo_la', 'Bolivia', 'bolivia', -17.8, -63.2, 10, 12, 8, 9, 'usa', false, ['ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'uy_montevideo', 'py_asuncion', 'pe_lima', 'cl_santiago', 'cl_valpo'], 'mountain'),
  s('cl_santiago', 'Santiago', 'chile', -33.5, -70.7, 14, 18, 12, 13, 'usa', false, ['cl_valpo', 'cl_conce', 'cl_antof', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'bo_la', 'pe_lima'], 'mountain'),
  s('cl_valpo', 'Valparaiso', 'chile', -33.0, -71.6, 12, 14, 10, 11, 'usa', false, ['cl_santiago', 'cl_conce', 'cl_antof', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'bo_la', 'pe_lima'], 'coastal'),
  s('cl_conce', 'Concepcion', 'chile', -36.8, -73.1, 10, 12, 8, 9, 'usa', false, ['cl_santiago', 'cl_valpo', 'cl_antof', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'bo_la', 'pe_lima'], 'coastal'),
  s('cl_antof', 'Antofagasta', 'chile', -23.7, -70.4, 8, 8, 6, 7, 'usa', false, ['cl_santiago', 'cl_valpo', 'cl_conce', 'ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'bo_la', 'pe_lima'], 'desert'),
  s('pe_lima', 'Peru', 'peru', -12.0, -77.0, 12, 20, 10, 11, 'usa', false, ['ar_buenos', 'ar_cordoba', 'ar_patagonia', 'ar_rosario', 'br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'bo_la', 'cl_santiago', 'cl_valpo', 'cl_conce', 'cl_antof', 'co_bogota', 'ec_quito'], 'mountain'),
  s('co_bogota', 'Colombia', 'colombia', 4.7, -74.0, 12, 20, 10, 11, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'pe_lima', 'ec_quito', 've_caracas', 'pa_panama'], 'mountain'),
  s('ve_caracas', 'Venezuela', 'venezuela', 10.5, -66.9, 12, 18, 10, 11, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 'co_bogota', 'gy_georgetown', 'sr_paramaribo', 'gf_cayenne'], 'coastal'),
  s('gy_georgetown', 'Guyana', 'guyana', 6.8, -58.2, 8, 10, 6, 7, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 've_caracas', 'sr_paramaribo', 'gf_cayenne'], 'coastal'),
  s('sr_paramaribo', 'Suriname', 'suriname', 5.8, -55.2, 8, 10, 6, 7, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 've_caracas', 'gy_georgetown', 'gf_cayenne'], 'coastal'),
  s('gf_cayenne', 'French Guiana', 'french_guiana', 4.9, -52.3, 8, 8, 6, 7, 'usa', false, ['br_sao', 'br_rio', 'br_brasilia', 'br_amazon', 'br_recife', 'br_porto', 've_caracas', 'gy_georgetown', 'sr_paramaribo'], 'coastal'),
  s('ec_quito', 'Ecuador', 'ecuador', -0.2, -78.5, 10, 14, 8, 9, 'usa', false, ['co_bogota', 'pe_lima'], 'mountain'),
  s('pa_panama', 'Panama', 'panama', 8.5, -80.0, 10, 12, 10, 10, 'usa', false, ['co_bogota'], 'coastal'),

  // ===== OCEANIA =====
  s('au_nsw', 'New South Wales', 'australia', -33.9, 151.2, 18, 28, 16, 18, 'usa', false, ['au_vic', 'au_qld', 'au_nt', 'au_sa', 'au_tas', 'au_wa', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'coastal'),
  s('au_vic', 'Victoria', 'australia', -37.8, 145.0, 16, 24, 14, 16, 'usa', false, ['au_nsw', 'au_sa', 'au_tas', 'au_wa', 'au_qld', 'au_nt', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'coastal'),
  s('au_qld', 'Queensland', 'australia', -27.5, 153.0, 14, 22, 12, 14, 'usa', false, ['au_nsw', 'au_nt', 'au_sa', 'au_wa', 'au_vic', 'au_tas', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'coastal'),
  s('au_sa', 'South Australia', 'australia', -30.0, 135.0, 12, 16, 10, 11, 'usa', false, ['au_nsw', 'au_vic', 'au_qld', 'au_nt', 'au_wa', 'au_tas', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'desert'),
  s('au_wa', 'Western Australia', 'australia', -25.0, 122.0, 12, 14, 10, 11, 'usa', false, ['au_nsw', 'au_vic', 'au_qld', 'au_nt', 'au_sa', 'au_tas', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'desert'),
  s('au_nt', 'Northern Territory', 'australia', -20.0, 133.0, 10, 10, 8, 9, 'usa', false, ['au_nsw', 'au_vic', 'au_qld', 'au_sa', 'au_wa', 'au_tas', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'desert'),
  s('au_tas', 'Tasmania', 'australia', -42.0, 147.0, 10, 8, 10, 9, 'usa', false, ['au_nsw', 'au_vic', 'au_qld', 'au_sa', 'au_wa', 'au_nt', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'nz_auckland', 'nz_wellington'], 'coastal'),
  s('nz_auckland', 'Auckland', 'new_zealand', -36.8, 174.8, 12, 14, 12, 12, 'usa', false, ['nz_wellington', 'au_nsw', 'au_vic', 'au_qld', 'au_sa', 'au_wa', 'au_nt', 'au_tas', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'su_mongolia', 'su_moscow', 'su_leningrad', 'su_baltic', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_kazakh', 'su_moldova', 'su_volga', 'su_central', 'su_ural', 'su_kazan', 'su_murmansk', 'su_arkhangelsk', 'su_karelia'], 'coastal'),
  s('nz_wellington', 'Wellington', 'new_zealand', -41.3, 174.8, 10, 12, 10, 10, 'usa', false, ['nz_auckland', 'au_nsw', 'au_vic', 'au_qld', 'au_sa', 'au_wa', 'au_nt', 'au_tas', 'id_java', 'id_sumatra', 'id_kalimantan', 'id_sulawesi', 'id_bali', 'jp_tokyo', 'jp_osaka', 'jp_hokkaido', 'jp_okinawa', 'cn_guangdong', 'cn_shanghai', 'cn_beijing', 'su_far_east', 'su_siberia', 'su_kamchatka', 'su_lake_baikal', 'su_mongolia', 'su_moscow', 'su_leningrad', 'su_baltic', 'su_belarus', 'su_ukraine', 'su_caucasus', 'su_kazakh', 'su_moldova', 'su_volga', 'su_central', 'su_ural', 'su_kazan', 'su_murmansk', 'su_arkhangelsk', 'su_karelia'], 'coastal'),
  s('cu_havana', 'Havana', 'cuba', 23.1, -82.4, 12, 16, 10, 11, 'ussr', false, ['cu_santiago', 'us_southeast', 'us_southwest', 'us_southcentral', 'us_pacific', 'us_hawaii', 'mx_north', 'mx_central', 'mx_south', 'mx_yucatan'], 'coastal'),
  s('cu_santiago', 'Santiago', 'cuba', 20.0, -75.8, 10, 12, 8, 9, 'ussr', false, ['cu_havana', 'us_southeast', 'us_southwest', 'us_southcentral', 'us_pacific', 'us_hawaii', 'mx_north', 'mx_central', 'mx_south', 'mx_yucatan'], 'coastal'),
];

function buildStates(): Record<string, State> {
  const states: Record<string, State> = {};
  ALL_STATES.forEach(st => { states[st.id] = st; });
  return states;
}

const COUNTRY_DEFS: { id: string; name: string; isoCode: string; alignment: Alignment; stability: number; military: number; economy: number; nukes: number; influence: { usa: number; ussr: number }; isContested: boolean; region: string; coastal: boolean; stateIds: string[] }[] = [
  { id: 'usa', name: 'United States', isoCode: '840', alignment: 'nato', stability: 90, military: 100, economy: 100, nukes: 5, influence: { usa: 100, ussr: 0 }, isContested: false, region: 'NA', coastal: true, stateIds: ['us_northeast','us_midatlantic','us_southeast','us_midwest','us_southcentral','us_southwest','us_mountain','us_northwest','us_pacific','us_alaska','us_hawaii'] },
  { id: 'canada', name: 'Canada', isoCode: '124', alignment: 'nato', stability: 92, military: 40, economy: 60, nukes: 0, influence: { usa: 90, ussr: 0 }, isContested: false, region: 'NA', coastal: true, stateIds: ['ca_ontario','ca_quebec','ca_maritimes','ca_prairies','ca_western'] },
  { id: 'mexico', name: 'Mexico', isoCode: '484', alignment: 'nonaligned', stability: 50, military: 25, economy: 30, nukes: 0, influence: { usa: 65, ussr: 10 }, isContested: false, region: 'NA', coastal: true, stateIds: ['mx_north','mx_central','mx_south','mx_yucatan'] },
  { id: 'uk', name: 'United Kingdom', isoCode: '826', alignment: 'nato', stability: 80, military: 70, economy: 70, nukes: 2, influence: { usa: 80, ussr: 10 }, isContested: false, region: 'EU', coastal: true, stateIds: ['uk_england','uk_scotland','uk_wales','uk_northern'] },
  { id: 'ireland', name: 'Ireland', isoCode: '372', alignment: 'nonaligned', stability: 75, military: 10, economy: 25, nukes: 0, influence: { usa: 50, ussr: 5 }, isContested: false, region: 'EU', coastal: true, stateIds: ['ie_dublin'] },
  { id: 'france', name: 'France', isoCode: '250', alignment: 'nato', stability: 65, military: 65, economy: 65, nukes: 0, influence: { usa: 65, ussr: 20 }, isContested: false, region: 'EU', coastal: true, stateIds: ['fr_paris','fr_north','fr_normandy','fr_brittany','fr_central','fr_south','fr_lorraine','fr_alps'] },
  { id: 'algeria', name: 'Algeria', isoCode: '012', alignment: 'nonaligned', stability: 35, military: 25, economy: 20, nukes: 0, influence: { usa: 20, ussr: 40 }, isContested: true, region: 'AF', coastal: true, stateIds: ['dz_algiers','dz_oran','dz_sahara'] },
  { id: 'netherlands', name: 'Netherlands', isoCode: '528', alignment: 'nato', stability: 80, military: 30, economy: 55, nukes: 0, influence: { usa: 70, ussr: 10 }, isContested: false, region: 'EU', coastal: true, stateIds: ['nl_amsterdam','nl_rotterdam'] },
  { id: 'belgium', name: 'Belgium', isoCode: '056', alignment: 'nato', stability: 75, military: 35, economy: 55, nukes: 0, influence: { usa: 70, ussr: 15 }, isContested: false, region: 'EU', coastal: true, stateIds: ['be_brussels','be_antwerp'] },
  { id: 'luxembourg', name: 'Luxembourg', isoCode: '442', alignment: 'nato', stability: 80, military: 10, economy: 45, nukes: 0, influence: { usa: 65, ussr: 10 }, isContested: false, region: 'EU', coastal: false, stateIds: ['lu_luxembourg'] },
  { id: 'west_germany', name: 'West Germany', isoCode: '276', alignment: 'nato', stability: 55, military: 55, economy: 75, nukes: 0, influence: { usa: 70, ussr: 60 }, isContested: true, region: 'EU', coastal: true, stateIds: ['de_west_rhine','de_west_ruhr','de_west_hanover','de_west_bavaria','de_west_berlin'] },
  { id: 'east_germany', name: 'East Germany', isoCode: '278', alignment: 'warsaw', stability: 45, military: 40, economy: 35, nukes: 0, influence: { usa: 10, ussr: 90 }, isContested: true, region: 'EU', coastal: true, stateIds: ['de_east_brandenburg','de_east_saxony','de_east_thuringia','de_east_mecklenburg'] },
  { id: 'poland', name: 'Poland', isoCode: '616', alignment: 'warsaw', stability: 45, military: 45, economy: 35, nukes: 0, influence: { usa: 15, ussr: 85 }, isContested: false, region: 'EU', coastal: true, stateIds: ['pl_warsaw','pl_poznan','pl_pomerania','pl_krakow','pl_wroclaw'] },
  { id: 'czechoslovakia', name: 'Czechoslovakia', isoCode: '203', alignment: 'warsaw', stability: 50, military: 40, economy: 45, nukes: 0, influence: { usa: 20, ussr: 80 }, isContested: false, region: 'EU', coastal: false, stateIds: ['cz_prague','cz_moravia','sk_bratislava','sk_kosice'] },
  { id: 'hungary', name: 'Hungary', isoCode: '348', alignment: 'warsaw', stability: 40, military: 35, economy: 35, nukes: 0, influence: { usa: 20, ussr: 80 }, isContested: false, region: 'EU', coastal: false, stateIds: ['hu_budapest','hu_debrecen'] },
  { id: 'romania', name: 'Romania', isoCode: '642', alignment: 'warsaw', stability: 45, military: 40, economy: 30, nukes: 0, influence: { usa: 15, ussr: 75 }, isContested: false, region: 'EU', coastal: true, stateIds: ['ro_bucharest','ro_transylvania','ro_moldova'] },
  { id: 'bulgaria', name: 'Bulgaria', isoCode: '100', alignment: 'warsaw', stability: 50, military: 35, economy: 30, nukes: 0, influence: { usa: 10, ussr: 85 }, isContested: false, region: 'EU', coastal: true, stateIds: ['bg_sofia','bg_plovdiv'] },
  { id: 'albania', name: 'Albania', isoCode: '008', alignment: 'warsaw', stability: 40, military: 25, economy: 15, nukes: 0, influence: { usa: 5, ussr: 90 }, isContested: false, region: 'EU', coastal: true, stateIds: ['al_tirana'] },
  { id: 'yugoslavia', name: 'Yugoslavia', isoCode: '688', alignment: 'nonaligned', stability: 55, military: 45, economy: 35, nukes: 0, influence: { usa: 35, ussr: 40 }, isContested: false, region: 'EU', coastal: true, stateIds: ['yu_serbia','yu_croatia','yu_bosnia','yu_montenegro','yu_macedonia','yu_slovenia'] },
  { id: 'austria', name: 'Austria', isoCode: '040', alignment: 'nonaligned', stability: 70, military: 20, economy: 40, nukes: 0, influence: { usa: 50, ussr: 30 }, isContested: true, region: 'EU', coastal: false, stateIds: ['at_vienna','at_salzburg'] },
  { id: 'switzerland', name: 'Switzerland', isoCode: '756', alignment: 'nonaligned', stability: 90, military: 15, economy: 60, nukes: 0, influence: { usa: 40, ussr: 10 }, isContested: false, region: 'EU', coastal: false, stateIds: ['ch_zurich','ch_geneva','ch_ticino'] },
  { id: 'italy', name: 'Italy', isoCode: '380', alignment: 'nato', stability: 55, military: 40, economy: 50, nukes: 0, influence: { usa: 60, ussr: 30 }, isContested: false, region: 'EU', coastal: true, stateIds: ['it_north','it_northeast','it_central','it_rome','it_south','it_naples','it_sicily'] },
  { id: 'spain', name: 'Spain', isoCode: '724', alignment: 'western', stability: 50, military: 30, economy: 40, nukes: 0, influence: { usa: 55, ussr: 10 }, isContested: false, region: 'EU', coastal: true, stateIds: ['es_madrid','es_catalonia','es_valencia','es_andalusia','es_basque'] },
  { id: 'portugal', name: 'Portugal', isoCode: '620', alignment: 'nato', stability: 55, military: 20, economy: 25, nukes: 0, influence: { usa: 60, ussr: 5 }, isContested: false, region: 'EU', coastal: true, stateIds: ['pt_lisbon','pt_porto'] },
  { id: 'andorra', name: 'Andorra', isoCode: '020', alignment: 'nonaligned', stability: 80, military: 5, economy: 15, nukes: 0, influence: { usa: 30, ussr: 5 }, isContested: false, region: 'EU', coastal: false, stateIds: ['ad_andorra'] },
  { id: 'greece', name: 'Greece', isoCode: '300', alignment: 'nato', stability: 50, military: 35, economy: 30, nukes: 0, influence: { usa: 60, ussr: 25 }, isContested: false, region: 'EU', coastal: true, stateIds: ['gr_athens','gr_thessaloniki','gr_peloponnese','gr_crete'] },
  { id: 'turkey', name: 'Turkey', isoCode: '792', alignment: 'nato', stability: 55, military: 60, economy: 35, nukes: 0, influence: { usa: 65, ussr: 30 }, isContested: false, region: 'ME', coastal: true, stateIds: ['tr_istanbul','tr_ankara','tr_izmir','tr_east'] },
  { id: 'norway', name: 'Norway', isoCode: '578', alignment: 'nato', stability: 88, military: 25, economy: 45, nukes: 0, influence: { usa: 75, ussr: 5 }, isContested: false, region: 'EU', coastal: true, stateIds: ['no_oslo','no_bergen','no_north'] },
  { id: 'denmark', name: 'Denmark', isoCode: '208', alignment: 'nato', stability: 85, military: 20, economy: 45, nukes: 0, influence: { usa: 75, ussr: 5 }, isContested: false, region: 'EU', coastal: true, stateIds: ['dk_copenhagen','dk_jutland'] },
  { id: 'sweden', name: 'Sweden', isoCode: '752', alignment: 'nonaligned', stability: 85, military: 30, economy: 55, nukes: 0, influence: { usa: 50, ussr: 15 }, isContested: false, region: 'EU', coastal: true, stateIds: ['se_stockholm','se_gothenburg','se_north'] },
  { id: 'finland', name: 'Finland', isoCode: '246', alignment: 'nonaligned', stability: 70, military: 30, economy: 35, nukes: 0, influence: { usa: 40, ussr: 45 }, isContested: false, region: 'EU', coastal: true, stateIds: ['fi_helsinki','fi_tampere','fi_lapland'] },
  { id: 'ussr', name: 'Soviet Union', isoCode: '643', alignment: 'warsaw', stability: 85, military: 100, economy: 80, nukes: 5, influence: { usa: 0, ussr: 100 }, isContested: false, region: 'EURASIA', coastal: true, stateIds: ['su_moscow','su_leningrad','su_karelia','su_murmansk','su_arkhangelsk','su_baltic','su_belarus','su_ukraine','su_moldova','su_volga','su_caucasus','su_kazakh','su_ural','su_central','su_kazan','su_siberia','su_far_east','su_kamchatka','su_lake_baikal','su_mongolia'] },
  { id: 'kazakhstan', name: 'Kazakhstan', isoCode: '398', alignment: 'warsaw', stability: 60, military: 30, economy: 25, nukes: 0, influence: { usa: 10, ussr: 80 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['kz_almaty'] },
  { id: 'uzbekistan', name: 'Uzbekistan', isoCode: '860', alignment: 'warsaw', stability: 55, military: 25, economy: 20, nukes: 0, influence: { usa: 10, ussr: 80 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['uz_tashkent'] },
  { id: 'turkmenistan', name: 'Turkmenistan', isoCode: '795', alignment: 'warsaw', stability: 50, military: 20, economy: 18, nukes: 0, influence: { usa: 10, ussr: 80 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['tm_ashgabat'] },
  { id: 'china', name: 'China (Nationalist)', isoCode: '156', alignment: 'western', stability: 40, military: 60, economy: 25, nukes: 0, influence: { usa: 55, ussr: 15 }, isContested: true, region: 'ASIA', coastal: true, stateIds: ['cn_shanghai','cn_shanxi','cn_sichuan','cn_tibet','cn_yunnan','cn_guangdong'] },
  { id: 'china_communist', name: 'China (Communist)', isoCode: '156c', alignment: 'communist', stability: 45, military: 70, economy: 20, nukes: 0, influence: { usa: 5, ussr: 75 }, isContested: true, region: 'ASIA', coastal: true, stateIds: ['cn_beijing','cn_manchuria','cn_mongolia','cn_xinjiang'] },
  { id: 'taiwan', name: 'Taiwan', isoCode: '158', alignment: 'western', stability: 70, military: 40, economy: 35, nukes: 0, influence: { usa: 85, ussr: 0 }, isContested: true, region: 'ASIA', coastal: true, stateIds: ['tw_taipei'] },
  { id: 'hongkong', name: 'Hong Kong', isoCode: '344', alignment: 'western', stability: 75, military: 10, economy: 45, nukes: 0, influence: { usa: 80, ussr: 5 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['hk_hongkong'] },
  { id: 'north_korea', name: 'North Korea', isoCode: '408', alignment: 'communist', stability: 60, military: 55, economy: 15, nukes: 0, influence: { usa: 0, ussr: 80 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['kr_north'] },
  { id: 'south_korea', name: 'South Korea', isoCode: '410', alignment: 'western', stability: 40, military: 50, economy: 25, nukes: 0, influence: { usa: 80, ussr: 10 }, isContested: true, region: 'ASIA', coastal: true, stateIds: ['kr_south'] },
  { id: 'japan', name: 'Japan', isoCode: '392', alignment: 'western', stability: 70, military: 20, economy: 55, nukes: 0, influence: { usa: 85, ussr: 0 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['jp_tokyo','jp_osaka','jp_hokkaido','jp_okinawa'] },
  { id: 'vietnam', name: 'Vietnam', isoCode: '704', alignment: 'communist', stability: 20, military: 35, economy: 10, nukes: 0, influence: { usa: 35, ussr: 55 }, isContested: true, region: 'ASIA', coastal: true, stateIds: ['vn_hanoi','vn_hue','vn_saigon'] },
  { id: 'laos', name: 'Laos', isoCode: '418', alignment: 'communist', stability: 30, military: 15, economy: 8, nukes: 0, influence: { usa: 10, ussr: 60 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['la_vientiane'] },
  { id: 'cambodia', name: 'Cambodia', isoCode: '116', alignment: 'communist', stability: 35, military: 20, economy: 10, nukes: 0, influence: { usa: 15, ussr: 55 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['kh_phnom_penh'] },
  { id: 'thailand', name: 'Thailand', isoCode: '764', alignment: 'nonaligned', stability: 55, military: 35, economy: 30, nukes: 0, influence: { usa: 60, ussr: 20 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['th_bangkok','th_chiangmai'] },
  { id: 'myanmar', name: 'Myanmar', isoCode: '104', alignment: 'nonaligned', stability: 40, military: 25, economy: 15, nukes: 0, influence: { usa: 25, ussr: 35 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['my_yangon'] },
  { id: 'malaysia', name: 'Malaysia', isoCode: '458', alignment: 'nonaligned', stability: 55, military: 25, economy: 30, nukes: 0, influence: { usa: 45, ussr: 25 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['my_kl'] },
  { id: 'singapore', name: 'Singapore', isoCode: '702', alignment: 'western', stability: 70, military: 15, economy: 40, nukes: 0, influence: { usa: 70, ussr: 10 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['sg_singapore'] },
  { id: 'indonesia', name: 'Indonesia', isoCode: '360', alignment: 'nonaligned', stability: 40, military: 30, economy: 20, nukes: 0, influence: { usa: 35, ussr: 35 }, isContested: true, region: 'ASIA', coastal: true, stateIds: ['id_java','id_sumatra','id_kalimantan','id_sulawesi','id_bali'] },
  { id: 'philippines', name: 'Philippines', isoCode: '608', alignment: 'western', stability: 45, military: 25, economy: 20, nukes: 0, influence: { usa: 70, ussr: 10 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['ph_manila','ph_cebu','ph_mindanao'] },
  { id: 'mongolia', name: 'Mongolia', isoCode: '496', alignment: 'communist', stability: 55, military: 15, economy: 10, nukes: 0, influence: { usa: 5, ussr: 85 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['mn_ulaanbaatar'] },
  { id: 'india', name: 'India', isoCode: '356', alignment: 'nonaligned', stability: 55, military: 45, economy: 30, nukes: 0, influence: { usa: 40, ussr: 40 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['in_delhi','in_bombay','in_madras','in_kolkata','in_kashmir'] },
  { id: 'pakistan', name: 'Pakistan', isoCode: '586', alignment: 'nonaligned', stability: 40, military: 35, economy: 20, nukes: 0, influence: { usa: 50, ussr: 20 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['pk_lahore','pk_karachi','pk_islamabad'] },
  { id: 'bangladesh', name: 'Bangladesh', isoCode: '050', alignment: 'nonaligned', stability: 35, military: 20, economy: 15, nukes: 0, influence: { usa: 25, ussr: 30 }, isContested: false, region: 'ASIA', coastal: true, stateIds: ['bd_dhaka'] },
  { id: 'nepal', name: 'Nepal', isoCode: '524', alignment: 'nonaligned', stability: 40, military: 15, economy: 10, nukes: 0, influence: { usa: 20, ussr: 25 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['np_kathmandu'] },
  { id: 'bhutan', name: 'Bhutan', isoCode: '064', alignment: 'nonaligned', stability: 45, military: 10, economy: 8, nukes: 0, influence: { usa: 15, ussr: 20 }, isContested: false, region: 'ASIA', coastal: false, stateIds: ['bt_thimphu'] },
  { id: 'afghanistan', name: 'Afghanistan', isoCode: '004', alignment: 'nonaligned', stability: 25, military: 20, economy: 10, nukes: 0, influence: { usa: 30, ussr: 45 }, isContested: true, region: 'ME', coastal: false, stateIds: ['af_kabul','af_kandahar','af_herat'] },
  { id: 'iran', name: 'Iran', isoCode: '364', alignment: 'nonaligned', stability: 45, military: 40, economy: 35, nukes: 0, influence: { usa: 60, ussr: 30 }, isContested: true, region: 'ME', coastal: true, stateIds: ['ir_tehran','ir_tabriz','ir_isfahan','ir_mashhad'] },
  { id: 'iraq', name: 'Iraq', isoCode: '368', alignment: 'nonaligned', stability: 40, military: 35, economy: 30, nukes: 0, influence: { usa: 35, ussr: 45 }, isContested: true, region: 'ME', coastal: true, stateIds: ['iq_baghdad','iq_mosul','iq_basra'] },
  { id: 'syria', name: 'Syria', isoCode: '760', alignment: 'nonaligned', stability: 35, military: 30, economy: 20, nukes: 0, influence: { usa: 25, ussr: 55 }, isContested: false, region: 'ME', coastal: true, stateIds: ['sy_damascus','sy_aleppo'] },
  { id: 'lebanon', name: 'Lebanon', isoCode: '422', alignment: 'nonaligned', stability: 40, military: 20, economy: 18, nukes: 0, influence: { usa: 40, ussr: 30 }, isContested: false, region: 'ME', coastal: true, stateIds: ['lb_beirut'] },
  { id: 'israel', name: 'Israel', isoCode: '376', alignment: 'western', stability: 40, military: 50, economy: 25, nukes: 0, influence: { usa: 75, ussr: 10 }, isContested: true, region: 'ME', coastal: true, stateIds: ['il_jerusalem','il_telaviv'] },
  { id: 'jordan', name: 'Jordan', isoCode: '400', alignment: 'nonaligned', stability: 50, military: 20, economy: 15, nukes: 0, influence: { usa: 50, ussr: 25 }, isContested: false, region: 'ME', coastal: false, stateIds: ['jo_amman'] },
  { id: 'saudi_arabia', name: 'Saudi Arabia', isoCode: '682', alignment: 'nonaligned', stability: 60, military: 30, economy: 40, nukes: 0, influence: { usa: 50, ussr: 30 }, isContested: false, region: 'ME', coastal: true, stateIds: ['sa_riyadh','sa_jeddah','sa_dhahran'] },
  { id: 'egypt', name: 'Egypt', isoCode: '818', alignment: 'nonaligned', stability: 45, military: 40, economy: 25, nukes: 0, influence: { usa: 40, ussr: 45 }, isContested: true, region: 'AF', coastal: true, stateIds: ['eg_cairo','eg_alexandria','eg_suez','eg_upper'] },
  { id: 'sudan', name: 'Sudan', isoCode: '729', alignment: 'nonaligned', stability: 30, military: 20, economy: 15, nukes: 0, influence: { usa: 25, ussr: 35 }, isContested: false, region: 'AF', coastal: false, stateIds: ['sd_khartoum'] },
  { id: 'libya', name: 'Libya', isoCode: '434', alignment: 'nonaligned', stability: 35, military: 20, economy: 20, nukes: 0, influence: { usa: 25, ussr: 40 }, isContested: true, region: 'AF', coastal: true, stateIds: ['ly_tripoli','ly_benghazi','ly_fezan'] },
  { id: 'tunisia', name: 'Tunisia', isoCode: '788', alignment: 'nonaligned', stability: 50, military: 25, economy: 20, nukes: 0, influence: { usa: 35, ussr: 30 }, isContested: false, region: 'AF', coastal: true, stateIds: ['tn_tunis'] },
  { id: 'morocco', name: 'Morocco', isoCode: '504', alignment: 'nonaligned', stability: 45, military: 25, economy: 20, nukes: 0, influence: { usa: 40, ussr: 25 }, isContested: true, region: 'AF', coastal: true, stateIds: ['ma_casablanca','ma_rabat','ma_marrakech'] },
  { id: 'ethiopia', name: 'Ethiopia', isoCode: '231', alignment: 'nonaligned', stability: 30, military: 20, economy: 10, nukes: 0, influence: { usa: 25, ussr: 30 }, isContested: true, region: 'AF', coastal: true, stateIds: ['et_addis','et_eritrea','et_ogaden'] },
  { id: 'nigeria', name: 'Nigeria', isoCode: '566', alignment: 'nonaligned', stability: 35, military: 20, economy: 25, nukes: 0, influence: { usa: 30, ussr: 25 }, isContested: false, region: 'AF', coastal: true, stateIds: ['ng_lagos','ng_kano','ng_east'] },
  { id: 'congo', name: 'Congo', isoCode: '180', alignment: 'nonaligned', stability: 25, military: 15, economy: 12, nukes: 0, influence: { usa: 20, ussr: 30 }, isContested: false, region: 'AF', coastal: false, stateIds: ['cd_kinshasa','cd_lubumbashi'] },
  { id: 'kenya', name: 'Kenya', isoCode: '404', alignment: 'nonaligned', stability: 40, military: 20, economy: 15, nukes: 0, influence: { usa: 30, ussr: 25 }, isContested: false, region: 'AF', coastal: true, stateIds: ['ke_nairobi','ke_mombasa'] },
  { id: 'tanzania', name: 'Tanzania', isoCode: '834', alignment: 'nonaligned', stability: 35, military: 15, economy: 12, nukes: 0, influence: { usa: 25, ussr: 30 }, isContested: false, region: 'AF', coastal: true, stateIds: ['tz_dar','tz_dodoma'] },
  { id: 'south_africa', name: 'South Africa', isoCode: '710', alignment: 'nonaligned', stability: 55, military: 35, economy: 40, nukes: 0, influence: { usa: 50, ussr: 20 }, isContested: false, region: 'AF', coastal: true, stateIds: ['za_cape','za_johannesburg','za_pretoria'] },
  { id: 'brazil', name: 'Brazil', isoCode: '076', alignment: 'nonaligned', stability: 50, military: 30, economy: 40, nukes: 0, influence: { usa: 60, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['br_sao','br_rio','br_brasilia','br_amazon','br_recife','br_porto'] },
  { id: 'argentina', name: 'Argentina', isoCode: '032', alignment: 'nonaligned', stability: 40, military: 30, economy: 35, nukes: 0, influence: { usa: 50, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['ar_buenos','ar_cordoba','ar_patagonia','ar_rosario'] },
  { id: 'uruguay', name: 'Uruguay', isoCode: '858', alignment: 'nonaligned', stability: 60, military: 15, economy: 20, nukes: 0, influence: { usa: 40, ussr: 15 }, isContested: false, region: 'SA', coastal: true, stateIds: ['uy_montevideo'] },
  { id: 'paraguay', name: 'Paraguay', isoCode: '600', alignment: 'nonaligned', stability: 45, military: 15, economy: 15, nukes: 0, influence: { usa: 35, ussr: 15 }, isContested: false, region: 'SA', coastal: false, stateIds: ['py_asuncion'] },
  { id: 'bolivia', name: 'Bolivia', isoCode: '068', alignment: 'nonaligned', stability: 35, military: 15, economy: 15, nukes: 0, influence: { usa: 30, ussr: 20 }, isContested: false, region: 'SA', coastal: false, stateIds: ['bo_la'] },
  { id: 'chile', name: 'Chile', isoCode: '152', alignment: 'nonaligned', stability: 50, military: 25, economy: 30, nukes: 0, influence: { usa: 45, ussr: 25 }, isContested: false, region: 'SA', coastal: true, stateIds: ['cl_santiago','cl_valpo','cl_conce','cl_antof'] },
  { id: 'peru', name: 'Peru', isoCode: '604', alignment: 'nonaligned', stability: 40, military: 20, economy: 22, nukes: 0, influence: { usa: 35, ussr: 25 }, isContested: false, region: 'SA', coastal: true, stateIds: ['pe_lima'] },
  { id: 'colombia', name: 'Colombia', isoCode: '170', alignment: 'nonaligned', stability: 45, military: 25, economy: 25, nukes: 0, influence: { usa: 50, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['co_bogota'] },
  { id: 'venezuela', name: 'Venezuela', isoCode: '862', alignment: 'nonaligned', stability: 45, military: 25, economy: 30, nukes: 0, influence: { usa: 55, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['ve_caracas'] },
  { id: 'guyana', name: 'Guyana', isoCode: '328', alignment: 'nonaligned', stability: 40, military: 10, economy: 12, nukes: 0, influence: { usa: 30, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['gy_georgetown'] },
  { id: 'suriname', name: 'Suriname', isoCode: '740', alignment: 'nonaligned', stability: 45, military: 10, economy: 12, nukes: 0, influence: { usa: 30, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['sr_paramaribo'] },
  { id: 'french_guiana', name: 'French Guiana', isoCode: '254', alignment: 'western', stability: 60, military: 10, economy: 15, nukes: 0, influence: { usa: 50, ussr: 10 }, isContested: false, region: 'SA', coastal: true, stateIds: ['gf_cayenne'] },
  { id: 'ecuador', name: 'Ecuador', isoCode: '218', alignment: 'nonaligned', stability: 40, military: 15, economy: 18, nukes: 0, influence: { usa: 40, ussr: 20 }, isContested: false, region: 'SA', coastal: true, stateIds: ['ec_quito'] },
  { id: 'panama', name: 'Panama', isoCode: '591', alignment: 'nonaligned', stability: 50, military: 15, economy: 20, nukes: 0, influence: { usa: 70, ussr: 10 }, isContested: false, region: 'SA', coastal: true, stateIds: ['pa_panama'] },
  { id: 'australia', name: 'Australia', isoCode: '036', alignment: 'western', stability: 85, military: 35, economy: 55, nukes: 0, influence: { usa: 80, ussr: 0 }, isContested: false, region: 'PAC', coastal: true, stateIds: ['au_nsw','au_vic','au_qld','au_sa','au_wa','au_nt','au_tas'] },
  { id: 'new_zealand', name: 'New Zealand', isoCode: '554', alignment: 'western', stability: 80, military: 15, economy: 35, nukes: 0, influence: { usa: 75, ussr: 5 }, isContested: false, region: 'PAC', coastal: true, stateIds: ['nz_auckland','nz_wellington'] },
  { id: 'cuba', name: 'Cuba', isoCode: '192', alignment: 'communist', stability: 30, military: 20, economy: 20, nukes: 0, influence: { usa: 10, ussr: 75 }, isContested: false, region: 'NA', coastal: true, stateIds: ['cu_havana','cu_santiago'] },
];

function buildCountries(): Record<string, Country> {
  const countries: Record<string, Country> = {};
  COUNTRY_DEFS.forEach(c => {
    const pp = c.stateIds.reduce((sum, sid) => {
      const st = ALL_STATES.find(s => s.id === sid);
      return sum + (st ? st.productionPoints : 0);
    }, 0);
    const neighbors = new Set<string>();
    c.stateIds.forEach(sid => {
      const st = ALL_STATES.find(s => s.id === sid);
      if (st) {
        st.neighbors.forEach(n => {
          const ns = ALL_STATES.find(s => s.id === n);
          if (ns && ns.countryId !== c.id) neighbors.add(ns.countryId);
        });
      }
    });
    countries[c.id] = {
      id: c.id, name: c.name, isoCode: c.isoCode, alignment: c.alignment,
      stability: c.stability, military: c.military, economy: c.economy, nukes: c.nukes,
      influence: c.influence, isContested: c.isContested, region: c.region,
      occupiedBy: null, states: c.stateIds, coastal: c.coastal,
      neighbors: Array.from(neighbors), productionPoints: pp,
    };
  });
  return countries;
}

const INITIAL_PLAYER_STATS: PlayerStats = {
  actionPoints: 3, prestige: 100, gdp: 2000, nuclearWarheads: 5, researchPoints: 0,
  allies: [], manpower: 500, productionPoints: 0, totalUnits: 0, maintenanceCost: 0, military: 50,
};

function buildUnit(id: string, type: UnitType, stateId: string, countryId: string, owner: Faction, name: string): Unit {
  const b = getUnitBuild(type);
  return { id, type, strength: b.strength, maxStrength: b.strength, stateId, countryId, owner, movesThisTurn: 0, name };
}

function buildUSAUnits(): Record<string, Unit> {
  const u: Record<string, Unit> = {};
  let uid = 0;
  const placements: [string, string, UnitType, string][] = [
    // USA mainland
    ['us_pacific', 'usa', 'infantry', 'Pacific Division'],
    ['us_pacific', 'usa', 'infantry', 'Pacific Division'],
    ['us_pacific', 'usa', 'infantry', 'Pacific Division'],
    ['us_pacific', 'usa', 'infantry', 'Pacific Division'],
    ['us_pacific', 'usa', 'armor', '1st Armored'],
    ['us_pacific', 'usa', 'armor', '2nd Armored'],
    ['us_pacific', 'usa', 'air', '7th Air Wing'],
    ['us_pacific', 'usa', 'air', '8th Air Wing'],
    ['us_pacific', 'usa', 'navy', 'Pacific Fleet'],
    ['us_northeast', 'usa', 'infantry', 'Northeast Division'],
    ['us_northeast', 'usa', 'infantry', 'Northeast Division'],
    ['us_northeast', 'usa', 'infantry', 'Northeast Division'],
    ['us_northeast', 'usa', 'infantry', 'Northeast Division'],
    ['us_northeast', 'usa', 'armor', '3rd Armored'],
    ['us_northeast', 'usa', 'armor', '4th Armored'],
    ['us_northeast', 'usa', 'air', '1st Air Wing'],
    ['us_northeast', 'usa', 'air', '2nd Air Wing'],
    ['us_northeast', 'usa', 'navy', 'Atlantic Fleet'],
    ['us_southeast', 'usa', 'infantry', 'Southeast Division'],
    ['us_southeast', 'usa', 'infantry', 'Southeast Division'],
    ['us_southeast', 'usa', 'infantry', 'Southeast Division'],
    ['us_southeast', 'usa', 'armor', '5th Armored'],
    ['us_southeast', 'usa', 'air', '3rd Air Wing'],
    ['us_southeast', 'usa', 'navy', 'Gulf Fleet'],
    ['us_alaska', 'usa', 'infantry', 'Alaska Division'],
    ['us_alaska', 'usa', 'infantry', 'Alaska Division'],
    ['us_hawaii', 'usa', 'infantry', 'Hawaii Division'],
    ['us_hawaii', 'usa', 'navy', 'Hawaii Fleet'],
    // Germany (West)
    ['de_west_rhine', 'west_germany', 'infantry', 'US Army Europe'],
    ['de_west_rhine', 'west_germany', 'infantry', 'US Army Europe'],
    ['de_west_rhine', 'west_germany', 'infantry', 'US Army Europe'],
    ['de_west_rhine', 'west_germany', 'infantry', 'US Army Europe'],
    ['de_west_rhine', 'west_germany', 'infantry', 'US Army Europe'],
    ['de_west_rhine', 'west_germany', 'armor', 'US 1st Armored'],
    ['de_west_rhine', 'west_germany', 'armor', 'US 2nd Armored'],
    ['de_west_rhine', 'west_germany', 'armor', 'US 3rd Armored'],
    ['de_west_rhine', 'west_germany', 'air', 'US Air Europe'],
    ['de_west_rhine', 'west_germany', 'air', 'US Air Europe'],
    ['de_west_rhine', 'west_germany', 'navy', 'US Naval Europe'],
    ['de_west_berlin', 'west_germany', 'infantry', 'Berlin Garrison'],
    ['de_west_berlin', 'west_germany', 'infantry', 'Berlin Garrison'],
    ['de_west_berlin', 'west_germany', 'armor', 'Berlin Armored'],
    ['de_west_berlin', 'west_germany', 'air', 'Berlin Air Wing'],
    // Japan
    ['jp_tokyo', 'japan', 'infantry', 'Occupation Force'],
    ['jp_tokyo', 'japan', 'infantry', 'Occupation Force'],
    ['jp_tokyo', 'japan', 'infantry', 'Occupation Force'],
    ['jp_tokyo', 'japan', 'infantry', 'Occupation Force'],
    ['jp_tokyo', 'japan', 'armor', 'Japan Armor'],
    ['jp_tokyo', 'japan', 'air', 'Japan Air Wing'],
    ['jp_tokyo', 'japan', 'navy', 'Japan Fleet'],
    ['jp_hokkaido', 'japan', 'infantry', 'Hokkaido Force'],
    ['jp_osaka', 'japan', 'infantry', 'Osaka Force'],
    ['jp_okinawa', 'japan', 'infantry', 'Okinawa Garrison'],
    ['jp_okinawa', 'japan', 'navy', 'Okinawa Fleet'],
    // South Korea
    ['kr_south', 'south_korea', 'infantry', 'ROK Army'],
    ['kr_south', 'south_korea', 'infantry', 'ROK Army'],
    ['kr_south', 'south_korea', 'infantry', 'ROK Army'],
    ['kr_south', 'south_korea', 'infantry', 'ROK Army'],
    ['kr_south', 'south_korea', 'infantry', 'ROK Army'],
    ['kr_south', 'south_korea', 'armor', 'ROK Armor'],
    ['kr_south', 'south_korea', 'air', 'ROK Air'],
    ['kr_south', 'south_korea', 'navy', 'ROK Navy'],
    // UK
    ['uk_england', 'uk', 'infantry', 'British Army'],
    ['uk_england', 'uk', 'infantry', 'British Army'],
    ['uk_england', 'uk', 'infantry', 'British Army'],
    ['uk_england', 'uk', 'infantry', 'British Army'],
    ['uk_england', 'uk', 'infantry', 'British Army'],
    ['uk_england', 'uk', 'armor', 'British Armor'],
    ['uk_england', 'uk', 'armor', 'British Armor'],
    ['uk_england', 'uk', 'air', 'RAF'],
    ['uk_england', 'uk', 'air', 'RAF'],
    ['uk_england', 'uk', 'navy', 'Royal Navy'],
    ['uk_england', 'uk', 'navy', 'Royal Navy'],
    ['uk_scotland', 'uk', 'infantry', 'Scottish Division'],
    // France
    ['fr_paris', 'france', 'infantry', 'French Army'],
    ['fr_paris', 'france', 'infantry', 'French Army'],
    ['fr_paris', 'france', 'infantry', 'French Army'],
    ['fr_paris', 'france', 'armor', 'French Armor'],
    ['fr_paris', 'france', 'air', 'French Air'],
    ['fr_paris', 'france', 'navy', 'French Navy'],
    ['fr_alps', 'france', 'infantry', 'Alpine Division'],
    ['fr_normandy', 'france', 'infantry', 'Normandy Division'],
    ['fr_lorraine', 'france', 'infantry', 'Lorraine Division'],
    // Italy
    ['it_rome', 'italy', 'infantry', 'Italian Army'],
    ['it_rome', 'italy', 'infantry', 'Italian Army'],
    ['it_rome', 'italy', 'infantry', 'Italian Army'],
    ['it_rome', 'italy', 'armor', 'Italian Armor'],
    ['it_rome', 'italy', 'air', 'Italian Air'],
    ['it_rome', 'italy', 'navy', 'Italian Navy'],
    ['it_north', 'italy', 'infantry', 'Northern Italian'],
    ['it_south', 'italy', 'infantry', 'Southern Italian'],
    ['it_sicily', 'italy', 'infantry', 'Sicilian Division'],
    // Greece
    ['gr_athens', 'greece', 'infantry', 'Hellenic Army'],
    ['gr_athens', 'greece', 'infantry', 'Hellenic Army'],
    ['gr_athens', 'greece', 'infantry', 'Hellenic Army'],
    ['gr_athens', 'greece', 'armor', 'Hellenic Armor'],
    ['gr_athens', 'greece', 'air', 'Hellenic Air'],
    ['gr_athens', 'greece', 'navy', 'Hellenic Navy'],
    ['gr_crete', 'greece', 'infantry', 'Cretan Division'],
    // Turkey
    ['tr_istanbul', 'turkey', 'infantry', 'Turkish Army'],
    ['tr_istanbul', 'turkey', 'infantry', 'Turkish Army'],
    ['tr_istanbul', 'turkey', 'infantry', 'Turkish Army'],
    ['tr_istanbul', 'turkey', 'infantry', 'Turkish Army'],
    ['tr_istanbul', 'turkey', 'infantry', 'Turkish Army'],
    ['tr_istanbul', 'turkey', 'armor', 'Turkish Armor'],
    ['tr_istanbul', 'turkey', 'armor', 'Turkish Armor'],
    ['tr_istanbul', 'turkey', 'air', 'Turkish Air'],
    ['tr_istanbul', 'turkey', 'air', 'Turkish Air'],
    ['tr_istanbul', 'turkey', 'navy', 'Turkish Navy'],
    ['tr_istanbul', 'turkey', 'navy', 'Turkish Navy'],
    ['tr_ankara', 'turkey', 'infantry', 'Ankara Division'],
    ['tr_izmir', 'turkey', 'infantry', 'Izmir Division'],
    // Norway
    ['no_oslo', 'norway', 'infantry', 'Norwegian Army'],
    ['no_oslo', 'norway', 'infantry', 'Norwegian Army'],
    ['no_oslo', 'norway', 'infantry', 'Norwegian Army'],
    ['no_oslo', 'norway', 'armor', 'Norwegian Armor'],
    ['no_oslo', 'norway', 'air', 'Norwegian Air'],
    ['no_oslo', 'norway', 'navy', 'Norwegian Navy'],
    // Denmark
    ['dk_copenhagen', 'denmark', 'infantry', 'Danish Army'],
    ['dk_copenhagen', 'denmark', 'infantry', 'Danish Army'],
    ['dk_copenhagen', 'denmark', 'infantry', 'Danish Army'],
    ['dk_copenhagen', 'denmark', 'armor', 'Danish Armor'],
    ['dk_copenhagen', 'denmark', 'air', 'Danish Air'],
    ['dk_copenhagen', 'denmark', 'navy', 'Danish Navy'],
    // Canada
    ['ca_ontario', 'canada', 'infantry', 'Canadian Army'],
    ['ca_ontario', 'canada', 'infantry', 'Canadian Army'],
    ['ca_ontario', 'canada', 'infantry', 'Canadian Army'],
    ['ca_ontario', 'canada', 'infantry', 'Canadian Army'],
    ['ca_ontario', 'canada', 'infantry', 'Canadian Army'],
    ['ca_ontario', 'canada', 'armor', 'Canadian Armor'],
    ['ca_ontario', 'canada', 'armor', 'Canadian Armor'],
    ['ca_ontario', 'canada', 'air', 'RCAF'],
    ['ca_ontario', 'canada', 'air', 'RCAF'],
    ['ca_ontario', 'canada', 'navy', 'RCN'],
    ['ca_ontario', 'canada', 'navy', 'RCN'],
    ['ca_quebec', 'canada', 'infantry', 'Quebec Division'],
    ['ca_prairies', 'canada', 'infantry', 'Prairie Division'],
    ['ca_western', 'canada', 'infantry', 'Western Division'],
    // Australia
    ['au_nsw', 'australia', 'infantry', 'Australian Army'],
    ['au_nsw', 'australia', 'infantry', 'Australian Army'],
    ['au_nsw', 'australia', 'infantry', 'Australian Army'],
    ['au_nsw', 'australia', 'armor', 'Australian Armor'],
    ['au_nsw', 'australia', 'air', 'RAAF'],
    ['au_nsw', 'australia', 'navy', 'RAN'],
    ['au_vic', 'australia', 'infantry', 'Victorian Division'],
    ['au_qld', 'australia', 'infantry', 'Queensland Division'],
    ['au_wa', 'australia', 'infantry', 'WA Division'],
    // New Zealand
    ['nz_auckland', 'new_zealand', 'infantry', 'NZ Army'],
    ['nz_auckland', 'new_zealand', 'infantry', 'NZ Army'],
    ['nz_auckland', 'new_zealand', 'navy', 'RNZN'],
    // Taiwan
    ['tw_taipei', 'taiwan', 'infantry', 'Taiwan Garrison'],
    ['tw_taipei', 'taiwan', 'infantry', 'Taiwan Garrison'],
    ['tw_taipei', 'taiwan', 'infantry', 'Taiwan Garrison'],
    ['tw_taipei', 'taiwan', 'infantry', 'Taiwan Garrison'],
    ['tw_taipei', 'taiwan', 'infantry', 'Taiwan Garrison'],
    ['tw_taipei', 'taiwan', 'armor', 'Taiwan Armor'],
    ['tw_taipei', 'taiwan', 'air', 'Taiwan Air'],
    ['tw_taipei', 'taiwan', 'navy', 'Taiwan Navy'],
    ['tw_taipei', 'taiwan', 'navy', 'Taiwan Navy'],
    // Philippines
    ['ph_manila', 'philippines', 'infantry', 'Philippine Army'],
    ['ph_manila', 'philippines', 'infantry', 'Philippine Army'],
    ['ph_manila', 'philippines', 'infantry', 'Philippine Army'],
    ['ph_manila', 'philippines', 'infantry', 'Philippine Army'],
    ['ph_manila', 'philippines', 'infantry', 'Philippine Army'],
    ['ph_manila', 'philippines', 'armor', 'Philippine Armor'],
    ['ph_manila', 'philippines', 'air', 'Philippine Air'],
    ['ph_manila', 'philippines', 'navy', 'Philippine Navy'],
    ['ph_manila', 'philippines', 'navy', 'Philippine Navy'],
    ['ph_cebu', 'philippines', 'infantry', 'Cebu Division'],
    ['ph_mindanao', 'philippines', 'infantry', 'Mindanao Division'],
    // Thailand
    ['th_bangkok', 'thailand', 'infantry', 'Thai Army'],
    ['th_bangkok', 'thailand', 'infantry', 'Thai Army'],
    ['th_bangkok', 'thailand', 'infantry', 'Thai Army'],
    ['th_bangkok', 'thailand', 'armor', 'Thai Armor'],
    ['th_bangkok', 'thailand', 'air', 'Thai Air'],
    ['th_bangkok', 'thailand', 'navy', 'Thai Navy'],
    // Malaysia
    ['my_kl', 'malaysia', 'infantry', 'Malayan Army'],
    ['my_kl', 'malaysia', 'infantry', 'Malayan Army'],
    ['my_kl', 'malaysia', 'infantry', 'Malayan Army'],
    ['my_kl', 'malaysia', 'armor', 'Malayan Armor'],
    ['my_kl', 'malaysia', 'air', 'Malayan Air'],
    ['my_kl', 'malaysia', 'navy', 'Malayan Navy'],
    // Singapore
    ['sg_singapore', 'singapore', 'infantry', 'Singapore Force'],
    ['sg_singapore', 'singapore', 'infantry', 'Singapore Force'],
    ['sg_singapore', 'singapore', 'infantry', 'Singapore Force'],
    ['sg_singapore', 'singapore', 'infantry', 'Singapore Force'],
    ['sg_singapore', 'singapore', 'infantry', 'Singapore Force'],
    ['sg_singapore', 'singapore', 'armor', 'Singapore Armor'],
    ['sg_singapore', 'singapore', 'air', 'Singapore Air'],
    ['sg_singapore', 'singapore', 'navy', 'Singapore Navy'],
    ['sg_singapore', 'singapore', 'navy', 'Singapore Navy'],
  ];
  placements.forEach(([stateId, country, type, name]) => {
    const id = `usa_u${uid++}`;
    u[id] = buildUnit(id, type, stateId, country, 'usa', name);
  });
  return u;
}

function buildUSSRUnits(): Record<string, Unit> {
  const u: Record<string, Unit> = {};
  let uid = 0;
  // Moscow concentration
  const moscow: [UnitType, string][] = [
    ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'],
    ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'],
    ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'],
    ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'],
    ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'], ['infantry', 'Red Army'],
    ['armor', 'Soviet Armor'], ['armor', 'Soviet Armor'], ['armor', 'Soviet Armor'], ['armor', 'Soviet Armor'],
    ['armor', 'Soviet Armor'], ['armor', 'Soviet Armor'], ['armor', 'Soviet Armor'],
    ['air', 'Soviet Air'], ['air', 'Soviet Air'], ['air', 'Soviet Air'], ['air', 'Soviet Air'],
    ['navy', 'Soviet Navy'], ['navy', 'Soviet Navy'],
  ];
  moscow.forEach(([type, name]) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type, 'su_moscow', 'ussr', 'ussr', name);
  });
  // Leningrad
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_leningrad', 'ussr', 'ussr', i < 6 ? 'Leningrad Garrison' : i < 8 ? 'Leningrad Armor' : i < 10 ? 'Leningrad Air' : 'Baltic Fleet');
  });
  // Ukraine
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'armor', 'air', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_ukraine', 'ussr', 'ussr', i < 8 ? 'Ukrainian Front' : i < 11 ? 'Ukrainian Armor' : i < 14 ? 'Ukrainian Air' : 'Black Sea Fleet');
  });
  // Belarus
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_belarus', 'ussr', 'ussr', i < 6 ? 'Belarus Front' : i < 8 ? 'Belarus Armor' : i < 10 ? 'Belarus Air' : 'Belarus Fleet');
  });
  // Volga
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_volga', 'ussr', 'ussr', i < 5 ? 'Volga Front' : i < 7 ? 'Volga Armor' : i < 9 ? 'Volga Air' : 'Volga Fleet');
  });
  // Caucasus
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_caucasus', 'ussr', 'ussr', i < 6 ? 'Caucasus Front' : i < 8 ? 'Caucasus Armor' : i < 10 ? 'Caucasus Air' : 'Caucasus Fleet');
  });
  // Siberia
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_siberia', 'ussr', 'ussr', i < 5 ? 'Siberian Front' : i < 6 ? 'Siberian Armor' : i < 8 ? 'Siberian Air' : 'Siberian Fleet');
  });
  // Far East
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'armor', 'air', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_far_east', 'ussr', 'ussr', i < 8 ? 'Far East Front' : i < 11 ? 'Far East Armor' : i < 14 ? 'Far East Air' : 'Pacific Fleet');
  });
  // Kazakhstan
  ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'air'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_kazakh', 'ussr', 'ussr', i < 4 ? 'Kazakh Front' : i < 5 ? 'Kazakh Armor' : 'Kazakh Air');
  });
  // Central Asia
  ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_central', 'ussr', 'ussr', i < 4 ? 'Central Front' : i < 5 ? 'Central Armor' : 'Central Air');
  });
  // Ural
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_ural', 'ussr', 'ussr', i < 5 ? 'Ural Front' : i < 7 ? 'Ural Armor' : i < 9 ? 'Ural Air' : 'Ural Fleet');
  });
  // Baltic
  ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_baltic', 'ussr', 'ussr', i < 5 ? 'Baltic Front' : i < 6 ? 'Baltic Armor' : i < 8 ? 'Baltic Air' : 'Baltic Fleet');
  });
  // Murmansk
  ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'navy', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_murmansk', 'ussr', 'ussr', i < 4 ? 'Murmansk Front' : i < 5 ? 'Murmansk Armor' : i < 6 ? 'Murmansk Air' : 'Arctic Fleet');
  });
  // Karelia
  ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_karelia', 'ussr', 'ussr', i < 4 ? 'Karelia Front' : i < 5 ? 'Karelia Armor' : i < 6 ? 'Karelia Air' : 'Karelia Fleet');
  });
  // Arkhangelsk
  ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_arkhangelsk', 'ussr', 'ussr', i < 4 ? 'Arkhangelsk Front' : i < 5 ? 'Arkhangelsk Armor' : i < 6 ? 'Arkhangelsk Air' : 'White Sea Fleet');
  });
  // Moldova
  ['infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
    const id = `ussr_u${uid++}`;
    u[id] = buildUnit(id, type as UnitType, 'su_moldova', 'ussr', 'ussr', i < 3 ? 'Moldova Front' : i < 4 ? 'Moldova Armor' : i < 5 ? 'Moldova Air' : 'Moldova Fleet');
  });
  // Poland
  ['pl_warsaw', 'pl_poznan', 'pl_pomerania', 'pl_krakow', 'pl_wroclaw'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'poland', 'ussr', i < 8 ? 'Polish Army' : i < 10 ? 'Polish Armor' : i < 12 ? 'Polish Air' : 'Polish Navy');
    });
  });
  // Czechoslovakia
  ['cz_prague', 'cz_moravia', 'sk_bratislava', 'sk_kosice'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'czechoslovakia', 'ussr', i < 6 ? 'Czechoslovak Army' : i < 8 ? 'Czechoslovak Armor' : i < 10 ? 'Czechoslovak Air' : 'Czechoslovak Navy');
    });
  });
  // Hungary
  ['hu_budapest', 'hu_debrecen'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'hungary', 'ussr', i < 6 ? 'Hungarian Army' : i < 8 ? 'Hungarian Armor' : i < 10 ? 'Hungarian Air' : 'Hungarian Navy');
    });
  });
  // Romania
  ['ro_bucharest', 'ro_transylvania', 'ro_moldova'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'romania', 'ussr', i < 6 ? 'Romanian Army' : i < 8 ? 'Romanian Armor' : i < 10 ? 'Romanian Air' : 'Romanian Navy');
    });
  });
  // Bulgaria
  ['bg_sofia', 'bg_plovdiv'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'bulgaria', 'ussr', i < 6 ? 'Bulgarian Army' : i < 8 ? 'Bulgarian Armor' : i < 10 ? 'Bulgarian Air' : 'Bulgarian Navy');
    });
  });
  // Albania
  ['al_tirana'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'albania', 'ussr', i < 4 ? 'Albanian Army' : i < 5 ? 'Albanian Armor' : i < 6 ? 'Albanian Air' : 'Albanian Navy');
    });
  });
  // East Germany
  ['de_east_brandenburg', 'de_east_saxony', 'de_east_thuringia', 'de_east_mecklenburg'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'armor', 'air', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'east_germany', 'ussr', i < 8 ? 'East German Army' : i < 11 ? 'East German Armor' : i < 14 ? 'East German Air' : 'East German Navy');
    });
  });
  // China (communist)
  ['cn_beijing', 'cn_shanghai', 'cn_manchuria', 'cn_mongolia', 'cn_xinjiang', 'cn_shanxi', 'cn_sichuan', 'cn_tibet', 'cn_yunnan', 'cn_guangdong'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'armor', 'air', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'china', 'ussr', i < 8 ? 'PLA' : i < 11 ? 'PLA Armor' : i < 14 ? 'PLA Air' : 'PLA Navy');
    });
  });
  // North Korea
  ['kr_north'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'armor', 'air', 'air', 'air', 'navy', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'north_korea', 'ussr', i < 8 ? 'KPA' : i < 11 ? 'KPA Armor' : i < 14 ? 'KPA Air' : 'KPA Navy');
    });
  });
  // Vietnam
  ['vn_hanoi', 'vn_hue', 'vn_saigon'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'vietnam', 'ussr', i < 6 ? 'Viet Minh' : i < 8 ? 'Viet Armor' : i < 10 ? 'Viet Air' : 'Viet Navy');
    });
  });
  // Laos
  ['la_vientiane'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'laos', 'ussr', i < 3 ? 'Laotian Army' : i < 4 ? 'Laotian Armor' : i < 5 ? 'Laotian Air' : 'Laotian Navy');
    });
  });
  // Cambodia
  ['kh_phnom_penh'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'cambodia', 'ussr', i < 3 ? 'Khmer Army' : i < 4 ? 'Khmer Armor' : i < 5 ? 'Khmer Air' : 'Khmer Navy');
    });
  });
  // Cuba
  ['cu_havana', 'cu_santiago'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'cuba', 'ussr', i < 6 ? 'Cuban Army' : i < 8 ? 'Cuban Armor' : i < 10 ? 'Cuban Air' : 'Cuban Navy');
    });
  });
  // Mongolia
  ['mn_ulaanbaatar'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'armor', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'mongolia', 'ussr', i < 4 ? 'Mongolian Army' : i < 5 ? 'Mongolian Armor' : i < 6 ? 'Mongolian Air' : 'Mongolian Navy');
    });
  });
  // Soviet Kazakhstan
  ['kz_almaty'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'kazakhstan', 'ussr', i < 6 ? 'Kazakh Army' : i < 8 ? 'Kazakh Armor' : i < 10 ? 'Kazakh Air' : 'Kazakh Navy');
    });
  });
  // Soviet Uzbekistan
  ['uz_tashkent'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'uzbekistan', 'ussr', i < 6 ? 'Uzbek Army' : i < 8 ? 'Uzbek Armor' : i < 10 ? 'Uzbek Air' : 'Uzbek Navy');
    });
  });
  // Soviet Turkmenistan
  ['tm_ashgabat'].forEach((stateId) => {
    ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'armor', 'armor', 'air', 'air', 'navy'].forEach((type, i) => {
      const id = `ussr_u${uid++}`;
      u[id] = buildUnit(id, type as UnitType, stateId, 'turkmenistan', 'ussr', i < 6 ? 'Turkmen Army' : i < 8 ? 'Turkmen Armor' : i < 10 ? 'Turkmen Air' : 'Turkmen Navy');
    });
  });
  return u;
}

function getUSAAllies(): string[] {
  return ['canada', 'uk', 'france', 'netherlands', 'belgium', 'luxembourg', 'west_germany', 'italy', 'norway', 'denmark', 'portugal', 'andorra', 'greece', 'turkey', 'sweden', 'finland', 'australia', 'new_zealand', 'japan', 'south_korea', 'taiwan', 'hongkong', 'philippines', 'thailand', 'malaysia', 'singapore', 'india', 'pakistan', 'bangladesh', 'nepal', 'bhutan', 'afghanistan', 'iran', 'iraq', 'syria', 'lebanon', 'israel', 'jordan', 'saudi_arabia', 'egypt', 'sudan', 'libya', 'tunisia', 'morocco', 'algeria', 'ethiopia', 'nigeria', 'congo', 'kenya', 'tanzania', 'south_africa', 'brazil', 'argentina', 'uruguay', 'paraguay', 'bolivia', 'chile', 'peru', 'colombia', 'venezuela', 'guyana', 'suriname', 'french_guiana', 'ecuador', 'panama', 'mexico', 'indonesia', 'myanmar', 'china', 'ireland', 'spain', 'austria', 'switzerland'];
}

function getUSSRAllies(): string[] {
  return ['ussr', 'east_germany', 'poland', 'czechoslovakia', 'hungary', 'romania', 'bulgaria', 'albania', 'yugoslavia', 'china_communist', 'north_korea', 'mongolia', 'vietnam', 'laos', 'cambodia', 'cuba', 'kazakhstan', 'uzbekistan', 'turkmenistan'];
}

function buildUSAStats(): PlayerStats {
  const u = buildUSAUnits();
  const m = Object.values(u).reduce((sum, unit) => sum + UNIT_TYPES.find(ut => ut.type === unit.type)!.maintenance, 0);
  return {
    ...INITIAL_PLAYER_STATS,
    gdp: 2000, nuclearWarheads: 5, allies: getUSAAllies(),
    totalUnits: Object.values(u).length, maintenanceCost: m, productionPoints: 200, military: 50,
  };
}

function buildUSSRStats(): PlayerStats {
  const u = buildUSSRUnits();
  const m = Object.values(u).reduce((sum, unit) => sum + UNIT_TYPES.find(ut => ut.type === unit.type)!.maintenance, 0);
  return {
    ...INITIAL_PLAYER_STATS,
    gdp: 1200, nuclearWarheads: 0, allies: getUSSRAllies(),
    totalUnits: Object.values(u).length, maintenanceCost: m, productionPoints: 150, military: 50,
  };
}

function buildUSAFocus(): FocusTree {
  return {
    faction: 'usa',
    activeNodeId: null,
    politicalPath: null,
    nodes: [
      { id: 'f1', name: 'Keynesian Stimulus', description: 'Massive domestic infrastructure spending. GDP +200, Production Points +30.', category: 'economic', status: 'available', turnsRequired: 2, turnsRemaining: 2, prerequisites: [], effects: { gdp: 200, researchPoints: 30 }, x: 0, y: 0, icon: 'trending-up' },
      { id: 'f2', name: 'Bretton Woods', description: 'Establish the global dollar system. Trade route income +50%.', category: 'economic', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['f1'], effects: { gdp: 300, prestige: 20 }, x: 0, y: 1, icon: 'globe' },
      { id: 'f3', name: 'Marshall Plan', description: 'Rebuild European allies. All NATO economies +15, Prestige +30.', category: 'economic', status: 'locked', turnsRequired: 2, turnsRemaining: 2, prerequisites: ['f1'], effects: { gdp: 150, prestige: 30 }, x: 0, y: 2, icon: 'handshake' },
      { id: 'f4', name: 'Dollar Hegemony', description: 'The dollar becomes the global reserve currency. Income +400/turn.', category: 'economic', status: 'locked', turnsRequired: 4, turnsRemaining: 4, prerequisites: ['f2', 'f3'], effects: { gdp: 400, prestige: 40 }, x: 0, y: 3, icon: 'landmark' },
      { id: 'f5', name: 'Rearmament', description: 'Increase defense spending. Unlock Armor units. Military +10.', category: 'military', status: 'available', turnsRequired: 2, turnsRemaining: 2, prerequisites: [], effects: { unlockUnit: 'armor', military: 10 }, x: 1, y: 0, icon: 'shield' },
      { id: 'f6', name: 'NATO Formation', description: 'Formal military alliance with Western Europe. Allies gain +5 units.', category: 'military', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['f5'], effects: { prestige: 25, tension: 5 }, x: 1, y: 1, icon: 'users' },
      { id: 'f7', name: 'Armored Divisions', description: 'Mass production of tanks. Armor cost -20%, unlock Air units.', category: 'military', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['f5'], effects: { unlockUnit: 'air', unitDiscount: 20 }, x: 1, y: 2, icon: 'truck' },
      { id: 'f8', name: 'Air Superiority', description: 'B-52 fleet and jet fighters. Air units cost -20%, +20 military power.', category: 'military', status: 'locked', turnsRequired: 4, turnsRemaining: 4, prerequisites: ['f6', 'f7'], effects: { military: 20, unitDiscount: 20 }, x: 1, y: 3, icon: 'plane' },
      { id: 'f9', name: 'Truman Doctrine', description: 'Containment policy formalized. Diplomacy power +20, Tension +10.', category: 'intelligence', status: 'available', turnsRequired: 1, turnsRemaining: 1, prerequisites: [], effects: { prestige: 10, tension: 10 }, x: 2, y: 0, icon: 'eye' },
      { id: 'f10', name: 'CIA Operations', description: 'Establish covert operations. Intelligence operations cost -1 AP.', category: 'intelligence', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['f9'], effects: { prestige: 15, researchPoints: 20 }, x: 2, y: 1, icon: 'spy' },
      { id: 'f11', name: 'Covert War', description: 'Sponsor proxy insurgencies. Proxy wars cheaper, tension lower.', category: 'intelligence', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['f9'], effects: { prestige: 20, tension: -10 }, x: 2, y: 2, icon: 'crosshair' },
      { id: 'f12', name: 'Space Race', description: 'NASA and Apollo program. Prestige +50, unlocks Satellite units.', category: 'intelligence', status: 'locked', turnsRequired: 4, turnsRemaining: 4, prerequisites: ['f10', 'f11'], effects: { prestige: 50, tension: -15, gdp: 200 }, x: 2, y: 3, icon: 'rocket' },
    ]
  };
}

function buildUSSRFocus(): FocusTree {
  return {
    faction: 'ussr',
    activeNodeId: null,
    politicalPath: null,
    nodes: [
      // === ECONOMIC ===
      { id: 's1', name: 'Five-Year Plan', description: 'Centralized industrial expansion. GDP +150, Production +25.', category: 'economic', status: 'available', turnsRequired: 12, turnsRemaining: 12, prerequisites: [], effects: { gdp: 150, researchPoints: 25 }, x: 0, y: 0, icon: 'factory' },
      { id: 's2', name: 'COMECON', description: 'Economic integration of Eastern Bloc. All Warsaw economies +10.', category: 'economic', status: 'locked', turnsRequired: 24, turnsRemaining: 24, prerequisites: ['s1'], effects: { gdp: 200, prestige: 15 }, x: 0, y: 1, icon: 'handshake' },
      { id: 's3', name: 'Soviet Oil Exports', description: 'Fuel the global economy. Income +250, but Tension +10.', category: 'economic', status: 'locked', turnsRequired: 12, turnsRemaining: 12, prerequisites: ['s1'], effects: { gdp: 250, tension: 10 }, x: 0, y: 2, icon: 'fuel' },
      { id: 's4', name: 'Moscow Financial Center', description: 'The Ruble challenges the dollar. Income +350, Prestige +35.', category: 'economic', status: 'locked', turnsRequired: 100, turnsRemaining: 100, prerequisites: ['s2', 's3'], effects: { gdp: 350, prestige: 35 }, x: 0, y: 3, icon: 'landmark' },
      // === MILITARY ===
      { id: 's5', name: 'Red Army Expansion', description: 'Massive conscription. Military +15, unlock Armor.', category: 'military', status: 'available', turnsRequired: 12, turnsRemaining: 12, prerequisites: [], effects: { unlockUnit: 'armor', military: 15 }, x: 1, y: 0, icon: 'shield' },
      { id: 's6', name: 'Warsaw Pact', description: 'Military alliance with Eastern Bloc. Allies gain +5 units.', category: 'military', status: 'locked', turnsRequired: 12, turnsRemaining: 12, prerequisites: ['s5'], effects: { prestige: 25, tension: 5 }, x: 1, y: 1, icon: 'users' },
      { id: 's7', name: '"три танкиста"', description: 'T-54 mass production. Armor cost -20%, unlock Air.', category: 'military', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['s5'], effects: { unlockUnit: 'air', unitDiscount: 20 }, x: 1, y: 2, icon: 'truck' },
      { id: 's8', name: 'Send Advisors to Vietnam', description: 'Guerrilla warfare expertise. +20 military, proxy wars cheaper.', category: 'military', status: 'locked', turnsRequired: 4, turnsRemaining: 4, prerequisites: ['s6', 's7'], effects: { military: 20, unitDiscount: 20 }, x: 1, y: 3, icon: 'plane' },
      // === INTELLIGENCE ===
      { id: 's9', name: 'Establishment of the KGB', description: 'Establish intelligence network. Tension -10, Prestige +15.', category: 'intelligence', status: 'available', turnsRequired: 1, turnsRemaining: 1, prerequisites: [], effects: { prestige: 15, tension: -10 }, x: 2, y: 0, icon: 'eye' },
      { id: 's10', name: 'Active Measures', description: 'Soviet disinformation campaigns. Intelligence ops cost -1 AP.', category: 'intelligence', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['s9'], effects: { prestige: 15, researchPoints: 20 }, x: 2, y: 1, icon: 'spy' },
      { id: 's11', name: 'Sputnik', description: 'First satellite launch. Prestige +40, Tension -10.', category: 'intelligence', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['s9'], effects: { prestige: 40, tension: -10 }, x: 2, y: 2, icon: 'rocket' },
      { id: 's12', name: 'Lunar Program', description: 'Soviet space supremacy. Prestige +50, +200 GDP.', category: 'intelligence', status: 'locked', turnsRequired: 4, turnsRemaining: 4, prerequisites: ['s10', 's11'], effects: { prestige: 50, gdp: 200 }, x: 2, y: 3, icon: 'moon' },
      // === POLITICAL — SHARED ROOT ===
      { id: 'sp0', name: 'Ideological Direction', description: 'The Soviet Union must define its political character. Choose the Stalinist path of iron discipline or the Reformist path of controlled liberalisation. This choice is permanent.', category: 'political', status: 'available', turnsRequired: 1, turnsRemaining: 1, prerequisites: [], effects: {}, x: 1, y: 0, icon: 'flag' },
      // === POLITICAL — STALINIST PATH ===
      // Historical branch
      { id: 'sp_s1', name: 'Cult of Personality', description: 'Elevate Stalin to divine status. Prestige +30, Tension +8. The party is purged of moderates.', category: 'political', status: 'locked', turnsRequired: 8, turnsRemaining: 8, prerequisites: ['sp0'], effects: { prestige: 30, tension: 8 }, x: 0, y: 1, icon: 'crown' },
      { id: 'sp_s2', name: 'Stalinist Collectivization', description: 'Forced collectivization of agriculture. GDP +100, Military +5, Tension +8.', category: 'political', status: 'locked', turnsRequired: 12, turnsRemaining: 12, prerequisites: ['sp_s1'], effects: { gdp: 100, military: 5, tension: 8 }, x: 0, y: 2, icon: 'wheat' },
      { id: 'sp_s3', name: 'Gulag Labour Economy', description: 'Forced labour drives industrial output. GDP +200, Military +10, Tension +12.', category: 'political', status: 'locked', turnsRequired: 6, turnsRemaining: 6, prerequisites: ['sp_s2'], effects: { gdp: 200, military: 10, tension: 12 }, x: 0, y: 3, icon: 'hammer' },
      { id: 'sp_s4', name: 'Great Purge', description: 'Purge unreliable officers and party members. Military +20, Prestige +15, Tension +10.', category: 'political', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['sp_s2'], effects: { military: 20, prestige: 15, tension: 10 }, x: 1, y: 3, icon: 'sword' },
      { id: 'sp_s5', name: 'Doctors\' Plot', description: 'Show-trials crush internal opposition. Prestige +20, Tension +5. Unlocks non-historical branch.', category: 'political', status: 'locked', turnsRequired: 2, turnsRemaining: 2, prerequisites: ['sp_s3', 'sp_s4'], effects: { prestige: 20, tension: 5 }, x: 0, y: 4, icon: 'skull' },
      { id: 'sp_s6', name: 'Iron Satellites', description: 'Crush dissent across Eastern Europe. Military +15, Tension +15, Prestige +10.', category: 'political', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['sp_s4'], effects: { military: 15, tension: 15, prestige: 10 }, x: 1, y: 4, icon: 'lock' },
      // Non-historical escalation
      { id: 'sp_s7', name: 'Stalin Lives On', description: 'Stalin lives! Prestige +50, Military +20, Tension +20.', category: 'political', status: 'locked', turnsRequired: 1, turnsRemaining: 1, prerequisites: ['sp_s5'], effects: { prestige: 50, military: 20, tension: 20 }, x: 0, y: 5, icon: 'crown' },
      { id: 'sp_s8', name: 'Assured Retaliation', description: 'Develop first-strike nuclear doctrine. Nukes +3, Military +20, Tension +20.', category: 'political', status: 'locked', turnsRequired: 6, turnsRemaining: 6, prerequisites: ['sp_s6', 'sp_s7'], effects: { nuclearWarheads: 3, military: 20, tension: 20 }, x: 1, y: 5, icon: 'zap' },
      { id: 'sp_s9', name: 'Worldwide Revolution!', description: 'Proclaim inevitable global communist triumph. Prestige +80, GDP +300, Tension +25.', category: 'political', status: 'locked', turnsRequired: 12, turnsRemaining: 12, prerequisites: ['sp_s7'], effects: { prestige: 80, gdp: 300, tension: 25 }, x: 0, y: 6, icon: 'globe' },
      { id: 'sp_s10', name: 'Seven Days to the River Rhine', description: 'Total mobilisation for preemptive strike. Military +40, Nukes +2, Tension +30.', category: 'political', status: 'locked', turnsRequired: 24, turnsRemaining: 24, prerequisites: ['sp_s8', 'sp_s9'], effects: { military: 40, nuclearWarheads: 2, tension: 30 }, x: 0, y: 7, icon: 'flame' },
      { id: 'sp_s11', name: 'Socialism Triumphs!', description: 'Simultaneous communist coups sweep the West. Prestige +150, GDP +500, Military +50. Completing this wins the game for the USSR.', category: 'political', status: 'locked', turnsRequired: 24, turnsRemaining: 24, prerequisites: ['sp_s10'], effects: { prestige: 150, gdp: 500, military: 50, tension: -20 }, x: 0, y: 8, icon: 'star' },
      // === POLITICAL — REFORMIST PATH ===
      { id: 'sp_r1', name: 'De-Stalinization', description: 'REFORMIST: Khrushchev\'s secret speech denounces Stalin\'s crimes. Prestige +20, Tension -15. The thaw begins.', category: 'political', status: 'locked', turnsRequired: 24, turnsRemaining: 24, prerequisites: ['sp0'], effects: { prestige: 20, tension: -15 }, x: 2, y: 1, icon: 'sun' },
      { id: 'sp_r2', name: 'New Economic Policy', description: 'REFORMIST: Liberalise agriculture and small enterprise. GDP +180, Prestige +15, Tension -5.', category: 'political', status: 'locked', turnsRequired: 24, turnsRemaining: 24, prerequisites: ['sp_r1'], effects: { gdp: 180, prestige: 15, tension: -5 }, x: 2, y: 2, icon: 'trending-up' },
      { id: 'sp_r3', name: 'Cultural Thaw', description: 'REFORMIST: Loosen artistic censorship — Pasternak, Solzhenitsyn. Prestige +25, Research +20, Tension -8.', category: 'political', status: 'locked', turnsRequired: 12, turnsRemaining: 12, prerequisites: ['sp_r1'], effects: { prestige: 25, researchPoints: 20, tension: -8 }, x: 3, y: 2, icon: 'book' },
      { id: 'sp_r4', name: 'Helsinki Accords', description: 'REFORMIST: Sign human rights and security agreements with the West. Prestige +35, Tension -20. Opens diplomatic channels.', category: 'political', status: 'locked', turnsRequired: 3, turnsRemaining: 3, prerequisites: ['sp_r2', 'sp_r3'], effects: { prestige: 35, tension: -20 }, x: 2, y: 3, icon: 'handshake' },
      { id: 'sp_r5', name: 'Glasnost', description: 'REFORMIST: Policy of openness and transparency. Prestige +30, Research +30, GDP +100, Tension -10.', category: 'political', status: 'locked', turnsRequired: 48, turnsRemaining: 48, prerequisites: ['sp_r4'], effects: { prestige: 30, researchPoints: 30, gdp: 100, tension: -10 }, x: 2, y: 4, icon: 'eye' },
      { id: 'sp_r6', name: 'Perestroika', description: 'REFORMIST: Restructure the Soviet economy. GDP +250, Prestige +25, Research +40, Tension -10.', category: 'political', status: 'locked', turnsRequired: 52, turnsRemaining: 52, prerequisites: ['sp_r5'], effects: { gdp: 250, prestige: 25, researchPoints: 40, tension: -10 }, x: 3, y: 4, icon: 'settings' },
      { id: 'sp_r7', name: 'Arms Reduction Treaties', description: 'REFORMIST: Negotiate SALT and START with the USA. Tension -25, Prestige +40. Nuclear arsenals draw down.', category: 'political', status: 'locked', turnsRequired: 4, turnsRemaining: 4, prerequisites: ['sp_r5'], effects: { prestige: 40, tension: -25 }, x: 2, y: 5, icon: 'peace' },
      { id: 'sp_r8', name: 'Soviet Commonwealth', description: 'REFORMIST: Voluntary federation of Soviet republics — a transformed, stable USSR. GDP +300, Prestige +50, Tension -20.', category: 'political', status: 'locked', turnsRequired: 12, turnsRemaining: 12, prerequisites: ['sp_r6', 'sp_r7'], effects: { gdp: 300, prestige: 50, tension: -20 }, x: 2, y: 6, icon: 'globe' },
      { id: 'sp_r9', name: 'NEW SOVIET CENTURY', description: 'REFORMIST VICTORY: A reformed, stable Soviet state leads the world through diplomacy and economic might. Prestige +120, GDP +400, Tension -30. Completing this wins the game for the USSR by soft power.', category: 'political', status: 'locked', turnsRequired: 16, turnsRemaining: 16, prerequisites: ['sp_r8'], effects: { prestige: 120, gdp: 400, tension: -30 }, x: 2, y: 7, icon: 'star' },
    ]
  };
}

export const EVENTS: GameEvent[] = [
  {
    id: 'e1', year: 1947, month: 3, title: 'Truman Doctrine',
    description: 'President Truman declares that the United States will support free peoples resisting subjugation. Greece and Turkey are on the brink.\n\nHow does your government respond?',
    faction: 'usa', choices: [
      { id: 'c1', text: 'Increase military and economic aid to Greece and Turkey', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 15, gdp: s.usaStats.gdp - 30 } }) },
      { id: 'c2', text: 'Focus on domestic recovery — avoid foreign entanglements', effect: (s) => ({ tension: s.tension - 5, usaStats: { ...s.usaStats, gdp: s.usaStats.gdp + 50 } }) },
    ]
  },
  {
    id: 'e2b', year: 1948, month: 6, title: 'Berlin Blockade',
    description: 'Soviet forces have blockaded all Western access routes to Berlin. The West is now dependent on air corridors.\n\nHow does the Soviet Union press its advantage?',
    faction: 'ussr', choices: [
      { id: 'c1', text: 'Hold firm — the West will abandon the city', effect: (s) => ({ tension: s.tension + 10, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 10 } }) },
      { id: 'c2', text: 'Offer a face-saving negotiated settlement', effect: (s) => ({ tension: s.tension - 5, ussrStats: { ...s.ussrStats, gdp: s.ussrStats.gdp + 30 } }) },
    ]
  },
  {
    id: 'e2', year: 1948, month: 6, title: 'Berlin Blockade',
    description: 'The USSR has cut all road, rail, and canal access to West Berlin, seeking to force the Western Allies to abandon the city.\n\nHow does the United States respond?',
    faction: 'usa', choices: [
      { id: 'c1', text: 'Launch the Berlin Airlift — supply the city by air', effect: (s) => ({ tension: s.tension + 8, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 20, gdp: s.usaStats.gdp - 60 } }) },
      { id: 'c2', text: 'Negotiate a corridor agreement with Moscow', effect: (s) => ({ tension: s.tension - 5, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 10 } }) },
    ]
  },
  {
    id: 'e3', year: 1949, month: 4, title: 'NATO Formation',
    description: 'The North Atlantic Treaty Organization is formally signed, binding the USA, UK, France and eight other nations into a mutual defence pact.\n\nHow does the United States shape the new alliance?',
    faction: 'usa', choices: [
      { id: 'c1', text: 'Commit substantial US forces to European defence', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, military: Math.min(100, s.usaStats.military + 15), gdp: s.usaStats.gdp - 80 } }) },
      { id: 'c2', text: 'Focus on economic reconstruction — let Europe rebuild militarily', effect: (s) => ({ tension: s.tension - 5, usaStats: { ...s.usaStats, gdp: s.usaStats.gdp + 100 } }) },
    ]
  },
  {
    id: 'e3b', year: 1949, month: 4, title: 'NATO Formation',
    description: 'The Western powers have formalised NATO, creating a direct military alliance aimed at containing Soviet expansion in Europe.\n\nHow does the Soviet Union respond?',
    faction: 'ussr', choices: [
      { id: 'c1', text: 'Accelerate Warsaw Pact military build-up', effect: (s) => ({ tension: s.tension + 8, ussrStats: { ...s.ussrStats, military: Math.min(100, s.ussrStats.military + 15), gdp: s.ussrStats.gdp - 80 } }) },
      { id: 'c2', text: 'Push for a pan-European security treaty to undermine NATO', effect: (s) => ({ tension: s.tension - 3, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 10 } }) },
    ]
  },
  {
    id: 'e4', year: 1950, month: 6, title: 'Korean War Begins',
    description: 'North Korean forces have crossed the 38th Parallel and are rapidly overrunning South Korea. The UN Security Council calls for intervention.\n\nWhat action does the United States take?',
    faction: 'usa', choices: [
      { id: 'c1', text: 'Commit US forces under UN command — defend South Korea', effect: (s) => ({ tension: s.tension + 15, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 15, gdp: s.usaStats.gdp - 100 } }) },
      { id: 'c2', text: 'Provide arms and air support — avoid a ground war', effect: (s) => ({ tension: s.tension + 7, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 5, gdp: s.usaStats.gdp - 40 } }) },
    ]
  },
  {
    id: 'e4b', year: 1950, month: 6, title: 'Korean War Begins',
    description: 'North Korea, equipped with Soviet weapons, has invaded South Korea. American intervention is now likely.\n\nHow does the Soviet Union support its ally?',
    faction: 'ussr', choices: [
      { id: 'c1', text: 'Supply North Korea with weapons, advisors and air cover', effect: (s) => ({ tension: s.tension + 12, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 10, gdp: s.ussrStats.gdp - 60 } }) },
      { id: 'c2', text: 'Maintain plausible deniability — limit direct involvement', effect: (s) => ({ tension: s.tension + 5, ussrStats: { ...s.ussrStats, gdp: s.ussrStats.gdp - 20 } }) },
    ]
  },
  {
    id: 'e6', year: 1957, month: 10, title: 'Sputnik Launch', description: 'The USSR launches the first artificial satellite. Space race begins.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Accelerate space program', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige - 5, gdp: s.usaStats.gdp - 100 } }) },
      { id: 'c2', text: 'Focus on military applications', effect: (s) => ({ tension: s.tension + 10, usaStats: { ...s.usaStats, military: Math.min(100, s.usaStats.military + 10) } }) },
    ]
  },
  {
    id: 'e7', year: 1961, month: 8, title: 'Berlin Wall', description: 'East Germany builds a wall dividing Berlin. Symbol of the Cold War.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Condemn the wall', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 10 } }) },
      { id: 'c2', text: 'Recognize the division', effect: (s) => ({ tension: s.tension - 5, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 10 } }) },
    ]
  },
  {
    id: 'e8', year: 1962, month: 10, title: 'Cuban Missile Crisis', description: 'Soviet missiles discovered in Cuba. The world stands on the brink.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Demand immediate removal', effect: (s) => ({ tension: s.tension + 20, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 20 } }) },
      { id: 'c2', text: 'Negotiate a secret deal', effect: (s) => ({ tension: s.tension + 10, usaStats: { ...s.usaStats, gdp: s.usaStats.gdp - 50 }, ussrStats: { ...s.ussrStats, gdp: s.ussrStats.gdp + 50 } }) },
    ]
  },
  {
    id: 'e9', year: 1968, month: 8, title: 'Prague Spring', description: 'Czechoslovakia attempts liberal reforms. The USSR must respond.',
    faction: 'ussr', choices: [
      { id: 'c1', text: 'Invade and crush the reforms', effect: (s) => ({ tension: s.tension + 10, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige - 10 } }) },
      { id: 'c2', text: 'Allow limited reforms', effect: (s) => ({ tension: s.tension - 5, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige + 5 } }) },
    ]
  },
  {
    id: 'e10', year: 1979, month: 12, title: 'Soviet Invasion of Afghanistan', description: 'The USSR invades Afghanistan to support the communist government.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Support the Mujahideen', effect: (s) => ({ tension: s.tension + 10, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 10, gdp: s.usaStats.gdp - 50 } }) },
      { id: 'c2', text: 'Condemn but avoid direct involvement', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 5 } }) },
    ]
  },
  {
    id: 'e11', year: 1983, month: 3, title: 'Strategic Defense Initiative', description: 'The USA proposes a missile defense system in space.',
    faction: 'usa', choices: [
      { id: 'c1', text: 'Full funding for SDI', effect: (s) => ({ tension: s.tension + 10, usaStats: { ...s.usaStats, gdp: s.usaStats.gdp - 200, prestige: s.usaStats.prestige + 10 } }) },
      { id: 'c2', text: 'Limited research only', effect: (s) => ({ tension: s.tension + 5, usaStats: { ...s.usaStats, gdp: s.usaStats.gdp - 50 } }) },
    ]
  },
  {
    id: 'e12', year: 1986, month: 4, title: 'Chernobyl Disaster', description: 'A nuclear reactor meltdown in Ukraine exposes Soviet weaknesses.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Offer humanitarian aid', effect: (s) => ({ tension: s.tension - 5, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 10 } }) },
      { id: 'c2', text: 'Exploit the propaganda opportunity', effect: (s) => ({ tension: s.tension + 5, ussrStats: { ...s.ussrStats, prestige: s.ussrStats.prestige - 15 } }) },
    ]
  },
  {
    id: 'e13', year: 1989, month: 11, title: 'Fall of the Berlin Wall', description: 'The wall comes down. The Cold War is ending.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Support German reunification', effect: (s) => ({ tension: s.tension - 20, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 30 } }) },
      { id: 'c2', text: 'Cautious approach to change', effect: (s) => ({ tension: s.tension - 10, usaStats: { ...s.usaStats, prestige: s.usaStats.prestige + 15 } }) },
    ]
  },
  {
    id: 'e14', year: 1991, month: 12, title: 'Dissolution of the USSR', description: 'The Soviet Union collapses. The Cold War is over.',
    faction: 'both', choices: [
      { id: 'c1', text: 'Declare victory', effect: (s) => ({ status: 'gameover', winner: 'usa', victoryReason: 'The Soviet Union has collapsed. The USA wins the Cold War.' }) },
      { id: 'c2', text: 'Support the new Russia', effect: (s) => ({ status: 'gameover', winner: 'usa', victoryReason: 'Peaceful transition. The USA wins the Cold War.' }) },
    ]
  },
];

export const TRADE_ROUTES: { from: string; to: string; value: number }[] = [
  { from: 'usa', to: 'uk', value: 80 },
  { from: 'usa', to: 'japan', value: 60 },
  { from: 'usa', to: 'canada', value: 100 },
  { from: 'usa', to: 'west_germany', value: 50 },
  { from: 'usa', to: 'brazil', value: 40 },
  { from: 'ussr', to: 'china', value: 30 },
  { from: 'ussr', to: 'poland', value: 50 },
  { from: 'ussr', to: 'czechoslovakia', value: 40 },
  { from: 'uk', to: 'france', value: 50 },
  { from: 'uk', to: 'west_germany', value: 40 },
  { from: 'west_germany', to: 'france', value: 60 },
  { from: 'west_germany', to: 'italy', value: 40 },
  { from: 'west_germany', to: 'japan', value: 30 },
  { from: 'china', to: 'japan', value: 20 },
  { from: 'china', to: 'north_korea', value: 30 },
  { from: 'india', to: 'uk', value: 30 },
  { from: 'india', to: 'ussr', value: 25 },
  { from: 'egypt', to: 'ussr', value: 20 },
  { from: 'egypt', to: 'france', value: 15 },
  { from: 'brazil', to: 'west_germany', value: 25 },
  { from: 'brazil', to: 'argentina', value: 20 },
  { from: 'australia', to: 'japan', value: 25 },
  { from: 'australia', to: 'uk', value: 30 },
  { from: 'iran', to: 'west_germany', value: 20 },
  { from: 'iraq', to: 'france', value: 15 },
  { from: 'cuba', to: 'ussr', value: 10 },
  { from: 'yugoslavia', to: 'italy', value: 20 },
  { from: 'yugoslavia', to: 'west_germany', value: 15 },
  { from: 'nigeria', to: 'uk', value: 15 },
  { from: 'nigeria', to: 'france', value: 15 },
  { from: 'indonesia', to: 'japan', value: 20 },
  { from: 'indonesia', to: 'usa', value: 15 },
  { from: 'pakistan', to: 'china', value: 15 },
  { from: 'pakistan', to: 'uk', value: 15 },
  { from: 'algeria', to: 'france', value: 20 },
  { from: 'algeria', to: 'ussr', value: 15 },
  { from: 'ethiopia', to: 'ussr', value: 10 },
  { from: 'ethiopia', to: 'usa', value: 10 },
];

// Chinese provinces held by each side at start of civil war (1947)
// Communists held NE China (Manchuria, Inner Mongolia), nationalists held the rest
export const CHINA_COMMUNIST_INITIAL = ['cn_manchuria', 'cn_mongolia', 'cn_beijing', 'cn_shanxi'];
export const CHINA_NATIONALIST_INITIAL = ['cn_shanghai', 'cn_sichuan', 'cn_tibet', 'cn_yunnan', 'cn_guangdong', 'cn_xinjiang'];
// All Chinese mainland provinces in order of communist advance
export const CHINA_COMMUNIST_ADVANCE_ORDER = ['cn_xinjiang', 'cn_sichuan', 'cn_yunnan', 'cn_guangdong', 'cn_shanghai', 'cn_tibet'];
// Nationalists can recapture any province the communists hold.
// Order: start with their own lost territory (reverse of communist advance), then the original communist heartland.
export const CHINA_NATIONALIST_ADVANCE_ORDER = ['cn_tibet', 'cn_shanghai', 'cn_guangdong', 'cn_yunnan', 'cn_sichuan', 'cn_xinjiang', 'cn_shanxi', 'cn_beijing', 'cn_mongolia', 'cn_manchuria'];

export const INITIAL_STATE: GameState = {
  status: 'menu',
  winner: null,
  victoryReason: null,
  playerFaction: null,
  year: 1947,
  month: 1,
  tension: 5,
  chinaCivilWar: {
    communistStates: [...CHINA_COMMUNIST_INITIAL],
    nationalistStates: [...CHINA_NATIONALIST_INITIAL],
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
    lastCommunistCount: CHINA_COMMUNIST_INITIAL.length,
  },
  usaStats: buildUSAStats(),
  ussrStats: buildUSSRStats(),
  countries: buildCountries(),
  states: buildStates(),
  units: {},
  focusTrees: { usa: buildUSAFocus(), ussr: buildUSSRFocus() },
  logs: [],
  activeEvent: null,
  selectedCountryId: null,
  selectedStateId: null,
  selectedUnitId: null,
  combatResult: null,
  activeTab: 'intel',
  buildQueue: [],
  tradeRoutes: TRADE_ROUTES,
  zoom: 1,
  center: [20, 0],
};
