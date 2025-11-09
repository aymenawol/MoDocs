"use client"

import { useState, useEffect } from "react"
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
    { number: 4, label: "Generate" },
  ]

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4 mb-8">
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
  const generatePreviewContent = () => {
    const toneDescriptions = {
      professional:
        "This document maintains a formal, business-appropriate tone with precise language and structured formatting.",
      friendly: "This document uses a warm, approachable tone while maintaining professionalism and clarity.",
      formal:
        "This document follows strict formal conventions with elevated language and traditional business etiquette.",
      casual: "This document takes a relaxed, conversational approach while conveying all necessary information.",
    }

    if (documentType === "Invoice") {
      return (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center pb-4 border-b-2 border-gray-200">
            <h1 className="text-4xl font-bold text-primary mb-2">{documentTitle}</h1>
            <p className="text-sm text-gray-600">Invoice #{formData.invoiceNumber || "INV-001"}</p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm text-gray-500 mb-2">BILL TO</h3>
              <p className="font-semibold text-lg">{formData.clientInfo?.name || "Client Name"}</p>
              <p className="text-sm text-gray-600">{formData.clientInfo?.address || "Client Address"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
              <div>
                <span className="text-sm text-gray-500">Invoice Date:</span>
                <p className="font-medium">{formData.invoiceDate || "YYYY-MM-DD"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Due Date:</span>
                <p className="font-medium">{formData.dueDate || "YYYY-MM-DD"}</p>
              </div>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total Amount Due</span>
                <span className="text-3xl font-bold text-primary">${formData.totalAmount || "0.00"}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">DOCUMENT TONE</p>
              <p className="italic text-gray-700">{toneDescriptions[tone as keyof typeof toneDescriptions]}</p>
            </div>
          </div>
        </div>
      )
    } else if (documentType === "Contract") {
      return (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center pb-4 border-b-2 border-gray-200">
            <h1 className="text-4xl font-bold text-primary mb-2">{documentTitle}</h1>
            <p className="text-sm text-gray-600 uppercase tracking-wide">{formData.contractTitle || "Agreement"}</p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-primary">RECITALS</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {formData.recitals ||
                  "This agreement sets forth the terms and conditions between the parties herein..."}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-primary">DURATION & TERM</h3>
              <p className="text-sm text-gray-700">
                {formData.duration || "12 months from the effective date of this agreement"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-primary">PAYMENT TERMS</h3>
              <p className="text-sm text-gray-700">
                {formData.paymentTerms ||
                  "As mutually agreed upon by both parties in accordance with the terms outlined herein"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-primary">TERMINATION</h3>
              <p className="text-sm text-gray-700">
                {formData.terminationClause ||
                  "Either party may terminate this agreement with written notice as specified"}
              </p>
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-md text-sm border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">DOCUMENT TONE</p>
              <p className="italic text-gray-700">{toneDescriptions[tone as keyof typeof toneDescriptions]}</p>
            </div>
          </div>
        </div>
      )
    } else {
      // Generic preview for other document types
      return (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center pb-4 border-b-2 border-gray-200">
            <h1 className="text-4xl font-bold text-primary mb-2">{documentTitle}</h1>
            <p className="text-sm text-gray-600 uppercase tracking-wide">{documentType}</p>
          </div>
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              This is your finalized {documentType.toLowerCase()} with a {tone} tone applied throughout the document.
              All the details you've entered have been formatted professionally and are ready for use.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData)
                .filter(
                  ([key]) =>
                    !["documentType", "id", "createdAt", "updatedAt", "author", "status", "title", "tone"].includes(
                      key,
                    ),
                )
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="font-semibold text-gray-800 truncate">{String(value)}</p>
                  </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-md text-sm border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">DOCUMENT TONE</p>
              <p className="italic text-gray-700">{toneDescriptions[tone as keyof typeof toneDescriptions]}</p>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Final Document
        </h3>
        <div className="text-xs text-gray-500 bg-primary/10 px-3 py-1 rounded-full">AI Generated</div>
      </div>
      <div className="flex-1 overflow-auto">{generatePreviewContent()}</div>
    </div>
  )
}

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [editingDocId, setEditingDocId] = useState<string | null>(null)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Removed step indicator logic from useEffects
  // useEffect(() => {
  //   const newCompletedSteps = new Set<number>()

  //   if (documentType) {
  //     newCompletedSteps.add(1)
  //     if (documentTitle && documentTitle.trim().length >= 3) {
  //       newCompletedSteps.add(2)

  //       // Check if details are filled
  //       const hasDetails = Object.keys(formData).some((key) => {
  //         if (["documentType", "id", "createdAt", "updatedAt", "author", "status"].includes(key)) return false
  //         return formData[key] && formData[key] !== ""
  //       })

  //       if (hasDetails) {
  //         newCompletedSteps.add(3)
  //       }
  //     }
  //   }

  //   setCompletedSteps(newCompletedSteps)

  //   // Auto-advance current step
  //   if (!documentType) {
  //     setCurrentStep(1)
  //   } else if (!documentTitle || documentTitle.trim().length < 3) {
  //     setCurrentStep(2)
  //   } else if (newCompletedSteps.has(3)) {
  //     setCurrentStep(4)
  //   } else {
  //     setCurrentStep(3)
  //   }
  // }, [documentType, documentTitle, formData])

  useEffect(() => {
    const editId = searchParams.get("edit")
    if (editId) {
      const stored = localStorage.getItem("modocs_documents")
      if (stored) {
        const docs = JSON.parse(stored)
        const doc = docs.find((d: any) => d.id === editId)
        if (doc) {
          setDocumentType(doc.documentType)
          if (doc.documentType === "Other") {
            setCustomDocumentType(doc.customDocumentType || "")
          }
          setDocumentTitle(doc.title || "")
          setTone(doc.tone || "professional")
          setFormData(doc)
          setEditingDocId(doc.id)
          // Navigate to step 3 (Fill in Details)
          setCurrentStep(3)
        }
      }
    }
  }, [searchParams])

  useEffect(() => {
    const docToEdit = sessionStorage.getItem("modocs_edit_document")
    if (docToEdit) {
      const doc = JSON.parse(docToEdit)
      setDocumentType(doc.documentType)
      if (doc.documentType === "Other") {
        setCustomDocumentType(doc.customDocumentType || "")
      }
      setDocumentTitle(doc.title || "")
      setTone(doc.tone || "professional")
      setFormData(doc)
      setEditingDocId(doc.id)
      setCurrentStep(3)
      sessionStorage.removeItem("modocs_edit_document")
    }
  }, [])

  useEffect(() => {
    if (documentType && (documentTitle || Object.keys(formData).length > 4)) {
      setHasUnsavedChanges(true)
    }
  }, [documentType, documentTitle, formData])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && formData.status !== "completed") {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, formData.status])

  useEffect(() => {
    if (!documentType) return

    const saveInProgress = () => {
      const hasContent =
        documentTitle ||
        Object.keys(formData).some((key) => {
          if (["documentType", "id", "createdAt", "updatedAt", "author", "status", "tone"].includes(key)) return false
          return formData[key] && formData[key] !== ""
        })

      if (!hasContent) return

      const inProgressDoc = {
        ...formData,
        title: documentTitle || "Untitled Document",
        tone,
        status: "in-progress",
        updatedAt: new Date().toISOString(),
      }

      const existingDocs = localStorage.getItem("modocs_documents")
      const docs = existingDocs ? JSON.parse(existingDocs) : []

      if (editingDocId) {
        const index = docs.findIndex((d: any) => d.id === editingDocId)
        if (index !== -1) {
          docs[index] = inProgressDoc
        }
      } else if (formData.id) {
        const index = docs.findIndex((d: any) => d.id === formData.id)
        if (index !== -1) {
          docs[index] = inProgressDoc
        } else {
          docs.push(inProgressDoc)
        }
      }

      localStorage.setItem("modocs_documents", JSON.stringify(docs))
      window.dispatchEvent(new Event("storage"))
    }

    const debounceTimer = setTimeout(saveInProgress, 1000)
    return () => clearTimeout(debounceTimer)
  }, [documentTitle, formData, documentType, editingDocId, tone])

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges && formData.status !== "completed") {
      setPendingNavigation(path)
      setShowUnsavedDialog(true)
    } else {
      router.push(path)
    }
  }

  const handleSaveAndLeave = () => {
    const inProgressDoc = {
      ...formData,
      title: documentTitle || "Untitled Document",
      tone,
      status: "In Progress",
      updatedAt: new Date().toISOString(),
    }

    const existingDocs = localStorage.getItem("modocs_documents")
    const docs = existingDocs ? JSON.parse(existingDocs) : []

    if (editingDocId) {
      const index = docs.findIndex((d: any) => d.id === editingDocId)
      if (index !== -1) {
        docs[index] = inProgressDoc
      }
    } else {
      const existingIndex = docs.findIndex((d: any) => d.id === formData.id)
      if (existingIndex !== -1) {
        docs[existingIndex] = inProgressDoc
      } else {
        docs.push(inProgressDoc)
      }
    }

    localStorage.setItem("modocs_documents", JSON.JSON.stringify(docs))
    window.dispatchEvent(new Event("storage"))

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
    setFormData({
      documentType: type,
      id: editingDocId || `doc-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "Current User",
      status: "in-progress",
      tone,
    })
    // If custom type is selected, clear it if it's not 'Other'
    if (type !== "Other") {
      setCustomDocumentType("")
    }
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

    if (currentStep === 3) {
      if (!documentTitle.trim()) {
        setErrors({ documentTitle: "Document title is required" })
        toast({
          title: "Title Required",
          description: "Please enter a document title",
          variant: "destructive",
        })
        return
      }
      if (documentTitle.trim().length < 3) {
        setErrors({ documentTitle: "Document title must be at least 3 characters" })
        toast({
          title: "Title Too Short",
          description: "Document title must be at least 3 characters",
          variant: "destructive",
        })
        return
      }
      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly",
          variant: "destructive",
        })
        return
      }
    }

    setErrors({})
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
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

  const handleGenerate = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before generating",
        variant: "destructive",
      })
      return
    }

    setShowPreview(true)
    toast({
      title: "Document Generated!",
      description: "Your document preview is now available",
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
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

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
      if (!formData.totalAmount || formData.totalAmount <= 0)
        newErrors.totalAmount = "Total amount must be greater than 0"
    } else if (documentType === "Contract") {
      if (!formData.contractTitle?.trim()) newErrors.contractTitle = "Contract title is required"
      if (!formData.duration?.trim()) newErrors.duration = "Duration is required"
    } else if (documentType === "Business Letter") {
      if (!formData.recipientAddress?.trim()) newErrors.recipientAddress = "Recipient address is required"
      if (!formData.body?.trim()) newErrors.body = "Letter body is required"
    } else if (documentType === "Memo") {
      if (!formData.to?.trim()) newErrors.to = "'To' field is required"
      if (!formData.subject?.trim()) newErrors.subject = "Subject is required"
      if (!formData.mainContent?.trim()) newErrors.mainContent = "Main content is required"
    } else if (documentType === "Other") {
      if (!formData.content?.trim()) newErrors.content = "Content is required"
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
      documentType: finalDocumentType,
      title: documentTitle,
      tone,
      status: "Completed",
      updatedAt: new Date().toISOString(),
    }

    const existingDocs = localStorage.getItem("modocs_documents")
    const docs = existingDocs ? JSON.JSON.parse(existingDocs) : []

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

    localStorage.setItem("modocs_documents", JSON.JSON.stringify(docs))
    window.dispatchEvent(new Event("storage"))
    setHasUnsavedChanges(false)
    setShowSuccessMessage(true)
  }

  const handleDownloadJSON = () => {
    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType
    const documentData = {
      ...formData,
      documentType: finalDocumentType,
      title: documentTitle,
      tone,
      status: "Completed",
      updatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(documentData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "JSON Downloaded",
      description: "Your document has been downloaded as JSON",
    })
  }

  const handleDownloadPDF = () => {
    // Note: This creates a simple HTML representation for PDF printing
    const printWindow = window.open("", "", "height=800,width=800")
    if (!printWindow) return

    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
            }
            h1 {
              color: #2663eb;
              border-bottom: 3px solid #2663eb;
              padding-bottom: 10px;
            }
            .meta {
              color: #666;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .section {
              margin: 20px 0;
            }
            .label {
              font-weight: bold;
              color: #333;
            }
          </style>
        </head>
        <body>
          <h1>${documentTitle}</h1>
          <div class="meta">Document Type: ${finalDocumentType} | Tone: ${tone}</div>
          ${Object.entries(formData)
            .filter(
              ([key]) =>
                !["documentType", "id", "createdAt", "updatedAt", "author", "status", "title", "tone"].includes(key),
            )
            .map(
              ([key, value]) => `
              <div class="section">
                <span class="label">${key.replace(/([A-Z])/g, " $1").trim()}:</span>
                <span>${value}</span>
              </div>
            `,
            )
            .join("")}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)

    toast({
      title: "PDF Ready",
      description: "Opening print dialog for PDF save",
    })
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
              Your document has been successfully saved and downloaded as output.json
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
              <button onClick={() => handleNavigation("/modocs/view")}>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Manage Documents</span>
                </Button>
              </button>
              {showPreview && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadJSON}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {showPreview && (
                <Button onClick={handleSave} className="gap-2" variant="default">
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Document</span>
                  <span className="sm:hidden">Save</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Main Content */}
      <section
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-500 ${showPreview ? "max-w-7xl" : "max-w-3xl"}`}
      >
        {!showPreview ? (
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
                        onClick={() => setTone(option.value as any)}
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
                      }}
                      placeholder="e.g., Q4 2024 Consulting Agreement"
                      className={errors.documentTitle ? "border-destructive" : ""}
                    />
                    {errors.documentTitle && <p className="text-sm text-destructive mt-1">{errors.documentTitle}</p>}
                  </CardContent>
                </Card>
                {renderFormFields()}
              </>
            )}

            {/* Step 4: Generate */}
            {currentStep === 4 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Ready to Generate</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Click generate to create your {documentType} with a {tone} tone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Document Summary</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Type:</dt>
                          <dd className="font-medium">
                            {documentType === "Other" ? customDocumentType : documentType}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Title:</dt>
                          <dd className="font-medium">{documentTitle}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Tone:</dt>
                          <dd className="font-medium capitalize">{tone}</dd>
                        </div>
                      </dl>
                    </div>
                    <Button onClick={handleGenerate} className="w-full gap-2" size="lg">
                      <Sparkles className="h-5 w-5" />
                      Generate Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
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
              {currentStep < 4 && (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
              <DocumentPreview
                formData={formData}
                documentType={documentType === "Other" ? customDocumentType : documentType}
                documentTitle={documentTitle}
                tone={tone}
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(false)
                  setCurrentStep(3)
                }}
                className="gap-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Edit
              </Button>
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
            <Label>Recipient Address *</Label>
            <Textarea
              value={data.recipientAddress || ""}
              onChange={(e) => onChange("recipientAddress", e.target.value)}
              rows={3}
              placeholder="Recipient Name&#10;456 Client Ave&#10;City, State 67890"
              className={errors?.recipientAddress ? "border-destructive" : ""}
            />
            {errors?.recipientAddress && <p className="text-sm text-destructive mt-1">{errors.recipientAddress}</p>}
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
