export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.KALSHI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "KALSHI_API_KEY not set" });

  try {
    const [positions, balance] = await Promise.all([
      fetch("https://api.elections.kalshi.com/trade-api/v2/portfolio/positions", {
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
      }).then(r => r.json()),
      fetch("https://api.elections.kalshi.com/trade-api/v2/portfolio/balance", {
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
      }).then(r => r.json())
    ]);
    return res.status(200).json({ positions, balance });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
