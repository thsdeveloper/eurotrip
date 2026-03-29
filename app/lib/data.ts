import { cache } from "react";
import { supabase } from "./supabase/static";
import type {
  TripData,
  City,
  Day,
  Activity,
  Flight,
  Traveler,
} from "@/app/data/types";
import type {
  CityMapData,
  MapPOI,
  TrainRoute,
  TransportLink,
  Accommodation,
} from "@/app/data/types";

// ─── Trip Data ──────────────────────────────────────────────

export const getTripData = cache(async (): Promise<TripData> => {
  const tripId = "00000000-0000-0000-0000-000000000001";

  // Fetch all in parallel
  const [
    { data: trip },
    { data: travelers },
    { data: flights },
    { data: cities },
    { data: days },
    { data: activities },
    { data: alerts },
  ] = await Promise.all([
    supabase.from("trips").select("*").eq("id", tripId).single(),
    supabase.from("travelers").select("*").eq("trip_id", tripId).order("sort_order"),
    supabase.from("flights").select("*").eq("trip_id", tripId),
    supabase.from("cities").select("*").eq("trip_id", tripId).order("sort_order"),
    supabase.from("days").select("*, city_id").order("sort_order"),
    supabase.from("activities").select("*, day_id").order("sort_order"),
    supabase.from("booking_alerts").select("*").eq("trip_id", tripId).order("sort_order"),
  ]);

  if (!trip || !cities) throw new Error("Failed to fetch trip data");

  // Index days and activities for fast lookup
  const daysByCity = new Map<string, typeof days>();
  for (const day of days ?? []) {
    const list = daysByCity.get(day.city_id) ?? [];
    list.push(day);
    daysByCity.set(day.city_id, list);
  }

  const activitiesByDay = new Map<string, typeof activities>();
  for (const act of activities ?? []) {
    const list = activitiesByDay.get(act.day_id) ?? [];
    list.push(act);
    activitiesByDay.set(act.day_id, list);
  }

  // Build flight map
  const flightMap = new Map<string, Flight>();
  for (const f of flights ?? []) {
    flightMap.set(f.key, {
      label: f.label,
      route: f.route,
      time: f.time,
      details: f.details,
    });
  }

  // Assemble cities with nested days and activities
  const assembledCities: City[] = (cities ?? []).map((c) => {
    const cityDays = daysByCity.get(c.id) ?? [];
    return {
      id: c.slug,
      name: c.name,
      country: c.country,
      flag: c.flag,
      countryCode: c.country_code,
      icon: c.icon,
      dates: c.dates,
      nights: c.nights,
      color: c.color,
      colorBg: c.color_bg,
      colorBorder: c.color_border,
      colorText: c.color_text,
      transport: c.transport ?? undefined,
      heroImage: c.hero_image ?? undefined,
      days: cityDays.map((d): Day => ({
        date: d.date,
        weekday: d.weekday,
        dayNumber: d.day_number,
        title: d.title,
        activities: (activitiesByDay.get(d.id) ?? []).map((a): Activity => ({
          time: a.time,
          icon: a.icon,
          title: a.title,
          description: a.description,
          cost: a.cost ?? undefined,
          tip: a.tip ?? undefined,
        })),
      })),
    };
  });

  return {
    title: trip.title,
    version: trip.version,
    startDate: trip.start_date,
    endDate: trip.end_date,
    totalDays: trip.total_days,
    totalCountries: trip.total_countries,
    travelers: (travelers ?? []).map((t): Traveler => ({
      name: t.name,
      emoji: t.emoji,
      email: t.email ?? undefined,
      color: t.color,
    })),
    flightDomesticOut: flightMap.get("flightDomesticOut")!,
    flightOut: flightMap.get("flightOut")!,
    flightLhrMad: flightMap.get("flightLhrMad")!,
    flightBack: flightMap.get("flightBack")!,
    flightDomesticBack: flightMap.get("flightDomesticBack")!,
    cities: assembledCities,
    bookingAlerts: (alerts ?? []).map((a) => a.label),
  };
});

// ─── Budget Items ───────────────────────────────────────────

export interface BudgetItem {
  category: string;
  item: string;
  costPerPerson: string;
  totalCost: string;
  currency: string;
  city: string;
}

export const getBudgetItems = cache(async (): Promise<BudgetItem[]> => {
  const { data } = await supabase
    .from("budget_items")
    .select("*")
    .eq("trip_id", "00000000-0000-0000-0000-000000000001")
    .order("sort_order");

  return (data ?? []).map((b) => ({
    category: b.category,
    item: b.item,
    costPerPerson: b.cost_per_person,
    totalCost: b.total_cost,
    currency: b.currency,
    city: b.city,
  }));
});

// ─── Checklist ────────────────────────────────────────────��─

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
}

export const getChecklist = cache(async (): Promise<ChecklistItem[]> => {
  const { data } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("trip_id", "00000000-0000-0000-0000-000000000001")
    .order("sort_order");

  return (data ?? []).map((c) => ({
    id: c.key,
    label: c.label,
    category: c.category,
  }));
});

// ─── Map Data ───────────────────────────────────────────────

export const getMapData = cache(async (): Promise<Record<string, CityMapData>> => {
  // Fetch all map data in parallel
  const [
    { data: mapConfigs },
    { data: pois },
    { data: transportLinks },
    { data: waypoints },
    { data: trainRoutes },
    { data: trainWaypoints },
    { data: accommodations },
    { data: cities },
  ] = await Promise.all([
    supabase.from("city_map_data").select("*"),
    supabase.from("map_pois").select("*").order("sort_order"),
    supabase.from("transport_links").select("*"),
    supabase.from("transport_link_waypoints").select("*").order("sort_order"),
    supabase.from("train_routes").select("*").order("sort_order"),
    supabase.from("train_route_waypoints").select("*").order("sort_order"),
    supabase.from("accommodations").select("*"),
    supabase.from("cities").select("id, slug"),
  ]);

  // Build city_id → slug map
  const citySlugMap = new Map<string, string>();
  for (const c of cities ?? []) {
    citySlugMap.set(c.id, c.slug);
  }

  // Index data by IDs
  const poisByMap = new Map<string, MapPOI[]>();
  for (const p of pois ?? []) {
    const list = poisByMap.get(p.city_map_id) ?? [];
    list.push({
      id: p.slug,
      label: p.label,
      lat: p.lat,
      lng: p.lng,
      day: p.day ?? undefined,
      time: p.time ?? undefined,
      description: p.description ?? undefined,
    });
    poisByMap.set(p.city_map_id, list);
  }

  const waypointsByLink = new Map<string, [number, number][]>();
  for (const w of waypoints ?? []) {
    const list = waypointsByLink.get(w.transport_link_id) ?? [];
    list.push([w.lat, w.lng]);
    waypointsByLink.set(w.transport_link_id, list);
  }

  const trainWaypointsByRoute = new Map<string, [number, number][]>();
  for (const w of trainWaypoints ?? []) {
    const list = trainWaypointsByRoute.get(w.train_route_id) ?? [];
    list.push([w.lat, w.lng]);
    trainWaypointsByRoute.set(w.train_route_id, list);
  }

  const linksByMap = new Map<string, { arrival?: TransportLink; departure?: TransportLink }>();
  for (const tl of transportLinks ?? []) {
    const entry = linksByMap.get(tl.city_map_id) ?? {};
    const link: TransportLink = {
      label: tl.label,
      type: tl.type as "flight" | "train",
      waypoints: waypointsByLink.get(tl.id) ?? [],
      from: tl.from_location ?? undefined,
      to: tl.to_location ?? undefined,
      time: tl.time ?? undefined,
      details: tl.details ?? undefined,
    };
    if (tl.direction === "arrival") entry.arrival = link;
    else entry.departure = link;
    linksByMap.set(tl.city_map_id, entry);
  }

  const routesByMap = new Map<string, TrainRoute[]>();
  for (const tr of trainRoutes ?? []) {
    const list = routesByMap.get(tr.city_map_id) ?? [];
    list.push({
      fromId: tr.from_poi_slug,
      toId: tr.to_poi_slug,
      waypoints: trainWaypointsByRoute.get(tr.id) ?? [],
      label: tr.label ?? undefined,
    });
    routesByMap.set(tr.city_map_id, list);
  }

  const accByMap = new Map<string, Accommodation[]>();
  for (const a of accommodations ?? []) {
    const list = accByMap.get(a.city_map_id) ?? [];
    list.push({
      id: a.slug,
      label: a.label,
      lat: a.lat,
      lng: a.lng,
      nights: a.nights,
      checkIn: a.check_in,
      checkOut: a.check_out,
      type: a.type as "airbnb" | "hotel" | "hostel",
      neighborhood: a.neighborhood ?? undefined,
      pricePerNight: a.price_per_night ?? undefined,
      totalPrice: a.total_price ?? undefined,
      guests: a.guests ?? undefined,
      tip: a.tip ?? undefined,
      amenities: a.amenities ?? undefined,
    });
    accByMap.set(a.city_map_id, list);
  }

  // Assemble final map
  const result: Record<string, CityMapData> = {};
  for (const mc of mapConfigs ?? []) {
    const slug = citySlugMap.get(mc.city_id);
    if (!slug) continue;

    const links = linksByMap.get(mc.id) ?? {};
    result[slug] = {
      center: [mc.center_lat, mc.center_lng],
      zoom: mc.zoom,
      pois: poisByMap.get(mc.id) ?? [],
      trainRoutes: routesByMap.get(mc.id),
      arrival: links.arrival,
      departure: links.departure,
      accommodations: accByMap.get(mc.id),
    };
  }

  return result;
});
