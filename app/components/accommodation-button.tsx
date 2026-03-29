"use client";

import { useState, useEffect, useCallback } from "react";
import { BedDouble, X, MapPin, Calendar, Users, Lightbulb, Wifi, ChefHat, Wind, WashingMachine, Star } from "lucide-react";
import type { Accommodation } from "@/app/data/map-data";

interface AccommodationButtonProps {
  accommodations: Accommodation[];
  cityName: string;
  cityColor: string;
  inline?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={12} />,
  "Cozinha": <ChefHat size={12} />,
  "Ar condicionado": <Wind size={12} />,
  "Máquina de lavar": <WashingMachine size={12} />,
};

function AccommodationModal({
  isOpen,
  onClose,
  accommodations,
  cityName,
  cityColor,
}: {
  isOpen: boolean;
  onClose: () => void;
  accommodations: Accommodation[];
  cityName: string;
  cityColor: string;
}) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${cityColor}20` }}
            >
              <BedDouble size={18} style={{ color: cityColor }} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hospedagem</h2>
              <p className="text-xs text-muted">{cityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-card-hover cursor-pointer"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5">
          {accommodations.map((acc) => (
            <div
              key={acc.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              {/* Title + type badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">{acc.label}</h3>
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize"
                  style={{
                    backgroundColor: `${cityColor}15`,
                    color: cityColor,
                  }}
                >
                  {acc.type}
                </span>
              </div>

              {/* Neighborhood */}
              {acc.neighborhood && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin size={13} className="shrink-0" />
                  <span>{acc.neighborhood}</span>
                </div>
              )}

              {/* Dates + nights */}
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <Calendar size={13} className="shrink-0" />
                <span>
                  {acc.checkIn} — {acc.checkOut} ({acc.nights}{" "}
                  {acc.nights === 1 ? "noite" : "noites"})
                </span>
              </div>

              {/* Guests */}
              {acc.guests && (
                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                  <Users size={13} className="shrink-0" />
                  <span>{acc.guests} hóspedes</span>
                </div>
              )}

              {/* Price */}
              {(acc.pricePerNight || acc.totalPrice) && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {acc.pricePerNight && (
                    <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-sm font-medium text-emerald-400">
                      {acc.pricePerNight}/noite
                    </span>
                  )}
                  {acc.totalPrice && (
                    <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-sm font-medium text-emerald-400">
                      {acc.totalPrice} total
                    </span>
                  )}
                </div>
              )}

              {/* Amenities */}
              {acc.amenities && acc.amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {acc.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-muted"
                    >
                      {amenityIcons[amenity] || <Star size={12} />}
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              {/* Tip */}
              {acc.tip && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  <p className="text-xs leading-relaxed text-amber-300/80">{acc.tip}</p>
                </div>
              )}

              {/* Google Maps link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${acc.lat},${acc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs hover:underline transition-colors"
                style={{ color: cityColor }}
              >
                <MapPin size={12} />
                Ver no Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AccommodationButton({
  accommodations,
  cityName,
  cityColor,
  inline,
}: AccommodationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!accommodations || accommodations.length === 0) return null;

  return (
    <>
      {inline ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-xs hover:underline cursor-pointer transition-colors"
          style={{ color: cityColor }}
        >
          <BedDouble size={12} />
          Hospedagem
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-white/5 cursor-pointer transition-colors"
          style={{ borderColor: cityColor, color: cityColor }}
        >
          <BedDouble size={14} />
          Hospedagem
        </button>
      )}

      <AccommodationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        accommodations={accommodations}
        cityName={cityName}
        cityColor={cityColor}
      />
    </>
  );
}
