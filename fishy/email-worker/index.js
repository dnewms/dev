import { EmailMessage } from "cloudflare:email";

function parseEmail(rawEmail) {
  const headerEnd = rawEmail.indexOf("\r\n\r\n");
  const headerBlock = headerEnd !== -1 ? rawEmail.slice(0, headerEnd) : rawEmail;
  const bodyBlock = headerEnd !== -1 ? rawEmail.slice(headerEnd + 4) : "";

  const unfoldedHeaders = headerBlock.replace(/\r\n(?=[ \t])/g, " ");

  const getHeader = (name) => {
    const regex = new RegExp(`^${name}:\\s*(.+)$`, "im");
    const match = unfoldedHeaders.match(regex);
    return match ? match[1].trim() : "";
  };

  const from = getHeader("From");
  const subject = getHeader("Subject");
  const contentType = getHeader("Content-Type");

  let body = "";

  const boundaryMatch = contentType.match(/boundary="?([^";\s]+)"?/i);

  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const parts = bodyBlock.split("--" + boundary);

    let textPlain = "";
    let textHtml = "";

    for (const part of parts) {
      if (part.trim() === "--" || part.trim() === "") continue;

      const partHeaderEnd = part.indexOf("\r\n\r\n");
      if (partHeaderEnd === -1) continue;

      const partHeaders = part.slice(0, partHeaderEnd);
      let partBody = part.slice(partHeaderEnd + 4).trim();

      if (partBody.endsWith("\r\n")) {
        partBody = partBody.slice(0, -2);
      }

      const isQuotedPrintable = /Content-Transfer-Encoding:\s*quoted-printable/i.test(partHeaders);
      const isBase64 = /Content-Transfer-Encoding:\s*base64/i.test(partHeaders);

      if (isQuotedPrintable) {
        partBody = decodeQuotedPrintable(partBody);
      } else if (isBase64) {
        try {
          partBody = atob(partBody.replace(/\s/g, ""));
        } catch (e) {
          // leave as-is
        }
      }

      if (/Content-Type:\s*text\/plain/i.test(partHeaders)) {
        textPlain += partBody;
      } else if (/Content-Type:\s*text\/html/i.test(partHeaders)) {
        textHtml += partBody;
      } else if (/Content-Type:\s*multipart\//i.test(partHeaders)) {
        const nestedBoundaryMatch = partHeaders.match(/boundary="?([^";\s]+)"?/i);
        if (nestedBoundaryMatch) {
          const nestedBoundary = nestedBoundaryMatch[1];
          const nestedParts = partBody.split("--" + nestedBoundary);
          for (const np of nestedParts) {
            if (np.trim() === "--" || np.trim() === "") continue;
            const npHeaderEnd = np.indexOf("\r\n\r\n");
            if (npHeaderEnd === -1) continue;
            const npHeaders = np.slice(0, npHeaderEnd);
            let npBody = np.slice(npHeaderEnd + 4).trim();

            const npQP = /Content-Transfer-Encoding:\s*quoted-printable/i.test(npHeaders);
            const npB64 = /Content-Transfer-Encoding:\s*base64/i.test(npHeaders);
            if (npQP) npBody = decodeQuotedPrintable(npBody);
            else if (npB64) {
              try { npBody = atob(npBody.replace(/\s/g, "")); } catch (e) {}
            }

            if (/Content-Type:\s*text\/plain/i.test(npHeaders)) {
              textPlain += npBody;
            } else if (/Content-Type:\s*text\/html/i.test(npHeaders)) {
              textHtml += npBody;
            }
          }
        }
      }
    }

    if (textPlain) {
      body = textPlain;
    } else if (textHtml) {
      body = stripHtml(textHtml);
    }
  } else {
    if (/text\/html/i.test(contentType)) {
      body = stripHtml(bodyBlock);
    } else {
      body = bodyBlock;
    }

    const isQuotedPrintable = /Content-Transfer-Encoding:\s*quoted-printable/i.test(unfoldedHeaders);
    const isBase64 = /Content-Transfer-Encoding:\s*base64/i.test(unfoldedHeaders);
    if (isQuotedPrintable) {
      body = decodeQuotedPrintable(body);
    } else if (isBase64) {
      try { body = atob(body.replace(/\s/g, "")); } catch (e) {}
    }
  }

  const fromEmail = extractEmailAddress(from);

  return {
    from: fromEmail,
    fromFull: from,
    subject: subject || "(no subject)",
    body: body.trim(),
  };
}

function decodeQuotedPrintable(str) {
  return str
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractEmailAddress(from) {
  const match = from.match(/<([^>]+)>/);
  if (match) return match[1];
  const emailMatch = from.match(/[\w.+-]+@[\w.-]+\.\w+/);
  return emailMatch ? emailMatch[0] : from;
}

async function analyzeWithClaude(env, subject, body) {
  const contentToAnalyze = `Subject: ${subject}\n\n${body}`.slice(0, 4000);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are "isFishy", a friendly scam detection assistant designed for older adults. Analyze the forwarded email the user shares and determine if it's a scam, suspicious, or safe.

Respond ONLY in this JSON format with no markdown or backticks:
{
  "verdict": "safe" | "fishy" | "dangerous",
  "confidence": 1-10,
  "title": "A short 3-6 word title summarizing your verdict",
  "explanation": "A warm, clear, jargon-free explanation in 2-3 sentences about why this is or isn't a scam. Speak like a kind, patient friend. Use simple language.",
  "red_flags": ["list", "of", "specific", "red", "flags", "found"],
  "advice": "One clear sentence telling them what to do next."
}`,
      messages: [
        {
          role: "user",
          content: `Please analyze this email I received and tell me if it's a scam:\n\n${contentToAnalyze}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const raw = data.content
    .map((c) => c.text || "")
    .join("")
    .replace(/```json|```/g, "")
    .trim();
  return JSON.parse(raw);
}

function buildReplyHtml(result, subject, dashboardUrl) {
  const verdictColors = {
    safe: { bg: "#E8F5E9", border: "#4CAF50", text: "#2E7D32", label: "Safe" },
    fishy: { bg: "#FFF3E0", border: "#FF9800", text: "#E65100", label: "Fishy" },
    dangerous: { bg: "#FFEBEE", border: "#F44336", text: "#C62828", label: "Dangerous" },
  };

  const v = verdictColors[result.verdict] || verdictColors.fishy;
  const emoji = result.verdict === "safe" ? "✅" : result.verdict === "fishy" ? "🐡" : "🚨";

  const redFlagsHtml = (result.red_flags || []).length > 0
    ? `<div style="margin: 20px 0;">
        <h3 style="font-family: 'Nunito', Arial, sans-serif; font-size: 18px; color: #1A5276; margin: 0 0 10px;">Red Flags Found:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${result.red_flags.map(f => `<li style="font-family: 'Nunito', Arial, sans-serif; font-size: 16px; color: #333; margin-bottom: 6px; line-height: 1.5;">${escapeHtml(f)}</li>`).join("")}
        </ul>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #F0F7FC; font-family: 'Nunito', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="text-align: center; padding: 30px 0 20px;">
      <h1 style="font-family: 'Nunito', Arial, sans-serif; font-size: 36px; font-weight: 800; color: #1A5276; margin: 0;">
        🐟 isFishy
      </h1>
      <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 14px; color: #7A9BB5; margin: 5px 0 0;">
        Your Scam Detection Assistant
      </p>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <!-- Verdict Header -->
      <div style="background: ${v.bg}; border: 2px solid ${v.border}; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
        <div style="font-size: 40px; margin-bottom: 8px;">${emoji}</div>
        <h2 style="font-family: 'Nunito', Arial, sans-serif; font-size: 24px; font-weight: 800; color: ${v.text}; margin: 0;">
          ${v.label}: ${escapeHtml(result.title)}
        </h2>
        <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 14px; color: ${v.text}; margin: 8px 0 0; opacity: 0.8;">
          Confidence: ${escapeHtml(String(result.confidence))}/10
        </p>
      </div>

      <!-- Original Subject -->
      <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 13px; color: #999; margin: 0 0 16px;">
        Regarding: <em>${escapeHtml(subject)}</em>
      </p>

      <!-- Explanation -->
      <div style="margin-bottom: 20px;">
        <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 17px; color: #333; line-height: 1.6; margin: 0;">
          ${escapeHtml(result.explanation)}
        </p>
      </div>

      ${redFlagsHtml}

      <!-- Advice -->
      <div style="background: #F0F7FC; border-radius: 10px; padding: 16px; margin-top: 20px;">
        <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #1A5276; margin: 0;">
          💡 What to do: ${escapeHtml(result.advice)}
        </p>
      </div>
    </div>

    <!-- Dashboard Link -->
    <div style="text-align: center; padding: 20px 0 8px;">
      <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 28px; font-family: 'Nunito', Arial, sans-serif; font-size: 16px; font-weight: 800; color: white; background: #4A90D9; border-radius: 12px; text-decoration: none;">
        View All Your Results
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px 0;">
      <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 14px; color: #9CB8CE; line-height: 1.6; margin: 0;">
        isFishy uses AI to help spot scams.<br>
        When in doubt, always check with someone you trust.
      </p>
      <p style="font-family: 'Nunito', Arial, sans-serif; font-size: 12px; color: #B8CCD9; margin: 12px 0 0;">
        &copy; isFishy &mdash; Keeping you safe, one email at a time 🐟
      </p>
    </div>
  </div>
</body>
</html>`;
}

async function sendReply(env, senderEmail, subject, result, dashboardKey) {
  const dashboardUrl = `https://isfishy.com/dashboard?email=${encodeURIComponent(senderEmail)}&key=${dashboardKey}`;
  const htmlContent = buildReplyHtml(result, subject, dashboardUrl);
  const replySubject = `isFishy Result: ${result.title}`;
  const fromAddr = "check@isfishy.com";

  const mimeMessage = [
    `From: isFishy <${fromAddr}>`,
    `To: ${senderEmail}`,
    `Subject: ${replySubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    htmlContent,
  ].join("\r\n");

  const msg = new EmailMessage(fromAddr, senderEmail, new Blob([mimeMessage]).stream());
  await env.SEND_EMAIL.send(msg);
}

export default {
  async email(message, env, ctx) {
    try {
      const rawStream = new Response(message.raw);
      const rawText = await rawStream.text();

      const parsed = parseEmail(rawText);

      if (!parsed.from || !parsed.body) {
        console.error("Could not parse email:", { from: parsed.from, bodyLen: parsed.body?.length });
        return;
      }

      const result = await analyzeWithClaude(env, parsed.subject, parsed.body);

      const id = crypto.randomUUID();

      const entry = {
        id,
        timestamp: new Date().toISOString(),
        from: parsed.from,
        subject: parsed.subject,
        bodyPreview: parsed.body.slice(0, 500),
        verdict: result.verdict,
        confidence: result.confidence,
        title: result.title,
        explanation: result.explanation,
        redFlags: result.red_flags || [],
        advice: result.advice,
      };

      if (env.CHAT_KV) {
        await env.CHAT_KV.put(`email:${id}`, JSON.stringify(entry), {
          expirationTtl: 60 * 60 * 24 * 365,
        });

        const idx = (await env.CHAT_KV.get("email_index")) || "[]";
        const index = JSON.parse(idx);
        index.push(id);
        if (index.length > 100000) index.shift();
        await env.CHAT_KV.put("email_index", JSON.stringify(index));
      }

      // Generate or retrieve a secret key for this email address
      const normalizedFrom = parsed.from.toLowerCase().trim();
      let dashboardKey = await env.CHAT_KV.get(`dashboard_key:${normalizedFrom}`);
      if (!dashboardKey) {
        dashboardKey = crypto.randomUUID();
        await env.CHAT_KV.put(`dashboard_key:${normalizedFrom}`, dashboardKey);
      }

      await sendReply(env, parsed.from, parsed.subject, result, dashboardKey);
    } catch (err) {
      console.error("Email worker error:", err.message, err.stack);
    }
  },
};
