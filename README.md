# StipChaser - Document Collection Platform

A Next.js application with serverless infrastructure for streamlining document collection in car dealerships.

## Tech Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS
- **Infrastructure**: SST (Serverless Stack)
- **Backend**: AWS Lambda + API Gateway
- **Database**: DynamoDB
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
- Connect your local app to real AWS resources (DynamoDB, S3, etc.)

The SST CLI will automatically create the required AWS resources in your account.

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
- **DynamoDB Tables**:
  - DealsTable: Store deal information
  - DocumentsTable: Store document metadata
  - ConversationsTable: Store conversation data
  - MessagesTable: Store messages
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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [SST Documentation](https://sst.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [AWS OIDC Setup](./AWS_OIDC_SETUP.md)

## License

Private - All rights reserved
