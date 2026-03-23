import { tripData } from "@/app/data/trip";
import { Plane, Heart } from "lucide-react";
import { CountryFlag } from "./country-flag";

export function TripHeader() {
  const { travelers, flightDomesticOut, flightOut, flightBack, flightDomesticBack, totalDays, totalCountries, cities } = tripData;

  return (
    <header className="relative overflow-hidden border-b border-border bg-card">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Plane size={32} className="text-blue-400" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Eurotrip 2026
              </h1>
            </div>
            <p className="text-lg text-muted">
              22 de Setembro — 13 de Outubro
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <StatBadge value={`${totalDays}`} label="dias" />
            <StatBadge value={`${totalCountries}`} label="países" />
            <StatBadge value={`${cities.length}`} label="destinos" />
            <StatBadge value="4" label="viajantes" />
          </div>

          {/* Travelers */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {travelers.map((t, i) => (
                <span key={t.name}>
                  <span className="mr-1">{t.emoji}</span>
                  <span className="font-medium">{t.name}</span>
                  {i === 1 && (
                    <Heart size={14} className="ml-2 inline text-red-400 fill-red-400" />
                  )}
                  {i < travelers.length - 1 && i !== 1 && (
                    <span className="ml-1 text-muted">&</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Flights */}
          <div className="flex flex-col gap-2">
            {[flightDomesticOut, flightOut, flightBack, flightDomesticBack].map((flight) => (
              <div
                key={flight.label}
                className="flex flex-col gap-2 rounded-lg border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                  <Plane size={16} />
                  <span>{flight.label}</span>
                </div>
                <div className="text-sm">
                  <span className="font-mono font-medium">{flight.route}</span>
                  <span className="mx-2 text-muted">|</span>
                  <span className="text-muted">{flight.time}</span>
                </div>
                <div className="text-xs text-muted">{flight.details}</div>
              </div>
            ))}
          </div>

          {/* Route */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 font-semibold">
              <CountryFlag countryCode="BR" name="Brasil" size={16} />
              <span className="font-mono">BSB</span>
            </span>
            <span className="text-muted">→</span>
            <span className="flex items-center gap-1.5">
              <CountryFlag countryCode="BR" name="Brasil" size={16} />
              <span className="font-mono text-muted">GRU</span>
            </span>
            {cities.map((city, i) => (
              <span key={city.id} className="flex items-center gap-2">
                <span className="text-muted">→</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CountryFlag countryCode={city.countryCode} name={city.country} size={16} />
                  {city.name}
                </span>
                {i === cities.length - 1 && (
                  <>
                    <span className="text-muted">→</span>
                    <span className="flex items-center gap-1.5">
                      <CountryFlag countryCode="BR" name="Brasil" size={16} />
                      <span className="font-mono text-muted">GRU</span>
                    </span>
                    <span className="text-muted">→</span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CountryFlag countryCode="BR" name="Brasil" size={16} />
                      <span className="font-mono">BSB</span>
                    </span>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm">
      <span className="font-bold">{value}</span>
      <span className="text-muted">{label}</span>
    </div>
  );
}
