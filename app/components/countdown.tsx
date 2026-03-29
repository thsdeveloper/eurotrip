"use client";

import { useState, useEffect } from "react";
import { Plane } from "lucide-react";

const TRIP_DATE = new Date("2026-09-22T00:00:00-03:00");

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

  const units = [
    { value: diff.days, label: "dias", fr: "jours" },
    { value: diff.hours, label: "horas", fr: "heures" },
    { value: diff.minutes, label: "min", fr: "min" },
    { value: diff.seconds, label: "seg", fr: "sec" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#12121a] via-[#14141f] to-[#0f0f18]">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.04),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
              Contagem regressiva
            </p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
              <p className="text-xs font-light tracking-[0.15em] text-white/50">
                para o embarque
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>

          {/* Time units */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
                <div className="group flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm sm:h-[88px] sm:w-[88px] sm:rounded-2xl">
                      <span className="text-[28px] font-extralight tabular-nums tracking-tight text-white sm:text-[36px]">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Subtle reflection */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">
                      {unit.label}
                    </span>
                  </div>
                </div>
                {i < units.length - 1 && (
                  <div className="flex flex-col items-center gap-1.5 pb-6">
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Route info */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3 text-white/35">
              <span className="text-xs font-light tracking-wide">BSB</span>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-4 bg-white/15" />
                <Plane size={12} className="text-white/25 -rotate-12" />
                <div className="h-px w-4 bg-white/15" />
              </div>
              <span className="text-xs font-light tracking-wide">GRU</span>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-4 bg-white/15" />
                <Plane size={12} className="text-white/25 -rotate-12" />
                <div className="h-px w-4 bg-white/15" />
              </div>
              <span className="text-xs font-light tracking-wide">MAD</span>
            </div>
            <p className="text-[10px] font-light tracking-[0.2em] text-white/20">
              22 SET 2026 — A AVENTURA COMEÇA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
