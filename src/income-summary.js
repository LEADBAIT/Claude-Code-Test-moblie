/**
 * Sum last month's income from SUMIT.
 *
 * Fetches all income documents (tax invoices, receipts, invoice+receipts)
 * from last month and prints a summary.
 *
 * Usage:
 *   SUMIT_COMPANY_ID=79304428 SUMIT_API_KEY=<your-key> node src/income-summary.js
 */

import './env.js';
import { SumitClient, DocumentTypes, SumitApiError } from './index.js';

const COMPANY_ID = process.env.SUMIT_COMPANY_ID;
const API_KEY = process.env.SUMIT_API_KEY;

if (!COMPANY_ID || !API_KEY) {
  console.error(
    'Missing credentials.\n' +
    'Set SUMIT_COMPANY_ID and SUMIT_API_KEY environment variables.\n' +
    'Example: SUMIT_COMPANY_ID=79304428 SUMIT_API_KEY=<key> node src/income-summary.js'
  );
  process.exit(1);
}

const client = new SumitClient({
  companyId: COMPANY_ID,
  apiKey: API_KEY,
  language: 'he',
});

function getLastMonthRange() {
  const now = new Date();
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastOfPrevMonth = new Date(firstOfThisMonth - 1);
  const firstOfPrevMonth = new Date(lastOfPrevMonth.getFullYear(), lastOfPrevMonth.getMonth(), 1);

  const fmt = (d) => d.toISOString().split('T')[0];
  return {
    fromDate: fmt(firstOfPrevMonth),
    toDate: fmt(lastOfPrevMonth),
    label: firstOfPrevMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' }),
  };
}

// Income document types
const INCOME_TYPES = [
  DocumentTypes.TAX_INVOICE,
  DocumentTypes.TAX_INVOICE_RECEIPT,
  DocumentTypes.RECEIPT,
  DocumentTypes.TRANSACTION_INVOICE,
];

async function main() {
  const { fromDate, toDate, label } = getLastMonthRange();

  console.log(`\nSUMIT Income Summary — ${label}`);
  console.log(`Date range: ${fromDate} to ${toDate}`);
  console.log('='.repeat(50));

  let grandTotal = 0;
  let grandTotalBeforeVat = 0;
  let docCount = 0;
  const byType = {};

  for (const type of INCOME_TYPES) {
    try {
      const docs = await client.searchAllDocuments({ fromDate, toDate, type });

      if (docs.length === 0) continue;

      const typeName = Object.entries(DocumentTypes).find(([, v]) => v === type)?.[0] || `Type ${type}`;
      let typeTotal = 0;
      let typeTotalBeforeVat = 0;

      for (const doc of docs) {
        const total = doc.Total ?? doc.Amount ?? 0;
        const totalBeforeVat = doc.TotalBeforeVAT ?? doc.AmountBeforeVAT ?? total;
        typeTotal += total;
        typeTotalBeforeVat += totalBeforeVat;
        docCount++;
      }

      byType[typeName] = {
        count: docs.length,
        total: typeTotal,
        totalBeforeVat: typeTotalBeforeVat,
      };

      grandTotal += typeTotal;
      grandTotalBeforeVat += typeTotalBeforeVat;
    } catch (error) {
      if (error instanceof SumitApiError) {
        console.error(`Warning: Could not fetch type ${type}: ${error.userMessage}`);
      } else {
        throw error;
      }
    }
  }

  // Print breakdown by document type
  for (const [typeName, data] of Object.entries(byType)) {
    console.log(`\n${typeName}: ${data.count} documents`);
    console.log(`  Before VAT: ₪${data.totalBeforeVat.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`);
    console.log(`  Total:      ₪${data.total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`);
  }

  // Print grand total
  console.log('\n' + '='.repeat(50));
  console.log(`Total documents: ${docCount}`);
  console.log(`Total before VAT: ₪${grandTotalBeforeVat.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`);
  console.log(`Total income:     ₪${grandTotal.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`);

  // Credit notes reduce income
  try {
    const creditNotes = await client.searchAllDocuments({
      fromDate,
      toDate,
      type: DocumentTypes.CREDIT_NOTE,
    });

    if (creditNotes.length > 0) {
      let creditTotal = 0;
      for (const doc of creditNotes) {
        creditTotal += doc.Total ?? doc.Amount ?? 0;
      }
      console.log(`\nCredit notes: ${creditNotes.length} (₪${creditTotal.toLocaleString('he-IL', { minimumFractionDigits: 2 })})`);
      console.log(`Net income:       ₪${(grandTotal - creditTotal).toLocaleString('he-IL', { minimumFractionDigits: 2 })}`);
    }
  } catch {
    // Credit notes fetch is optional
  }

  console.log();
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
