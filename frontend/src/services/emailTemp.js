import { jsPDF } from "jspdf";

export const emailTemp = (orderDetails) => {
  const pdf = new jsPDF();
  let y = 20; // Start Y position

  // Header
  pdf.setFontSize(24);
  pdf.text("INVOICE", 150, y, { align: "right" });
  y += 10;

  pdf.setFontSize(10);
  pdf.text("Chapter Zero", 10, y);
  pdf.text("No:27 Universite Caddesi", 10, y + 5);
  pdf.text("Istanbul, Tuzla 34956", 10, y + 10);
  pdf.text("Phone: 555-555-5555", 10, y + 15);
  pdf.text("Email: chzero@gmail.com", 10, y + 20);
  y += 30;

  // Invoice Details
  pdf.setFontSize(12);
  pdf.text(`Invoice #: ${orderDetails.order_id}`, 150, y, { align: "right" });
  pdf.text(`Date: ${new Date(orderDetails.order_date).toLocaleDateString()}`, 150, y + 5, {
    align: "right",
  });
  pdf.text(`Customer: ${orderDetails.users.full_name}`, 150, y + 10, { align: "right" });
  pdf.text(`Email: ${orderDetails.users.email}`, 150, y + 15, { align: "right" });
  y += 20;

  // Separator
  pdf.line(10, y, 200, y);
  y += 10;

  // Bill To Section
  pdf.setFontSize(12);
  pdf.text("Bill To:", 10, y);
  y += 5;

  pdf.setFontSize(10);
  pdf.text(orderDetails.users.full_name, 10, y);
  y += 5;

  // Handle long address
  const address = `${orderDetails.addresses.address_details}`;
  const wrappedAddress = pdf.splitTextToSize(address, 180); // Wrap text to fit within 180mm
  pdf.text(wrappedAddress, 10, y);
  y += wrappedAddress.length * 5; // Adjust Y based on the number of wrapped lines

  pdf.text(`${orderDetails.addresses.city}, ${orderDetails.addresses.district}`, 10, y);
  y += 5;
  pdf.text(`Phone: ${orderDetails.users.phone_number}`, 10, y);
  y += 10;

  // Table Header
  pdf.setFontSize(12);
  pdf.text("Description", 10, y);
  pdf.text("Qty", 120, y, { align: "center" });
  pdf.text("Unit Price", 150, y, { align: "right" });
  pdf.text("Total", 200, y, { align: "right" });

  // Draw Line
  pdf.line(10, y + 2, 200, y + 2);
  y += 10;

  // Table Rows
  pdf.setFontSize(10);
  orderDetails.orderitems.forEach((item) => {
    pdf.text(item.books.title, 10, y);
    pdf.text(item.quantity.toString(), 120, y, { align: "center" });
    pdf.text(`$${item.item_price.toFixed(2)}`, 150, y, { align: "right" });
    pdf.text(`$${(item.quantity * item.item_price).toFixed(2)}`, 200, y, { align: "right" });
    y += 10;
  });

  pdf.text("Shipping", 10, y);
  pdf.text("1", 120, y, { align: "center" });
  pdf.text(`$10`, 150, y, { align: "right" });
  pdf.text(`$10`, 200, y, { align: "right" });
  y += 10;

  // Separator after table
  pdf.line(10, y, 200, y);
  y += 16;

  // Summary
  pdf.setFont("helvetica", "bold");
  pdf.text("Total (VAT included):", 150, y, { align: "right" });
  pdf.text(`$${orderDetails.total_price.toFixed(2)}`, 200, y, { align: "right" });
  y += 20;

  // Footer
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.text("Thank you for your business!", 105, y, { align: "center" });
  pdf.text(
    "Please make all checks payable to ChapterZero.",
    105,
    y + 5,
    { align: "center" }
  );
  pdf.text("www.chzero.com || chzero@gmail.com", 105, y + 10, { align: "center" });

  // Return raw PDF data as ArrayBuffer
  return pdf.output("arraybuffer");
};