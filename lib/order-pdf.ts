import jsPDF from 'jspdf';
import { formatCurrency } from './pricing';
import { siteConfig } from './site-config';

export interface OrderPDFData {
  orderNumber: string;
  orderType?: string;
  items: Array<{
    title: string;
    displayText: string;
    totalPrice: number;
  }>;
  headcount: number;
  subtotal: number;
  deliveryFee: number;
  salesTax?: number;
  buffetSetupFee?: number;
  orderTotal: number;
  contact: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  deliveryAddress: string;
  deliveryType?: string;
  event: {
    date: string | null;
    time: string | null;
    setupRequired: boolean;
    specialInstructions?: string;
  };
}

const ORANGE: [number, number, number] = [232, 138, 0];
const DARK: [number, number, number] = [56, 56, 56];
const GRAY: [number, number, number] = [128, 128, 128];

const RESTAURANT_NAME = siteConfig.restaurant.name.toUpperCase();
const RESTAURANT_PHONE = siteConfig.contact.phone;
const RESTAURANT_EMAIL = siteConfig.contact.email;

function drawHeader(doc: jsPDF, orderNumber: string, pageWidth: number, margin: number) {
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFontSize(22);
  doc.setTextColor(250, 250, 250);
  doc.setFont('helvetica', 'bold');
  doc.text(RESTAURANT_NAME, margin, 15);
  doc.setFontSize(10);
  doc.setTextColor(...ORANGE);
  doc.text(`Order #${orderNumber}`, margin, 25);
  doc.setTextColor(200, 200, 200);
  doc.text(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    pageWidth - margin, 25, { align: 'right' }
  );
}

function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function generateOrderPDF(data: OrderPDFData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const isQuote = data.orderType === 'quote';

  drawHeader(doc, data.orderNumber, pageWidth, margin);
  y = 45;

  doc.setFontSize(16);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(isQuote ? 'CATERING QUOTE' : 'CATERING ORDER RECEIPT', margin, y);
  y += 12;

  // Column headers
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y - 5, contentWidth, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', margin + 2, y);
  doc.text('DETAILS', margin + 80, y);
  doc.text('AMOUNT', pageWidth - margin - 2, y, { align: 'right' });
  y += 8;

  // Items
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  data.items.forEach((item) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(item.displayText, margin + 80, y);
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(formatCurrency(item.totalPrice), pageWidth - margin - 2, y, { align: 'right' });
    y += 8;
  });

  // Divider
  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Totals
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text('Subtotal', margin + 2, y);
  doc.setTextColor(...DARK);
  doc.text(formatCurrency(data.subtotal), pageWidth - margin - 2, y, { align: 'right' });
  y += 7;

  doc.setTextColor(...GRAY);
  doc.text('Delivery', margin + 2, y);
  doc.setTextColor(...DARK);
  doc.text(formatCurrency(data.deliveryFee), pageWidth - margin - 2, y, { align: 'right' });
  y += 7;

  if (data.buffetSetupFee && data.buffetSetupFee > 0) {
    doc.setTextColor(...GRAY);
    doc.text('Buffet Setup', margin + 2, y);
    doc.setTextColor(...DARK);
    doc.text(formatCurrency(data.buffetSetupFee), pageWidth - margin - 2, y, { align: 'right' });
    y += 7;
  }

  if (data.salesTax && data.salesTax > 0) {
    doc.setTextColor(...GRAY);
    doc.text('Sales Tax', margin + 2, y);
    doc.setTextColor(...DARK);
    doc.text(formatCurrency(data.salesTax), pageWidth - margin - 2, y, { align: 'right' });
    y += 7;
  }

  doc.setDrawColor(220, 220, 220);
  doc.line(margin + 100, y - 3, pageWidth - margin, y - 3);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('Total', margin + 2, y + 4);
  doc.setTextColor(...ORANGE);
  doc.text(formatCurrency(data.orderTotal), pageWidth - margin - 2, y + 4, { align: 'right' });
  y += 10;

  const perPerson = data.headcount > 0 ? data.orderTotal / data.headcount : 0;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Per Person (${data.headcount} guests): ${formatCurrency(perPerson)}`, margin + 2, y + 2);
  y += 16;

  // Delivery details
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFillColor(...DARK);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(10);
  doc.setTextColor(250, 250, 250);
  doc.setFont('helvetica', 'bold');
  doc.text('DELIVERY DETAILS', margin + 4, y + 6);
  y += 16;

  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTACT', margin + 2, y);
  doc.text('DELIVERY ADDRESS', pageWidth / 2 + 5, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(data.contact.name, margin + 2, y);
  doc.text(data.deliveryAddress || 'N/A', pageWidth / 2 + 5, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(data.contact.email, margin + 2, y);
  y += 5;
  doc.text(data.contact.phone || '', margin + 2, y);
  y += 5;
  if (data.contact.company) {
    doc.text(data.contact.company, margin + 2, y);
    y += 5;
  }
  y += 8;

  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE & TIME', margin + 2, y);
  doc.text('DETAILS', pageWidth / 2 + 5, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(formatEventDate(data.event.date), margin + 2, y);
  doc.text(`${data.headcount} guests`, pageWidth / 2 + 5, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(data.event.time || '', margin + 2, y);
  const deliveryLabel = data.deliveryType === 'pickup' ? 'Pickup' : data.event.setupRequired ? 'Full setup included' : 'Drop-off only';
  doc.text(deliveryLabel, pageWidth / 2 + 5, y);
  y += 12;

  // Footer
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${siteConfig.restaurant.name}  |  ${RESTAURANT_PHONE}  |  ${RESTAURANT_EMAIL}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(`Thank you for choosing ${siteConfig.restaurant.name}!`, pageWidth / 2, y, { align: 'center' });

  doc.save(`Pepes-${isQuote ? 'Quote' : 'Order'}-${data.orderNumber}.pdf`);
}

export function generatePackingSlipPDF(data: OrderPDFData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  drawHeader(doc, data.orderNumber, pageWidth, margin);
  y = 45;

  doc.setFontSize(18);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text('KITCHEN PACKING SLIP', margin, y);
  y += 14;

  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(data.contact.name, margin, y);
  y += 7;
  doc.setFontSize(12);
  doc.text(formatEventDate(data.event.date), margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Time: ${data.event.time || 'N/A'}`, margin, y);
  y += 5;
  doc.text(`Guests: ${data.headcount}`, margin, y);
  y += 5;
  doc.text(`Contact: ${data.contact.phone || 'N/A'}`, margin, y);
  y += 5;
  doc.text(`Delivery: ${data.deliveryAddress || 'N/A'}`, margin, y);
  y += 5;
  if (data.event.specialInstructions) {
    doc.text(`Notes: ${data.event.specialInstructions}`, margin, y);
    y += 5;
  }
  y += 6;

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Column headers
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y - 5, contentWidth, 10, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', margin + 4, y + 1);
  doc.text('QTY / SIZE', pageWidth - margin - 4, y + 1, { align: 'right' });
  y += 10;

  // Items with checkboxes
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item, index) => {
    if (y > 265) { doc.addPage(); y = 20; }

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.rect(margin + 2, y - 4, 5, 5);

    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, margin + 12, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(item.displayText, pageWidth - margin - 4, y, { align: 'right' });

    y += 9;

    if (index < data.items.length - 1) {
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(margin + 2, y - 3, pageWidth - margin, y - 3);
    }
  });

  y += 8;

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  const setupLabel = data.deliveryType === 'pickup' ? 'CUSTOMER PICKUP' : data.event.setupRequired ? 'FULL SETUP REQUIRED' : 'DROP-OFF ONLY';
  doc.text(`Setup: ${setupLabel}`, margin, y);
  y += 12;

  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('Packed by: ____________________    Checked by: ____________________    Date: ____________', margin, y);
  y += 12;

  doc.setFontSize(8);
  doc.text(`${siteConfig.restaurant.name} — Kitchen Use Only`, pageWidth / 2, y, { align: 'center' });

  doc.save(`Pepes-PackingSlip-${data.orderNumber}.pdf`);
}
