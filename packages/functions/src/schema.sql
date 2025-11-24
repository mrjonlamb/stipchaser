-- StipChaser Database Schema for PostgreSQL

-- Dealerships table
CREATE TABLE IF NOT EXISTS dealerships (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- Create indexes for dealerships table
CREATE INDEX IF NOT EXISTS idx_dealerships_status ON dealerships(status);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    cognito_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    dealership_id UUID NOT NULL,
    invited_by UUID,
    status VARCHAR(50) DEFAULT 'pending',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    FOREIGN KEY (dealership_id) REFERENCES dealerships(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_dealership ON users(dealership_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cognito ON users(cognito_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY,
    dealership_id UUID NOT NULL,
    customer_id VARCHAR(255),
    customer JSONB NOT NULL,
    vehicle JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    pending_documents INTEGER DEFAULT 0,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    FOREIGN KEY (dealership_id) REFERENCES dealerships(id) ON DELETE CASCADE
);

-- Create indexes for deals table
CREATE INDEX IF NOT EXISTS idx_deals_dealership_status ON deals(dealership_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_status_created ON deals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_customer_created ON deals(customer_id, created_at DESC);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    deal_id UUID NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    s3_key VARCHAR(1000) NOT NULL,
    uploaded_at BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
);

-- Create indexes for documents table
CREATE INDEX IF NOT EXISTS idx_documents_deal_uploaded ON documents(deal_id, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    deal_id UUID NOT NULL,
    participants JSONB NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    message_count INTEGER DEFAULT 0,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
);

-- Create indexes for conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_deal_updated ON conversations(deal_id, updated_at DESC);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL,
    content TEXT NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) DEFAULT 'user',
    timestamp BIGINT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_conversation_timestamp ON messages(conversation_id, timestamp ASC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read) WHERE read = FALSE;



c17cc66a-9d94-44b6-8aaf-e718b1e6f64d
94683408-3071-70be-1f83-0a9916a40b36 - Cognito User ID for testing
