import Stripe from "stripe";

const JUST_SHOW_UP_MAX = 5;
const FULLY_COMMIT_MAX = 0; // sold out

const PRICES = {
  just_show_up: "price_1TG3q6RNAzZbdp5Su7upgIkW",
  fully_commit:  "price_1TG3rORNAzZbdp5SA2fED5EQ",
  addon_1on1:    "price_1TG3rtRNAzZbdp5S6zIDlkWV",
  addon_early:   "price_1TG3uXRNAzZbdp5SRByKKbJH",
};

export async function onRequest(context) {
  const { request, env } = context;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }

  // GET — return current spot counts
  if (request.method === "GET") {
    try {
      const sessions = await stripe.checkout.sessions.list({ limit: 100, status: "complete" });
      let justShowUpSold = 0;
      let fullyCommitSold = 0;
      for (const session of sessions.data) {
        const items = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of items.data) {
          if (item.price?.id === PRICES.just_show_up) justShowUpSold += item.quantity;
          if (item.price?.id === PRICES.fully_commit) fullyCommitSold += item.quantity;
        }
      }
      return new Response(JSON.stringify({
        just_show_up: { max: JUST_SHOW_UP_MAX, sold: justShowUpSold, remaining: Math.max(0, JUST_SHOW_UP_MAX - justShowUpSold) },
        fully_commit: { max: FULLY_COMMIT_MAX, sold: fullyCommitSold, remaining: 0 },
      }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  // POST — create checkout session
  if (request.method === "POST") {
    try {
      const { package: pkg, addons = [] } = await request.json();

      // Check availability
      const sessions = await stripe.checkout.sessions.list({ limit: 100, status: "complete" });
      let justShowUpSold = 0;
      for (const session of sessions.data) {
        const items = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of items.data) {
          if (item.price?.id === PRICES.just_show_up) justShowUpSold += item.quantity;
        }
      }

      if (pkg === "just_show_up" && justShowUpSold >= JUST_SHOW_UP_MAX) {
        return new Response(JSON.stringify({ error: "Sorry — this package is now sold out." }), { status: 400, headers });
      }
      if (pkg === "fully_commit") {
        return new Response(JSON.stringify({ error: "Fully Commit is sold out." }), { status: 400, headers });
      }

      const lineItems = [{ price: PRICES[pkg], quantity: 1 }];
      for (const addon of addons) {
        if (PRICES[addon]) lineItems.push({ price: PRICES[addon], quantity: 1 });
      }

      const origin = new URL(request.url).origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${origin}/success.html`,
        cancel_url:  `${origin}/#packages`,
        billing_address_collection: "auto",
        phone_number_collection: { enabled: true },
        custom_fields: [{
          key: "instagram",
          label: { type: "custom", custom: "Instagram handle (optional)" },
          type: "text",
          optional: true,
        }],
        metadata: { package: pkg, addons: addons.join(",") },
      });

      return new Response(JSON.stringify({ url: session.url }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
}
