"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, PlusCircle, Menu, X } from "lucide-react"
import Image from "next/image"

const getStoredDocuments = () => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("modocs_documents")
  return stored ? JSON.parse(stored) : []
}

export default function LandingPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setDocuments(getStoredDocuments())

    const handleStorage = () => {
      setDocuments(getStoredDocuments())
    }
    window.addEventListener("storage", handleStorage)

    setTimeout(() => setMounted(true), 100)

    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const totalDocuments = documents.length
  const thisMonth = documents.filter((doc) => {
    const docDate = new Date(doc.createdAt)
    const now = new Date()
    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
  }).length
  const hoursSaved = ((totalDocuments * 45) / 60).toFixed(1)

  const recentActivity = documents
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <nav
        className={`border-b border-border bg-card sticky top-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/modocs" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FileText className="h-6 w-6" style={{ color: "#2663eb" }} />
              <h1 className="text-xl font-bold text-foreground">MoDocs</h1>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/modocs/view">
                <Button variant="outline">Manage Documents</Button>
              </Link>
              <Link href="/modocs/create">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Document
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-3">
                <Link href="/modocs/view" className="w-full">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Manage Documents
                  </Button>
                </Link>
                <Link href="/modocs/create" className="w-full">
                  <Button className="w-full justify-start gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Document
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
          <div
            className={`transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              Business Documents, <span className="text-primary">Simplified</span>
            </h2>
            <div className="space-y-3 mb-8">
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
                Create professional contracts, proposals, agreements, and more in minutes.
              </p>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
                Save time and maintain consistency across all your business documents.
              </p>
            </div>

            <Link href="/modocs/create">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Get Started
              </Button>
            </Link>
          </div>

          <div
            className={`transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="relative w-full aspect-square">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero_image-reM0pwoj5NJOD1U4bemkPzVARfr6XX.png"
                alt="Professional business document illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <Card
          className={`border-border bg-card transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-muted-foreground">Your latest document activity</CardDescription>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-primary text-lg">{totalDocuments}</div>
                  <div className="text-muted-foreground text-xs">Documents</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary text-lg">{thisMonth}</div>
                  <div className="text-muted-foreground text-xs">This Month</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary text-lg">{hoursSaved}h</div>
                  <div className="text-muted-foreground text-xs">Saved</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{activity.title || activity.documentType}</h4>
                        <p className="text-sm text-muted-foreground">{activity.documentType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.updatedAt).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === "in-progress"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {activity.status === "in-progress" ? "In Progress" : "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No documents created yet</p>
                <Link href="/modocs/create">
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Your First Document
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
