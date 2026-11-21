import { SiscomLogo } from "./SiscomLogo";

export function Footer() {
  return (
    <footer className="border-t border-steel bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <SiscomLogo variant="footer" className="!h-7 opacity-90" />
          <p className="text-[13px] text-slate">
            © {new Date().getFullYear()} Siscom Technologies. All rights
            reserved.
          </p>
        </div>
        <p className="tech-label text-slate">ISP Credit Scoring · Kenya</p>
      </div>
    </footer>
  );
}
