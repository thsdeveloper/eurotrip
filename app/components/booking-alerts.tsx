import { tripData } from "@/app/data/trip";
import { TriangleAlert } from "lucide-react";

export function BookingAlerts() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-400">
          <TriangleAlert size={16} />
          <span>Reserve antecipado!</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tripData.bookingAlerts.map((alert) => (
            <span
              key={alert}
              className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
            >
              {alert}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
