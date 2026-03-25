import { notFound } from "next/navigation";
import Link from "next/link";
import { tripData } from "@/app/data/trip";
import { mapData } from "@/app/data/map-data";
import type { Metadata } from "next";
import { DayCard } from "@/app/components/day-card";
import { TripHeader } from "@/app/components/trip-header";
import { CountryFlag } from "@/app/components/country-flag";
import { Plane, Heart, Rocket } from "lucide-react";
import { MapButton } from "@/app/components/map/map-button";

type Params = { city: string };

export function generateStaticParams(): Params[] {
  return tripData.cities.map((city) => ({ city: city.id }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: cityId } = await props.params;
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
  const cityIndex = tripData.cities.findIndex((c) => c.id === cityId);
  if (cityIndex === -1) notFound();

  const city = tripData.cities[cityIndex];
  const cityMapData = mapData[cityId as keyof typeof mapData];
  const pois = cityMapData?.pois ?? [];
  const accommodations = cityMapData?.accommodations ?? [];
  const transportLinks = [
    ...(cityMapData?.arrival ? [cityMapData.arrival] : []),
    ...(cityMapData?.departure ? [cityMapData.departure] : []),
  ];
  const prev = cityIndex > 0 ? tripData.cities[cityIndex - 1] : null;
  const next =
    cityIndex < tripData.cities.length - 1
      ? tripData.cities[cityIndex + 1]
      : null;

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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* City Info */}
        <div className="mb-10 flex flex-col gap-4">
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
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {city.transport && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <Rocket size={16} className="text-muted" />
                <span className="text-muted">Deslocamento:</span>
                <span className="font-medium">{city.transport}</span>
              </div>
            )}
            <MapButton
              cities={tripData.cities}
              currentIndex={cityIndex}
            />
          </div>
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

        {/* Prev / Next Navigation */}
        <div className="mt-12 flex items-stretch gap-4">
          {prev ? (
            <Link
              href={`/${prev.id}`}
              className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
            >
              <span className="text-muted">←</span>
              <div>
                <p className="text-xs text-muted">Anterior</p>
                <p className="flex items-center gap-1.5 font-semibold">
                  <CountryFlag countryCode={prev.countryCode} name={prev.country} size={16} />
                  {prev.name}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
            >
              <span className="text-muted">←</span>
              <div>
                <p className="text-xs text-muted">Voltar</p>
                <p className="font-semibold">Visão Geral</p>
              </div>
            </Link>
          )}
          {next ? (
            <Link
              href={`/${next.id}`}
              className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-card p-5 text-right transition-colors hover:bg-card-hover"
            >
              <div>
                <p className="text-xs text-muted">Próximo</p>
                <p className="flex items-center gap-1.5 font-semibold">
                  <CountryFlag countryCode={next.countryCode} name={next.country} size={16} />
                  {next.name}
                </p>
              </div>
              <span className="text-muted">→</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-card p-5 text-right transition-colors hover:bg-card-hover"
            >
              <div>
                <p className="text-xs text-muted">Voltar</p>
                <p className="font-semibold">Visão Geral</p>
              </div>
              <span className="text-muted">→</span>
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
          <span>Joquebede & Thiago — v7</span>
        </p>
      </footer>
    </div>
  );
}
