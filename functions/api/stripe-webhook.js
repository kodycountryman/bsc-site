import Stripe from "stripe";

const JSU_LINK_SLUGS = new Set([
  "cNi5kF0NR6J6fNY5Aa3Je00",
  "14A4gB0NRffC9pAgeO3Je04",
  "14AeVf2VZ6J66do2nY3Je05",
  "eVq7sNeEHloMcBM6Ee3Je06",
]);

const JSU_PRICE_ID = "price_1TG3q6RNAzZbdp5Su7upgIkW";

export async function onRequestPost(context) {
  const { request, env } = context;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let stripeEvent;
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = stripeEvent.data.object;

  try {
    let isJSU = false;

    if (session.payment_link) {
      try {
        const pl = await stripe.paymentLinks.retrieve(session.payment_link);
        const slug = pl.url?.split("/").pop();
        if (JSU_LINK_SLUGS.has(slug)) isJSU = true;
      } catch (e) {}
    }

    if (!isJSU) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      isJSU = lineItems.data.some(item => item.price?.id === JSU_PRICE_ID);
    }

    console.log(`Checkout completed. Session: ${session.id}, isJSU: ${isJSU}`);
    return new Response(JSON.stringify({ received: true, isJSU }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return new Response(err.message, { status: 500 });
  }
}
