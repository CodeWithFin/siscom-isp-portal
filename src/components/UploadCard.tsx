"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Button } from "./ui/Button";

const STAGES = [
  "Unlocking PDF",
  "Analyzing 6-Month Cash Flow",
  "Calculating Offer",
] as const;

export function UploadCard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((next: File | null) => {
    setError(null);
    if (!next) {
      setFile(null);
      return;
    }
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }
    if (next.size > 15 * 1024 * 1024) {
      setError("File exceeds the 15MB limit.");
      return;
    }
    setFile(next);
  }, []);

  async function submit(demo = false) {
    setError(null);
    if (!consent) {
      setError("Please accept the ODPC consent to continue.");
      return;
    }
    if (!demo && !file) {
      setError("Upload your M-Pesa PDF statement.");
      return;
    }
    if (!demo && !password.trim()) {
      setError("Enter the M-Pesa statement password.");
      return;
    }

    setLoading(true);
    setStage(0);
    const timers = [
      window.setTimeout(() => setStage(1), 900),
      window.setTimeout(() => setStage(2), 1800),
    ];

    try {
      const form = new FormData();
      if (demo) {
        form.set("demo", "true");
      } else if (file) {
        form.set("file", file);
        form.set("password", password);
      }
      form.set("consent", "true");

      const res = await fetch("/api/assessments/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      router.push(`/result/${data.assessmentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    } finally {
      timers.forEach(clearTimeout);
    }
  }

  return (
    <div
      id="check"
      className="rounded-2xl border border-steel bg-cloud p-0 shadow-[var(--shadow-cloud-card)]"
    >
      <div className="rounded-2xl bg-paper p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="tech-label text-slate">STATEMENT.UPLOAD</p>
            <h2 className="feature-heading mt-1 text-ink">Check My Qualification</h2>
          </div>
          <span className="hidden rounded-full bg-siscom-soft px-3 py-1 text-[12px] font-semibold text-siscom-dark sm:inline">
            Max 15MB PDF
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFile(e.dataTransfer.files?.[0] ?? null);
          }}
          onClick={() => inputRef.current?.click()}
          className={`mt-5 cursor-pointer rounded-2xl border border-dashed px-4 py-8 text-center transition-colors ${
            dragOver ? "border-ink bg-cloud" : "border-steel bg-cloud/60 hover:bg-cloud"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-siscom text-paper">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2.5v9M9 2.5 5.5 6M9 2.5 12.5 6M3 12.5V14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 15 14v-1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-ink">
            {file ? file.name : "Drop your M-Pesa PDF here, or click to browse"}
          </p>
          <p className="mt-2 text-[13px] text-slate">
            Upload your official 6-month M-Pesa or Till/Paybill PDF statement.
          </p>
        </div>

        <label className="mt-4 block">
          <span className="text-[13px] font-medium text-charcoal">
            M-Pesa statement password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter M-Pesa statement password"
            className="mt-2 w-full rounded-xl border border-steel bg-paper px-3 py-3 text-[14px] text-ink outline-none transition focus:border-ink"
          />
        </label>

        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-ink"
          />
          <span className="text-[13px] leading-5 text-slate">
            I consent to Siscom Technologies processing my M-Pesa statement data
            solely for credit assessment in accordance with the Kenya Data
            Protection Act (2019).
          </span>
        </label>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-5 space-y-3">
            {STAGES.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-[3px] ${
                    i <= stage ? "bg-siscom" : "bg-steel"
                  }`}
                />
                <span
                  className={`text-[14px] font-medium ${
                    i <= stage ? "text-ink" : "text-slate"
                  }`}
                >
                  {label}
                  {i === stage ? "…" : ""}
                </span>
              </div>
            ))}
            <div className="loading-shimmer h-2 rounded-full" />
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            <Button
              type="button"
              variant="primary"
              arrow
              className="w-full"
              onClick={() => submit(false)}
            >
              Check My Qualification
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => submit(true)}
            >
              Try with sample data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
