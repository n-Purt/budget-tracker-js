const formEl = document.querySelector(".add");
const incomeListEl = document.querySelector("ul.income-list");
const expenseListEl = document.querySelector("ul.expense-list");
const removeTransactionEl = document.querySelector(".bi-trash");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);

  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);

  const updatedBalance = updatedIncome - updatedExpense;
  balance.textContent = updatedBalance;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
}

updateStatistics();

function generateTemplate(id, source, time, amount) {
  return `<li data-id="${id}">
                  <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                  </p>
                  $<span>${Math.abs(amount)}</span>
                  <i class="bi bi-trash delete"></i>
                </li>`;
}

function addTransactionDOM(id, source, time, amount) {
  if (amount > 0) {
    incomeListEl.innerHTML += generateTemplate(id, source, time, amount);
  } else {
    expenseListEl.innerHTML += generateTemplate(id, source, time, amount);
  }
}

function addTransaction(source, amount) {
  const time = new Date();

  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
    amount: amount,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction.id, source, transaction.time, amount);
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  if (formEl.source.value.trim() === "" || formEl.amount.value === "") {
    return alert("Please enter a valid value");
  } else {
    addTransaction(formEl.source.value.trim(), Number(formEl.amount.value));
    updateStatistics();
    formEl.reset();
  }
});

function getTransaction() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeListEl.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.time,
        transaction.amount
      );
    } else {
      expenseListEl.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.time,
        transaction.amount
      );
    }
  });
}
getTransaction();

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeListEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseListEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

function init() {
  updateStatistics();
  getTransaction();
}

init();
