"use client";

import { checklist } from "@/app/data/trip";
import { useState, useEffect } from "react";
import { CircleCheckBig } from "lucide-react";

export function TripChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("eurotrip-checklist");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("eurotrip-checklist", JSON.stringify(next));
      return next;
    });
  }

  const grouped = checklist.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof checklist>
  );

  const total = checklist.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section id="checklist" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CircleCheckBig size={28} className="text-emerald-400" />
            <h2 className="text-2xl font-bold sm:text-3xl">Checklist</h2>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">
              {done}/{total}
            </span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted">{pct}%</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              className="rounded-xl border border-border bg-card p-4"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {category}
              </h3>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-card-hover"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="h-4 w-4 rounded border-border accent-emerald-500"
                    />
                    <span
                      className={
                        checked[item.id]
                          ? "text-muted line-through"
                          : ""
                      }
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
