/**
 * Quick test to verify connectivity to the SUMIT API.
 *
 * Usage:
 *   SUMIT_COMPANY_ID=<your-id> SUMIT_API_KEY=<your-key> node src/test-connection.js
 */

import './env.js';
import { SumitClient, SumitApiError } from './index.js';

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
});

async function testConnection() {
  console.log('Testing connection to SUMIT API (api.sumit.co.il)...\n');

  // Attempt to create a draft price quotation — the lightest document type.
  // Drafts don't get an official document number and can be safely deleted.
  try {
    const result = await client.createDocument(
      {
        Type: 1, // Price Quotation
        Customer: { Name: 'API Connection Test' },
        Items: [{ Name: 'Test Item', Price: 0, Quantity: 1 }],
      },
      { draft: true }
    );

    console.log('Connection successful!');
    console.log('Response:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    if (error instanceof SumitApiError) {
      // An API error still means we connected successfully — the API responded
      console.log('Connected to SUMIT API (got an API-level response).');
      console.log('API Status:', error.status);
      console.log('Message:', error.userMessage || error.technicalDetails);
    } else {
      console.error('Connection failed:', error.message);
    }
    return false;
  }
}

testConnection().then((ok) => {
  process.exit(ok ? 0 : 1);
});
