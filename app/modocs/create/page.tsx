"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { FileText, ArrowLeft, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DocumentType } from "@/lib/document-types"

export default function CreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [documentType, setDocumentType] = useState<DocumentType | "Other" | "">("")
  const [customDocumentType, setCustomDocumentType] = useState("")
  const [documentTitle, setDocumentTitle] = useState("")
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [editingDocId, setEditingDocId] = useState<string | null>(null)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const docToEdit = sessionStorage.getItem("modocs_edit_document")
    if (docToEdit) {
      const doc = JSON.parse(docToEdit)
      setDocumentType(doc.documentType)
      setDocumentTitle(doc.title || "")
      setFormData(doc)
      setEditingDocId(doc.id)
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
          if (["documentType", "id", "createdAt", "updatedAt", "author", "status"].includes(key)) return false
          return formData[key] && formData[key] !== ""
        })

      if (!hasContent) return

      const inProgressDoc = {
        ...formData,
        title: documentTitle || "Untitled Document",
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
  }, [documentTitle, formData, documentType, editingDocId])

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
    } else {
      const existingIndex = docs.findIndex((d: any) => d.id === formData.id)
      if (existingIndex !== -1) {
        docs[existingIndex] = inProgressDoc
      } else {
        docs.push(inProgressDoc)
      }
    }

    localStorage.setItem("modocs_documents", JSON.stringify(docs))
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
    setDocumentTitle("")
    setCustomDocumentType("")
    setErrors({})
    setFormData({
      documentType: type,
      id: editingDocId || `doc-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "Current User",
      status: "in-progress",
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
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

    // Validate document title
    if (!documentTitle || documentTitle.trim() === "") {
      newErrors.documentTitle = "Document title is required"
    } else if (documentTitle.trim().length < 3) {
      newErrors.documentTitle = "Document title must be at least 3 characters"
    } else if (documentTitle.length > 100) {
      newErrors.documentTitle = "Document title must be less than 100 characters"
    }

    if (documentType === "Other") {
      if (!customDocumentType || customDocumentType.trim() === "") {
        newErrors.customDocumentType = "Document type is required"
      }
      if (!formData.content || formData.content.trim() === "" || formData.content.trim().length < 10) {
        newErrors.content = "Content must be at least 10 characters"
      }
    }

    // Type-specific validation
    if (documentType === "Invoice") {
      if (!formData.invoiceNumber || formData.invoiceNumber.trim() === "") {
        newErrors.invoiceNumber = "Invoice number is required"
      }
      if (!formData.invoiceDate || formData.invoiceDate.trim() === "") {
        newErrors.invoiceDate = "Invoice date is required"
      }
      if (!formData.companyInfo?.name || formData.companyInfo.name.trim() === "") {
        newErrors["companyInfo.name"] = "Company name is required"
      }
      if (!formData.clientInfo?.name || formData.clientInfo.name.trim() === "") {
        newErrors["clientInfo.name"] = "Client name is required"
      }
      if (!formData.totalAmount || formData.totalAmount <= 0) {
        newErrors.totalAmount = "Total amount must be greater than 0"
      }
    } else if (documentType === "Contract") {
      if (!formData.contractTitle || formData.contractTitle.trim() === "") {
        newErrors.contractTitle = "Contract title is required"
      }
      if (!formData.recitals || formData.recitals.trim() === "" || formData.recitals.trim().length < 10) {
        newErrors.recitals = "Recitals must be at least 10 characters"
      }
      if (!formData.duration || formData.duration.trim() === "") {
        newErrors.duration = "Duration is required"
      }
    } else if (documentType === "Business Letter") {
      if (!formData.recipientAddress || formData.recipientAddress.trim() === "") {
        newErrors.recipientAddress = "Recipient address is required"
      }
      if (!formData.body || formData.body.trim() === "" || formData.body.trim().length < 10) {
        newErrors.body = "Letter body must be at least 10 characters"
      }
    } else if (documentType === "Memo") {
      if (!formData.to || formData.to.trim() === "") {
        newErrors.to = "Recipient is required"
      }
      if (!formData.subject || formData.subject.trim() === "") {
        newErrors.subject = "Subject is required"
      }
      if (!formData.mainContent || formData.mainContent.trim() === "" || formData.mainContent.trim().length < 10) {
        newErrors.mainContent = "Main content must be at least 10 characters"
      }
    } else if (documentType === "Other") {
      if (!formData.content || formData.content.trim() === "" || formData.content.trim().length < 10) {
        newErrors.content = "Content must be at least 10 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!documentType) {
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
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    const finalDocumentType = documentType === "Other" ? customDocumentType : documentType

    const documentData = {
      ...formData,
      documentType: finalDocumentType,
      title: documentTitle,
      status: "completed",
      updatedAt: new Date().toISOString(),
    }

    const existingDocs = localStorage.getItem("modocs_documents")
    const docs = existingDocs ? JSON.parse(existingDocs) : []

    if (editingDocId) {
      // Update existing document
      const index = docs.findIndex((d: any) => d.id === editingDocId)
      if (index !== -1) {
        docs[index] = documentData
      }
    } else {
      // Check if document already exists (was in-progress)
      const existingIndex = docs.findIndex((d: any) => d.id === formData.id)
      if (existingIndex !== -1) {
        docs[existingIndex] = documentData
      } else {
        docs.push(documentData)
      }
    }

    localStorage.setItem("modocs_documents", JSON.stringify(docs))

    // Download as JSON
    const blob = new Blob([JSON.stringify(documentData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "output.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Document Saved!",
      description: "Your document has been saved as output.json",
    })

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event("storage"))

    setHasUnsavedChanges(false)
    setShowSuccessMessage(true)
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
        return (
          <ContractForm
            data={formData}
            onChange={handleInputChange}
            onNestedChange={handleNestedInputChange}
            errors={errors}
          />
        )
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
                    setFormData({})
                    setErrors({})
                    setEditingDocId(null)
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
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleNavigation("/modocs/view")}>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Manage Documents</span>
              </Button>
              <Button onClick={handleSave} className="gap-2" disabled={!documentType}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Save Document</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Create Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">Create Document</h2>
          <p className="text-muted-foreground text-lg">Select a document type and fill in the details</p>
        </div>

        {/* Document Type Selection */}
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Document Type</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose the type of document you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type *</Label>
              <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                  <SelectItem value="Contract">Contract / Agreement</SelectItem>
                  <SelectItem value="Business Letter">Business Letter</SelectItem>
                  <SelectItem value="Memo">Memo</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Financial Statement">Financial Statement</SelectItem>
                  <SelectItem value="Work Order">Work Order</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Receipt">Receipt</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {documentType === "Other" && (
              <div>
                <Label htmlFor="customDocumentType">Custom Document Type *</Label>
                <Input
                  id="customDocumentType"
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
                  className={errors.customDocumentType ? "border-destructive" : ""}
                />
                {errors.customDocumentType && (
                  <p className="text-sm text-destructive mt-1">{errors.customDocumentType}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Removed duplicate Card for custom document type from updates */}

        {documentType && (
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Document Title</CardTitle>
              <CardDescription className="text-muted-foreground">
                Give your document a descriptive title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="documentTitle">Title *</Label>
                <Input
                  id="documentTitle"
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Form Fields */}
        {renderFormFields()}

        {documentType && (
          <div className="mt-8 flex justify-end gap-4">
            <Link href="/modocs">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} className="gap-2">
              <Download className="h-4 w-4" />
              Save Document
            </Button>
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
              <Label>Invoice Date *</Label>
              <Input
                type="date"
                value={data.invoiceDate || ""}
                onChange={(e) => onChange("invoiceDate", e.target.value)}
                className={errors?.invoiceDate ? "border-destructive" : ""}
              />
              {errors?.invoiceDate && <p className="text-sm text-destructive mt-1">{errors.invoiceDate}</p>}
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={data.dueDate || ""} onChange={(e) => onChange("dueDate", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              value={data.companyInfo?.name || ""}
              onChange={(e) => onNestedChange(["companyInfo", "name"], e.target.value)}
              placeholder="Your Company LLC"
              className={errors?.["companyInfo.name"] ? "border-destructive" : ""}
            />
            {errors?.["companyInfo.name"] && (
              <p className="text-sm text-destructive mt-1">{errors["companyInfo.name"]}</p>
            )}
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={data.companyInfo?.address || ""}
              onChange={(e) => onNestedChange(["companyInfo", "address"], e.target.value)}
              rows={2}
              placeholder="123 Business St, Suite 100, City, State 12345"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={data.companyInfo?.phone || ""}
                onChange={(e) => onNestedChange(["companyInfo", "phone"], e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={data.companyInfo?.email || ""}
                onChange={(e) => onNestedChange(["companyInfo", "email"], e.target.value)}
                placeholder="billing@yourcompany.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Client Name *</Label>
            <Input
              value={data.clientInfo?.name || ""}
              onChange={(e) => onNestedChange(["clientInfo", "name"], e.target.value)}
              placeholder="Client Company Inc"
              className={errors?.["clientInfo.name"] ? "border-destructive" : ""}
            />
            {errors?.["clientInfo.name"] && (
              <p className="text-sm text-destructive mt-1">{errors["clientInfo.name"]}</p>
            )}
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={data.clientInfo?.address || ""}
              onChange={(e) => onNestedChange(["clientInfo", "address"], e.target.value)}
              rows={2}
              placeholder="456 Client Ave, City, State 67890"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Subtotal</Label>
              <Input
                type="number"
                value={data.subtotal || ""}
                onChange={(e) => onChange("subtotal", e.target.value ? Number.parseFloat(e.target.value) : "")}
                placeholder="10000.00"
              />
            </div>
            <div>
              <Label>Tax Amount</Label>
              <Input
                type="number"
                value={data.taxAmount || ""}
                onChange={(e) => onChange("taxAmount", e.target.value ? Number.parseFloat(e.target.value) : "")}
                placeholder="800.00"
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
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Textarea
              value={data.paymentTerms || ""}
              onChange={(e) => onChange("paymentTerms", e.target.value)}
              rows={2}
              placeholder="Payment due within 30 days. Late payments subject to 1.5% monthly interest."
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={data.notes || ""}
              onChange={(e) => onChange("notes", e.target.value)}
              rows={3}
              placeholder="Additional notes or special instructions"
            />
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
