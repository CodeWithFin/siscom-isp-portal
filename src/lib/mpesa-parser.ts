import type { MpesaTransaction } from "./types";

function parseAmount(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, "").replace(/[^\d.-]/g, "").trim();
  if (!cleaned || cleaned === "-" || cleaned === ".") return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

function parseTimestamp(raw: string): Date | null {
  // Common Safaricom formats: "2025-06-15 14:32:11" or "15/06/2025 14:32:11"
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

/**
 * Extract transaction rows from Safaricom M-Pesa / Till / Paybill statement text.
 * Tolerates Personal, Business Till, and Paybill layouts.
 */
export function parseMpesaStatementText(text: string): MpesaTransaction[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ");

  const lines = normalized.split("\n").map((l) => l.trim()).filter(Boolean);
  const transactions: MpesaTransaction[] = [];

  // Pattern A: Receipt + datetime + details + status + paidIn + withdrawn + balance
  const rowPattern =
    /^([A-Z0-9]{8,14})\s+(\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+?)\s+(Completed|Failed|Cancelled|Pending)\s+([\d,]+\.?\d*|0|-)?\s+([\d,]+\.?\d*|0|-)?\s+([\d,]+\.?\d*)\s*$/i;

  // Pattern B: loosely spaced amounts at end of line
  const loosePattern =
    /^([A-Z0-9]{8,14})\s+(\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s*$/i;

  for (const line of lines) {
    const match = line.match(rowPattern);
    if (match) {
      const [, receipt, timeRaw, details, status, paidIn, withdrawn, balance] =
        match;
      const timestamp = parseTimestamp(timeRaw);
      if (!timestamp) continue;
      transactions.push({
        receipt,
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
      if (!timestamp) continue;
      // Heuristic: if details imply receive/paid in, treat amountA as paidIn
      const lower = details.toLowerCase();
      const isInflow =
        lower.includes("received") ||
        lower.includes("payment from") ||
        lower.includes("customer payment") ||
        lower.includes("funds received");
      transactions.push({
        receipt,
        timestamp,
        details: details.trim(),
        status: "Completed",
        paidIn: isInflow ? parseAmount(amountA) : 0,
        withdrawn: isInflow ? 0 : parseAmount(amountA),
        balance: parseAmount(amountB),
      });
    }
  }

  // Deduplicate by receipt
  const seen = new Set<string>();
  return transactions
    .filter((tx) => {
      if (seen.has(tx.receipt)) return false;
      seen.add(tx.receipt);
      return true;
    })
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

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
    const strings = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean);
    pages.push(strings.join(" "));
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

    // Customer inflows (ISP collections)
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

    // Operating outflows
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

    // Occasional Fuliza
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
