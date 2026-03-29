import { notFound } from "next/navigation";
import Link from "next/link";
import { tripData } from "@/app/data/trip";
import { mapData } from "@/app/data/map-data";
import type { Metadata } from "next";
import { TripHeader } from "@/app/components/trip-header";
import { CountryFlag } from "@/app/components/country-flag";
import { ActivityDetail } from "@/app/components/activity-detail";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

type Params = { city: string; day: string; activity: string };

// Build a flat list of all activities across the entire trip for prev/next
const allActivities = tripData.cities.flatMap((city) =>
  city.days.flatMap((day, dayIdx) =>
    day.activities.map((activity, actIdx) => ({
      city,
      day,
      daySlug: `dia-${dayIdx + 1}`,
      activitySlug: `atividade-${actIdx + 1}`,
      activity,
    }))
  )
);

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const city of tripData.cities) {
    for (let d = 0; d < city.days.length; d++) {
      for (let a = 0; a < city.days[d].activities.length; a++) {
        params.push({
          city: city.id,
          day: `dia-${d + 1}`,
          activity: `atividade-${a + 1}`,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: cityId, day: daySlug, activity: actSlug } = await props.params;
  const city = tripData.cities.find((c) => c.id === cityId);
  if (!city) return { title: "Não encontrado" };

  const dayIndex = parseInt(daySlug.replace("dia-", "")) - 1;
  const day = city.days[dayIndex];
  if (!day) return { title: "Não encontrado" };

  const actIndex = parseInt(actSlug.replace("atividade-", "")) - 1;
  const activity = day.activities[actIndex];
  if (!activity) return { title: "Não encontrado" };

  return {
    title: `${activity.title} | Dia ${day.dayNumber} · ${city.name} — Eurotrip 2026`,
    description: activity.description || `${activity.time} — ${day.date} (${day.weekday})`,
  };
}

export default async function ActivityPage(props: {
  params: Promise<Params>;
}) {
  const { city: cityId, day: daySlug, activity: actSlug } = await props.params;
  const city = tripData.cities.find((c) => c.id === cityId);
  if (!city) notFound();

  const dayIndex = parseInt(daySlug.replace("dia-", "")) - 1;
  const day = city.days[dayIndex];
  if (!day || isNaN(dayIndex)) notFound();

  const actIndex = parseInt(actSlug.replace("atividade-", "")) - 1;
  const activity = day.activities[actIndex];
  if (!activity || isNaN(actIndex)) notFound();

  const cityMapData = mapData[cityId as keyof typeof mapData];
  const pois = cityMapData?.pois ?? [];
  const transportLinks = [
    ...(cityMapData?.arrival ? [cityMapData.arrival] : []),
    ...(cityMapData?.departure ? [cityMapData.departure] : []),
  ];

  // Find prev/next activity in the global list
  const globalIndex = allActivities.findIndex(
    (a) =>
      a.city.id === cityId &&
      a.daySlug === daySlug &&
      a.activitySlug === actSlug
  );
  const prev = globalIndex > 0 ? allActivities[globalIndex - 1] : null;
  const next = globalIndex < allActivities.length - 1 ? allActivities[globalIndex + 1] : null;

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
                  <p className="text-sm text-white/60">
                    {city.name} · Dia {day.dayNumber} · {day.date} ({day.weekday})
                  </p>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                    {activity.title}
                  </h1>
                  <p className="text-sm text-white/70 mt-0.5">
                    {activity.time} · {actIndex + 1}/{day.activities.length} atividades do dia
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
          href={`/${city.id}/${daySlug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Dia {day.dayNumber} — {day.title}
        </Link>

        {/* No hero fallback header */}
        {!city.heroImage && (
          <div className="mb-6 flex items-center gap-3">
            <CountryFlag countryCode={city.countryCode} name={city.country} size={48} />
            <div>
              <p className="text-sm text-muted">
                {city.name} · Dia {day.dayNumber} · {day.date} ({day.weekday})
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {activity.title}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {activity.time} · {actIndex + 1}/{day.activities.length} atividades do dia
              </p>
            </div>
          </div>
        )}

        {/* Activity Detail */}
        <ActivityDetail
          activity={activity}
          day={day}
          cityName={city.name}
          cityColor={city.color}
          pois={pois}
          transportLinks={transportLinks}
        />

        {/* Prev / Next Activity Navigation */}
        <div className="mt-10 flex items-center gap-3">
          {prev ? (
            <Link
              href={`/${prev.city.id}/${prev.daySlug}/${prev.activitySlug}`}
              className="group flex flex-1 items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-card"
            >
              <ChevronLeft size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
              <div className="min-w-0">
                {prev.city.id !== cityId && (
                  <p className="text-[11px] text-muted">{prev.city.name}</p>
                )}
                {prev.day.dayNumber !== day.dayNumber && (
                  <p className="text-[11px] text-muted">Dia {prev.day.dayNumber}</p>
                )}
                <p className="text-sm truncate group-hover:text-foreground transition-colors">
                  {prev.activity.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <div className="h-8 w-px bg-border shrink-0" />

          {next ? (
            <Link
              href={`/${next.city.id}/${next.daySlug}/${next.activitySlug}`}
              className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-card"
            >
              <div className="min-w-0 text-right">
                {next.city.id !== cityId && (
                  <p className="text-[11px] text-muted">{next.city.name}</p>
                )}
                {next.day.dayNumber !== day.dayNumber && (
                  <p className="text-[11px] text-muted">Dia {next.day.dayNumber}</p>
                )}
                <p className="text-sm truncate group-hover:text-foreground transition-colors">
                  {next.activity.title}
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
