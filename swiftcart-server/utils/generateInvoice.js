const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const generateInvoice = (order, userName) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../invoices/invoice-${order._id}.pdf`);
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(20).text('SwiftCart Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Order ID: ${order._id}`);
  doc.text(`Customer: ${userName}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  doc.fontSize(16).text('Items:', { underline: true });

  order.items.forEach((item, idx) => {
    doc.text(`${idx + 1}. Product ID: ${item.productId} | Qty: ${item.qty}`);
  });

  doc.moveDown();
  doc.fontSize(16).text(`Total: ₹${order.total}`);
  doc.end();

  return filePath;
};

module.exports = generateInvoice;
