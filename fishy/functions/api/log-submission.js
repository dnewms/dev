function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://isfishy.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Rate limit by IP: max 10 submissions per minute
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateLimitKey = `ratelimit:sub:${ip}:${Math.floor(Date.now() / 60000)}`;
    if (env.CHAT_KV) {
      const count = parseInt(await env.CHAT_KV.get(rateLimitKey) || "0");
      if (count >= 10) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a minute." }), {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }
      await env.CHAT_KV.put(rateLimitKey, String(count + 1), { expirationTtl: 120 });
    }

    // Enforce request size limit (50KB)
    const contentLength = parseInt(request.headers.get("Content-Length") || "0");
    if (contentLength > 50000) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const body = await request.json();

    const id = crypto.randomUUID();

    const entry = {
      id,
      timestamp: new Date().toISOString(),
      userId: body.userId || "anonymous",
      inputType: body.inputType || "text",
      content: typeof body.content === "string" ? body.content.slice(0, 5000) : "",
      verdict: body.verdict || null,
      confidence: body.confidence || null,
      title: typeof body.title === "string" ? body.title.slice(0, 200) : "",
      redFlags: Array.isArray(body.redFlags) ? body.redFlags.slice(0, 20) : [],
      advice: typeof body.advice === "string" ? body.advice.slice(0, 500) : "",
      explanation: typeof body.explanation === "string" ? body.explanation.slice(0, 1000) : "",
    };

    if (env.CHAT_KV) {
      await env.CHAT_KV.put(`sub:${id}`, JSON.stringify(entry), {
        expirationTtl: 60 * 60 * 24 * 365,
      });

      const idx = (await env.CHAT_KV.get("sub_index")) || "[]";
      const index = JSON.parse(idx);
      index.push(id);
      if (index.length > 100000) index.shift();
      await env.CHAT_KV.put("sub_index", JSON.stringify(index));
    }

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders() });
}
