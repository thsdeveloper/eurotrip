import type { City } from "@/app/data/trip";
import { mapData } from "@/app/data/map-data";
import { DayCard } from "./day-card";
import { Rocket } from "lucide-react";
import { CountryFlag } from "./country-flag";

export function CitySection({ city }: { city: City }) {
  const cityMapData = mapData[city.id as keyof typeof mapData];
  const pois = cityMapData?.pois ?? [];
  const accommodations = cityMapData?.accommodations ?? [];
  const transportLinks = [
    ...(cityMapData?.arrival ? [cityMapData.arrival] : []),
    ...(cityMapData?.departure ? [cityMapData.departure] : []),
  ];
  return (
    <section id={city.id} className={`city-${city.id}`}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* City Header */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CountryFlag countryCode={city.countryCode} name={city.country} size={32} />
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{city.name}</h2>
              <p className="text-sm text-muted">
                {city.country} — {city.dates} — {city.nights}{" "}
                {city.nights === 1 ? "noite" : "noites"}
              </p>
            </div>
          </div>
          {city.transport && (
            <div className="flex items-center gap-2 text-xs text-muted">
              <Rocket size={14} />
              <span>{city.transport}</span>
            </div>
          )}
        </div>

        {/* Days */}
        <div className="flex flex-col gap-6">
          {city.days.map((day) => (
            <DayCard
              key={day.dayNumber}
              day={day}
              color={city.color}
              cityName={city.name}
              heroImage={city.heroImage}
              pois={pois}
              accommodations={accommodations}
              transportLinks={transportLinks}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
