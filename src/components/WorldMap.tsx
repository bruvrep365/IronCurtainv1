import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { feature, merge } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { Country, ChinaCivilWar, Unit, State, UnitType } from '../lib/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * The world-atlas dataset only contains a single, post-reunification Germany
 * polygon (ISO 276), so East Germany cannot be shown from the base map alone.
 * This GeoJSON overlay approximates the German Democratic Republic (GDR)
 * along the historical inner-German border in the west and the Oder–Neisse
 * line in the east, letting the map render the divided 1947–1990 Germany.
 */
const EAST_GERMANY_GEO = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'east_germany',
      properties: { name: 'East Germany' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.7, 53.9],
            [12.0, 54.5],
            [14.4, 53.9],
            [14.6, 52.8],
            [14.8, 52.0],
            [15.0, 51.4],
            [14.9, 50.9],
            [13.0, 50.4],
            [12.1, 50.3],
            [10.6, 50.6],
            [10.2, 51.4],
            [10.6, 52.5],
            [10.7, 53.9],
          ],
        ],
      },
    },
  ],
};

const ISO_TO_GAME_ID: Record<string, string> = {
  '840': 'usa', '124': 'canada', '826': 'uk', '250': 'france', '276': 'west_germany', // Unified Germany shown as West Germany (contested)
  '380': 'italy', '724': 'spain', '620': 'portugal', '300': 'greece', '792': 'turkey',
  '578': 'norway', '208': 'denmark', '036': 'australia', '392': 'japan', '410': 'south_korea',
  '608': 'philippines', '643': 'ussr', '616': 'poland', '203': 'czechoslovakia',
  '348': 'hungary', '642': 'romania', '100': 'bulgaria', '156': 'china', '408': 'north_korea',
  '704': 'vietnam', '192': 'cuba', '356': 'india', '818': 'egypt', '360': 'indonesia',
  '076': 'brazil', '032': 'argentina', '484': 'mexico', '364': 'iran', '368': 'iraq',
  '760': 'syria', '004': 'afghanistan', '012': 'algeria', '586': 'pakistan', '688': 'yugoslavia',
  '050': 'bangladesh', '566': 'nigeria', '231': 'ethiopia',
  // Soviet republics (all part of USSR in 1947)
  '398': 'ussr', '860': 'ussr', '795': 'ussr', '417': 'ussr', '762': 'ussr',
  '804': 'ussr', '112': 'ussr', '498': 'ussr', '051': 'ussr', '031': 'ussr',
  '268': 'ussr', '440': 'ussr', '428': 'ussr', '233': 'ussr',
  '496': 'mongolia', // Mongolian People's Republic (Soviet-aligned, independent)
  // Czechoslovakia (modern successor states)
  '703': 'czechoslovakia', // Slovakia
  // Yugoslavia (modern successor states)
  '191': 'yugoslavia', // Croatia
  '070': 'yugoslavia', // Bosnia & Herzegovina
  '705': 'yugoslavia', // Slovenia
  '499': 'yugoslavia', // Montenegro
  '807': 'yugoslavia', // North Macedonia (formerly Yugoslav Macedonia)
  // Additional nations
  '048': 'bahrain', '682': 'saudi_arabia', '144': 'srilanka', '524': 'nepal',
  '064': 'bhutan', '104': 'myanmar', '418': 'laos', '116': 'cambodia', '702': 'singapore',
  '458': 'malaysia', '598': 'png', '554': 'new_zealand', '242': 'fiji', '090': 'solomon',
  '584': 'marshall', '296': 'kiribati', '520': 'nauru', '585': 'palau', '166': 'cocos',
  '162': 'christmas', '136': 'cayman', '531': 'curacao', '534': 'sxm', '533': 'aruba',
  '328': 'guyana', '740': 'suriname', '254': 'french_guiana', '218': 'ecuador', '604': 'peru',
  '068': 'bolivia', '152': 'chile', '600': 'paraguay', '858': 'uruguay', '084': 'belize',
  '188': 'costa_rica', '320': 'guatemala', '340': 'honduras', '558': 'nicaragua', '591': 'panama',
  '222': 'el_salvador', '214': 'dominican', '388': 'jamaica', '788': 'tunisia', '434': 'libya',
  '729': 'sudan', '232': 'eritrea', '706': 'somalia', '404': 'kenya', '450': 'madagascar',
  '454': 'malawi', '480': 'mauritius', '175': 'mayotte', '508': 'mozambique', '638': 'reunion',
  '690': 'seychelles', '834': 'tanzania', '800': 'uganda', '894': 'zambia', '716': 'zimbabwe',
  '024': 'angola', '120': 'cameroon', '140': 'car', '148': 'chad', '178': 'congo',
  '180': 'drc', '226': 'equatorial_guinea', '266': 'gabon', '270': 'gambia', '288': 'ghana',
  '324': 'guinea', '624': 'guinea_bissau', '384': 'ivory', '430': 'liberia', '466': 'mali',
  '478': 'mauritania', '504': 'morocco', '562': 'niger', '678': 'sao_tome', '686': 'senegal',
  '694': 'sierra_leone', '748': 'eswatini', '768': 'togo', '204': 'benin', '072': 'botswana',
  '426': 'lesotho', '516': 'namibia', '752': 'sweden', '246': 'finland', '372': 'ireland',
  '470': 'malta', '196': 'cyprus', '492': 'monaco', '438': 'liechtenstein',
  '248': 'aland', '234': 'faroe', '352': 'iceland', '528': 'netherlands', '056': 'belgium',
  '442': 'luxembourg', '756': 'switzerland', '040': 'austria', '020': 'andorra',
};

function getCountryFill(country: Country | undefined, isSelected: boolean): string {
  if (isSelected) return '#00e676';
  if (!country) return '#111a11';

  if (country.isContested) return '#5a3a00';

  switch (country.alignment) {
    case 'nato':
    case 'western':
      return '#0d3b6e';
    case 'warsaw':
    case 'communist':
      return '#6e0d0d';
    case 'nonaligned':
      return '#1e3a1e';
    default:
      return '#111a11';
  }
}

function getHoverFill(country: Country | undefined, isSelected: boolean): string {
  if (isSelected) return '#00e676';
  if (!country) return '#1a2a1a';

  switch (country.alignment) {
    case 'nato':
    case 'western':
      return '#1a5a9e';
    case 'warsaw':
    case 'communist':
      return '#9e1a1a';
    case 'nonaligned':
      return '#2e5a2e';
    default:
      return '#1a2a1a';
  }
}

/**
 * Compute a fill colour for the China polygon during the civil war.
 * The colour shifts from nationalist blue (0 communist provinces) through
 * contested brown (balanced) to communist red (all provinces).
 * This gives an at-a-glance indication of who is winning the war.
 */
function getChinaWarFill(communistCount: number, total: number, isSelected: boolean): string {
  if (isSelected) return '#00e676';
  const ratio = communistCount / Math.max(1, total); // 0 = nationalist, 1 = communist
  if (ratio >= 0.7) return '#7a1a0a';   // communists dominating — deep red-brown
  if (ratio >= 0.5) return '#7a3a10';   // communists slightly ahead — orange-red-brown
  if (ratio >= 0.4) return '#5a3a00';   // roughly balanced — contested brown
  if (ratio >= 0.2) return '#1a3a5a';   // nationalists slightly ahead — blue-brown
  return '#0d3060';                      // nationalists dominating — deep blue
}

function getChinaWarHoverFill(communistCount: number, total: number): string {
  const ratio = communistCount / Math.max(1, total);
  if (ratio >= 0.5) return '#9e2a1a';
  if (ratio >= 0.4) return '#7a5a20';
  return '#1a4a7a';
}

interface WorldMapProps {
  countries: Record<string, Country>;
  selectedCountryId: string | null;
  onCountryClick: (id: string) => void;
  chinaCivilWar?: ChinaCivilWar;
  units?: Record<string, Unit>;
  states?: Record<string, State>;
  playerFaction?: 'usa' | 'ussr' | null;
  selectedUnitId?: string | null;
}

// ISO codes that belong to the USSR
const USSR_ISOS = new Set(['643','398','860','795','417','762','804','112','498','051','031','268','440','428','233']);

// ISO codes that belong to Yugoslavia (successor-state polygons in world-atlas)
const YUGO_ISOS = new Set(['688','191','070','705','499','807']);

// ISO codes that belong to Czechoslovakia (Czechia + Slovakia in world-atlas)
const CZECHO_ISOS = new Set(['203','703']);

// ---- Unit position computation (ring layout so markers never overlap) ----
const RING_STEP = 5;        // degrees between rings — wide enough to read each symbol
const PER_RING = 6;         // units per ring
const RING_OFFSET = 0.4;    // angular offset so ring 2 sits between ring 1's gaps

function computeUnitPositions(
  units: Record<string, Unit>,
  states: Record<string, State>
): Record<string, { lon: number; lat: number }> {
  type Entry = { unitId: string; baseLon: number; baseLat: number };
  const byCountry: Record<string, Entry[]> = {};
  Object.values(units).forEach(unit => {
    const st = states[unit.stateId];
    if (!st) return;
    const arr = byCountry[unit.countryId] || (byCountry[unit.countryId] = []);
    arr.push({ unitId: unit.id, baseLon: st.lon, baseLat: st.lat });
  });

  const result: Record<string, { lon: number; lat: number }> = {};
  Object.values(byCountry).forEach(arr => {
    arr.forEach((e, i) => {
      if (i === 0) {
        result[e.unitId] = { lon: e.baseLon, lat: e.baseLat };
      } else {
        const ringIdx = Math.ceil(i / PER_RING) - 1;
        const inRing = (i - 1) % PER_RING;
        const ringCount = Math.min(PER_RING, arr.length - 1 - ringIdx * PER_RING);
        const radius = (ringIdx + 1) * RING_STEP;
        const angle = (inRing / ringCount) * Math.PI * 2 + (ringIdx % 2) * RING_OFFSET;
        result[e.unitId] = {
          lon: e.baseLon + radius * Math.cos(angle),
          lat: e.baseLat + radius * Math.sin(angle),
        };
      }
    });
  });
  return result;
}

// ---- Smooth animation hook ----
// Eases each unit's on-screen position toward its target over `duration` ms
// using requestAnimationFrame, so units visibly slide to their new country.
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export interface MoveTrail {
  unitId: string;
  from: { lon: number; lat: number };
  to: { lon: number; lat: number };
  progress: number; // 0 = just started, 1 = arrived
}

function useAnimatedPositions(
  targets: Record<string, { lon: number; lat: number }>,
  duration: number
): { positions: Record<string, { lon: number; lat: number }>; trails: MoveTrail[] } {
  const [current, setCurrent] = useState<Record<string, { lon: number; lat: number }>>(() => ({ ...targets }));
  const [trails, setTrails] = useState<MoveTrail[]>([]);
  const currentRef = useRef(current);
  const startRef = useRef<Record<string, { lon: number; lat: number }>>({});
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const targetsRef = useRef(targets);

  useEffect(() => { targetsRef.current = targets; });

  const tick = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    const t = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(t);

    const next: Record<string, { lon: number; lat: number }> = {};
    const activeTrails: MoveTrail[] = [];
    const tgts = targetsRef.current;
    const starts = startRef.current;
    for (const id of Object.keys(tgts)) {
      const start = starts[id];
      const target = tgts[id];
      if (!start) {
        next[id] = target;
      } else {
        next[id] = {
          lon: start.lon + (target.lon - start.lon) * eased,
          lat: start.lat + (target.lat - start.lat) * eased,
        };
        // Only show a trail if the unit actually moved a meaningful distance
        const dist = Math.hypot(target.lon - start.lon, target.lat - start.lat);
        if (dist > 0.5 && t < 1) {
          activeTrails.push({ unitId: id, from: start, to: target, progress: t });
        }
      }
    }
    currentRef.current = next;
    setCurrent(next);
    setTrails(activeTrails);

    if (t < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  }, [duration]);

  useEffect(() => {
    startRef.current = {};
    const cur = currentRef.current;
    for (const id of Object.keys(targets)) {
      startRef.current[id] = cur[id] ? { ...cur[id] } : { ...targets[id] };
    }
    startTimeRef.current = performance.now();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targets, tick]);

  return { positions: current, trails };
}

// NATO APP-6 standard symbols drawn as SVG. The frame shape distinguishes
// friendly (rectangle) from hostile (diamond); the inner icon identifies the unit type.
function renderNatoIcon(type: UnitType, color: string) {
  const ic = 0.5; // icon half-size
  switch (type) {
    case 'infantry':
      // Two crossed lines (X) — NATO infantry symbol
      return (
        <g stroke={color} strokeWidth={0.18} fill="none" strokeLinecap="round">
          <line x1={-ic} y1={-ic} x2={ic} y2={ic} />
          <line x1={-ic} y1={ic} x2={ic} y2={-ic} />
        </g>
      );
    case 'armor':
      // Ellipse — NATO armor/armored symbol
      return <ellipse cx={0} cy={0} rx={ic} ry={ic * 0.7} fill="none" stroke={color} strokeWidth={0.18} />;
    case 'air':
      // Curved arc (simplified aircraft wing arc) — NATO air symbol
      return (
        <path
          d={`M ${-ic} ${ic * 0.3} Q 0 ${-ic * 1.2} ${ic} ${ic * 0.3}`}
          fill="none"
          stroke={color}
          strokeWidth={0.18}
          strokeLinecap="round"
        />
      );
    case 'navy':
      // Wavy line — NATO naval symbol
      return (
        <path
          d={`M ${-ic} 0 Q ${-ic / 2} ${-ic * 0.6} 0 0 T ${ic} 0`}
          fill="none"
          stroke={color}
          strokeWidth={0.18}
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

export function WorldMap({ countries, selectedCountryId, onCountryClick, chinaCivilWar, units, states, playerFaction, selectedUnitId }: WorldMapProps) {
  /** True while the civil war is still active (provinces are split between factions) */
  const warOngoing = !!chinaCivilWar && !chinaCivilWar.resolved;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ussrOutline, setUssrOutline] = useState<GeoJSON.Feature | null>(null);
  const [yugoOutline, setYugoOutline] = useState<GeoJSON.Feature | null>(null);
  const [czecOutline, setCzecOutline] = useState<GeoJSON.Feature | null>(null);

  // Fetch the topojson once, merge all USSR republic and Yugoslav successor-state
  // polygons into single outer-boundary features for clean border rendering.
  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then((topo: Topology) => {
        const countriesObj = topo.objects.countries as GeometryCollection;

        const ussrGeoms = countriesObj.geometries.filter(
          (g: { id?: string | number }) => USSR_ISOS.has(String(g.id))
        ) as GeometryCollection['geometries'];
        const mergedUssr = merge(topo, ussrGeoms as Parameters<typeof merge>[1]);
        setUssrOutline({ type: 'Feature', geometry: mergedUssr, properties: {} });

        // Kosovo has no numeric id in world-atlas — match it by name too
        const yugoGeoms = countriesObj.geometries.filter(
          (g: { id?: string | number; properties?: { name?: string } }) =>
            YUGO_ISOS.has(String(g.id)) || g.properties?.name === 'Kosovo'
        ) as GeometryCollection['geometries'];
        const mergedYugo = merge(topo, yugoGeoms as Parameters<typeof merge>[1]);
        setYugoOutline({ type: 'Feature', geometry: mergedYugo, properties: {} });

        const czecGeoms = countriesObj.geometries.filter(
          (g: { id?: string | number }) => CZECHO_ISOS.has(String(g.id))
        ) as GeometryCollection['geometries'];
        const mergedCzec = merge(topo, czecGeoms as Parameters<typeof merge>[1]);
        setCzecOutline({ type: 'Feature', geometry: mergedCzec, properties: {} });
      })
      .catch(() => null);
  }, []);

  // Compute target positions for all units (ring layout) and animate markers
  // toward those targets so units visibly slide to their new country when moved.
  const targetPositions = useMemo(
    () => (units && states ? computeUnitPositions(units, states) : {}),
    [units, states]
  );
  const { positions: animatedPositions, trails } = useAnimatedPositions(targetPositions, 1200);

  return (
    <div className="w-full h-full" style={{ background: '#060c06' }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 153, center: [10, 10] }}
        width={1000}
        height={520}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                // Kosovo's polygon in the world-atlas dataset has no numeric id,
                // so it is matched by name and folded into Yugoslavia.
                const geoName = (geo.properties?.name as string | undefined) ?? '';
                const gameId = ISO_TO_GAME_ID[geo.id] ?? (geoName === 'Kosovo' ? 'yugoslavia' : null);

                const country = gameId ? countries[gameId] : undefined;
                const isSelected = selectedCountryId === gameId;
                const isHovered = hoveredId === gameId;

                // During the civil war China's colour shifts based on who is winning,
                // giving an at-a-glance signal without needing province overlays.
                let fill: string;
                let hoverFill: string;
                if (warOngoing && gameId === 'china' && chinaCivilWar) {
                  const total = chinaCivilWar.communistStates.length + chinaCivilWar.nationalistStates.length;
                  fill = getChinaWarFill(chinaCivilWar.communistStates.length, total, isSelected);
                  hoverFill = getChinaWarHoverFill(chinaCivilWar.communistStates.length, total);
                } else {
                  fill = getCountryFill(country, isSelected);
                  hoverFill = getHoverFill(country, isSelected);
                }
                // USSR and Yugoslavia are drawn from many sub-polygons. Match
                // stroke to fill to hide internal borders; the merged outline
                // pass below draws the clean external boundary.
                const isUnifiedNation = gameId === 'ussr' || gameId === 'yugoslavia' || gameId === 'czechoslovakia';
                const stroke = isUnifiedNation ? fill : '#0a140a';
                const strokeWidth = 0.4;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHovered && !isSelected ? hoverFill : fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    onClick={() => {
                      if (gameId) onCountryClick(gameId);
                    }}
                    onMouseEnter={() => {
                      if (gameId) setHoveredId(gameId);
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', cursor: country ? 'pointer' : 'default' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* USSR outer border — a single merged polygon so only the external
               boundary is stroked, with no internal republic lines. */}
          {ussrOutline && (
            <Geographies geography={{ type: 'FeatureCollection', features: [ussrOutline] }}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key="ussr-outline"
                    geography={geo}
                    fill="none"
                    stroke="#0a140a"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none', pointerEvents: 'none' },
                      hover: { outline: 'none', pointerEvents: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
          )}

          {/* Yugoslavia outer border — merged outer boundary only, no internal republic lines */}
          {yugoOutline && (
            <Geographies geography={{ type: 'FeatureCollection', features: [yugoOutline] }}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key="yugo-outline"
                    geography={geo}
                    fill="none"
                    stroke="#0a140a"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none', pointerEvents: 'none' },
                      hover: { outline: 'none', pointerEvents: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
          )}

          {/* Czechoslovakia outer border — merged so no internal Czechia/Slovakia seam */}
          {czecOutline && (
            <Geographies geography={{ type: 'FeatureCollection', features: [czecOutline] }}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key="czec-outline"
                    geography={geo}
                    fill="none"
                    stroke="#0a140a"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none', pointerEvents: 'none' },
                      hover: { outline: 'none', pointerEvents: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
          )}

          {/* East Germany overlay — the base map only has a unified Germany */}
          <Geographies geography={EAST_GERMANY_GEO}>
            {({ geographies }) =>
              geographies.map(geo => {
                const country = countries['east_germany'];
                const isSelected = selectedCountryId === 'east_germany';
                const isHovered = hoveredId === 'east_germany';
                const fill = getCountryFill(country, isSelected);
                const hoverFill = getHoverFill(country, isSelected);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHovered && !isSelected ? hoverFill : fill}
                    stroke="#0a140a"
                    strokeWidth={0.4}
                    onClick={() => onCountryClick('east_germany')}
                    onMouseEnter={() => setHoveredId('east_germany')}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Country labels for major powers */}
          {[
            { id: 'usa', lon: -97, lat: 38, label: 'USA' },
            { id: 'canada', lon: -96, lat: 60, label: 'CAN' },
            { id: 'ussr', lon: 60, lat: 60, label: 'USSR' },
            { id: 'china', lon: 104, lat: 35, label: 'CHN' },
            { id: 'brazil', lon: -52, lat: -10, label: 'BRA' },
            { id: 'india', lon: 79, lat: 22, label: 'IND' },
            { id: 'australia', lon: 134, lat: -27, label: 'AUS' },
          ].map(({ id, lon, lat, label }) => {
            const country = countries[id];
            if (!country) return null;
            return (
              <Marker key={id} coordinates={[lon, lat] as [number, number]}>
                <text
                  textAnchor="middle"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '7px',
                    fill: selectedCountryId === id ? '#00e676' : '#8aaa8a',
                    pointerEvents: 'none',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                  }}
                >
                  {label}
                </text>
              </Marker>
            );
          })}

          {/* Movement trails — dashed line from origin to destination that fades as the unit travels */}
          {trails.map(trail => {
            const fade = 1 - trail.progress;
            const steps = 8;
            const dots = Array.from({ length: steps }, (_, i) => {
              const t = i / (steps - 1);
              return {
                lon: trail.from.lon + (trail.to.lon - trail.from.lon) * t,
                lat: trail.from.lat + (trail.to.lat - trail.from.lat) * t,
              };
            });
            return dots.map((dot, i) => (
              <Marker key={`trail-${trail.unitId}-${i}`} coordinates={[dot.lon, dot.lat] as [number, number]}>
                <circle r={0.25} fill="#ffd700" opacity={fade * 0.6 * (1 - i / steps * 0.3)} />
              </Marker>
            ));
          })}
          {trails.map(trail => {
            const fade = 1 - trail.progress;
            return (
              <Marker key={`trail-origin-${trail.unitId}`} coordinates={[trail.from.lon, trail.from.lat] as [number, number]}>
                <circle r={1.2} fill="none" stroke="#ffd700" strokeWidth={0.2} opacity={fade * 0.7} strokeDasharray="0.4 0.4" />
              </Marker>
            );
          })}

          {/* Unit markers with NATO APP-6 symbols — animated ring layout */}
          {units && states && Object.values(units).map(unit => {
            const pos = animatedPositions[unit.id];
            if (!pos) return null;
            const friendly = unit.owner === 'usa' || unit.owner === playerFaction;
            const frameColor = unit.owner === 'usa' ? '#3a8fd8' : '#d83a3a';
            const frameFill = unit.owner === 'usa' ? 'rgba(58,143,216,0.25)' : 'rgba(216,58,58,0.25)';
            const isSelected = selectedUnitId === unit.id;
            const s = 0.875;
            const frameType = friendly ? 'rect' : 'diamond';
            return (
              <Marker key={unit.id} coordinates={[pos.lon, pos.lat] as [number, number]}>
                {/* Selection ring */}
                {isSelected && (
                  <circle r={s + 0.625} fill="none" stroke="#00e676" strokeWidth={0.25} opacity={0.9} />
                )}
                {/* NATO APP-6 frame: rectangle for friendly, diamond for hostile */}
                {frameType === 'rect' ? (
                  <rect x={-s} y={-s} width={s * 2} height={s * 2} fill={frameFill} stroke={frameColor} strokeWidth={isSelected ? 0.25 : 0.15} />
                ) : (
                  <polygon points={`0,${-s * 1.4} ${s * 1.4},0 0,${s * 1.4} ${-s * 1.4},0`} fill={frameFill} stroke={frameColor} strokeWidth={isSelected ? 0.25 : 0.15} />
                )}
                {/* NATO APP-6 icon inside frame */}
                {renderNatoIcon(unit.type, frameColor)}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div
        className="absolute bottom-2 left-2 flex gap-3 text-xs font-mono"
        style={{ fontSize: '10px' }}
      >
        <span className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, background: '#0d3b6e' }} />
          <span style={{ color: '#4a8abf' }}>NATO</span>
        </span>
        <span className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, background: '#6e0d0d' }} />
          <span style={{ color: '#bf4a4a' }}>Warsaw</span>
        </span>
        <span className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, background: '#5a3a00' }} />
          <span style={{ color: '#bf8a30' }}>Contested</span>
        </span>
        <span className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, background: '#1e3a1e' }} />
          <span style={{ color: '#4a8a4a' }}>Non-Aligned</span>
        </span>
      </div>
    </div>
  );
}
