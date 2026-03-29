import Link from "next/link";
import type { Day } from "@/app/data/trip";
import { TripIcon } from "./trip-icon";
import { ChevronRight } from "lucide-react";

interface DayCardProps {
  day: Day;
  color: string;
  cityId: string;
  dayIndex: number;
}

export function DayCard({ day, color, cityId, dayIndex }: DayCardProps) {
  return (
    <Link
      href={`/${cityId}/dia-${dayIndex + 1}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-card-hover"
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
          <span>·</span>
          <span>{day.weekday}</span>
        </div>
        <h3 className="font-semibold truncate">{day.title}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {day.activities.slice(0, 5).map((activity, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted"
            >
              <TripIcon name={activity.icon} size={11} />
              <span className="hidden sm:inline truncate max-w-[120px]">{activity.title}</span>
            </span>
          ))}
          {day.activities.length > 5 && (
            <span className="text-[11px] text-muted">+{day.activities.length - 5}</span>
          )}
        </div>
      </div>
      <ChevronRight size={16} className="text-muted/50 group-hover:text-foreground transition-colors shrink-0" />
    </Link>
  );
}
