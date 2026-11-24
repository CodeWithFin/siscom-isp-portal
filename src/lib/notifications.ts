export async function notifyCustomerCare(payload: {
  referenceCode: string;
  ispName: string;
  contactName: string;
  phoneNumber: string;
  requestedAmount: number;
  maxQualifiedAmount: number;
}): Promise<void> {
  const email = process.env.CUSTOMER_CARE_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "noreply@siscom.tech";

  const subject = `[Siscom ISP] New loan application ${payload.referenceCode}`;
  const body = [
    `New ISP loan application received.`,
    ``,
    `Reference: ${payload.referenceCode}`,
    `ISP: ${payload.ispName}`,
    `Contact: ${payload.contactName}`,
    `Phone: ${payload.phoneNumber}`,
    `Requested: KES ${payload.requestedAmount.toLocaleString("en-KE")}`,
    `Pre-qualified limit: KES ${payload.maxQualifiedAmount.toLocaleString("en-KE")}`,
  ].join("\n");

  if (!email || !apiKey) {
    console.info("[notifyCustomerCare] skipped (email/API key not configured)");
    console.info(body);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[notifyCustomerCare] Resend error:", text);
    }
  } catch (err) {
    console.error("[notifyCustomerCare] failed:", err);
  }
}

export async function notifyGrowthApplication(payload: {
  referenceCode: string;
  ispName: string;
  contactName: string;
  phoneNumber: string;
  itemCount: number;
  financingAmount: number | null;
  county: string;
}): Promise<void> {
  const email = process.env.CUSTOMER_CARE_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "noreply@siscom.tech";

  const subject = `[Siscom Growth] New application ${payload.referenceCode}`;
  const body = [
    `New ISP Growth application received.`,
    ``,
    `Reference: ${payload.referenceCode}`,
    `ISP: ${payload.ispName}`,
    `County: ${payload.county}`,
    `Contact: ${payload.contactName}`,
    `Phone: ${payload.phoneNumber}`,
    `Infrastructure items: ${payload.itemCount}`,
    payload.financingAmount != null
      ? `Billing finance requested: KES ${payload.financingAmount.toLocaleString("en-KE")}`
      : `Billing finance: none`,
  ].join("\n");

  if (!email || !apiKey) {
    console.info("[notifyGrowthApplication] skipped (email/API key not configured)");
    console.info(body);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[notifyGrowthApplication] Resend error:", text);
    }
  } catch (err) {
    console.error("[notifyGrowthApplication] failed:", err);
  }
}
