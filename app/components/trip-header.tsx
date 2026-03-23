import { tripData } from "@/app/data/trip";
import { Plane } from "lucide-react";
import { Sidebar } from "./sidebar";

export function TripHeader() {
  const { totalDays, totalCountries, cities } = tripData;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sidebar />
          <div className="flex items-center gap-2">
            <Plane size={20} className="text-blue-400" />
            <span className="font-bold text-lg">Eurotrip 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="hidden sm:inline">{totalDays} dias</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{totalCountries} países</span>
          <span className="hidden sm:inline">·</span>
          <span>{cities.length} destinos</span>
        </div>
      </div>
    </header>
  );
}
