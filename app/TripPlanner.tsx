"use client";

import {
  AlertTriangle,
  CalendarDays,
  CarFront,
  CloudSun,
  ExternalLink,
  Leaf,
  MapPinned,
  Phone,
  Snowflake,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
  BanderaContent,
  DriveRow,
  FoodCard,
  ItineraryItem,
  SourceLink,
} from "./bandera-content";

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

function Chips({ chips }: { chips?: string[] }) {
  if (!chips?.length) return null;
  return (
    <div className="chip-row">
      {chips.map((chip) => (
        <span key={chip} className="chip chip-confirm">
          {chip}
        </span>
      ))}
    </div>
  );
}

function ItemCard({ item }: { item: ItineraryItem }) {
  return (
    <article className="stop">
      <p className="stop-time">{item.time}</p>
      <h3>{item.title}</h3>
      <Chips chips={item.chips} />
      {item.unverified ? <Unverified reason={item.unverifiedReason} /> : null}
      <p>{item.body}</p>
      {item.callToConfirm ? <p className="call-line">{item.callToConfirm}</p> : null}
      <Sources links={item.sources} />
    </article>
  );
}

function FoodPick({ card }: { card: FoodCard }) {
  const tel = card.phone?.replace(/[^\d+]/g, "");
  return (
    <article className="food-card">
      <p className="food-rank">Pick {card.rank}</p>
      <h3>{card.name}</h3>
      <p className="food-blurb">{card.blurb}</p>
      <p className="food-address">{card.address}</p>
      {card.phone && tel ? (
        <a className="tap-link" href={`tel:+1${tel.replace(/^1/, "")}`}>
          <Phone aria-hidden="true" />
          {card.phone}
        </a>
      ) : null}
      <p className="hours-line">{card.hours}</p>
      {card.hoursUnverified ? <Unverified reason="Call to confirm these hours, especially Thanksgiving." /> : null}
      <h4>Named dishes</h4>
      <ul className="dish-list">
        {card.dishes.map((dish) => (
          <li key={dish.name}>
            <strong>{dish.name}</strong>
            {dish.unverified ? <Unverified reason={dish.unverifiedReason} /> : null}
            {dish.skip ? <span className="chip chip-skip">do not order as written</span> : null}
            <p>{dish.detail}</p>
            {dish.skipReason ? <p className="call-line">{dish.skipReason}</p> : null}
          </li>
        ))}
      </ul>
      <h4>Ask / call to confirm</h4>
      <ul className="ask-list">
        {card.ask.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {card.notes?.length ? (
        <ul className="note-list">
          {card.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      <Sources links={card.sources} />
    </article>
  );
}

function DriveCard({ row }: { row: DriveRow }) {
  return (
    <article className="drive-card">
      <h3>{row.place}</h3>
      <dl>
        <div>
          <dt>Drive (OSRM, no traffic)</dt>
          <dd>{row.drive}</dd>
        </div>
        <div>
          <dt>Reservations / hours</dt>
          <dd>
            {row.reserve ? <span className="chip chip-reserve">reservation flag</span> : null}
            {row.reservations}
          </dd>
        </div>
      </dl>
      {row.unverified ? <Unverified reason={row.unverifiedReason} /> : null}
      <p>{row.notes}</p>
      <Sources links={row.sources} />
    </article>
  );
}

function BanderaView({ data }: { data: BanderaContent }) {
  const { meta, weather, diet, days, foodPicks, events, drives, alerts, callSheet } = data;

  return (
    <div className="site trip-page">
      <a className="skip-link" href="#itinerary">
        Skip to itinerary
      </a>

      <header className="topbar">
        <div className="brand">
          <MapPinned aria-hidden="true" />
          <strong>{meta.stayName}</strong>
          <span>{meta.dates}</span>
        </div>
        <span className="tz-pill">{meta.timezone}</span>
      </header>

      <nav className="jump-nav" aria-label="Trip sections">
        <a href="#weather">Weather</a>
        <a href="#diet">Diet</a>
        <a href="#itinerary">Days</a>
        <a href="#food">Food</a>
        <a href="#events">Events</a>
        <a href="#drives">Drives</a>
        <a href="#alerts">Alerts</a>
        <a href="#sources">Sources</a>
      </nav>

      <main>
        <section className="hero" aria-labelledby="trip-title">
          <p className="hero-kicker">Hill Country · Thanksgiving weekend</p>
          <h1 id="trip-title">{meta.title}</h1>
          <p className="hero-dates">{meta.dates}</p>
          <p className="hero-place">
            <span>{meta.stayAddress}</span>
            <a className="tap-link" href={meta.stayPhoneTel}>
              <Phone aria-hidden="true" />
              {meta.stayPhone}
            </a>
          </p>
          <p className="as-of">
            Hours and weather as of {meta.researchedAsOf}. {meta.timezoneNote} Re-check before travel.
          </p>
          <p className="hero-drive">{data.driveIn.osrm}</p>
          <a className="btn-link" href={data.driveIn.sources[0].href} target="_blank" rel="noopener noreferrer">
            Live Google Maps route
          </a>
          <Sources links={data.driveIn.sources} />
        </section>

        <section id="weather" className="weather-strip" aria-labelledby="weather-title">
          <div className="section-head">
            <CloudSun aria-hidden="true" />
            <h2 id="weather-title">NWS weather strip</h2>
          </div>
          <p className="nws-stamp">
            {weather.pointLabel}. Last update {weather.updated}. {weather.valid}. {weather.zoneIssued}.
          </p>
          <div className="weather-days">
            {weather.days.map((day) => (
              <article key={day.id} className="weather-day">
                <p className="weather-label">{day.label}</p>
                <p className="weather-name">{day.name}</p>
                <p className="weather-sky">{day.sky}</p>
                <p className="weather-temps">
                  {day.high}
                  {day.low ? <span> / {day.low}</span> : <span className="muted"> night not fully listed</span>}
                </p>
                <p>{day.detail}</p>
                <p className="muted">Zone: {day.zone}</p>
              </article>
            ))}
          </div>
          <p>
            <Snowflake aria-hidden="true" className="inline-icon" />
            {weather.freezeWarning}
          </p>
          <p>{weather.takeaway}</p>
          <Sources links={weather.sources} />
        </section>

        <section id="diet" className="diet-callout" aria-labelledby="diet-title">
          <div className="section-head">
            <Leaf aria-hidden="true" />
            <h2 id="diet-title">{diet.title}</h2>
          </div>
          <p>{diet.summary}</p>
          <p>{diet.coconut}</p>
          {diet.coconutUnverified ? <Unverified reason={diet.coconutUnverifiedReason} /> : null}
          <Sources links={diet.sources} />
        </section>

        <section className="call-sheet" aria-labelledby="call-title">
          <h2 id="call-title">Call to confirm Thursday morning</h2>
          <p>Prefer a phone call over guessed Thanksgiving openings.</p>
          <div className="call-grid">
            {callSheet.map((row) => (
              <a key={row.tel} className="call-btn" href={row.tel}>
                <Phone aria-hidden="true" />
                <span>
                  <strong>{row.name}</strong>
                  <small>{row.phone}</small>
                  <small>{row.why}</small>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="itinerary" className="itinerary" aria-labelledby="itinerary-title">
          <div className="section-head">
            <CalendarDays aria-hidden="true" />
            <h2 id="itinerary-title">Day by day</h2>
          </div>
          <p>
            Soft assumptions: drive about 4 hours 9 minutes without heavy traffic (allow 5 hours on Thanksgiving).
            Check-in after 4:00 p.m. and checkout by 10:00 a.m. are OTA-based, confirm. Thursday restaurant openings
            in Bandera are UNVERIFIED.
          </p>
          <div className="day-jump">
            {days.map((day) => (
              <a key={day.id} href={`#day-${day.id}`}>
                {day.short}
              </a>
            ))}
          </div>
          {days.map((day) => (
            <section key={day.id} id={`day-${day.id}`} className="day-block">
              <header className="day-head">
                <h3>{day.date}</h3>
                <p>{day.title}</p>
                <p className="day-wx">
                  {day.weather.sky} · {day.weather.high}
                  {day.weather.low ? ` / ${day.weather.low}` : ""}
                </p>
                <Chips chips={day.chips} />
              </header>
              {day.items.map((item) => (
                <ItemCard key={`${day.id}-${item.time}-${item.title}`} item={item} />
              ))}
            </section>
          ))}
        </section>

        <section id="food" className="food" aria-labelledby="food-title">
          <div className="section-head">
            <Utensils aria-hidden="true" />
            <h2 id="food-title">Top 5 vegetarian food cards</h2>
          </div>
          <p>Named dishes come from the linked menus. Call to confirm Thanksgiving hours. Never assume a kitchen is open.</p>
          <div className="food-grid">
            {foodPicks.map((card) => (
              <FoodPick key={card.name} card={card} />
            ))}
          </div>
          <article className="food-card food-card-extra">
            <h3>{data.otherFoodNotes.ost.name}</h3>
            <Unverified reason={data.otherFoodNotes.ost.unverifiedReason} />
            <p>{data.otherFoodNotes.ost.address}</p>
            <p>{data.otherFoodNotes.ost.hours}</p>
            <p>{data.otherFoodNotes.ost.detail}</p>
            <Sources links={data.otherFoodNotes.ost.sources} />
          </article>
          <article className="food-card food-card-extra">
            <h3>Weaker menu evidence (not confirmed picks)</h3>
            <Unverified reason="Official current menus were not confirmed in this research pass." />
            <ul className="ask-list">
              {data.otherFoodNotes.weaker.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article className="food-card food-card-extra">
            <h3>Community Thanksgiving meals</h3>
            <Unverified reason={data.otherFoodNotes.communityMeals.unverifiedReason} />
            <p>{data.otherFoodNotes.communityMeals.detail}</p>
            <Sources links={data.otherFoodNotes.communityMeals.sources} />
          </article>
        </section>

        <section id="events" className="events" aria-labelledby="events-title">
          <h2 id="events-title">Events, Nov 26-29 only</h2>
          <p>Cowboy Christmas Parade (Dec 11-12) is after this trip and is not listed as a this-weekend event.</p>
          <div className="event-list">
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <p className="event-when">{event.when}</p>
                <h3>{event.title}</h3>
                <p className="event-where">{event.where}</p>
                {event.unverified ? <Unverified reason={event.unverifiedReason} /> : null}
                <p>{event.detail}</p>
                <Sources links={event.sources} />
              </article>
            ))}
          </div>
          <aside className="after-trip">
            <h3>{data.afterThisTrip.title}</h3>
            {data.afterThisTrip.items.map((item) => (
              <div key={item.text}>
                <p>{item.text}</p>
                <Sources links={item.sources} />
              </div>
            ))}
          </aside>
        </section>

        <section id="drives" className="drives" aria-labelledby="drives-title">
          <div className="section-head">
            <CarFront aria-hidden="true" />
            <h2 id="drives-title">Drives from Flying L (OSRM, no traffic)</h2>
          </div>
          <p>{data.tpwdNote}</p>
          <p>
            Drive times computed Nov 23, 2026, from the official Flying L address. Use Google Maps for live times and
            Thanksgiving traffic.
          </p>
          <Sources links={data.driveIn.sources} />
          <div className="drive-grid">
            {drives.map((row) => (
              <DriveCard key={row.place} row={row} />
            ))}
          </div>
        </section>

        <section id="alerts" className="alerts" aria-labelledby="alerts-title">
          <div className="section-head">
            <AlertTriangle aria-hidden="true" />
            <h2 id="alerts-title">Local alerts</h2>
          </div>
          {alerts.map((alert) => (
            <article key={alert.id} className={`alert-card tone-${alert.tone}`}>
              <h3>{alert.title}</h3>
              {alert.unverified ? <Unverified reason={alert.unverifiedReason} /> : null}
              <p>{alert.body}</p>
              <Sources links={alert.sources} />
            </article>
          ))}
        </section>

        <section className="resort-notes" aria-labelledby="resort-title">
          <h2 id="resort-title">Flying L notes</h2>
          <p>{data.resort.hours}</p>
          <p>{data.resort.checkIn.summary}</p>
          <Unverified reason={data.resort.checkIn.unverifiedReason} />
          <Sources links={data.resort.checkIn.sources} />
          <p>
            {data.resort.pool.summary} {data.resort.pool.note}
          </p>
          <Sources links={data.resort.pool.sources} />
          <p>{data.resort.activities.summary}</p>
          <Unverified reason={data.resort.activities.unverifiedReason} />
          <Sources links={data.resort.activities.sources} />
          <p>{data.resort.dining.summary}</p>
          <Unverified reason={data.resort.dining.unverifiedReason} />
          <Sources links={data.resort.dining.sources} />
          <p>{data.resort.otaAddressNote}</p>
        </section>

        <footer id="sources" className="source-footer">
          <h2>Sources</h2>
          <p className="as-of">
            Researched {meta.researchedAsOfLong}, {meta.timezone}. Hours and weather as of {meta.researchedAsOf}.
            Forecasts and hours can change; re-check before travel. Prefer call to confirm over guessed openings.
          </p>
          <Sources links={data.sources} />
        </footer>
      </main>
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
