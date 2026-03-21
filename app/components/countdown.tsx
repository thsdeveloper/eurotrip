"use client";

import { useState, useEffect } from "react";
import { Plane } from "lucide-react";

const TRIP_DATE = new Date("2026-09-22T19:20:00-03:00");

export function Countdown() {
  const [diff, setDiff] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    function calc() {
      const now = new Date();
      const ms = TRIP_DATE.getTime() - now.getTime();
      if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(ms / 86400000),
        hours: Math.floor((ms % 86400000) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
      };
    }
    setDiff(calc());
    const timer = setInterval(() => setDiff(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!diff) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted">Contagem regressiva para o embarque</p>
        <div className="flex gap-4">
          <TimeUnit value={diff.days} label="dias" />
          <TimeUnit value={diff.hours} label="horas" />
          <TimeUnit value={diff.minutes} label="min" />
          <TimeUnit value={diff.seconds} label="seg" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Plane size={14} />
          <span>22/set/2026 — BSB → GRU → MAD — A aventura começa!</span>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold tabular-nums sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
