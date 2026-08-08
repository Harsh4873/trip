"use client";

// Full-screen, one-card-at-a-time swipe deck for a single trip day.
// Swipe LEFT (or the Done button) marks the event complete — the same shared
// checklist state the rest of the site syncs through Firestore. Swipe RIGHT
// (or Later) sends the card to the bottom of the deck to come back around.
// Cards under the top one peek out Tinder-style; vertical scrolling inside a
// card still works because dragging only engages on horizontal intent
// (touch-action: pan-y + a horizontal slop check).

import { Check, ExternalLink, MapPinned, Navigation, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Place, ScheduleEvent, ScheduleOption, TripDay } from "./trip-data";
import type { PlaceImage } from "./place-images";
import { directionsHref } from "./maps";

export type DeckEvent = {
  event: ScheduleEvent;
  place?: Place;
  directions?: string;
  locationName?: string;
  locationDetail?: string;
  options: ScheduleOption[];
  image?: PlaceImage;
};

const COMMIT_DISTANCE = 110;
const LEAVE_MS = 280;

export default function FocusDeck({
  day,
  events,
  checkedIds,
  onToggleChecked,
  onClose,
}: {
  day: TripDay;
  events: DeckEvent[];
  checkedIds: string[];
  onToggleChecked: (id: string) => void;
  onClose: () => void;
}) {
  // The deck holds today's not-yet-done events, in schedule order — "here is
  // where you are right now." Initialized once per open.
  const [order, setOrder] = useState<string[]>(() =>
    events.filter((item) => !checkedIds.includes(item.event.id)).map((item) => item.event.id),
  );
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const [leaving, setLeaving] = useState<{ id: string; dir: "done" | "later" } | null>(null);
  const pointer = useRef<{ id: number; startX: number; startY: number; active: boolean } | null>(
    null,
  );

  const doneCount = events.filter((item) => checkedIds.includes(item.event.id)).length;

  useEffect(() => {
    document.body.classList.add("focus-locked");
    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("focus-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const commit = (id: string, dir: "done" | "later") => {
    if (leaving) return;
    setLeaving({ id, dir });
    window.setTimeout(() => {
      if (dir === "done") {
        onToggleChecked(id);
        setOrder((current) => current.filter((item) => item !== id));
      } else {
        setOrder((current) =>
          current.length > 1 ? [...current.slice(1), current[0]] : current,
        );
      }
      setLeaving(null);
      setDrag(null);
    }, LEAVE_MS);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (leaving) return;
    if ((event.target as HTMLElement).closest("a, button, .option-swiper")) return;
    pointer.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>, topId: string) => {
    const state = pointer.current;
    if (!state || state.id !== event.pointerId || leaving) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.active) {
      if (Math.abs(dx) < 14 || Math.abs(dx) < Math.abs(dy)) return;
      state.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setDrag({ id: topId, dx, dy });
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLElement>, topId: string) => {
    const state = pointer.current;
    if (!state || state.id !== event.pointerId) return;
    pointer.current = null;
    if (!state.active) return;
    const dx = event.clientX - state.startX;
    if (dx <= -COMMIT_DISTANCE) commit(topId, "done");
    else if (dx >= COMMIT_DISTANCE) commit(topId, "later");
    else setDrag(null);
  };

  const stack = order
    .map((id) => events.find((item) => item.event.id === id))
    .filter((item): item is DeckEvent => Boolean(item))
    .slice(0, 3);
  const top = stack[0];

  return (
    <div className="focus-overlay" role="dialog" aria-modal="true" aria-label={`${day.title} — swipe deck`}>
      <div className="focus-head">
        <div>
          <strong>
            {day.weekday.slice(0, 3)} Aug {Number(day.shortDate)} · {day.stop}
          </strong>
          <span>
            {doneCount} of {events.length} done · swipe left when finished, right for later
          </span>
        </div>
        <button type="button" className="focus-close" onClick={onClose} aria-label="Close the swipe deck">
          <X aria-hidden="true" />
        </button>
      </div>

      <div className="focus-stage">
        {stack.length === 0 ? (
          <div className="focus-empty">
            <span className="focus-empty-badge">
              <Check aria-hidden="true" />
            </span>
            <strong>That&apos;s the whole day.</strong>
            <p>
              Every stop on {day.title} is checked off. Pick another day from the schedule, or
              just enjoy where you are.
            </p>
            <button type="button" onClick={onClose}>
              Back to the plan
            </button>
          </div>
        ) : (
          [...stack].reverse().map((item) => {
            const { event, directions, locationName, locationDetail, options, image } = item;
            const index = stack.indexOf(item);
            const isTop = index === 0;
            const isDragging = isTop && drag?.id === event.id && !leaving;
            const isLeaving = leaving?.id === event.id;
            const dx = isDragging ? drag.dx : 0;
            const dy = isDragging ? drag.dy : 0;
            const style = isDragging
              ? {
                  transform: `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`,
                  transition: "none",
                }
              : !isTop
                ? {
                    transform: `translateY(${index * 12}px) scale(${1 - index * 0.045})`,
                  }
                : undefined;
            return (
              <article
                key={event.id}
                className={`focus-card${isLeaving ? ` leave-${leaving.dir}` : ""}${isTop ? " is-top" : ""}`}
                style={style}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? (pointerEvent) => onPointerMove(pointerEvent, event.id) : undefined}
                onPointerUp={isTop ? (pointerEvent) => onPointerEnd(pointerEvent, event.id) : undefined}
                onPointerCancel={isTop ? (pointerEvent) => onPointerEnd(pointerEvent, event.id) : undefined}
              >
                <div className={`focus-card-media kind-${event.kind}`}>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static export uses relative public/ paths
                    <img src={image.src} alt={image.alt} loading="lazy" draggable={false} />
                  ) : null}
                  <span className="focus-time">{event.time}</span>
                  {image && <span className="event-card-credit">{image.credit}</span>}
                  <span className="focus-stamp stamp-done" style={{ opacity: Math.min(1, Math.max(0, -dx) / 100) }}>
                    Done
                  </span>
                  <span className="focus-stamp stamp-later" style={{ opacity: Math.min(1, Math.max(0, dx) / 100) }}>
                    Later
                  </span>
                </div>
                <div className="focus-card-body">
                  <h3>{event.title}</h3>
                  {event.duration && <span className="timeline-duration">{event.duration}</span>}
                  <p>{event.detail}</p>
                  {directions && locationName && (
                    <a className="timeline-location" href={directions} target="_blank" rel="noreferrer">
                      <MapPinned aria-hidden="true" />
                      <span>
                        <strong>{locationName}</strong>
                        {locationDetail && <small>{locationDetail}</small>}
                      </span>
                      <Navigation aria-hidden="true" />
                    </a>
                  )}
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
                  {options.length > 0 && (
                    <div className="option-swiper-block">
                      <strong>{event.optionsLabel ?? "Named alternatives"}</strong>
                      <div className="option-swiper">
                        {options.map((option) => (
                          <div className="option-card" key={`${event.id}-${option.name}`}>
                            <a
                              className="option-card-main"
                              href={directionsHref(option.mapQuery)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <b>{option.name}</b>
                              <small>{option.detail}</small>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {top && (
        <div className="focus-actions">
          <button
            type="button"
            className="focus-done"
            onClick={() => commit(top.event.id, "done")}
            aria-label={`Mark done: ${top.event.title}`}
          >
            <Check aria-hidden="true" />
            <span>Done</span>
          </button>
          <span className="focus-count">{order.length} left</span>
          <button
            type="button"
            className="focus-later"
            onClick={() => commit(top.event.id, "later")}
            aria-label={`Send to the bottom of the deck: ${top.event.title}`}
          >
            <RotateCcw aria-hidden="true" />
            <span>Later</span>
          </button>
        </div>
      )}
    </div>
  );
}
