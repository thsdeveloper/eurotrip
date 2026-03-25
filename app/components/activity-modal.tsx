"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Clock,
  Wallet,
  Lightbulb,
  MapPin,
  Calendar,
  Ticket,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plane,
  TrainFront,
  UtensilsCrossed,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { TripIcon } from "./trip-icon";
import type { Activity, Day } from "@/app/data/trip";
import type { MapPOI, Accommodation, TransportLink } from "@/app/data/map-data";

/** Categorize an activity by its icon for richer display */
function getActivityCategory(icon: string) {
  const categories: Record<string, { label: string; color: string; bgColor: string }> = {
    plane: { label: "Transporte Aéreo", color: "text-orange-400", bgColor: "bg-orange-500/10" },
    "train-front": { label: "Transporte Ferroviário", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    "utensils-crossed": { label: "Gastronomia", color: "text-amber-400", bgColor: "bg-amber-500/10" },
    utensils: { label: "Gastronomia", color: "text-amber-400", bgColor: "bg-amber-500/10" },
    palette: { label: "Museu & Arte", color: "text-purple-400", bgColor: "bg-purple-500/10" },
    landmark: { label: "Ponto Turístico", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
    church: { label: "Monumento Histórico", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
    castle: { label: "Parque & Entretenimento", color: "text-pink-400", bgColor: "bg-pink-500/10" },
    crown: { label: "Monumento Histórico", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    footprints: { label: "Passeio a Pé", color: "text-green-400", bgColor: "bg-green-500/10" },
    "tree-pine": { label: "Natureza & Parques", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    mountain: { label: "Natureza & Montanhas", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    "mountain-snow": { label: "Natureza & Montanhas", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    music: { label: "Cultura & Entretenimento", color: "text-pink-400", bgColor: "bg-pink-500/10" },
    drama: { label: "Cultura & Entretenimento", color: "text-pink-400", bgColor: "bg-pink-500/10" },
    ship: { label: "Passeio de Barco", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    moon: { label: "Noite & Descanso", color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
    beer: { label: "Bar & Noite", color: "text-amber-400", bgColor: "bg-amber-500/10" },
    "shopping-bag": { label: "Compras", color: "text-pink-400", bgColor: "bg-pink-500/10" },
    "ferris-wheel": { label: "Atração", color: "text-pink-400", bgColor: "bg-pink-500/10" },
    luggage: { label: "Preparação", color: "text-slate-400", bgColor: "bg-slate-500/10" },
    clock: { label: "Espera / Conexão", color: "text-slate-400", bgColor: "bg-slate-500/10" },
    home: { label: "Casa", color: "text-green-400", bgColor: "bg-green-500/10" },
    rocket: { label: "Transporte", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  };
  return categories[icon] || { label: "Atividade", color: "text-muted", bgColor: "bg-white/5" };
}

/** Try to find a matching POI for this activity */
function findMatchingPOI(
  activity: Activity,
  dayNumber: number,
  pois: MapPOI[]
): MapPOI | null {
  return (
    pois.find(
      (p) =>
        p.day === dayNumber &&
        p.time === activity.time
    ) ?? null
  );
}

/** Extract useful tips based on activity type */
function getSmartTips(activity: Activity, icon: string): string[] {
  const tips: string[] = [];

  if (icon === "plane") {
    tips.push("Chegue ao aeroporto com pelo menos 2h de antecedência (voos internacionais 3h)");
    tips.push("Tenha passaporte e cartão de embarque em mãos");
  }
  if (icon === "train-front") {
    tips.push("Chegue à estação 15-20 min antes do horário de partida");
    tips.push("Valide o bilhete antes de embarcar, se necessário");
  }
  if (icon === "palette" || icon === "crown" || icon === "landmark" || icon === "church") {
    tips.push("Compre ingressos online com antecedência para evitar filas");
    if (activity.description?.toLowerCase().includes("fecha")) {
      const match = activity.description.match(/fecha\s+(\w+)/i);
      if (match) tips.push(`Atenção: fecha ${match[1]}!`);
    }
  }
  if (icon === "utensils-crossed" || icon === "utensils" || icon === "beer") {
    tips.push("Reserve mesa com antecedência em restaurantes populares");
  }
  if (icon === "castle") {
    tips.push("Baixe o app oficial para ver horários de shows e filas");
  }
  if (icon === "mountain-snow" || icon === "mountain") {
    tips.push("Vista-se em camadas — temperatura pode variar bastante na altitude");
    tips.push("Verifique condições climáticas antes de subir");
  }
  if (icon === "ship") {
    tips.push("Chegue 15 min antes do horário de partida");
  }

  return tips;
}

/** Build a Google Maps search URL */
function getGoogleMapsUrl(poi: MapPOI): string {
  return `https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`;
}

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
  activityIndex: number;
  day: Day;
  cityName: string;
  cityColor: string;
  pois: MapPOI[];
  accommodations: Accommodation[];
  transportLinks: TransportLink[];
  allActivities: Activity[];
  onNavigate: (index: number) => void;
}

export function ActivityModal({
  isOpen,
  onClose,
  activity,
  activityIndex,
  day,
  cityName,
  cityColor,
  pois,
  accommodations,
  transportLinks,
  allActivities,
  onNavigate,
}: ActivityModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && activityIndex > 0) onNavigate(activityIndex - 1);
      if (e.key === "ArrowRight" && activityIndex < allActivities.length - 1)
        onNavigate(activityIndex + 1);
    },
    [onClose, activityIndex, allActivities.length, onNavigate]
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

  const category = getActivityCategory(activity.icon);
  const matchingPOI = findMatchingPOI(activity, day.dayNumber, pois);
  const smartTips = getSmartTips(activity, activity.icon);
  const isTransport = activity.icon === "plane" || activity.icon === "train-front";

  // Find relevant transport link
  const relevantTransport = isTransport
    ? transportLinks.find(
        (t) =>
          activity.title.toLowerCase().includes(t.label.split("→")[0].trim().toLowerCase()) ||
          activity.title.toLowerCase().includes(t.label.split("→")[1]?.trim().toLowerCase() || "") ||
          t.label.toLowerCase().includes(activity.title.split(" ").slice(-1)[0]?.toLowerCase() || "")
      )
    : null;

  // Find relevant accommodation for this day
  const relevantAccommodation = accommodations.find((acc) => {
    const checkInDay = parseInt(acc.checkIn.split("/")[0]);
    const checkOutDay = parseInt(acc.checkOut.split("/")[0]);
    const currentDay = parseInt(day.date.split("/")[0]);
    return currentDay >= checkInDay && currentDay < checkOutDay;
  });

  const hasPrev = activityIndex > 0;
  const hasNext = activityIndex < allActivities.length - 1;

  const modal = (
    <div className="fixed inset-0 z-[9998] flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Navigation + Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-card-hover"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Center info */}
          <div className="text-center">
            <p className="text-xs text-muted">
              Dia {day.dayNumber} · {day.date} · {day.weekday}
            </p>
            <p className="text-sm font-semibold" style={{ color: cityColor }}>
              {cityName}
            </p>
          </div>

          {/* Prev/Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => hasPrev && onNavigate(activityIndex - 1)}
              disabled={!hasPrev}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-muted min-w-[3ch] text-center">
              {activityIndex + 1}/{allActivities.length}
            </span>
            <button
              onClick={() => hasNext && onNavigate(activityIndex + 1)}
              disabled={!hasNext}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Próximo"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          {/* Hero section */}
          <div className="mb-6">
            {/* Category badge */}
            <div className="mb-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${category.bgColor} ${category.color}`}>
                <TripIcon name={activity.icon} size={14} />
                {category.label}
              </span>
              {activity.cost && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <Wallet size={14} />
                  {activity.cost}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold sm:text-3xl mb-2">{activity.title}</h1>

            {/* Time & Date */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {activity.time}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {day.date} ({day.weekday})
              </span>
              {matchingPOI && (
                <a
                  href={getGoogleMapsUrl(matchingPOI)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MapPin size={14} />
                  Ver no mapa
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Main icon display */}
          <div
            className="mb-6 flex h-32 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${cityColor}15` }}
          >
            <TripIcon name={activity.icon} size={64} className="opacity-60" />
          </div>

          {/* Description */}
          {activity.description && (
            <div className="mb-6 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Camera size={16} className="text-muted" />
                Sobre
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {activity.description}
              </p>
            </div>
          )}

          {/* Info grid */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Cost card */}
            {activity.cost && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Ticket size={16} className="text-emerald-400" />
                  Ingressos & Custos
                </h3>
                <p className="text-lg font-bold text-emerald-400">{activity.cost}</p>
                <p className="mt-1 text-xs text-muted">
                  {activity.cost.includes("pessoa")
                    ? "Valor por pessoa — total para 4 viajantes pode variar"
                    : "Verifique valor atualizado no site oficial"}
                </p>
              </div>
            )}

            {/* Location card */}
            {matchingPOI && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={16} className="text-blue-400" />
                  Localização
                </h3>
                <p className="text-sm font-medium">{matchingPOI.label}</p>
                <p className="mt-1 text-xs text-muted">
                  {matchingPOI.lat.toFixed(4)}, {matchingPOI.lng.toFixed(4)}
                </p>
                <a
                  href={getGoogleMapsUrl(matchingPOI)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <Navigation size={12} />
                  Abrir no Google Maps
                  <ExternalLink size={10} />
                </a>
              </div>
            )}

            {/* Transport card */}
            {relevantTransport && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  {relevantTransport.type === "flight" ? (
                    <Plane size={16} className="text-orange-400" />
                  ) : (
                    <TrainFront size={16} className="text-blue-400" />
                  )}
                  {relevantTransport.type === "flight" ? "Voo" : "Trem"}
                </h3>
                <p className="text-sm font-medium">{relevantTransport.label}</p>
                {relevantTransport.time && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <Clock size={12} />
                    {relevantTransport.time}
                  </p>
                )}
                {relevantTransport.details && (
                  <p className="mt-1 text-xs text-muted">{relevantTransport.details}</p>
                )}
                {relevantTransport.from && relevantTransport.to && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded bg-white/5 px-2 py-0.5">{relevantTransport.from}</span>
                    <span className="text-muted">→</span>
                    <span className="rounded bg-white/5 px-2 py-0.5">{relevantTransport.to}</span>
                  </div>
                )}
              </div>
            )}

            {/* Accommodation card */}
            {relevantAccommodation && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="text-base">
                    {relevantAccommodation.type === "airbnb" ? "🏠" : relevantAccommodation.type === "hotel" ? "🏨" : "🛏️"}
                  </span>
                  Hospedagem
                </h3>
                <p className="text-sm font-medium">{relevantAccommodation.label}</p>
                {relevantAccommodation.neighborhood && (
                  <p className="mt-1 text-xs text-muted">
                    <MapPin size={12} className="inline mr-1" />
                    {relevantAccommodation.neighborhood}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-white/5 px-2 py-0.5">
                    Check-in: {relevantAccommodation.checkIn}
                  </span>
                  <span className="rounded bg-white/5 px-2 py-0.5">
                    Check-out: {relevantAccommodation.checkOut}
                  </span>
                  <span className="rounded bg-white/5 px-2 py-0.5">
                    {relevantAccommodation.nights} {relevantAccommodation.nights === 1 ? "noite" : "noites"}
                  </span>
                </div>
                {relevantAccommodation.pricePerNight && (
                  <p className="mt-2 text-xs text-emerald-400 font-medium">
                    {relevantAccommodation.pricePerNight}/noite
                    {relevantAccommodation.totalPrice && ` · Total: ${relevantAccommodation.totalPrice}`}
                  </p>
                )}
                {relevantAccommodation.amenities && relevantAccommodation.amenities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {relevantAccommodation.amenities.map((a) => (
                      <span key={a} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User tip */}
          {activity.tip && (
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
                <Lightbulb size={16} />
                Dica Importante
              </h3>
              <p className="text-sm leading-relaxed text-amber-300/90">
                {activity.tip}
              </p>
            </div>
          )}

          {/* Smart tips */}
          {smartTips.length > 0 && (
            <div className="mb-6 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle size={16} className="text-muted" />
                Dicas Úteis
              </h3>
              <ul className="space-y-2">
                {smartTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: cityColor }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Food suggestion */}
          {(activity.icon === "utensils-crossed" || activity.icon === "utensils" || activity.icon === "beer") && (
            <div className="mb-6 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <UtensilsCrossed size={16} className="text-amber-400" />
                Gastronomia
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {activity.description}
              </p>
              {matchingPOI && (
                <a
                  href={`https://www.google.com/maps/search/restaurants+near+${matchingPOI.lat},${matchingPOI.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <MapPin size={12} />
                  Ver restaurantes na região
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav bar */}
      <div
        className="shrink-0 border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => hasPrev && onNavigate(activityIndex - 1)}
            disabled={!hasPrev}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">
              {hasPrev ? allActivities[activityIndex - 1].title : ""}
            </span>
            <span className="sm:hidden">Anterior</span>
          </button>
          <button
            onClick={() => hasNext && onNavigate(activityIndex + 1)}
            disabled={!hasNext}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">
              {hasNext ? allActivities[activityIndex + 1].title : ""}
            </span>
            <span className="sm:hidden">Próximo</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
