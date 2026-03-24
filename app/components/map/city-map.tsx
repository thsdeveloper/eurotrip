"use client";

import { useEffect, useRef, useState } from "react";
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

function createPlaneIcon(angle: number) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="transport-icon" style="transform:rotate(${angle}deg)">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#1a1a2e" stroke="#f59e0b" stroke-width="0.8"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function createTrainIcon(angle: number) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="transport-icon" style="transform:rotate(${angle}deg)">
      <svg width="30" height="30" viewBox="-3 -3 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="14" fill="#0066cc"/>
        <g stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <path d="M8 3h8l2 5H6l2-5z" fill="rgba(255,255,255,0.15)"/>
          <rect x="6" y="8" width="12" height="7" rx="1.5" fill="rgba(255,255,255,0.15)"/>
          <line x1="6" y1="11.5" x2="18" y2="11.5" stroke-width="1"/>
          <circle cx="9" cy="13" r="0.8" fill="#fff"/>
          <circle cx="15" cy="13" r="0.8" fill="#fff"/>
          <line x1="9" y1="15" x2="7.5" y2="17.5"/>
          <line x1="15" y1="15" x2="16.5" y2="17.5"/>
          <line x1="6.5" y1="17.5" x2="17.5" y2="17.5"/>
        </g>
      </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function createLinkMarker(label: string, type: "arrival" | "departure", transportType: "flight" | "train") {
  const isArrival = type === "arrival";
  const bg = isArrival ? "#10b981" : "#ef4444";
  const icon = transportType === "flight"
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#fff"/></svg>`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="12" rx="2" stroke="#fff" stroke-width="2" fill="none"/><circle cx="9" cy="12" r="1" fill="#fff"/><circle cx="15" cy="12" r="1" fill="#fff"/><line x1="5" y1="9" x2="19" y2="9" stroke="#fff" stroke-width="1.5"/><line x1="9" y1="16" x2="7" y2="19" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="16" x2="17" y2="19" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  const arrow = isArrival ? "↓" : "↑";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      display:flex;align-items:center;gap:4px;
      background:${bg};color:#fff;
      padding:4px 10px 4px 6px;border-radius:20px;
      font-size:11px;font-weight:600;white-space:nowrap;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid rgba(255,255,255,0.3);
    ">${icon}<span>${arrow} ${label}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 14],
  });
}

/** Calcula o ângulo em graus entre dois pontos [lat,lng] */
function bearing(from: [number, number], to: [number, number]): number {
  const dLng = ((to[1] - from[1]) * Math.PI) / 180;
  const fromLat = (from[0] * Math.PI) / 180;
  const toLat = (to[0] * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(toLat);
  const x =
    Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Interpola posição ao longo de waypoints com t de 0 a 1 */
function interpolateRoute(
  waypoints: [number, number][],
  t: number
): { pos: [number, number]; angle: number } {
  if (waypoints.length < 2) return { pos: waypoints[0], angle: 0 };

  // Calcula distâncias cumulativas dos segmentos
  const dists: number[] = [0];
  for (let i = 1; i < waypoints.length; i++) {
    const dlat = waypoints[i][0] - waypoints[i - 1][0];
    const dlng = waypoints[i][1] - waypoints[i - 1][1];
    dists.push(dists[i - 1] + Math.sqrt(dlat * dlat + dlng * dlng));
  }

  const totalDist = dists[dists.length - 1];
  const targetDist = t * totalDist;

  // Encontra o segmento correto
  for (let i = 1; i < dists.length; i++) {
    if (targetDist <= dists[i]) {
      const segFraction =
        dists[i] === dists[i - 1]
          ? 0
          : (targetDist - dists[i - 1]) / (dists[i] - dists[i - 1]);
      const lat =
        waypoints[i - 1][0] +
        segFraction * (waypoints[i][0] - waypoints[i - 1][0]);
      const lng =
        waypoints[i - 1][1] +
        segFraction * (waypoints[i][1] - waypoints[i - 1][1]);
      const angle = bearing(waypoints[i - 1], waypoints[i]);
      return { pos: [lat, lng], angle };
    }
  }

  const last = waypoints.length - 1;
  return {
    pos: waypoints[last],
    angle: bearing(waypoints[last - 1], waypoints[last]),
  };
}

/** Ease-in-out cúbico: início lento → acelera → final lento */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Anima um ícone ao longo da rota */
function animateTransport(
  map: L.Map,
  waypoints: [number, number][],
  iconFactory: (angle: number) => L.DivIcon,
  durationMs: number = 3000
) {
  const { pos: startPos, angle: startAngle } = interpolateRoute(waypoints, 0);
  const marker = L.marker(startPos, { icon: iconFactory(startAngle), zIndexOffset: 1000 }).addTo(map);

  let startTime: number | null = null;
  let animId: number;

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawT = (elapsed % (durationMs + 1000)) / durationMs; // +1000ms pausa no destino
    const t = easeInOutCubic(Math.min(rawT, 1));

    const { pos, angle } = interpolateRoute(waypoints, t);
    marker.setLatLng(pos);
    marker.setIcon(iconFactory(angle));

    animId = requestAnimationFrame(step);
  }

  animId = requestAnimationFrame(step);

  return {
    marker,
    stop: () => cancelAnimationFrame(animId),
  };
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
 * Voo → arco curvo com ícone de avião animado.
 * Trem → waypoints manuais ao longo da ferrovia.
 * Caminhada → linha reta (POIs urbanos são próximos o suficiente).
 */
function getSegmentRoute(
  from: MapPOI,
  to: MapPOI,
  trainRoutes: TrainRoute[]
): { type: "walk" | "train" | "flight"; coords: [number, number][]; label?: string } {
  const train = trainRoutes.find((r) => r.fromId === from.id && r.toId === to.id);

  if (train) {
    const isFlight = train.label?.toLowerCase().startsWith("voo");
    return {
      type: isFlight ? "flight" : "train",
      coords: train.waypoints,
      label: train.label,
    };
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
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const data = mapData[cityId];
  const pois = data?.pois ?? [];

  function handlePoiClick(index: number) {
    const map = mapInstanceRef.current;
    const marker = markersRef.current[index];
    const poi = pois[index];
    if (!map || !marker || !poi) return;

    setSelectedIdx(index);
    map.flyTo([poi.lat, poi.lng], 16, { duration: 0.8 });
    setTimeout(() => marker.openPopup(), 400);
  }

  function handleShowAll() {
    const map = mapInstanceRef.current;
    if (!map || pois.length === 0) return;

    setSelectedIdx(null);
    const bounds = L.latLngBounds(pois.map((p) => [p.lat, p.lng] as [number, number]));
    map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 15, duration: 0.8 });
  }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

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
    const markers: L.Marker[] = [];

    // Markers com números
    data.pois.forEach((poi, i) => {
      const latlng = L.latLng(poi.lat, poi.lng);
      bounds.extend(latlng);
      const icon = createMarkerIcon(color, i);
      const marker = L.marker(latlng, { icon })
        .bindPopup(buildPopupContent(poi, color, i), { closeButton: false })
        .addTo(map);
      markers.push(marker);
    });

    markersRef.current = markers;

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Rotas entre POIs consecutivos
    const animations: { stop: () => void }[] = [];

    if (data.pois.length > 1) {
      const trainRoutes = data.trainRoutes ?? [];

      for (let i = 0; i < data.pois.length - 1; i++) {
        const segment = getSegmentRoute(data.pois[i], data.pois[i + 1], trainRoutes);

        if (segment.type === "flight") {
          // Linha tracejada do voo
          const line = L.polyline(segment.coords, {
            color: "#f59e0b",
            weight: 3,
            opacity: 0.5,
            dashArray: "8, 12",
            lineJoin: "round",
            lineCap: "round",
          }).addTo(map);

          if (segment.label) {
            line.bindTooltip(segment.label, {
              permanent: false,
              direction: "center",
              className: "flight-tooltip",
            });
          }

          // Avião animado
          const anim = animateTransport(map, segment.coords, createPlaneIcon, 3000);
          animations.push(anim);
        } else if (segment.type === "train") {
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

          // Trem animado
          const anim = animateTransport(map, segment.coords, createTrainIcon, 5000);
          animations.push(anim);
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

    // Chegada: rota completa da origem → primeiro POI
    if (data.arrival && data.pois.length > 0) {
      const arr = data.arrival;
      const lineColor = arr.type === "flight" ? "#f59e0b" : "#0066cc";
      const iconFactory = arr.type === "flight" ? createPlaneIcon : createTrainIcon;
      const tooltipClass = arr.type === "flight" ? "flight-tooltip" : "train-tooltip";

      const line = L.polyline(arr.waypoints, {
        color: lineColor,
        weight: 3,
        opacity: 0.4,
        dashArray: "6, 10",
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      line.bindTooltip(arr.label, {
        permanent: false,
        direction: "center",
        className: tooltipClass,
      });

      // Label no ponto de origem (primeiro waypoint)
      L.marker(arr.waypoints[0], {
        icon: createLinkMarker(arr.label, "arrival", arr.type),
        zIndexOffset: 900,
      }).addTo(map);

      // NÃO extende bounds — mapa fica focado nos POIs da cidade
      const anim = animateTransport(map, arr.waypoints, iconFactory, 4000);
      animations.push(anim);
    }

    // Saída: rota completa do último POI → destino
    if (data.departure && data.pois.length > 0) {
      const dep = data.departure;
      const lineColor = dep.type === "flight" ? "#f59e0b" : "#0066cc";
      const iconFactory = dep.type === "flight" ? createPlaneIcon : createTrainIcon;
      const tooltipClass = dep.type === "flight" ? "flight-tooltip" : "train-tooltip";

      const line = L.polyline(dep.waypoints, {
        color: lineColor,
        weight: 3,
        opacity: 0.4,
        dashArray: "6, 10",
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      line.bindTooltip(dep.label, {
        permanent: false,
        direction: "center",
        className: tooltipClass,
      });

      // Label no ponto de destino (último waypoint)
      const lastWp = dep.waypoints[dep.waypoints.length - 1];
      L.marker(lastWp, {
        icon: createLinkMarker(dep.label, "departure", dep.type),
        zIndexOffset: 900,
      }).addTo(map);

      const anim = animateTransport(map, dep.waypoints, iconFactory, 4000);
      animations.push(anim);
    }

    return () => {
      animations.forEach((a) => a.stop());
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [cityId, color, data]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {/* Botão toggle do painel */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="poi-sidebar-toggle"
        style={{ left: sidebarOpen ? 288 : 8 }}
        aria-label={sidebarOpen ? "Fechar painel" : "Abrir painel"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sidebarOpen ? (
            <polyline points="15 18 9 12 15 6" />
          ) : (
            <polyline points="9 18 15 12 9 6" />
          )}
        </svg>
      </button>

      {/* Painel lateral de POIs */}
      <div className={`poi-sidebar ${sidebarOpen ? "poi-sidebar-open" : "poi-sidebar-closed"}`}>
        <div className="poi-sidebar-header">
          <span className="poi-sidebar-title">Pontos de interesse</span>
          <span className="poi-sidebar-count">{pois.length}</span>
        </div>

        {selectedIdx !== null && (
          <button onClick={handleShowAll} className="poi-sidebar-show-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Ver todos
          </button>
        )}

        <div className="poi-sidebar-list">
          {pois.map((poi, i) => (
            <button
              key={poi.id}
              onClick={() => handlePoiClick(i)}
              className={`poi-sidebar-item ${selectedIdx === i ? "poi-sidebar-item-active" : ""}`}
            >
              <span
                className="poi-sidebar-badge"
                style={{ background: color }}
              >
                {i + 1}
              </span>
              <div className="poi-sidebar-item-content">
                <span className="poi-sidebar-item-label">{poi.label}</span>
                {poi.time && (
                  <span className="poi-sidebar-item-meta">
                    {poi.day ? `Dia ${poi.day}` : ""}{poi.time ? ` · ${poi.time}` : ""}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
