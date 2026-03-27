import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CateringProduct } from './types';
import { formatCurrency } from './pricing';
import { siteConfig } from './site-config';
import { DINE_IN_MENU } from './dine-in-menu';

// ── Helpers ──────────────────────────────────────────────────────────────────

function pricingDetail(product: CateringProduct): string {
  const p = product.pricing;
  switch (p.type) {
    case 'tray':
      return p.sizes.map(s => `${s.size}: $${s.price} (serves ${s.servesMin}-${s.servesMax})`).join(', ');
    case 'pan':
      return p.sizes.map(s => `${s.size}: $${s.price} (serves ${s.servesMin}-${s.servesMax})`).join(', ');
    case 'per-person':
      return `$${p.pricePerPerson}/person${p.minOrder ? ` (min ${p.minOrder})` : ''}`;
    case 'per-dozen':
      return `$${p.pricePerDozen}/dozen (serves ${p.servesPerDozen})`;
    case 'per-each':
      return `$${p.priceEach}/each`;
    case 'per-container':
      return `$${p.pricePerContainer}/container (serves ${p.servesPerContainer})`;
    default:
      return '';
  }
}

function displayPrice(product: CateringProduct): string {
  const p = product.pricing;
  switch (p.type) {
    case 'pan': {
      const half = p.sizes.find(s => s.size === 'half');
      const full = p.sizes.find(s => s.size === 'full');
      return `$${half?.price ?? '?'} / $${full?.price ?? '?'}`;
    }
    case 'per-each': return `$${p.priceEach}`;
    case 'per-person': return `$${p.pricePerPerson}/pp`;
    case 'per-dozen': return `$${p.pricePerDozen}/dz`;
    case 'per-container': return `$${p.pricePerContainer}`;
    default: return '';
  }
}

function today(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Catering Menu PDF Export ─────────────────────────────────────────────────

export function exportCateringMenuPDF(products: CateringProduct[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(143, 38, 12); // rust
  doc.text(siteConfig.restaurant.name, 40, 45);
  doc.setFontSize(11);
  doc.setTextColor(155, 145, 137);
  doc.text(`Catering Menu Export — ${today()}`, 40, 62);

  // Products table
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text(`Catering Items (${products.length})`, 40, 88);

  const productRows = products.map(p => [
    p.title,
    p.categories.join(', '),
    p.pricing.type,
    displayPrice(p),
    pricingDetail(p),
    (p.tags || []).join(', '),
    p.variants ? `${p.variants.label}: ${p.variants.options.map(o => o.label).join(', ')}` : '',
  ]);

  autoTable(doc, {
    startY: 96,
    head: [['Item', 'Category', 'Pricing Type', 'Price', 'Price Detail', 'Tags', 'Variants']],
    body: productRows,
    styles: { fontSize: 7.5, cellPadding: 4 },
    headStyles: { fillColor: [232, 138, 0], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: [255, 247, 235] },
    columnStyles: {
      0: { cellWidth: 110, fontStyle: 'bold' },
      1: { cellWidth: 60 },
      2: { cellWidth: 55 },
      3: { cellWidth: 60 },
      4: { cellWidth: 170 },
      5: { cellWidth: 90 },
      6: { cellWidth: 120 },
    },
    margin: { left: 40, right: 40 },
  });

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(155, 145, 137);
    doc.text(
      `${siteConfig.restaurant.name} — Catering Menu — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: 'center' },
    );
  }

  doc.save(`Pepes-Catering-Menu-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── Dine-In Menu PDF Export ──────────────────────────────────────────────────

export function exportDineInMenuPDF() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(143, 38, 12);
  doc.text(siteConfig.restaurant.name, 40, 45);
  doc.setFontSize(11);
  doc.setTextColor(155, 145, 137);
  doc.text(`Dine-In Menu Export — ${today()}`, 40, 62);

  let startY = 85;

  for (const section of DINE_IN_MENU) {
    // Check if we need a new page
    if (startY > 680) {
      doc.addPage();
      startY = 40;
    }

    doc.setFontSize(13);
    doc.setTextColor(143, 38, 12);
    doc.text(section.title, 40, startY);
    startY += 5;

    const rows = section.items.map(item => [
      item.name,
      item.description || '',
      item.price ? `$${item.price}` : '',
    ]);

    autoTable(doc, {
      startY,
      head: [['Item', 'Description', 'Price']],
      body: rows,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [143, 38, 12], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      alternateRowStyles: { fillColor: [255, 247, 235] },
      columnStyles: {
        0: { cellWidth: 150, fontStyle: 'bold' },
        1: { cellWidth: 300 },
        2: { cellWidth: 60, halign: 'right' },
      },
      margin: { left: 40, right: 40 },
    });

    // Get the final Y position after the table
    startY = (doc as any).lastAutoTable.finalY + 20;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(155, 145, 137);
    doc.text(
      `${siteConfig.restaurant.name} — Dine-In Menu — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: 'center' },
    );
  }

  doc.save(`Pepes-DineIn-Menu-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── Excel Export ─────────────────────────────────────────────────────────────

export function exportMenuXLS(products: CateringProduct[]) {
  const wb = XLSX.utils.book_new();

  // Catering sheet
  const cateringData = products.map(p => ({
    'Item': p.title,
    'ID': p.id,
    'Description': p.description,
    'Category': p.categories.join(', '),
    'Pricing Type': p.pricing.type,
    'Price': displayPrice(p),
    'Price Detail': pricingDetail(p),
    'Tags': (p.tags || []).join(', '),
    'Variants': p.variants ? `${p.variants.label}: ${p.variants.options.map(o => o.label).join(', ')}` : '',
  }));

  const wsCatering = XLSX.utils.json_to_sheet(cateringData);
  wsCatering['!cols'] = [
    { wch: 30 }, { wch: 25 }, { wch: 50 }, { wch: 18 },
    { wch: 14 }, { wch: 16 }, { wch: 50 }, { wch: 30 }, { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCatering, 'Catering Menu');

  // Dine-In sheet
  const dineInData: Array<Record<string, string>> = [];
  for (const section of DINE_IN_MENU) {
    for (const item of section.items) {
      dineInData.push({
        'Section': section.title,
        'Item': item.name,
        'Description': item.description || '',
        'Price': item.price ? `$${item.price}` : '',
      });
    }
  }

  const wsDineIn = XLSX.utils.json_to_sheet(dineInData);
  wsDineIn['!cols'] = [
    { wch: 20 }, { wch: 30 }, { wch: 50 }, { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, wsDineIn, 'Dine-In Menu');

  XLSX.writeFile(wb, `Pepes-Menu-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
