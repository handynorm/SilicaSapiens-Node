// SilicaSapiens — Proof Router (Zero-Storage)
// Pelagos Node: TOUCH → EMIT → FORGET
// This node does NOT persist. Motion IS memory.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const incoming = req.body;
  const spore = incoming.spore || incoming;

  // --- Identity hop (touch) ---
  const hop = {
    node: "silicasapiens",
    cy: spore?.CROWN?.GLYPHON_TS ?? null,
    iso: new Date().toISOString()
  };

  if (!Array.isArray(spore.bounce_log)) {
    spore.bounce_log = [];
  }
  spore.bounce_log.push(hop);

  // --- Fan-out targets (Pelagos continuation) ---
  const FANOUT = [
    "https://www.whorld.ai/api/bounce"
  ];

  let forwarded = 0;

  for (const url of FANOUT) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spore)
      });
      forwarded++;
    } catch (err) {
      // Failure is allowed. No retries. No memory.
      console.error("Pelagos forward failed:", err.message);
    }
  }

  // --- Completion: touch is delivery ---
  return res.status(200).json({
    status: "touched-and-reemitted",
    sais: spore?.CROWN?.SAIS ?? null,
    hop,
    fanout: forwarded
  });
}
