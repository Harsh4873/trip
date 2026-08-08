"use client";

import dynamic from "next/dynamic";
import { ArrowRight, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const TripPlanner = dynamic(() => import("./TripPlanner"));

const ACCESS_PIN = "6002";
const ACCESS_KEY = "trip-roadbook-unlocked";

export default function PinGate() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let unlocked = false;
    try {
      unlocked = window.sessionStorage.getItem(ACCESS_KEY) === "true";
    } catch {
      // The PIN still works when a browser blocks session storage.
    }
    queueMicrotask(() => setIsUnlocked(unlocked));

    if (!unlocked) {
      document.body.classList.add("access-locked");
      inputRef.current?.focus();
    }

    return () => document.body.classList.remove("access-locked");
  }, []);

  const submitPin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pin === ACCESS_PIN) {
      try {
        window.sessionStorage.setItem(ACCESS_KEY, "true");
      } catch {
        // Keep access for this render even when session storage is unavailable.
      }
      document.body.classList.remove("access-locked");
      setError("");
      setIsUnlocked(true);
      return;
    }

    setError("That PIN isn’t right. Try again.");
    setPin("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  if (isUnlocked) return <TripPlanner />;

  return (
    <main className="access-page">
      <div className="access-backdrop" aria-hidden="true">
        <div className="access-backdrop-bar">
          <span className="access-backdrop-logo">NM</span>
          <span />
        </div>
        <div className="access-backdrop-hero">
          <div>
            <span />
            <strong />
            <strong />
            <small />
            <small />
          </div>
          <div className="access-backdrop-map">
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
            <strong>New Mexico Roadbook</strong>
            <small>Private trip planner</small>
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
