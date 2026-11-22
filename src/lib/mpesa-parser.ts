import type { MpesaTransaction } from "./types";

const RECEIPT_RE = /^[A-Z][A-Z0-9]{8,13}$/i;
const STATUS_RE = /^(Completed|Failed|Cancelled|Pending|Success)$/i;
const AMOUNT_RE = /^-?[\d,]+\.\d{2}$/;
const DATETIME_RE =
  /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?$/;
const DATETIME_DMY_RE =
  /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}\s+\d{1,2}:\d{2}(?::\d{2})?$/;

function parseAmount(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, "").replace(/[^\d.-]/g, "").trim();
  if (!cleaned || cleaned === "-" || cleaned === ".") return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.abs(value) : 0;
}

function parseTimestamp(raw: string): Date | null {
  const iso = raw.match(
    /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/,
  );
  if (iso) {
    const [, y, m, d, hh, mm, ss] = iso;
    return new Date(
      Date.UTC(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss ?? 0),
      ),
    );
  }

  const dmy = raw.match(
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/,
  );
  if (dmy) {
    const [, d, m, y, hh, mm, ss] = dmy;
    return new Date(
      Date.UTC(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss ?? 0),
      ),
    );
  }

  return null;
}

function isHeaderNoise(value: string): boolean {
  const v = value.toLowerCase();
  return (
    v.includes("receipt") ||
    v.includes("completion time") ||
    v.includes("transaction status") ||
    v.includes("paid in") ||
    v.includes("withdrawn") ||
    v === "details" ||
    v === "balance" ||
    v.startsWith("disclaimer") ||
    v.startsWith("page ")
  );
}

function isDatetimeToken(value: string): boolean {
  return DATETIME_RE.test(value) || DATETIME_DMY_RE.test(value);
}

function isAmountToken(value: string): boolean {
  return AMOUNT_RE.test(value) || value === "0.00" || value === "-";
}

/**
 * Extract transaction rows from Safaricom M-Pesa / Till / Paybill statement text.
 * Handles:
 * 1) One transaction per line
 * 2) Field-per-line PDF extraction (common with pdf.js)
 * 3) Flattened single-stream text with receipt anchors
 */
export function parseMpesaStatementText(text: string): MpesaTransaction[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ");

  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const fromLines = parseLineOriented(lines);
  const fromStream = parseTokenStream(normalized);
  const chosen =
    fromStream.length > fromLines.length ? fromStream : fromLines;

  return reconcileAmountsFromBalances(dedupeAndSort(chosen));
}

function parseLineOriented(lines: string[]): MpesaTransaction[] {
  const transactions: MpesaTransaction[] = [];

  // Pattern A: full row on one line
  const rowPattern =
    /^([A-Z0-9]{8,14})\s+(\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+?)\s+(Completed|Failed|Cancelled|Pending|Success)\s+(-?[\d,]+\.?\d*|0|-)?\s*(-?[\d,]+\.?\d*|0|-)?\s*(-?[\d,]+\.?\d*)\s*$/i;

  // Pattern B: receipt + time + details + two trailing amounts
  const loosePattern =
    /^([A-Z0-9]{8,14})\s+(\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+?)\s+(-?[\d,]+\.\d{2})\s+(-?[\d,]+\.\d{2})\s*$/i;

  for (const line of lines) {
    if (isHeaderNoise(line)) continue;

    const match = line.match(rowPattern);
    if (match) {
      const [, receipt, timeRaw, details, status, paidIn, withdrawn, balance] =
        match;
      const timestamp = parseTimestamp(timeRaw);
      if (!timestamp || !RECEIPT_RE.test(receipt)) continue;
      transactions.push({
        receipt: receipt.toUpperCase(),
        timestamp,
        details: details.trim(),
        status: status.trim(),
        paidIn: parseAmount(paidIn),
        withdrawn: parseAmount(withdrawn),
        balance: parseAmount(balance),
      });
      continue;
    }

    const loose = line.match(loosePattern);
    if (loose) {
      const [, receipt, timeRaw, details, amountA, amountB] = loose;
      const timestamp = parseTimestamp(timeRaw);
      if (!timestamp || !RECEIPT_RE.test(receipt)) continue;
      const lower = details.toLowerCase();
      const isInflow =
        lower.includes("received") ||
        lower.includes("payment from") ||
        lower.includes("customer payment") ||
        lower.includes("funds received") ||
        lower.includes("pay bill from") ||
        lower.includes("deposit");
      transactions.push({
        receipt: receipt.toUpperCase(),
        timestamp,
        details: details.trim(),
        status: "Completed",
        paidIn: isInflow ? parseAmount(amountA) : 0,
        withdrawn: isInflow ? 0 : parseAmount(amountA),
        balance: parseAmount(amountB),
      });
    }
  }

  // Field-per-line layout: Receipt / DateTime / Details? / Status / PaidIn / Withdrawn / Balance
  const stacked = parseStackedFields(lines);
  for (const tx of stacked) transactions.push(tx);

  return transactions;
}

function parseStackedFields(lines: string[]): MpesaTransaction[] {
  const transactions: MpesaTransaction[] = [];
  let i = 0;

  while (i < lines.length) {
    const receipt = lines[i];
    if (!RECEIPT_RE.test(receipt) || isHeaderNoise(receipt)) {
      i += 1;
      continue;
    }

    const timeRaw = lines[i + 1];
    if (!timeRaw || !isDatetimeToken(timeRaw)) {
      i += 1;
      continue;
    }

    let cursor = i + 2;
    let details = "";
    let status = "";

    // Details may be missing or span multiple lines until we hit a status token
    while (cursor < lines.length) {
      const token = lines[cursor];
      if (STATUS_RE.test(token)) {
        status = token;
        cursor += 1;
        break;
      }
      if (RECEIPT_RE.test(token) && isDatetimeToken(lines[cursor + 1] || "")) {
        // Next transaction started without a status — abort this candidate
        break;
      }
      if (isAmountToken(token) && !details) {
        // Empty details; amounts started early
        break;
      }
      details = details ? `${details} ${token}` : token;
      cursor += 1;
      // Cap details span
      if (cursor - (i + 2) > 6) break;
    }

    if (!STATUS_RE.test(status)) {
      i += 1;
      continue;
    }

    // Collect up to 3 amount-like tokens: paidIn, withdrawn, balance
    const amounts: string[] = [];
    while (cursor < lines.length && amounts.length < 3) {
      const token = lines[cursor];
      if (isAmountToken(token) || token === "" || token === "-") {
        amounts.push(token || "0");
        cursor += 1;
        continue;
      }
      break;
    }

    if (amounts.length < 2) {
      i += 1;
      continue;
    }

    const timestamp = parseTimestamp(timeRaw);
    if (!timestamp) {
      i += 1;
      continue;
    }

    let paidIn = 0;
    let withdrawn = 0;
    let balance = 0;

    if (amounts.length >= 3) {
      paidIn = parseAmount(amounts[0]);
      withdrawn = parseAmount(amounts[1]);
      balance = parseAmount(amounts[2]);
    } else {
      // Two amounts: movement + balance
      const lower = details.toLowerCase();
      const isInflow =
        lower.includes("received") ||
        lower.includes("payment from") ||
        lower.includes("customer payment") ||
        lower.includes("funds received") ||
        lower.includes("deposit");
      paidIn = isInflow ? parseAmount(amounts[0]) : 0;
      withdrawn = isInflow ? 0 : parseAmount(amounts[0]);
      balance = parseAmount(amounts[1]);
    }

    transactions.push({
      receipt: receipt.toUpperCase(),
      timestamp,
      details: details.trim() || "Transaction",
      status,
      paidIn,
      withdrawn,
      balance,
    });

    i = cursor;
  }

  return transactions;
}

/**
 * Flattened text stream fallback — walk tokens looking for receipt anchors.
 */
function parseTokenStream(text: string): MpesaTransaction[] {
  const tokens = text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Re-join datetime tokens that were split: YYYY-MM-DD + HH:MM:SS
  const joined: string[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (
      /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(a) &&
      b &&
      /^\d{1,2}:\d{2}(?::\d{2})?$/.test(b)
    ) {
      joined.push(`${a} ${b}`);
      i += 1;
      continue;
    }
    if (
      /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(a) &&
      b &&
      /^\d{1,2}:\d{2}(?::\d{2})?$/.test(b)
    ) {
      joined.push(`${a} ${b}`);
      i += 1;
      continue;
    }
    joined.push(a);
  }

  const transactions: MpesaTransaction[] = [];

  for (let i = 0; i < joined.length; i += 1) {
    const receipt = joined[i];
    if (!RECEIPT_RE.test(receipt) || isHeaderNoise(receipt)) continue;

    const timeRaw = joined[i + 1];
    if (!timeRaw || !isDatetimeToken(timeRaw)) continue;

    let j = i + 2;
    const detailParts: string[] = [];
    let status = "";

    while (j < joined.length) {
      const token = joined[j];
      if (STATUS_RE.test(token)) {
        status = token;
        j += 1;
        break;
      }
      if (RECEIPT_RE.test(token) && isDatetimeToken(joined[j + 1] || "")) break;
      detailParts.push(token);
      j += 1;
      if (detailParts.length > 24) break;
    }

    if (!STATUS_RE.test(status)) continue;

    const amounts: string[] = [];
    while (j < joined.length && amounts.length < 3) {
      const token = joined[j];
      if (isAmountToken(token) || token === "-") {
        amounts.push(token);
        j += 1;
        continue;
      }
      // Sometimes blank paid-in shows as missing — allow bare integers
      if (/^[\d,]+$/.test(token) && amounts.length < 3) {
        amounts.push(`${token}.00`);
        j += 1;
        continue;
      }
      break;
    }

    if (amounts.length < 2) continue;

    const timestamp = parseTimestamp(timeRaw);
    if (!timestamp) continue;

    const details = detailParts.join(" ").trim() || "Transaction";
    let paidIn = 0;
    let withdrawn = 0;
    let balance = 0;

    if (amounts.length >= 3) {
      paidIn = parseAmount(amounts[0]);
      withdrawn = parseAmount(amounts[1]);
      balance = parseAmount(amounts[2]);
    } else {
      const lower = details.toLowerCase();
      const isInflow =
        lower.includes("received") ||
        lower.includes("payment from") ||
        lower.includes("customer payment") ||
        lower.includes("funds received");
      paidIn = isInflow ? parseAmount(amounts[0]) : 0;
      withdrawn = isInflow ? 0 : parseAmount(amounts[0]);
      balance = parseAmount(amounts[1]);
    }

    transactions.push({
      receipt: receipt.toUpperCase(),
      timestamp,
      details,
      status,
      paidIn,
      withdrawn,
      balance,
    });
  }

  return transactions;
}

function dedupeAndSort(transactions: MpesaTransaction[]): MpesaTransaction[] {
  const seen = new Set<string>();
  return transactions
    .filter((tx) => {
      // Score completed/success rows only — failed rows break balance chains
      if (tx.status && !/^(completed|success)$/i.test(tx.status)) return false;
      if (seen.has(tx.receipt)) return false;
      seen.add(tx.receipt);
      return true;
    })
    .sort((a, b) => {
      const t = a.timestamp.getTime() - b.timestamp.getTime();
      return t !== 0 ? t : a.receipt.localeCompare(b.receipt);
    });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Only fill missing movement amounts from balance deltas.
 * Never overwrite declared Paid In / Withdrawn — ISP tills are pass-through
 * accounts where balance barely moves but gross cash flow is large.
 */
export function reconcileAmountsFromBalances(
  transactions: MpesaTransaction[],
): MpesaTransaction[] {
  if (transactions.length < 2) return transactions;

  const withBalance = transactions.filter((tx) => tx.balance > 0).length;
  if (withBalance < Math.max(5, transactions.length * 0.4)) {
    return transactions;
  }

  const out: MpesaTransaction[] = [{ ...transactions[0] }];

  for (let i = 1; i < transactions.length; i += 1) {
    const prev = out[i - 1];
    const curr = { ...transactions[i] };
    const delta = round2(curr.balance - prev.balance);
    const hasDeclared = curr.paidIn > 0.009 || curr.withdrawn > 0.009;

    // Gap-fill only when the PDF row had empty movement cells
    if (!hasDeclared && Math.abs(delta) > 1) {
      if (delta >= 0) {
        curr.paidIn = Math.abs(delta);
        curr.withdrawn = 0;
      } else {
        curr.paidIn = 0;
        curr.withdrawn = Math.abs(delta);
      }
    }

    out.push(curr);
  }

  return out;
}

/**
 * Extract PDF text while preserving visual row structure via Y clustering.
 * Critical for M-Pesa tables — joining with spaces alone destroys rows.
 */
export async function extractPdfText(
  buffer: Buffer,
  password?: string,
): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    password: password || undefined,
    useSystemFonts: true,
    isEvalSupported: false,
    useWorkerFetch: false,
  });

  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items: { str: string; x: number; y: number }[] = [];

    for (const raw of content.items) {
      if (
        typeof raw !== "object" ||
        raw === null ||
        !("str" in raw) ||
        typeof (raw as { str: unknown }).str !== "string" ||
        !("transform" in raw) ||
        !Array.isArray((raw as { transform: unknown }).transform)
      ) {
        continue;
      }
      const item = raw as { str: string; transform: number[] };
      const str = item.str.replace(/\u00a0/g, " ").trim();
      if (!str) continue;
      items.push({
        str,
        x: item.transform[4] ?? 0,
        y: item.transform[5] ?? 0,
      });
    }

    // Group by Y, then sort by X
    const rows = new Map<number, { x: number; str: string }[]>();
    for (const item of items) {
      const y = Math.round(item.y * 10) / 10;
      let key = y;
      for (const existing of rows.keys()) {
        if (Math.abs(existing - y) <= 2) {
          key = existing;
          break;
        }
      }
      const bucket = rows.get(key) ?? [];
      bucket.push({ x: item.x, str: item.str });
      rows.set(key, bucket);
    }

    const sortedYs = [...rows.keys()].sort((a, b) => b - a);
    const lineTexts: string[] = [];
    for (const y of sortedYs) {
      const parts = (rows.get(y) ?? []).sort((a, b) => a.x - b.x);
      let line = "";
      let prevRight = -Infinity;
      for (const part of parts) {
        if (line && part.x - prevRight > 1.5) line += " ";
        else if (line && !line.endsWith(" ") && !part.str.startsWith(" ")) {
          if (/[A-Za-z0-9]$/.test(line) && /^[A-Za-z0-9]/.test(part.str)) {
            line += " ";
          }
        }
        line += part.str;
        prevRight = part.x + part.str.length * 3;
      }
      if (line.trim()) lineTexts.push(line.trim());
    }

    // Secondary field-per-item stream for stacked cell layouts
    const itemStream = items.map((item) => item.str).filter(Boolean);
    pages.push(`${lineTexts.join("\n")}\n${itemStream.join("\n")}`);
  }

  return pages.join("\n");
}

export function createDemoTransactions(): MpesaTransaction[] {
  const start = new Date();
  start.setUTCMonth(start.getUTCMonth() - 6);
  start.setUTCDate(1);
  start.setUTCHours(8, 0, 0, 0);

  const txs: MpesaTransaction[] = [];
  let balance = 120_000;
  let receipt = 100000;

  for (let day = 0; day < 180; day += 1) {
    const date = new Date(start.getTime() + day * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getUTCDay();
    if (dayOfWeek === 0) continue;

    const inflowCount = 2 + (day % 3);
    for (let i = 0; i < inflowCount; i += 1) {
      const paidIn = 800 + ((day * 37 + i * 113) % 4200);
      balance += paidIn;
      txs.push({
        receipt: `DEMO${receipt++}`,
        timestamp: new Date(date.getTime() + i * 3600_000),
        details: `Customer Payment from 2547${String(10000000 + ((day * 10 + i) % 89999999)).slice(0, 8)}`,
        status: "Completed",
        paidIn,
        withdrawn: 0,
        balance,
      });
    }

    const withdrawn = 1500 + ((day * 53) % 8000);
    balance -= withdrawn;
    txs.push({
      receipt: `DEMO${receipt++}`,
      timestamp: new Date(date.getTime() + 10 * 3600_000),
      details: "Pay Bill to Safaricom Bandwidth",
      status: "Completed",
      paidIn: 0,
      withdrawn,
      balance,
    });

    if (day % 41 === 0) {
      const fuliza = 2000;
      balance += fuliza;
      txs.push({
        receipt: `DEMO${receipt++}`,
        timestamp: new Date(date.getTime() + 11 * 3600_000),
        details: "Fuliza M-Pesa",
        status: "Completed",
        paidIn: fuliza,
        withdrawn: 0,
        balance,
      });
    }
  }

  return txs;
}
