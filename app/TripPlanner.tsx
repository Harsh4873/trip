"use client";

import { CameraOff, ExternalLink, Phone, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CalendarGrid, CalendarLegend, formatRange } from "./CalendarGrid";
import type {
  BanderaContent,
  BlockKind,
  DriveRow,
  FoodCard,
  ItineraryItem,
  PlacePhoto,
  SourceLink,
  TripEvent,
} from "./bandera-content";

type TabId = "schedule" | "food" | "attractions" | "events";
type ScheduleSpan = "day" | "week";

const SPAN_KEY = "trip-schedule-span";
const TRIP_YMD: Record<string, string> = {
  "2026-11-26": "thu",
  "2026-11-27": "fri",
  "2026-11-28": "sat",
  "2026-11-29": "sun",
};

function chicagoYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function defaultScheduleSpan(now = new Date()): ScheduleSpan {
  return TRIP_YMD[chicagoYmd(now)] ? "day" : "week";
}

function defaultDayId(fallback: string, now = new Date()): string {
  return TRIP_YMD[chicagoYmd(now)] ?? fallback;
}

function readStoredSpan(): ScheduleSpan | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(SPAN_KEY);
    if (stored === "day" || stored === "week") return stored;
  } catch {
    return null;
  }
  return null;
}

function writeStoredSpan(span: ScheduleSpan) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SPAN_KEY, span);
  } catch {
    /* ignore quota / private mode */
  }
}

const TABS: { id: TabId; label: string }[] = [
  { id: "schedule", label: "Schedule" },
  { id: "food", label: "Food" },
  { id: "attractions", label: "Attractions" },
  { id: "events", label: "Events" },
];

const GROUP_LABEL: Record<DriveRow["group"], string> = {
  "in-town": "In and around Bandera",
  nearby: "Short drives",
  i10: "On the I-10 drive",
  longer: "Longer side trips",
};

function Sources({ links }: { links: SourceLink[] }) {
  if (!links.length) return null;
  return (
    <ul className="source-list">
      {links.map((link) => (
        <li key={`${link.href}:${link.label}`}>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
            <ExternalLink aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Unverified({ reason }: { reason?: string }) {
  return (
    <span className="badge-unverified">
      UNVERIFIED
      {reason ? <span className="badge-reason">{reason}</span> : null}
    </span>
  );
}

function PhotoCredit({ photo }: { photo: PlacePhoto }) {
  return (
    <p className="photo-credit">
      Photo: {photo.credit}, {photo.license},{" "}
      <a href={photo.commonsHref} target="_blank" rel="noopener noreferrer">
        Wikimedia Commons
      </a>
      . {photo.note}{" "}
      <a href={photo.licenseHref} target="_blank" rel="noopener noreferrer">
        License
      </a>
      .
    </p>
  );
}

function PlaceImage({
  photo,
  placeholder,
}: {
  photo?: PlacePhoto;
  placeholder: string;
}) {
  if (!photo) {
    return (
      <div className="ph-card" aria-hidden="true">
        <CameraOff />
        <span>No reusable photo for {placeholder}</span>
      </div>
    );
  }
  return (
    <figure className="place-photo">
      <div className="place-photo-frame">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 720px) 100vw, 560px"
          unoptimized
        />
      </div>
      <figcaption>
        <PhotoCredit photo={photo} />
      </figcaption>
    </figure>
  );
}

function KindTag({ kind }: { kind: BlockKind }) {
  const label =
    kind === "drive"
      ? "Drive"
      : kind === "food"
        ? "Food"
        : kind === "activity"
          ? "Out"
          : kind === "event"
            ? "Event"
            : "Rest";
  return <span className={`kind-tag kind-${kind}`}>{label}</span>;
}

function BlockSheet({
  item,
  photo,
  onClose,
}: {
  item: ItineraryItem;
  photo?: PlacePhoto;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="sheet-close" onClick={onClose} aria-label="Close details">
          <X aria-hidden="true" />
        </button>
        <PlaceImage photo={photo} placeholder={item.title} />
        <div className="sheet-kicker">
          <KindTag kind={item.kind} />
          <span>{formatRange(item)}</span>
          {item.options?.length ? <span className="optional-flag">Options</span> : null}
          {item.optional ? <span className="optional-flag">Optional</span> : null}
        </div>
        <h2 id="sheet-title">{item.title}</h2>
        {item.unverified ? <Unverified reason={item.unverifiedReason} /> : null}
        {item.address ? <p className="muted">{item.address}</p> : null}
        {item.hoursNote ? <p className="window-note">{item.hoursNote}</p> : null}
        {item.windowNote ? <p className="window-note">{item.windowNote}</p> : null}
        <p>{item.body}</p>
        {item.callToConfirm ? <p className="call-line">{item.callToConfirm}</p> : null}
        {item.options?.length ? (
          <div className="option-list">
            {item.options.map((option) => (
              <article key={option.id} className="option-card">
                <h3>{option.title}</h3>
                <p className="muted">{option.time}</p>
                {option.unverified ? <Unverified reason={option.unverifiedReason} /> : null}
                {option.hoursNote ? <p className="window-note">{option.hoursNote}</p> : null}
                <p>{option.body}</p>
                <Sources links={option.sources} />
              </article>
            ))}
          </div>
        ) : null}
        <Sources links={item.sources} />
      </div>
    </div>
  );
}

function FoodBlock({ card, photo }: { card: FoodCard; photo?: PlacePhoto }) {
  const tel = card.phone?.replace(/[^\d+]/g, "");
  return (
    <article className="media-card">
      <PlaceImage photo={photo} placeholder={card.name} />
      <div className="media-card-body">
        <h3>{card.name}</h3>
        <p className="muted">{card.blurb}</p>
        <p className="muted">{card.address}</p>
        {card.phone && tel ? (
          <a className="tap-link" href={`tel:+1${tel.replace(/^1/, "")}`}>
            <Phone aria-hidden="true" />
            {card.phone}
          </a>
        ) : null}
        <p className="hours-line">{card.hours}</p>
        {card.hoursUnverified ? (
          <Unverified reason="Call to confirm these hours, especially Thanksgiving." />
        ) : null}
        {card.dishes.length ? (
          <ul className="dish-list">
            {card.dishes.map((dish) => (
              <li key={dish.name}>
                <strong>{dish.name}</strong>
                {dish.unverified ? <Unverified reason={dish.unverifiedReason} /> : null}
                {dish.skip ? <span className="skip-flag">do not order as written</span> : null}
                <p>{dish.detail}</p>
              </li>
            ))}
          </ul>
        ) : null}
        {card.ask.length ? (
          <ul className="ask-list">
            {card.ask.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
        <Sources links={card.sources} />
      </div>
    </article>
  );
}

function AttractionCard({ row, photo }: { row: DriveRow; photo?: PlacePhoto }) {
  return (
    <article className="media-card">
      <PlaceImage photo={photo} placeholder={row.place} />
      <div className="media-card-body">
        <h3>{row.place}</h3>
        <p className="hours-line">{row.drive}</p>
        <p>{row.reservations}</p>
        {row.unverified ? <Unverified reason={row.unverifiedReason} /> : null}
        <p>{row.notes}</p>
        <Sources links={row.sources} />
      </div>
    </article>
  );
}

function EventCard({ event, photo }: { event: TripEvent; photo?: PlacePhoto }) {
  return (
    <article className="media-card">
      <PlaceImage photo={photo} placeholder={event.title} />
      <div className="media-card-body">
        <p className="event-when">{event.when}</p>
        <h3>{event.title}</h3>
        <p className="muted">{event.where}</p>
        {event.unverified ? <Unverified reason={event.unverifiedReason} /> : null}
        <p>{event.detail}</p>
        <Sources links={event.sources} />
      </div>
    </article>
  );
}

function BanderaView({ data }: { data: BanderaContent }) {
  const { meta, weather, diet, days, foodPicks, events, drives, alerts, photos, photoGaps } = data;
  const photoMap = useMemo(
    () => Object.fromEntries(photos.map((photo) => [photo.id, photo])),
    [photos],
  );

  const [tab, setTab] = useState<TabId>("schedule");
  const [dayId, setDayId] = useState(() => defaultDayId(days[0]?.id ?? "thu"));
  const [phone, setPhone] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 719px)").matches : true,
  );
  const [span, setSpan] = useState<ScheduleSpan>(() => readStoredSpan() ?? defaultScheduleSpan());
  const [open, setOpen] = useState<ItineraryItem | null>(null);
  const activeDay = days.find((day) => day.id === dayId) ?? days[0];
  const scheduleMode: ScheduleSpan = phone ? "day" : span;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 719px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function chooseSpan(next: ScheduleSpan) {
    setSpan(next);
    writeStoredSpan(next);
  }

  const groupedDrives = useMemo(() => {
    const groups: Record<DriveRow["group"], DriveRow[]> = {
      "in-town": [],
      nearby: [],
      i10: [],
      longer: [],
    };
    for (const row of drives) groups[row.group].push(row);
    return groups;
  }, [drives]);

  return (
    <div className="site trip-page">
      <a className="skip-link" href="#tab-panel">
        Skip to trip notes
      </a>

      <header className="chrome">
        <div className="brand">
          <strong>{meta.stayName}</strong>
          <span>{meta.dates}</span>
        </div>
        <nav className="tab-bar" aria-label="Trip sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={tab === item.id ? "is-active" : ""}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {tab === "schedule" ? (
          <div className="schedule-tools">
            <div className="day-switcher" role="tablist" aria-label="Day">
              {days.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  role="tab"
                  aria-selected={day.id === dayId}
                  className={day.id === dayId ? "is-active" : ""}
                  onClick={() => setDayId(day.id)}
                >
                  {day.weekday}
                  <span>{day.short.replace(/^[A-Za-z]+ /, "")}</span>
                </button>
              ))}
            </div>
            {phone ? null : (
              <div className="span-toggle" role="group" aria-label="Schedule span">
                <button
                  type="button"
                  aria-pressed={span === "day"}
                  className={span === "day" ? "is-active" : ""}
                  onClick={() => chooseSpan("day")}
                >
                  Day
                </button>
                <button
                  type="button"
                  aria-pressed={span === "week"}
                  className={span === "week" ? "is-active" : ""}
                  onClick={() => chooseSpan("week")}
                >
                  4 days
                </button>
              </div>
            )}
          </div>
        ) : null}
      </header>

      <main id="tab-panel">
        {tab === "schedule" ? (
          <div className="schedule-tab">
            {scheduleMode === "day" && activeDay ? (
              <p className="day-wx">
                {activeDay.date}: {activeDay.weather.sky}, {activeDay.weather.high}
                {activeDay.weather.low ? ` / ${activeDay.weather.low}` : ""}
              </p>
            ) : (
              <ul className="wx-inline">
                {weather.days.map((day) => (
                  <li key={day.id}>
                    <strong>{day.label}</strong> {day.sky} {day.high}
                    {day.low ? ` / ${day.low}` : ""}
                  </li>
                ))}
              </ul>
            )}
            <CalendarLegend />
            <CalendarGrid
              days={days}
              activeDayId={dayId}
              mode={scheduleMode}
              rich={scheduleMode === "day" && !phone}
              onSelectDay={setDayId}
              onOpen={(item, id) => {
                setDayId(id);
                setOpen(item);
              }}
            />

            <section className="strip" aria-label="Drive and weather">
              <p>
                {data.driveIn.blurb} {data.driveIn.osrmShort}
              </p>
              <div className="lede-actions">
                <a
                  className="btn-link"
                  href={data.driveIn.sources[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maps: Katy to Flying L
                </a>
                <a
                  className="btn-link btn-link-quiet"
                  href={data.driveIn.sources[1].href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maps: Flying L to Katy
                </a>
              </div>
              <p className="as-of">
                Hours and weather as of {meta.researchedAsOf}. {meta.timezoneNote} Re-check before
                travel.
              </p>
            </section>

            <details className="fold">
              <summary>Weather, alerts, and stay notes</summary>
              <p className="nws-stamp">
                {weather.pointLabel}. Last update {weather.updated}. {weather.valid}.
              </p>
              <ul className="wx-rows">
                {weather.days.map((day) => (
                  <li key={day.id}>
                    <strong>{day.label}</strong>
                    <span>
                      {day.sky} · {day.high}
                      {day.low ? ` / ${day.low}` : ""}
                    </span>
                    <p>{day.detail}</p>
                  </li>
                ))}
              </ul>
              <p>{weather.freezeWarning}</p>
              <p>{weather.takeaway}</p>
              <Sources links={weather.sources} />
              {alerts.map((alert) => (
                <article key={alert.id} className={`alert-row tone-${alert.tone}`}>
                  <h3>{alert.title}</h3>
                  {alert.unverified ? <Unverified reason={alert.unverifiedReason} /> : null}
                  <p>{alert.body}</p>
                  <Sources links={alert.sources} />
                </article>
              ))}
              <h3>Flying L notes</h3>
              <p>{data.resort.hours}</p>
              <p>{data.resort.checkIn.summary}</p>
              <Unverified reason={data.resort.checkIn.unverifiedReason} />
              <Sources links={data.resort.checkIn.sources} />
              <p>
                {data.resort.pool.summary} {data.resort.pool.note}
              </p>
              <p>{data.resort.activities.summary}</p>
              <Unverified reason={data.resort.activities.unverifiedReason} />
              <p>{data.resort.dining.summary}</p>
              <Unverified reason={data.resort.dining.unverifiedReason} />
              <p>{data.resort.otaAddressNote}</p>
              <p>{data.tpwdNote}</p>
              <h3>{data.afterThisTrip.title}</h3>
              {data.afterThisTrip.items.map((item) => (
                <div key={item.text}>
                  <p>{item.text}</p>
                  <Sources links={item.sources} />
                </div>
              ))}
            </details>
          </div>
        ) : null}

        {tab === "food" ? (
          <section className="stack-tab" aria-labelledby="food-title">
            <h1 id="food-title">Food</h1>
            <p>
              Strict ovo-lacto. Named dishes come from the linked menus. Call to confirm
              Thanksgiving hours. Never assume a kitchen is open.
            </p>
            <p className="diet-line">
              {diet.title}. {diet.summary}
            </p>
            {diet.coconutUnverified ? <Unverified reason={diet.coconutUnverifiedReason} /> : null}
            <p>{diet.coconut}</p>
            {foodPicks.map((card) => (
              <FoodBlock key={card.name} card={card} photo={card.imageId ? photoMap[card.imageId] : undefined} />
            ))}
            <FoodBlock
              card={{
                rank: 99,
                name: data.otherFoodNotes.ost.name,
                blurb: data.otherFoodNotes.ost.detail,
                address: data.otherFoodNotes.ost.address,
                hours: data.otherFoodNotes.ost.hours,
                hoursUnverified: true,
                dishes: [],
                ask: [],
                sources: data.otherFoodNotes.ost.sources,
                imageId: data.otherFoodNotes.ost.imageId,
              }}
              photo={photoMap.ost}
            />
            <article className="media-card">
              <div className="media-card-body">
                <h3>Weaker leads</h3>
                <ul className="ask-list">
                  {data.otherFoodNotes.weaker.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <Unverified reason={data.otherFoodNotes.communityMeals.unverifiedReason} />
                <p>{data.otherFoodNotes.communityMeals.detail}</p>
                <Sources links={data.otherFoodNotes.communityMeals.sources} />
              </div>
            </article>
          </section>
        ) : null}

        {tab === "attractions" ? (
          <section className="stack-tab" aria-labelledby="attractions-title">
            <h1 id="attractions-title">Attractions</h1>
            <p>
              Real places only. Drives are OSRM no-traffic from Flying L unless noted. Photos are
              Wikimedia Commons files that allow reuse; places without a reusable photo use a
              placeholder.
            </p>
            {(Object.keys(groupedDrives) as DriveRow["group"][]).map((group) => (
              <div key={group}>
                <h2>{GROUP_LABEL[group]}</h2>
                {groupedDrives[group].map((row) => (
                  <AttractionCard
                    key={row.id}
                    row={row}
                    photo={row.imageId ? photoMap[row.imageId] : undefined}
                  />
                ))}
              </div>
            ))}
            <h2>Photo credits</h2>
            {photos.map((photo) => (
              <PhotoCredit key={photo.id} photo={photo} />
            ))}
            <h2>Places without a reusable photo</h2>
            <ul className="ask-list">
              {photoGaps.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "events" ? (
          <section className="stack-tab" aria-labelledby="events-title">
            <h1 id="events-title">Events</h1>
            <p>Only Nov 26–29, 2026. Later parades stay in the “after this trip” note.</p>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                photo={event.imageId ? photoMap[event.imageId] : undefined}
              />
            ))}
          </section>
        ) : null}
      </main>

      {open ? (
        <BlockSheet
          item={open}
          photo={open.imageId ? photoMap[open.imageId] : undefined}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

export default function TripPlanner() {
  const [data, setData] = useState<BanderaContent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    import("./bandera-content")
      .then((mod) => {
        if (!cancelled) setData(mod.content);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the trip notes. Try refreshing this tab.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="trip-loading">
        <p>{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="trip-loading" aria-busy="true">
        <p>Loading trip notes…</p>
      </main>
    );
  }

  return <BanderaView data={data} />;
}
