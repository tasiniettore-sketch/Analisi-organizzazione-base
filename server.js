const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

// Aggiungiamo questa riga per permettere al sito di parlare con il server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Aggiungiamo questa riga per la pagina principale
app.get('/', (req, res) => {
  res.send('Il Postino di Gemini è online e pronto!');
});
app.post('/chiedi', async (req, res) => {
  // Nel file server.js, modifica la parte del modello così:
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "TU SEI UN ESPERTO DI ANALISI ORGANIZZATIVA. ANALIZZA..." // Qui incolla le istruzioni che avevi in AI Studio
});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Il Postino è pronto!'));
