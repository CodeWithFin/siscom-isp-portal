"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/Button";

const NAV = [
  { href: "/admin", label: "Overview", match: (p: string) => p === "/admin" },
  {
    href: "/admin/applications",
    label: "WC Loans",
    match: (p: string) => p.startsWith("/admin/applications"),
  },
  {
    href: "/admin/growth",
    label: "Growth",
    match: (p: string) => p.startsWith("/admin/growth"),
  },
  {
    href: "/admin/assessments",
    label: "Assessments",
    match: (p: string) => p.startsWith("/admin/assessments"),
  },
];

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-cloud">
      <header className="border-b border-steel bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="tech-label text-slate">SISCOM INTERNAL</p>
            <h1 className="feature-heading">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-[13px] text-slate">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button href="/" variant="outline">
              Public site
            </Button>
            <Button type="button" variant="outline" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap ${
                  active
                    ? "bg-siscom text-white"
                    : "bg-cloud text-slate hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </main>
  );
}
