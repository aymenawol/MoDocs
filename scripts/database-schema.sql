-- MoDocs Database Schema
-- This schema supports all 10 document types with their specific structures

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table (base table for all document types)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author VARCHAR(255) NOT NULL,
  data JSONB NOT NULL, -- Stores the full document structure as JSON
  INDEX idx_user_documents (user_id, created_at DESC),
  INDEX idx_document_type (document_type),
  INDEX idx_status (status)
);

-- Invoices table (specialized structure for invoices)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  INDEX idx_invoice_number (invoice_number),
  INDEX idx_payment_status (payment_status)
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  po_number VARCHAR(100) UNIQUE NOT NULL,
  po_date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  approval_status VARCHAR(50) DEFAULT 'pending',
  INDEX idx_po_number (po_number),
  INDEX idx_approval_status (approval_status)
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  contract_title VARCHAR(500) NOT NULL,
  start_date DATE,
  end_date DATE,
  contract_value DECIMAL(12, 2),
  parties JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  INDEX idx_contract_dates (start_date, end_date)
);

-- Financial Statements table
CREATE TABLE IF NOT EXISTS financial_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  reporting_period VARCHAR(100) NOT NULL,
  net_income DECIMAL(15, 2),
  total_assets DECIMAL(15, 2),
  total_liabilities DECIMAL(15, 2),
  INDEX idx_reporting_period (reporting_period)
);

-- Work Orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  work_order_number VARCHAR(100) UNIQUE NOT NULL,
  work_order_date DATE NOT NULL,
  estimated_completion_date DATE,
  priority VARCHAR(20) NOT NULL,
  completion_status VARCHAR(50) DEFAULT 'pending',
  INDEX idx_work_order_number (work_order_number),
  INDEX idx_priority (priority)
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  proposal_title VARCHAR(500) NOT NULL,
  total_cost DECIMAL(12, 2),
  proposal_status VARCHAR(50) DEFAULT 'draft',
  INDEX idx_proposal_status (proposal_status)
);

-- Document activities log
CREATE TABLE IF NOT EXISTS document_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', 'viewed'
  activity_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_document_activities (document_id, created_at DESC)
);

-- Tags for document categorization
CREATE TABLE IF NOT EXISTS document_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  INDEX idx_tag (tag),
  INDEX idx_document_tags (document_id)
);

-- Comments on documents
CREATE TABLE IF NOT EXISTS document_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_document_comments (document_id, created_at DESC)
);
