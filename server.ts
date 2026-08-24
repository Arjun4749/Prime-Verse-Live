import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Google Search Grounded Quick Search
  app.post("/api/search", async (req, res) => {
    try {
      const { query, category } = req.body;
      if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ error: "Search query is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      let aiResult = null;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          const systemPrompt = `You are the Google Search Grounded Search Engine for PRIME verse (BGMI Esports Arena).
The user is searching for BGMI esports, tournaments, team news, player statistics, match rules, or esports tournament updates.
User Query: "${query.trim()}".
Requested Category Filter: "${category || "All"}".

Instructions:
1. Perform Google Search Grounding to find real-time, verified news, tournament schedules, team/player updates, or esports match context.
2. Formulate a direct, high-impact summary (2-3 bullet points max) answering the query with real-time web facts.
3. Keep the tone sharp, professional, and esports-focused.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: query.trim(),
            config: {
              systemInstruction: systemPrompt,
              tools: [{ googleSearch: {} }],
            },
          });

          const text = response.text || "No AI grounded summary available for this query.";
          const groundingChunks =
            response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

          const sources = groundingChunks
            .map((chunk: any) => chunk?.web)
            .filter((web: any) => web && web.uri)
            .map((web: any) => ({
              title: web.title || web.uri,
              uri: web.uri,
            }));

          // Remove duplicate sources by URI
          const uniqueSources = Array.from(
            new Map(sources.map((item: any) => [item.uri, item])).values()
          );

          aiResult = {
            summary: text,
            sources: uniqueSources,
          };
        } catch (aiErr: any) {
          const isQuota =
            aiErr?.status === "RESOURCE_EXHAUSTED" ||
            aiErr?.code === 429 ||
            (typeof aiErr?.message === "string" &&
              (aiErr.message.includes("quota") ||
                aiErr.message.includes("429") ||
                aiErr.message.includes("RESOURCE_EXHAUSTED")));

          if (isQuota) {
            aiResult = {
              summary: `⚡ Google Search Grounding API rate limit briefly reached for "${query.trim()}". Showing live platform arena records below.`,
              sources: [
                { title: "PRIME verse Active Tournaments", uri: "https://bgmi-esports.com/tournaments" },
                { title: "Match Room IDs & WhatsApp Alerts", uri: "https://bgmi-esports.com/whatsapp" },
              ],
              isQuotaExhausted: true,
            };
          } else {
            console.error("Gemini grounding search error:", aiErr?.message || aiErr);
            aiResult = {
              summary: `PRIME verse search index summary for "${query.trim()}". Review matching tournament brackets, players, and match rooms below.`,
              sources: [],
            };
          }
        }
      }

      return res.json({
        query: query.trim(),
        category: category || "All",
        aiGroundedResult: aiResult,
      });
    } catch (err: any) {
      console.error("Search API handler error:", err);
      return res.status(500).json({ error: "Search service temporary failure." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
