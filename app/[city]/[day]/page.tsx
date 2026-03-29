import { notFound } from "next/navigation";
import Link from "next/link";
import { getTripData } from "@/app/lib/data";
import type { Metadata } from "next";
import { TripHeader } from "@/app/components/trip-header";
import { CountryFlag } from "@/app/components/country-flag";
import { TripIcon } from "@/app/components/trip-icon";
import { ChevronLeft, ChevronRight, ArrowLeft, Lightbulb } from "lucide-react";

type Params = { city: string; day: string };

export async function generateStaticParams(): Promise<Params[]> {
  const tripData = await getTripData();
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
  const tripData = await getTripData();
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
  const tripData = await getTripData();
  const city = tripData.cities.find((c) => c.id === cityId);
  if (!city) notFound();

  const dayIndex = parseInt(daySlug.replace("dia-", "")) - 1;
  const day = city.days[dayIndex];
  if (!day || isNaN(dayIndex)) notFound();

  const daySlugStr = `dia-${dayIndex + 1}`;

  // Build flat list of all days for prev/next navigation
  const allDays = tripData.cities.flatMap((c, cityIdx) =>
    c.days.map((d, dIdx) => ({
      city: c,
      cityIndex: cityIdx,
      day: d,
      dayIndex: dIdx,
      slug: `dia-${dIdx + 1}`,
    }))
  );

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
        <div className="flex flex-col gap-3">
          {day.activities.map((activity, i) => (
            <Link
              key={i}
              href={`/${city.id}/${daySlugStr}/atividade-${i + 1}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-card-hover"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${city.color}20` }}
              >
                <TripIcon name={activity.icon} size={20} className="text-muted group-hover:text-foreground transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-muted">{activity.time}</span>
                <h3 className="font-semibold truncate">{activity.title}</h3>
                {activity.description && (
                  <p className="mt-0.5 text-xs text-muted leading-relaxed line-clamp-1">
                    {activity.description}
                  </p>
                )}
                {activity.tip && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-400">
                    <Lightbulb size={11} className="shrink-0" />
                    <span className="line-clamp-1">{activity.tip}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {activity.cost && (
                  <span className="hidden sm:inline rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    {activity.cost}
                  </span>
                )}
                <ChevronRight size={14} className="text-muted/50 group-hover:text-foreground transition-colors" />
              </div>
            </Link>
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
