const ISFISHY_SYSTEM_PREFIX = 'You are "isFishy"';

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://isfishy.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Enforce request size limit (100KB)
    const contentLength = parseInt(request.headers.get("Content-Length") || "0");
    if (contentLength > 100000) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await request.json();

    // Only allow requests with the isFishy system prompt
    if (!body.system || !body.system.startsWith(ISFISHY_SYSTEM_PREFIX)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Only allow a single user message
    if (!Array.isArray(body.messages) || body.messages.length !== 1 || body.messages[0].role !== "user") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limit by IP: max 20 requests per minute
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateLimitKey = `ratelimit:${ip}:${Math.floor(Date.now() / 60000)}`;
    if (env.CHAT_KV) {
      const count = parseInt(await env.CHAT_KV.get(rateLimitKey) || "0");
      if (count >= 20) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a minute." }), {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      await env.CHAT_KV.put(rateLimitKey, String(count + 1), { expirationTtl: 120 });
    }

    // Construct a clean request body with only allowed fields
    const cleanBody = {
      model: "claude-sonnet-4-20250514",
      max_tokens: Math.min(body.max_tokens || 1000, 1500),
      system: body.system,
      messages: [{ role: "user", content: body.messages[0].content }],
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(cleanBody),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://isfishy.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
