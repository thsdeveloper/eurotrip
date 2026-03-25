"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { MapModal } from "./map-modal";
import type { City } from "@/app/data/trip";

interface MapButtonProps {
  cities: City[];
  currentIndex: number;
  inline?: boolean;
}

export function MapButton({ cities, currentIndex, inline }: MapButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const city = cities[activeIndex];
  const prev = activeIndex > 0 ? cities[activeIndex - 1] : null;
  const next = activeIndex < cities.length - 1 ? cities[activeIndex + 1] : null;

  function handleOpen() {
    setActiveIndex(currentIndex);
    setIsOpen(true);
  }

  return (
    <>
      {inline ? (
        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-1 text-xs hover:underline cursor-pointer transition-colors"
          style={{ color: cities[currentIndex].color }}
        >
          <MapPin size={12} />
          Ver no Mapa
        </button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          style={{ borderColor: cities[currentIndex].color, color: cities[currentIndex].color }}
          className="hover:bg-white/5"
        >
          <MapPin size={14} />
          Ver no Mapa
        </Button>
      )}

      <MapModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        cityId={city.id}
        cityName={city.name}
        cityColor={city.color}
        countryCode={city.countryCode}
        country={city.country}
        prevCity={prev}
        nextCity={next}
        onNavigate={setActiveIndex}
        prevIndex={activeIndex - 1}
        nextIndex={activeIndex + 1}
      />
    </>
  );
}
