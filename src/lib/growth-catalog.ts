export type FieldType = "number" | "text" | "select";

export type CatalogField = {
  k: string;
  l: string;
  t: FieldType;
  v?: string | number;
  min?: number;
  max?: number;
  ph?: string;
  o?: string[];
  optional?: boolean;
};

export type CatalogProduct = {
  id: string;
  name: string;
  who: string;
  desc: string;
  bullets: string[];
  fields: CatalogField[];
  spec: (f: Record<string, string>) => string;
};

export const GROWTH_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Uasin Gishu",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Meru",
  "Nyeri",
  "Kericho",
  "Kilifi",
  "Other",
] as const;

export const PAY_PLANS = [
  "Pay upfront",
  "Lease 12 months",
  "Lease 24 months",
  "Lease 36 months",
] as const;

export const GROWTH_PRODUCTS: CatalogProduct[] = [
  {
    id: "colo",
    name: "Colocation",
    who: "Partner data centres",
    desc: "Rack space, power and cross-connects for your network core.",
    bullets: ["Half rack to full racks", "Remote hands available"],
    fields: [
      { k: "units", l: "Rack units (U)", t: "number", v: 12, min: 1, max: 84 },
      { k: "power", l: "Power (kW)", t: "number", v: 2, min: 1, max: 30 },
      {
        k: "site",
        l: "Preferred location",
        t: "select",
        o: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
      },
    ],
    spec: (f) => `${f.units}U · ${f.power} kW · ${f.site}`,
  },
  {
    id: "pole",
    name: "KPLC pole colocation",
    who: "KPLC pole access",
    desc: "Run aerial fibre on KPLC poles along your route.",
    bullets: ["Route survey support", "Pole access paperwork handled"],
    fields: [
      { k: "poles", l: "Number of poles", t: "number", v: 50, min: 1, max: 5000 },
      { k: "county", l: "County", t: "select", o: [...GROWTH_COUNTIES] },
      {
        k: "route",
        l: "Route description",
        t: "text",
        v: "",
        ph: "e.g. Kitengela town to Isinya",
        optional: true,
      },
    ],
    spec: (f) =>
      `${f.poles} poles · ${f.county}${f.route ? ` · ${f.route}` : ""}`,
  },
  {
    id: "fibre",
    name: "Fibre cables",
    who: "Backbone and last mile",
    desc: "Fibre for backbone links and drops to homes and businesses.",
    bullets: ["Aerial or underground", "12 to 96 cores"],
    fields: [
      { k: "km", l: "Length (km)", t: "number", v: 5, min: 1, max: 1000 },
      { k: "cores", l: "Core count", t: "select", o: ["12", "24", "48", "96"] },
      {
        k: "type",
        l: "Installation",
        t: "select",
        o: ["Aerial (ADSS)", "Underground (duct)", "Drop cable"],
      },
    ],
    spec: (f) => `${f.km} km · ${f.cores}-core · ${f.type}`,
  },
  {
    id: "node",
    name: "Network nodes",
    who: "MikroTik · Cisco · Juniper",
    desc: "Core routers, aggregation switches and access gear.",
    bullets: ["Configured before dispatch", "Brand of your choice"],
    fields: [
      {
        k: "brand",
        l: "Brand",
        t: "select",
        o: ["MikroTik", "Cisco", "Juniper"],
      },
      {
        k: "model",
        l: "Model or role",
        t: "text",
        v: "",
        ph: "e.g. CCR2116, core router",
        optional: true,
      },
      { k: "qty", l: "Quantity", t: "number", v: 2, min: 1, max: 500 },
    ],
    spec: (f) => `${f.qty} × ${f.brand}${f.model ? ` ${f.model}` : ""}`,
  },
  {
    id: "asn",
    name: "ASN and IP pools",
    who: "Infratech",
    desc: "Your own autonomous system number and IP address space.",
    bullets: ["AFRINIC paperwork support", "IPv4 and IPv6"],
    fields: [
      {
        k: "asn",
        l: "Need an ASN?",
        t: "select",
        o: ["Yes", "Already have one"],
      },
      {
        k: "v4",
        l: "IPv4 block",
        t: "select",
        o: ["/24 (256)", "/23 (512)", "/22 (1,024)", "None"],
      },
      {
        k: "v6",
        l: "IPv6 block",
        t: "select",
        o: ["/32", "/48", "None"],
      },
    ],
    spec: (f) => `ASN: ${f.asn} · IPv4 ${f.v4} · IPv6 ${f.v6}`,
  },
  {
    id: "cap",
    name: "Upstream capacity",
    who: "Netco · Tier 3",
    desc: "Dedicated internet capacity from 1 to 10 Gbps.",
    bullets: ["Handoff at partner data centres", "Scale up as you grow"],
    fields: [
      { k: "gbps", l: "Capacity (Gbps)", t: "select", o: ["1", "2", "5", "10"] },
      {
        k: "handoff",
        l: "Handoff point",
        t: "select",
        o: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
      },
      {
        k: "term",
        l: "Contract term",
        t: "select",
        o: ["12 months", "24 months", "36 months"],
      },
    ],
    spec: (f) => `${f.gbps} Gbps · ${f.handoff} · ${f.term}`,
  },
  {
    id: "g5",
    name: "5G gear and routers",
    who: "Radios · CPEs · routers",
    desc: "Fixed wireless radios, customer premises equipment and routers.",
    bullets: ["Bulk CPE for new subscribers", "Point-to-point links"],
    fields: [
      {
        k: "kind",
        l: "Equipment",
        t: "select",
        o: [
          "5G fixed wireless CPE",
          "Point-to-point radio",
          "Sector antenna",
          "Customer Wi-Fi router",
        ],
      },
      { k: "qty", l: "Quantity", t: "number", v: 50, min: 1, max: 10000 },
    ],
    spec: (f) => `${f.qty} × ${f.kind}`,
  },
];

export type CartItem = {
  id: string;
  productId: string;
  config: Record<string, string>;
  plan: string;
};

export function getProduct(id: string) {
  return GROWTH_PRODUCTS.find((p) => p.id === id);
}

export function defaultConfig(productId: string): Record<string, string> {
  const product = getProduct(productId);
  if (!product) return {};
  const out: Record<string, string> = {};
  for (const field of product.fields) {
    if (field.t === "select") out[field.k] = field.o?.[0] ?? "";
    else out[field.k] = String(field.v ?? "");
  }
  return out;
}

export function itemSpec(item: CartItem): string {
  const product = getProduct(item.productId);
  if (!product) return "Unknown item";
  return product.spec(item.config);
}

/** Monthly collections ≈ active subscribers × ARPU */
export function collections(subs: number, arpu: number): number {
  return (subs || 0) * (arpu || 0);
}

/** Billing finance indicative limit ≈ 96% of monthly collections, stepped to KES 50k */
export function indicativeBilling(subs: number, arpu: number): {
  lim: number;
  c: number;
} | null {
  const c = collections(subs, arpu);
  if (!c) return null;
  const lim = Math.max(
    100_000,
    Math.min(10_000_000, Math.round((c * 0.96) / 50_000) * 50_000),
  );
  return c * 0.96 < 100_000 ? { lim: 0, c } : { lim, c };
}

export function generateGrowthRef(kind: "ISP" | "BF" | "WC" = "ISP"): string {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${kind}-${stamp}-${suffix}`;
}
