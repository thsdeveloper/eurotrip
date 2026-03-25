"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-white text-black font-medium text-sm rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
