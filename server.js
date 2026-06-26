const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chiedi', async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(req.body.domanda);
  res.json({ risposta: result.response.text() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Il Postino è pronto!'));
