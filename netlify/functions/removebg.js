// Netlify Function: /api/removebg
// Proxies to remove.bg with your secret API key stored as env var REMOVE_BG_API_KEY

export async function handler(event) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }

  try {
    const { imageBase64 } = JSON.parse(event.body || "{}");
    if (!imageBase64) {
      return { statusCode: 400, headers: cors, body: "Missing imageBase64" };
    }

    // Strip data URL prefix
    const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const form = new URLSearchParams();
    form.append("image_file_b64", b64);
    form.append("size", "auto");
    form.append("format", "png");

    const resp = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY },
      body: form
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, headers: cors, body: `remove.bg error: ${resp.status} ${text}` };
    }

    const arrayBuf = await resp.arrayBuffer();
    const outB64 = Buffer.from(arrayBuf).toString("base64");
    const dataUrl = `data:image/png;base64,${outB64}`;

    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: dataUrl })
    };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: `Server error: ${err.message}` };
  }
}
