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
  Coffee,
  Compass,
  ExternalLink,
  Fuel,
  Gauge,
  ListChecks,
  MapPinned,
  Minus,
  Navigation,
  Plus,
  RefreshCw,
  Route,
  Search,
  ShieldAlert,
  Trash2,
  Utensils,
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

type TabId = "plan" | "explore" | "checklist" | "info";
type SyncStatus = "connecting" | "saving" | "synced" | "offline";
type CustomTodo = { id: string; text: string };
type SharedTripState = { checked: string[]; customTodos: CustomTodo[] };
type TripClock = { daysUntil: number; dayIndex: number };

const EMPTY_STATE: SharedTripState = { checked: [], customTodos: [] };
const STORAGE_KEY = "harsh-trip-2026-state-v1";
const BOARD_PATH = ["tripBoards", "new-mexico-2026"] as const;
const TRIP_START = new Date("2026-08-08T00:00:00-05:00").getTime();
const DAY_MS = 86_400_000;

const tabs: { id: TabId; label: string; shortLabel: string; icon: typeof CalendarDays }[] = [
  { id: "plan", label: "Schedule", shortLabel: "Schedule", icon: CalendarDays },
  { id: "explore", label: "Food & attractions", shortLabel: "Food & sights", icon: MapPinned },
  { id: "checklist", label: "Checklist", shortLabel: "Checklist", icon: ListChecks },
  { id: "info", label: "Trip info", shortLabel: "Trip info", icon: Route },
];

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
  const [shared, setShared] = useState<SharedTripState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connecting");
  const [customTodoText, setCustomTodoText] = useState("");
  const [clock, setClock] = useState<TripClock | null>(null);
  const [mpg, setMpg] = useState(28);
  const [gasPrice, setGasPrice] = useState(3.15);
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
      });
    };
    updateClock();

    const timer = window.setInterval(updateClock, 3_600_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    stateRef.current = shared;
  }, [shared]);

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

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPlaces = places.filter((place) => {
    if (kindFilter !== "all" && place.category !== kindFilter) return false;
    if (areaFilter !== "all" && place.area !== areaFilter) return false;
    if (dayFilter !== "all" && !place.dayIds.includes(dayFilter)) return false;
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
    kindFilter !== "all" || areaFilter !== "all" || dayFilter !== "all" || normalizedQuery !== "";

  const clearFilters = () => {
    setQuery("");
    setKindFilter("all");
    setAreaFilter("all");
    setDayFilter("all");
  };

  const fuelGallons = 1952 / Math.max(mpg, 1);
  const fuelCost = fuelGallons * Math.max(gasPrice, 0);
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
              {tripDays.map((day, index) => (
                <button
                  type="button"
                  key={day.id}
                  className={selectedDay === index ? "active" : ""}
                  onClick={() => setSelectedDay(index)}
                  aria-current={selectedDay === index ? "date" : undefined}
                >
                  <small>{day.weekday.slice(0, 3)}</small>
                  <strong>{day.shortDate}</strong>
                  <span>{day.stop}</span>
                </button>
              ))}
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
                  <Fuel aria-hidden="true" /> Fuel estimate
                </h3>
                <p>About {fuelGallons.toFixed(1)} gallons for the full 1,952-mile loop.</p>
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
                <div className="fuel-total">
                  <span>Estimated fuel cost</span>
                  <strong>${Number.isFinite(fuelCost) ? fuelCost.toFixed(0) : "0"}</strong>
                </div>
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
