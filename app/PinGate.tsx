"use client";

import dynamic from "next/dynamic";
import { ArrowRight, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { TripId } from "./trip-types";

const TripPlanner = dynamic(() => import("./TripPlanner"));

const PIN_TRIPS: Record<string, TripId> = { "6002": "bandera", "3605": "nola" };
const ACCESS_KEY = "trip-roadbook-unlocked";

function asTripId(value: string | null): TripId | null {
  return value === "bandera" || value === "nola" ? value : null;
}

export default function PinGate() {
  const [unlockedTrip, setUnlockedTrip] = useState<TripId | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let unlocked: TripId | null = null;
    try {
      unlocked = asTripId(window.sessionStorage.getItem(ACCESS_KEY));
    } catch {
      // The PIN still works when a browser blocks session storage.
    }
    queueMicrotask(() => setUnlockedTrip(unlocked));

    if (!unlocked) {
      document.body.classList.add("access-locked");
      inputRef.current?.focus();
    }

    return () => document.body.classList.remove("access-locked");
  }, []);

  const submitPin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trip = PIN_TRIPS[pin];
    if (trip) {
      try {
        window.sessionStorage.setItem(ACCESS_KEY, trip);
      } catch {
        // Keep access for this render even when session storage is unavailable.
      }
      document.body.classList.remove("access-locked");
      setError("");
      setUnlockedTrip(trip);
      return;
    }

    setError("That PIN isn’t right. Try again.");
    setPin("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  if (unlockedTrip) return <TripPlanner tripId={unlockedTrip} />;

  return (
    <main className="access-page">
      <div className="access-backdrop" aria-hidden="true">
        <div className="access-backdrop-bar">
          <span className="access-backdrop-logo">TX</span>
          <span />
        </div>
        <div className="access-backdrop-hero">
          <div>
            <span className="access-backdrop-kicker" />
            <strong />
            <strong />
            <small />
            <small />
          </div>
          <div className="access-backdrop-map access-backdrop-ranch">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="access-backdrop-cards">
          <span />
          <span />
          <span />
        </div>
      </div>

      <section className="access-card" aria-labelledby="access-title">
        <div className="access-brand">
          <span className="access-brand-mark"><MapPinned aria-hidden="true" /></span>
          <span>
            <strong>Trip roadbook</strong>
            <small>Private trip notes</small>
          </span>
        </div>

        <div className="access-lock"><LockKeyhole aria-hidden="true" /></div>
        <p className="access-eyebrow">Welcome back</p>
        <h1 id="access-title">Enter the trip PIN</h1>
        <p className="access-copy">
          This roadbook is private. Enter the four-digit PIN to continue.
        </p>

        <form className="access-form" onSubmit={submitPin}>
          <label htmlFor="trip-pin">4-digit PIN</label>
          <div className={`access-input-wrap ${error ? "has-error" : ""}`}>
            <input
              ref={inputRef}
              id="trip-pin"
              name="trip-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={4}
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby="pin-message"
              placeholder="••••"
            />
            <button type="submit" aria-label="Unlock roadbook" disabled={pin.length !== 4}>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <p id="pin-message" className={`access-message ${error ? "is-error" : ""}`} aria-live="polite">
            {error || "Unlimited attempts · access stays open in this tab"}
          </p>
        </form>

        <div className="access-private-note">
          <ShieldCheck aria-hidden="true" />
          <span>Protected access for invited travelers</span>
        </div>
      </section>
    </main>
  );
}
