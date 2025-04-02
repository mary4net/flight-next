import PDFDocument from 'pdfkit';

export async function generateInvoicePdf(booking: any, invoice: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Uint8Array[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const currencyList: string[] = invoice.currencyList || []; // fallback to empty if not passed
    let currencyIndex = 0;

    // Header
    doc.fontSize(22).text('Booking Invoice', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Issued on: ${new Date(invoice.createdAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    // Booking Info
    doc.fontSize(14).text('Booking Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12)
      .text(`Booking ID: ${booking.id}`)
      .text(`User: ${invoice.userId}`)
      .text(`Booking Status: ${booking.status}`)
      .text(`Invoice Status: ${invoice.status}`)
      .moveDown();

    // Cost Breakdown
    doc.fontSize(14).text('Cost Breakdown', { underline: true });
    doc.moveDown(0.5);
    const hotelCurrency = booking.hotelCost > 0 ? currencyList[currencyIndex++] || 'N/A' : null;
    const flightCurrency = booking.flights?.length > 0 && booking.flightCost > 0 ? currencyList[currencyIndex] || 'N/A' : null;

    if (booking.hotelCost > 0) {
      doc.text(`Hotel Cost: ${hotelCurrency} ${booking.hotelCost.toFixed(2)}`);
    }

    if (booking.flights?.length > 0 && invoice.flightCost > 0) {
      doc.text(`Flight Cost: ${flightCurrency} ${invoice.flightCost.toFixed(2)}`);
    }

    const total = invoice.hotelCost + invoice.flightCost;
    doc.moveDown().text(`Total: ${currencyList[0] ?? 'N/A'} ${total.toFixed(2)}`);

    // Refund
    if (invoice.refundAmount && invoice.refundAmount > 0) {
      doc.moveDown();
      doc.fillColor('red')
        .text(`Refund Issued: ${currencyList[0] ?? 'N/A'} ${invoice.refundAmount.toFixed(2)}`);
      doc.fillColor('black');
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray')
      .text('Thank you for booking with FlyNext.', { align: 'center' });

    doc.end();
  });
}

