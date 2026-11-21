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
