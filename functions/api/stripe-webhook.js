const JSU_LINK_SLUGS = new Set([
  "cNi5kF0NR6J6fNY5Aa3Je00",
  "14A4gB0NRffC9pAgeO3Je04",
  "14AeVf2VZ6J66do2nY3Je05",
  "eVq7sNeEHloMcBM6Ee3Je06",
]);

const JSU_PRICE_ID = "price_1TG3q6RNAzZbdp5Su7upgIkW";

// Verify Stripe webhook signature using Web Crypto API (no SDK needed)
async function verifyStripeSignature(rawBody, sigHeader, secret) {
  const encoder = new TextEncoder();
  const parts = sigHeader.split(",");
  const t = parts.find(p => p.startsWith("t="))?.slice(2);
  const v1 = parts.find(p => p.startsWith("v1="))?.slice(3);
  if (!t || !v1) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${t}.${rawBody}`)
  );

  const hex = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return hex === v1;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const key = env.STRIPE_SECRET_KEY;

  const rawBody = await request.text();
  const sigHeader = request.headers.get("stripe-signature") || "";

  const valid = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = event.data.object;

  try {
    let isJSU = false;

    if (session.payment_link) {
      try {
        const res = await fetch(`https://api.stripe.com/v1/payment_links/${session.payment_link}`, {
          headers: { Authorization: `Bearer ${key}` },
        });
        const pl = await res.json();
        const slug = pl.url?.split("/").pop();
        if (JSU_LINK_SLUGS.has(slug)) isJSU = true;
      } catch (e) {}
    }

    if (!isJSU) {
      const res = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${session.id}/line_items`,
        { headers: { Authorization: `Bearer ${key}` } }
      );
      const lineItems = await res.json();
      isJSU = (lineItems.data || []).some(item => item.price?.id === JSU_PRICE_ID);
    }

    console.log(`Checkout completed. Session: ${session.id}, isJSU: ${isJSU}`);
    return new Response(JSON.stringify({ received: true, isJSU }), { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
