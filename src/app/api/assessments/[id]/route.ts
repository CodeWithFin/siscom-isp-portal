import { NextResponse } from "next/server";
import { getAssessmentById, toPublicAssessment } from "@/lib/assessments";
import { getAssessmentCookie, hashToken, safeEqual } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const token = await getAssessmentCookie();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assessment = await getAssessmentById(id);
    if (!assessment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!safeEqual(assessment.session_token_hash, hashToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !assessment.is_converted &&
      new Date(assessment.expires_at).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "This assessment has expired. Please upload again." },
        { status: 410 },
      );
    }

    return NextResponse.json({ assessment: toPublicAssessment(assessment) });
  } catch (err) {
    console.error("[assessments/get]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
