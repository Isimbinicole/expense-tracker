// Set max date to today to prevent selecting future dates in the date input
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  document.getElementById("date").setAttribute("max", today); // Set it as the max attribute of the date input
});

// Get references to form elements
const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const balanceEl = document.getElementById('balance');

// Load saved expenses from localStorage or initialize an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Save current expenses array to localStorage
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Calculate total balance and display it
function updateBalance() {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0); // Sum up all amounts
  balanceEl.textContent = total.toFixed(2); // Display with 2 decimal places
}

// Render all expense items in the UI
function renderExpenses() {
  list.innerHTML = ''; // Clear the current list
  expenses.forEach((exp, index) => {
    const li = document.createElement('li'); // Create new list item
    // Add a class based on whether the amount is income or expense
    li.className = `expense-item ${exp.amount >= 0 ? 'income' : 'expense'}`;
    // Set the inner HTML of the list item with expense details and action buttons
    li.innerHTML = `
      ${exp.date} - ${exp.description}: ${exp.amount} 
      <span>
        <button onclick="editExpense(${index})">✏️</button>
        <button onclick="deleteExpense(${index})">🗑️</button>
      </span>
    `;
    list.appendChild(li); // Add the item to the list
  });

  updateBalance(); // Update balance after rendering
  saveToLocalStorage(); // Save changes to localStorage
}

// Handle adding a new expense
function addExpense(e) {
  e.preventDefault(); // Prevent default form submission

  // Get values from input fields
  const desc = document.getElementById('description').value;
  const amt = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;

  // Validate inputs
  if (!desc || isNaN(amt) || amt < 0 || !date) {
    alert("Please fill all fields with valid data.");
    return;
  }

  // Check if the date is not in the future
  const selectedDate = new Date(date);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); // Normalize today's date to 00:00

  if (selectedDate > todayDate) {
    alert("Future dates are not allowed.");
    return;
  }

  // Add new expense to the array
  expenses.push({ description: desc, amount: amt, date });
  form.reset(); // Clear form inputs
  renderExpenses(); // Re-render the updated list
}

// Delete an expense by index
function deleteExpense(index) {
  expenses.splice(index, 1); // Remove the item at the specified index
  renderExpenses(); // Re-render the updated list
}

// Edit an expense by pre-filling the form and deleting the original
function editExpense(index) {
  const exp = expenses[index]; // Get the selected expense
  // Pre-fill the form inputs with the existing values
  document.getElementById('description').value = exp.description;
  document.getElementById('amount').value = exp.amount;
  document.getElementById('date').value = exp.date;
  deleteExpense(index); // Remove the original entry
}

// Attach form submit event to the addExpense function
form.addEventListener('submit', addExpense);

// Initial rendering of expenses when the page loads
renderExpenses();
