// Convert Number into Indian Rupees Words
const numberToWords = (num) => {

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
    'Nineteen'
  ]

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty',
    'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ]

  const convertBelowThousand = (n) => {
    if (n < 20) return ones[n]

    if (n < 100) {
      return tens[Math.floor(n / 10)] +
        (n % 10 ? ' ' + ones[n % 10] : '')
    }

    return ones[Math.floor(n / 100)] + ' Hundred' +
      (n % 100 ? ' ' + convertBelowThousand(n % 100) : '')
  }

  if (!Number.isFinite(num) || num < 0 || num >= 1000000000) {
    return 'Amount out of range'
  }

  if (num === 0) return 'Zero Rupees Only'

  let words = ''

  const crore = Math.floor(num / 10000000)
  num %= 10000000

  const lakh = Math.floor(num / 100000)
  num %= 100000

  const thousand = Math.floor(num / 1000)
  num %= 1000

  if (crore) words += convertBelowThousand(crore) + ' Crore '
  if (lakh) words += convertBelowThousand(lakh) + ' Lakh '
  if (thousand) words += convertBelowThousand(thousand) + ' Thousand '
  if (num) words += convertBelowThousand(num)

  return words.trim() + ' Rupees Only'
}


export default function ExpenseOutput({ expenses, onDeleteExpense }) {

  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  )

  // Delete Expense
  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this expense?'
    )

    if (confirmDelete) {
      onDeleteExpense(index)
      alert('Expense deleted successfully! ✅')
    }
  }

  // Print / Download PDF
  const handlePrint = () => {
    if (expenses.length === 0) {
      alert('No expenses available to print!')
      return
    }

    window.print()
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">

      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl shadow-lg">

        <div className="bg-white rounded-[14px] p-5">

          {/* Heading */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

            <h1 className="text-lg font-bold text-gray-800">
              📋 Expense List
            </h1>

            <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-2 rounded-full">
              Total: ₹{totalAmount.toFixed(2)}
            </span>

            <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-2 rounded-full">
              {expenses.length} Expenses
            </span>

          </div>

          {/* Print and PDF Buttons */}
          <div className="flex gap-3 mb-5 print:hidden">

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg transition duration-300"
            >
              🖨️ Print
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg transition duration-300"
            >
              📄 Download PDF
            </button>

          </div>

          {/* Expense Rows */}
          <div className="space-y-3">

            {expenses.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-5">
                No expenses added yet.
              </p>
            ) : (
              expenses.map((expense, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 border-l-4 border-l-indigo-500 rounded-xl px-4 py-3 hover:border-purple-400 hover:shadow-md transition-all duration-300 print:shadow-none print:break-inside-avoid"
                >

                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {expense.title}
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Expense #{index + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <p className="text-base font-bold text-indigo-600">
                      ₹{Number(expense.amount).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="bg-red-100 hover:bg-red-600 text-red-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition duration-300 print:hidden"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>

              ))
            )}

          </div>

          {/* Grand Total Footer */}
          {expenses.length > 0 && (
            <div className="border-t-2 border-indigo-200 mt-5 pt-4">

              <div className="flex justify-between items-center">

                <h2 className="font-bold text-gray-800">
                  Grand Total
                </h2>

                <p className="text-xl font-bold text-green-600">
                  ₹{totalAmount.toFixed(2)}
                </p>

              </div>

              {/* Amount in Words */}
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">

                <p className="text-xs font-semibold text-gray-500 mb-1">
                  AMOUNT IN WORDS
                </p>

                <p className="text-sm font-bold text-green-700">
                  {numberToWords(Math.round(totalAmount))}
                </p>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}