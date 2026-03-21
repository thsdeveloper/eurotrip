import Link from "next/link";
import { tripData } from "@/app/data/trip";
import { TripHeader } from "@/app/components/trip-header";
import { CityNav } from "@/app/components/city-nav";
import { Countdown } from "@/app/components/countdown";
import { BookingAlerts } from "@/app/components/booking-alerts";
import { BudgetTable } from "@/app/components/budget-table";
import { TripChecklist } from "@/app/components/trip-checklist";
import { Plane, Heart } from "lucide-react";
import { CountryFlag } from "@/app/components/country-flag";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <TripHeader />
      <CityNav />
      <Countdown />
      <BookingAlerts />

      {/* City Cards */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Roteiro por destino</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tripData.cities.map((city, i) => {
            const totalActivities = city.days.reduce(
              (sum, d) => sum + d.activities.length,
              0
            );
            return (
              <Link
                key={city.id}
                href={`/${city.id}`}
                id={city.id}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:bg-card-hover hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CountryFlag countryCode={city.countryCode} name={city.country} size={32} />
                    <div>
                      <h3 className="font-semibold group-hover:text-white transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-xs text-muted">{city.country}</p>
                    </div>
                  </div>
                  <span className="text-muted text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{city.dates}</span>
                  <span>•</span>
                  <span>
                    {city.nights} {city.nights === 1 ? "noite" : "noites"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">
                    {city.days.length} {city.days.length === 1 ? "dia" : "dias"}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">
                    {totalActivities} atividades
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">
                    Dias {city.days[0].dayNumber}
                    {city.days.length > 1 &&
                      `-${city.days[city.days.length - 1].dayNumber}`}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: city.color,
                      width: `${((i + 1) / tripData.cities.length) * 100}%`,
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <BudgetTable />
      <TripChecklist />

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        <p className="flex items-center justify-center gap-1.5">
          <Plane size={14} />
          <span>Eurotrip 2026 — Lidia & Pedro</span>
          <Heart size={12} className="text-red-400 fill-red-400" />
          <span>Joquebede & Thiago — v7</span>
        </p>
      </footer>
    </div>
  );
}
