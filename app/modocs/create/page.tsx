"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  ArrowLeft,
  Download,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DocumentType } from "@/lib/document-types"

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Select Type" },
    { number: 2, label: "Select Tone" },
    { number: 3, label: "Fill in Details" },
    { number: 4, label: "Preview" },
  ]

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border py-4 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-border">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = currentStep > step.number
              const isCurrent = currentStep === step.number

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 ease-out
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground scale-100"
                        : isCurrent
                          ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground scale-90"
                    }
                  `}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                  </div>
                  <span
                    className={`
                    mt-2 text-xs font-medium transition-colors duration-300
                    ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}
                  `}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentPreview({ formData, documentType, documentTitle, tone }: any) {
  // Generate tone-specific content
  const getToneContent = (baseContent: string) => {
    switch (tone) {
      case "professional":
        return baseContent
      case "formal":
        return baseContent.replace(/we/gi, "the undersigned").replace(/our/gi, "the party's")
      case "friendly":
        return baseContent.replace(/we are pleased/gi, "we're excited").replace(/sincerely/gi, "warmly")
      case "casual":
        return baseContent.replace(/we are pleased/gi, "we're happy").replace(/furthermore/gi, "also")
      default:
        return baseContent
    }
  }

  const generatePreviewContent = () => {
    if (documentType === "Invoice") {
      // Get user data safely
      const clientName = formData.clientInfo?.name || formData.clientName || "[Client Name]"
      const clientAddress = formData.clientInfo?.address || formData.clientAddress || "[Client Address]"
      const invoiceNumber = formData.invoiceNumber || "INV-001"
      const invoiceDate = formData.invoiceDate || new Date().toLocaleDateString()
      const dueDate = formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      const totalAmount = formData.totalAmount || "0.00"

      return (
        <div className="space-y-8 bg-white p-12 text-black font-sans max-w-[8.5in] mx-auto">
          {/* Letterhead */}
          <div className="text-right border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Invoice</h1>
            <p className="text-sm">#{invoiceNumber}</p>
          </div>

          {/* From/To Section */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2">From:</p>
              <p className="font-semibold">Your Company Name</p>
              <p className="text-sm">123 Business Street</p>
              <p className="text-sm">City, State 12345</p>
              <p className="text-sm">Phone: (555) 123-4567</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2">Bill To:</p>
              <p className="font-semibold">{clientName}</p>
              <p className="text-sm">{clientAddress}</p>
              <p className="text-sm">City, State 12345</p>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold">Invoice Date:</p>
              <p>{invoiceDate}</p>
            </div>
            <div>
              <p className="font-bold">Payment Due:</p>
              <p>{dueDate}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-right py-2 font-bold">Qty</th>
                <th className="text-right py-2 font-bold">Rate</th>
                <th className="text-right py-2 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-3">Professional Services - Month 1</td>
                <td className="text-right py-3">1</td>
                <td className="text-right py-3">$2,500.00</td>
                <td className="text-right py-3">$2,500.00</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3">Consulting Hours (20 hrs @ $150/hr)</td>
                <td className="text-right py-3">20</td>
                <td className="text-right py-3">$150.00</td>
                <td className="text-right py-3">$3,000.00</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3">Project Management</td>
                <td className="text-right py-3">1</td>
                <td className="text-right py-3">$1,250.00</td>
                <td className="text-right py-3">$1,250.00</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span>Subtotal:</span>
                <span>$6,750.00</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span>Tax (8%):</span>
                <span>$540.00</span>
              </div>
              <div className="flex justify-between border-t-2 border-black pt-2 font-bold text-lg">
                <span>TOTAL:</span>
                <span>${totalAmount === "0.00" ? "7,290.00" : totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="text-xs text-gray-700 border-t border-gray-300 pt-4">
            <p className="font-bold mb-1">PAYMENT TERMS</p>
            <p>
              {tone === "formal"
                ? "Payment shall be remitted within the specified timeframe to the address listed above."
                : tone === "friendly"
                  ? "We'd appreciate payment within the due date. Thanks for your business!"
                  : "Payment is due within 30 days. Please make checks payable to Your Company Name."}
            </p>
            <p className="mt-2">
              <span className="font-bold">Payment Methods:</span> Check, ACH Transfer, Credit Card
            </p>
          </div>
        </div>
      )
    } else if (documentType === "Contract") {
      const contractTitle = formData.contractTitle || documentTitle || "Service Agreement"
      const partyA = formData.partyA || "[First Party Name]"
      const partyB = formData.partyB || "[Second Party Name]"
      const duration = formData.duration || "twelve (12) months"
      const paymentTerms = formData.paymentTerms || "as mutually agreed upon"

      return (
        <div className="space-y-6 bg-white p-12 text-black font-serif max-w-[8.5in] mx-auto leading-relaxed">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-widest">{contractTitle}</h1>
            <p className="text-sm uppercase">Agreement</p>
          </div>

          {/* Parties Section */}
          <div className="space-y-3">
            <p className="text-sm leading-loose">
              This Agreement is entered into as of{" "}
              <span className="font-bold underline">{new Date().toLocaleDateString()}</span>, by and between{" "}
              <span className="font-bold underline">{partyA}</span> ("First Party") and{" "}
              <span className="font-bold underline">{partyB}</span> ("Second Party").
            </p>
          </div>

          {/* Recitals */}
          <div className="space-y-2">
            <p className="font-bold text-sm uppercase tracking-wider">WHEREAS:</p>
            <p className="text-sm pl-8 text-justify">
              {getToneContent(
                "The parties wish to establish the terms and conditions of their business relationship as set forth in this Agreement, and to define their respective rights, obligations, and responsibilities for the mutual benefit of both parties.",
              )}
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <p className="font-bold text-sm uppercase tracking-wider">NOW, THEREFORE, the parties agree as follows:</p>

            <div className="space-y-3">
              <div>
                <p className="font-bold text-sm">1. TERM AND DURATION</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    `This Agreement shall commence on the Effective Date and continue for a period of ${duration}, unless terminated earlier in accordance with the provisions herein. The Agreement may be renewed upon mutual written consent of both parties.`,
                  )}
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">2. SCOPE OF SERVICES</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    "The First Party agrees to provide professional services as outlined in Exhibit A, attached hereto and incorporated by reference. Services shall be performed in a timely and professional manner, meeting industry standards and best practices.",
                  )}
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">3. PAYMENT TERMS</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    `Payment shall be made ${paymentTerms} and as specified in attached schedules. All payments are due within thirty (30) days of invoice date unless otherwise agreed in writing.`,
                  )}
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">4. CONFIDENTIALITY</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    "Both parties agree to maintain the confidentiality of any proprietary information shared during the term of this Agreement and for a period of two (2) years following termination.",
                  )}
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">5. INTELLECTUAL PROPERTY</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    "All intellectual property created during the performance of services under this Agreement shall be owned by the party specified in the Statement of Work, or jointly owned as mutually agreed upon.",
                  )}
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">6. TERMINATION</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    "Either party may terminate this Agreement upon thirty (30) days written notice to the other party. Termination shall not affect any obligations or liabilities accrued prior to the effective date of termination.",
                  )}
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">7. GOVERNING LAW</p>
                <p className="text-sm pl-6 text-justify">
                  This Agreement shall be governed by and construed in accordance with the laws of the applicable
                  jurisdiction, without regard to conflict of law principles.
                </p>
              </div>

              <div>
                <p className="font-bold text-sm">8. ENTIRE AGREEMENT</p>
                <p className="text-sm pl-6 text-justify">
                  {getToneContent(
                    "This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements, whether written or oral, relating to the subject matter herein.",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 mt-8 border-t border-black">
            <div className="space-y-8">
              <div>
                <div className="border-b border-black mb-2 h-10"></div>
                <p className="text-xs font-bold">{partyA}</p>
                <p className="text-xs">First Party Signature</p>
              </div>
              <div>
                <div className="border-b border-black mb-2"></div>
                <p className="text-xs">Date</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <div className="border-b border-black mb-2 h-10"></div>
                <p className="text-xs font-bold">{partyB}</p>
                <p className="text-xs">Second Party Signature</p>
              </div>
              <div>
                <div className="border-b border-black mb-2"></div>
                <p className="text-xs">Date</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (documentType === "Business Letter") {
      const recipient = formData.recipientName || "[Recipient Name]"
      const subject = formData.subject || "[Subject Line]"
      const body = formData.body || ""
      const date = formData.date || new Date().toLocaleDateString()
      const senderName = formData.senderName || "Your Name"
      const senderTitle = formData.senderTitle || "Your Title"

      return (
        <div className="space-y-6 bg-white p-12 text-black font-serif max-w-[8.5in] mx-auto">
          {/* Letterhead */}
          <div className="text-right mb-8">
            <p className="font-bold text-lg">{formData.senderName || "Your Company Name"}</p>
            <p className="text-sm">{formData.senderAddress?.split("\n")[1] || "123 Business Street"}</p>
            <p className="text-sm">{formData.senderAddress?.split("\n")[2] || "City, State 12345"}</p>
            <p className="text-sm">{formData.senderAddress?.split("\n")[3] || "Phone: (555) 123-4567"}</p>
            <p className="text-sm">{formData.senderAddress?.split("\n")[4] || "Email: info@yourcompany.com"}</p>
          </div>

          {/* Date */}
          <div className="mb-8">
            <p>{date}</p>
          </div>

          {/* Recipient */}
          <div className="mb-8">
            <p className="font-semibold">{recipient}</p>
            <p className="text-sm">{formData.recipientTitle || "Senior Manager"}</p>
            <p className="text-sm">{formData.recipientCompany || "Target Company Inc."}</p>
            <p className="text-sm">{formData.recipientAddress?.split("\n")[1] || "456 Corporate Avenue"}</p>
            <p className="text-sm">{formData.recipientAddress?.split("\n")[2] || "City, State 12345"}</p>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <p className="font-bold">Re: {subject}</p>
          </div>

          {/* Salutation */}
          <div className="mb-4">
            <p>{formData.salutation || `Dear ${recipient.split(" ")[0] || "Sir/Madam"},`}</p>
          </div>

          {/* Body */}
          <div className="space-y-4 text-justify leading-loose">
            <p>
              {body ||
                getToneContent(
                  "We are pleased to present this correspondence regarding the matter at hand. Our organization has carefully reviewed the situation and would like to propose the following course of action.",
                )}
            </p>
            <p>
              {getToneContent(
                "Furthermore, we believe that this approach will yield positive results for all parties involved. Our team has extensive experience in this area and is committed to ensuring a successful outcome through collaborative efforts and open communication.",
              )}
            </p>
            <p>
              {getToneContent(
                "We appreciate your consideration of this matter and look forward to discussing it further at your earliest convenience. Please do not hesitate to contact us should you require any additional information or clarification.",
              )}
            </p>
          </div>

          {/* Closing */}
          <div className="mt-8">
            <p className="mb-12">
              {formData.closing ||
                (tone === "formal"
                  ? "Respectfully yours,"
                  : tone === "friendly"
                    ? "Warmly,"
                    : tone === "casual"
                      ? "Best regards,"
                      : "Sincerely,")}
            </p>
            <div>
              <div className="border-b border-black w-48 mb-1"></div>
              <p className="font-semibold">{senderName}</p>
              <p className="text-sm">{senderTitle}</p>
            </div>
          </div>
        </div>
      )
    } else if (documentType === "Memo") {
      const to = formData.to || "[Recipients]"
      const from = formData.from || "[Your Name]"
      const subject = formData.subject || "[Subject]"
      const body = formData.mainContent || "" // Using mainContent for the body
      const date = formData.date || new Date().toLocaleDateString()

      return (
        <div className="space-y-6 bg-white p-12 text-black font-sans max-w-[8.5in] mx-auto">
          {/* Header */}
          <div className="border-b-2 border-black pb-2 mb-6">
            <h1 className="text-2xl font-bold uppercase">Memorandum</h1>
          </div>

          {/* Memo Header Fields */}
          <div className="space-y-2 border-b border-gray-400 pb-6 mb-6">
            <div className="grid grid-cols-[100px_1fr]">
              <p className="font-bold">TO:</p>
              <p>{to}</p>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <p className="font-bold">FROM:</p>
              <p>{from}</p>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <p className="font-bold">DATE:</p>
              <p>{date}</p>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <p className="font-bold">RE:</p>
              <p className="font-semibold">{subject}</p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4 text-justify leading-relaxed">
            <p>
              {body ||
                getToneContent(
                  "This memorandum is to inform you of important updates regarding our current operations and to outline key action items moving forward.",
                )}
            </p>
            <p>
              {getToneContent(
                "The following points require immediate attention and action from all team members. Please review each item carefully and ensure compliance with the outlined procedures.",
              )}
            </p>

            <div className="pl-6 space-y-2">
              <p>
                <span className="font-bold">1.</span> {getToneContent("Complete quarterly reports by end of month")}
              </p>
              <p>
                <span className="font-bold">2.</span>{" "}
                {getToneContent("Attend mandatory training session scheduled for next week")}
              </p>
              <p>
                <span className="font-bold">3.</span> {getToneContent("Review and update departmental procedures")}
              </p>
            </div>

            <p>
              {getToneContent(
                "Should you have any questions or concerns regarding these matters, please do not hesitate to reach out to the management team. Your cooperation and prompt attention to these items is greatly appreciated.",
              )}
            </p>
          </div>

          {/* Footer */}
          {formData.cc && (
            <div className="mt-8 text-sm border-t border-gray-300 pt-4">
              <p>
                <span className="font-bold">CC:</span> {formData.cc}
              </p>
            </div>
          )}
        </div>
      )
    } else if (documentType === "Proposal") {
      const client = formData.client || "[Client Name]"
      const executiveSummary = formData.executiveSummary || ""
      const scope = formData.proposedSolution || ""
      const timeline = formData.timeline || ""
      const budget = formData.totalCost || "[Amount]"

      return (
        <div className="space-y-8 bg-white p-12 text-black font-sans max-w-[8.5in] mx-auto">
          {/* Cover Page */}
          <div className="text-center border-b-2 border-black pb-8 mb-8">
            <h1 className="text-3xl font-bold uppercase mb-4">{documentTitle || "Project Proposal"}</h1>
            <p className="text-lg mb-6">Comprehensive Solution for Digital Transformation</p>
            <p className="text-sm font-semibold">Prepared for: {client}</p>
            <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm mt-4">Confidential & Proprietary</p>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2">Executive Summary</h2>
            <p className="text-sm text-justify leading-relaxed">
              {executiveSummary ||
                getToneContent(
                  "We are pleased to present this comprehensive proposal outlining our approach to addressing your organization's needs. Our solution combines industry-leading expertise with innovative methodologies to deliver measurable results that exceed expectations.",
                )}
            </p>
            <p className="text-sm text-justify leading-relaxed">
              {getToneContent(
                "This proposal details our understanding of your requirements, the proposed solution architecture, implementation timeline, and investment structure. We are confident that our approach will provide significant value to your organization.",
              )}
            </p>
          </div>

          {/* Scope of Work */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2">Scope of Work</h2>
            <p className="text-sm text-justify leading-relaxed">
              {scope ||
                getToneContent(
                  "Our comprehensive solution encompasses the following key components and deliverables designed to meet your specific business objectives:",
                )}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                {getToneContent(
                  "Initial Discovery & Requirements Analysis - Comprehensive assessment of current state and future needs",
                )}
              </li>
              <li>
                {getToneContent("Solution Design & Architecture - Custom-tailored approach aligned with your goals")}
              </li>
              <li>
                {getToneContent(
                  "Implementation & Integration - Seamless deployment with minimal disruption to operations",
                )}
              </li>
              <li>
                {getToneContent("Testing & Quality Assurance - Rigorous validation to ensure optimal performance")}
              </li>
              <li>
                {getToneContent("Training & Knowledge Transfer - Comprehensive enablement for your team members")}
              </li>
              <li>
                {getToneContent("Ongoing Support & Optimization - Continuous improvement and technical assistance")}
              </li>
            </ul>
          </div>

          {/* Methodology */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2">Our Methodology</h2>
            <p className="text-sm text-justify leading-relaxed">
              {getToneContent(
                "We employ a proven, agile methodology that ensures transparency, collaboration, and adaptability throughout the project lifecycle. Our approach includes regular stakeholder engagement and iterative delivery.",
              )}
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2">Timeline</h2>
            <p className="text-sm">{timeline || "Project Duration: 12-16 weeks with the following key milestones:"}</p>
            <div className="text-sm space-y-1 pl-6">
              <p>
                <span className="font-bold">Phase 1 (Weeks 1-3):</span> Discovery & Planning
              </p>
              <p>
                <span className="font-bold">Phase 2 (Weeks 4-8):</span> Design & Development
              </p>
              <p>
                <span className="font-bold">Phase 3 (Weeks 9-12):</span> Implementation & Testing
              </p>
              <p>
                <span className="font-bold">Phase 4 (Weeks 13-16):</span> Launch & Optimization
              </p>
            </div>
          </div>

          {/* Investment */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2">Investment</h2>
            <div className="bg-gray-100 p-6 border border-gray-400">
              <p className="text-2xl font-bold mb-3">Total Investment: ${budget}</p>
              <p className="text-sm text-gray-700 mb-2">
                {getToneContent(
                  "This investment includes all phases of the project as outlined above. Payment terms are structured to align with project milestones.",
                )}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold">Payment Structure:</span> 30% upon signing, 40% at mid-point, 30% upon
                completion
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2">Next Steps</h2>
            <p className="text-sm text-justify leading-relaxed">
              {getToneContent(
                "We are excited about the opportunity to partner with your organization. To proceed, we propose scheduling a meeting to discuss this proposal in detail and address any questions you may have.",
              )}
            </p>
          </div>
        </div>
      )
    } else if (documentType === "Receipt") {
      const receiptNumber = formData.receiptNumber || "RCP-001"
      const date = formData.receiptDate || new Date().toLocaleDateString()
      const paymentMethod = formData.paymentMethod || "Cash"
      const amount = formData.totalAmount || "0.00" // Use totalAmount for receipt value

      return (
        <div className="space-y-6 bg-white p-12 text-black font-sans max-w-[8.5in] mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wide">Receipt</h1>
            <p className="text-sm">#{receiptNumber}</p>
          </div>

          {/* Business Info */}
          <div className="text-center mb-6">
            <p className="font-bold text-lg">{formData.companyInfo?.name || "Your Business Name"}</p>
            <p className="text-sm">{formData.companyInfo?.address?.split("\n")[0] || "123 Main Street"}</p>
            <p className="text-sm">{formData.companyInfo?.address?.split("\n")[1] || "City, State 12345"}</p>
            <p className="text-sm">{formData.companyInfo?.phone || "Phone: (555) 123-4567"}</p>
            <p className="text-sm">{formData.companyInfo?.email || "Email: info@yourbusiness.com"}</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 text-sm mb-6 border-y border-gray-300 py-4">
            <div className="flex justify-between">
              <span className="font-bold">Date:</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Transaction ID:</span>
              <span>TXN-{Date.now().toString().slice(-8)}</span>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm mb-6">
            <thead className="border-b-2 border-black">
              <tr>
                <th className="text-left py-2">Item Description</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2">{formData.itemDescription || "Professional Services"}</td>
                <td className="text-center py-2">{formData.quantity || 1}</td>
                <td className="text-right py-2">${amount}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="border-t-2 border-black pt-4">
            <div className="flex justify-between text-lg font-bold mb-2">
              <span>TOTAL PAID:</span>
              <span>${amount}</span>
            </div>
            <p className="text-xs text-gray-600 text-center">All amounts in USD</p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-8 border-t border-gray-300 pt-4">
            <p className="font-semibold mb-1">
              {tone === "formal"
                ? "We acknowledge receipt of payment"
                : tone === "friendly"
                  ? "Thanks so much for your business!"
                  : "Thank you for your business!"}
            </p>
            <p className="text-xs">This is an official receipt for your records</p>
            <p className="text-xs mt-2">For questions, please contact us at the information above</p>
          </div>
        </div>
      )
    } else if (documentType === "Other") {
      // Generic document for other types including custom "Other" types
      return (
        <div className="space-y-6 bg-white p-12 text-black font-serif max-w-[8.5in] mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-widest">{documentTitle || "Document"}</h1>
            <p className="text-sm uppercase mt-2">{documentType}</p>
          </div>

          {/* Document Body */}
          <div className="space-y-4 text-justify leading-relaxed">
            {Object.entries(formData)
              .filter(
                ([key]) =>
                  ![
                    "documentType",
                    "id",
                    "createdAt",
                    "updatedAt",
                    "author",
                    "status",
                    "title",
                    "tone",
                    "customDocumentType",
                    "invoiceNumber",
                    "clientName",
                    "totalAmount",
                    "dueDate",
                    "invoiceDate",
                    "clientInfo",
                    "partyA",
                    "partyB",
                    "duration",
                    "paymentTerms",
                    "contractTitle",
                    "recitals",
                    "terminationClause",
                    "governingLaw",
                    "senderAddress",
                    "recipientAddress",
                    "recipientName",
                    "recipientTitle",
                    "recipientCompany",
                    "salutation",
                    "body",
                    "closing",
                    "senderName",
                    "senderTitle",
                    "to",
                    "from",
                    "date",
                    "subject",
                    "purpose",
                    "mainContent",
                    "closingRemarks",
                    "cc",
                    "reportTitle",
                    "executiveSummary",
                    "introduction",
                    "methodology",
                    "conclusions",
                    "companyInfo",
                    "incomeStatement",
                    "notes",
                    "preparer",
                    "workOrderNumber",
                    "workOrderDate",
                    "workDescription",
                    "estimatedCompletionDate",
                    "priority",
                    "proposalTitle",
                    "coverLetter",
                    "background",
                    "proposedSolution",
                    "totalCost",
                    "termsAndConditions",
                    "conclusion",
                    "receiptNumber",
                    "receiptDate",
                    "itemDescription",
                    "quantity",
                    "subtotal",
                    "taxAmount",
                    "paymentMethod",
                    "customerInfo",
                    "category",
                    "summary",
                    "content",
                    "additionalNotes",
                  ].includes(key),
              )
              .map(([key, value]) => (
                <div key={key} className="mb-4">
                  <p className="font-bold text-sm uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </p>
                  <p className="text-sm pl-4">
                    {typeof value === "object" && value !== null
                      ? JSON.stringify(value, null, 2)
                      : String(value) || "[To be completed]"}
                  </p>
                </div>
              ))}

            {/* Add placeholder content if little user data */}
            {Object.keys(formData).length < 5 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm">
                  {getToneContent(
                    "This document has been prepared in accordance with the specified requirements and guidelines. All information contained herein is accurate and complete to the best of our knowledge.",
                  )}
                </p>
                <p className="text-sm">
                  {getToneContent(
                    "Please review the contents carefully and contact us if you have any questions or require additional information. We are committed to ensuring your satisfaction and meeting your needs.",
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Signature Area */}
          <div className="mt-12 pt-8 border-t border-black">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-black mb-2 h-10"></div>
                <p className="text-xs font-bold">Authorized Signature</p>
              </div>
              <div>
                <div className="border-b border-black mb-2"></div>
                <p className="text-xs">Date</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      // Generic document for other types including custom "Other" types
      return (
        <div className="space-y-6 bg-white p-12 text-black font-serif max-w-[8.5in] mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-widest">{documentTitle || "Document"}</h1>
            <p className="text-sm uppercase mt-2">{documentType}</p>
          </div>

          {/* Document Body */}
          <div className="space-y-4 text-justify leading-relaxed">
            {Object.entries(formData)
              .filter(
                ([key]) =>
                  ![
                    "documentType",
                    "id",
                    "createdAt",
                    "updatedAt",
                    "author",
                    "status",
                    "title",
                    "tone",
                    "customDocumentType",
                    "invoiceNumber",
                    "clientName",
                    "totalAmount",
                    "dueDate",
                    "invoiceDate",
                    "clientInfo",
                    "partyA",
                    "partyB",
                    "duration",
                    "paymentTerms",
                    "contractTitle",
                    "recitals",
                    "terminationClause",
                    "governingLaw",
                    "senderAddress",
                    "recipientAddress",
                    "recipientName",
                    "recipientTitle",
                    "recipientCompany",
                    "salutation",
                    "body",
                    "closing",
                    "senderName",
                    "senderTitle",
                    "to",
                    "from",
                    "date",
                    "subject",
                    "purpose",
                    "mainContent",
                    "closingRemarks",
                    "cc",
                    "reportTitle",
                    "executiveSummary",
                    "introduction",
                    "methodology",
                    "conclusions",
                    "companyInfo",
                    "incomeStatement",
                    "notes",
                    "preparer",
                    "workOrderNumber",
                    "workOrderDate",
                    "workDescription",
                    "estimatedCompletionDate",
                    "priority",
                    "proposalTitle",
                    "coverLetter",
                    "background",
                    "proposedSolution",
                    "totalCost",
                    "termsAndConditions",
                    "conclusion",
                    "receiptNumber",
                    "receiptDate",
                    "itemDescription",
                    "quantity",
                    "subtotal",
                    "taxAmount",
                    "paymentMethod",
                    "customerInfo",
                    "category",
                    "summary",
                    "content",
                    "additionalNotes",
                  ].includes(key),
              )
              .map(([key, value]) => (
                <div key={key} className="mb-4">
                  <p className="font-bold text-sm uppercase tracking-wide mb-1">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </p>
                  <p className="text-sm pl-4">
                    {typeof value === "object" && value !== null
                      ? JSON.stringify(value, null, 2)
                      : String(value) || "[To be completed]"}
                  </p>
                </div>
              ))}

            {/* Add placeholder content if little user data */}
            {Object.keys(formData).length < 5 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm">
                  {getToneContent(
                    "This document has been prepared in accordance with the specified requirements and guidelines. All information contained herein is accurate and complete to the best of our knowledge.",
                  )}
                </p>
                <p className="text-sm">
                  {getToneContent(
                    "Please review the contents carefully and contact us if you have any questions or require additional information. We are committed to ensuring your satisfaction and meeting your needs.",
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Signature Area */}
          <div className="mt-12 pt-8 border-t border-black">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-black mb-2 h-10"></div>
                <p className="text-xs font-bold">Authorized Signature</p>
              </div>
              <div>
                <div className="border-b border-black mb-2"></div>
                <p className="text-xs">Date</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6" data-testid="document-preview-body">
      {generatePreviewContent()}
    </div>
  )
}

const BUILTIN_DOCUMENT_TYPES = new Set([
  "Invoice",
  "Purchase Order",
  "Contract",
  "Business Letter",
  "Memo",
  "Report",
  "Financial Statement",
  "Work Order",
  "Proposal",
  "Receipt",
  "Other",
])

export default function CreateDocumentPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentStep, setCurrentStep] = useState(1)
  const [documentType, setDocumentType] = useState<DocumentType | "Other" | "">("")
  const [customDocumentType, setCustomDocumentType] = useState("")
  const [tone, setTone] = useState<"professional" | "friendly" | "formal" | "casual">("professional")
  const [documentTitle, setDocumentTitle] = useState("")
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<Record<string, any>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [editingDocId, setEditingDocId] = useState<string | null>(null)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const formDataRef = useRef(formData)
  const documentTitleRef = useRef(documentTitle)
  const documentTypeRef = useRef(documentType)
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges)

  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  useEffect(() => {
    documentTitleRef.current = documentTitle
  }, [documentTitle])

  useEffect(() => {
    documentTypeRef.current = documentType
  }, [documentType])

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges
  }, [hasUnsavedChanges])

  useEffect(() => {
    if (typeof window === "undefined") return

    const editId = searchParams.get("edit")
    const previewId = searchParams.get("preview")

    if (!editId && !previewId) return

    const stored = localStorage.getItem("modocs_documents")
    if (!stored) return

    const docs = JSON.parse(stored)
    const targetId = editId ?? previewId
    const doc = docs.find((d: any) => d.id === targetId)

    if (!doc) return

    const resolvedFormData = {
      ...(doc.formData || doc),
      id: doc.id,
      createdAt: doc.createdAt,
      status: doc.status,
    }

    const isCustomType = !BUILTIN_DOCUMENT_TYPES.has(doc.documentType)
    const effectiveType = isCustomType ? "Other" : (doc.documentType as DocumentType | "Other")

    setDocumentType(effectiveType)

    if (isCustomType) {
      setCustomDocumentType(doc.customDocumentType || doc.documentType || "")
    } else if (doc.documentType === "Other") {
      setCustomDocumentType(doc.customDocumentType || "")
    } else {
      setCustomDocumentType("")
    }
    setDocumentTitle(doc.title || "")
    setTone(doc.tone || "professional")
    setFormData(resolvedFormData)
    setEditingDocId(doc.id)

    if (previewId) {
      setCurrentStep(4)
      setShowPreview(true)
      setHasUnsavedChanges(false)
    } else {
      setCurrentStep(3)
      setShowPreview(false)
    }
  }, [searchParams])

  useEffect(() => {
    const docToEdit = sessionStorage.getItem("modocs_edit_document")
    if (docToEdit) {
      const doc = JSON.parse(docToEdit)
      const isCustomType = !BUILTIN_DOCUMENT_TYPES.has(doc.documentType)
      const effectiveType = isCustomType ? "Other" : (doc.documentType as DocumentType | "Other")

      setDocumentType(effectiveType)

      if (isCustomType) {
        setCustomDocumentType(doc.customDocumentType || doc.documentType || "")
      } else if (doc.documentType === "Other") {
        setCustomDocumentType(doc.customDocumentType || "")
      } else {
        setCustomDocumentType("")
      }
      setDocumentTitle(doc.title || "")
      setTone(doc.tone || "professional")
      setFormData({
        ...(doc.formData || doc),
        id: doc.id,
        createdAt: doc.createdAt,
        status: doc.status,
      })
      setEditingDocId(doc.id)
      setCurrentStep(3)
      sessionStorage.removeItem("modocs_edit_document")
    }
  }, [])

  // Now only save when user navigates away via the dialog

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current && formDataRef.current.status !== "completed") {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const saveInProgress = () => {
    const inProgressDoc = {
      ...formDataRef.current,
      title: documentTitleRef.current || "Untitled Document",
      documentType: documentTypeRef.current === "Other" ? customDocumentType : documentTypeRef.current,
      ...(documentTypeRef.current === "Other" ? { customDocumentType } : {}),
      tone,
      status: "In Progress",
      updatedAt: new Date().toISOString(),
      id: editingDocId || formDataRef.current.id || `doc-${Date.now()}`,
      createdAt: formDataRef.current.createdAt || new Date().toISOString(),
    }

    const existingDocs = localStorage.getItem("modocs_documents")
    const docs = existingDocs ? JSON.parse(existingDocs) : []

    const docId = inProgressDoc.id
    const existingIndex = docs.findIndex((d: any) => d.id === docId)

    if (existingIndex !== -1) {
      docs[existingIndex] = inProgressDoc
    } else {
      docs.push(inProgressDoc)
    }

    localStorage.setItem("modocs_documents", JSON.stringify(docs))
    window.dispatchEvent(new Event("storage"))
  }

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges && formData.status !== "completed") {
      setPendingNavigation(path)
      setShowUnsavedDialog(true)
    } else {
      router.push(path)
    }
  }

  const handleSaveAndLeave = () => {
    saveInProgress()
    setHasUnsavedChanges(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
  }

  const handleDiscardAndLeave = () => {
    setHasUnsavedChanges(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
  }

  const handleDocumentTypeChange = (type: DocumentType | "Other") => {
    setDocumentType(type)
    setErrors({}) // Clear errors when type changes
    setFormData((prev: any) => ({
      ...prev,
      documentType: type,
      id: editingDocId || prev.id || `doc-${Date.now()}`,
      createdAt: prev.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "Current User",
      status: "In Progress", // Set initial status
      tone,
    }))
    // If custom type is selected, clear it if it's not 'Other'
    if (type !== "Other") {
      setCustomDocumentType("")
    }
    setHasUnsavedChanges(true) // Mark as unsaved when type changes
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!documentType) {
        setErrors({ documentType: "Please select a document type" })
        toast({
          title: "Selection Required",
          description: "Please select a document type to continue",
          variant: "destructive",
        })
        return
      }
      if (documentType === "Other" && !customDocumentType.trim()) {
        setErrors({ customDocumentType: "Please enter a custom document type" })
        toast({
          title: "Type Required",
          description: "Please enter a custom document type",
          variant: "destructive",
        })
        return
      }
    }

    setErrors({})
    if (currentStep < 4) {
      // Changed from 3 to 4
      setCurrentStep(currentStep + 1)
      setShowPreview(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      if (showPreview) {
        setShowPreview(false)
      }
    }
  }

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {}

    if (!documentTitle?.trim()) {
      newErrors.documentTitle = "Document title is required"
      toast({
        title: "Validation Error",
        description: "Please enter a document title",
        variant: "destructive",
      })
    }

    // Type-specific validation
    if (documentType === "Invoice") {
      if (!formData.invoiceNumber?.trim()) newErrors.invoiceNumber = "Invoice number is required"
      if (!formData.clientInfo?.name?.trim()) newErrors.clientInfo = { name: "Client name is required" } as any // Corrected for nested field
      if (!formData.totalAmount || Number.parseFloat(formData.totalAmount) <= 0)
        newErrors.totalAmount = "Total amount must be greater than 0"
    } else if (documentType === "Contract") {
      if (!formData.partyA?.trim()) newErrors.partyA = "First party name is required"
      if (!formData.partyB?.trim()) newErrors.partyB = "Second party name is required"
      if (!formData.duration?.trim()) newErrors.duration = "Duration is required"
    } else if (documentType === "Business Letter") {
      if (!formData.recipientName?.trim()) newErrors.recipientName = "Recipient name is required"
      if (!formData.body?.trim() || formData.body.length < 10)
        newErrors.body = "Letter body must be at least 10 characters"
    } else if (documentType === "Memo") {
      if (!formData.to?.trim()) newErrors.to = "'To' field is required"
      if (!formData.subject?.trim()) newErrors.subject = "Subject is required"
      if (!formData.mainContent?.trim() || formData.mainContent.length < 10)
        newErrors.mainContent = "Content must be at least 10 characters"
    } else if (documentType === "Receipt") {
      if (!formData.receiptNumber?.trim()) newErrors.receiptNumber = "Receipt number is required"
      if (!formData.companyInfo?.name?.trim()) newErrors.companyInfo = { name: "Company name is required" } as any
      if (!formData.totalAmount || Number.parseFloat(formData.totalAmount) <= 0)
        newErrors.totalAmount = "Total amount must be greater than 0"
    } else if (documentType === "Other") {
      if (!formData.content?.trim() || formData.content.length < 10)
        newErrors.content = "Content must be at least 10 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsGenerating(false)
    setCurrentStep(4)
    setShowPreview(true)
    setHasUnsavedChanges(true)

    const timestamp = new Date().toISOString()
    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType

    const savedDoc = {
      id: formData.id || Date.now().toString(),
      documentType: finalDocumentType,
      customDocumentType: documentType === "Other" ? customDocumentType : undefined,
      title: documentTitle,
      status: "Completed",
      createdAt: formData.createdAt || timestamp,
      updatedAt: timestamp,
      tone,
      formData: documentType === "Other" ? { ...formData, customDocumentType } : formData,
    }

    const docs = JSON.parse(localStorage.getItem("modocs_documents") || "[]")
    const existingIndex = docs.findIndex((d: any) => d.id === savedDoc.id)
    if (existingIndex >= 0) {
      docs[existingIndex] = savedDoc
    } else {
      docs.push(savedDoc)
    }
    localStorage.setItem("modocs_documents", JSON.stringify(docs))
    window.dispatchEvent(new Event("storage"))

    toast({
      title: "Document Generated!",
      description: "Your document is ready for download",
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
    // Clear specific error if field is corrected
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    setHasUnsavedChanges(true)
  }

  const handleNestedInputChange = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev }
      let current = newData
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {}
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newData
    })
    const errorKey = path.join(".")
    // Clear specific error if field is corrected
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
    setHasUnsavedChanges(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | Record<string, any>> = {} // Allow nested errors

    // Title validation is already handled in handleNext, but good to have here too
    if (!documentTitle || documentTitle.trim() === "") {
      newErrors.documentTitle = "Document title is required"
    } else if (documentTitle.trim().length < 3) {
      newErrors.documentTitle = "Document title must be at least 3 characters"
    }

    if (documentType === "Other" && (!customDocumentType || customDocumentType.trim() === "")) {
      newErrors.customDocumentType = "Custom document type is required"
    }

    // Type-specific validation
    if (documentType === "Invoice") {
      if (!formData.invoiceNumber?.trim()) newErrors.invoiceNumber = "Invoice number is required"
      if (!formData.clientInfo?.name?.trim()) newErrors.clientInfo = { name: "Client name is required" } as any
      if (!formData.totalAmount || formData.totalAmount <= 0)
        newErrors.totalAmount = "Total amount must be greater than 0"
    } else if (documentType === "Contract") {
      if (!formData.contractTitle?.trim()) newErrors.contractTitle = "Contract title is required"
      if (!formData.partyA?.trim()) newErrors.partyA = "First party name is required"
      if (!formData.partyB?.trim()) newErrors.partyB = "Second party name is required"
      if (!formData.duration?.trim()) newErrors.duration = "Duration is required"
    } else if (documentType === "Business Letter") {
      if (!formData.recipientName?.trim()) newErrors.recipientName = "Recipient name is required"
      if (!formData.body?.trim() || formData.body.length < 10)
        newErrors.body = "Letter body must be at least 10 characters"
    } else if (documentType === "Memo") {
      if (!formData.to?.trim()) newErrors.to = "'To' field is required"
      if (!formData.subject?.trim()) newErrors.subject = "Subject is required"
      if (!formData.mainContent?.trim() || formData.mainContent.length < 10)
        newErrors.mainContent = "Content must be at least 10 characters"
    } else if (documentType === "Receipt") {
      if (!formData.receiptNumber?.trim()) newErrors.receiptNumber = "Receipt number is required"
      if (!formData.companyInfo?.name?.trim()) newErrors.companyInfo = { name: "Company name is required" } as any
      if (!formData.totalAmount || formData.totalAmount <= 0)
        newErrors.totalAmount = "Total amount must be greater than 0"
    } else if (documentType === "Other") {
      if (!formData.content?.trim() || formData.content.length < 10)
        newErrors.content = "Content must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!documentType) {
      setErrors({ documentType: "Document type is required" })
      toast({
        title: "Validation Error",
        description: "Please select a document type",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before saving",
        variant: "destructive",
      })
      return
    }

    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType

    const documentData = {
      ...formData,
      ...(documentType === "Other" ? { customDocumentType } : {}),
      documentType: finalDocumentType,
      title: documentTitle,
      tone,
      status: "Completed",
      updatedAt: new Date().toISOString(),
    }

    const existingDocs = localStorage.getItem("modocs_documents")
    const docs = existingDocs ? JSON.parse(existingDocs) : [] // Fixed JSON.JSON.parse typo

    if (editingDocId) {
      const index = docs.findIndex((d: any) => d.id === editingDocId)
      if (index !== -1) {
        docs[index] = documentData
      }
    } else {
      const existingIndex = docs.findIndex((d: any) => d.id === formData.id)
      if (existingIndex !== -1) {
        docs[existingIndex] = documentData
      } else {
        docs.push(documentData)
      }
    }

    localStorage.setItem("modocs_documents", JSON.stringify(docs))
    window.dispatchEvent(new Event("storage"))
    setHasUnsavedChanges(false)
    setShowSuccessMessage(true)
  }

  const handleDownloadJSON = () => {
    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType
    const safeTitle = documentTitle?.trim() ? documentTitle : "document"
    const documentData = {
      ...formData,
      ...(documentType === "Other" ? { customDocumentType } : {}),
      documentType: finalDocumentType,
      title: documentTitle,
      tone,
      status: "Completed",
      updatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(documentData, null, 2)], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${safeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "JSON Downloaded",
      description: "Your document has been downloaded as a text file",
    })
  }

  const handleDownloadAllJSON = () => {
    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType
    const currentDocument = {
      ...formData,
      ...(documentType === "Other" ? { customDocumentType } : {}),
      documentType: finalDocumentType,
      title: documentTitle,
      tone,
      status: "Completed",
      updatedAt: new Date().toISOString(),
    }

    // Get all documents from localStorage
    const storedDocs = localStorage.getItem("modocs_documents") // Corrected key name
    const allDocuments = storedDocs ? JSON.parse(storedDocs) : []

    // Combine all stored documents with current document
    const allDocumentsArray = [...allDocuments, currentDocument]

    const blob = new Blob([JSON.stringify(allDocumentsArray, null, 2)], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `all_documents_${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "All Documents Downloaded",
      description: `Downloaded ${allDocumentsArray.length} documents as JSON array`,
    })
  }

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById("document-preview-content")
      if (!element) {
        throw new Error("Preview element not found")
      }

      const safeTitle = documentTitle?.trim() ? documentTitle : "document"

      // Show loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your document...",
      })

      // Dynamically import libraries for client-side PDF generation
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      // Capture the element as canvas with higher quality
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      } as any)

      // Calculate dimensions for A4 page
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4")
      let position = 0

      // Add image to PDF (handle multiple pages if needed)
      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the PDF
      pdf.save(`${safeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`)

      toast({
        title: "PDF Downloaded",
        description: "Your document has been saved as PDF",
      })
    } catch (error: any) {
      console.error("PDF generation error:", error)
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderFormFields = () => {
    if (!documentType) return null

    switch (documentType) {
      case "Invoice":
        return (
          <InvoiceForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Purchase Order":
        return (
          <PurchaseOrderForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Contract":
        return <ContractForm data={formData} onChange={handleInputChange} errors={errors} />
      case "Business Letter":
        return <BusinessLetterForm data={formData} onChange={handleInputChange} errors={errors} />
      case "Memo":
        return <MemoForm data={formData} onChange={handleInputChange} errors={errors} />
      case "Report":
        return (
          <ReportForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Financial Statement":
        return (
          <FinancialStatementForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Work Order":
        return (
          <WorkOrderForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Proposal":
        return (
          <ProposalForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Receipt":
        return (
          <ReceiptForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
      case "Other":
        return <OtherForm data={formData} onChange={handleInputChange} errors={errors} />
      default:
        return null
    }
  }

  // Removed generateDocument function as it's not used and causes errors.
  // Downloads work directly with the DOM element via getElementById.

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border bg-card text-center">
          <CardContent className="pt-6 pb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Document Saved!</h2>
            <p className="text-muted-foreground mb-6">
              Your document has been successfully saved. You can view it in the Document Manager.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/modocs/view" className="w-full">
                <Button className="w-full gap-2">
                  <Eye className="h-4 w-4" />
                  See in Document Manager
                </Button>
              </Link>
              <Link href="/modocs/create" className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setShowSuccessMessage(false)
                    setDocumentType("")
                    setDocumentTitle("")
                    setCustomDocumentType("")
                    setTone("professional")
                    setFormData({})
                    setErrors({})
                    setEditingDocId(null)
                    setCurrentStep(1)
                    setShowPreview(false)
                  }}
                >
                  Create Another Document
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save your work?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save this document as "In Progress" before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardAndLeave}>Don't Save</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndLeave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navbar */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => handleNavigation("/modocs")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6" style={{ color: "#2663eb" }} />
                <h1 className="text-xl font-bold text-foreground">MoDocs</h1>
              </div>
            </button>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => handleNavigation("/modocs/view")}
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Manage Documents</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <StepIndicator currentStep={currentStep} />

      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-500 max-w-3xl">
        {currentStep < 4 ? (
          <div className="space-y-6">
            {/* Step 1: Select Type */}
            {currentStep === 1 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Select Document Type</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose the type of document you want to create
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Invoice",
                      "Purchase Order",
                      "Contract",
                      "Business Letter",
                      "Memo",
                      "Report",
                      "Financial Statement",
                      "Work Order",
                      "Proposal",
                      "Receipt",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDocumentTypeChange(type as DocumentType)}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                          documentType === type ? "border-primary bg-primary/5" : "border-border bg-card"
                        }`}
                      >
                        <FileText className="h-6 w-6 mb-2 text-primary mx-auto" />
                        <p className="text-sm font-medium text-center">{type}</p>
                      </button>
                    ))}
                    <button
                      onClick={() => handleDocumentTypeChange("Other")}
                      className={`p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                        documentType === "Other" ? "border-primary bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <FileText className="h-6 w-6 mb-2 text-primary mx-auto" />
                      <p className="text-sm font-medium text-center">Other</p>
                    </button>
                  </div>
                  {documentType === "Other" && (
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="customType" className="text-sm font-medium">
                        Enter Custom Document Type *
                      </Label>
                      <Input
                        id="customType"
                        value={customDocumentType}
                        onChange={(e) => {
                          setCustomDocumentType(e.target.value)
                          if (errors.customDocumentType) {
                            setErrors((prev) => {
                              const newErrors = { ...prev }
                              delete newErrors.customDocumentType
                              return newErrors
                            })
                          }
                        }}
                        placeholder="e.g., Policy Document, Meeting Minutes"
                        className={`mt-2 ${errors.customDocumentType ? "border-destructive" : ""}`}
                      />
                      {errors.customDocumentType && (
                        <p className="text-sm text-destructive mt-1">{errors.customDocumentType}</p>
                      )}
                    </div>
                  )}
                  {errors.documentType && <p className="text-sm text-destructive mt-2">{errors.documentType}</p>}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Tone */}
            {currentStep === 2 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Select Tone</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose how your document should sound
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "professional", label: "Professional", desc: "Formal and business-appropriate" },
                      { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
                      { value: "formal", label: "Formal", desc: "Traditional and elevated" },
                      { value: "casual", label: "Casual", desc: "Relaxed and conversational" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTone(option.value as any)
                          setHasUnsavedChanges(true)
                        }}
                        className={`p-4 border-2 transition-all hover:border-primary/50 rounded-lg text-center ${
                          tone === option.value ? "border-primary bg-primary/5" : "border-border bg-card"
                        }`}
                      >
                        <p className="font-semibold mb-1">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Fill Details */}
            {currentStep === 3 && (
              <>
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Document Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={documentTitle}
                      onChange={(e) => {
                        setDocumentTitle(e.target.value)
                        if (errors.documentTitle) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.documentTitle
                            return newErrors
                          })
                        }
                        setHasUnsavedChanges(true)
                      }}
                      placeholder="e.g., Q4 2024 Consulting Agreement"
                      className={errors.documentTitle ? "border-destructive" : ""}
                    />
                    {errors.documentTitle && <p className="text-sm text-destructive mt-1">{errors.documentTitle}</p>}
                  </CardContent>
                </Card>
                {renderFormFields()}

                <div className="flex justify-between gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="gap-2 bg-transparent">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleGenerate} className="gap-2 flex-1" size="lg" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {currentStep < 3 && (
              <div className="flex justify-between gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-foreground">
                  {documentTitle?.trim() ? documentTitle : "Untitled Document"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {(documentType === "Other" ? customDocumentType : documentType) || "Preview"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button onClick={handleBack} variant="outline" className="gap-2 bg-transparent sm:w-auto w-full">
                  <ChevronLeft className="h-4 w-4" />
                  Edit Details
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2 sm:w-auto w-full">
                      <Download className="h-4 w-4" />
                      Download
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#DC2626">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.5,16H14V19H12.5V16H11V14.5H12.5V13.5C12.5,12.1 13.6,11 15,11V12.5C14.5,12.5 14,13 14,13.5V14.5H15.5V16M6,20V4H13V9H18V20H6Z" />
                        </svg>
                      </div>
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadJSON} className="gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#F59E0B">
                          <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z" />
                        </svg>
                      </div>
                      Download as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadAllJSON} className="gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#10B981">
                          <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z" />
                        </svg>
                      </div>
                      Download as JSON (ALL)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div
              id="document-preview-content"
              className="bg-white dark:bg-white text-black rounded-lg min-h-[600px] p-6 sm:p-10 border-0"
            >
              <DocumentPreview
                formData={documentType === "Other" ? { ...formData, customDocumentType } : formData}
                documentType={documentType}
                documentTitle={documentTitle}
                tone={tone}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function InvoiceForm({ data, onChange, onNestedChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number *</Label>
              <Input
                value={data.invoiceNumber || ""}
                onChange={(e) => onChange("invoiceNumber", e.target.value)}
                placeholder="INV-2025-001"
                className={errors?.invoiceNumber ? "border-destructive" : ""}
              />
              {errors?.invoiceNumber && <p className="text-sm text-destructive mt-1">{errors.invoiceNumber}</p>}
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input
                type="date"
                value={data.invoiceDate || ""}
                onChange={(e) => onChange("invoiceDate", e.target.value)}
              />
            </div>
            <div>
              <Label>Total Amount *</Label>
              <Input
                type="number"
                value={data.totalAmount || ""}
                onChange={(e) => onChange("totalAmount", e.target.value ? Number.parseFloat(e.target.value) : "")}
                placeholder="10800.00"
                className={errors?.totalAmount ? "border-destructive" : ""}
              />
              {errors?.totalAmount && <p className="text-sm text-destructive mt-1">{errors.totalAmount}</p>}
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={data.dueDate || ""} onChange={(e) => onChange("dueDate", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Label>Client Name *</Label>
              <Input
                value={data.clientInfo?.name || ""}
                onChange={(e) => onNestedChange(["clientInfo", "name"], e.target.value)}
                placeholder="John Doe"
                className={errors?.clientInfo?.name ? "border-destructive" : ""}
              />
              {errors?.clientInfo?.name && <p className="text-sm text-destructive mt-1">{errors.clientInfo.name}</p>}
            </div>
            <div className="col-span-1 md:col-span-2">
              <Label>Client Address</Label>
              <Textarea
                value={data.clientInfo?.address || ""}
                onChange={(e) => onNestedChange(["clientInfo", "address"], e.target.value)}
                rows={2}
                placeholder="123 Main St, Anytown, USA 12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PurchaseOrderForm({ data, onChange, onNestedChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>PO Number</Label>
              <Input
                value={data.poNumber || ""}
                onChange={(e) => onChange("poNumber", e.target.value)}
                placeholder="PO-2025-001"
              />
            </div>
            <div>
              <Label>PO Date</Label>
              <Input type="date" value={data.poDate || ""} onChange={(e) => onChange("poDate", e.target.value)} />
            </div>
            <div>
              <Label>Delivery Date</Label>
              <Input
                type="date"
                value={data.deliveryDate || ""}
                onChange={(e) => onChange("deliveryDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buyer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company</Label>
            <Input
              value={data.buyerInfo?.company || ""}
              onChange={(e) => onNestedChange(["buyerInfo", "company"], e.target.value)}
              placeholder="ABC Manufacturing Inc"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={data.buyerInfo?.address || ""}
              onChange={(e) => onNestedChange(["buyerInfo", "address"], e.target.value)}
              rows={2}
              placeholder="123 Industrial Pkwy, City, State 12345"
            />
          </div>
          <div>
            <Label>Contact</Label>
            <Input
              value={data.buyerInfo?.contact || ""}
              onChange={(e) => onNestedChange(["buyerInfo", "contact"], e.target.value)}
              placeholder="John Doe, Procurement Manager"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company</Label>
            <Input
              value={data.supplierInfo?.company || ""}
              onChange={(e) => onNestedChange(["supplierInfo", "company"], e.target.value)}
              placeholder="XYZ Supplies Co"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={data.supplierInfo?.address || ""}
              onChange={(e) => onNestedChange(["supplierInfo", "address"], e.target.value)}
              rows={2}
              placeholder="456 Supply Rd, City, State 67890"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Total Amount</Label>
            <Input
              type="number"
              value={data.totalAmount || ""}
              onChange={(e) => onChange("totalAmount", e.target.value ? Number.parseFloat(e.target.value) : "")}
              placeholder="15000.00"
            />
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Textarea
              value={data.paymentTerms || ""}
              onChange={(e) => onChange("paymentTerms", e.target.value)}
              rows={2}
              placeholder="Net 30 days from delivery date"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ContractForm({ data, onChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Contract Title *</Label>
            <Input
              value={data.contractTitle || ""}
              onChange={(e) => onChange("contractTitle", e.target.value)}
              placeholder="Professional Services Agreement"
              className={errors?.contractTitle ? "border-destructive" : ""}
            />
            {errors?.contractTitle && <p className="text-sm text-destructive mt-1">{errors.contractTitle}</p>}
          </div>
          <div>
            <Label>Party A *</Label>
            <Input
              value={data.partyA || ""}
              onChange={(e) => onChange("partyA", e.target.value)}
              placeholder="ABC Corp"
              className={errors?.partyA ? "border-destructive" : ""}
            />
            {errors?.partyA && <p className="text-sm text-destructive mt-1">{errors.partyA}</p>}
          </div>
          <div>
            <Label>Party B *</Label>
            <Input
              value={data.partyB || ""}
              onChange={(e) => onChange("partyB", e.target.value)}
              placeholder="XYZ Ltd"
              className={errors?.partyB ? "border-destructive" : ""}
            />
            {errors?.partyB && <p className="text-sm text-destructive mt-1">{errors.partyB}</p>}
          </div>
          <div>
            <Label>Recitals *</Label>
            <Textarea
              value={data.recitals || ""}
              onChange={(e) => onChange("recitals", e.target.value)}
              rows={3}
              placeholder="WHEREAS, the parties wish to enter into an agreement..."
              className={errors?.recitals ? "border-destructive" : ""}
            />
            {errors?.recitals && <p className="text-sm text-destructive mt-1">{errors.recitals}</p>}
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Textarea
              value={data.paymentTerms || ""}
              onChange={(e) => onChange("paymentTerms", e.target.value)}
              rows={2}
              placeholder="Client shall pay $X per month for services rendered"
            />
          </div>
          <div>
            <Label>Duration *</Label>
            <Input
              value={data.duration || ""}
              onChange={(e) => onChange("duration", e.target.value)}
              placeholder="12 months from effective date"
              className={errors?.duration ? "border-destructive" : ""}
            />
            {errors?.duration && <p className="text-sm text-destructive mt-1">{errors.duration}</p>}
          </div>
          <div>
            <Label>Termination Clause</Label>
            <Textarea
              value={data.terminationClause || ""}
              onChange={(e) => onChange("terminationClause", e.target.value)}
              rows={2}
              placeholder="Either party may terminate with 30 days written notice"
            />
          </div>
          <div>
            <Label>Governing Law</Label>
            <Input
              value={data.governingLaw || ""}
              onChange={(e) => onChange("governingLaw", e.target.value)}
              placeholder="State of California"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BusinessLetterForm({ data, onChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Letter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sender Address</Label>
            <Textarea
              value={data.senderAddress || ""}
              onChange={(e) => onChange("senderAddress", e.target.value)}
              rows={3}
              placeholder="Your Company Name&#10;123 Business St&#10;City, State 12345"
            />
          </div>
          <div>
            <Label>Recipient Name *</Label>
            <Input
              value={data.recipientName || ""}
              onChange={(e) => onChange("recipientName", e.target.value)}
              placeholder="Jane Doe"
              className={errors?.recipientName ? "border-destructive" : ""}
            />
            {errors?.recipientName && <p className="text-sm text-destructive mt-1">{errors.recipientName}</p>}
          </div>
          <div>
            <Label>Recipient Title</Label>
            <Input
              value={data.recipientTitle || ""}
              onChange={(e) => onChange("recipientTitle", e.target.value)}
              placeholder="Senior Manager"
            />
          </div>
          <div>
            <Label>Recipient Company</Label>
            <Input
              value={data.recipientCompany || ""}
              onChange={(e) => onChange("recipientCompany", e.target.value)}
              placeholder="Target Company Inc."
            />
          </div>
          <div>
            <Label>Recipient Address</Label>
            <Textarea
              value={data.recipientAddress || ""}
              onChange={(e) => onChange("recipientAddress", e.target.value)}
              rows={3}
              placeholder="456 Corporate Avenue&#10;City, State 12345"
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              value={data.date || ""}
              onChange={(e) => onChange("date", e.target.value)}
              placeholder="November 6, 2025"
            />
          </div>
          <div>
            <Label>Salutation</Label>
            <Input
              value={data.salutation || ""}
              onChange={(e) => onChange("salutation", e.target.value)}
              placeholder="Dear Mr./Ms. [Last Name],"
            />
          </div>
          <div>
            <Label>Subject</Label>
            <Input
              value={data.subject || ""}
              onChange={(e) => onChange("subject", e.target.value)}
              placeholder="Re: Business Proposal"
            />
          </div>
          <div>
            <Label>Body *</Label>
            <Textarea
              value={data.body || ""}
              onChange={(e) => onChange("body", e.target.value)}
              rows={8}
              placeholder="Write the main content of your letter here..."
              className={errors?.body ? "border-destructive" : ""}
            />
            {errors?.body && <p className="text-sm text-destructive mt-1">{errors.body}</p>}
          </div>
          <div>
            <Label>Closing</Label>
            <Input
              value={data.closing || ""}
              onChange={(e) => onChange("closing", e.target.value)}
              placeholder="Sincerely,"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Sender Name</Label>
              <Input
                value={data.senderName || ""}
                onChange={(e) => onChange("senderName", e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <Label>Sender Title</Label>
              <Input
                value={data.senderTitle || ""}
                onChange={(e) => onChange("senderTitle", e.target.value)}
                placeholder="Chief Executive Officer"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MemoForm({ data, onChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Memo Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>To *</Label>
              <Input
                value={data.to || ""}
                onChange={(e) => onChange("to", e.target.value)}
                placeholder="All Staff"
                className={errors?.to ? "border-destructive" : ""}
              />
              {errors?.to && <p className="text-sm text-destructive mt-1">{errors.to}</p>}
            </div>
            <div>
              <Label>From</Label>
              <Input
                value={data.from || ""}
                onChange={(e) => onChange("from", e.target.value)}
                placeholder="Management"
              />
            </div>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              value={data.date || ""}
              onChange={(e) => onChange("date", e.target.value)}
              placeholder="November 6, 2025"
            />
          </div>
          <div>
            <Label>Subject *</Label>
            <Input
              value={data.subject || ""}
              onChange={(e) => onChange("subject", e.target.value)}
              placeholder="Important Update"
              className={errors?.subject ? "border-destructive" : ""}
            />
            {errors?.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
          </div>
          <div>
            <Label>Purpose</Label>
            <Textarea
              value={data.purpose || ""}
              onChange={(e) => onChange("purpose", e.target.value)}
              rows={2}
              placeholder="The purpose of this memo is to..."
            />
          </div>
          <div>
            <Label>Main Content *</Label>
            <Textarea
              value={data.mainContent || ""}
              onChange={(e) => onChange("mainContent", e.target.value)}
              rows={6}
              placeholder="Write the main content of your memo here..."
              className={errors?.mainContent ? "border-destructive" : ""}
            />
            {errors?.mainContent && <p className="text-sm text-destructive mt-1">{errors.mainContent}</p>}
          </div>
          <div>
            <Label>Closing Remarks</Label>
            <Textarea
              value={data.closingRemarks || ""}
              onChange={(e) => onChange("closingRemarks", e.target.value)}
              rows={2}
              placeholder="Thank you for your attention to this matter."
            />
          </div>
          <div>
            <Label>CC</Label>
            <Input
              value={data.cc || ""}
              onChange={(e) => onChange("cc", e.target.value)}
              placeholder="Department Heads"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportForm({ data, onChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Report Title</Label>
            <Input
              value={data.reportTitle || ""}
              onChange={(e) => onChange("reportTitle", e.target.value)}
              placeholder="Q4 2024 Financial Analysis"
            />
          </div>
          <div>
            <Label>Executive Summary</Label>
            <Textarea
              value={data.executiveSummary || ""}
              onChange={(e) => onChange("executiveSummary", e.target.value)}
              rows={4}
              placeholder="Provide a brief overview of the key findings and recommendations..."
            />
          </div>
          <div>
            <Label>Introduction</Label>
            <Textarea
              value={data.introduction || ""}
              onChange={(e) => onChange("introduction", e.target.value)}
              rows={3}
              placeholder="Introduce the purpose and scope of this report..."
            />
          </div>
          <div>
            <Label>Methodology</Label>
            <Textarea
              value={data.methodology || ""}
              onChange={(e) => onChange("methodology", e.target.value)}
              rows={3}
              placeholder="Describe the research methods and data collection processes..."
            />
          </div>
          <div>
            <Label>Conclusions</Label>
            <Textarea
              value={data.conclusions || ""}
              onChange={(e) => onChange("conclusions", e.target.value)}
              rows={4}
              placeholder="Summarize the findings and provide recommendations..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FinancialStatementForm({ data, onChange, onNestedChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Statement Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={data.companyInfo?.name || ""}
              onChange={(e) => onNestedChange(["companyInfo", "name"], e.target.value)}
              placeholder="ABC Corporation"
            />
          </div>
          <div>
            <Label>Reporting Period</Label>
            <Input
              value={data.companyInfo?.reportingPeriod || ""}
              onChange={(e) => onNestedChange(["companyInfo", "reportingPeriod"], e.target.value)}
              placeholder="Q4 2024"
            />
          </div>
          <div>
            <Label>Net Income</Label>
            <Input
              type="number"
              value={data.incomeStatement?.netIncome || ""}
              onChange={(e) =>
                onNestedChange(
                  ["incomeStatement", "netIncome"],
                  e.target.value ? Number.parseFloat(e.target.value) : "",
                )
              }
              placeholder="250000.00"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={data.notes || ""}
              onChange={(e) => onChange("notes", e.target.value)}
              rows={3}
              placeholder="Additional notes about the financial statement..."
            />
          </div>
          <div>
            <Label>Preparer</Label>
            <Input
              value={data.preparer || ""}
              onChange={(e) => onChange("preparer", e.target.value)}
              placeholder="Jane Smith, CPA"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function WorkOrderForm({ data, onChange, onNestedChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Work Order Number</Label>
              <Input
                value={data.workOrderNumber || ""}
                onChange={(e) => onChange("workOrderNumber", e.target.value)}
                placeholder="WO-2025-0001"
              />
            </div>
            <div>
              <Label>Work Order Date</Label>
              <Input
                type="date"
                value={data.workOrderDate || ""}
                onChange={(e) => onChange("workOrderDate", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Client Name</Label>
            <Input
              value={data.clientInfo?.name || ""}
              onChange={(e) => onNestedChange(["clientInfo", "name"], e.target.value)}
              placeholder="ABC Manufacturing"
            />
          </div>
          <div>
            <Label>Work Description</Label>
            <Textarea
              value={data.workDescription || ""}
              onChange={(e) => onChange("workDescription", e.target.value)}
              rows={4}
              placeholder="Describe the work to be performed..."
            />
          </div>
          <div>
            <Label>Estimated Completion Date</Label>
            <Input
              type="date"
              value={data.estimatedCompletionDate || ""}
              onChange={(e) => onChange("estimatedCompletionDate", e.target.value)}
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={data.priority || ""} onValueChange={(value) => onChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProposalForm({ data, onChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proposal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Proposal Title</Label>
            <Input
              value={data.proposalTitle || ""}
              onChange={(e) => onChange("proposalTitle", e.target.value)}
              placeholder="Digital Marketing Campaign"
            />
          </div>
          <div>
            <Label>Cover Letter</Label>
            <Textarea
              value={data.coverLetter || ""}
              onChange={(e) => onChange("coverLetter", e.target.value)}
              rows={3}
              placeholder="Dear [Client Name], we are pleased to submit this proposal..."
            />
          </div>
          <div>
            <Label>Introduction</Label>
            <Textarea
              value={data.introduction || ""}
              onChange={(e) => onChange("introduction", e.target.value)}
              rows={3}
              placeholder="Introduce your company and the purpose of the proposal..."
            />
          </div>
          <div>
            <Label>Background</Label>
            <Textarea
              value={data.background || ""}
              onChange={(e) => onChange("background", e.target.value)}
              rows={3}
              placeholder="Provide context and background information..."
            />
          </div>
          <div>
            <Label>Proposed Solution</Label>
            <Textarea
              value={data.proposedSolution || ""}
              onChange={(e) => onChange("proposedSolution", e.target.value)}
              rows={4}
              placeholder="Describe your proposed solution and approach..."
            />
          </div>
          <div>
            <Label>Total Cost</Label>
            <Input
              type="number"
              value={data.totalCost || ""}
              onChange={(e) => onChange("totalCost", e.target.value ? Number.parseFloat(e.target.value) : "")}
              placeholder="50000.00"
            />
          </div>
          <div>
            <Label>Terms and Conditions</Label>
            <Textarea
              value={data.termsAndConditions || ""}
              onChange={(e) => onChange("termsAndConditions", e.target.value)}
              rows={3}
              placeholder="Outline the terms and conditions of the proposal..."
            />
          </div>
          <div>
            <Label>Conclusion</Label>
            <Textarea
              value={data.conclusion || ""}
              onChange={(e) => onChange("conclusion", e.target.value)}
              rows={2}
              placeholder="Thank you for considering our proposal..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReceiptForm({ data, onChange, onNestedChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Receipt Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Receipt Number</Label>
              <Input
                value={data.receiptNumber || ""}
                onChange={(e) => onChange("receiptNumber", e.target.value)}
                placeholder="REC-2025-00001"
              />
            </div>
            <div>
              <Label>Receipt Date</Label>
              <Input
                type="date"
                value={data.receiptDate || ""}
                onChange={(e) => onChange("receiptDate", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Company Name</Label>
            <Input
              value={data.companyInfo?.name || ""}
              onChange={(e) => onNestedChange(["companyInfo", "name"], e.target.value)}
              placeholder="Tech Retailers Inc"
            />
          </div>
          <div>
            <Label>Customer Name</Label>
            <Input
              value={data.customerInfo?.name || ""}
              onChange={(e) => onNestedChange(["customerInfo", "name"], e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label>Customer Email</Label>
            <Input
              value={data.customerInfo?.email || ""}
              onChange={(e) => onNestedChange(["customerInfo", "email"], e.target.value)}
              placeholder="john.doe@email.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Subtotal</Label>
              <Input
                type="number"
                value={data.subtotal || ""}
                onChange={(e) => onChange("subtotal", e.target.value ? Number.parseFloat(e.target.value) : "")}
                placeholder="1000.00"
              />
            </div>
            <div>
              <Label>Tax Amount</Label>
              <Input
                type="number"
                value={data.taxAmount || ""}
                onChange={(e) => onChange("taxAmount", e.target.value ? Number.parseFloat(e.target.value) : "")}
                placeholder="80.00"
              />
            </div>
            <div>
              <Label>Total Amount</Label>
              <Input
                type="number"
                value={data.totalAmount || ""}
                onChange={(e) => onChange("totalAmount", e.target.value ? Number.parseFloat(e.target.value) : "")}
                placeholder="1080.00"
              />
            </div>
          </div>
          <div>
            <Label>Payment Method</Label>
            <Input
              value={data.paymentMethod || ""}
              onChange={(e) => onChange("paymentMethod", e.target.value)}
              placeholder="Credit Card (Visa ending in 1234)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OtherForm({ data, onChange, errors }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Category</Label>
            <Input
              value={data.category || ""}
              onChange={(e) => onChange("category", e.target.value)}
              placeholder="e.g., Policy Document, Meeting Minutes, etc."
            />
          </div>
          <div>
            <Label>Summary</Label>
            <Textarea
              value={data.summary || ""}
              onChange={(e) => onChange("summary", e.target.value)}
              rows={2}
              placeholder="Brief summary of the document..."
            />
          </div>
          <div>
            <Label>Content *</Label>
            <Textarea
              value={data.content || ""}
              onChange={(e) => onChange("content", e.target.value)}
              rows={10}
              placeholder="Enter the main content of your document here..."
              className={errors?.content ? "border-destructive" : ""}
            />
            {errors?.content && <p className="text-sm text-destructive mt-1">{errors.content}</p>}
          </div>
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              value={data.additionalNotes || ""}
              onChange={(e) => onChange("additionalNotes", e.target.value)}
              rows={3}
              placeholder="Any additional information or notes..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
