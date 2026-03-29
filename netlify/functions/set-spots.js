const { getStore } = require("@netlify/blobs");

// Protected with a simple admin key
// Call: POST /.netlify/functions/set-spots with body { key: "ADMIN_KEY", remaining: 4 }

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "POST only" };
  }

  try {
    const { key, remaining } = JSON.parse(event.body);

    if (key !== process.env.ADMIN_KEY) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    const store = getStore("spots");
    await store.set("just_show_up_remaining", String(remaining));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, remaining }),
    };
  } catch (err) {
    return { statusCode: 500, headers, body: err.message };
  }
};
