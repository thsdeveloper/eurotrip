"use client";

import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { X, Map } from "lucide-react";
import { CountryFlag } from "@/app/components/country-flag";

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
}

export function MapModal({
  isOpen,
  onClose,
  cityId,
  cityName,
  cityColor,
  countryCode,
  country,
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
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <CountryFlag countryCode={countryCode} name={country} size={24} />
          <div>
            <h2 className="text-lg font-bold">{cityName}</h2>
            <p className="text-xs text-muted">Roteiro no mapa</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-card-hover cursor-pointer"
          aria-label="Fechar mapa"
        >
          <X size={18} />
        </button>
      </div>

      {/* Map */}
      <div className="flex-1">
        <CityMap cityId={cityId} color={cityColor} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted">
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
      </div>
    </div>
  );
}
