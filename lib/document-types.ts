// Document type definitions with specific structures for each business document type

export interface BaseDocument {
  id: string
  documentType: DocumentType
  createdAt: string
  updatedAt: string
  author: string
}

export type DocumentType =
  | "Invoice"
  | "Purchase Order"
  | "Contract"
  | "Business Letter"
  | "Memo"
  | "Report"
  | "Financial Statement"
  | "Work Order"
  | "Proposal"
  | "Receipt"

// Invoice Structure
export interface Invoice extends BaseDocument {
  documentType: "Invoice"
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
  }
  clientInfo: {
    name: string
    address: string
    phone: string
    email: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  paymentTerms: string
  notes: string
}

// Purchase Order Structure
export interface PurchaseOrder extends BaseDocument {
  documentType: "Purchase Order"
  poNumber: string
  poDate: string
  deliveryDate: string
  buyerInfo: {
    company: string
    address: string
    contact: string
  }
  supplierInfo: {
    company: string
    address: string
    contact: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  totalAmount: number
  paymentTerms: string
  approvalSignature: string
}

// Contract Structure
export interface Contract extends BaseDocument {
  documentType: "Contract"
  contractTitle: string
  parties: Array<{
    name: string
    role: string
    address: string
  }>
  recitals: string
  terms: Array<{
    heading: string
    content: string
  }>
  paymentTerms: string
  duration: string
  terminationClause: string
  confidentiality: string
  governingLaw: string
  signatures: Array<{
    party: string
    signature: string
    date: string
  }>
}

// Business Letter Structure
export interface BusinessLetter extends BaseDocument {
  documentType: "Business Letter"
  senderAddress: string
  recipientAddress: string
  date: string
  salutation: string
  subject: string
  body: string
  closing: string
  senderName: string
  senderTitle: string
  attachments: string[]
}

// Memo Structure
export interface Memo extends BaseDocument {
  documentType: "Memo"
  to: string
  from: string
  date: string
  subject: string
  purpose: string
  mainContent: string
  actionItems: string[]
  closingRemarks: string
}

// Report Structure
export interface Report extends BaseDocument {
  documentType: "Report"
  reportTitle: string
  executiveSummary: string
  introduction: string
  objectives: string[]
  methodology: string
  findings: Array<{
    heading: string
    content: string
  }>
  conclusions: string
  recommendations: string[]
  appendices: string[]
}

// Financial Statement Structure
export interface FinancialStatement extends BaseDocument {
  documentType: "Financial Statement"
  companyInfo: {
    name: string
    address: string
    reportingPeriod: string
  }
  balanceSheet: {
    assets: Array<{ item: string; amount: number }>
    liabilities: Array<{ item: string; amount: number }>
    equity: Array<{ item: string; amount: number }>
  }
  incomeStatement: {
    revenue: Array<{ item: string; amount: number }>
    expenses: Array<{ item: string; amount: number }>
    netIncome: number
  }
  cashFlow: {
    operating: number
    investing: number
    financing: number
  }
  notes: string
  preparer: string
}

// Work Order Structure
export interface WorkOrder extends BaseDocument {
  documentType: "Work Order"
  workOrderNumber: string
  workOrderDate: string
  clientInfo: {
    name: string
    address: string
    phone: string
  }
  workDescription: string
  assignedPersonnel: string[]
  materialsRequired: string[]
  estimatedCompletionDate: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  approvalSignature: string
}

// Proposal Structure
export interface Proposal extends BaseDocument {
  documentType: "Proposal"
  proposalTitle: string
  coverLetter: string
  introduction: string
  background: string
  objectives: string[]
  proposedSolution: string
  timeline: Array<{
    milestone: string
    date: string
  }>
  budget: Array<{
    item: string
    cost: number
  }>
  totalCost: number
  termsAndConditions: string
  conclusion: string
}

// Receipt Structure
export interface Receipt extends BaseDocument {
  documentType: "Receipt"
  receiptNumber: string
  receiptDate: string
  companyInfo: {
    name: string
    address: string
    phone: string
  }
  customerInfo: {
    name: string
    email: string
  }
  items: Array<{
    description: string
    amount: number
  }>
  subtotal: number
  taxAmount: number
  totalAmount: number
  paymentMethod: string
}

export type AnyDocument =
  | Invoice
  | PurchaseOrder
  | Contract
  | BusinessLetter
  | Memo
  | Report
  | FinancialStatement
  | WorkOrder
  | Proposal
  | Receipt
