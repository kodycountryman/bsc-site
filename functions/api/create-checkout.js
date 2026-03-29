const JUST_SHOW_UP_MAX = 5;
const FULLY_COMMIT_MAX = 0;

const PRICES = {
  just_show_up: "price_1TG3q6RNAzZbdp5Su7upgIkW",
  fully_commit:  "price_1TG3rORNAzZbdp5SA2fED5EQ",
  addon_1on1:    "price_1TG3rtRNAzZbdp5S6zIDlkWV",
  addon_early:   "price_1TG3uXRNAzZbdp5SRByKKbJH",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function stripeAuth(key) {
  return { Authorization: `Bearer ${key}` };
}

async function listCompletedSessions(key) {
  const res = await fetch(
    "https://api.stripe.com/v1/checkout/sessions?limit=100&status=complete",
    { headers: stripeAuth(key) }
  );
  const data = await res.json();
  return data.data || [];
}

async function listLineItems(sessionId, key) {
  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items`,
    { headers: stripeAuth(key) }
  );
  const data = await res.json();
  return data.data || [];
}

export async function onRequest(context) {
  const { request, env } = context;
  const key = env.STRIPE_SECRET_KEY;

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers: CORS });
  }

  // GET — return current spot counts
  if (request.method === "GET") {
    try {
      const sessions = await listCompletedSessions(key);
      let justShowUpSold = 0, fullyCommitSold = 0;
      for (const session of sessions) {
        const items = await listLineItems(session.id, key);
        for (const item of items) {
          if (item.price?.id === PRICES.just_show_up) justShowUpSold += item.quantity;
          if (item.price?.id === PRICES.fully_commit) fullyCommitSold += item.quantity;
        }
      }
      return new Response(JSON.stringify({
        just_show_up: { max: JUST_SHOW_UP_MAX, sold: justShowUpSold, remaining: Math.max(0, JUST_SHOW_UP_MAX - justShowUpSold) },
        fully_commit: { max: FULLY_COMMIT_MAX, sold: fullyCommitSold, remaining: 0 },
      }), { status: 200, headers: CORS });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
    }
  }

  // POST — create checkout session
  if (request.method === "POST") {
    try {
      const { package: pkg, addons = [] } = await request.json();

      // Check availability
      const sessions = await listCompletedSessions(key);
      let justShowUpSold = 0;
      for (const session of sessions) {
        const items = await listLineItems(session.id, key);
        for (const item of items) {
          if (item.price?.id === PRICES.just_show_up) justShowUpSold += item.quantity;
        }
      }

      if (pkg === "just_show_up" && justShowUpSold >= JUST_SHOW_UP_MAX) {
        return new Response(JSON.stringify({ error: "Sorry — this package is now sold out." }), { status: 400, headers: CORS });
      }
      if (pkg === "fully_commit") {
        return new Response(JSON.stringify({ error: "Fully Commit is sold out." }), { status: 400, headers: CORS });
      }

      const origin = new URL(request.url).origin;
      const lineItems = [
        { price: PRICES[pkg], quantity: 1 },
        ...addons.filter(a => PRICES[a]).map(a => ({ price: PRICES[a], quantity: 1 })),
      ];

      // Build Stripe form-encoded body (bracket notation for nested params)
      const params = new URLSearchParams();
      params.set("mode", "payment");
      params.set("success_url", `${origin}/success.html`);
      params.set("cancel_url", `${origin}/#packages`);
      params.set("billing_address_collection", "auto");
      params.set("phone_number_collection[enabled]", "true");
      params.set("custom_fields[0][key]", "instagram");
      params.set("custom_fields[0][label][type]", "custom");
      params.set("custom_fields[0][label][custom]", "Instagram handle (optional)");
      params.set("custom_fields[0][type]", "text");
      params.set("custom_fields[0][optional]", "true");
      params.set("metadata[package]", pkg);
      params.set("metadata[addons]", addons.join(","));
      lineItems.forEach((item, i) => {
        params.set(`line_items[${i}][price]`, item.price);
        params.set(`line_items[${i}][quantity]`, "1");
      });

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          ...stripeAuth(key),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const session = await res.json();
      if (session.error) throw new Error(session.error.message);

      return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: CORS });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS });
}
