import { GoogleGenerativeAI } from "@google/generative-ai";

const gen = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { prompt } = req.body;

    const model = gen.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`
      Build a FULL website inside one code block.
      Include: HTML + CSS + optional JS.
      No markdown. Only raw code.
      User request: ${prompt}
    `);

    res.status(200).json({ website: result.response.text() });

  } catch (err) {
    res.status(500).json({ error: "Gemini failed." });
  }
}
