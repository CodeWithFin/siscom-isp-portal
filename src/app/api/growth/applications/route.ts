import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { generateGrowthRef } from "@/lib/growth-catalog";
import { normalizeKenyanPhone } from "@/lib/format";
import { notifyGrowthApplication } from "@/lib/notifications";

export const runtime = "nodejs";

const itemSchema = z.object({
  productId: z.string().min(1).max(40),
  product: z.string().min(1).max(120),
  spec: z.string().min(1).max(500),
  config: z.record(z.string(), z.string()),
  plan: z.string().min(1).max(60),
});

const bodySchema = z.object({
  isp: z.object({
    name: z.string().min(2).max(255),
    reg: z.string().min(2).max(120),
    ca: z.string().min(2).max(120),
    county: z.string().min(2).max(80),
    subs: z.number().positive(),
    arpu: z.number().positive(),
    billing: z.string().min(1).max(120),
    channels: z.string().min(1).max(120),
    contact: z.string().min(2).max(255),
    email: z.string().email(),
    phone: z.string().min(9).max(30),
    notes: z.string().max(2000).optional().or(z.literal("")),
  }),
  items: z.array(itemSchema).max(50),
  financing: z
    .object({
      type: z.literal("billing"),
      typeName: z.string(),
      amount: z.number().min(100_000).max(10_000_000),
      lender: z.string(),
    })
    .nullable(),
  accessFinance: z.boolean(),
  monthlyCollections: z.number().min(0),
  indicativeLimit: z.number().min(0),
  consent: z.object({
    wasp: z.literal(true),
    deduct: z.literal(true),
    data: z.literal(true),
    accurate: z.literal(true),
  }),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid application data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const phone = normalizeKenyanPhone(data.isp.phone);
    if (!phone) {
      return NextResponse.json(
        { error: "Phone must be a valid Kenyan number (+254...)." },
        { status: 400 },
      );
    }

    if (!data.items.length && !data.financing && !data.accessFinance) {
      return NextResponse.json(
        {
          error:
            "Add infrastructure items or select billing / access financing.",
        },
        { status: 400 },
      );
    }

    let kind: "ISP" | "BF" = "ISP";
    if (data.financing && !data.items.length) kind = "BF";

    let referenceCode = generateGrowthRef(kind);
    for (let i = 0; i < 5; i += 1) {
      const existing = await query(
        `SELECT 1 FROM growth_applications WHERE reference_code = $1`,
        [referenceCode],
      );
      if (existing.rowCount === 0) break;
      referenceCode = generateGrowthRef(kind);
    }

    const insert = await query<{
      id: string;
      reference_code: string;
    }>(
      `INSERT INTO growth_applications (
        reference_code, kind, status,
        isp_name, registration_number, ca_licence, county,
        active_subscribers, arpu, billing_system, payment_channels,
        contact_name, email, phone_number, notes,
        monthly_collections, indicative_limit,
        items, financing, access_finance, consent
      ) VALUES (
        $1,$2,'NEW',
        $3,$4,$5,$6,
        $7,$8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,
        $17::jsonb,$18::jsonb,$19,$20::jsonb
      )
      RETURNING id, reference_code`,
      [
        referenceCode,
        kind === "BF" ? "BILLING_FINANCE" : "INFRASTRUCTURE",
        data.isp.name,
        data.isp.reg,
        data.isp.ca,
        data.isp.county,
        data.isp.subs,
        data.isp.arpu,
        data.isp.billing,
        data.isp.channels,
        data.isp.contact,
        data.isp.email,
        phone,
        data.isp.notes || null,
        data.monthlyCollections,
        data.indicativeLimit,
        JSON.stringify(data.items),
        data.financing ? JSON.stringify(data.financing) : null,
        data.accessFinance,
        JSON.stringify(data.consent),
      ],
    );

    const row = insert.rows[0];

    await notifyGrowthApplication({
      referenceCode: row.reference_code,
      ispName: data.isp.name,
      contactName: data.isp.contact,
      phoneNumber: phone,
      itemCount: data.items.length,
      financingAmount: data.financing?.amount ?? null,
      county: data.isp.county,
    });

    return NextResponse.json({
      referenceCode: row.reference_code,
      applicationId: row.id,
    });
  } catch (err) {
    console.error("[growth/applications]", err);
    return NextResponse.json(
      { error: "Could not submit application. Please try again." },
      { status: 500 },
    );
  }
}
