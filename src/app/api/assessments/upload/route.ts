import { NextResponse } from "next/server";
import {
  insertAssessment,
  toPublicAssessment,
} from "@/lib/assessments";
import {
  createDemoTransactions,
  extractPdfText,
  parseMpesaStatementText,
} from "@/lib/mpesa-parser";
import { rateLimit } from "@/lib/rate-limit";
import { scoreTransactions } from "@/lib/scoring";
import {
  ASSESSMENT_COOKIE,
  createSessionToken,
  hashBuffer,
  hashToken,
} from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const uploadLimit =
      process.env.NODE_ENV === "production" ? 5 : 50;
    const limited = rateLimit(`upload:${ip}`, uploadLimit, 60 * 60 * 1000);
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const password = String(form.get("password") ?? "");
    const consent = String(form.get("consent") ?? "");
    const demo = String(form.get("demo") ?? "") === "true";

    if (consent !== "true" && consent !== "on") {
      return NextResponse.json(
        { error: "ODPC consent is required." },
        { status: 400 },
      );
    }

    let transactions;
    let statementSha: string;

    if (demo && process.env.ALLOW_DEMO_ASSESSMENT === "true") {
      transactions = createDemoTransactions();
      statementSha = hashBuffer(Buffer.from(`demo:${Date.now()}`));
    } else {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "PDF statement file is required." },
          { status: 400 },
        );
      }

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: "Only PDF files are accepted." },
          { status: 400 },
        );
      }

      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "File exceeds the 15MB limit." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      statementSha = hashBuffer(buffer);

      let text: string;
      try {
        text = await extractPdfText(buffer, password.trim() || undefined);
      } catch (err) {
        const message = err instanceof Error ? err.message : "PDF unlock failed";
        if (/password/i.test(message)) {
          return NextResponse.json(
            {
              error:
                "This PDF is password-protected. Upload an unlocked statement PDF.",
            },
            { status: 400 },
          );
        }
        return NextResponse.json(
          { error: "Unable to read the PDF statement." },
          { status: 400 },
        );
      }

      transactions = parseMpesaStatementText(text);

      if (transactions.length < 10) {
        console.warn(
          `[upload] parsed ${transactions.length} txs from ${text.length} chars / ${file.name}`,
        );
        return NextResponse.json(
          {
            error:
              transactions.length === 0
                ? "Could not read transactions from this PDF. Use an official Safaricom M-Pesa / Till / Paybill statement."
                : `Only ${transactions.length} transactions were found. Upload a full official 6-month statement PDF.`,
          },
          { status: 422 },
        );
      }
    }

    const scoring = scoreTransactions(transactions);
    const sessionToken = createSessionToken();
    const row = await insertAssessment({
      sessionTokenHash: hashToken(sessionToken),
      statementSha256: statementSha,
      scoring,
    });

    const response = NextResponse.json({
      assessmentId: row.id,
      assessment: toPublicAssessment(row),
    });

    response.cookies.set(ASSESSMENT_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json(
      { error: "Assessment failed. Please try again." },
      { status: 500 },
    );
  }
}
