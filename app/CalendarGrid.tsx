"use client";

import { useMemo } from "react";
import type { DayPlan, ItineraryItem } from "./trip-types";

export const CAL_START_MIN = 6 * 60;
export const CAL_END_MIN = 25 * 60;
export const PX_PER_HOUR = 64;
export const MIN_BLOCK_PX = 48;

const KIND_LABEL: Record<ItineraryItem["kind"], string> = {
  drive: "Drive",
  food: "Food",
  activity: "Out",
  event: "Event",
  rest: "Rest",
};

function period(min: number): "AM" | "PM" {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  return Math.floor(wrapped / 60) >= 12 ? "PM" : "AM";
}

export function formatClock(min: number): string {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return m === 0 ? `${hr} ${ampm}` : `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatClockBare(min: number): string {
  const wrapped = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const hr = h % 12 || 12;
  return m === 0 ? `${hr}` : `${hr}:${String(m).padStart(2, "0")}`;
}

export function formatRange(item: ItineraryItem): string {
  if (period(item.startMin) === period(item.endMin)) {
    return `${formatClockBare(item.startMin)} to ${formatClock(item.endMin)}`;
  }
  return `${formatClock(item.startMin)} to ${formatClock(item.endMin)}`;
}

type LaidOut = {
  item: ItineraryItem;
  col: number;
  cols: number;
  top: number;
  height: number;
};

function layoutItems(items: ItineraryItem[], maxCols: number): LaidOut[] {
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
        col = Math.min(colEnd.length, maxCols - 1);
        if (colEnd.length < maxCols) colEnd.push(item.endMin);
        else colEnd[col] = Math.max(colEnd[col], item.endMin);
      } else {
        colEnd[col] = item.endMin;
      }
      assigned.push({ item, col: Math.min(col, maxCols - 1) });
    }
    const cols = Math.min(Math.max(colEnd.length, 1), maxCols);
    for (const row of assigned) {
      laid.push({
        item: row.item,
        col: row.col,
        cols,
        top: ((row.item.startMin - CAL_START_MIN) / 60) * PX_PER_HOUR,
        height: Math.max(((row.item.endMin - row.item.startMin) / 60) * PX_PER_HOUR - 3, MIN_BLOCK_PX),
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

function blockFaceTitle(item: ItineraryItem, rich: boolean): string {
  const isOptions = Boolean(item.options?.length);
  if (rich) return item.title;
  if (isOptions) return `Options: ${item.shortTitle.replace(/\s+options$/i, "")}`;
  return item.shortTitle;
}

function blockFaceDetail(item: ItineraryItem): string {
  const optionNames = item.options?.map((option) => option.shortTitle).filter(Boolean) ?? [];
  if (optionNames.length) return optionNames.join(" · ");
  return item.hoursNote || item.address || item.body;
}

function DayCanvas({
  day,
  maxCols,
  rich,
  onOpen,
}: {
  day: DayPlan;
  maxCols: number;
  rich: boolean;
  onOpen: (item: ItineraryItem) => void;
}) {
  const laid = useMemo(() => layoutItems(day.items, maxCols), [day.items, maxCols]);
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
        const isOptions = Boolean(slot.item.options?.length);
        const detail = rich ? blockFaceDetail(slot.item) : "";
        return (
          <button
            key={slot.item.id}
            type="button"
            className={`cal-block kind-${slot.item.kind}${slot.item.optional ? " is-optional" : ""}${isOptions ? " is-options" : ""}`}
            style={{ top: slot.top, height: slot.height, left, width }}
            onClick={() => onOpen(slot.item)}
          >
            <span className="cal-block-time">{formatRange(slot.item)}</span>
            <span className="cal-block-copy">
              <span className="cal-block-title">{blockFaceTitle(slot.item, rich)}</span>
              {detail ? <span className="cal-block-detail">{detail}</span> : null}
            </span>
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
  mode,
  rich,
  onOpen,
  onSelectDay,
}: {
  days: DayPlan[];
  activeDayId: string;
  mode: "day" | "week";
  rich?: boolean;
  onOpen: (item: ItineraryItem, dayId: string) => void;
  onSelectDay?: (dayId: string) => void;
}) {
  const visible = mode === "day" ? days.filter((day) => day.id === activeDayId) : days;
  const height = ((CAL_END_MIN - CAL_START_MIN) / 60) * PX_PER_HOUR;
  const showDetail = Boolean(rich);

  return (
    <div
      className={`cal-grid is-${mode}${showDetail ? " is-rich" : ""}`}
      style={{ ["--cal-days" as string]: String(days.length) }}
    >
      {mode === "week" ? (
        <div className="cal-week-head">
          <span />
          {days.map((day) => (
            <button
              key={day.id}
              type="button"
              className={`cal-week-label${day.id === activeDayId ? " is-active" : ""}`}
              onClick={() => onSelectDay?.(day.id)}
            >
              <strong>{day.weekday}</strong>
              <span>{day.short}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="cal-week-body" style={{ minHeight: height }}>
        <HourRail />
        {visible.map((day) => (
          <section
            key={day.id}
            className={`cal-day${day.id === activeDayId ? " is-active" : ""}`}
            aria-label={day.date}
          >
            <DayCanvas
              day={day}
              maxCols={2}
              rich={showDetail}
              onOpen={(item) => onOpen(item, day.id)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
