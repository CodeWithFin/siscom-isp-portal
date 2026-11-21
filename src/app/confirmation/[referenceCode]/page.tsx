import { notFound } from "next/navigation";
import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { ConfirmationClient } from "@/components/ConfirmationClient";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getApplicationByReference } from "@/lib/assessments";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ referenceCode: string }>;
}) {
  const { referenceCode } = await params;
  const application = await getApplicationByReference(
    decodeURIComponent(referenceCode),
  );

  if (!application) notFound();

  return (
    <>
      <AnnouncementStrip />
      <Header />
      <main className="flex-1">
        <ConfirmationClient
          referenceCode={application.reference_code}
          ispName={application.isp_name}
          phoneNumber={application.phone_number}
          requestedAmount={Number(application.requested_amount)}
        />
      </main>
      <Footer />
    </>
  );
}
