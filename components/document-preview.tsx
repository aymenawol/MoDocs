"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FileText } from "lucide-react"

type DocumentType =
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
  | "Other"
  | ""
type ToneType = "Professional" | "Formal" | "Friendly" | "Creative" | ""

interface FormData {
  companyName: string
  companyEmail: string
  clientName: string
  serviceDescription: string
  amount: string
  paymentTerms: string
  customDocumentType?: string
}

interface DocumentPreviewProps {
  documentType: DocumentType
  tone: ToneType
  formData: FormData
}

export function DocumentPreview({ documentType, tone, formData }: DocumentPreviewProps) {
  if (!documentType || !tone) {
    return (
      <Card className="border-border bg-card h-[calc(100vh-12rem)] flex items-center justify-center lg:sticky lg:top-24">
        <CardContent className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Document Selected</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Select a document type and tone to see your AI-generated preview
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="lg:sticky lg:top-24 h-[calc(100vh-12rem)] overflow-hidden">
      <Card className="border-border bg-card h-full flex flex-col shadow-lg">
        <CardHeader className="border-b border-border bg-secondary/30 py-3 px-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI-Generated Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">{tone}</span>
              <span className="text-xs text-muted-foreground">Page 1 of 1</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          <div className="bg-white dark:bg-gray-50 min-h-full p-8 md:p-12 shadow-inner">
            <div className="max-w-[210mm] mx-auto bg-white dark:bg-white shadow-md p-8 md:p-12 rounded-sm border border-gray-200">
              {renderDocumentContent(documentType, tone, formData)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function renderDocumentContent(documentType: DocumentType, tone: ToneType, formData: FormData) {
  switch (documentType) {
    case "Invoice":
      return <InvoicePreview tone={tone} formData={formData} />
    case "Purchase Order":
      return <PurchaseOrderPreview tone={tone} formData={formData} />
    case "Contract":
      return <ContractPreview tone={tone} formData={formData} />
    case "Business Letter":
      return <BusinessLetterPreview tone={tone} formData={formData} />
    case "Memo":
      return <MemoPreview tone={tone} formData={formData} />
    case "Report":
      return <ReportPreview tone={tone} formData={formData} />
    case "Financial Statement":
      return <FinancialStatementPreview tone={tone} formData={formData} />
    case "Work Order":
      return <WorkOrderPreview tone={tone} formData={formData} />
    case "Proposal":
      return <ProposalPreview tone={tone} formData={formData} />
    case "Receipt":
      return <ReceiptPreview tone={tone} formData={formData} />
    case "Other":
      return <OtherPreview tone={tone} formData={formData} />
    default:
      return null
  }
}

// Helper to render field with placeholder
const Field = ({ value, placeholder = "Not provided" }: { value: any; placeholder?: string }) => {
  if (value && value !== "") {
    return <span className="text-gray-900">{value}</span>
  }
  return <span className="text-gray-400 italic text-sm">{placeholder}</span>
}

// Helper to get AI-generated content based on tone
function getAIPlaceholder(tone: ToneType, context: string): string {
  const toneStyles: Record<string, Record<string, string>> = {
    Professional: {
      intro: "This document represents a professional agreement crafted with industry-standard language and clear terms.",
      body: "We present this comprehensive overview with precise details and professional formatting to ensure clarity and mutual understanding.",
      closing: "We appreciate your consideration and look forward to a successful partnership.",
    },
    Formal: {
      intro: "This formal document hereby establishes the terms and conditions as set forth herein.",
      body: "The parties do hereby agree to the following stipulations, terms, and provisions as detailed in this official correspondence.",
      closing: "Respectfully submitted for your review and formal approval.",
    },
    Friendly: {
      intro: "We're excited to share this document with you! Let's make this partnership great.",
      body: "Here's everything we discussed, laid out in a clear and easy-to-understand format. We've made sure to cover all the important details while keeping things straightforward.",
      closing: "Thanks so much for your time! We can't wait to get started working together.",
    },
    Creative: {
      intro: "Welcome to a fresh take on business documentation – where clarity meets creativity.",
      body: "Imagine a partnership where innovation drives every decision. This document outlines our vision for bringing exceptional value through creative collaboration and unique solutions.",
      closing: "Let's turn great ideas into reality. We're thrilled about the possibilities ahead!",
    },
  }

  const style = toneStyles[tone] || toneStyles.Professional
  return style[context] || style.body
}

// Invoice Preview
function InvoicePreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  const amount = formData.amount || "$0.00"
  const tax = parseFloat(formData.amount?.replace(/[$,]/g, "") || "0") * 0.08
  const total = parseFloat(formData.amount?.replace(/[$,]/g, "") || "0") + tax

  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
        <p className="text-sm text-gray-600">
          <Field value={formData.companyName} placeholder="[Your Company Name]" />
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">FROM:</h3>
          <div className="space-y-1">
            <div>
              <Field value={formData.companyName} placeholder="Your Company Name" />
            </div>
            <div>
              <Field value={formData.companyEmail} placeholder="company@email.com" />
            </div>
            <div className="text-gray-600 italic text-xs mt-2">
              [AI: Address and phone details would be generated here]
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">BILL TO:</h3>
          <div className="space-y-1">
            <div>
              <Field value={formData.clientName} placeholder="Client Name" />
            </div>
            <div className="text-gray-600 italic text-xs mt-2">
              [AI: Client contact details would be generated here]
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
        <div>
          <span className="font-semibold text-gray-700">Invoice #:</span>
          <div className="text-gray-600 italic text-xs">[AI: INV-{new Date().getFullYear()}-001]</div>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date:</span>
          <div className="text-gray-600 italic text-xs">{new Date().toLocaleDateString()}</div>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Due Date:</span>
          <div className="text-gray-600 italic text-xs">
            {formData.paymentTerms ? `[Based on ${formData.paymentTerms}]` : "[AI: Based on terms]"}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
              <th className="text-right py-2 px-3 font-semibold">Qty</th>
              <th className="text-right py-2 px-3 font-semibold">Price</th>
              <th className="text-right py-2 px-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-3">
                {formData.serviceDescription ? (
                  <span className="text-gray-900">{formData.serviceDescription}</span>
                ) : (
                  <span className="text-gray-600 italic text-xs">[AI: Service/product description]</span>
                )}
              </td>
              <td className="text-right py-3 px-3">
                <span className="text-gray-600 italic text-xs">1</span>
              </td>
              <td className="text-right py-3 px-3">
                <Field value={formData.amount} placeholder="$0.00" />
              </td>
              <td className="text-right py-3 px-3">
                <Field value={formData.amount} placeholder="$0.00" />
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50">
              <td colSpan={4} className="py-2 px-3 text-center text-gray-500 italic text-xs">
                [AI: Additional line items would be generated here based on the service description]
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-semibold">
              <Field value={formData.amount} placeholder="$0.00" />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tax (8%):</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-300 pt-2 text-base">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm space-y-3 pt-4 border-t border-gray-200 bg-blue-50 p-4 rounded">
        <div>
          <span className="font-semibold text-gray-700">Payment Terms: </span>
          <Field value={formData.paymentTerms} placeholder="[AI: Terms based on your input]" />
        </div>
        <div className="text-gray-600 italic text-xs">
          [AI: {getAIPlaceholder(tone, "closing")}]
        </div>
      </div>
    </div>
  )
}

// Contract Preview
function ContractPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-2xl font-bold mb-2">SERVICE AGREEMENT CONTRACT</h1>
        <p className="text-sm text-gray-600">Between</p>
        <p className="text-sm font-semibold">
          <Field value={formData.companyName} placeholder="[Your Company]" /> and{" "}
          <Field value={formData.clientName} placeholder="[Client Name]" />
        </p>
      </div>

      <div className="text-sm bg-blue-50 p-4 rounded">
        <p className="italic text-gray-600">[AI Generated - {tone} Tone]: {getAIPlaceholder(tone, "intro")}</p>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2 text-base">PARTIES:</h3>
        <div className="pl-4 space-y-2">
          <div>
            <span className="font-semibold">Provider:</span>{" "}
            <Field value={formData.companyName} placeholder="[Your Company Name]" />
            <br />
            <span className="text-gray-600 italic text-xs">
              [AI: Complete company details including address and contact info]
            </span>
          </div>
          <div>
            <span className="font-semibold">Client:</span> <Field value={formData.clientName} placeholder="[Client Name]" />
            <br />
            <span className="text-gray-600 italic text-xs">
              [AI: Complete client details including address and contact info]
            </span>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2 text-base">1. SCOPE OF SERVICES</h3>
        <div className="pl-4 leading-relaxed">
          {formData.serviceDescription ? (
            <p className="text-gray-900">{formData.serviceDescription}</p>
          ) : (
            <p className="text-gray-600 italic text-xs">[AI: Detailed scope of services]</p>
          )}
          <div className="mt-2 bg-blue-50 p-3 rounded">
            <p className="text-gray-600 italic text-xs">
              [AI: Additional detailed clauses covering deliverables, timeline, and responsibilities in {tone.toLowerCase()}{" "}
              tone]
            </p>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2 text-base">2. COMPENSATION</h3>
        <div className="pl-4 leading-relaxed">
          <p>
            The Client agrees to pay the Provider a total amount of <Field value={formData.amount} placeholder="$[Amount]" />{" "}
            for the services described herein.
          </p>
          <p className="mt-2">
            Payment Terms: <Field value={formData.paymentTerms} placeholder="[Payment Terms]" />
          </p>
          <div className="mt-2 bg-blue-50 p-3 rounded">
            <p className="text-gray-600 italic text-xs">
              [AI: Additional payment clauses including late fees, payment methods, and invoicing schedule]
            </p>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2 text-base">3. TERM AND TERMINATION</h3>
        <div className="pl-4 bg-blue-50 p-3 rounded">
          <p className="text-gray-600 italic text-xs">
            [AI: Contract duration, termination conditions, notice periods, and post-termination obligations in{" "}
            {tone.toLowerCase()} tone]
          </p>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2 text-base">4. CONFIDENTIALITY</h3>
        <div className="pl-4 bg-blue-50 p-3 rounded">
          <p className="text-gray-600 italic text-xs">
            [AI: Comprehensive confidentiality and non-disclosure provisions appropriate for this agreement]
          </p>
        </div>
      </div>

      <div className="mt-8 text-sm space-y-4 pt-6 border-t border-gray-200">
        <h3 className="font-semibold">SIGNATURES:</h3>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <div className="mb-2 font-semibold">
              <Field value={formData.companyName} placeholder="[Your Company]" />
            </div>
            <div className="border-b border-gray-400 w-full mb-1 mt-8"></div>
            <div className="text-xs text-gray-600">Signature & Date</div>
          </div>
          <div>
            <div className="mb-2 font-semibold">
              <Field value={formData.clientName} placeholder="[Client Name]" />
            </div>
            <div className="border-b border-gray-400 w-full mb-1 mt-8"></div>
            <div className="text-xs text-gray-600">Signature & Date</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 italic bg-blue-50 p-3 rounded">
        [AI Note: This is a preview with AI-generated placeholder content in {tone.toLowerCase()} tone. The final document
        would include complete legal language, additional clauses, and professionally formatted sections.]
      </div>
    </div>
  )
}

// Business Letter Preview
function BusinessLetterPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-sm">
        <div className="mb-6">
          <Field value={formData.companyName} placeholder="[Your Company Name]" />
          <br />
          <Field value={formData.companyEmail} placeholder="company@email.com" />
          <div className="text-gray-600 italic text-xs mt-1">[AI: Complete address details]</div>
        </div>

        <div className="mb-6 text-gray-600">{new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</div>

        <div className="mb-6">
          <Field value={formData.clientName} placeholder="[Recipient Name]" />
          <div className="text-gray-600 italic text-xs">[AI: Recipient's company and address]</div>
        </div>

        <div className="mb-4">
          <Field value={getToneGreeting(tone)} placeholder="Dear [Name]," />
        </div>

        <div className="mb-4 leading-relaxed">
          <div className="bg-blue-50 p-4 rounded mb-3">
            <p className="text-gray-600 italic text-xs">[AI Generated Opening - {tone} Tone]:</p>
            <p className="mt-2">{getAIPlaceholder(tone, "intro")}</p>
          </div>
        </div>

        <div className="mb-4 leading-relaxed space-y-3">
          {formData.serviceDescription ? (
            <p>{formData.serviceDescription}</p>
          ) : (
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 italic text-xs">[AI: Main body discussing your services/products]</p>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI Generated Body - {tone} Tone]:</p>
            <p className="mt-2">{getAIPlaceholder(tone, "body")}</p>
          </div>

          {formData.amount && (
            <p>
              We propose a total investment of <span className="font-semibold">{formData.amount}</span>
              {formData.paymentTerms && (
                <>
                  {" "}
                  with payment terms of <span className="font-semibold">{formData.paymentTerms}</span>
                </>
              )}
              .
            </p>
          )}
        </div>

        <div className="mb-4 leading-relaxed">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI Generated Closing - {tone} Tone]:</p>
            <p className="mt-2">{getAIPlaceholder(tone, "closing")}</p>
          </div>
        </div>

        <div className="mb-4">
          <Field value={getToneClosing(tone)} placeholder="Sincerely," />
        </div>

        <div className="mt-12">
          <Field value={formData.companyName} placeholder="[Your Name]" />
          <br />
          <div className="text-gray-600 italic text-xs">[AI: Your title and company role]</div>
          <br />
          <Field value={formData.companyEmail} placeholder="email@company.com" />
        </div>
      </div>
    </div>
  )
}

// Proposal Preview
function ProposalPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-3">PROJECT PROPOSAL</h1>
        <p className="text-lg">
          <Field value={formData.clientName} placeholder="[Client Name]" />
        </p>
        <div className="text-sm text-gray-600 mt-2">
          Presented by <Field value={formData.companyName} placeholder="[Your Company]" />
        </div>
        <div className="text-sm text-gray-600">{new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</div>
      </div>

      <div className="text-sm bg-blue-50 p-4 rounded">
        <p className="italic text-gray-600">[AI Generated - {tone} Tone]: This proposal is crafted to address your unique needs and deliver exceptional value.</p>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-3 text-base">EXECUTIVE SUMMARY</h3>
        <div className="pl-4 leading-relaxed bg-blue-50 p-4 rounded">
          <p className="text-gray-600 italic text-xs">[AI Generated Summary - {tone} Tone]:</p>
          <p className="mt-2">{getAIPlaceholder(tone, "intro")}</p>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-3 text-base">SCOPE OF WORK</h3>
        <div className="pl-4 leading-relaxed space-y-3">
          {formData.serviceDescription ? (
            <p className="text-gray-900 bg-white border-l-4 border-primary pl-4 py-2">{formData.serviceDescription}</p>
          ) : (
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 italic text-xs">[AI: Detailed scope description]</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI: Comprehensive breakdown of deliverables, milestones, and methodologies in {tone.toLowerCase()} tone]</p>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-3 text-base">PROJECT TIMELINE</h3>
        <div className="pl-4 bg-blue-50 p-4 rounded">
          <p className="text-gray-600 italic text-xs">[AI: Detailed project phases, milestones, and estimated completion dates]</p>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-3 text-base">INVESTMENT</h3>
        <div className="pl-4">
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Project Investment:</span>
              <span className="text-2xl font-bold text-primary">
                <Field value={formData.amount} placeholder="$[Amount]" />
              </span>
            </div>
            {formData.paymentTerms && (
              <div className="text-sm text-gray-600 mt-2">
                Payment Terms: <span className="font-semibold">{formData.paymentTerms}</span>
              </div>
            )}
          </div>
          <div className="mt-3 bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI: Detailed pricing breakdown, payment schedule, and what's included]</p>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-3 text-base">WHY CHOOSE US</h3>
        <div className="pl-4 bg-blue-50 p-4 rounded">
          <p className="text-gray-600 italic text-xs">
            [AI: Company qualifications, past successes, team expertise, and unique value proposition in {tone.toLowerCase()} tone]
          </p>
        </div>
      </div>

      <div className="text-sm border-t-2 border-gray-300 pt-6 mt-6">
        <h3 className="font-semibold mb-3 text-base">NEXT STEPS</h3>
        <div className="pl-4 leading-relaxed">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI Generated Call-to-Action - {tone} Tone]:</p>
            <p className="mt-2">{getAIPlaceholder(tone, "closing")}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <p className="font-semibold">
          <Field value={formData.companyName} placeholder="[Your Company]" />
        </p>
        <p>
          <Field value={formData.companyEmail} placeholder="contact@company.com" />
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500 italic bg-blue-50 p-3 rounded text-center">
        [AI Note: This is a preview with AI-generated content in {tone.toLowerCase()} tone. The final proposal would include complete sections, graphics, case studies, and detailed appendices.]
      </div>
    </div>
  )
}

// Purchase Order Preview
function PurchaseOrderPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  const amount = formData.amount || "$0.00"

  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">PURCHASE ORDER</h1>
        <p className="text-sm text-gray-600">
          <Field value={formData.companyName} placeholder="[Your Company Name]" />
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">BUYER:</h3>
          <div className="space-y-1">
            <div>
              <Field value={formData.companyName} placeholder="Buyer Company Name" />
            </div>
            <div>
              <Field value={formData.companyEmail} placeholder="buyer@company.com" />
            </div>
            <div className="text-gray-600 italic text-xs mt-2">[AI: Complete buyer address and contact]</div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">SUPPLIER:</h3>
          <div className="space-y-1">
            <div>
              <Field value={formData.clientName} placeholder="Supplier Name" />
            </div>
            <div className="text-gray-600 italic text-xs mt-2">[AI: Supplier contact and address details]</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
        <div>
          <span className="font-semibold text-gray-700">PO #:</span>
          <div className="text-gray-600 italic text-xs">[AI: PO-{new Date().getFullYear()}-001]</div>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date:</span>
          <div className="text-gray-600 italic text-xs">{new Date().toLocaleDateString()}</div>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Delivery Date:</span>
          <div className="text-gray-600 italic text-xs">[AI: Based on terms]</div>
        </div>
      </div>

      <div className="mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
              <th className="text-right py-2 px-3 font-semibold">Qty</th>
              <th className="text-right py-2 px-3 font-semibold">Unit Price</th>
              <th className="text-right py-2 px-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-3">
                {formData.serviceDescription ? (
                  <span className="text-gray-900">{formData.serviceDescription}</span>
                ) : (
                  <span className="text-gray-600 italic text-xs">[AI: Item description]</span>
                )}
              </td>
              <td className="text-right py-3 px-3">
                <span className="text-gray-600 italic text-xs">1</span>
              </td>
              <td className="text-right py-3 px-3">
                <Field value={formData.amount} placeholder="$0.00" />
              </td>
              <td className="text-right py-3 px-3">
                <Field value={formData.amount} placeholder="$0.00" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between border-t-2 border-gray-300 pt-2 text-base">
            <span className="font-bold">Total Amount:</span>
            <span className="font-bold text-lg">
              <Field value={formData.amount} placeholder="$0.00" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm space-y-3 pt-4 border-t border-gray-200 bg-blue-50 p-4 rounded">
        <div>
          <span className="font-semibold text-gray-700">Payment Terms: </span>
          <Field value={formData.paymentTerms} placeholder="[AI: Terms]" />
        </div>
        <div className="text-gray-600 italic text-xs">[AI: {getAIPlaceholder(tone, "closing")}]</div>
      </div>
    </div>
  )
}

// Memo Preview
function MemoPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">MEMORANDUM</h1>
      </div>

      <div className="text-sm space-y-2">
        <div>
          <span className="font-semibold w-20 inline-block">TO:</span>
          <Field value={formData.clientName} placeholder="[Recipients]" />
        </div>
        <div>
          <span className="font-semibold w-20 inline-block">FROM:</span>
          <Field value={formData.companyName} placeholder="[Your Name/Department]" />
        </div>
        <div>
          <span className="font-semibold w-20 inline-block">DATE:</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div>
          <span className="font-semibold w-20 inline-block">RE:</span>
          <Field value={formData.serviceDescription || ""} placeholder="[Subject]" />
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 text-sm leading-relaxed">
        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="text-gray-600 italic text-xs">[AI Generated Content - {tone} Tone]:</p>
          <p className="mt-2">{getAIPlaceholder(tone, "body")}</p>
        </div>

        {formData.serviceDescription && (
          <div className="mb-4">
            <p className="text-gray-900">{formData.serviceDescription}</p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 italic text-xs">[AI: Additional details and action items in {tone.toLowerCase()} tone]</p>
        </div>
      </div>
    </div>
  )
}

// Report Preview
function ReportPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">
          <Field value={formData.serviceDescription || ""} placeholder="[Report Title]" />
        </h1>
        <p className="text-sm text-gray-600">Company Report</p>
      </div>

      <div className="text-sm space-y-2">
        <div>
          <span className="font-semibold">Prepared By: </span>
          <Field value={formData.companyName} placeholder="[Your Name/Department]" />
        </div>
        <div>
          <span className="font-semibold">Date: </span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div>
          <span className="font-semibold">Recipient: </span>
          <Field value={formData.clientName} placeholder="[Recipient]" />
        </div>
      </div>

      <div className="text-sm bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2 text-base">Executive Summary</h3>
        <p className="text-gray-600 italic text-xs">[AI Generated Summary - {tone} Tone]:</p>
        <p className="mt-2">{getAIPlaceholder(tone, "intro")}</p>
      </div>

      <div className="text-sm space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-base">1. Introduction</h3>
          <div className="pl-4 bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI: Background and context in {tone.toLowerCase()} tone]</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-base">2. Findings</h3>
          <div className="pl-4">
            {formData.serviceDescription ? (
              <p className="mb-3 text-gray-900">{formData.serviceDescription}</p>
            ) : null}
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 italic text-xs">[AI: Detailed analysis and data points]</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-base">3. Recommendations</h3>
          <div className="pl-4 bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI: Actionable recommendations in {tone.toLowerCase()} tone]</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-base">4. Conclusion</h3>
          <div className="pl-4 bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI Generated Conclusion]:</p>
            <p className="mt-2">{getAIPlaceholder(tone, "closing")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Financial Statement Preview
function FinancialStatementPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  const amount = parseFloat(formData.amount?.replace(/[$,]/g, "") || "0")

  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-2xl font-bold mb-2">FINANCIAL STATEMENT</h1>
        <p className="text-sm text-gray-600">
          <Field value={formData.companyName} placeholder="[Company Name]" />
        </p>
        <p className="text-xs text-gray-600">Period Ending: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-3 text-base">Income Statement</h3>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span>Revenue:</span>
            <span className="font-semibold">
              <Field value={formData.amount} placeholder="$0.00" />
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 py-2 bg-blue-50 px-2">
            <span className="text-gray-600 italic text-xs">Expenses:</span>
            <span className="text-gray-600 italic text-xs">[AI: Calculated expenses]</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-bold">
            <span>Net Income:</span>
            <span>
              <Field value={formData.amount} placeholder="$0.00" />
            </span>
          </div>
        </div>
      </div>

      <div className="text-sm bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Notes:</h3>
        {formData.serviceDescription ? (
          <p className="text-gray-900 mb-2">{formData.serviceDescription}</p>
        ) : null}
        <p className="text-gray-600 italic text-xs">
          [AI: Additional financial details, accounting methods, and explanatory notes in {tone.toLowerCase()} tone]
        </p>
      </div>

      <div className="text-xs text-gray-500 italic text-center pt-4 border-t border-gray-200">
        Prepared by: <Field value={formData.companyName} placeholder="[Company Name]" />
      </div>
    </div>
  )
}

// Work Order Preview
function WorkOrderPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">WORK ORDER</h1>
        <p className="text-sm text-gray-600">
          <Field value={formData.companyName} placeholder="[Your Company Name]" />
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
        <div>
          <span className="font-semibold">Work Order #:</span>
          <div className="text-gray-600 italic text-xs">[AI: WO-{new Date().getFullYear()}-001]</div>
        </div>
        <div>
          <span className="font-semibold">Date:</span>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
        <div>
          <span className="font-semibold">Priority:</span>
          <div className="text-gray-600 italic text-xs">[AI: Normal/High/Urgent]</div>
        </div>
        <div>
          <span className="font-semibold">Due Date:</span>
          <div className="text-gray-600 italic text-xs">
            {formData.paymentTerms ? `[Based on ${formData.paymentTerms}]` : "[AI: Based on priority]"}
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2">Client Information:</h3>
        <div className="pl-4 space-y-1">
          <div>
            <Field value={formData.clientName} placeholder="[Client Name]" />
          </div>
          <div className="text-gray-600 italic text-xs">[AI: Client address and contact information]</div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="font-semibold mb-2">Work Description:</h3>
        <div className="pl-4 leading-relaxed">
          {formData.serviceDescription ? (
            <p className="text-gray-900 bg-white border-l-4 border-primary pl-4 py-2 mb-3">{formData.serviceDescription}</p>
          ) : (
            <div className="bg-blue-50 p-4 rounded mb-3">
              <p className="text-gray-600 italic text-xs">[AI: Detailed work description]</p>
            </div>
          )}
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600 italic text-xs">[AI: Additional work details, requirements, and specifications in {tone.toLowerCase()} tone]</p>
          </div>
        </div>
      </div>

      {formData.amount && (
        <div className="text-sm bg-gray-50 p-4 rounded">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Estimated Cost:</span>
            <span className="text-xl font-bold text-primary">
              <Field value={formData.amount} />
            </span>
          </div>
          {formData.paymentTerms && (
            <div className="text-xs text-gray-600 mt-2">
              Terms: <span className="font-semibold">{formData.paymentTerms}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-sm space-y-3 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-semibold mb-2">Assigned To:</div>
            <div className="border-b border-gray-400 w-full mb-1 mt-8"></div>
            <div className="text-xs text-gray-600">Technician Signature & Date</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Approved By:</div>
            <div className="border-b border-gray-400 w-full mb-1 mt-8"></div>
            <div className="text-xs text-gray-600">Supervisor Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Receipt Preview
function ReceiptPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  const amount = parseFloat(formData.amount?.replace(/[$,]/g, "") || "0")
  const tax = amount * 0.08
  const total = amount + tax

  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">RECEIPT</h1>
        <div className="text-sm mt-2">
          <div className="font-semibold">
            <Field value={formData.companyName} placeholder="[Business Name]" />
          </div>
          <div>
            <Field value={formData.companyEmail} placeholder="business@email.com" />
          </div>
          <div className="text-gray-600 italic text-xs mt-1">[AI: Business address]</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
        <div>
          <span className="font-semibold">Receipt #:</span>
          <div className="text-gray-600 italic text-xs">[AI: REC-{Date.now().toString().slice(-6)}]</div>
        </div>
        <div>
          <span className="font-semibold">Date:</span>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {formData.clientName && (
        <div className="text-sm">
          <span className="font-semibold">Customer: </span>
          <Field value={formData.clientName} />
        </div>
      )}

      <div className="mt-6">
        <table className="w-full text-sm">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2">
                {formData.serviceDescription ? (
                  <span className="text-gray-900">{formData.serviceDescription}</span>
                ) : (
                  <span className="text-gray-600 italic text-xs">[Item description]</span>
                )}
              </td>
              <td className="text-right py-2">1</td>
              <td className="text-right py-2">
                <Field value={formData.amount} placeholder="$0.00" />
              </td>
              <td className="text-right py-2">
                <Field value={formData.amount} placeholder="$0.00" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-48 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>
              <Field value={formData.amount} placeholder="$0.00" />
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-bold">
            <span>Total:</span>
            <span className="text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {formData.paymentTerms && (
        <div className="text-sm text-center mt-4 bg-gray-50 p-3 rounded">
          <span className="font-semibold">Payment Method: </span>
          <Field value={formData.paymentTerms} />
        </div>
      )}

      <div className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-200 bg-blue-50 p-3 rounded">
        <p className="italic text-xs">[AI: {getAIPlaceholder(tone, "closing")}]</p>
      </div>
    </div>
  )
}

// Other/Custom Document Type Preview
function OtherPreview({ tone, formData }: { tone: ToneType; formData: FormData }) {
  const customType = formData.customDocumentType || "Custom Document"

  return (
    <div className="space-y-6 text-gray-900">
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2 uppercase">{customType}</h1>
        <p className="text-sm text-gray-600">
          <Field value={formData.companyName} placeholder="[Your Company/Organization]" />
        </p>
      </div>

      <div className="text-sm space-y-2 bg-gray-50 p-4 rounded">
        <div>
          <span className="font-semibold">Date: </span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        {formData.clientName && (
          <div>
            <span className="font-semibold">To/Regarding: </span>
            <Field value={formData.clientName} />
          </div>
        )}
      </div>

      <div className="text-sm bg-blue-50 p-4 rounded">
        <p className="text-gray-600 italic text-xs">[AI Generated Introduction - {tone} Tone]:</p>
        <p className="mt-2">{getAIPlaceholder(tone, "intro")}</p>
      </div>

      <div className="text-sm space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-base">Content</h3>
          {formData.serviceDescription ? (
            <div className="leading-relaxed pl-4 border-l-4 border-primary py-2">
              <p className="text-gray-900">{formData.serviceDescription}</p>
            </div>
          ) : (
            <div className="pl-4 bg-blue-50 p-4 rounded">
              <p className="text-gray-600 italic text-xs">[AI: Main document content]</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 italic text-xs">[AI Generated Body Content - {tone} Tone]:</p>
          <p className="mt-2 leading-relaxed">{getAIPlaceholder(tone, "body")}</p>
        </div>

        {(formData.amount || formData.paymentTerms) && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Financial Details:</h3>
            {formData.amount && (
              <div className="mb-2">
                <span className="font-semibold">Amount: </span>
                <span className="text-lg text-primary">
                  <Field value={formData.amount} />
                </span>
              </div>
            )}
            {formData.paymentTerms && (
              <div>
                <span className="font-semibold">Terms: </span>
                <Field value={formData.paymentTerms} />
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 italic text-xs">[AI Generated Conclusion - {tone} Tone]:</p>
          <p className="mt-2">{getAIPlaceholder(tone, "closing")}</p>
        </div>
      </div>

      <div className="mt-6 text-sm pt-4 border-t border-gray-200">
        <div className="space-y-1">
          <div className="font-semibold">
            <Field value={formData.companyName} placeholder="[Your Name/Organization]" />
          </div>
          <div>
            <Field value={formData.companyEmail} placeholder="contact@email.com" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 italic bg-blue-50 p-3 rounded text-center">
        [AI Note: This is a custom document preview with AI-generated content in {tone.toLowerCase()} tone. The final document would be tailored specifically for the "{customType}" type.]
      </div>
    </div>
  )
}

// Helper functions for tone-based greetings and closings
function getToneGreeting(tone: ToneType): string {
  const greetings: Record<string, string> = {
    Professional: "Dear [Recipient],",
    Formal: "Dear Sir/Madam,",
    Friendly: "Hello [Recipient]!",
    Creative: "Greetings [Recipient]!",
  }
  return greetings[tone] || "Dear [Recipient],"
}

function getToneClosing(tone: ToneType): string {
  const closings: Record<string, string> = {
    Professional: "Best regards,",
    Formal: "Respectfully yours,",
    Friendly: "Warmly,",
    Creative: "With enthusiasm,",
  }
  return closings[tone] || "Sincerely,"
}
