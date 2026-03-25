import { tripData } from "@/app/data/trip";
import { TripHeader } from "@/app/components/trip-header";
import { createClient } from "@/app/lib/supabase/server";
import { Plane, Heart, Mail, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viajantes — Eurotrip 2026",
  description: "Conheça os viajantes da Eurotrip 2026",
};

export default async function ViajantesPage() {
  let currentEmail: string | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    currentEmail = user?.email ?? null;
  } catch {
    // ignore auth errors
  }

  const couples = [
    { names: "Lidia & Pedro", travelers: tripData.travelers.slice(0, 2) },
    { names: "Joquebede & Thiago", travelers: tripData.travelers.slice(2, 4) },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <TripHeader />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Users size={24} className="text-muted" />
          <div>
            <h1 className="text-2xl font-bold">Viajantes</h1>
            <p className="text-sm text-muted">{tripData.travelers.length} pessoas · {tripData.totalDays} dias · {tripData.totalCountries} países</p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {couples.map((couple) => (
            <div key={couple.names}>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
                {couple.names}
                <Heart size={10} className="text-red-400 fill-red-400" />
              </p>
              <div className="flex flex-col gap-3">
                {couple.travelers.map((traveler) => {
                  const isMe = currentEmail !== null && traveler.email === currentEmail;
                  return (
                    <div
                      key={traveler.name}
                      className={`flex items-center gap-4 rounded-xl border p-5 transition-colors ${
                        isMe
                          ? "border-white/20 bg-white/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
                        style={{ backgroundColor: `${traveler.color}20`, color: traveler.color }}
                      >
                        {traveler.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold flex items-center gap-2">
                          {traveler.name}
                          {isMe && (
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                              você
                            </span>
                          )}
                        </p>
                        {traveler.email && (
                          <p className="flex items-center gap-1.5 text-sm text-muted mt-0.5">
                            <Mail size={13} />
                            {traveler.email}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        <p className="flex items-center justify-center gap-1.5">
          <Plane size={14} />
          <span>Eurotrip 2026 — Lidia & Pedro</span>
          <Heart size={12} className="text-red-400 fill-red-400" />
          <span>Joquebede & Thiago — v7</span>
        </p>
      </footer>
    </div>
  );
}
