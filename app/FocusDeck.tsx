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

// Commit thresholds follow the values real gesture libraries ship: a long
// drag past 110px, or a quick flick — trailing-window velocity ≥ 0.5 px/ms
// with at least 45px of travel in the same direction.
const COMMIT_DISTANCE = 110;
const FLICK_VELOCITY = 0.5; // px/ms
const FLICK_MIN_DISTANCE = 45;
const VELOCITY_WINDOW_MS = 110;
const LEAVE_MS = 280;
const SNACK_MS = 5000;

// Haptic tick on Android (iOS Safari has no vibration API); quiet no-op
// elsewhere. Fired at most twice per gesture: threshold-cross and commit.
function buzz(ms: number) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
  } catch {
    // Haptics are decoration only.
  }
}

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
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number; rot: number } | null>(
    null,
  );
  const [leaving, setLeaving] = useState<{ id: string; dir: "done" | "later"; dy: number } | null>(
    null,
  );
  const [snack, setSnack] = useState<{ id: string; title: string } | null>(null);
  const [announce, setAnnounce] = useState("");
  const pointer = useRef<{
    id: number;
    startX: number;
    startY: number;
    active: boolean;
    grabSign: 1 | -1;
    crossed: boolean;
    trail: { x: number; t: number }[];
  } | null>(null);
  const snackTimer = useRef<number | null>(null);

  const doneCount = events.filter((item) => checkedIds.includes(item.event.id)).length;

  const commit = (id: string, dir: "done" | "later", dy = 0) => {
    if (leaving) return;
    const item = events.find((entry) => entry.event.id === id);
    buzz(12);
    setLeaving({ id, dir, dy });
    window.setTimeout(() => {
      if (dir === "done") {
        onToggleChecked(id);
        setOrder((current) => {
          const next = current.filter((entry) => entry !== id);
          const upNext = events.find((entry) => entry.event.id === next[0]);
          setAnnounce(
            next.length === 0
              ? "Marked done. Day complete."
              : `Marked done — undo available. ${next.length} left. Next: ${upNext?.event.title ?? ""}`,
          );
          return next;
        });
        if (item) {
          if (snackTimer.current) window.clearTimeout(snackTimer.current);
          setSnack({ id, title: item.event.title });
          snackTimer.current = window.setTimeout(() => setSnack(null), SNACK_MS);
        }
      } else {
        setOrder((current) => {
          const next = current.length > 1 ? [...current.slice(1), current[0]] : current;
          const upNext = events.find((entry) => entry.event.id === next[0]);
          setAnnounce(`Sent to the bottom of the deck. Next: ${upNext?.event.title ?? ""}`);
          return next;
        });
      }
      setLeaving(null);
      setDrag(null);
    }, LEAVE_MS);
  };

  const undo = (id: string) => {
    if (snackTimer.current) window.clearTimeout(snackTimer.current);
    setSnack(null);
    onToggleChecked(id);
    setOrder((current) => (current.includes(id) ? current : [id, ...current]));
    setAnnounce("Restored to the top of the deck.");
  };

  useEffect(() => {
    document.body.classList.add("focus-locked");
    return () => {
      document.body.classList.remove("focus-locked");
      if (snackTimer.current) window.clearTimeout(snackTimer.current);
    };
  }, []);

  // Keyboard mirrors the buttons (WCAG 2.5.7: swipes always have a
  // single-pointer / keyboard equivalent).
  useEffect(() => {
    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") onClose();
      const topId = order[0];
      if (!topId || leaving) return;
      if (keyEvent.key === "ArrowLeft") commit(topId, "done");
      if (keyEvent.key === "ArrowRight") commit(topId, "later");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (leaving) return;
    if ((event.target as HTMLElement).closest("a, button, .option-swiper")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      // Grabbing the lower half pivots the card the other way, like a
      // physical card held at its edge.
      grabSign: event.clientY < rect.top + rect.height / 2 ? 1 : -1,
      crossed: false,
      trail: [],
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
    const now = event.timeStamp;
    state.trail.push({ x: event.clientX, t: now });
    while (state.trail.length > 1 && now - state.trail[0].t > VELOCITY_WINDOW_MS) {
      state.trail.shift();
    }
    if (!state.crossed && Math.abs(dx) >= COMMIT_DISTANCE) {
      state.crossed = true;
      buzz(8);
    }
    const rot = Math.max(-18, Math.min(18, dx * 0.08)) * state.grabSign;
    setDrag({ id: topId, dx, dy, rot });
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLElement>, topId: string) => {
    const state = pointer.current;
    if (!state || state.id !== event.pointerId) return;
    pointer.current = null;
    if (!state.active) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    const first = state.trail[0];
    const last = state.trail[state.trail.length - 1];
    const elapsed = first && last ? last.t - first.t : 0;
    const velocity = elapsed > 0 ? (last.x - first.x) / elapsed : 0;
    const flick =
      Math.abs(velocity) >= FLICK_VELOCITY &&
      Math.abs(dx) >= FLICK_MIN_DISTANCE &&
      Math.sign(velocity) === Math.sign(dx);
    if (dx <= -COMMIT_DISTANCE || (flick && dx < 0)) commit(topId, "done", dy);
    else if (dx >= COMMIT_DISTANCE || (flick && dx > 0)) commit(topId, "later", dy);
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
          <div className="day-progress-track" aria-hidden="true">
            {events.map((item) => (
              <i
                key={item.event.id}
                className={checkedIds.includes(item.event.id) ? "filled" : ""}
              />
            ))}
          </div>
        </div>
        <button type="button" className="focus-close" onClick={onClose} aria-label="Close the swipe deck">
          <X aria-hidden="true" />
        </button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

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
            const rotation = isDragging ? drag.rot : 0;
            // The next card scales up live with drag progress, Tinder-style.
            const dragProgress = drag && !leaving ? Math.min(1, Math.abs(drag.dx) / COMMIT_DISTANCE) : 0;
            const style = isLeaving
              ? {
                  transform: `translate(${leaving.dir === "done" ? "-140%" : "140%"}, ${Math.round(leaving.dy * 1.4)}px) rotate(${leaving.dir === "done" ? -22 : 22}deg)`,
                  opacity: 0,
                  transition: `transform ${LEAVE_MS}ms ease-in, opacity ${LEAVE_MS}ms ease-in`,
                }
              : isDragging
                ? {
                    transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`,
                    transition: "none",
                  }
                : !isTop
                  ? {
                      transform: `translateY(${index * 12 * (index === 1 ? 1 - dragProgress : 1)}px) scale(${
                        index === 1 ? 0.955 + 0.045 * dragProgress : 1 - index * 0.045
                      })`,
                    }
                  : undefined;
            return (
              <article
                key={event.id}
                className={`focus-card${isTop ? " is-top" : ""}${isDragging ? " is-dragging" : ""}`}
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

      {snack && (
        <div className="focus-snack" role="status">
          <span>Done: {snack.title}</span>
          <button type="button" onClick={() => undo(snack.id)}>
            Undo
          </button>
        </div>
      )}

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
