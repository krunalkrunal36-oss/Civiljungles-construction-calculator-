import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Construction Cost Estimator" });
  });

  // AI Construction Assistant Advisor Endpoint
  app.post("/api/ai-advisor", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY environment variable is missing.",
          advice: "AI Assistant is unavailable without an API key. You can still use all manual calculations and custom cost options!"
        });
      }

      const { projectDetails, userQuestion, promptType } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      let systemPrompt = `You are an expert civil engineering consultant, construction cost estimator, and architectural advisor specializing in residential and commercial building projects.
Provide clear, practical, highly structured advice in conversational Hindi/Hinglish or English (matching user language preference).
Give actionable cost-reduction tips, material specification advice (Cement grade PPC vs OPC, TMT Fe500D vs Fe550D, AAC blocks vs Red Bricks, CPVC vs UPVC pipes, Modular switches ratings), and step-by-step structural quality checks.`;

      let userPrompt = "";

      if (promptType === "cost_saving") {
        userPrompt = `Analyze this construction project and give 5 practical cost-reduction tips without compromising structural safety:
Project Area: ${projectDetails.totalArea} sq.ft (${projectDetails.floors} floors)
Quality Grade: ${projectDetails.qualityGrade}
Estimated Cost: ₹${projectDetails.totalCost?.toLocaleString('en-IN')}

User Question: ${userQuestion || 'How can I save money on material and labour?'}`;
      } else if (promptType === "material_guidance") {
        userPrompt = `Provide expert comparison and recommendation for materials for a ${projectDetails.totalArea} sq.ft house:
1. Bricks vs AAC Blocks
2. Concrete Mix (Site mix vs Ready Mix M20/M25)
3. Flooring (Vitrified 2x2 vs Marble vs Granite)
4. Electrical Switches & Wiring safety specs
5. Plumbing CPVC/SWR pipe selection

User Specific Question: ${userQuestion || 'Which material gives best durability and value?'}`;
      } else {
        userPrompt = `Project Summary:
- Area: ${projectDetails.totalArea} sq.ft, Floors: ${projectDetails.floors}
- Estimated Total Cost: ₹${projectDetails.totalCost?.toLocaleString('en-IN')}
- Quality: ${projectDetails.qualityGrade}

User Question: ${userQuestion}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
        ]
      });

      const adviceText = response.text || "No response received from AI advisor.";

      return res.json({ advice: adviceText });
    } catch (err: any) {
      console.error("AI Advisor error:", err);
      return res.status(500).json({
        error: "Failed to generate AI advice",
        details: err?.message || "Unknown error"
      });
    }
  });

  // Vite middleware for dev
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
    console.log(`Construction Cost Estimator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
