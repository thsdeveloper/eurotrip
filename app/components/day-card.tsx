"use client";

import type { Day } from "@/app/data/trip";
import type { MapPOI, Accommodation, TransportLink } from "@/app/data/map-data";
import { useState } from "react";
import { TripIcon } from "./trip-icon";
import { Lightbulb, ChevronRight } from "lucide-react";
import { ActivityModal } from "./activity-modal";

interface DayCardProps {
  day: Day;
  color: string;
  cityName: string;
  pois: MapPOI[];
  accommodations: Accommodation[];
  transportLinks: TransportLink[];
}

export function DayCard({ day, color, cityName, pois, accommodations, transportLinks }: DayCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Day Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-card-hover"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {day.dayNumber}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>{day.date}</span>
              <span>•</span>
              <span>{day.weekday}</span>
            </div>
            <h3 className="font-semibold truncate">{day.title}</h3>
          </div>
          <span className="text-muted text-sm shrink-0">
            {expanded ? "▾" : "▸"}
          </span>
        </button>

        {/* Activities */}
        {expanded && (
          <div className="border-t border-border">
            {day.activities.map((activity, i) => (
              <button
                key={i}
                onClick={() => setSelectedActivity(i)}
                className="flex w-full gap-4 border-b border-border/50 px-5 py-3.5 last:border-0 text-left transition-colors hover:bg-card-hover group cursor-pointer"
              >
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <TripIcon name={activity.icon} className="text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-muted">
                        {activity.time}
                      </span>
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {activity.cost && (
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                          {activity.cost}
                        </span>
                      )}
                      <ChevronRight size={14} className="text-muted/50 group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                  {activity.description && (
                    <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-1">
                      {activity.description}
                    </p>
                  )}
                  {activity.tip && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
                      <Lightbulb size={14} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{activity.tip}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity !== null && (
        <ActivityModal
          isOpen={true}
          onClose={() => setSelectedActivity(null)}
          activity={day.activities[selectedActivity]}
          activityIndex={selectedActivity}
          day={day}
          cityName={cityName}
          cityColor={color}
          pois={pois}
          accommodations={accommodations}
          transportLinks={transportLinks}
          allActivities={day.activities}
          onNavigate={(index) => setSelectedActivity(index)}
        />
      )}
    </>
  );
}
