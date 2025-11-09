# Migration from DynamoDB to Aurora PostgreSQL

This document outlines the migration from DynamoDB to Aurora PostgreSQL and provides instructions for completing the setup.

## Changes Made

### 1. Infrastructure (sst.config.ts)

- Removed all DynamoDB table definitions
- Added VPC with managed NAT gateway
- Added Aurora PostgreSQL Serverless v2 cluster
- Updated all Lambda functions to connect to the VPC and link to the database

### 2. Dependencies (packages/functions/package.json)

- Removed: `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`
- Added: `pg` (PostgreSQL client), `@types/pg`

### 3. Database Schema

- Created `packages/functions/src/schema.sql` with PostgreSQL table definitions
- Tables: deals, documents, conversations, messages
- All tables use UUID for primary keys
- Added appropriate indexes for query performance
- Added foreign key constraints for data integrity

### 4. Database Connection Utility

- Created `packages/functions/src/db.ts`
- Provides connection pooling for Lambda functions
- Exports helper functions: `query`, `queryOne`, `getClient`

### 5. Lambda Functions

All Lambda functions have been updated to use PostgreSQL:

- **Deals**: list, create, get, update, delete
- **Documents**: list, upload, get, delete (S3 integration maintained)
- **Conversations**: list, create, messages, send-message

Key changes:

- Replaced DynamoDB SDK calls with SQL queries
- Used parameterized queries to prevent SQL injection
- Converted camelCase to snake_case for column names
- JSON fields (customer, vehicle, participants) stored as JSONB
- Timestamps remain as BIGINT (milliseconds since epoch)

## Setup Instructions

### 1. Install Dependencies

```bash
cd packages/functions
npm install
cd ../..
```

### 2. Deploy Infrastructure

Deploy the new infrastructure (this will create VPC, Aurora cluster, etc.):

```bash
npm run deploy:dev
```

**Note**: The first deployment will take 10-15 minutes as it provisions:

- VPC with public/private subnets
- NAT Gateway
- Aurora PostgreSQL Serverless v2 cluster
- Lambda functions with VPC connectivity

### 3. Initialize Database Schema

After deployment, you need to run the schema SQL to create tables:

#### Option A: Using AWS RDS Query Editor (Recommended)

1. Go to AWS Console → RDS → Query Editor
2. Select your Aurora cluster
3. Use the credentials from SST output
4. Copy and paste contents of `packages/functions/src/schema.sql`
5. Execute the SQL

#### Option B: Using PostgreSQL Client (psql)

1. Get database connection details:

```bash
npm run console
```

2. Connect to the database:

```bash
psql -h <host> -U <username> -d <database>
```

3. Run the schema:

```bash
\i packages/functions/src/schema.sql
```

### 4. Test the Application

```bash
npm run dev
```

Test each API endpoint to verify functionality:

- GET /deals
- POST /deals
- GET /documents
- POST /conversations

## Data Migration

If you have existing data in DynamoDB, you'll need to migrate it to PostgreSQL:

### 1. Export DynamoDB Data

Use AWS CLI or the AWS Console to export your DynamoDB tables:

```bash
# Example for deals table
aws dynamodb scan --table-name <DealsTableName> > deals.json
```

### 2. Transform and Import Data

Create a Node.js script to:

1. Read the exported JSON
2. Transform the data to match PostgreSQL schema
3. Insert into PostgreSQL using the connection utility

Example migration script structure:

```javascript
import { query } from "./packages/functions/src/db.js";
import fs from "fs";

async function migrateDeal(deal) {
  const sql = `
    INSERT INTO deals (
      id, customer_id, customer, vehicle, status, priority,
      pending_documents, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;

  await query(sql, [
    deal.id,
    deal.customerId || null,
    JSON.stringify(deal.customer),
    JSON.stringify(deal.vehicle),
    deal.status,
    deal.priority,
    deal.pendingDocuments || 0,
    deal.createdAt,
    deal.updatedAt,
  ]);
}

// Run migration for all deals
```

## Key Differences: DynamoDB vs PostgreSQL

### Data Types

- **DynamoDB**: Schema-less, flexible attributes
- **PostgreSQL**: Strongly typed columns (use JSONB for flexible data)

### Queries

- **DynamoDB**: Key-based access, GSI for alternate queries
- **PostgreSQL**: Full SQL support, powerful JOINs, complex WHERE clauses

### Indexing

- **DynamoDB**: Primary index + Global/Local Secondary Indexes
- **PostgreSQL**: Multiple index types (B-tree, Hash, GiST, GIN) on any column

### Relationships

- **DynamoDB**: No built-in relationships
- **PostgreSQL**: Foreign keys, CASCADE operations, referential integrity

### Transactions

- **DynamoDB**: Limited transaction support
- **PostgreSQL**: Full ACID transactions (used in send-message handler)

## Performance Considerations

1. **Connection Pooling**: Lambda functions reuse connections across invocations
2. **VPC Cold Starts**: Lambda functions in VPC may have slightly longer cold starts
3. **Query Optimization**: Use EXPLAIN ANALYZE to optimize slow queries
4. **Indexes**: Ensure proper indexes are created for your query patterns

## Cost Comparison

### Aurora PostgreSQL Serverless v2

- **Minimum**: 0.5 ACU ($0.06/hr) = ~$43/month
- **Scaling**: Auto-scales based on load
- **Storage**: $0.10/GB per month

### DynamoDB On-Demand

- **Reads**: $0.25 per million requests
- **Writes**: $1.25 per million requests
- **Storage**: $0.25/GB per month

Choose based on your read/write patterns and data size.

## Troubleshooting

### Lambda Timeout in VPC

If Lambda functions timeout:

- Check VPC NAT Gateway is running
- Verify Lambda has access to private subnets
- Ensure security groups allow PostgreSQL traffic (port 5432)

### Connection Errors

If database connection fails:

- Verify database is running in SST console
- Check Lambda function has correct VPC configuration
- Ensure database credentials are correct

### Query Performance

If queries are slow:

- Add indexes for commonly filtered columns
- Use EXPLAIN ANALYZE to understand query plans
- Consider increasing Aurora capacity units

## Rollback Plan

If you need to rollback to DynamoDB:

1. Keep your DynamoDB tables (don't delete them)
2. Git checkout the previous commit
3. Redeploy: `npm run deploy:dev`
4. Remove PostgreSQL stack: `npm run remove`

## Support

For issues or questions:

1. Check AWS CloudWatch logs for Lambda errors
2. Review PostgreSQL logs in RDS console
3. Use SST console for resource inspection
