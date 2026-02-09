function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://isfishy.com",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    if (!env.CHAT_KV) {
      return new Response(JSON.stringify({ error: "KV not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const email = url.searchParams.get("email");
    const action = url.searchParams.get("action");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);

    // Rate limit by IP: max 30 requests per minute
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateLimitKey = `ratelimit:results:${ip}:${Math.floor(Date.now() / 60000)}`;
    const count = parseInt(await env.CHAT_KV.get(rateLimitKey) || "0");
    if (count >= 30) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a minute." }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }
    await env.CHAT_KV.put(rateLimitKey, String(count + 1), { expirationTtl: 120 });

    const idx = (await env.CHAT_KV.get("email_index")) || "[]";
    const index = JSON.parse(idx);

    if (action === "recent") {
      const authHeader = request.headers.get("Authorization") || "";
      if (authHeader !== `Bearer ${env.ADMIN_KEY}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }

      const recent = index.slice(-limit).reverse();
      const entries = [];
      for (const entryId of recent) {
        const raw = await env.CHAT_KV.get(`email:${entryId}`);
        if (raw) entries.push(JSON.parse(raw));
      }

      return new Response(JSON.stringify({ count: entries.length, entries }), {
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    if (email) {
      const key = url.searchParams.get("key");
      if (!key) {
        return new Response(JSON.stringify({ error: "Missing key parameter" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const storedKey = await env.CHAT_KV.get(`dashboard_key:${normalizedEmail}`);

      if (!storedKey || storedKey !== key) {
        return new Response(JSON.stringify({ error: "Invalid key" }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }

      const recentIds = index.slice(-500);
      const entries = [];

      for (const entryId of recentIds) {
        const raw = await env.CHAT_KV.get(`email:${entryId}`);
        if (raw) {
          const entry = JSON.parse(raw);
          if (entry.from && entry.from.toLowerCase() === normalizedEmail) {
            entries.push(entry);
          }
        }
      }

      entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return new Response(JSON.stringify({ count: entries.length, entries }), {
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify({ error: "Provide ?email= or ?action=recent" }), {
      status: 400,
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
