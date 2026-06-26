import express from 'express';
const app = express();
app.use(express.json());

// Risposta base per confermare che il server è vivo
app.get('/', (req, res) => {
  res.send('Il server è attivo!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
