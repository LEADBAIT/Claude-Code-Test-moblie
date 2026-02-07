/**
 * SUMIT API Client (sumit.co.il)
 *
 * A lightweight client for the SUMIT (formerly OfficeGuy) REST API.
 * Supports document creation, customer management, and more.
 *
 * API Docs: https://app.sumit.co.il/developers/api/
 * Swagger:  https://app.sumit.co.il/help/developers/swagger/index.html
 */

const BASE_URL = 'https://api.sumit.co.il';

export class SumitClient {
  #companyId;
  #apiKey;
  #language;

  /**
   * @param {Object} config
   * @param {string} config.companyId - Your SUMIT Company ID
   * @param {string} config.apiKey    - Your SUMIT private API key
   * @param {string} [config.language='he'] - Response language ('he' or 'en')
   */
  constructor({ companyId, apiKey, language = 'he' }) {
    if (!companyId || !apiKey) {
      throw new Error('companyId and apiKey are required. Get them at https://app.sumit.co.il/developers/keys/');
    }
    this.#companyId = companyId;
    this.#apiKey = apiKey;
    this.#language = language;
  }

  /**
   * Internal helper — sends a POST request to the SUMIT API.
   */
  async #request(path, body = {}) {
    const url = `${BASE_URL}${path}`;
    const payload = {
      Credentials: {
        CompanyID: this.#companyId,
        APIKey: this.#apiKey,
      },
      ...body,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Language': this.#language,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`SUMIT API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Status !== undefined && data.Status !== 0) {
      throw new SumitApiError(data);
    }

    return data;
  }

  // ---------------------------------------------------------------------------
  // Documents (Invoices, Receipts, etc.)
  // ---------------------------------------------------------------------------

  /**
   * Create a new accounting document (invoice, receipt, etc.)
   *
   * @param {Object} document
   * @param {number} document.Type - Document type:
   *   1 = Price Quotation, 2 = Order, 3 = Delivery Note,
   *   5 = Return Delivery Note, 10 = Tax Invoice,
   *   20 = Credit Note, 100 = Receipt, 110 = Tax Invoice + Receipt,
   *   300 = Donation Receipt, 400 = Payment Request, 405 = Transaction Invoice
   * @param {Object} document.Customer - Customer details
   * @param {string} document.Customer.Name - Customer name
   * @param {string} [document.Customer.EmailAddress] - Customer email
   * @param {Array}  document.Items - Line items
   * @param {string} document.Items[].Name - Item name
   * @param {number} document.Items[].Price - Item price
   * @param {number} document.Items[].Quantity - Item quantity
   * @param {Object} [options]
   * @param {boolean} [options.draft=false] - Create as draft
   * @param {boolean} [options.sendEmail=false] - Send email to customer
   * @returns {Promise<Object>} Created document response
   */
  async createDocument(document, options = {}) {
    return this.#request('/api/accounting/documents/create/', {
      Document: document,
      IsDraft: options.draft ?? false,
      SendDocumentByEmail: options.sendEmail ?? false,
    });
  }

  /**
   * Get details of an existing document.
   * @param {string} documentId - The document ID
   */
  async getDocument(documentId) {
    return this.#request('/api/accounting/documents/getdetails/', {
      DocumentID: documentId,
    });
  }

  /**
   * Get a PDF of an existing document.
   * @param {string} documentId - The document ID
   * @returns {Promise<Object>} Response containing PDF URL or data
   */
  async getDocumentPdf(documentId) {
    return this.#request('/api/accounting/documents/getpdf/', {
      DocumentID: documentId,
    });
  }

  /**
   * Send an existing document by email.
   * @param {string} documentId - The document ID
   * @param {string} [emailAddress] - Override recipient email
   */
  async sendDocument(documentId, emailAddress) {
    const body = { DocumentID: documentId };
    if (emailAddress) {
      body.EmailAddress = emailAddress;
    }
    return this.#request('/api/accounting/documents/send/', body);
  }

  /**
   * Cancel (storno) an existing document.
   * @param {string} documentId - The document ID
   */
  async cancelDocument(documentId) {
    return this.#request('/api/accounting/documents/cancel/', {
      DocumentID: documentId,
    });
  }

  /**
   * Finalize a draft document (move to books).
   * @param {string} documentId - The document ID
   */
  async finalizeDocument(documentId) {
    return this.#request('/api/accounting/documents/movetobooks/', {
      DocumentID: documentId,
    });
  }

  // ---------------------------------------------------------------------------
  // Search / List Documents
  // ---------------------------------------------------------------------------

  /**
   * Search documents by date range, type, and other filters.
   * @param {Object} filters
   * @param {string} [filters.fromDate] - Start date (YYYY-MM-DD)
   * @param {string} [filters.toDate]   - End date (YYYY-MM-DD)
   * @param {number} [filters.type]     - Document type filter
   * @param {number} [filters.page=1]   - Page number
   * @param {number} [filters.pageSize=50] - Results per page
   */
  async searchDocuments(filters = {}) {
    return this.#request('/api/accounting/documents/search/', {
      FromDate: filters.fromDate,
      ToDate: filters.toDate,
      DocumentType: filters.type,
      Page: filters.page ?? 1,
      PageSize: filters.pageSize ?? 50,
    });
  }

  /**
   * Fetch ALL documents across multiple pages for a given filter.
   */
  async searchAllDocuments(filters = {}) {
    const allDocuments = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await this.searchDocuments({ ...filters, page, pageSize: 50 });
      const docs = result.Documents || [];
      allDocuments.push(...docs);
      hasMore = docs.length === 50;
      page++;
    }

    return allDocuments;
  }

  // ---------------------------------------------------------------------------
  // Expenses
  // ---------------------------------------------------------------------------

  /**
   * Add an expense document.
   * @param {Object} expense - Expense details
   */
  async addExpense(expense) {
    return this.#request('/api/accounting/documents/addexpense/', {
      Document: expense,
    });
  }

  // ---------------------------------------------------------------------------
  // Customers
  // ---------------------------------------------------------------------------

  /**
   * Create or update a customer.
   * @param {Object} customer
   * @param {string} customer.Name - Customer name
   * @param {string} [customer.EmailAddress] - Email
   * @param {string} [customer.Phone] - Phone number
   * @param {string} [customer.City] - City
   * @param {string} [customer.Address] - Address
   * @param {string} [customer.CompanyNumber] - Company/VAT number
   */
  async saveCustomer(customer) {
    return this.#request('/api/accounting/customers/create/', {
      Customer: customer,
    });
  }

  // ---------------------------------------------------------------------------
  // Products / Services
  // ---------------------------------------------------------------------------

  /**
   * Create or update a product/service.
   * @param {Object} item
   * @param {string} item.Name - Product/service name
   * @param {number} item.Price - Default price
   */
  async saveItem(item) {
    return this.#request('/api/accounting/items/create/', {
      Item: item,
    });
  }
}

/**
 * Custom error class for SUMIT API errors.
 */
export class SumitApiError extends Error {
  constructor(response) {
    super(response.UserErrorMessage || response.TechnicalErrorDetails || 'SUMIT API error');
    this.name = 'SumitApiError';
    this.status = response.Status;
    this.userMessage = response.UserErrorMessage;
    this.technicalDetails = response.TechnicalErrorDetails;
  }
}

/** Document type constants for convenience */
export const DocumentTypes = {
  PRICE_QUOTATION: 1,
  ORDER: 2,
  DELIVERY_NOTE: 3,
  RETURN_DELIVERY_NOTE: 5,
  TAX_INVOICE: 10,
  CREDIT_NOTE: 20,
  RECEIPT: 100,
  TAX_INVOICE_RECEIPT: 110,
  DONATION_RECEIPT: 300,
  PAYMENT_REQUEST: 400,
  TRANSACTION_INVOICE: 405,
};
