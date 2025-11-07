export const sampleDocument = {
  documentType: "Contract",
  title: "Employment Agreement",
  sections: [
    {
      heading: "Introduction",
      content: "This agreement is between Company X and Employee Y, effective as of the start date specified below.",
    },
    {
      heading: "Duties and Responsibilities",
      content:
        "Employee will perform the following responsibilities: software development, code reviews, and team collaboration.",
    },
    {
      heading: "Compensation",
      content:
        "Employee will be paid $120,000 per annum, paid bi-weekly. Additional benefits include health insurance and 401(k) matching.",
    },
    {
      heading: "Termination",
      content:
        "Either party may terminate this agreement with 30 days written notice. Upon termination, all company property must be returned.",
    },
  ],
  createdAt: "2025-11-06T14:00:00Z",
  author: "John Doe",
}

export const dbDocuments = [
  {
    id: 1,
    user_id: 101,
    document_type: "Contract",
    title: "Employment Agreement",
    sections: [
      { heading: "Introduction", content: "This agreement is between Company X and Employee Y..." },
      { heading: "Duties", content: "Employee will perform the following responsibilities..." },
      { heading: "Compensation", content: "Employee will be paid $X per annum..." },
    ],
    created_at: "2025-11-06T14:00:00Z",
  },
  {
    id: 2,
    user_id: 101,
    document_type: "Proposal",
    title: "Marketing Proposal",
    sections: [
      { heading: "Executive Summary", content: "This proposal outlines our marketing strategy..." },
      { heading: "Target Audience", content: "Our target demographic includes..." },
      { heading: "Budget", content: "Total budget allocation is..." },
    ],
    created_at: "2025-11-05T10:30:00Z",
  },
]
