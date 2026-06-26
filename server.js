import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server in ascolto sulla porta 3000'));
