import { useState, useRef } from 'react'

export default function ExpenseInput({ onAddExpense }) {

  const [formData, setFormData] = useState({
    title: '',
    amount: ''
  })

  const titleInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add expense to the list
    onAddExpense(formData)

    // Show success alert
    alert('New expense added successfully! ✅')

    // Reset form
    setFormData({
      title: '',
      amount: ''
    })

    // Focus back on title input
    titleInputRef.current.focus()
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">

      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-xl shadow-lg">

        <div className="bg-white p-5 rounded-[10px]">

          <h1 className="text-xl font-bold text-gray-800 mb-4">
            💰 Add New Expense
          </h1>

          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={handleSubmit}
          >

            <input
              ref={titleInputRef}
              type="text"
              name="title"
              value={formData.title}
              placeholder="Expense Title"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount (₹)"
              value={formData.amount}
              min="0.01"
              step="0.01"
              className="sm:w-36 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition duration-300"
            >
              + Add
            </button>

          </form>

        </div>
      </div>

    </div>
  )
}