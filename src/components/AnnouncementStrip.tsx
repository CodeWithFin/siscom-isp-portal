import { Button } from "./ui/Button";

export function AnnouncementStrip() {
  return (
    <div className="w-full bg-navy px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 sm:justify-between">
        <p className="text-center text-[13px] font-medium text-white/90 sm:text-left">
          ISP working capital in minutes — upload your 6-month M-Pesa statement.
          No account required.
        </p>
        <Button href="/#check" variant="nav" className="hidden shrink-0 sm:inline-flex">
          Check now
        </Button>
      </div>
    </div>
  );
}
