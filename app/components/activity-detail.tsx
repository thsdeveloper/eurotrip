"use client";

import {
  Clock,
  Wallet,
  Lightbulb,
  MapPin,
  Calendar,
  Ticket,
  Navigation,
  ExternalLink,
  Plane,
  TrainFront,
  UtensilsCrossed,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { TripIcon } from "./trip-icon";
import type { Activity, Day } from "@/app/data/trip";
import type { MapPOI, TransportLink } from "@/app/data/map-data";

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
    trophy: { label: "Esporte & Lazer", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    anchor: { label: "Passeio Marítimo", color: "text-blue-400", bgColor: "bg-blue-500/10" },
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

interface ActivityDetailProps {
  activity: Activity;
  day: Day;
  cityName: string;
  cityColor: string;
  pois: MapPOI[];
  transportLinks: TransportLink[];
}

export function ActivityDetail({
  activity,
  day,
  cityName,
  cityColor,
  pois,
  transportLinks,
}: ActivityDetailProps) {
  const category = getActivityCategory(activity.icon);
  const matchingPOI = findMatchingPOI(activity, day.dayNumber, pois);
  const smartTips = getSmartTips(activity, activity.icon);
  const isTransport = activity.icon === "plane" || activity.icon === "train-front";

  const relevantTransport = isTransport
    ? transportLinks.find(
        (t) =>
          activity.title.toLowerCase().includes(t.label.split("→")[0].trim().toLowerCase()) ||
          activity.title.toLowerCase().includes(t.label.split("→")[1]?.trim().toLowerCase() || "") ||
          t.label.toLowerCase().includes(activity.title.split(" ").slice(-1)[0]?.toLowerCase() || "")
      )
    : null;


  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Activity header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${cityColor}20` }}
          >
            <TripIcon name={activity.icon} size={20} className={category.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${category.bgColor} ${category.color}`}>
                {category.label}
              </span>
              {activity.cost && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                  <Wallet size={11} />
                  {activity.cost}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold">{activity.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {activity.time}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {day.date} ({day.weekday})
              </span>
              {matchingPOI && (
                <a
                  href={getGoogleMapsUrl(matchingPOI)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MapPin size={12} />
                  Ver no mapa
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {/* Description */}
        {activity.description && (
          <div className="mb-4 rounded-lg border border-border bg-background/50 p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
              <Camera size={13} />
              Sobre
            </h4>
            <p className="text-sm leading-relaxed text-muted">
              {activity.description}
            </p>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Cost card */}
          {activity.cost && (
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
                <Ticket size={13} className="text-emerald-400" />
                Ingressos & Custos
              </h4>
              <p className="text-base font-bold text-emerald-400">{activity.cost}</p>
              <p className="mt-1 text-[11px] text-muted">
                {activity.cost.includes("pessoa")
                  ? "Valor por pessoa — total para 4 viajantes pode variar"
                  : "Verifique valor atualizado no site oficial"}
              </p>
            </div>
          )}

          {/* Location card */}
          {matchingPOI && (
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
                <MapPin size={13} className="text-blue-400" />
                Localização
              </h4>
              <p className="text-sm font-medium">{matchingPOI.label}</p>
              <p className="mt-1 text-[11px] text-muted">
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
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
                {relevantTransport.type === "flight" ? (
                  <Plane size={13} className="text-orange-400" />
                ) : (
                  <TrainFront size={13} className="text-blue-400" />
                )}
                {relevantTransport.type === "flight" ? "Voo" : "Trem"}
              </h4>
              <p className="text-sm font-medium">{relevantTransport.label}</p>
              {relevantTransport.time && (
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                  <Clock size={11} />
                  {relevantTransport.time}
                </p>
              )}
              {relevantTransport.details && (
                <p className="mt-1 text-[11px] text-muted">{relevantTransport.details}</p>
              )}
              {relevantTransport.from && relevantTransport.to && (
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="rounded bg-white/5 px-2 py-0.5">{relevantTransport.from}</span>
                  <span className="text-muted">→</span>
                  <span className="rounded bg-white/5 px-2 py-0.5">{relevantTransport.to}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* User tip */}
        {activity.tip && (
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Lightbulb size={13} />
              Dica Importante
            </h4>
            <p className="text-sm leading-relaxed text-amber-300/90">
              {activity.tip}
            </p>
          </div>
        )}

        {/* Smart tips */}
        {smartTips.length > 0 && (
          <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
              <AlertTriangle size={13} className="text-muted" />
              Dicas Úteis
            </h4>
            <ul className="space-y-1.5">
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
        {(activity.icon === "utensils-crossed" || activity.icon === "utensils" || activity.icon === "beer") && matchingPOI && (
          <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <UtensilsCrossed size={13} className="text-amber-400" />
              Gastronomia
            </h4>
            <a
              href={`https://www.google.com/maps/search/restaurants+near+${matchingPOI.lat},${matchingPOI.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <MapPin size={12} />
              Ver restaurantes na região
              <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
