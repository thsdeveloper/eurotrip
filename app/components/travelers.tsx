import { getTripData } from "@/app/lib/data";
import { createClient } from "@/app/lib/supabase/server";
import { Users } from "lucide-react";

export async function Travelers() {
  const tripData = await getTripData();

  let currentEmail: string | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    currentEmail = user?.email ?? null;
  } catch {
    // ignore auth errors
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-muted" />
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Viajantes</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {tripData.travelers.map((traveler) => {
          const isMe = currentEmail !== null && traveler.email === currentEmail;
          return (
            <div
              key={traveler.name}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                isMe
                  ? "border-white/20 bg-white/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: `${traveler.color}20`, color: traveler.color }}
              >
                {traveler.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  {traveler.name}
                  {isMe && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      você
                    </span>
                  )}
                </p>
                {traveler.email && (
                  <p className="text-xs text-muted">{traveler.email}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
