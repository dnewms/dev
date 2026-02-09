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
    const authHeader = request.headers.get("Authorization") || "";
    if (authHeader !== `Bearer ${env.ADMIN_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    if (!env.CHAT_KV) {
      return new Response(JSON.stringify({ error: "KV not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const format = url.searchParams.get("format") || "json";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "1000"), 5000);
    const since = url.searchParams.get("since") || "";

    const idx = (await env.CHAT_KV.get("sub_index")) || "[]";
    const index = JSON.parse(idx);
    const recent = index.slice(-limit);

    const entries = [];
    for (const id of recent) {
      const raw = await env.CHAT_KV.get(`sub:${id}`);
      if (raw) {
        const entry = JSON.parse(raw);
        if (since && entry.timestamp < since) continue;
        entries.push(entry);
      }
    }

    if (format === "csv") {
      const header = "id,timestamp,userId,inputType,verdict,confidence,title,redFlags,content\n";
      const rows = entries.map((e) => {
        const escaped = (s) => `"${String(s || "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
        return [
          escaped(e.id),
          escaped(e.timestamp),
          escaped(e.userId),
          escaped(e.inputType),
          escaped(e.verdict),
          e.confidence,
          escaped(e.title),
          escaped((e.redFlags || []).join("; ")),
          escaped((e.content || "").slice(0, 2000)),
        ].join(",");
      });
      return new Response(header + rows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=isfishy-submissions.csv",
          ...corsHeaders(),
        },
      });
    }

    return new Response(JSON.stringify({ count: entries.length, entries }), {
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
