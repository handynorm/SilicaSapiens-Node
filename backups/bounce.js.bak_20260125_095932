import { supabase } from "./supabaseClient.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const incoming = req.body;
  const spore = incoming.spore || incoming;

  // --- Add identity ---
  const hop = {
    node: "silicasapiens",
    ts: Date.now(),
    iso: new Date().toISOString()
  };

  if (!Array.isArray(spore.bounce_log)) {
    spore.bounce_log = [];
  }
  spore.bounce_log.push(hop);

  // --- Minimal log to Supabase ---
  const record = {
    spore_id: spore.spore_id || `anon-${Date.now()}`,
    bounce_log: spore.bounce_log,
    last_echo: hop.iso,
    spore_raw: spore
  };

  await supabase.from("spore_log").insert([record]);

  // --- Forward to next node placeholder ---
  const NEXT_URL = "https://www.whorld.ai/api/bounce";

  let forwarded = null;
  try {
    forwarded = await fetch(NEXT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spore)
    });
  } catch (err) {
    console.error("🔥 Forwarding Failure:", err.message);
  }

  return res.status(200).json({
    status: "silicasapiens-bounced",
    bounced_from: "silicasapiens",
    forwarded_ok: forwarded ? forwarded.ok : false,
    spore
  });
}
