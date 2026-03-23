"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapData, type MapPOI, type TrainRoute } from "@/app/data/map-data";

interface CityMapProps {
  cityId: string;
  color: string;
}

function createMarkerIcon(color: string, index: number) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background:${color};
      width:24px;height:24px;
      border-radius:50%;
      border:2.5px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;color:#fff;
      line-height:1;
    ">${index + 1}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function buildPopupContent(poi: MapPOI, color: string, index: number): string {
  return `
    <div style="min-width:160px">
      <p style="font-weight:600;font-size:14px;margin:0 0 4px;color:#1a1a2e">
        <span style="
          display:inline-flex;align-items:center;justify-content:center;
          width:20px;height:20px;border-radius:50%;
          background:${color};color:#fff;font-size:11px;font-weight:700;
          margin-right:6px;vertical-align:middle;
        ">${index + 1}</span>
        ${poi.label}
      </p>
      ${poi.day ? `<p style="font-size:12px;color:#666;margin:0 0 2px">Dia ${poi.day}${poi.time ? ` — ${poi.time}` : ""}</p>` : ""}
      ${poi.description ? `<p style="font-size:12px;color:#444;margin:0">${poi.description}</p>` : ""}
    </div>
  `;
}

/**
 * Para um par de POIs consecutivos, verifica se existe trainRoute definido.
 * Trem → waypoints manuais ao longo da ferrovia.
 * Caminhada → linha reta (POIs urbanos são próximos o suficiente).
 */
function getSegmentRoute(
  from: MapPOI,
  to: MapPOI,
  trainRoutes: TrainRoute[]
): { type: "walk" | "train"; coords: [number, number][]; label?: string } {
  const train = trainRoutes.find((r) => r.fromId === from.id && r.toId === to.id);

  if (train) {
    return { type: "train", coords: train.waypoints, label: train.label };
  }

  return {
    type: "walk",
    coords: [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
  };
}

export default function CityMap({ cityId, color }: CityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const data = mapData[cityId];
    if (!data) return;

    const map = L.map(mapRef.current, {
      center: data.center,
      zoom: data.zoom,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Colorful tiles - CartoDB Voyager (similar to Google Maps)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const bounds = L.latLngBounds([]);

    // Markers com números
    data.pois.forEach((poi, i) => {
      const latlng = L.latLng(poi.lat, poi.lng);
      bounds.extend(latlng);
      const icon = createMarkerIcon(color, i);
      L.marker(latlng, { icon })
        .bindPopup(buildPopupContent(poi, color, i), { closeButton: false })
        .addTo(map);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Rotas entre POIs consecutivos
    if (data.pois.length > 1) {
      const trainRoutes = data.trainRoutes ?? [];

      for (let i = 0; i < data.pois.length - 1; i++) {
        const segment = getSegmentRoute(data.pois[i], data.pois[i + 1], trainRoutes);

        if (segment.type === "train") {
          const line = L.polyline(segment.coords, {
            color: "#0066cc",
            weight: 4,
            opacity: 0.85,
            lineJoin: "round",
            lineCap: "round",
          }).addTo(map);

          if (segment.label) {
            line.bindTooltip(segment.label, {
              permanent: false,
              direction: "center",
              className: "train-tooltip",
            });
          }
        } else {
          L.polyline(segment.coords, {
            color,
            weight: 3,
            opacity: 0.6,
            dashArray: "6, 10",
            lineJoin: "round",
            lineCap: "round",
          }).addTo(map);
        }
      }
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [cityId, color]);

  return <div ref={mapRef} className="h-full w-full" />;
}
