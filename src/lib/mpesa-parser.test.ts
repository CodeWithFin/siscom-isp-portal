import assert from "node:assert/strict";
import {
  parseMpesaStatementText,
  reconcileAmountsFromBalances,
} from "./mpesa-parser";
import { scoreTransactions, verifyBalanceContinuity } from "./scoring";

function makeStacked(n: number): string {
  const lines: string[] = [
    "Receipt No.",
    "Completion Time",
    "Details",
    "Transaction Status",
    "Paid In",
    "Withdrawn",
    "Balance",
  ];
  let balance = 50000;
  for (let i = 0; i < n; i += 1) {
    const receipt = `TGH${String(1000000 + i).padStart(7, "0")}`;
    const day = String((i % 28) + 1).padStart(2, "0");
    const paidIn = i % 2 === 0 ? 1500 + i : 0;
    const withdrawn = i % 2 === 1 ? 800 + i : 0;
    balance = balance + paidIn - withdrawn;
    lines.push(
      receipt,
      `2025-06-${day} 10:${String(i % 60).padStart(2, "0")}:00`,
      i % 2 === 0
        ? `Customer Payment from 2547${10000000 + i}`
        : "Pay Bill to Safaricom",
      "Completed",
      paidIn ? paidIn.toFixed(2) : "0.00",
      withdrawn ? withdrawn.toFixed(2) : "0.00",
      balance.toFixed(2),
    );
  }
  return lines.join("\n");
}

function makeFlatRows(n: number): string {
  const lines: string[] = [];
  let balance = 40000;
  for (let i = 0; i < n; i += 1) {
    const receipt = `SFC${String(2000000 + i).padStart(7, "0")}`;
    const paidIn = i % 3 === 0 ? 2200 : 0;
    const withdrawn = i % 3 === 0 ? 0 : 900;
    balance = balance + paidIn - withdrawn;
    lines.push(
      `${receipt} 2025-07-${String((i % 28) + 1).padStart(2, "0")} 14:22:11 Customer Payment from 254712345678 Completed ${paidIn.toFixed(2)} ${withdrawn.toFixed(2)} ${balance.toFixed(2)}`,
    );
  }
  return lines.join("\n");
}

{
  const txs = parseMpesaStatementText(makeStacked(40));
  assert.ok(txs.length >= 30, `stacked expected >=30 got ${txs.length}`);
  assert.ok(txs[0].receipt.startsWith("TGH"));
  assert.ok(txs.some((t) => t.paidIn > 0));
  assert.ok(txs.some((t) => t.withdrawn > 0));
}

{
  const txs = parseMpesaStatementText(makeFlatRows(25));
  assert.ok(txs.length >= 20, `flat expected >=20 got ${txs.length}`);
}

{
  // Flattened stream like pdf.js join(" ")
  const parts: string[] = [];
  let balance = 10000;
  for (let i = 0; i < 15; i += 1) {
    const receipt = `ABC${String(3000000 + i).padStart(7, "0")}`;
    const paidIn = 1000;
    balance += paidIn;
    parts.push(
      receipt,
      "2025-08-01",
      "09:15:22",
      "Funds",
      "received",
      "from",
      "254700000001",
      "Completed",
      "1,000.00",
      "0.00",
      balance.toFixed(2),
    );
  }
  const txs = parseMpesaStatementText(parts.join(" "));
  assert.ok(txs.length >= 10, `stream expected >=10 got ${txs.length}`);
}

{
  // Empty movement cells — fill from balance delta
  let bal = 10000;
  const gaps = Array.from({ length: 20 }, (_, i) => {
    const inflow = i % 2 === 0;
    const move = 500 + i * 10;
    bal = inflow ? bal + move : bal - move;
    return {
      receipt: `XYZ${String(4000000 + i).padStart(7, "0")}`,
      timestamp: new Date(Date.UTC(2025, 5, 1 + i, 10, 0, 0)),
      details: inflow ? "Customer Payment from 254712345678" : "Pay Bill Charge",
      status: "Completed",
      paidIn: 0,
      withdrawn: 0,
      balance: bal,
    };
  });

  const healed = reconcileAmountsFromBalances(gaps);
  assert.ok(healed.some((t) => t.paidIn >= 500));
  assert.ok(healed.some((t) => t.withdrawn >= 500));
  assert.equal(verifyBalanceContinuity(healed).ok, true);
}

{
  // Pass-through till: large gross volumes, flat balance — must keep declared amounts
  let bal = 80000;
  const till = Array.from({ length: 30 }, (_, i) => {
    const paidIn = 20000 + (i % 5) * 1000;
    const withdrawn = 19500 + (i % 5) * 1000;
    bal = bal + paidIn - withdrawn;
    return {
      receipt: `TIL${String(5000000 + i).padStart(7, "0")}`,
      timestamp: new Date(Date.UTC(2025, 0, 1 + i, 12, 0, 0)),
      details: "Customer Payment from 254700000001",
      status: "Completed",
      paidIn,
      withdrawn,
      balance: bal,
    };
  });

  const kept = reconcileAmountsFromBalances(till);
  assert.equal(kept[1].paidIn, till[1].paidIn);
  assert.equal(kept[1].withdrawn, till[1].withdrawn);
  const scored = scoreTransactions(kept);
  assert.ok(scored.avgMonthlyInflow > 100000);
  assert.notEqual(scored.qualificationStatus, "TAMPERED_REJECTED");
}

{
  // Broken balance trail must still score cash flow (not hard-reject)
  const messy = Array.from({ length: 40 }, (_, i) => ({
    receipt: `MES${String(6000000 + i).padStart(7, "0")}`,
    timestamp: new Date(Date.UTC(2025, 1, 1 + Math.floor(i / 2), 9, i % 60, 0)),
    details: "Customer Payment from 254711111111",
    status: "Completed",
    paidIn: 25000,
    withdrawn: 5000,
    balance: 1000 + i, // intentionally inconsistent with movements
  }));
  const scored = scoreTransactions(messy);
  assert.ok(scored.avgMonthlyInflow > 0);
  assert.notEqual(scored.qualificationStatus, "TAMPERED_REJECTED");
  assert.ok(
    scored.qualificationStatus === "MANUAL_REVIEW" ||
      scored.qualificationStatus === "QUALIFIED" ||
      scored.qualificationStatus === "NOT_QUALIFIED",
  );
}

console.log("mpesa-parser tests passed");
