import { redirect } from "next/navigation";
import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResultClient } from "@/components/ResultClient";
import { getAssessmentById, toPublicAssessment } from "@/lib/assessments";
import { getAssessmentCookie, hashToken, safeEqual } from "@/lib/session";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const token = await getAssessmentCookie();
  if (!token) redirect("/");

  const row = await getAssessmentById(assessmentId);
  if (!row || !safeEqual(row.session_token_hash, hashToken(token))) {
    redirect("/");
  }

  if (!row.is_converted && new Date(row.expires_at).getTime() < Date.now()) {
    redirect("/");
  }

  const assessment = toPublicAssessment(row);

  return (
    <>
      <AnnouncementStrip />
      <Header />
      <main className="flex-1">
        <ResultClient assessment={assessment} />
      </main>
      <Footer />
    </>
  );
}
