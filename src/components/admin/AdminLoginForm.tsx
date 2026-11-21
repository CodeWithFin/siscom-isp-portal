"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/Button";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-16 w-full max-w-sm rounded-2xl border border-steel bg-paper p-6 shadow-[var(--shadow-cloud-card)]"
    >
      <p className="tech-label text-slate">INTERNAL</p>
      <h1 className="feature-heading mt-2">Customer Care Login</h1>

      <label className="mt-6 block">
        <span className="text-[13px] font-medium text-charcoal">Username</span>
        <input
          name="username"
          required
          className="mt-2 w-full rounded-xl border border-steel px-3 py-3 text-[14px] outline-none focus:border-ink"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-[13px] font-medium text-charcoal">Password</span>
        <input
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-xl border border-steel px-3 py-3 text-[14px] outline-none focus:border-ink"
        />
      </label>

      {error ? (
        <p className="mt-4 text-[13px] font-medium text-red-700">{error}</p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        className="mt-6 w-full"
        disabled={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
