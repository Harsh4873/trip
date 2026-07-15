"use client";

import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  CloudSun,
  Coffee,
  Compass,
  ExternalLink,
  Fuel,
  Gauge,
  IndianRupee,
  ListChecks,
  MapPinned,
  Minus,
  Mountain,
  Navigation,
  Plus,
  RefreshCw,
  Route,
  ShieldAlert,
  Sparkles,
  Trash2,
  Utensils,
  WifiOff,
} from "lucide-react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import type { DocumentReference, DocumentData } from "firebase/firestore";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  checklistGroups,
  liveLinks,
  restaurants,
  routeStops,
  tripDays,
  type Cuisine,
  type EventKind,
} from "./trip-data";

type TabId = "plan" | "food" | "checklist" | "roadbook";
type SyncStatus = "connecting" | "saving" | "synced" | "offline";
type CustomTodo = { id: string; text: string };
type SharedTripState = { checked: string[]; customTodos: CustomTodo[] };

const EMPTY_STATE: SharedTripState = { checked: [], customTodos: [] };
const STORAGE_KEY = "harsh-trip-2026-state-v1";
const BOARD_PATH = ["tripBoards", "new-mexico-2026"] as const;

const tabs: { id: TabId; label: string; icon: typeof CalendarDays }[] = [
  { id: "plan", label: "Daily plan", icon: CalendarDays },
  { id: "food", label: "Vegetarian food", icon: Utensils },
  { id: "checklist", label: "Checklists", icon: ListChecks },
  { id: "roadbook", label: "Roadbook", icon: Route },
];

const cuisineFilters: (Cuisine | "All")[] = [
  "All",
  "Indian",
  "Mexican",
  "Italian",
  "Burgers + more",
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
    synced: "Firebase synced",
    offline: "Offline · saved here",
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

export default function TripPlanner() {
  const [activeTab, setActiveTab] = useState<TabId>("plan");
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayThirteenMode, setDayThirteenMode] = useState<"relaxed" | "falls">("relaxed");
  const [foodFilter, setFoodFilter] = useState<Cuisine | "All">("All");
  const [shared, setShared] = useState<SharedTripState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connecting");
  const [customTodoText, setCustomTodoText] = useState("");
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [mpg, setMpg] = useState(28);
  const [gasPrice, setGasPrice] = useState(3.15);
  const [homeRoute, setHomeRoute] = useState<"abilene" | "wichita">("abilene");
  const stateRef = useRef(shared);
  const boardRef = useRef<DocumentReference<DocumentData> | null>(null);
  const lastRemoteKey = useRef("");

  useEffect(() => {
    let localState = EMPTY_STATE;
    try {
      const localValue = window.localStorage.getItem(STORAGE_KEY);
      if (localValue) localState = cleanSharedState(JSON.parse(localValue));
    } catch {
      // Firestore's cache still provides an offline path when localStorage is unavailable.
    }
    queueMicrotask(() => {
      setShared(localState);
      setHydrated(true);
    });

    const updateCountdown = () => {
      const start = new Date("2026-08-08T00:00:00-05:00").getTime();
      const now = Date.now();
      setDaysUntil(Math.max(0, Math.ceil((start - now) / 86_400_000)));
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 3_600_000);
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
  const filteredRestaurants = restaurants.filter(
    (restaurant) => foodFilter === "All" || restaurant.cuisine === foodFilter,
  );
  const fuelGallons = 1952 / Math.max(mpg, 1);
  const fuelCost = fuelGallons * Math.max(gasPrice, 0);

  const tabKeyHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (currentIndex + direction + tabs.length) % tabs.length;
    setActiveTab(tabs[next].id);
  };

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="New Mexico road trip home">
          <span className="wordmark-mark">NM</span>
          <span>
            <strong>Roadbook</strong>
            <small>Aug 8–15 · 2026</small>
          </span>
        </a>
        <div className="topbar-actions">
          <span className="private-note">Temporary trip site · noindex</span>
          <SyncPill status={syncStatus} />
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles aria-hidden="true" /> The high-desert loop</div>
          <h1>Eight days.<br /><em>One honest plan.</em></h1>
          <p className="hero-lede">
            Home → Lubbock → Taos → Santa Fe → Albuquerque → Palo Duro → Home.
            Every fixed mile and drive time from the original plan is preserved; the schedule adds the stops, meals, closures, and recovery time the road actually needs.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => setActiveTab("plan")}>
              Open day one <ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="ghost-button" onClick={() => setActiveTab("checklist")}>
              {checklistDone}/{checklistTotal} ready
            </button>
          </div>
        </div>

        <aside className="hero-card" aria-label="Trip overview">
          <div className="hero-card-head">
            <span>{daysUntil === null ? "Aug 8–15" : daysUntil === 0 ? "Trip time" : `${daysUntil} days out`}</span>
            <CloudSun aria-hidden="true" />
          </div>
          <div className="mini-route">
            {routeStops.map((stop, index) => (
              <div className="mini-stop" key={`${stop.place}-${index}`}>
                <span className="mini-dot" />
                <div>
                  <strong>{stop.place}</strong>
                  <small>{stop.date}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-card-callout">
            <AlertTriangle aria-hidden="true" />
            <div>
              <strong>Two time-zone moves</strong>
              <span>Gain an hour into Taos. Lose one entering Texas.</span>
            </div>
          </div>
        </aside>

        <div className="stat-ribbon">
          <div><strong>1,952</strong><span>fixed miles</span></div>
          <div><strong>30h 11m</strong><span>wheel time</span></div>
          <div><strong>7</strong><span>hotel nights</span></div>
          <div><strong>6</strong><span>Indian anchors</span></div>
        </div>
      </section>

      <nav className="tab-shell" aria-label="Trip sections">
        <div className="tabs" role="tablist" onKeyDown={tabKeyHandler}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="tab-progress" aria-label={`${progress}% of checklist complete`}>
          <span><i style={{ width: `${progress}%` }} /></span>
          <small>{progress}% packed</small>
        </div>
      </nav>

      {activeTab === "plan" && (
        <section className="content-section plan-panel" id="plan-panel" role="tabpanel">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark"><CalendarDays aria-hidden="true" /> Day by day</span>
              <h2>The schedule, with breathing room.</h2>
            </div>
            <p>Times marked “suggested” are planning choices. Your original dates, destinations, mileages, and drive durations are fixed.</p>
          </div>

          <div className="day-picker" aria-label="Choose trip day">
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
                <span>{day.to.split(" · ")[0]}</span>
              </button>
            ))}
          </div>

          <article className="day-card">
            <div className="day-intro">
              <div>
                <span className="day-kicker">{activeDay.kicker}</span>
                <h3>{activeDay.title}</h3>
                <p>{activeDay.date} · {activeDay.weekday}</p>
              </div>
              <div className="route-chip">
                <MapPinned aria-hidden="true" />
                <span>{activeDay.from}</span>
                <ChevronRight aria-hidden="true" />
                <strong>{activeDay.to}</strong>
              </div>
            </div>

            <div className="day-facts">
              <div><Route aria-hidden="true" /><span><small>Your plan</small><strong>{activeDay.miles}</strong></span></div>
              <div><Clock3 aria-hidden="true" /><span><small>Wheel time</small><strong>{activeDay.wheelTime}</strong></span></div>
              <div><Gauge aria-hidden="true" /><span><small>Real block</small><strong>{activeDay.realTime}</strong></span></div>
              <div><BedDouble aria-hidden="true" /><span><small>Tonight</small><strong>{activeDay.lodging}</strong></span></div>
            </div>

            <div className="day-summary">
              <p>{activeDay.summary}</p>
              <span><Clock3 aria-hidden="true" /> {activeDay.timezone}</span>
            </div>

            {activeDay.advisory && (
              <div className="advisory">
                <ShieldAlert aria-hidden="true" />
                <div><strong>Worth knowing</strong><p>{activeDay.advisory}</p></div>
              </div>
            )}

            {activeDay.id === "aug-13" && (
              <div className="mode-switch" aria-label="Choose August 13 pace">
                <div>
                  <strong>Choose the pace</strong>
                  <span>The post-opera plan is the default.</span>
                </div>
                <div>
                  <button type="button" className={dayThirteenMode === "relaxed" ? "active" : ""} onClick={() => setDayThirteenMode("relaxed")}>Slow start</button>
                  <button type="button" className={dayThirteenMode === "falls" ? "active" : ""} onClick={() => setDayThirteenMode("falls")}>Nambé Falls</button>
                </div>
              </div>
            )}

            <div className="timeline">
              {activeEvents.map((event, index) => {
                const isChecked = shared.checked.includes(event.id);
                return (
                  <div className={`timeline-row ${isChecked ? "completed" : ""}`} key={event.id}>
                    <div className="timeline-time">{event.time}</div>
                    <div className={`timeline-icon kind-${event.kind}`}><EventIcon kind={event.kind} /></div>
                    <div className="timeline-content">
                      <div className="timeline-title-row">
                        <h4>{event.title}</h4>
                        {event.duration && <span>{event.duration}</span>}
                      </div>
                      <p>{event.detail}</p>
                      <div className="timeline-meta">
                        {event.note && <em>{event.note}</em>}
                        {event.href && (
                          <a href={event.href} target="_blank" rel="noreferrer">
                            {event.linkLabel ?? "Source"} <ExternalLink aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                    <CheckButton id={event.id} checked={isChecked} onToggle={toggleChecked} label={event.title} />
                    {index < activeEvents.length - 1 && <span className="timeline-line" />}
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      )}

      {activeTab === "food" && (
        <section className="content-section" id="food-panel" role="tabpanel">
          <div className="section-heading food-heading">
            <div>
              <span className="eyebrow dark"><IndianRupee aria-hidden="true" /> Vegetarian, Indian first</span>
              <h2>No “just get a salad” stops.</h2>
            </div>
            <p>Every pick has an actual vegetarian main. Indian food leads the plan; Mexican, Italian, and burger-style options are deliberate backups.</p>
          </div>

          <div className="food-principles">
            <div><span>01</span><strong>Ask about ghee</strong><p>Paneer and creamy curries are vegetarian, but not vegan.</p></div>
            <div><span>02</span><strong>Verify beans + chile</strong><p>New Mexican sides can contain lard or meat stock.</p></div>
            <div><span>03</span><strong>Pack the canyon meal</strong><p>Indian Oven takeout solves dinner at Palo Duro.</p></div>
          </div>

          <div className="filter-row" aria-label="Filter restaurants by cuisine">
            {cuisineFilters.map((filter) => (
              <button type="button" key={filter} className={foodFilter === filter ? "active" : ""} onClick={() => setFoodFilter(filter)}>
                {filter}
                <span>{filter === "All" ? restaurants.length : restaurants.filter((item) => item.cuisine === filter).length}</span>
              </button>
            ))}
          </div>

          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant) => (
              <article className={`restaurant-card ${restaurant.priority ? "priority" : ""}`} key={restaurant.name}>
                <div className="restaurant-topline">
                  <span>{restaurant.cuisine}</span>
                  <small>{restaurant.day}</small>
                </div>
                <div className="restaurant-name">
                  <div>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.city} · {restaurant.role}</p>
                  </div>
                  {restaurant.priority && <span className="priority-mark">Anchor</span>}
                </div>
                <div className="dish-list">
                  {restaurant.dishes.map((dish) => <span key={dish}>{dish}</span>)}
                </div>
                <p className="restaurant-note">{restaurant.note}</p>
                <a className="card-link" href={restaurant.href} target="_blank" rel="noreferrer">
                  Menu or official details <ExternalLink aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "checklist" && (
        <section className="content-section" id="checklist-panel" role="tabpanel">
          <div className="section-heading checklist-heading">
            <div>
              <span className="eyebrow dark"><BookOpenCheck aria-hidden="true" /> Shared preparation</span>
              <h2>{checklistDone} done. {Math.max(checklistTotal - checklistDone, 0)} to go.</h2>
            </div>
            <p>Checks and custom tasks sync through Firebase and stay cached for offline use on the road.</p>
          </div>

          <div className="progress-card">
            <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{progress}%</strong><span>ready</span></div>
            </div>
            <div>
              <span>Trip readiness</span>
              <h3>Front-load the hard parts.</h3>
              <p>Reservations and live checks matter more than perfect packing. Red-dot items can break a day if skipped.</p>
            </div>
            <SyncPill status={syncStatus} />
          </div>

          <div className="checklist-grid">
            {checklistGroups.map((group) => {
              const done = group.items.filter((item) => shared.checked.includes(item.id)).length;
              return (
                <article className="checklist-card" key={group.title}>
                  <div className="checklist-card-head">
                    <div><span>{group.eyebrow}</span><h3>{group.title}</h3></div>
                    <strong>{done}/{group.items.length}</strong>
                  </div>
                  <div className="checklist-items">
                    {group.items.map((item) => {
                      const isChecked = shared.checked.includes(item.id);
                      return (
                        <button type="button" key={item.id} className={isChecked ? "checked" : ""} onClick={() => toggleChecked(item.id)}>
                          <span className="box">{isChecked && <Check aria-hidden="true" />}</span>
                          <span>{item.text}</span>
                          {item.urgent && <i aria-label="High priority" />}
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}

            <article className="checklist-card custom-card">
              <div className="checklist-card-head">
                <div><span>Firebase shared</span><h3>Your own to-dos</h3></div>
                <strong>{shared.customTodos.filter((item) => shared.checked.includes(item.id)).length}/{shared.customTodos.length}</strong>
              </div>
              <form className="add-todo" onSubmit={addCustomTodo}>
                <label htmlFor="custom-todo">Add something this trip needs</label>
                <div>
                  <input id="custom-todo" value={customTodoText} maxLength={100} onChange={(event) => setCustomTodoText(event.target.value)} placeholder="Example: bring opera tickets" />
                  <button type="submit" aria-label="Add custom task" disabled={!customTodoText.trim() || shared.customTodos.length >= 30}><Plus aria-hidden="true" /></button>
                </div>
              </form>
              <div className="checklist-items custom-items">
                {shared.customTodos.length === 0 && <p className="empty-state">Custom items added here appear on every synced device.</p>}
                {shared.customTodos.map((item) => {
                  const isChecked = shared.checked.includes(item.id);
                  return (
                    <div className={isChecked ? "custom-row checked" : "custom-row"} key={item.id}>
                      <button type="button" onClick={() => toggleChecked(item.id)}>
                        <span className="box">{isChecked && <Check aria-hidden="true" />}</span>
                        <span>{item.text}</span>
                      </button>
                      <button type="button" className="delete-todo" onClick={() => removeCustomTodo(item.id)} aria-label={`Delete ${item.text}`}><Trash2 aria-hidden="true" /></button>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>
      )}

      {activeTab === "roadbook" && (
        <section className="content-section" id="roadbook-panel" role="tabpanel">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark"><Mountain aria-hidden="true" /> The useful math</span>
              <h2>What changes the day on the road.</h2>
            </div>
            <p>The route is simple. Time zones, weather, heat, fuel, closures, and a still-unknown home route are what need attention.</p>
          </div>

          <div className="route-board">
            <div className="route-board-head">
              <div><span>Complete loop</span><h3>1,952 miles · 30 hr 11 min driving</h3></div>
              <MapPinned aria-hidden="true" />
            </div>
            <div className="route-line">
              {routeStops.map((stop, index) => (
                <div className="route-stop" key={`${stop.place}-route-${index}`}>
                  <span className="route-node">{index + 1}</span>
                  <strong>{stop.place}</strong>
                  <small>{stop.date}</small>
                  <em>{stop.stay}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="roadbook-grid">
            <article className="tool-card fuel-card">
              <div className="tool-icon"><Fuel aria-hidden="true" /></div>
              <span className="card-eyebrow">Fuel planner</span>
              <h3>About {fuelGallons.toFixed(1)} gallons</h3>
              <p>For the full 1,952-mile loop.</p>
              <div className="input-pair">
                <label>Vehicle MPG<input type="number" min="8" max="80" step="1" value={mpg} onChange={(event) => setMpg(Number(event.target.value))} /></label>
                <label>Gas / gallon<input type="number" min="0" max="10" step="0.05" value={gasPrice} onChange={(event) => setGasPrice(Number(event.target.value))} /></label>
              </div>
              <div className="fuel-total"><span>Estimated fuel</span><strong>${Number.isFinite(fuelCost) ? fuelCost.toFixed(0) : "0"}</strong></div>
            </article>

            <article className="tool-card timezone-card">
              <div className="tool-icon"><Clock3 aria-hidden="true" /></div>
              <span className="card-eyebrow">Clock math</span>
              <h3>Two borders, opposite effects.</h3>
              <div className="timezone-row"><Plus aria-hidden="true" /><div><strong>Aug 9 · gain one hour</strong><span>Lubbock CDT → Taos MDT</span></div></div>
              <div className="timezone-row"><Minus aria-hidden="true" /><div><strong>Aug 14 · lose one hour</strong><span>Albuquerque MDT → Palo Duro CDT</span></div></div>
              <p className="small-note">The Aug 14 4h25 drive advances the destination clock by 5h25 before stops.</p>
            </article>

            <article className="tool-card route-choice-card">
              <div className="tool-icon"><Navigation aria-hidden="true" /></div>
              <span className="card-eyebrow">Aug 15 meal stop</span>
              <h3>Which way is home?</h3>
              <p>The city is intentionally not guessed. Pick the matching corridor when the route is known.</p>
              <div className="segmented-control">
                <button type="button" className={homeRoute === "abilene" ? "active" : ""} onClick={() => setHomeRoute("abilene")}>Via Abilene</button>
                <button type="button" className={homeRoute === "wichita" ? "active" : ""} onClick={() => setHomeRoute("wichita")}>Via Wichita Falls</button>
              </div>
              {homeRoute === "abilene" ? (
                <div className="route-meal"><strong>Spicy India · Abilene</strong><span>Vegetable Chettinad, dal tadka, mushroom matar, vegetable biryani. The dal is described as containing ghee.</span><a href="https://www.spicyindia.us/" target="_blank" rel="noreferrer">Official site <ExternalLink aria-hidden="true" /></a></div>
              ) : (
                <div className="route-meal"><strong>Masala & Curry · Wichita Falls</strong><span>Vegan dal tarka, aloo gobi, bhindi, chana curry, gobi Manchurian, and vegetable biryani.</span><a href="https://masalacurrywichitafalls.com/menu" target="_blank" rel="noreferrer">Official menu <ExternalLink aria-hidden="true" /></a></div>
              )}
            </article>

            <article className="tool-card safety-card">
              <div className="tool-icon"><ShieldAlert aria-hidden="true" /></div>
              <span className="card-eyebrow">Non-negotiables</span>
              <h3>Heat, height, and storms.</h3>
              <ul>
                <li>Morning slots for gorge, Bandelier, falls, and canyon trails.</li>
                <li>Turn around at thunder; dry ground does not rule out upstream flash flooding.</li>
                <li>At altitude, headache + nausea + unusual fatigue means stop and descend if symptoms worsen.</li>
                <li>Palo Duro: about one quart/liter of water per person per trail mile.</li>
                <li>No Lighthouse Trail after the drive or before the 617-mile day home.</li>
              </ul>
            </article>
          </div>

          <div className="known-changes">
            <div className="known-title"><AlertTriangle aria-hidden="true" /><div><span>Do not miss these</span><h3>Day-specific changes</h3></div></div>
            <div className="known-grid">
              <div><strong>Harwood Museum</strong><span>Closed Monday and Tuesday; intentionally omitted.</span></div>
              <div><strong>Nambé Falls</strong><span>Closed Tuesday and Wednesday; Thursday only.</span></div>
              <div><strong>Bandelier shuttle</strong><span>Not normally running Wednesday in the 2026 schedule.</span></div>
              <div><strong>TEXAS musical</strong><span>2026 season ends Aug 1; unavailable on Aug 14.</span></div>
            </div>
          </div>

          <div className="live-tools">
            <div className="live-tools-copy"><span className="eyebrow dark"><RefreshCw aria-hidden="true" /> Open on travel mornings</span><h3>Live road + weather checks</h3><p>Research is current as of July 15, 2026. These links are the final word when conditions change.</p></div>
            <div className="live-link-grid">
              {liveLinks.map((link) => (
                <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                  <span><strong>{link.label}</strong><small>{link.detail}</small></span>
                  <ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer>
        <div><span className="wordmark-mark">NM</span><p><strong>Roadbook · 2026</strong><small>Built only for this trip. Checked for the road.</small></p></div>
        <p>Research checked July 15, 2026. Reconfirm hours, closures, tickets, weather, and road conditions before each day.</p>
      </footer>
    </main>
  );
}
