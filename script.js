const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const balanceEl = document.getElementById('balance');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateBalance() {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  balanceEl.textContent = total.toFixed(2);
}

function renderExpenses() {
  list.innerHTML = '';
  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.className = `expense-item ${exp.amount >= 0 ? 'income' : 'expense'}`;
    li.innerHTML = `
      ${exp.date} - ${exp.description}: ${exp.amount} 
      <span>
        <button onclick="editExpense(${index})">✏️</button>
        <button onclick="deleteExpense(${index})">🗑️</button>
      </span>
    `;
    list.appendChild(li);
  });
  updateBalance();
  saveToLocalStorage();
}

function addExpense(e) {
  e.preventDefault();
  const desc = document.getElementById('description').value;
  const amt = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  if (!desc || isNaN(amt) || !date) return;

  expenses.push({ description: desc, amount: amt, date });
  form.reset();
  renderExpenses();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById('description').value = exp.description;
  document.getElementById('amount').value = exp.amount;
  document.getElementById('date').value = exp.date;
  deleteExpense(index);
}

form.addEventListener('submit', addExpense);
renderExpenses();
