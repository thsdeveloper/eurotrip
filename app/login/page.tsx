import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Eurotrip 2026</h1>
          <p className="text-muted text-sm mt-2">
            Faça login para acessar o roteiro
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
