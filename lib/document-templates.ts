import type { AnyDocument } from "./document-types"

// Placeholder/template data for each document type
export const documentTemplates: Record<string, Partial<AnyDocument>> = {
  Invoice: {
    documentType: "Invoice",
    invoiceNumber: "INV-2025-001",
    invoiceDate: "2025-11-06",
    dueDate: "2025-12-06",
    companyInfo: {
      name: "Acme Corporation",
      address: "123 Business St, Suite 100, New York, NY 10001",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
    },
    clientInfo: {
      name: "Client Company Inc",
      address: "456 Client Ave, Los Angeles, CA 90001",
      phone: "(555) 987-6543",
      email: "accounts@client.com",
    },
    items: [
      { description: "Professional Services - Q4 2024", quantity: 1, unitPrice: 5000, total: 5000 },
      { description: "Consulting Hours (40 hrs @ $150/hr)", quantity: 40, unitPrice: 150, total: 6000 },
    ],
    subtotal: 11000,
    taxRate: 0.08,
    taxAmount: 880,
    totalAmount: 11880,
    paymentTerms: "Net 30 days. Payment due within 30 days of invoice date.",
    notes: "Thank you for your business. Please remit payment to the address above.",
  },
  "Purchase Order": {
    documentType: "Purchase Order",
    poNumber: "PO-2025-001",
    poDate: "2025-11-06",
    deliveryDate: "2025-11-20",
    buyerInfo: {
      company: "TechCorp Industries",
      address: "789 Tech Blvd, San Francisco, CA 94102",
      contact: "Jane Smith, Procurement Manager",
    },
    supplierInfo: {
      company: "Office Supplies Co",
      address: "321 Supply Lane, Chicago, IL 60601",
      contact: "John Brown, Sales Representative",
    },
    items: [
      { description: "Ergonomic Office Chairs (Model X200)", quantity: 25, unitPrice: 350, total: 8750 },
      { description: "Standing Desks (Model SD-Pro)", quantity: 15, unitPrice: 800, total: 12000 },
    ],
    totalAmount: 20750,
    paymentTerms: "50% deposit upon order, balance due upon delivery",
    approvalSignature: "Jane Smith",
  },
  Contract: {
    documentType: "Contract",
    contractTitle: "Professional Services Agreement",
    parties: [
      { name: "ABC Company LLC", role: "Client", address: "100 Main St, Boston, MA 02101" },
      { name: "XYZ Consulting Inc", role: "Consultant", address: "200 Park Ave, New York, NY 10001" },
    ],
    recitals:
      "WHEREAS, Client desires to engage Consultant to provide professional consulting services; and WHEREAS, Consultant has the expertise and qualifications to provide such services.",
    terms: [
      {
        heading: "Scope of Services",
        content:
          "Consultant shall provide strategic business consulting services including market analysis, competitive research, and business development recommendations as detailed in Exhibit A.",
      },
      {
        heading: "Compensation",
        content:
          "Client shall pay Consultant a fee of $150 per hour for services rendered, with invoices submitted monthly and payment due within 30 days of receipt.",
      },
      {
        heading: "Term",
        content: "This Agreement shall commence on January 1, 2025 and continue for a period of twelve (12) months.",
      },
    ],
    paymentTerms: "Net 30 days from invoice date",
    duration: "12 months from January 1, 2025",
    terminationClause: "Either party may terminate this Agreement with 30 days written notice to the other party.",
    confidentiality:
      "Both parties agree to maintain confidentiality of all proprietary information shared during the term of this Agreement.",
    governingLaw: "This Agreement shall be governed by the laws of the State of New York.",
    signatures: [
      { party: "ABC Company LLC", signature: "Sarah Johnson, CEO", date: "2025-01-01" },
      { party: "XYZ Consulting Inc", signature: "Michael Chen, President", date: "2025-01-01" },
    ],
  },
  "Business Letter": {
    documentType: "Business Letter",
    senderAddress: "Global Tech Solutions\n500 Innovation Drive\nAustin, TX 78701",
    recipientAddress:
      "Ms. Emily Rodriguez\nDirector of Operations\nFuture Industries Inc\n800 Commerce Blvd\nDallas, TX 75201",
    date: "November 6, 2025",
    salutation: "Dear Ms. Rodriguez,",
    subject: "Proposal for Technology Partnership",
    body: "I am writing to express our interest in establishing a strategic technology partnership with Future Industries Inc. Our team at Global Tech Solutions has been following your company's impressive growth and innovation in the manufacturing sector.\n\nWe believe that our cloud-based automation platform could significantly enhance your operational efficiency and reduce costs by up to 30%. We would welcome the opportunity to discuss this potential collaboration in detail.\n\nI have enclosed our company brochure and a preliminary proposal for your review. I will follow up with a phone call next week to schedule a meeting at your convenience.",
    closing: "Sincerely,",
    senderName: "David Park",
    senderTitle: "Vice President of Business Development",
    attachments: ["Company Brochure", "Preliminary Proposal Document"],
  },
  Memo: {
    documentType: "Memo",
    to: "All Department Managers",
    from: "Lisa Chang, Chief Operating Officer",
    date: "November 6, 2025",
    subject: "Q4 Budget Review and Planning Session",
    purpose:
      "This memo serves to notify all department managers of the upcoming Q4 budget review meeting and outline the preparation requirements.",
    mainContent:
      "As we approach the end of Q4, it is essential that we conduct a comprehensive review of our departmental budgets and begin planning for Q1 2026. The budget review meeting is scheduled for November 15, 2025, at 2:00 PM in Conference Room A.\n\nEach department should prepare:\n- Current quarter spending analysis\n- Variance reports comparing actual vs. budgeted amounts\n- Preliminary budget proposals for Q1 2026\n- Justification for any requested budget increases\n\nPlease bring both digital and printed copies of your reports to the meeting.",
    actionItems: [
      "Prepare Q4 spending analysis by November 12",
      "Submit preliminary Q1 2026 budget proposals by November 14",
      "Attend budget review meeting on November 15 at 2:00 PM",
      "Identify potential cost-saving opportunities in your department",
    ],
    closingRemarks:
      "Your cooperation and timely preparation are crucial for effective budget planning. Please contact the Finance Department if you have any questions.",
  },
  Report: {
    documentType: "Report",
    reportTitle: "Q3 2025 Market Analysis Report",
    executiveSummary:
      "This report provides a comprehensive analysis of market trends, competitive landscape, and customer behavior during Q3 2025. Key findings indicate a 15% growth in market demand and emerging opportunities in the digital services sector.",
    introduction:
      "The purpose of this report is to analyze market conditions during Q3 2025 and provide strategic recommendations for business development. This analysis covers industry trends, competitive positioning, and customer insights.",
    objectives: [
      "Identify key market trends and growth opportunities",
      "Analyze competitive landscape and market positioning",
      "Assess customer needs and preferences",
      "Provide data-driven recommendations for strategic planning",
    ],
    methodology:
      "This research employed a mixed-methods approach including quantitative surveys of 500 customers, qualitative interviews with 25 industry experts, and analysis of market data from leading industry reports and databases.",
    findings: [
      {
        heading: "Market Growth Trends",
        content:
          "The overall market grew by 15% in Q3 2025 compared to the previous quarter. Digital transformation services showed the highest growth rate at 28%, while traditional consulting services grew by 8%.",
      },
      {
        heading: "Competitive Analysis",
        content:
          "Our market share increased to 23%, positioning us as the third-largest provider in the region. Top competitors include MarketLeader Corp (35% share) and InnovateTech Solutions (27% share).",
      },
      {
        heading: "Customer Preferences",
        content:
          "Survey results indicate that 72% of customers prioritize integration capabilities and 68% value responsive customer support. Price sensitivity decreased from Q2, with quality and reliability becoming primary decision factors.",
      },
    ],
    conclusions:
      "The market shows strong growth potential, particularly in digital services. Our competitive position has improved, but there is opportunity to gain additional market share by focusing on integration capabilities and customer support excellence.",
    recommendations: [
      "Invest in enhancing product integration capabilities",
      "Expand customer support team by 30% to improve response times",
      "Develop targeted marketing campaigns for digital transformation services",
      "Consider strategic partnerships with complementary service providers",
    ],
    appendices: [
      "Survey questionnaire",
      "Interview transcripts",
      "Detailed statistical analysis",
      "Market data sources",
    ],
  },
  "Financial Statement": {
    documentType: "Financial Statement",
    companyInfo: {
      name: "Innovate Corp",
      address: "123 Finance Street, New York, NY 10005",
      reportingPeriod: "Q3 2025 (July 1 - September 30, 2025)",
    },
    balanceSheet: {
      assets: [
        { item: "Cash and Cash Equivalents", amount: 2500000 },
        { item: "Accounts Receivable", amount: 1800000 },
        { item: "Inventory", amount: 950000 },
        { item: "Property and Equipment", amount: 3200000 },
        { item: "Intangible Assets", amount: 1500000 },
      ],
      liabilities: [
        { item: "Accounts Payable", amount: 850000 },
        { item: "Short-term Debt", amount: 1200000 },
        { item: "Long-term Debt", amount: 2800000 },
        { item: "Deferred Revenue", amount: 450000 },
      ],
      equity: [
        { item: "Common Stock", amount: 2000000 },
        { item: "Retained Earnings", amount: 2650000 },
      ],
    },
    incomeStatement: {
      revenue: [
        { item: "Product Sales", amount: 4500000 },
        { item: "Service Revenue", amount: 2300000 },
        { item: "Other Income", amount: 150000 },
      ],
      expenses: [
        { item: "Cost of Goods Sold", amount: 2800000 },
        { item: "Operating Expenses", amount: 1900000 },
        { item: "Interest Expense", amount: 180000 },
        { item: "Taxes", amount: 420000 },
      ],
      netIncome: 1650000,
    },
    cashFlow: {
      operating: 1850000,
      investing: -950000,
      financing: -450000,
    },
    notes:
      "These financial statements have been prepared in accordance with Generally Accepted Accounting Principles (GAAP). All amounts are expressed in USD.",
    preparer: "Jennifer Williams, CPA - Chief Financial Officer",
  },
  "Work Order": {
    documentType: "Work Order",
    workOrderNumber: "WO-2025-0156",
    workOrderDate: "2025-11-06",
    clientInfo: {
      name: "Metro City Hospital",
      address: "789 Healthcare Ave, Medical District, Chicago, IL 60611",
      phone: "(312) 555-0199",
    },
    workDescription:
      "Complete maintenance and inspection of HVAC system in Building C, including filter replacement, duct cleaning, and system calibration. Address reported temperature control issues in rooms 301-315.",
    assignedPersonnel: [
      "Tom Richards - Lead HVAC Technician",
      "Maria Santos - HVAC Specialist",
      "Kevin Lee - Maintenance Assistant",
    ],
    materialsRequired: [
      "20 HEPA filters (24x24x2)",
      "Duct cleaning equipment",
      "Refrigerant R-410A (2 cylinders)",
      "Thermostat calibration tools",
      "Safety equipment and PPE",
    ],
    estimatedCompletionDate: "2025-11-08",
    priority: "High",
    approvalSignature: "Robert Anderson - Facilities Manager",
  },
  Proposal: {
    documentType: "Proposal",
    proposalTitle: "Digital Marketing Campaign Proposal for SpringFresh Products",
    coverLetter:
      "Dear SpringFresh Marketing Team,\n\nThank you for the opportunity to submit this proposal for your upcoming digital marketing campaign. Our agency, Digital Dynamics, has extensive experience in the consumer products sector and is excited to help SpringFresh achieve its growth objectives.",
    introduction:
      "This proposal outlines a comprehensive digital marketing strategy designed to increase SpringFresh's online presence, drive website traffic, and boost product sales by 40% over the next six months.",
    background:
      "SpringFresh Products has established a strong reputation for eco-friendly household cleaning products. However, the brand's digital presence does not fully reflect its market position. Our analysis indicates significant opportunities to expand reach through targeted digital campaigns.",
    objectives: [
      "Increase website traffic by 60% within six months",
      "Grow social media followers by 100,000 across all platforms",
      "Achieve 40% increase in online product sales",
      "Improve brand awareness metrics by 50%",
      "Generate 5,000 qualified leads for B2B partnerships",
    ],
    proposedSolution:
      "Our integrated digital marketing approach combines SEO optimization, targeted social media advertising, influencer partnerships, email marketing campaigns, and content marketing. We will create engaging content highlighting SpringFresh's sustainability mission while driving conversion through strategic calls-to-action.",
    timeline: [
      { milestone: "Campaign Strategy Finalization", date: "November 15, 2025" },
      { milestone: "Website SEO Optimization", date: "December 1, 2025" },
      { milestone: "Social Media Campaign Launch", date: "December 15, 2025" },
      { milestone: "Influencer Partnership Activation", date: "January 5, 2026" },
      { milestone: "Mid-Campaign Review and Optimization", date: "February 15, 2026" },
      { milestone: "Campaign Completion and Final Report", date: "April 30, 2026" },
    ],
    budget: [
      { item: "SEO Optimization and Content Creation", cost: 15000 },
      { item: "Social Media Advertising", cost: 25000 },
      { item: "Influencer Partnerships", cost: 20000 },
      { item: "Email Marketing Platform and Management", cost: 8000 },
      { item: "Analytics and Reporting Tools", cost: 5000 },
      { item: "Project Management and Strategy", cost: 12000 },
    ],
    totalCost: 85000,
    termsAndConditions:
      "Payment terms: 30% deposit upon contract signing, 40% at mid-campaign milestone, 30% upon completion. All deliverables remain property of SpringFresh Products. Campaign performance will be measured against agreed KPIs with monthly reporting.",
    conclusion:
      "We are confident that this comprehensive digital marketing strategy will significantly enhance SpringFresh's market position and drive measurable business results. We look forward to partnering with you on this exciting initiative.",
  },
  Receipt: {
    documentType: "Receipt",
    receiptNumber: "REC-2025-00892",
    receiptDate: "2025-11-06",
    companyInfo: {
      name: "TechGear Electronics Store",
      address: "456 Commerce Plaza, Seattle, WA 98101",
      phone: "(206) 555-0177",
    },
    customerInfo: {
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
    },
    items: [
      { description: "Laptop - Model Pro X15", amount: 1299.99 },
      { description: "Wireless Mouse", amount: 49.99 },
      { description: "Laptop Sleeve", amount: 29.99 },
      { description: "2-Year Extended Warranty", amount: 199.99 },
    ],
    subtotal: 1579.96,
    taxAmount: 142.2,
    totalAmount: 1722.16,
    paymentMethod: "Credit Card - Visa ending in 4532",
  },
}
