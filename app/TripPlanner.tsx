"use client";

import { ExternalLink, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  BanderaContent,
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

function DayRow({ item }: { item: ItineraryItem }) {
  return (
    <li className="day-row">
      <p className="row-time">{item.time}</p>
      <div className="row-body">
        <h3>{item.title}</h3>
        {item.unverified ? <Unverified reason={item.unverifiedReason} /> : null}
        <p>{item.body}</p>
        {item.callToConfirm ? <p className="call-line">{item.callToConfirm}</p> : null}
        <Sources links={item.sources} />
      </div>
    </li>
  );
}

function FoodBlock({ card }: { card: FoodCard }) {
  const tel = card.phone?.replace(/[^\d+]/g, "");
  return (
    <article className="compact-card">
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
      <ul className="ask-list">
        {card.ask.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <Sources links={card.sources} />
    </article>
  );
}

function BanderaView({ data }: { data: BanderaContent }) {
  const { meta, weather, diet, days, foodPicks, events, drives, alerts } = data;

  return (
    <div className="site trip-page">
      <a className="skip-link" href="#days">
        Skip to days
      </a>

      <header className="topbar">
        <div className="brand">
          <strong>{meta.stayName}</strong>
          <span>{meta.dates}</span>
        </div>
      </header>

      <main>
        <section className="lede" aria-labelledby="trip-title">
          <h1 id="trip-title">{meta.title}</h1>
          <p className="lede-place">
            {meta.stayAddress}
            <a className="tap-link" href={meta.stayPhoneTel}>
              <Phone aria-hidden="true" />
              {meta.stayPhone}
            </a>
          </p>
          <p>
            {data.driveIn.blurb} {data.driveIn.osrmShort}
          </p>
          <p className="as-of">
            Hours and weather as of {meta.researchedAsOf}. {meta.timezoneNote} Re-check before
            travel.
          </p>
          <div className="lede-actions">
            <a className="btn-link" href={data.driveIn.sources[0].href} target="_blank" rel="noopener noreferrer">
              Maps: Katy to Flying L
            </a>
            <a className="btn-link btn-link-quiet" href={data.driveIn.sources[1].href} target="_blank" rel="noopener noreferrer">
              Maps: Flying L to Katy
            </a>
          </div>
          <p className="diet-line">{diet.title}. {diet.summary}</p>
        </section>

        <section id="days" className="days" aria-labelledby="days-title">
          <h2 id="days-title" className="visually-hidden">
            Day by day
          </h2>
          {days.map((day) => (
            <section key={day.id} id={`day-${day.id}`} className="day-card" aria-labelledby={`day-h-${day.id}`}>
              <header className="day-card-head">
                <p className="day-weekday">{day.weekday}</p>
                <div>
                  <h2 id={`day-h-${day.id}`}>{day.date}</h2>
                  <p>{day.title}</p>
                </div>
                <p className="day-wx">
                  {day.weather.sky}
                  <span>
                    {day.weather.high}
                    {day.weather.low ? ` / ${day.weather.low}` : ""}
                  </span>
                </p>
              </header>
              <ol className="day-rows">
                {day.items.map((item) => (
                  <DayRow key={`${day.id}-${item.time}-${item.title}`} item={item} />
                ))}
              </ol>
            </section>
          ))}
        </section>

        <section id="food" className="compact-section" aria-labelledby="food-title">
          <h2 id="food-title">Food</h2>
          <p>
            Strict ovo-lacto. Named dishes come from the linked menus. Call to confirm
            Thanksgiving hours. Never assume a kitchen is open.
          </p>
          {diet.coconutUnverified ? <Unverified reason={diet.coconutUnverifiedReason} /> : null}
          <p>{diet.coconut}</p>
          <div className="compact-stack">
            {foodPicks.map((card) => (
              <FoodBlock key={card.name} card={card} />
            ))}
            <article className="compact-card">
              <h3>{data.otherFoodNotes.ost.name}</h3>
              <Unverified reason={data.otherFoodNotes.ost.unverifiedReason} />
              <p>{data.otherFoodNotes.ost.address}</p>
              <p>{data.otherFoodNotes.ost.hours}</p>
              <p>{data.otherFoodNotes.ost.detail}</p>
              <Sources links={data.otherFoodNotes.ost.sources} />
            </article>
          </div>
        </section>

        <section id="weather" className="compact-section" aria-labelledby="weather-title">
          <h2 id="weather-title">Weather</h2>
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
        </section>

        <section id="alerts" className="compact-section" aria-labelledby="alerts-title">
          <h2 id="alerts-title">Alerts</h2>
          {alerts.map((alert) => (
            <article key={alert.id} className={`alert-row tone-${alert.tone}`}>
              <h3>{alert.title}</h3>
              {alert.unverified ? <Unverified reason={alert.unverifiedReason} /> : null}
              <p>{alert.body}</p>
              <Sources links={alert.sources} />
            </article>
          ))}
        </section>

        <section id="links" className="compact-section" aria-labelledby="links-title">
          <h2 id="links-title">Links</h2>
          <p>{data.tpwdNote}</p>
          <h3>This weekend</h3>
          <ul className="link-events">
            {events.map((event) => (
              <li key={event.id}>
                <p className="event-when">{event.when}</p>
                <strong>{event.title}</strong>
                <p className="muted">{event.where}</p>
                {event.unverified ? <Unverified reason={event.unverifiedReason} /> : null}
                <p>{event.detail}</p>
                <Sources links={event.sources} />
              </li>
            ))}
          </ul>
          <h3>Drives from Flying L (OSRM, no traffic)</h3>
          <dl className="drive-dl">
            {drives.map((row) => (
              <div key={row.place}>
                <dt>{row.place}</dt>
                <dd>
                  {row.drive}. {row.reservations}. {row.notes}
                  {row.unverified ? <Unverified reason={row.unverifiedReason} /> : null}
                  <Sources links={row.sources} />
                </dd>
              </div>
            ))}
          </dl>
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
          <h3>{data.afterThisTrip.title}</h3>
          {data.afterThisTrip.items.map((item) => (
            <div key={item.text}>
              <p>{item.text}</p>
              <Sources links={item.sources} />
            </div>
          ))}
          <h3>Sources</h3>
          <p className="as-of">
            Researched {meta.researchedAsOfLong}, {meta.timezone}. Prefer call to confirm over
            guessed openings.
          </p>
          <Sources links={data.sources} />
        </section>
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
