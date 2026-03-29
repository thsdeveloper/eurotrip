import { notFound } from "next/navigation";
import Link from "next/link";
import { tripData } from "@/app/data/trip";
import { mapData } from "@/app/data/map-data";
import type { Metadata } from "next";
import { TripHeader } from "@/app/components/trip-header";
import { CountryFlag } from "@/app/components/country-flag";
import { ActivityDetail } from "@/app/components/activity-detail";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

type Params = { city: string; day: string };

// Build a flat list of all days across all cities for prev/next navigation
const allDays = tripData.cities.flatMap((city, cityIdx) =>
  city.days.map((day, dayIdx) => ({
    city,
    cityIndex: cityIdx,
    day,
    dayIndex: dayIdx,
    slug: `dia-${dayIdx + 1}`,
  }))
);

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const city of tripData.cities) {
    for (let i = 0; i < city.days.length; i++) {
      params.push({ city: city.id, day: `dia-${i + 1}` });
    }
  }
  return params;
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: cityId, day: daySlug } = await props.params;
  const city = tripData.cities.find((c) => c.id === cityId);
  if (!city) return { title: "Não encontrado" };

  const dayIndex = parseInt(daySlug.replace("dia-", "")) - 1;
  const day = city.days[dayIndex];
  if (!day) return { title: "Não encontrado" };

  return {
    title: `Dia ${day.dayNumber} — ${day.title} | ${city.name} — Eurotrip 2026`,
    description: `${day.date} (${day.weekday}) — ${day.activities.length} atividades em ${city.name}`,
  };
}

export default async function DayPage(props: {
  params: Promise<Params>;
}) {
  const { city: cityId, day: daySlug } = await props.params;
  const city = tripData.cities.find((c) => c.id === cityId);
  if (!city) notFound();

  const dayIndex = parseInt(daySlug.replace("dia-", "")) - 1;
  const day = city.days[dayIndex];
  if (!day || isNaN(dayIndex)) notFound();

  const cityMapData = mapData[cityId as keyof typeof mapData];
  const pois = cityMapData?.pois ?? [];
  const accommodations = cityMapData?.accommodations ?? [];
  const transportLinks = [
    ...(cityMapData?.arrival ? [cityMapData.arrival] : []),
    ...(cityMapData?.departure ? [cityMapData.departure] : []),
  ];

  // Find this day's position in the global list for prev/next
  const globalIndex = allDays.findIndex(
    (d) => d.city.id === cityId && d.dayIndex === dayIndex
  );
  const prev = globalIndex > 0 ? allDays[globalIndex - 1] : null;
  const next = globalIndex < allDays.length - 1 ? allDays[globalIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background font-sans">
      <TripHeader />

      {/* Hero Banner */}
      {city.heroImage && (
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={city.heroImage}
            alt={`${city.name}, ${city.country}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
              <div className="flex items-center gap-3">
                <CountryFlag countryCode={city.countryCode} name={city.country} size={48} />
                <div>
                  <p className="text-sm text-white/60">{city.name} · {city.country}</p>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                    Dia {day.dayNumber} — {day.title}
                  </h1>
                  <p className="text-sm text-white/70 mt-0.5">
                    {day.date} ({day.weekday}) · {day.activities.length} atividades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        {/* Back link */}
        <Link
          href={`/${city.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para {city.name}
        </Link>

        {/* No hero fallback header */}
        {!city.heroImage && (
          <div className="mb-6 flex items-center gap-3">
            <CountryFlag countryCode={city.countryCode} name={city.country} size={48} />
            <div>
              <p className="text-sm text-muted">{city.name} · {city.country}</p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Dia {day.dayNumber} — {day.title}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {day.date} ({day.weekday}) · {day.activities.length} atividades
              </p>
            </div>
          </div>
        )}

        {/* Activities */}
        <div className="flex flex-col gap-4">
          {day.activities.map((activity, i) => (
            <ActivityDetail
              key={i}
              activity={activity}
              day={day}
              cityName={city.name}
              cityColor={city.color}
              pois={pois}
              accommodations={accommodations}
              transportLinks={transportLinks}
            />
          ))}
        </div>

        {/* Prev / Next Day Navigation */}
        <div className="mt-10 flex items-center gap-3">
          {prev ? (
            <Link
              href={`/${prev.city.id}/${prev.slug}`}
              className="group flex flex-1 items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-card"
            >
              <ChevronLeft size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted">
                  {prev.city.id !== cityId ? prev.city.name : ""} Dia {prev.day.dayNumber}
                </p>
                <p className="text-sm truncate group-hover:text-foreground transition-colors">
                  {prev.day.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <div className="h-8 w-px bg-border shrink-0" />

          {next ? (
            <Link
              href={`/${next.city.id}/${next.slug}`}
              className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-card"
            >
              <div className="min-w-0 text-right">
                <p className="text-[11px] text-muted">
                  {next.city.id !== cityId ? next.city.name : ""} Dia {next.day.dayNumber}
                </p>
                <p className="text-sm truncate group-hover:text-foreground transition-colors">
                  {next.day.title}
                </p>
              </div>
              <ChevronRight size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </div>
  );
}
