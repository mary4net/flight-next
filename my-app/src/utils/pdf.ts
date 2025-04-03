import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generateInvoicePdf(booking: any, invoice: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  let y = height - 50;
  const lineHeight = 20;

  const currencyList: string[] = invoice.currencyList || [];
  let currencyIndex = 0;

  const drawText = (text: string, options?: { color?: any; size?: number }) => {
    page.drawText(text, {
      x: 50,
      y,
      size: options?.size || 12,
      font,
      color: options?.color || rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  // Header
  drawText('Booking Invoice', { size: 22 });
  y -= 10;
  drawText(`Issued on: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  y -= 10;

  // Booking Info
  drawText('Booking Information', { size: 14 });
  drawText(`Booking Status: ${booking.status}`);
  drawText(`Payment Status: ${invoice.status}`);
  y -= 10;

  // Cost Breakdown
  drawText('Cost Breakdown', { size: 14 });

  const hotelCurrency = booking.hotelCost > 0 ? currencyList[currencyIndex++] || 'N/A' : null;
  const flightCurrency =
    booking.flights?.length > 0 && booking.flightCost > 0
      ? currencyList[currencyIndex] || 'N/A'
      : null;

  if (invoice.hotelCost > 0) {
    drawText(`Hotel Cost: ${hotelCurrency ?? ''} $${invoice.hotelCost.toFixed(2)}`);
  }

  if (booking.flights?.length > 0 && invoice.flightCost > 0) {
    drawText(`Flight Cost: ${flightCurrency ?? ''} $${invoice.flightCost.toFixed(2)}`);
  }

  const total = invoice.hotelCost + invoice.flightCost;
  drawText(`Total: ${currencyList[0] ?? ''} $${total.toFixed(2)}`);

  // Refund
  if (invoice.refundAmount && invoice.refundAmount > 0) {
    drawText(
      `Refund Issued: ${currencyList[0] ?? ''} ${invoice.refundAmount.toFixed(2)}`,
      { color: rgb(1, 0, 0) }
    );
  }

  // Footer
  y -= 20;
  drawText('Thank you for booking with FlyNext.', { size: 10, color: rgb(0.5, 0.5, 0.5) });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}


