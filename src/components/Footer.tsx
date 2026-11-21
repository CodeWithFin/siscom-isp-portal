export function Footer() {
  return (
    <footer className="border-t border-steel bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-[13px] text-slate sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Siscom Technologies. All rights reserved.</p>
        <p className="tech-label">ISP Credit Scoring · Kenya</p>
      </div>
    </footer>
  );
}
