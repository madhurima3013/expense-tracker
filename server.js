const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// In-memory array to store transactions locally
let transactions = [];

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  try {
    const { title, amount, type, category } = req.body;
    const newTransaction = {
      _id: Date.now().toString(),
      title,
      amount: Number(amount),
      type,
      category,
      date: new Date()
    };
    transactions.unshift(newTransaction);
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  transactions = transactions.filter(t => t._id !== id);
  res.json({ message: 'Transaction deleted successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));