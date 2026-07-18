// Stylized-but-geographic route map. Stop coordinates and dates come from
// the almanac (single source of truth); this file adds only presentation:
// projection, labels, borders, and route curves. The equirectangular
// projection is cos-corrected so relative positions read honestly.

import { stopAlmanacs } from "./almanac-data";

type StopView = {
  id: string;
  label: string;
  labelSide: "left" | "right";
};

const stopViews: StopView[] = [
  { id: "lubbock", label: "Lubbock", labelSide: "right" },
  { id: "taos", label: "Taos", labelSide: "right" },
  { id: "santa-fe", label: "Santa Fe", labelSide: "right" },
  { id: "albuquerque", label: "Albuquerque", labelSide: "left" },
  { id: "palo-duro", label: "Palo Duro", labelSide: "right" },
];

const amarillo = { lat: 35.222, lon: -101.8313 };

function project(lon: number, lat: number) {
  return { x: (lon + 109.7) * 60, y: (37.35 - lat) * 73 };
}

const stops = stopViews.flatMap((view) => {
  const almanac = stopAlmanacs.find((stop) => stop.id === view.id);
  if (!almanac) return [];
  return [
    {
      ...view,
      sub: almanac.nights.replace(/^Night of /, ""),
      point: project(almanac.lon, almanac.lat),
    },
  ];
});

const P = Object.fromEntries(stops.map((stop) => [stop.id, stop.point]));
const AMA = project(amarillo.lon, amarillo.lat);

export default function RouteMap({ currentStopId = null }: { currentStopId?: string | null }) {
  return (
    <svg
      className="route-map"
      viewBox="0 0 648 440"
      role="img"
      aria-label="Route map: home to Lubbock, Taos, Santa Fe, Albuquerque, Palo Duro Canyon, and home"
    >
      {/* State borders (simplified): NM box, OK panhandle south edge, TX panhandle east edge */}
      <g className="map-borders">
        <path d="M 39 25.6 L 582 25.6" />
        <path d="M 39 25.6 L 39 390.6 L 402 390.6" />
        <path d="M 402 390.6 L 402 25.6" />
        <path d="M 402 62 L 582 62 L 582 204" />
      </g>

      <g className="map-state-labels">
        <text x="90" y="350">New Mexico</text>
        <text x="470" y="350">Texas</text>
        <text x="475" y="48">Oklahoma</text>
      </g>

      {/* Dashed home legs in and out (home city stays route-dependent) */}
      <g className="map-home-legs">
        <path d={`M 648 400 Q 560 330 ${P.lubbock.x} ${P.lubbock.y}`} />
        <path d={`M ${P["palo-duro"].x} ${P["palo-duro"].y} Q 590 260 648 300`} />
        <text x="614" y="386" textAnchor="end">home</text>
      </g>

      {/* Route legs in trip order */}
      <g className="map-route">
        <path d={`M ${P.lubbock.x} ${P.lubbock.y} Q 330 160 ${P.taos.x} ${P.taos.y}`} />
        <path d={`M ${P.taos.x} ${P.taos.y} Q 240 95 ${P["santa-fe"].x} ${P["santa-fe"].y}`} />
        <path d={`M ${P["santa-fe"].x} ${P["santa-fe"].y} L ${P.albuquerque.x} ${P.albuquerque.y}`} />
        <path d={`M ${P.albuquerque.x} ${P.albuquerque.y} Q 320 148 ${AMA.x} ${AMA.y} L ${P["palo-duro"].x} ${P["palo-duro"].y}`} />
      </g>

      {/* Amarillo waypoint (lunch + takeout stop) */}
      <g className="map-waypoint">
        <circle cx={AMA.x} cy={AMA.y} r="4" />
        <text x={AMA.x - 10} y={AMA.y - 6} textAnchor="end">
          Amarillo
        </text>
      </g>

      {/* Numbered stops */}
      {stops.map((stop, index) => {
        const { point } = stop;
        const anchor = stop.labelSide === "right" ? "start" : "end";
        const dx = stop.labelSide === "right" ? 18 : -18;
        const isCurrent = currentStopId === stop.id;
        return (
          <g className={`map-stop${isCurrent ? " is-current" : ""}`} key={stop.id}>
            {isCurrent && <circle className="map-stop-ring" cx={point.x} cy={point.y} r="17" />}
            <circle cx={point.x} cy={point.y} r="11" />
            {/* Numbers match the route list below the map (1 and 7 are home). */}
            <text className="map-stop-number" x={point.x} y={point.y + 4} textAnchor="middle">
              {index + 2}
            </text>
            <text className="map-stop-name" x={point.x + dx} y={point.y} textAnchor={anchor}>
              {stop.label}
            </text>
            <text className="map-stop-sub" x={point.x + dx} y={point.y + 14} textAnchor={anchor}>
              {stop.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
