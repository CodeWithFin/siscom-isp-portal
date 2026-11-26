import type { ReactNode } from "react";
import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GrowthShell } from "@/components/growth/GrowthShell";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <GrowthShell>
      <AnnouncementStrip />
      <Header />
      <main className="flex-1 bg-[linear-gradient(180deg,#F7F5F8_0%,#FFFFFF_42%)]">
        {children}
      </main>
      <Footer />
    </GrowthShell>
  );
}
