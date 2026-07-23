"use client";

import {
  AlertTriangle,
  BedDouble,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Coffee,
  Compass,
  Droplets,
  ExternalLink,
  Gauge,
  ListChecks,
  MapPin,
  MapPinned,
  Minus,
  MoonStar,
  Navigation,
  Plus,
  RefreshCw,
  Route,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Trash2,
  Utensils,
  Wallet,
  WifiOff,
} from "lucide-react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import type { DocumentReference, DocumentData } from "firebase/firestore";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  areas,
  checklistGroups,
  liveLinks,
  places,
  routeStops,
  tripDays,
  type Area,
  type EventKind,
  type Place,
  type PlaceCategory,
} from "./trip-data";
import RouteMap from "./RouteMap";
import {
  dayAlmanacs,
  forecastWindowNote,
  moonNights,
  perseids,
  stopAlmanacs,
  stopTripDates,
} from "./almanac-data";
import {
  describeWeatherCode,
  loadAlerts,
  loadForecasts,
  type StopAlerts,
  type StopForecast,
} from "./weather";

type TabId = "plan" | "explore" | "weather" | "checklist" | "info";
type SyncStatus = "connecting" | "saving" | "synced" | "offline";
type CustomTodo = { id: string; text: string };
type SharedTripState = { checked: string[]; customTodos: CustomTodo[] };
type TripClock = { daysUntil: number; dayIndex: number; now: number };

const EMPTY_STATE: SharedTripState = { checked: [], customTodos: [] };
const STORAGE_KEY = "harsh-trip-2026-state-v1";
const BOARD_PATH = ["tripBoards", "new-mexico-2026"] as const;
// Trip days roll over at 3 AM Central / 2 AM Mountain, not midnight, so late
// nights—including the 2–5 AM Perseid window—stay with the day they belong
// to, and "Today" doesn't flip an hour early during the Mountain Time leg.
const TRIP_START = new Date("2026-08-08T03:00:00-05:00").getTime();
const DAY_MS = 86_400_000;
const TRIP_MILES = 1952;

const tabs: { id: TabId; label: string; shortLabel: string; icon: typeof CalendarDays }[] = [
  { id: "plan", label: "Schedule", shortLabel: "Schedule", icon: CalendarDays },
  { id: "explore", label: "Food & attractions", shortLabel: "Food", icon: MapPinned },
  { id: "weather", label: "Weather & sky", shortLabel: "Weather", icon: CloudSun },
  { id: "checklist", label: "Checklist", shortLabel: "Checklist", icon: ListChecks },
  { id: "info", label: "Trip info", shortLabel: "Info", icon: Route },
];

const forecastIcons = {
  clear: Sun,
  cloud: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
} as const;

function tripDateLabel(date: string) {
  const dayId = dayAlmanacs.find((entry) => entry.date === date)?.dayId;
  const day = tripDays.find((tripDay) => tripDay.id === dayId);
  return day ? `${day.weekday.slice(0, 3)} ${Number(day.shortDate)}` : String(Number(date.slice(8)));
}

function cleanSharedState(value: unknown): SharedTripState {
  if (!value || typeof value !== "object") return EMPTY_STATE;

  const input = value as Partial<SharedTripState>;
  const checked = Array.isArray(input.checked)
    ? input.checked.filter((item): item is string => typeof item === "string").slice(0, 200)
    : [];
  const customTodos = Array.isArray(input.customTodos)
    ? input.customTodos
        .filter(
          (item): item is CustomTodo =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as CustomTodo).id === "string" &&
            typeof (item as CustomTodo).text === "string",
        )
        .map((item) => ({ id: item.id.slice(0, 80), text: item.text.trim().slice(0, 100) }))
        .filter((item) => item.text.length > 0)
        .slice(0, 30)
    : [];

  return { checked: [...new Set(checked)], customTodos };
}

function stateKey(value: SharedTripState) {
  return JSON.stringify({
    checked: [...value.checked].sort(),
    customTodos: value.customTodos,
  });
}

function EventIcon({ kind }: { kind: EventKind }) {
  const icons = {
    drive: Navigation,
    food: Utensils,
    stay: BedDouble,
    explore: Compass,
    rest: Coffee,
    alert: AlertTriangle,
  };
  const Icon = icons[kind];
  return <Icon aria-hidden="true" />;
}

function SyncPill({ status }: { status: SyncStatus }) {
  const copy = {
    connecting: "Connecting",
    saving: "Saving",
    synced: "Synced",
    offline: "Offline · saved on this device",
  };
  const Icon = status === "offline" ? WifiOff : status === "synced" ? CheckCircle2 : RefreshCw;

  return (
    <div className={`sync-pill sync-${status}`} aria-live="polite">
      <Icon aria-hidden="true" />
      <span>{copy[status]}</span>
    </div>
  );
}

function CheckButton({
  id,
  checked,
  onToggle,
  label,
}: {
  id: string;
  checked: boolean;
  onToggle: (id: string) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`check-button ${checked ? "is-checked" : ""}`}
      onClick={() => onToggle(id)}
      aria-label={`${checked ? "Mark incomplete" : "Mark complete"}: ${label}`}
      aria-pressed={checked}
    >
      {checked ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
    </button>
  );
}

function PlaceCard({ place }: { place: Place }) {
  const meta = [place.city, place.hours, place.cost, place.duration].filter(Boolean).join(" · ");
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, ${place.city}`,
  )}`;

  return (
    <article className={`place-card${place.closed ? " is-closed" : ""}`}>
      <div className="place-top">
        <span className={`type-tag tag-${place.category}`}>
          {place.category === "food" ? <Utensils aria-hidden="true" /> : <Compass aria-hidden="true" />}
          {place.tag}
        </span>
        <small>{place.planned}</small>
      </div>
      <h3>{place.name}</h3>
      {meta && <p className="place-meta">{meta}</p>}
      {place.closed && (
        <p className="closed-note">
          <AlertTriangle aria-hidden="true" />
          <span>{place.closed}</span>
        </p>
      )}
      {place.dishes && (
        <ul className="dish-list">
          {place.dishes.map((dish) => (
            <li key={dish}>{dish}</li>
          ))}
        </ul>
      )}
      <p className="place-note">{place.note}</p>
      <div className="place-foot">
        {place.mustDo && <span className="must-badge">Don’t miss</span>}
        {!place.closed && (
          <a
            className="card-link"
            href={mapHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${place.name} in Google Maps`}
          >
            <MapPin aria-hidden="true" /> Map
          </a>
        )}
        {place.href && (
          <a className="card-link" href={place.href} target="_blank" rel="noreferrer">
            Official info <ExternalLink aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function TripPlanner() {
  const [activeTab, setActiveTab] = useState<TabId>("plan");
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayThirteenMode, setDayThirteenMode] = useState<"relaxed" | "falls">("relaxed");
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<PlaceCategory | "all">("all");
  const [areaFilter, setAreaFilter] = useState<Area | "all">("all");
  const [dayFilter, setDayFilter] = useState<string>("all");
  const [mustOnly, setMustOnly] = useState(false);
  const [shared, setShared] = useState<SharedTripState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connecting");
  const [customTodoText, setCustomTodoText] = useState("");
  const [clock, setClock] = useState<TripClock | null>(null);
  const [forecasts, setForecasts] = useState<Record<string, StopForecast>>({});
  const [alerts, setAlerts] = useState<Record<string, StopAlerts>>({});
  const [mpg, setMpg] = useState(28);
  const [gasPrice, setGasPrice] = useState(3.15);
  const [travelers, setTravelers] = useState(4);
  const [lodgingNight, setLodgingNight] = useState(150);
  const [foodPerDay, setFoodPerDay] = useState(30);
  const [ticketsBudget, setTicketsBudget] = useState(350);
  const [homeRoute, setHomeRoute] = useState<"abilene" | "wichita">("abilene");
  const stateRef = useRef(shared);
  const boardRef = useRef<DocumentReference<DocumentData> | null>(null);
  const lastRemoteKey = useRef("");
  const dayPickerRef = useRef<HTMLDivElement | null>(null);

  // Keep the selected day chip visible in the scrollable picker (phones).
  useEffect(() => {
    const container = dayPickerRef.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;
    const active = container.querySelector<HTMLButtonElement>("button.active");
    if (!active) return;
    const target = active.offsetLeft - (container.clientWidth - active.offsetWidth) / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [selectedDay]);

  useEffect(() => {
    let localState = EMPTY_STATE;
    try {
      const localValue = window.localStorage.getItem(STORAGE_KEY);
      if (localValue) localState = cleanSharedState(JSON.parse(localValue));
    } catch {
      // Firestore's cache still provides an offline path when localStorage is unavailable.
    }
    // During the trip, open straight to today's plan.
    const todayIndex = Math.floor((Date.now() - TRIP_START) / DAY_MS);
    queueMicrotask(() => {
      setShared(localState);
      setHydrated(true);
      if (todayIndex >= 0 && todayIndex < tripDays.length) setSelectedDay(todayIndex);
    });

    const updateClock = () => {
      const now = Date.now();
      setClock({
        daysUntil: Math.max(0, Math.ceil((TRIP_START - now) / DAY_MS)),
        dayIndex: Math.floor((now - TRIP_START) / DAY_MS),
        now,
      });
    };
    updateClock();

    const timer = window.setInterval(updateClock, 3_600_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    stateRef.current = shared;
  }, [shared]);

  // Live forecasts and NWS alerts are progressive enhancement: cached in
  // localStorage, quiet on failure, with almanac normals as the fallback.
  // Skip fetches that cannot produce anything useful: forecasts before the
  // trip enters Open-Meteo's 16-day window, and everything once the trip is
  // more than a week in the past.
  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    const tripEnd = TRIP_START + tripDays.length * DAY_MS;
    if (now > tripEnd + 7 * DAY_MS) return;

    if (now > TRIP_START - 16 * DAY_MS) {
      void loadForecasts(stopAlmanacs).then((data) => {
        if (!cancelled) setForecasts(data);
      });
    }
    void loadAlerts(stopAlmanacs).then((data) => {
      if (!cancelled) setAlerts(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void import("./firebase").then(({ tripDb }) => {
      if (cancelled) return;
      const board = doc(tripDb, ...BOARD_PATH);
      boardRef.current = board;
      unsubscribe = onSnapshot(
        board,
        { includeMetadataChanges: true },
        (snapshot) => {
          if (!snapshot.exists()) {
            if (!snapshot.metadata.fromCache) {
              lastRemoteKey.current = "";
              setRemoteReady(true);
            }
            setSyncStatus(snapshot.metadata.fromCache ? "offline" : "saving");
            return;
          }

          const remote = cleanSharedState(snapshot.data());
          const remoteKey = stateKey(remote);
          lastRemoteKey.current = remoteKey;
          if (remoteKey !== stateKey(stateRef.current)) setShared(remote);
          setRemoteReady(true);
          setSyncStatus(
            snapshot.metadata.hasPendingWrites
              ? "saving"
              : snapshot.metadata.fromCache
                ? "offline"
                : "synced",
          );
        },
        () => {
          setRemoteReady(false);
          setSyncStatus("offline");
        },
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shared));
    } catch {
      // Firebase persistence remains the primary source of truth.
    }

    const board = boardRef.current;
    const currentKey = stateKey(shared);
    if (!remoteReady || !board || currentKey === lastRemoteKey.current) return;

    setSyncStatus("saving");
    const timer = window.setTimeout(() => {
      void setDoc(board, {
        checked: shared.checked,
        customTodos: shared.customTodos,
        clientUpdatedAt: Date.now(),
        updatedAt: serverTimestamp(),
        version: 1,
      }).catch(() => setSyncStatus("offline"));
    }, 550);

    return () => window.clearTimeout(timer);
  }, [hydrated, remoteReady, shared]);

  const toggleChecked = (id: string) => {
    setShared((current) => ({
      ...current,
      checked: current.checked.includes(id)
        ? current.checked.filter((item) => item !== id)
        : [...current.checked, id],
    }));
  };

  const addCustomTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = customTodoText.trim().slice(0, 100);
    if (!text || shared.customTodos.length >= 30) return;
    const id = `custom-${crypto.randomUUID()}`;
    setShared((current) => ({ ...current, customTodos: [...current.customTodos, { id, text }] }));
    setCustomTodoText("");
  };

  const removeCustomTodo = (id: string) => {
    setShared((current) => ({
      checked: current.checked.filter((item) => item !== id),
      customTodos: current.customTodos.filter((item) => item.id !== id),
    }));
  };

  const allChecklistItems = checklistGroups.flatMap((group) => group.items);
  const checklistTotal = allChecklistItems.length + shared.customTodos.length;
  const checklistDone = [...allChecklistItems, ...shared.customTodos].filter((item) =>
    shared.checked.includes(item.id),
  ).length;
  const progress = checklistTotal ? Math.round((checklistDone / checklistTotal) * 100) : 0;
  const activeDay = tripDays[selectedDay];
  const activeEvents = activeDay.events.filter(
    (event) => !event.mode || event.mode === dayThirteenMode,
  );
  const activeAlmanac = dayAlmanacs.find((entry) => entry.dayId === activeDay.id);
  const activeStop = activeAlmanac
    ? stopAlmanacs.find((stop) => stop.id === activeAlmanac.stopId)
    : undefined;
  const activeForecast = activeAlmanac
    ? forecasts[activeAlmanac.stopId]?.days.find((day) => day.date === activeAlmanac.date)
    : undefined;
  // NWS alerts describe right now, so they belong only on today's and
  // tomorrow's cards during the trip—not on a card three weeks out.
  const dayAlertsRelevant =
    clock !== null &&
    clock.dayIndex >= 0 &&
    selectedDay >= clock.dayIndex &&
    selectedDay - clock.dayIndex <= 1;
  const activeAlerts =
    dayAlertsRelevant && activeAlmanac ? (alerts[activeAlmanac.stopId]?.alerts ?? []) : [];

  const tripDateCoverage = stopAlmanacs.flatMap((stop) =>
    (stopTripDates[stop.id] ?? []).map((date) =>
      Boolean(forecasts[stop.id]?.days.some((day) => day.date === date)),
    ),
  );
  const coveredDates = tripDateCoverage.filter(Boolean).length;
  const forecastCoverage =
    coveredDates === 0 ? "none" : coveredDates === tripDateCoverage.length ? "all" : "partial";

  const alertRows = stopAlmanacs.flatMap((stop) =>
    (alerts[stop.id]?.alerts ?? []).map((alert) => ({ stop, alert })),
  );
  const alertsCheckedAt = Object.values(alerts).reduce(
    (latest, stop) => Math.max(latest, stop.fetchedAt),
    0,
  );
  // Where the group is right now, from the same day table the schedule uses.
  const currentStopId =
    clock && clock.dayIndex >= 0 && clock.dayIndex < tripDays.length
      ? (dayAlmanacs.find((entry) => entry.dayId === tripDays[clock.dayIndex].id)?.stopId ?? null)
      : null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPlaces = places.filter((place) => {
    if (kindFilter !== "all" && place.category !== kindFilter) return false;
    if (areaFilter !== "all" && place.area !== areaFilter) return false;
    if (dayFilter !== "all" && !place.dayIds.includes(dayFilter)) return false;
    if (mustOnly && !place.mustDo) return false;
    if (normalizedQuery) {
      const haystack = [
        place.name,
        place.city,
        place.area,
        place.tag,
        place.note,
        place.planned,
        ...(place.dishes ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });
  const filtersActive =
    kindFilter !== "all" ||
    areaFilter !== "all" ||
    dayFilter !== "all" ||
    mustOnly ||
    normalizedQuery !== "";

  const clearFilters = () => {
    setQuery("");
    setKindFilter("all");
    setAreaFilter("all");
    setDayFilter("all");
    setMustOnly(false);
  };

  const tripNights = tripDays.length - 1;
  const fuelGallons = TRIP_MILES / Math.max(mpg, 1);
  const fuelCost = fuelGallons * Math.max(gasPrice, 0);
  const safeTravelers = Math.min(Math.max(travelers, 1), 9);
  const lodgingCost = tripNights * Math.max(lodgingNight, 0);
  const foodCost = tripDays.length * safeTravelers * Math.max(foodPerDay, 0);
  const ticketsCost = Math.max(ticketsBudget, 0);
  const budgetTotal = fuelCost + lodgingCost + foodCost + ticketsCost;
  const budgetRows = [
    {
      label: "Fuel",
      detail: `${fuelGallons.toFixed(0)} gal · ${TRIP_MILES.toLocaleString()} mi`,
      amount: fuelCost,
    },
    { label: "Lodging", detail: `${tripNights} nights`, amount: lodgingCost },
    { label: "Food", detail: `${tripDays.length} days × ${safeTravelers}`, amount: foodCost },
    { label: "Tickets + entries", detail: "opera, pueblo, parks", amount: ticketsCost },
  ];
  const homeMeal = places.find(
    (place) => place.id === (homeRoute === "abilene" ? "spicy-india" : "masala-curry"),
  );

  const tripStatus = !clock
    ? "Aug 8–15, 2026"
    : clock.dayIndex < 0
      ? `${clock.daysUntil} ${clock.daysUntil === 1 ? "day" : "days"} to departure`
      : clock.dayIndex < tripDays.length
        ? `Day ${clock.dayIndex + 1} of ${tripDays.length}`
        : "Trip complete";

  const tabKeyHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (currentIndex + direction + tabs.length) % tabs.length;
    setActiveTab(tabs[next].id);
  };

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <div className="brand">
          <strong>New Mexico road trip</strong>
          <span>Aug 8–15, 2026</span>
        </div>
        <SyncPill status={syncStatus} />
      </header>

      <section className="overview" aria-label="Trip overview">
        <div className="overview-main">
          <h1>The plan, in one place</h1>
          <p className="overview-route">
            Home → Lubbock → Taos → Santa Fe → Albuquerque → Palo Duro Canyon → home
          </p>
        </div>
        <dl className="overview-stats">
          <div>
            <dt>Driving</dt>
            <dd>1,952 mi · 30h 11m</dd>
          </div>
          <div>
            <dt>Nights</dt>
            <dd>7 booked</dd>
          </div>
          <div>
            <dt>Food</dt>
            <dd>Vegetarian · Indian first</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{tripStatus}</dd>
          </div>
        </dl>
      </section>

      <nav className="tab-bar" aria-label="Trip sections">
        <div className="tabs" role="tablist" onKeyDown={tabKeyHandler}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon aria-hidden="true" />
                <span className="tab-label-long">{tab.label}</span>
                <span className="tab-label-short">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main id="main">
        {activeTab === "plan" && (
          <section className="panel" id="plan-panel" role="tabpanel" aria-labelledby="tab-plan">
            <div className="panel-head">
              <h2>Day by day</h2>
              <p>
                Dates, destinations, mileage, and drive times are fixed. Times marked
                “suggested” are flexible.
              </p>
            </div>

            <div className="day-picker" aria-label="Choose trip day" ref={dayPickerRef}>
              {tripDays.map((day, index) => {
                const isToday = clock?.dayIndex === index;
                return (
                  <button
                    type="button"
                    key={day.id}
                    className={`${selectedDay === index ? "active" : ""}${isToday ? " is-today" : ""}`}
                    onClick={() => setSelectedDay(index)}
                    aria-current={selectedDay === index ? "date" : undefined}
                    aria-label={`${day.weekday} August ${Number(day.shortDate)} · ${day.stop}${isToday ? " · today" : ""}`}
                  >
                    <small>{isToday ? "Today" : day.weekday.slice(0, 3)}</small>
                    <strong>{day.shortDate}</strong>
                    <span>{day.stop}</span>
                  </button>
                );
              })}
            </div>

            <article className="day-card">
              <div className="day-intro">
                <div>
                  <h3>{activeDay.title}</h3>
                  <p>
                    {activeDay.weekday}, {activeDay.date}
                  </p>
                </div>
                <div className="route-chip">
                  <span>{activeDay.from}</span>
                  <ChevronRight aria-hidden="true" />
                  <strong>{activeDay.to}</strong>
                </div>
              </div>

              <div className="day-facts">
                <div>
                  <Route aria-hidden="true" />
                  <span>
                    <small>Distance</small>
                    <strong>{activeDay.miles}</strong>
                  </span>
                </div>
                <div>
                  <Gauge aria-hidden="true" />
                  <span>
                    <small>Driving</small>
                    <strong>{activeDay.wheelTime}</strong>
                  </span>
                </div>
                <div>
                  <Clock3 aria-hidden="true" />
                  <span>
                    <small>With stops</small>
                    <strong>{activeDay.realTime}</strong>
                  </span>
                </div>
                <div>
                  <BedDouble aria-hidden="true" />
                  <span>
                    <small>Tonight</small>
                    <strong>{activeDay.lodging}</strong>
                  </span>
                </div>
              </div>

              <div className="day-summary">
                <p>{activeDay.summary}</p>
                <span>
                  <Clock3 aria-hidden="true" /> {activeDay.timezone}
                </span>
              </div>

              {activeAlmanac && (
                <div className="day-conditions" aria-label="Sun and weather for this day">
                  <span>
                    <Sunrise aria-hidden="true" /> {activeAlmanac.sunrise}
                  </span>
                  {activeAlmanac.sunset && (
                    <span>
                      <Sunset aria-hidden="true" /> {activeAlmanac.sunset}
                    </span>
                  )}
                  {activeStop && !activeAlmanac.enRoute && (
                    <span>
                      <Thermometer aria-hidden="true" /> {activeStop.augHighF}° /{" "}
                      {activeStop.augLowF}° typical
                    </span>
                  )}
                  {activeAlmanac.stormWindow && (
                    <span className="cond-storm">
                      <CloudLightning aria-hidden="true" /> {activeAlmanac.stormWindow}
                    </span>
                  )}
                  {activeForecast && (
                    <span className="cond-live">
                      <CloudSun aria-hidden="true" /> Forecast:{" "}
                      {activeForecast.weatherCode !== null
                        ? `${describeWeatherCode(activeForecast.weatherCode).label.toLowerCase()} · `
                        : ""}
                      {activeForecast.highF}°/{activeForecast.lowF}°
                      {activeForecast.precipChance !== null
                        ? ` · ${activeForecast.precipChance}% rain`
                        : ""}
                    </span>
                  )}
                  {activeAlerts.map((alert) => (
                    <span className="cond-alert" key={alert.id}>
                      <ShieldAlert aria-hidden="true" /> NWS: {alert.event}
                    </span>
                  ))}
                </div>
              )}

              {activeDay.advisory && (
                <div className="advisory">
                  <ShieldAlert aria-hidden="true" />
                  <div>
                    <strong>Heads up</strong>
                    <p>{activeDay.advisory}</p>
                  </div>
                </div>
              )}

              {activeDay.id === "aug-13" && (
                <div className="mode-switch" aria-label="Choose the August 13 version">
                  <div>
                    <strong>August 13 has two versions</strong>
                    <span>Slow morning is the default after the late opera night.</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      className={dayThirteenMode === "relaxed" ? "active" : ""}
                      onClick={() => setDayThirteenMode("relaxed")}
                    >
                      Slow morning
                    </button>
                    <button
                      type="button"
                      className={dayThirteenMode === "falls" ? "active" : ""}
                      onClick={() => setDayThirteenMode("falls")}
                    >
                      Nambé Falls early start
                    </button>
                  </div>
                </div>
              )}

              <div className="timeline">
                {activeEvents.map((event) => {
                  const isChecked = shared.checked.includes(event.id);
                  return (
                    <div className={`timeline-row ${isChecked ? "completed" : ""}`} key={event.id}>
                      <div className={`timeline-icon kind-${event.kind}`}>
                        <EventIcon kind={event.kind} />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-title-row">
                          <span className="timeline-time">{event.time}</span>
                          {event.duration && <span className="timeline-duration">{event.duration}</span>}
                        </div>
                        <h4>{event.title}</h4>
                        <p>{event.detail}</p>
                        {(event.note || event.href) && (
                          <div className="timeline-meta">
                            {event.note && <em>{event.note}</em>}
                            {event.href && (
                              <a href={event.href} target="_blank" rel="noreferrer">
                                {event.linkLabel ?? "Source"} <ExternalLink aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <CheckButton
                        id={event.id}
                        checked={isChecked}
                        onToggle={toggleChecked}
                        label={event.title}
                      />
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        )}

        {activeTab === "explore" && (
          <section
            className="panel"
            id="explore-panel"
            role="tabpanel"
            aria-labelledby="tab-explore"
          >
            <div className="panel-head">
              <h2>Food & attractions</h2>
              <p>
                Everything on the trip, in one list. Every restaurant has real vegetarian
                mains—Indian first, with Mexican and Italian backups. Ask about ghee when
                avoiding dairy; confirm beans, rice, and chile are lard-free.
              </p>
            </div>

            <div className="explore-controls">
              <label className="search-box">
                <Search aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search names, dishes, cities…"
                  aria-label="Search food and attractions"
                />
              </label>

              <div className="segmented" role="group" aria-label="Filter by type">
                {(
                  [
                    { id: "all", label: "Everything" },
                    { id: "attraction", label: "Attractions" },
                    { id: "food", label: "Food" },
                  ] as { id: PlaceCategory | "all"; label: string }[]
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={kindFilter === option.id ? "active" : ""}
                    aria-pressed={kindFilter === option.id}
                    onClick={() => setKindFilter(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <label className="day-select">
                <span>Day</span>
                <select value={dayFilter} onChange={(event) => setDayFilter(event.target.value)}>
                  <option value="all">Any day</option>
                  {tripDays.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.weekday.slice(0, 3)} Aug {Number(day.shortDate)} · {day.stop}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className={`must-toggle ${mustOnly ? "active" : ""}`}
                aria-pressed={mustOnly}
                onClick={() => setMustOnly((value) => !value)}
              >
                <Sparkles aria-hidden="true" /> Don’t-miss
              </button>
            </div>

            <div className="chip-row" role="group" aria-label="Filter by place">
              <button
                type="button"
                className={areaFilter === "all" ? "active" : ""}
                aria-pressed={areaFilter === "all"}
                onClick={() => setAreaFilter("all")}
              >
                All places
              </button>
              {areas.map((area) => (
                <button
                  key={area}
                  type="button"
                  className={areaFilter === area ? "active" : ""}
                  aria-pressed={areaFilter === area}
                  onClick={() => setAreaFilter(area)}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="result-row">
              <p aria-live="polite">
                {filteredPlaces.length === places.length
                  ? `${places.length} places`
                  : `${filteredPlaces.length} of ${places.length} places`}
              </p>
              {filtersActive && (
                <button type="button" className="clear-filters" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>

            {filteredPlaces.length > 0 ? (
              <div className="place-grid">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <p>Nothing matches those filters.</p>
                <button type="button" className="clear-filters" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "weather" && (
          <section
            className="panel"
            id="weather-panel"
            role="tabpanel"
            aria-labelledby="tab-weather"
          >
            <div className="panel-head">
              <h2>Weather & sky</h2>
              <p>
                Aug 8–15 sits in the peak weeks of the North American Monsoon: sunny, calm
                mornings almost every day, storms building over the mountains after lunch.
                The typical numbers below are NOAA 1991–2020 normals for these exact dates.
              </p>
            </div>

            <div className="forecast-note">
              <CloudSun aria-hidden="true" />
              <span>
                {forecastCoverage === "all"
                  ? "All trip dates are inside the live 16-day window—forecast tiles below refresh on every visit and stay cached for offline mornings."
                  : forecastCoverage === "partial"
                    ? "Live forecasts are filling in day by day as trip dates enter the 16-day window—tiles still marked “normals” aren't in range yet."
                    : forecastWindowNote}
              </span>
            </div>

            {alertRows.length > 0 ? (
              <div className="alerts-strip" role="status">
                {alertRows.map(({ stop, alert }) => (
                  <a
                    className="alert-row"
                    key={`${stop.id}-${alert.id}`}
                    href={stop.nwsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ShieldAlert aria-hidden="true" />
                    <span>
                      <strong>
                        {stop.name}: {alert.event}
                      </strong>
                      {alert.headline && <small>{alert.headline}</small>}
                    </span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : (
              alertsCheckedAt > 0 && (
                <p className="alerts-clear">
                  <CheckCircle2 aria-hidden="true" />{" "}
                  {(clock?.now ?? alertsCheckedAt) - alertsCheckedAt < 90 * 60 * 1000
                    ? `No active NWS watches or warnings at any stop as of ${new Date(alertsCheckedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`
                    : "Couldn't refresh NWS alerts—use the NWS forecast links on each stop for current watches and warnings."}
                </p>
              )
            )}

            <div className="stop-weather-grid">
              {stopAlmanacs.map((stop) => (
                <article className="stop-weather-card" key={stop.id}>
                  <div className="stop-weather-head">
                    <div>
                      <h3>{stop.name}</h3>
                      <small>
                        {stop.nights} · {stop.elevationFt.toLocaleString()} ft
                      </small>
                    </div>
                    <a className="card-link" href={stop.nwsUrl} target="_blank" rel="noreferrer">
                      NWS forecast <ExternalLink aria-hidden="true" />
                    </a>
                  </div>
                  <div className="normals-row">
                    <span className="normal-chip">
                      <Thermometer aria-hidden="true" /> August normal{" "}
                      <strong>
                        {stop.augHighF}° / {stop.augLowF}°
                      </strong>
                    </span>
                    <span className="normal-chip">
                      <CloudRain aria-hidden="true" />
                      <strong>{stop.augPrecipIn}″</strong> · {stop.augRainDays} rain days
                    </span>
                  </div>
                  <div className="forecast-days">
                    {(stopTripDates[stop.id] ?? []).map((date) => {
                      const forecast = forecasts[stop.id]?.days.find(
                        (day) => day.date === date,
                      );
                      if (!forecast) {
                        return (
                          <div className="forecast-day pending" key={date}>
                            <small>{tripDateLabel(date)}</small>
                            <strong>
                              {stop.augHighF}°<span>/{stop.augLowF}°</span>
                            </strong>
                            <em>normals</em>
                          </div>
                        );
                      }
                      const described =
                        forecast.weatherCode !== null
                          ? describeWeatherCode(forecast.weatherCode)
                          : null;
                      const Icon = forecastIcons[described?.group ?? "cloud"];
                      return (
                        <div className="forecast-day" key={date}>
                          <small>{tripDateLabel(date)}</small>
                          <Icon className={`fc-${described?.group ?? "cloud"}`} aria-hidden="true" />
                          <strong>
                            {forecast.highF}°<span>/{forecast.lowF}°</span>
                          </strong>
                          <em>
                            {forecast.precipChance !== null && (
                              <>
                                <Droplets aria-hidden="true" /> {forecast.precipChance}%
                              </>
                            )}
                            {forecast.precipChance !== null && described ? " · " : ""}
                            {described?.label}
                          </em>
                        </div>
                      );
                    })}
                  </div>
                  <p className="stop-weather-note">{stop.climateNote}</p>
                  <p className="stop-weather-note">{stop.stormNote}</p>
                </article>
              ))}
            </div>

            <div className="monsoon-card">
              <h3>
                <CloudLightning aria-hidden="true" /> The monsoon, in one minute
              </h3>
              <p>
                August is the wettest month of the year in Taos (1.77″) and Santa Fe (1.96″),
                but it arrives in bursts and breaks—some trip days will stay bone dry, others
                fire widespread storms. The daily rhythm is reliable enough to plan around:
              </p>
              <div className="monsoon-rhythm">
                <div>
                  <strong>
                    <Sun aria-hidden="true" /> Morning · clear
                  </strong>
                  <p>
                    Sunny, calm, dry nearly every day. The window for the Gorge Bridge,
                    Bandelier, and canyon trails—UV hits 10–12 at altitude, so sun protection
                    from the start.
                  </p>
                </div>
                <div>
                  <strong>
                    <Cloud aria-hidden="true" /> Midday · building
                  </strong>
                  <p>
                    Cumulus stacks over the Sangre de Cristos, Jemez, and Sandias by 11 AM;
                    first storms on the peaks noon–2 PM. Be off exposed rims and high points
                    by about 1 PM.
                  </p>
                </div>
                <div>
                  <strong>
                    <CloudLightning aria-hidden="true" /> Afternoon · storms
                  </strong>
                  <p>
                    Cells drift over valleys 2–8 PM: brief heavy rain, gusty outflow, and a
                    lot of lightning. Wait 30 minutes after the last thunder; most storms die
                    out by late evening.
                  </p>
                </div>
              </div>
              <p className="small-note">
                Flash floods run ahead of the rain: burn scars above Frijoles Canyon and slot
                drainages can flood from storms miles upstream while the sky overhead stays
                blue. Never cross moving water, at Palo Duro or anywhere else.
              </p>
            </div>

            <div className="sky-grid">
              <article className="tool-card">
                <h3>
                  <Sunrise aria-hidden="true" /> Sun, day by day
                </h3>
                <table className="sun-table">
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Sunrise</th>
                      <th scope="col">Sunset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayAlmanacs.map((entry) => {
                      const day = tripDays.find((tripDay) => tripDay.id === entry.dayId);
                      if (!day) return null;
                      const tonight = clock?.dayIndex === tripDays.indexOf(day);
                      return (
                        <tr key={entry.dayId} className={tonight ? "is-tonight" : undefined}>
                          <td>
                            {day.weekday.slice(0, 3)} {Number(day.shortDate)}{" "}
                            <small>· {day.stop}</small>
                          </td>
                          <td>{entry.sunrise}</td>
                          <td>{entry.sunset ?? "en route"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="small-note">
                  Aug 9 and Aug 14 cross time zones, so those rows mix CDT and MDT on
                  purpose—sunrise is where the day starts, sunset where it ends.
                </p>
              </article>

              <article className="tool-card">
                <h3>
                  <MoonStar aria-hidden="true" /> Moon & meteors, night by night
                </h3>
                <div className="moon-list">
                  {moonNights.map((night) => (
                    <div className="moon-row" key={night.date}>
                      <strong>{night.label}</strong>
                      <span className="moon-phase">
                        {night.phase} · {night.illumination}%
                      </span>
                      <span className="moon-note">{night.note}</span>
                    </div>
                  ))}
                </div>
                <div className="perseids-callout">
                  <Sparkles aria-hidden="true" />
                  <div>
                    <strong>{perseids.title}</strong>
                    <p>{perseids.detail}</p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeTab === "checklist" && (
          <section
            className="panel"
            id="checklist-panel"
            role="tabpanel"
            aria-labelledby="tab-checklist"
          >
            <div className="panel-head">
              <h2>Checklist</h2>
              <p>
                Shared across devices—check something off here and it updates on everyone’s
                phone. Reservations and live checks matter more than perfect packing.
              </p>
            </div>

            <div className="progress-strip">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Checklist progress"
              >
                <i style={{ width: `${progress}%` }} />
              </div>
              <span>
                {checklistDone} of {checklistTotal} done
              </span>
            </div>

            <div className="checklist-grid">
              {checklistGroups.map((group) => {
                const done = group.items.filter((item) => shared.checked.includes(item.id)).length;
                return (
                  <article className="checklist-card" key={group.title}>
                    <div className="checklist-card-head">
                      <div>
                        <span>{group.eyebrow}</span>
                        <h3>{group.title}</h3>
                      </div>
                      <strong>
                        {done}/{group.items.length}
                      </strong>
                    </div>
                    <div className="checklist-items">
                      {group.items.map((item) => {
                        const isChecked = shared.checked.includes(item.id);
                        return (
                          <button
                            type="button"
                            key={item.id}
                            className={isChecked ? "checked" : ""}
                            onClick={() => toggleChecked(item.id)}
                          >
                            <span className="box">{isChecked && <Check aria-hidden="true" />}</span>
                            <span>{item.text}</span>
                            {item.urgent && <span className="key-badge">key</span>}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}

              <article className="checklist-card custom-card">
                <div className="checklist-card-head">
                  <div>
                    <span>Shared</span>
                    <h3>Your own to-dos</h3>
                  </div>
                  <strong>
                    {shared.customTodos.filter((item) => shared.checked.includes(item.id)).length}/
                    {shared.customTodos.length}
                  </strong>
                </div>
                <form className="add-todo" onSubmit={addCustomTodo}>
                  <label htmlFor="custom-todo">Add something this trip needs</label>
                  <div>
                    <input
                      id="custom-todo"
                      value={customTodoText}
                      maxLength={100}
                      onChange={(event) => setCustomTodoText(event.target.value)}
                      placeholder="Example: bring opera tickets"
                    />
                    <button
                      type="submit"
                      aria-label="Add custom task"
                      disabled={!customTodoText.trim() || shared.customTodos.length >= 30}
                    >
                      <Plus aria-hidden="true" />
                    </button>
                  </div>
                </form>
                <div className="checklist-items custom-items">
                  {shared.customTodos.length === 0 && (
                    <p className="empty-state">
                      Anything added here shows up on every synced device.
                    </p>
                  )}
                  {shared.customTodos.map((item) => {
                    const isChecked = shared.checked.includes(item.id);
                    return (
                      <div className={isChecked ? "custom-row checked" : "custom-row"} key={item.id}>
                        <button type="button" onClick={() => toggleChecked(item.id)}>
                          <span className="box">{isChecked && <Check aria-hidden="true" />}</span>
                          <span>{item.text}</span>
                        </button>
                        <button
                          type="button"
                          className="delete-todo"
                          onClick={() => removeCustomTodo(item.id)}
                          aria-label={`Delete ${item.text}`}
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </section>
        )}

        {activeTab === "info" && (
          <section className="panel" id="info-panel" role="tabpanel" aria-labelledby="tab-info">
            <div className="panel-head">
              <h2>Trip info</h2>
              <p>Route, clocks, fuel, and the safety rules that shape each day.</p>
            </div>

            <div className="route-board">
              <h3>1,952 miles · 30 hr 11 min driving</h3>
              <RouteMap currentStopId={currentStopId} />
              <ol className="route-list">
                {routeStops.map((stop, index) => (
                  <li key={`${stop.place}-${index}`}>
                    <span className="route-node">{index + 1}</span>
                    <div>
                      <strong>{stop.place}</strong>
                      <small>
                        {stop.date} · {stop.stay}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="info-grid">
              <article className="tool-card">
                <h3>
                  <Clock3 aria-hidden="true" /> Two time-zone moves
                </h3>
                <div className="timezone-row">
                  <Plus aria-hidden="true" />
                  <div>
                    <strong>Aug 9 · gain one hour</strong>
                    <span>Lubbock CDT → Taos MDT</span>
                  </div>
                </div>
                <div className="timezone-row">
                  <Minus aria-hidden="true" />
                  <div>
                    <strong>Aug 14 · lose one hour</strong>
                    <span>Albuquerque MDT → Palo Duro CDT</span>
                  </div>
                </div>
                <p className="small-note">
                  On Aug 14, 4 hr 25 min of driving advances the local clock by 5 hr 25 min
                  before stops.
                </p>
              </article>

              <article className="tool-card">
                <h3>
                  <Wallet aria-hidden="true" /> Trip budget sketch
                </h3>
                <p>
                  Planning math, not bookkeeping—edit the numbers to match the group and the
                  bars re-balance.
                </p>
                <div className="input-pair">
                  <label>
                    Vehicle MPG
                    <input
                      type="number"
                      min="8"
                      max="80"
                      step="1"
                      value={mpg}
                      onChange={(event) => setMpg(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Gas $/gallon
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.05"
                      value={gasPrice}
                      onChange={(event) => setGasPrice(Number(event.target.value))}
                    />
                  </label>
                </div>
                <div className="input-pair">
                  <label>
                    Travelers
                    <input
                      type="number"
                      min="1"
                      max="9"
                      step="1"
                      value={travelers}
                      onChange={(event) => setTravelers(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Lodging $/night
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="10"
                      value={lodgingNight}
                      onChange={(event) => setLodgingNight(Number(event.target.value))}
                    />
                  </label>
                </div>
                <div className="input-pair">
                  <label>
                    Food $/person/day
                    <input
                      type="number"
                      min="0"
                      max="200"
                      step="5"
                      value={foodPerDay}
                      onChange={(event) => setFoodPerDay(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Tickets + entries $
                    <input
                      type="number"
                      min="0"
                      max="3000"
                      step="25"
                      value={ticketsBudget}
                      onChange={(event) => setTicketsBudget(Number(event.target.value))}
                    />
                  </label>
                </div>
                <div className="budget-rows">
                  {budgetRows.map((row) => {
                    const share = budgetTotal > 0 ? Math.max(2, (row.amount / budgetTotal) * 100) : 0;
                    return (
                      <div className="budget-row" key={row.label}>
                        <div className="budget-row-head">
                          <span>
                            {row.label} <small>{row.detail}</small>
                          </span>
                          <strong>${Number.isFinite(row.amount) ? Math.round(row.amount) : 0}</strong>
                        </div>
                        <div className="budget-bar">
                          <i style={{ width: `${share}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="fuel-total">
                  <span>Whole-trip estimate</span>
                  <strong>${Number.isFinite(budgetTotal) ? Math.round(budgetTotal) : 0}</strong>
                </div>
                <p className="small-note">
                  Opera seats, Taos Pueblo ($25 each), Bandelier ($25/vehicle), Palo Duro, and
                  Nambé Falls ($20/vehicle) all land in the tickets line—see each card in Food
                  &amp; attractions for current prices.
                </p>
              </article>

              <article className="tool-card">
                <h3>
                  <Navigation aria-hidden="true" /> Aug 15 meal stop
                </h3>
                <p>
                  The home city isn’t locked in, so both corridors stay planned. Pick the one
                  that matches the final route.
                </p>
                <div className="segmented" role="group" aria-label="Choose the home route">
                  <button
                    type="button"
                    className={homeRoute === "abilene" ? "active" : ""}
                    aria-pressed={homeRoute === "abilene"}
                    onClick={() => setHomeRoute("abilene")}
                  >
                    Via Abilene
                  </button>
                  <button
                    type="button"
                    className={homeRoute === "wichita" ? "active" : ""}
                    aria-pressed={homeRoute === "wichita"}
                    onClick={() => setHomeRoute("wichita")}
                  >
                    Via Wichita Falls
                  </button>
                </div>
                {homeMeal && (
                  <div className="route-meal">
                    <strong>
                      {homeMeal.name} · {homeMeal.city}
                    </strong>
                    <span>{homeMeal.dishes?.join(", ")}. {homeMeal.note}</span>
                    {homeMeal.href && (
                      <a href={homeMeal.href} target="_blank" rel="noreferrer">
                        Official site <ExternalLink aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </article>

              <article className="tool-card">
                <h3>
                  <ShieldAlert aria-hidden="true" /> Heat, height, and storms
                </h3>
                <ul className="safety-list">
                  <li>Morning slots for the gorge, Bandelier, falls, and canyon trails.</li>
                  <li>Turn around at thunder; dry ground does not rule out upstream flash flooding.</li>
                  <li>At altitude, headache + nausea + unusual fatigue means stop, and descend if it worsens.</li>
                  <li>Palo Duro: about one quart of water per person per trail mile.</li>
                  <li>No Lighthouse Trail after the drive or before the 617-mile day home.</li>
                </ul>
              </article>
            </div>

            <div className="live-tools">
              <div className="live-tools-copy">
                <h3>Open these on travel mornings</h3>
                <p>
                  Research is current as of July 15, 2026. These links are the final word when
                  conditions change.
                </p>
              </div>
              <div className="live-link-grid">
                {liveLinks.map((link) => (
                  <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                    <span>
                      <strong>{link.label}</strong>
                      <small>{link.detail}</small>
                    </span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>
          <strong>New Mexico road trip · Aug 8–15, 2026.</strong> Research last checked July 15,
          2026—reconfirm hours, closures, tickets, weather, and road conditions before each day.
        </p>
      </footer>
    </div>
  );
}
