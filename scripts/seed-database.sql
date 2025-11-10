-- Seed data for MoDocs Database
-- This populates the database with realistic placeholder information

-- Insert sample users
INSERT INTO users (id, email, name, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'john.smith@example.com', 'John Smith', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@example.com', 'Sarah Johnson', '2024-01-20 14:30:00', '2024-01-20 14:30:00'),
('550e8400-e29b-41d4-a716-446655440002', 'michael.chen@example.com', 'Michael Chen', '2024-02-01 09:15:00', '2024-02-01 09:15:00');

-- Insert sample documents
INSERT INTO documents (id, user_id, document_type, title, status, created_at, updated_at, author, data) VALUES
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Invoice', 'Website Development Services - Q1 2024', 'Completed', '2024-03-01 11:00:00', '2024-03-01 11:00:00', 'John Smith', 
'{"invoiceNumber": "INV-2024-001", "invoiceDate": "2024-03-01", "dueDate": "2024-03-31", "clientName": "Acme Corporation", "items": [{"description": "Website Development", "quantity": 1, "price": 5000}], "subtotal": 5000, "tax": 450, "total": 5450, "tone": "Professional"}'),

('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Contract', 'Service Agreement - Marketing Services', 'Completed', '2024-03-05 15:30:00', '2024-03-05 15:30:00', 'Sarah Johnson',
'{"contractTitle": "Marketing Services Agreement", "parties": "Tech Solutions Inc. and Creative Marketing Ltd.", "startDate": "2024-04-01", "endDate": "2025-03-31", "scope": "Comprehensive digital marketing services including SEO, content creation, and social media management", "compensation": 10000, "tone": "Formal"}'),

('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Proposal', 'Cloud Infrastructure Migration Proposal', 'In Progress', '2024-03-10 10:45:00', '2024-03-10 16:20:00', 'Michael Chen',
'{"proposalTitle": "Cloud Infrastructure Migration", "clientName": "Enterprise Solutions Corp", "projectOverview": "Complete migration of on-premise infrastructure to AWS cloud", "timeline": "6 months", "totalCost": 75000, "methodology": "Phased migration approach with zero downtime", "tone": "Professional"}'),

('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Business Letter', 'Partnership Inquiry - Q2 Collaboration', 'Completed', '2024-03-12 09:00:00', '2024-03-12 09:00:00', 'John Smith',
'{"recipientName": "Jane Williams", "recipientCompany": "Innovation Partners LLC", "subject": "Strategic Partnership Opportunity", "body": "We are interested in exploring a strategic partnership for Q2 2024 initiatives", "tone": "Friendly"}'),

('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Memo', 'Office Policy Update - Remote Work Guidelines', 'Completed', '2024-03-15 13:00:00', '2024-03-15 13:00:00', 'Sarah Johnson',
'{"subject": "Updated Remote Work Policy", "recipient": "All Staff", "summary": "New guidelines for hybrid work arrangements effective April 1, 2024", "details": "Employees may work remotely up to 3 days per week with manager approval", "tone": "Professional"}');

-- Insert invoice details
INSERT INTO invoices (id, document_id, invoice_number, invoice_date, due_date, client_name, subtotal, tax_amount, total_amount, payment_status) VALUES
('750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'INV-2024-001', '2024-03-01', '2024-03-31', 'Acme Corporation', 5000.00, 450.00, 5450.00, 'paid');

-- Insert contract details
INSERT INTO contracts (id, document_id, contract_title, start_date, end_date, contract_value, parties, status) VALUES
('850e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', 'Marketing Services Agreement', '2024-04-01', '2025-03-31', 10000.00, '["Tech Solutions Inc.", "Creative Marketing Ltd."]', 'active');

-- Insert proposal details
INSERT INTO proposals (id, document_id, proposal_title, total_cost, proposal_status) VALUES
('950e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440002', 'Cloud Infrastructure Migration', 75000.00, 'pending_review');

-- Insert document activities
INSERT INTO document_activities (document_id, user_id, activity_type, activity_description, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'created', 'Document created', '2024-03-01 11:00:00'),
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'updated', 'Document finalized and sent to client', '2024-03-01 11:30:00'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'created', 'Contract drafted', '2024-03-05 15:30:00'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'created', 'Proposal initiated', '2024-03-10 10:45:00'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'updated', 'Pricing section updated', '2024-03-10 16:20:00');

-- Insert document tags
INSERT INTO document_tags (document_id, tag) VALUES
('650e8400-e29b-41d4-a716-446655440000', 'finance'),
('650e8400-e29b-41d4-a716-446655440000', 'client-billing'),
('650e8400-e29b-41d4-a716-446655440001', 'legal'),
('650e8400-e29b-41d4-a716-446655440001', 'contracts'),
('650e8400-e29b-41d4-a716-446655440002', 'sales'),
('650e8400-e29b-41d4-a716-446655440002', 'proposals'),
('650e8400-e29b-41d4-a716-446655440003', 'correspondence'),
('650e8400-e29b-41d4-a716-446655440004', 'internal');

-- Insert document comments
INSERT INTO document_comments (document_id, user_id, comment_text, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Invoice approved and sent to client', '2024-03-01 12:00:00'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Waiting for technical team review before submitting', '2024-03-10 17:00:00');
