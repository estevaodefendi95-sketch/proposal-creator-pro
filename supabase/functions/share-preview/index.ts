import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/VWMmCbdJlhS2rkMlcOZ3l8kBSRo1/social-images/social-1783716201166-Gemini_Generated_Image_ytj6mhytj6mhytj6.webp";
const APP_URL = "https://nortyxproposta.lovable.app";

const CRAWLER_UA_PATTERNS = [
  "whatsapp",
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "telegrambot",
  "discordbot",
  "skypeuripreview",
  "vkshare",
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_PATTERNS.some((p) => ua.includes(p));
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const userAgent = req.headers.get("user-agent");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const appLink = `${APP_URL}/p/${token}`;

  // Regular human visitors: send them straight to the real app, no detour.
  if (!isCrawler(userAgent)) {
    return Response.redirect(appLink, 302);
  }

  // Crawlers (WhatsApp, Facebook, etc.): serve a tiny static page with correct meta tags,
  // since they never execute JavaScript and can't see the SPA's dynamic title.
  let clientName: string | null = null;
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data } = await supabase.rpc("get_proposal_by_token", { token });
    const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
    if (row?.client_name && row.client_name !== "[Nome do Cliente]") {
      clientName = row.client_name;
    }
  } catch (_e) {
    // Ignore errors here; fall back to the generic title/description below.
  }

  const title = clientName ? `Proposta Comercial — ${clientName}` : "Proposta Comercial — Nortyx";
  const description = clientName
    ? `Proposta comercial preparada especialmente para ${clientName}.`
    : "Consultoria financeira e soluções digitais";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:url" content="${appLink}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${OG_IMAGE}" />
<meta http-equiv="refresh" content="0; url=${appLink}" />
</head>
<body>
<p>Redirecionando... <a href="${appLink}">Clique aqui se não for redirecionado automaticamente</a>.</p>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
