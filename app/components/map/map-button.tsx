"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { MapModal } from "./map-modal";

interface MapButtonProps {
  cityId: string;
  cityName: string;
  cityColor: string;
  countryCode: string;
  country: string;
}

export function MapButton({
  cityId,
  cityName,
  cityColor,
  countryCode,
  country,
}: MapButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        style={{ borderColor: cityColor, color: cityColor }}
        className="hover:bg-white/5"
      >
        <MapPin size={14} />
        Ver no Mapa
      </Button>

      <MapModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        cityId={cityId}
        cityName={cityName}
        cityColor={cityColor}
        countryCode={countryCode}
        country={country}
      />
    </>
  );
}
