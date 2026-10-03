const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');

let chartInstance = null;

async function fetchTransactions() {
  const res = await fetch('/api/transactions');
  const transactions = await res.json();
  updateUI(transactions);
}

function updateUI(transactions) {
  list.innerHTML = '';
  let income = 0;
  let expense = 0;
  const categoryTotals = {};

  transactions.forEach(t => {
    const item = document.createElement('li');
    item.innerHTML = `
      <span>${t.title} (${t.category})</span>
      <span>${t.type === 'income' ? '+' : '-'}₹${t.amount.toFixed(2)} 
        <button class="delete-btn" onclick="deleteTransaction('${t._id}')">X</button>
      </span>
    `;
    list.appendChild(item);

    if (t.type === 'income') {
      income += t.amount;
    } else {
      expense += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  totalIncome.innerText = `₹${income.toFixed(2)}`;
  totalExpense.innerText = `₹${expense.toFixed(2)}`;
  totalBalance.innerText = `₹${(income - expense).toFixed(2)}`;

  renderChart(categoryTotals);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, type, category })
  });

  form.reset();
  fetchTransactions();
});

async function deleteTransaction(id) {
  await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
  fetchTransactions();
}

function renderChart(categoryTotals) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#2ecc71', '#e67e22']
      }]
    }
  });
}

fetchTransactions();