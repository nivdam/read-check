export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment");
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is missing on server" });
    }

    return res.status(200).json({
      ok: true,
      hasKey: true,
      keyStartsWith: apiKey.slice(0, 5), // Return first 5 characters for verification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to debug key" });
  }
}
