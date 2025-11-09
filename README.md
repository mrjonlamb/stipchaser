# StipChaser - Document Collection Platform

A Next.js application with serverless infrastructure for streamlining document collection in car dealerships.

About StipChaser
StipChaser is a secure and compliant communication platform designed to streamline interactions between lenders, their representatives, dealership personnel, and consumers. It enables seamless document requests—known as "stips"—directly from customers, transforming a traditionally high-friction, insecure, and time-consuming process into an efficient workflow.
The Problem: Contracts in Transit
In the automotive finance industry, "contracts in transit" represent a massive risk: millions of dollars in unfunded loans sitting idle as dealerships wait for critical documentation. This delays funding, ties up valuable resources, and exposes businesses to unnecessary financial and compliance vulnerabilities.
How StipChaser Solves It

Secure & Compliant: End-to-end encryption and regulatory adherence ensure data protection and peace of mind.
Real-Time Collaboration: Lenders, reps, and dealership teams can communicate and track stips in one centralized hub.
Accelerated Funding: Reduce turnaround times from days to hours, minimizing exposure and freeing up capital.
User-Friendly Interface: Simple tools for document uploads, notifications, and status updates—empowering everyone involved.

Built with scalability in mind, StipChaser empowers dealerships to focus on growth, not paperwork. Learn more or get started.

## Tech Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS
- **Infrastructure**: SST (Serverless Stack)
- **Backend**: AWS Lambda + API Gateway
- **Database**: Aurora PostgreSQL (Serverless v2)
- **Storage**: S3

## Project Structure

```
stipchaser/
├── app/                          # Next.js app directory
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Home page
│   ├── login/                   # Login page
│   ├── dealer-dashboard/        # Dealer dashboard
│   ├── consumer-portal/         # Consumer portal
│   ├── document-management/     # Document management
│   └── conversation-interface/  # Conversation interface
├── src/                         # Source code
│   ├── components/              # React components
│   ├── pages/                   # Page components (used by app directory)
│   ├── styles/                  # Global styles
│   └── utils/                   # Utility functions
├── packages/
│   └── functions/               # Lambda function handlers
│       ├── src/
│       │   ├── deals/          # Deal management APIs
│       │   ├── documents/      # Document management APIs
│       │   └── conversations/  # Conversation APIs
│       └── package.json
├── sst.config.ts               # SST infrastructure configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account (for deployment)
- AWS CLI configured with appropriate credentials

### Installation

1. Install dependencies:

```bash
npm install
```

2. Install Lambda function dependencies:

```bash
cd packages/functions
npm install
cd ../..
```

### Development

Run the development server with SST:

```bash
npm run dev
```

This will:

- Start the Next.js dev server on `http://localhost:3000`
- Deploy a temporary SST stack for local development
- Connect your local app to real AWS resources (Aurora PostgreSQL, S3, VPC, etc.)

The SST CLI will automatically create the required AWS resources in your account.

#### Database Setup

After the first deployment, you need to initialize the database schema:

1. Connect to your Aurora PostgreSQL database using the credentials from SST
2. Run the schema file located at `packages/functions/src/schema.sql`

You can use the AWS RDS Query Editor or a PostgreSQL client to execute the schema.

### Building for Production

Build the application:

```bash
npm run build
```

### Deployment

Deploy to development stage:

```bash
npm run deploy:dev
```

Deploy to production:

```bash
npm run deploy
```

Remove deployed resources:

```bash
npm run remove
```

## API Endpoints

The application provides the following API endpoints:

### Deals

- `GET /deals` - List all deals (with optional filters)
- `POST /deals` - Create a new deal
- `GET /deals/{id}` - Get deal details
- `PUT /deals/{id}` - Update a deal
- `DELETE /deals/{id}` - Delete a deal

### Documents

- `GET /documents` - List documents (with optional dealId filter)
- `POST /documents` - Initiate document upload (returns presigned URL)
- `GET /documents/{id}` - Get document details and download URL
- `DELETE /documents/{id}` - Delete a document

### Conversations

- `GET /conversations` - List conversations
- `POST /conversations` - Create a new conversation
- `GET /conversations/{id}/messages` - Get messages in a conversation
- `POST /conversations/{id}/messages` - Send a message

## Infrastructure

The application uses SST to manage AWS infrastructure as code:

- **API Gateway**: HTTP API for RESTful endpoints
- **Lambda Functions**: Serverless compute for API handlers
- **Aurora PostgreSQL**: Serverless v2 database cluster with the following tables:
  - deals: Store deal information with customer and vehicle data
  - documents: Store document metadata with S3 references
  - conversations: Store conversation data with participants
  - messages: Store messages within conversations
- **VPC**: Virtual Private Cloud for secure database access
- **S3 Bucket**: Store uploaded documents with presigned URLs
- **Next.js on AWS**: Serverless Next.js deployment

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For production, set `DOMAIN_NAME` in your deployment environment.

## Features

- **Dealer Dashboard**: Manage active deals and track document collection
- **Consumer Portal**: Allow customers to upload documents
- **Document Management**: View, organize, and manage documents
- **Conversation Interface**: Chat with customers about deals
- **Real-time Updates**: Track deal status and pending documents
- **Secure File Upload**: S3 presigned URLs for secure document uploads

## CI/CD Pipeline

The project includes GitHub Actions workflows for automated deployment:

- **CI Workflow**: Type checking and builds on every PR
- **Dev Deployment**: Auto-deploys to dev on push to `develop` branch
- **Production Deployment**: Auto-deploys to production on push to `main` branch

**Setup Required**: Configure AWS OIDC authentication. See `AWS_OIDC_SETUP.md` for instructions.

## Database Migration

This project uses Aurora PostgreSQL. If you're setting up from scratch or migrating from DynamoDB:

- [PostgreSQL Migration Guide](./POSTGRES_MIGRATION.md) - Complete migration instructions
- [Migration Summary](./MIGRATION_SUMMARY.md) - Overview of changes made

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [SST Documentation](https://sst.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [AWS OIDC Setup](./AWS_OIDC_SETUP.md)

## License

Private - All rights reserved
