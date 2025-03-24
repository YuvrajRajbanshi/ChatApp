import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await model.generateContent(prompt);
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    res.status(200).json({ message: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
