import { redirect } from "next/navigation";
import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { ApplyForm } from "@/components/ApplyForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAssessmentById, toPublicAssessment } from "@/lib/assessments";
import { getAssessmentCookie, hashToken, safeEqual } from "@/lib/session";

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ assessmentId: string }>;
  searchParams: Promise<{ amount?: string }>;
}) {
  const { assessmentId } = await params;
  const { amount } = await searchParams;
  const token = await getAssessmentCookie();
  if (!token) redirect("/");

  const row = await getAssessmentById(assessmentId);
  if (!row || !safeEqual(row.session_token_hash, hashToken(token))) {
    redirect("/");
  }

  if (
    row.qualification_status !== "QUALIFIED" &&
    row.qualification_status !== "MANUAL_REVIEW"
  ) {
    redirect(`/result/${assessmentId}`);
  }

  if (row.is_converted) {
    redirect(`/result/${assessmentId}`);
  }

  const assessment = toPublicAssessment(row);
  const initialAmount = Number(amount) || assessment.maxQualifiedAmount;

  return (
    <>
      <AnnouncementStrip />
      <Header />
      <main className="flex-1">
        <ApplyForm assessment={assessment} initialAmount={initialAmount} />
      </main>
      <Footer />
    </>
  );
}
