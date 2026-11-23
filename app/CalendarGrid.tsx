"use client";

import { useMemo } from "react";
import type { DayPlan, ItineraryItem } from "./bandera-content";

export const CAL_START_MIN = 6 * 60;
export const CAL_END_MIN = 25 * 60;
export const PX_PER_HOUR = 56;

const KIND_LABEL: Record<ItineraryItem["kind"], string> = {
  drive: "Drive",
  food: "Food",
  activity: "Out",
  event: "Event",
  rest: "Rest",
};

export function formatClock(min: number): string {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return m === 0 ? `${hr} ${ampm}` : `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatRange(item: ItineraryItem): string {
  return `${formatClock(item.startMin)} – ${formatClock(item.endMin)}`;
}

type LaidOut = {
  item: ItineraryItem;
  col: number;
  cols: number;
  top: number;
  height: number;
};

function layoutItems(items: ItineraryItem[]): LaidOut[] {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const groups: ItineraryItem[][] = [];
  let current: ItineraryItem[] = [];
  let currentEnd = -1;

  for (const item of sorted) {
    if (!current.length || item.startMin < currentEnd) {
      current.push(item);
      currentEnd = Math.max(currentEnd, item.endMin);
    } else {
      groups.push(current);
      current = [item];
      currentEnd = item.endMin;
    }
  }
  if (current.length) groups.push(current);

  const laid: LaidOut[] = [];
  for (const group of groups) {
    const colEnd: number[] = [];
    const assigned: { item: ItineraryItem; col: number }[] = [];
    for (const item of group) {
      let col = colEnd.findIndex((end) => end <= item.startMin);
      if (col === -1) {
        col = colEnd.length;
        colEnd.push(item.endMin);
      } else {
        colEnd[col] = item.endMin;
      }
      assigned.push({ item, col });
    }
    const cols = colEnd.length;
    for (const row of assigned) {
      laid.push({
        item: row.item,
        col: row.col,
        cols,
        top: ((row.item.startMin - CAL_START_MIN) / 60) * PX_PER_HOUR,
        height: Math.max(((row.item.endMin - row.item.startMin) / 60) * PX_PER_HOUR - 3, 28),
      });
    }
  }
  return laid;
}

function HourRail() {
  const hours = [];
  for (let min = CAL_START_MIN; min <= CAL_END_MIN; min += 60) {
    hours.push(min);
  }
  return (
    <div className="cal-rail" aria-hidden="true">
      {hours.map((min) => (
        <div key={min} className="cal-rail-hour" style={{ height: PX_PER_HOUR }}>
          {min === CAL_END_MIN ? "" : formatClock(min)}
        </div>
      ))}
    </div>
  );
}

function DayCanvas({
  day,
  onOpen,
}: {
  day: DayPlan;
  onOpen: (item: ItineraryItem) => void;
}) {
  const laid = useMemo(() => layoutItems(day.items), [day.items]);
  const height = ((CAL_END_MIN - CAL_START_MIN) / 60) * PX_PER_HOUR;
  const hours = [];
  for (let min = CAL_START_MIN; min < CAL_END_MIN; min += 60) hours.push(min);

  return (
    <div className="cal-canvas" style={{ height }}>
      {hours.map((min) => (
        <div
          key={min}
          className="cal-hour-line"
          style={{ top: ((min - CAL_START_MIN) / 60) * PX_PER_HOUR }}
        />
      ))}
      {laid.map((slot) => {
        const width = `calc((100% - 6px) / ${slot.cols})`;
        const left = `calc(${slot.col} * (100% - 6px) / ${slot.cols} + 3px)`;
        return (
          <button
            key={slot.item.id}
            type="button"
            className={`cal-block kind-${slot.item.kind}${slot.item.optional ? " is-optional" : ""}`}
            style={{ top: slot.top, height: slot.height, left, width }}
            onClick={() => onOpen(slot.item)}
          >
            <span className="cal-block-time">{formatRange(slot.item)}</span>
            <span className="cal-block-title">{slot.item.title}</span>
            {slot.item.unverified ? <span className="cal-block-flag">UNVERIFIED</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export function CalendarLegend() {
  return (
    <ul className="cal-legend" aria-label="Block colors">
      {(Object.keys(KIND_LABEL) as ItineraryItem["kind"][]).map((kind) => (
        <li key={kind} className={`kind-${kind}`}>
          {KIND_LABEL[kind]}
        </li>
      ))}
    </ul>
  );
}

export function CalendarGrid({
  days,
  activeDayId,
  mobile,
  onOpen,
}: {
  days: DayPlan[];
  activeDayId: string;
  mobile: boolean;
  onOpen: (item: ItineraryItem, dayId: string) => void;
}) {
  const visible = mobile ? days.filter((day) => day.id === activeDayId) : days;
  const height = ((CAL_END_MIN - CAL_START_MIN) / 60) * PX_PER_HOUR;

  return (
    <div className={`cal-grid ${mobile ? "is-mobile" : "is-desktop"}`}>
      {!mobile ? (
        <div className="cal-week-head">
          <span />
          {days.map((day) => (
            <div key={day.id} className="cal-week-label">
              <strong>{day.weekday}</strong>
              <span>{day.short}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="cal-week-body" style={{ minHeight: height }}>
        <HourRail />
        {visible.map((day) => (
          <section key={day.id} className="cal-day" aria-label={day.date}>
            <DayCanvas day={day} onOpen={(item) => onOpen(item, day.id)} />
          </section>
        ))}
      </div>
    </div>
  );
}
