"use client";

import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { X, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { CountryFlag } from "@/app/components/country-flag";
import type { City } from "@/app/data/trip";

const CityMap = dynamic(() => import("./city-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Map size={32} className="animate-pulse text-muted" />
        <p className="text-sm text-muted">Carregando mapa...</p>
      </div>
    </div>
  ),
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityId: string;
  cityName: string;
  cityColor: string;
  countryCode: string;
  country: string;
  prevCity: City | null;
  nextCity: City | null;
  onNavigate: (index: number) => void;
  prevIndex: number;
  nextIndex: number;
}

export function MapModal({
  isOpen,
  onClose,
  cityId,
  cityName,
  cityColor,
  countryCode,
  country,
  prevCity,
  nextCity,
  onNavigate,
  prevIndex,
  nextIndex,
}: MapModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Prev */}
          {prevCity ? (
            <button
              onClick={() => onNavigate(prevIndex)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-left transition-colors hover:bg-card-hover cursor-pointer"
            >
              <ChevronLeft size={14} className="shrink-0 text-muted" />
              <CountryFlag countryCode={prevCity.countryCode} name={prevCity.country} size={16} />
              <span className="hidden sm:inline truncate text-xs font-medium max-w-[100px]">{prevCity.name}</span>
            </button>
          ) : (
            <div className="w-16" />
          )}

          {/* Centro: cidade atual */}
          <div className="flex items-center gap-3">
            <CountryFlag countryCode={countryCode} name={country} size={24} />
            <div className="text-center">
              <h2 className="text-lg font-bold leading-tight">{cityName}</h2>
              <p className="text-xs text-muted">Roteiro no mapa</p>
            </div>
          </div>

          {/* Next + Close */}
          <div className="flex items-center gap-2">
            {nextCity ? (
              <button
                onClick={() => onNavigate(nextIndex)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-right transition-colors hover:bg-card-hover cursor-pointer"
              >
                <span className="hidden sm:inline truncate text-xs font-medium max-w-[100px]">{nextCity.name}</span>
                <CountryFlag countryCode={nextCity.countryCode} name={nextCity.country} size={16} />
                <ChevronRight size={14} className="shrink-0 text-muted" />
              </button>
            ) : (
              <div className="w-16" />
            )}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-card-hover cursor-pointer"
              aria-label="Fechar mapa"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <CityMap cityId={cityId} color={cityColor} />
      </div>

      {/* Legenda */}
      <div className="border-t border-border">
        <div className="flex flex-wrap items-center gap-4 px-4 py-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full border border-white"
              style={{ background: cityColor }}
            />
            Ponto de interesse
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-0 w-5 border-t border-dashed"
              style={{ borderColor: cityColor }}
            />
            Caminhada
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-0 w-5 border-t-2 border-solid"
              style={{ borderColor: "#0066cc" }}
            />
            Trem / Metrô
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-0 w-5 border-t-2 border-dashed"
              style={{ borderColor: "#f59e0b" }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#f59e0b"/>
            </svg>
            Voo
          </span>
        </div>
      </div>
    </div>
  );
}
