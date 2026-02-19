'use client'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

export const downloadRamzanCalendarPDF = (days, city) => {
  const toastId = toast.loading('Generating PDF...')
  
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Helper function to convert 24h to 12h format
    const convertTo12Hour = (time) => {
      if (!time) return ''
      const [hour, minute] = time.split(':')
      const h = parseInt(hour)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${h12}:${minute} ${ampm}`
    }

    // Title
    doc.setFontSize(24)
    doc.setTextColor(16, 185, 129)
    doc.setFont('helvetica', 'bold')
    doc.text(`Ramzan Calendar 1447 H`, pageWidth / 2, 20, { align: 'center' })
    
    // Subtitle with city
    doc.setFontSize(16)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'normal')
    doc.text(`${city} - Ramzan 2026`, pageWidth / 2, 30, { align: 'center' })
    
    // Decorative line
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.line(15, 35, pageWidth - 15, 35)
    
    // Table headers
    let y = 45
    const lineHeight = 8
    const colWidths = [15, 40, 35, 35, 35]
    const headers = ['Day', 'Date', 'Hijri', 'Sehri Ends', 'Iftar']
    
    // Draw header background
    doc.setFillColor(16, 185, 129)
    doc.rect(10, y - 5, pageWidth - 20, lineHeight, 'F')
    
    // Draw header text
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    
    let x = 10
    headers.forEach((header, i) => {
      doc.text(header, x + 2, y)
      x += colWidths[i]
    })
    
    // Reset text color for data
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    
    let currentPage = 1
    let rowCount = 0
    const rowsPerPage = 28 // Approximate rows per page
    
    // Draw data rows
    days.forEach((day, index) => {
      y += lineHeight
      rowCount++
      
      // Check if we need a new page
      if (y > pageHeight - 20) {
        // Add page number
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${currentPage}`, pageWidth - 20, pageHeight - 10)
        
        // New page
        doc.addPage()
        currentPage++
        y = 25
        
        // Redraw headers on new page
        doc.setFillColor(16, 185, 129)
        doc.rect(10, y - 5, pageWidth - 20, lineHeight, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        
        x = 10
        headers.forEach((header, i) => {
          doc.text(header, x + 2, y)
          x += colWidths[i]
        })
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        
        y += lineHeight
      }
      
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(240, 253, 244)
        doc.rect(10, y - 4, pageWidth - 20, lineHeight - 1, 'F')
      }
      
      x = 10
      const rowData = [
        day.day.toString(),
        day.date,
        day.islamicDate || `${day.day} Ramzan 1447`,
        convertTo12Hour(day.sehriEnd),
        convertTo12Hour(day.iftar)
      ]
      
      rowData.forEach((cell, i) => {
        doc.text(cell, x + 2, y)
        x += colWidths[i]
      })
    })
    
    // Add last page number
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${currentPage}`, pageWidth - 20, pageHeight - 10)
    
    // Footer with total days
    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    doc.text(`Total: ${days.length} Days of Ramzan`, 15, pageHeight - 10)
    doc.text('Powered by Noor Ramzan App', pageWidth / 2, pageHeight - 10, { align: 'center' })
    
    // Save PDF
    doc.save(`Ramzan-Calendar-${city}-2026.pdf`)
    toast.success('PDF downloaded successfully!', { id: toastId })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    toast.error('Failed to generate PDF: ' + error.message, { id: toastId })
  }
}