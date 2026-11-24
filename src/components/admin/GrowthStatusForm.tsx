"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const STATUSES = ["NEW", "CONTACTED", "APPROVED", "REJECTED"] as const;

export function GrowthStatusForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: string;
  notes: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [careNotes, setCareNotes] = useState(notes);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/growth/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value, customerCareNotes: careNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMsg("Saved");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={save}
      className="rounded-2xl border border-steel bg-paper p-5"
    >
      <h2 className="text-[15px] font-semibold text-ink">Status</h2>
      <label className="mt-3 block">
        <span className="text-[12px] text-slate">Pipeline status</span>
        <select
          className="mt-1.5 w-full rounded-xl border border-steel bg-cloud px-3 py-2.5 text-[14px]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block">
        <span className="text-[12px] text-slate">Customer care notes</span>
        <textarea
          className="mt-1.5 min-h-[120px] w-full rounded-xl border border-steel bg-cloud px-3 py-2.5 text-[14px]"
          value={careNotes}
          onChange={(e) => setCareNotes(e.target.value)}
        />
      </label>
      <Button
        type="submit"
        variant="primary"
        className="mt-4 w-full"
        disabled={busy}
      >
        {busy ? "Saving…" : "Save"}
      </Button>
      {msg ? <p className="mt-2 text-[12px] text-slate">{msg}</p> : null}
    </form>
  );
}
