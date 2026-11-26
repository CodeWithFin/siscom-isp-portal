"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadWcBiz } from "@/lib/wc-biz";
import { Button } from "@/components/ui/Button";
import { WcProgress } from "./WcProgress";

export function CheckUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const biz = loadWcBiz();
    if (!biz.name || !biz.email) {
      router.replace("/check");
    }
  }, [router]);

  async function onScore() {
    if (!consent) {
      setError("Please accept the ODPC consent to continue.");
      return;
    }
    if (!file) {
      setError("Upload your M-Pesa PDF statement.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("consent", "true");
      const res = await fetch("/api/assessments/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (!data.assessmentId) {
        throw new Error("Upload succeeded but no assessment was returned");
      }
      router.push(`/result/${data.assessmentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <WcProgress step={1} />

      <div className="mt-8 rounded-3xl border border-steel bg-paper p-5 shadow-[var(--shadow-graphite-card)] sm:p-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">
          Upload your M-Pesa statements
        </h1>
        <p className="mt-2 text-[14px] text-slate">
          Upload the last 6 months as PDF. Your file is processed in memory to
          calculate your score.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-dashed border-steel bg-cloud px-4 py-10 text-center hover:bg-cloud/80"
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              setError("");
              setFile(e.target.files?.[0] ?? null);
            }}
          />
          <p className="mx-auto max-w-full break-all text-[14px] font-medium text-ink [overflow-wrap:anywhere]">
            {file
              ? file.name
              : "Drop your M-Pesa PDF here, or click to browse"}
          </p>
          <p className="mt-2 text-[13px] text-slate">
            Official 6-month M-Pesa, Till, or Paybill statement · max 15MB
          </p>
        </button>

        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#EB1260]"
          />
          <span className="text-[13px] leading-5 text-slate">
            I consent to Siscom Technologies processing my M-Pesa statement data
            solely for credit assessment in accordance with the Kenya Data
            Protection Act (2019).
          </span>
        </label>

        {error ? (
          <p className="mt-4 text-[13px] font-medium text-[#EB1260]">{error}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button href="/check" variant="outline">
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            arrow
            disabled={busy}
            onClick={() => void onScore()}
          >
            {busy ? "Scoring…" : "Score my statement"}
          </Button>
        </div>
      </div>
    </div>
  );
}
