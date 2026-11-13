import { useRef } from 'react'
import html2pdf from 'html2pdf.js'

// Convert Number into Indian Rupees Words
const numberToWords = (num) => {

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
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

  const reportRef = useRef(null)

  // Calculate Total Amount
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


  // PDF Configuration
  const pdfOptions = {
    margin: 10,
    filename: 'My-Expense-Report.pdf',

    image: {
      type: 'jpeg',
      quality: 0.98
    },

    html2canvas: {
      scale: 2,
      useCORS: true
    },

    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  }


  // Generate PDF Blob
  const generatePDF = async () => {

    const pdfBlob = await html2pdf()
      .set(pdfOptions)
      .from(reportRef.current)
      .outputPdf('blob')

    return pdfBlob
  }


  // Print Expense Report
  const handlePrint = () => {

    if (expenses.length === 0) {
      alert('No expenses available to print!')
      return
    }

    window.print()
  }


  // Download PDF
  const handleDownloadPDF = async () => {

    if (expenses.length === 0) {
      alert('No expenses available!')
      return
    }

    try {

      await html2pdf()
        .set(pdfOptions)
        .from(reportRef.current)
        .save()

    } catch (error) {

      console.error('PDF Download Error:', error)

      alert('Unable to download PDF!')

    }
  }


  // Share PDF on WhatsApp
  const handleWhatsAppShare = async () => {

    if (expenses.length === 0) {
      alert('No expenses available to share!')
      return
    }

    try {

      const pdfBlob = await generatePDF()

      const pdfFile = new File(
        [pdfBlob],
        'My-Expense-Report.pdf',
        {
          type: 'application/pdf'
        }
      )

      // Check File Sharing Support
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [pdfFile] })
      ) {

        await navigator.share({

          files: [pdfFile],

          title: 'Expense Report',

          text: 'Here is my expense report.'

        })

      } else {

        // Download PDF for Desktop Users
        const pdfURL = URL.createObjectURL(pdfBlob)

        const link = document.createElement('a')

        link.href = pdfURL

        link.download = 'My-Expense-Report.pdf'

        document.body.appendChild(link)

        link.click()

        link.remove()

        setTimeout(() => URL.revokeObjectURL(pdfURL), 1000)

        // Open WhatsApp
        const message = encodeURIComponent(
          `📋 My Expense Report\n\nTotal Expenses: ₹${totalAmount.toFixed(2)}\n\nPlease find my expense report attached.`
        )

        window.open(
          `https://wa.me/?text=${message}`,
          '_blank'
        )

        alert(
          'PDF downloaded successfully! Please attach it manually in WhatsApp.'
        )

      }

    } catch (error) {

      if (error.name !== 'AbortError') {

        console.error('WhatsApp Share Error:', error)

        alert('Unable to share PDF!')

      }

    }
  }


  return (

    <div className="max-w-2xl mx-auto mt-6 px-4 mb-10">

      {/* Main Gradient Border */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl shadow-lg">

        <div className="bg-white rounded-[14px] p-5">

          {/* PDF Report Content */}
          <div
            ref={reportRef}
            className="bg-white p-2"
          >

            {/* Heading */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

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
                    className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 border-l-4 border-l-indigo-500 rounded-xl px-4 py-3 print:break-inside-avoid"
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

                      {/* Delete Button */}
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


            {/* Grand Total */}
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


          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 print:hidden">

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md"
            >
              🖨️ Print
            </button>


            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md"
            >
              📄 Download PDF
            </button>


            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md"
            >

              {/* WhatsApp SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >

                <path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.15 1.6 5.95L0 24l6.27-1.65a11.9 11.9 0 0 0 5.78 1.48h.01c6.57 0 11.92-5.35 11.93-11.93a11.85 11.85 0 0 0-3.47-8.42ZM12.06 21.8h-.01a9.87 9.87 0 0 1-5.03-1.37l-.36-.21-3.72.98.99-3.63-.23-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.48 4.46-9.94 9.94-9.94a9.87 9.87 0 0 1 7.04 2.92 9.88 9.88 0 0 1 2.9 7.05c0 5.48-4.46 9.94-10 9.84Zm5.45-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35Z" />

              </svg>

              Share on WhatsApp

            </button>

          </div>

        </div>

      </div>

    </div>

  )
}