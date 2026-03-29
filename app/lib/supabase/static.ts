import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for build-time / SSG use.
 * Does NOT depend on cookies — safe to use in generateStaticParams()
 * and server components during static generation.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
