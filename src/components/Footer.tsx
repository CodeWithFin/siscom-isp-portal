import { SiscomLogo } from "./SiscomLogo";

export function Footer() {
  return (
    <footer className="border-t border-steel bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <SiscomLogo variant="footer" className="!h-7 opacity-90" />
          <p className="max-w-xl text-[13px] leading-[1.45] text-slate">
            © {new Date().getFullYear()} Siscom Technology Limited · Nabui House,
            Westlands, Nairobi. Credit facilities provided with Mkash, a
            CBK-licensed digital credit provider. Indicative limits · subject to
            approval.
          </p>
        </div>
        <p className="tech-label text-slate">ISP GROWTH · KENYA</p>
      </div>
    </footer>
  );
}
