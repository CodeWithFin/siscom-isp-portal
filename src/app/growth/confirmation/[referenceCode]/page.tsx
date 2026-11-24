import { notFound } from "next/navigation";
import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GrowthShell } from "@/components/growth/GrowthShell";
import { GrowthConfirmation } from "@/components/growth/GrowthConfirmation";
import { query } from "@/lib/db";

type GrowthApp = {
  reference_code: string;
  isp_name: string;
  contact_name: string;
  phone_number: string;
  items: unknown;
  financing: { amount?: number } | null;
  access_finance: boolean;
};

export default async function GrowthConfirmationPage({
  params,
}: {
  params: Promise<{ referenceCode: string }>;
}) {
  const { referenceCode } = await params;
  const code = decodeURIComponent(referenceCode);

  const result = await query<GrowthApp>(
    `SELECT reference_code, isp_name, contact_name, phone_number, items, financing, access_finance
     FROM growth_applications WHERE reference_code = $1`,
    [code],
  );

  const app = result.rows[0];
  if (!app) notFound();

  const items = Array.isArray(app.items) ? app.items : [];
  const financingAmount =
    app.financing && typeof app.financing.amount === "number"
      ? app.financing.amount
      : null;

  return (
    <GrowthShell>
      <AnnouncementStrip />
      <Header />
      <main className="flex-1">
        <GrowthConfirmation
          referenceCode={app.reference_code}
          ispName={app.isp_name}
          contactName={app.contact_name}
          phoneNumber={app.phone_number}
          itemCount={items.length}
          financingAmount={financingAmount}
          accessFinance={app.access_finance}
        />
      </main>
      <Footer />
    </GrowthShell>
  );
}
