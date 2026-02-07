# SUMIT API Client

A Node.js client for connecting to the [SUMIT](https://www.sumit.co.il) (סאמיט) REST API — an Israeli cloud-based business management and invoicing platform.

## Setup

1. Get your API credentials at https://app.sumit.co.il/developers/keys/
2. Copy the example env file and fill in your keys:
   ```bash
   cp .env.example .env
   ```
3. Run the connection test:
   ```bash
   SUMIT_COMPANY_ID=<id> SUMIT_API_KEY=<key> npm test
   ```

## Usage

```javascript
import { SumitClient, DocumentTypes } from './src/index.js';

const client = new SumitClient({
  companyId: 'YOUR_COMPANY_ID',
  apiKey: 'YOUR_API_KEY',
});

// Create a tax invoice
const result = await client.createDocument({
  Type: DocumentTypes.TAX_INVOICE,
  Customer: { Name: 'John Doe', EmailAddress: 'john@example.com' },
  Items: [
    { Name: 'Consulting', Price: 500, Quantity: 2 },
  ],
});
```

## Available Methods

| Method | Description |
|---|---|
| `createDocument(doc, opts)` | Create invoice, receipt, quotation, etc. |
| `getDocument(id)` | Get document details |
| `getDocumentPdf(id)` | Get PDF of a document |
| `sendDocument(id, email?)` | Email a document |
| `cancelDocument(id)` | Cancel (storno) a document |
| `finalizeDocument(id)` | Move draft to books |
| `addExpense(expense)` | Add an expense |
| `saveCustomer(customer)` | Create/update a customer |
| `saveItem(item)` | Create/update a product/service |

## Document Types

| Constant | Value | Description |
|---|---|---|
| `PRICE_QUOTATION` | 1 | Price Quotation |
| `ORDER` | 2 | Order |
| `TAX_INVOICE` | 10 | Tax Invoice (חשבונית מס) |
| `CREDIT_NOTE` | 20 | Credit Note |
| `RECEIPT` | 100 | Receipt (קבלה) |
| `TAX_INVOICE_RECEIPT` | 110 | Tax Invoice + Receipt |
| `DONATION_RECEIPT` | 300 | Donation Receipt |
| `PAYMENT_REQUEST` | 400 | Payment Request |
| `TRANSACTION_INVOICE` | 405 | Transaction Invoice |

## API Documentation

- [SUMIT REST API Docs](https://app.sumit.co.il/developers/api/)
- [Swagger (Full)](https://app.sumit.co.il/help/developers/swagger/index.html)
- [Swagger (Simple)](https://app.sumit.co.il/help/developers/swaggerv1-minimal/index.html)
