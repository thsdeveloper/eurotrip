import {
  Plane,
  UtensilsCrossed,
  Footprints,
  Palette,
  Moon,
  Crown,
  TreePine,
  Music,
  Landmark,
  Ship,
  Castle,
  Church,
  Drama,
  TrainFront,
  MountainSnow,
  Droplets,
  Snowflake,
  Wind,
  Sunset,
  Building2,
  Utensils,
  FerrisWheel,
  Beer,
  ShoppingBag,
  Flag,
  Heart,
  Lightbulb,
  Wallet,
  CircleCheckBig,
  TriangleAlert,
  Home,
  Rocket,
  Mountain,
  Sparkles,
  Compass,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  plane: Plane,
  utensils: Utensils,
  "utensils-crossed": UtensilsCrossed,
  footprints: Footprints,
  palette: Palette,
  moon: Moon,
  crown: Crown,
  "tree-pine": TreePine,
  music: Music,
  landmark: Landmark,
  ship: Ship,
  castle: Castle,
  church: Church,
  drama: Drama,
  "train-front": TrainFront,
  "mountain-snow": MountainSnow,
  mountain: Mountain,
  droplets: Droplets,
  snowflake: Snowflake,
  wind: Wind,
  sunset: Sunset,
  "building-2": Building2,
  "ferris-wheel": FerrisWheel,
  beer: Beer,
  "shopping-bag": ShoppingBag,
  flag: Flag,
  heart: Heart,
  lightbulb: Lightbulb,
  wallet: Wallet,
  "circle-check": CircleCheckBig,
  "triangle-alert": TriangleAlert,
  home: Home,
  rocket: Rocket,
  sparkles: Sparkles,
  compass: Compass,
};

interface TripIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function TripIcon({ name, className = "", size = 18 }: TripIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon size={size} className={className} />;
}
