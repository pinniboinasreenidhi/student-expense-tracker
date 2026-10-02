const expenseForm = document.getElementById("expenseForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const filterCategory = document.getElementById("filterCategory");
const expenseList = document.getElementById("expenseList");
const emptyMessage = document.getElementById("emptyMessage");
const totalExpense = document.getElementById("totalExpense");
const expenseCount = document.getElementById("expenseCount");

let expenses = JSON.parse(localStorage.getItem("studentExpenses")) || [];

dateInput.value = new Date().toISOString().split("T")[0];

function saveExpenses() {
  localStorage.setItem("studentExpenses", JSON.stringify(expenses));
}

function displayExpenses() {
  const selectedCategory = filterCategory.value;

  const filteredExpenses = selectedCategory === "All"
    ? expenses
    : expenses.filter(expense => expense.category === selectedCategory);

  expenseList.innerHTML = "";

  if (filteredExpenses.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  filteredExpenses.forEach(expense => {
    const item = document.createElement("div");
    item.className = "expense-item";

    item.innerHTML = `
      <div class="expense-info">
        <h3>${escapeHTML(expense.description)}</h3>
        <p>${escapeHTML(expense.category)} • ${expense.date}</p>
      </div>
      <div class="amount">₹${expense.amount.toFixed(2)}</div>
      <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
    `;

    expenseList.appendChild(item);
  });

  updateSummary();
}

function updateSummary() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  totalExpense.textContent = `₹${total.toFixed(2)}`;
  expenseCount.textContent = expenses.length;
}

expenseForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!description || amount <= 0 || !date) {
    alert("Please enter valid expense details.");
    return;
  }

  const newExpense = {
    id: Date.now(),
    description: description,
    amount: amount,
    category: category,
    date: date
  };

  expenses.push(newExpense);
  saveExpenses();
  displayExpenses();

  expenseForm.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
});

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  displayExpenses();
}

filterCategory.addEventListener("change", displayExpenses);

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

displayExpenses();
