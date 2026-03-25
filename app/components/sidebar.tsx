"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tripData } from "@/app/data/trip";
import { CountryFlag } from "./country-flag";
import { Menu, X, Home, Wallet, CircleCheckBig, Plane, Heart, LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeCityId = pathname === "/" ? null : pathname.slice(1);

  const overlay = (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed left-0 top-0 z-[9999] flex h-dvh w-80 max-w-[85vw] flex-col border-r border-border transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <Plane size={20} className="text-blue-400" />
            <span className="font-bold text-lg">Eurotrip 2026</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Destinations list */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-white/10 text-white"
                : "text-muted hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <Home size={18} />
            <span>Visão Geral</span>
          </Link>

          <div className="my-2 mx-3 h-px bg-border" />
          <p className="px-3 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
            Destinos
          </p>

          {tripData.cities.map((city) => (
            <Link
              key={city.id}
              href={`/${city.id}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                activeCityId === city.id
                  ? "bg-white/10 text-white"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <CountryFlag countryCode={city.countryCode} name={city.country} size={24} />
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">{city.name}</span>
                <span className="text-xs text-muted">
                  {city.dates} · {city.nights === 0 ? "trânsito" : `${city.nights} ${city.nights === 1 ? "noite" : "noites"}`}
                </span>
              </div>
              {activeCityId === city.id && (
                <div
                  className="ml-auto h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: city.color }}
                />
              )}
            </Link>
          ))}

          <div className="my-2 mx-3 h-px bg-border" />

          <Link
            href="/#budget"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-foreground transition-colors"
          >
            <Wallet size={18} />
            <span>Custos</span>
          </Link>
          <Link
            href="/#checklist"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-foreground transition-colors"
          >
            <CircleCheckBig size={18} />
            <span>Checklist</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-4 py-3 text-xs text-muted" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <p className="flex items-center gap-1.5">
            <span>Lidia & Pedro</span>
            <Heart size={10} className="text-red-400 fill-red-400" />
            <span>Joquebede & Thiago</span>
          </p>
          <p className="mt-1">22 Set — 13 Out · {tripData.totalDays} dias · {tripData.totalCountries} países</p>
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-lg border border-border bg-card p-2 transition-colors hover:bg-card-hover"
        aria-label="Abrir menu de destinos"
      >
        <Menu size={20} />
      </button>

      {/* Portal: render overlay outside the header stacking context */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
