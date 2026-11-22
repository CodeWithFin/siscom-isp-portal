"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/Button";

export function SearchBar({
  basePath,
  placeholder = "Search ISP, phone, email, reference…",
}: {
  basePath: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full flex-1 rounded-xl border border-steel bg-paper px-3 py-3 text-[14px] outline-none focus:border-ink"
      />
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
}
