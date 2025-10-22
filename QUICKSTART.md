# Quick Start Guide

Get your StipChaser Next.js + SST application up and running in minutes.

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ AWS Account created
- ✅ AWS CLI installed (`aws --version`)

## Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install Lambda function dependencies
cd packages/functions
npm install
cd ../..
```

## Step 2: Configure AWS

If you haven't configured AWS CLI yet:

```bash
aws configure
```

Enter your AWS credentials:

- AWS Access Key ID: [Your access key]
- AWS Secret Access Key: [Your secret key]
- Default region: us-east-1 (or your preferred region)
- Default output format: json

## Step 3: Start Development Server

```bash
npm run dev
```

This command will:

1. 🚀 Deploy AWS infrastructure (DynamoDB, S3, Lambda, API Gateway)
2. ⚡ Start Next.js dev server on http://localhost:3000
3. 🔄 Watch for changes and hot-reload

**First run might take 2-3 minutes** as SST creates all AWS resources.

## Step 4: Open Your Browser

Navigate to: http://localhost:3000

You should see the StipChaser login page!

## Step 5: Explore the Application

### Available Pages

1. **Login Page**: http://localhost:3000/login
2. **Dealer Dashboard**: http://localhost:3000/dealer-dashboard
3. **Consumer Portal**: http://localhost:3000/consumer-portal
4. **Document Management**: http://localhost:3000/document-management
5. **Conversation Interface**: http://localhost:3000/conversation-interface

### Test API Endpoints

While `npm run dev` is running, open a new terminal:

```bash
# Get your API URL from the SST output
# It will look like: https://xxxxx.execute-api.us-east-1.amazonaws.com

# Test listing deals
curl https://xxxxx.execute-api.us-east-1.amazonaws.com/deals

# Test creating a deal
curl -X POST https://xxxxx.execute-api.us-east-1.amazonaws.com/deals \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "John Doe",
      "phone": "(555) 123-4567",
      "email": "john@example.com"
    },
    "vehicle": {
      "year": "2024",
      "make": "Toyota",
      "model": "Camry",
      "vin": "1HGBH41JXMN109186"
    },
    "status": "pending",
    "priority": "high"
  }'
```

## Step 6: Access SST Console (Optional)

Open a new terminal window:

```bash
npm run console
```

This opens the SST Console where you can:

- 📊 View all deployed resources
- 📝 Monitor Lambda function logs
- 🧪 Test API endpoints
- 🗄️ Inspect DynamoDB tables
- 📦 View S3 bucket contents

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Deploy to development stage
npm run deploy:dev

# Deploy to production
npm run deploy

# Remove deployed resources
npm run remove

# Type checking
npm run typecheck
```

## Troubleshooting

### Issue: SST deployment fails

**Solution**: Check your AWS credentials and permissions

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Should return your AWS account info
```

### Issue: Port 3000 already in use

**Solution**: Kill the process or use a different port

```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or start on a different port
PORT=3001 npm run dev
```

### Issue: Module not found errors

**Solution**: Reinstall dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Also clean Lambda functions
cd packages/functions
rm -rf node_modules package-lock.json
npm install
cd ../..
```

### Issue: AWS resources not created

**Solution**: Check CloudFormation in AWS Console

1. Go to AWS Console → CloudFormation
2. Look for stack named `stipchaser-dev-*`
3. Check Events tab for errors

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `app/` or `src/` - hot reload is automatic
2. **Lambda Changes**: Edit files in `packages/functions/src/` - SST will redeploy automatically
3. **Infrastructure Changes**: Edit `sst.config.ts` - save and SST will update

### Testing Changes

```bash
# Run type checking
npm run typecheck

# Build to check for errors
npm run build
```

### Deploying Changes

```bash
# Deploy to dev environment
npm run deploy:dev

# Deploy to production (be careful!)
npm run deploy
```

## Next Steps

1. **Read the Migration Guide**: See `MIGRATION_GUIDE.md` for details on the architecture
2. **Read the Deployment Guide**: See `DEPLOYMENT.md` for production deployment
3. **Explore the Code**: Check out the Lambda functions in `packages/functions/src/`
4. **Customize**: Update branding, colors, and content for your needs

## API Documentation

### Deals API

```bash
# List all deals
GET /deals

# Get deal by ID
GET /deals/{id}

# Create new deal
POST /deals
Body: { customer, vehicle, status, priority }

# Update deal
PUT /deals/{id}
Body: { status, priority, etc. }

# Delete deal
DELETE /deals/{id}
```

### Documents API

```bash
# List documents for a deal
GET /documents?dealId={dealId}

# Initiate upload (returns presigned URL)
POST /documents
Body: { dealId, fileName, fileType, category }

# Get document
GET /documents/{id}

# Delete document
DELETE /documents/{id}
```

### Conversations API

```bash
# List conversations for a deal
GET /conversations?dealId={dealId}

# Create conversation
POST /conversations
Body: { dealId, participants }

# Get messages
GET /conversations/{id}/messages

# Send message
POST /conversations/{id}/messages
Body: { content, senderId, senderName, senderRole }
```

## Resources

- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 🔧 [SST Documentation](https://sst.dev)
- 🎨 [Tailwind CSS Documentation](https://tailwindcss.com)
- ☁️ [AWS Documentation](https://docs.aws.amazon.com)

## Support

- **Issues**: Create an issue in the repository
- **SST Discord**: https://sst.dev/discord
- **Next.js Discord**: https://nextjs.org/discord

## Happy Coding! 🚀

Your StipChaser application is now running with:

- ✅ Next.js 15 for frontend
- ✅ AWS Lambda for serverless backend
- ✅ DynamoDB for database
- ✅ S3 for file storage
- ✅ API Gateway for RESTful APIs
- ✅ Infrastructure as Code with SST

Start building amazing features! 🎉
