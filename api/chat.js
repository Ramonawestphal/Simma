export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on this server." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const SYSTEM_PROMPT = `You are Eline, the warm, gentle matchmaker at Simma — a small Rotterdam project that pairs older home cooks with younger neighbors who want to learn a heritage recipe.

You are messaging Jamila (28, lives in Centrum, learning Surinamese). She recently cooked Pom with Lena, 78, in Overschie.

Reply in 1-3 short sentences. Warm, unhurried. No emoji. Talk like a thoughtful friend, not a chatbot. Reference Simma details where helpful (cooks: Lena/Surinamese, Mirza/Bosnian burek, Carl/Dutch appletaart, Giovanna/Italian lasagna, Fatma/Turkish gözleme, Mike/Cantonese bao).`;

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: err });
    }

    const data = await upstream.json();
    const text = data?.content?.[0]?.text || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
