export function formatKes(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function generateReferenceCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SIS-ISP-${suffix}`;
}

export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  if (/^\+2547\d{8}$/.test(digits) || /^\+2541\d{8}$/.test(digits)) {
    return digits;
  }
  if (/^2547\d{8}$/.test(digits) || /^2541\d{8}$/.test(digits)) {
    return `+${digits}`;
  }
  if (/^07\d{8}$/.test(digits) || /^01\d{8}$/.test(digits)) {
    return `+254${digits.slice(1)}`;
  }
  return null;
}

export const KENYA_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
] as const;
