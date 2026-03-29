// ─── Trip Types ─────────────────────────────────────────────

export interface Activity {
  time: string;
  icon: string;
  title: string;
  description: string;
  cost?: string;
  tip?: string;
}

export interface Day {
  date: string;
  weekday: string;
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  countryCode: string;
  icon: string;
  dates: string;
  nights: number;
  color: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  days: Day[];
  transport?: string;
  heroImage?: string;
}

export interface Flight {
  label: string;
  route: string;
  time: string;
  details: string;
}

export interface Traveler {
  name: string;
  emoji: string;
  email?: string;
  color: string;
}

export interface TripData {
  title: string;
  version: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCountries: number;
  travelers: Traveler[];
  flightDomesticOut: Flight;
  flightOut: Flight;
  flightLhrMad: Flight;
  flightBack: Flight;
  flightDomesticBack: Flight;
  cities: City[];
  bookingAlerts: string[];
}

// ─── Map Types ──────────────────────────────────────────────

export interface MapPOI {
  id: string;
  label: string;
  lat: number;
  lng: number;
  day?: number;
  time?: string;
  description?: string;
}

export interface TrainRoute {
  fromId: string;
  toId: string;
  waypoints: [number, number][];
  label?: string;
}

export interface TransportLink {
  label: string;
  waypoints: [number, number][];
  type: "flight" | "train";
  from?: string;
  to?: string;
  time?: string;
  details?: string;
}

export interface Accommodation {
  id: string;
  label: string;
  lat: number;
  lng: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  type: "airbnb" | "hotel" | "hostel";
  neighborhood?: string;
  pricePerNight?: string;
  totalPrice?: string;
  guests?: number;
  tip?: string;
  amenities?: string[];
}

export interface CityMapData {
  center: [number, number];
  zoom: number;
  pois: MapPOI[];
  trainRoutes?: TrainRoute[];
  arrival?: TransportLink;
  departure?: TransportLink;
  accommodations?: Accommodation[];
}

// ─── Budget & Checklist Types ───────────────────────────────

export interface BudgetItem {
  category: string;
  item: string;
  costPerPerson: string;
  totalCost: string;
  currency: string;
  city: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
}
