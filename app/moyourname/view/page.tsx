"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { FileText, ArrowLeft, Search, Grid3x3, List, Edit, Trash2, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ViewPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [documents, setDocuments] = useState<any[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)

  useEffect(() => {
    const loadDocuments = () => {
      const stored = localStorage.getItem("modocs_documents")
      setDocuments(stored ? JSON.parse(stored) : [])
    }

    loadDocuments()

    // Listen for storage changes
    window.addEventListener("storage", loadDocuments)
    return () => window.removeEventListener("storage", loadDocuments)
  }, [])

  // Filter documents based on search and type filter - only show completed
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.title || doc.documentType).toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || doc.documentType === filterType
    const isCompleted = doc.status === "completed" || !doc.status
    return matchesSearch && matchesType && isCompleted
  })

  const handleDelete = (id: string) => {
    setDocumentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      const updatedDocs = documents.filter((doc) => doc.id !== documentToDelete)
      setDocuments(updatedDocs)
      localStorage.setItem("modocs_documents", JSON.stringify(updatedDocs))
      toast({
        title: "Document Deleted",
        description: "The document has been successfully deleted.",
      })
      // Trigger storage event
      window.dispatchEvent(new Event("storage"))
    }
    setDeleteDialogOpen(false)
    setDocumentToDelete(null)
  }

  const handleEdit = (doc: any) => {
    // Store document to edit in sessionStorage
    sessionStorage.setItem("modocs_edit_document", JSON.stringify(doc))
    router.push("/moyourname/create")
  }

  // Helper to get display title
  const getDisplayTitle = (doc: any) => {
    if (doc.title && doc.title.trim() !== "") return doc.title
    if (doc.invoiceNumber) return `Invoice ${doc.invoiceNumber}`
    if (doc.poNumber) return `PO ${doc.poNumber}`
    if (doc.contractTitle) return doc.contractTitle
    if (doc.receiptNumber) return `Receipt ${doc.receiptNumber}`
    if (doc.workOrderNumber) return `Work Order ${doc.workOrderNumber}`
    if (doc.proposalTitle) return doc.proposalTitle
    if (doc.reportTitle) return doc.reportTitle
    return doc.documentType
  }

  // Helper to get amount
  const getAmount = (doc: any) => {
    if (doc.totalAmount) return `$${doc.totalAmount.toLocaleString()}`
    if (doc.totalCost) return `$${doc.totalCost.toLocaleString()}`
    return "N/A"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/moyourname" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">MoDocs</h1>
              </div>
            </Link>
            <Link href="/moyourname/create">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {/* Create Document */}
                <span className="hidden sm:inline">Create Document</span>
                {/* Create */}
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">Document Manager</h2>
          <p className="text-muted-foreground text-lg">View, search, and manage your business documents</p>
        </div>

        {/* Filters and Search */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
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
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "table")} className="w-auto">
                <TabsList>
                  <TabsTrigger value="grid" className="gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="table" className="gap-2">
                    <List className="h-4 w-4" />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of{" "}
            {documents.filter((d) => d.status === "completed" || !d.status).length} completed documents
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && filteredDocuments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="border-border bg-card hover:shadow-lg transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground line-clamp-2">
                        {doc.title || doc.documentType}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground mt-1">{doc.documentType}</CardDescription>
                    </div>
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(38, 99, 235, 0.1)" }}
                    >
                      <FileText className="h-5 w-5" style={{ color: "#2663eb" }} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author:</span>
                      <span className="font-medium text-foreground">{doc.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium text-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {(doc.totalAmount || doc.totalCost) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium" style={{ color: "#2663eb" }}>
                          ${(doc.totalAmount || doc.totalCost).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => handleEdit(doc)}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && filteredDocuments.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-secondary/50">
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ backgroundColor: "rgba(38, 99, 235, 0.1)", color: "#2663eb" }}
                        >
                          {doc.documentType}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{doc.title || doc.documentType}</TableCell>
                      <TableCell>{doc.author}</TableCell>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell
                        className={doc.totalAmount || doc.totalCost ? "font-semibold" : ""}
                        style={doc.totalAmount || doc.totalCost ? { color: "#2663eb" } : {}}
                      >
                        {doc.totalAmount || doc.totalCost
                          ? `$${(doc.totalAmount || doc.totalCost).toLocaleString()}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(doc)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-6">
                {documents.filter((d) => d.status === "completed" || !d.status).length === 0
                  ? "Create your first document to get started"
                  : "Try adjusting your search or filter criteria"}
              </p>
              <Link href="/moyourname/create">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Document
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
