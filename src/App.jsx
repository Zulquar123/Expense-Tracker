import ExpenseInput from './ExpenseInput'
import ExpenseOutput from './ExpenseOutput'
import { useState, useEffect } from 'react'

export default function App() {

  // Load data from Local Storage
  const [expensesList, setExpensesList] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses')
    return savedExpenses ? JSON.parse(savedExpenses) : []
  })

  // Save data to Local Storage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expensesList))
  }, [expensesList])

  // Add Expense
  const addExpenses = (newExpense) => {
    setExpensesList((previousExpenses) => [
      ...previousExpenses,
      newExpense
    ])
  }

  // Delete Expense
  const deleteExpense = (index) => {
    setExpensesList((previousExpenses) =>
      previousExpenses.filter((expense, i) => i !== index)
    )
  }

  return (
    <div>

      <ExpenseInput onAddExpense={addExpenses} />

      <ExpenseOutput
        expenses={expensesList}
        onDeleteExpense={deleteExpense}
      />

    </div>
  )
}