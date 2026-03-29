const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getStore } = require("@netlify/blobs");

// URL slugs from each JSU payment link
const JSU_LINK_SLUGS = new Set([
  "cNi5kF0NR6J6fNY5Aa3Je00",  // Just Show Up $499
  "14A4gB0NRffC9pAgeO3Je04",  // JSU + 1-on-1 $596
  "14AeVf2VZ6J66do2nY3Je05",  // JSU + Early Access $548
  "eVq7sNeEHloMcBM6Ee3Je06",  // JSU + Both $645
]);

// Base price ID fallback
const JSU_PRICE_ID = "price_1TG3q6RNAzZbdp5Su7upgIkW";
const MAX_SPOTS = 5;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Signature failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Ignored" };
  }

  const session = stripeEvent.data.object;

  try {
    let isJSU = false;

    // Method 1: match by payment link URL slug
    if (session.payment_link) {
      try {
        const pl = await stripe.paymentLinks.retrieve(session.payment_link);
        const slug = pl.url?.split("/").pop();
        if (JSU_LINK_SLUGS.has(slug)) {
          isJSU = true;
          console.log("JSU matched via link slug:", slug);
        }
      } catch (e) {}
    }

    // Method 2: fallback — check line items for base JSU price ID
    if (!isJSU) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      isJSU = lineItems.data.some(item => item.price?.id === JSU_PRICE_ID);
      if (isJSU) console.log("JSU matched via price ID");
    }

    if (!isJSU) {
      console.log("Not JSU, skipping:", session.id);
      return { statusCode: 200, body: "Not a JSU purchase" };
    }

    // Decrement blob counter
    const store = getStore("spots");
    const current = await store.get("just_show_up_remaining");
    const remaining = current !== null ? parseInt(current) : MAX_SPOTS;
    const newCount = Math.max(0, remaining - 1);
    await store.set("just_show_up_remaining", String(newCount));

    console.log(`Spot sold. Remaining: ${newCount}`);
    return { statusCode: 200, body: JSON.stringify({ remaining: newCount }) };

  } catch (err) {
    console.error("Error:", err.message);
    return { statusCode: 500, body: err.message };
  }
};
