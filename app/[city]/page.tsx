import { notFound } from "next/navigation";
import Link from "next/link";
import { getTripData, getMapData } from "@/app/lib/data";
import type { Metadata } from "next";
import { DayCard } from "@/app/components/day-card";
import { TripHeader } from "@/app/components/trip-header";
import { CountryFlag } from "@/app/components/country-flag";
import { Plane, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { MapButton } from "@/app/components/map/map-button";
import { AccommodationButton } from "@/app/components/accommodation-button";

type Params = { city: string };

export async function generateStaticParams(): Promise<Params[]> {
  const tripData = await getTripData();
  return tripData.cities.map((city) => ({ city: city.id }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: cityId } = await props.params;
  const tripData = await getTripData();
  const city = tripData.cities.find((c) => c.id === cityId);
  if (!city) return { title: "Não encontrado" };
  return {
    title: `${city.flag} ${city.name} — Eurotrip 2026`,
    description: `Roteiro dia a dia em ${city.name}, ${city.country} — ${city.dates} — ${city.nights} noites`,
  };
}

export default async function CityPage(props: {
  params: Promise<Params>;
}) {
  const { city: cityId } = await props.params;
  const [tripData, mapDataResult] = await Promise.all([
    getTripData(),
    getMapData(),
  ]);

  const cityIndex = tripData.cities.findIndex((c) => c.id === cityId);
  if (cityIndex === -1) notFound();

  const city = tripData.cities[cityIndex];
  const prev = cityIndex > 0 ? tripData.cities[cityIndex - 1] : null;
  const next =
    cityIndex < tripData.cities.length - 1
      ? tripData.cities[cityIndex + 1]
      : null;
  const accommodations = mapDataResult[cityId]?.accommodations ?? [];

  return (
    <div className="min-h-screen bg-background font-sans">
      <TripHeader />

      {/* Hero Banner */}
      {city.heroImage && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={city.heroImage}
            alt={`${city.name}, ${city.country}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <CountryFlag countryCode={city.countryCode} name={city.country} size={64} />
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-5xl">
                    {city.name}
                  </h1>
                  <p className="text-white/80 text-lg drop-shadow-md">
                    {city.country} — {city.dates} — {city.nights}{" "}
                    {city.nights === 1 ? "noite" : "noites"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <span>{city.days.length} {city.days.length === 1 ? "dia" : "dias"}</span>
                    <span>·</span>
                    <span>{city.days.reduce((sum, d) => sum + d.activities.length, 0)} atividades</span>
                    <span>·</span>
                    <span>Dias {city.days[0].dayNumber}{city.days.length > 1 && `-${city.days[city.days.length - 1].dayNumber}`} da viagem</span>
                    <span>·</span>
                    <MapButton cities={tripData.cities} currentIndex={cityIndex} inline mapData={mapDataResult} />
                    {accommodations.length > 0 && (
                      <>
                        <span>·</span>
                        <AccommodationButton accommodations={accommodations} cityName={city.name} cityColor={city.color} inline />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {/* City Info */}
        <div className="mb-6 flex flex-col gap-4">
          {!city.heroImage && (
            <>
              <div className="flex items-center gap-4">
                <CountryFlag countryCode={city.countryCode} name={city.country} size={64} />
                <div>
                  <h1 className="text-3xl font-bold sm:text-4xl">{city.name}</h1>
                  <p className="text-muted">
                    {city.country} — {city.dates} — {city.nights}{" "}
                    {city.nights === 1 ? "noite" : "noites"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{city.days.length} {city.days.length === 1 ? "dia" : "dias"}</span>
                    <span>·</span>
                    <span>{city.days.reduce((sum, d) => sum + d.activities.length, 0)} atividades</span>
                    <span>·</span>
                    <span>Dias {city.days[0].dayNumber}{city.days.length > 1 && `-${city.days[city.days.length - 1].dayNumber}`} da viagem</span>
                    <span>·</span>
                    <MapButton cities={tripData.cities} currentIndex={cityIndex} inline mapData={mapDataResult} />
                    {accommodations.length > 0 && (
                      <>
                        <span>·</span>
                        <AccommodationButton accommodations={accommodations} cityName={city.name} cityColor={city.color} inline />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Days */}
        <div className="flex flex-col gap-3">
          {city.days.map((day, i) => (
            <DayCard
              key={day.dayNumber}
              day={day}
              color={city.color}
              cityId={city.id}
              dayIndex={i}
            />
          ))}
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-12 flex items-center gap-3">
          {prev ? (
            <Link
              href={`/${prev.id}`}
              className="group flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-card"
            >
              <ChevronLeft size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
              <CountryFlag countryCode={prev.countryCode} name={prev.country} size={24} />
              <span className="text-sm text-muted group-hover:text-foreground transition-colors truncate">{prev.name}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="group flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-card"
            >
              <ChevronLeft size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
              <span className="text-sm text-muted group-hover:text-foreground transition-colors">Visão Geral</span>
            </Link>
          )}

          <div className="h-4 w-px bg-border shrink-0" />

          {next ? (
            <Link
              href={`/${next.id}`}
              className="group flex flex-1 items-center justify-end gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-card"
            >
              <span className="text-sm text-muted group-hover:text-foreground transition-colors truncate">{next.name}</span>
              <CountryFlag countryCode={next.countryCode} name={next.country} size={24} />
              <ChevronRight size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          ) : (
            <Link
              href="/"
              className="group flex flex-1 items-center justify-end gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-card"
            >
              <span className="text-sm text-muted group-hover:text-foreground transition-colors">Visão Geral</span>
              <ChevronRight size={16} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        <p className="flex items-center justify-center gap-1.5">
          <Plane size={14} />
          <span>Eurotrip 2026 — Lidia & Pedro</span>
          <Heart size={12} className="text-red-400 fill-red-400" />
          <span>Joquebede & Thiago — v8</span>
        </p>
      </footer>
    </div>
  );
}
