"use client";

import Link from "next/link";
import { tripData } from "@/app/data/trip";
import { useState, useEffect } from "react";
import { Home, Wallet, CircleCheckBig } from "lucide-react";
import { CountryFlag } from "./country-flag";

interface CityNavProps {
  activeCityId?: string;
}

export function CityNav({ activeCityId }: CityNavProps) {
  const [scrollActive, setScrollActive] = useState("");

  const isHomePage = !activeCityId;

  useEffect(() => {
    if (!isHomePage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setScrollActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const city of tripData.cities) {
      const el = document.getElementById(city.id);
      if (el) observer.observe(el);
    }
    const budget = document.getElementById("budget");
    if (budget) observer.observe(budget);
    const checklist = document.getElementById("checklist");
    if (checklist) observer.observe(checklist);

    return () => observer.disconnect();
  }, [isHomePage]);

  const active = activeCityId ?? scrollActive;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            !active ? "bg-white/10 text-white" : "text-muted hover:text-foreground"
          }`}
        >
          <Home size={14} />
          <span className="hidden sm:inline">Início</span>
        </Link>
        <div className="mx-1 h-4 w-px bg-border" />
        {tripData.cities.map((city) => (
          <Link
            key={city.id}
            href={`/${city.id}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active === city.id
                ? "bg-white/10 text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            <CountryFlag countryCode={city.countryCode} name={city.country} size={16} />
            <span className="hidden sm:inline">{city.name}</span>
          </Link>
        ))}
        <div className="mx-1 h-4 w-px bg-border" />
        {isHomePage ? (
          <>
            <a
              href="#budget"
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                scrollActive === "budget"
                  ? "bg-white/10 text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Wallet size={14} />
              <span>Custos</span>
            </a>
            <a
              href="#checklist"
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                scrollActive === "checklist"
                  ? "bg-white/10 text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <CircleCheckBig size={14} />
              <span>Checklist</span>
            </a>
          </>
        ) : (
          <>
            <Link
              href="/#budget"
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <Wallet size={14} />
              <span>Custos</span>
            </Link>
            <Link
              href="/#checklist"
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <CircleCheckBig size={14} />
              <span>Checklist</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
