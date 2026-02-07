/**
 * Example: Connect to the SUMIT API and create a tax invoice.
 *
 * Usage:
 *   SUMIT_COMPANY_ID=<your-id> SUMIT_API_KEY=<your-key> node src/example.js
 *
 * Get your credentials at: https://app.sumit.co.il/developers/keys/
 */

import './env.js';
import { SumitClient, DocumentTypes, SumitApiError } from './index.js';

const COMPANY_ID = process.env.SUMIT_COMPANY_ID;
const API_KEY = process.env.SUMIT_API_KEY;

if (!COMPANY_ID || !API_KEY) {
  console.error(
    'Missing credentials.\n' +
    'Set SUMIT_COMPANY_ID and SUMIT_API_KEY environment variables.\n' +
    'You can find your keys at: https://app.sumit.co.il/developers/keys/'
  );
  process.exit(1);
}

const client = new SumitClient({
  companyId: COMPANY_ID,
  apiKey: API_KEY,
  language: 'he',
});

async function main() {
  try {
    // --- Create a Tax Invoice ---
    console.log('Creating a tax invoice...');
    const invoiceResult = await client.createDocument(
      {
        Type: DocumentTypes.TAX_INVOICE,
        Customer: {
          Name: 'לקוח לדוגמה',
          EmailAddress: 'customer@example.com',
        },
        Items: [
          {
            Name: 'שירות ייעוץ',
            Price: 500,
            Quantity: 2,
          },
          {
            Name: 'פיתוח תוכנה',
            Price: 1200,
            Quantity: 1,
          },
        ],
      },
      { draft: true, sendEmail: false }
    );

    console.log('Invoice created successfully!');
    console.log('Document ID:', invoiceResult.DocumentID);
    console.log('Document Number:', invoiceResult.DocumentNumber);

    // --- Get document PDF ---
    if (invoiceResult.DocumentID) {
      console.log('\nFetching PDF...');
      const pdfResult = await client.getDocumentPdf(invoiceResult.DocumentID);
      console.log('PDF URL:', pdfResult.PDF_Url);
    }
  } catch (error) {
    if (error instanceof SumitApiError) {
      console.error('SUMIT API Error:');
      console.error('  Message:', error.userMessage);
      console.error('  Technical:', error.technicalDetails);
      console.error('  Status:', error.status);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

main();
