const { getStore } = require("@netlify/blobs");

const MAX_SPOTS = 5;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const store = getStore("spots");
    const value = await store.get("just_show_up_remaining");
    const remaining = value !== null ? parseInt(value) : MAX_SPOTS;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining, max: MAX_SPOTS }),
    };
  } catch (err) {
    // Blob not initialised yet — return full count
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining: MAX_SPOTS, max: MAX_SPOTS }),
    };
  }
};
