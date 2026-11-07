"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <input
        name="password"
        type="password"
        required
        autoFocus
        placeholder="Mot de passe"
        className="h-12 w-full rounded-xl border border-stone-300 px-4 outline-none focus:border-stone-900"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-900 font-medium text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />} Se connecter
      </button>
    </form>
  );
}
