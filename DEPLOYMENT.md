# Deployment Guide

This guide covers deploying the StipChaser application using SST (Serverless Stack).

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI with your credentials
3. **Node.js**: Version 18 or higher
4. **IAM Permissions**: Your AWS user needs permissions to create:
   - Lambda functions
   - API Gateway
   - DynamoDB tables
   - S3 buckets
   - CloudFormation stacks
   - IAM roles and policies

## AWS Configuration

### 1. Configure AWS Credentials

```bash
aws configure
```

Enter your:

- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (e.g., `json`)

### 2. Verify Configuration

```bash
aws sts get-caller-identity
```

This should return your AWS account information.

## Deployment Stages

SST supports multiple deployment stages (environments):

- **dev**: Development environment
- **staging**: Staging/QA environment
- **production**: Production environment

Each stage deploys completely separate resources.

## Development Deployment

### Start Local Development

```bash
npm run dev
```

This command:

1. Deploys a temporary SST stack to AWS
2. Creates all required resources (DynamoDB, S3, Lambda, etc.)
3. Starts Next.js dev server on `http://localhost:3000`
4. Watches for changes and hot-reloads

**Note**: The dev stack creates real AWS resources. You'll be able to see them in your AWS console prefixed with your stage name.

### Access SST Console

While `npm run dev` is running, you can access the SST Console:

```bash
npm run console
```

This opens a web interface where you can:

- View all deployed resources
- Monitor Lambda function logs
- Test API endpoints
- Inspect DynamoDB tables
- View S3 bucket contents

## Production Deployment

### 1. Deploy to Staging

First, deploy to a staging environment to test:

```bash
npm run deploy:dev
# or
sst deploy --stage staging
```

This deploys a complete stack with all resources to the staging stage.

### 2. Test Staging Deployment

After deployment, SST will output URLs:

```
✔  Complete
   api: https://xxxxx.execute-api.us-east-1.amazonaws.com
   web: https://xxxxx.cloudfront.net
```

Visit the web URL to test your staging deployment.

### 3. Deploy to Production

Once staging is tested and working:

```bash
npm run deploy
# or
sst deploy --stage production
```

**Important**: Production stage uses "retain" removal policy, which means resources won't be automatically deleted if you remove the stack. This is a safety feature.

## Environment Variables

### Development (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Production

For production, environment variables are set in `sst.config.ts`:

```typescript
const web = new sst.aws.Nextjs("StipChaserWeb", {
  environment: {
    NEXT_PUBLIC_API_URL: api.url,
  },
});
```

The API URL is automatically set to your deployed API Gateway URL.

## Custom Domain Setup

To use a custom domain (e.g., stipchaser.com):

### 1. Update sst.config.ts

```typescript
const web = new sst.aws.Nextjs("StipChaserWeb", {
  domain: {
    name: "stipchaser.com",
    // If using Cloudflare DNS:
    dns: sst.cloudflare.dns(),
    // Or if using AWS Route53:
    // dns: sst.aws.dns()
  },
  environment: {
    NEXT_PUBLIC_API_URL: api.url,
  },
});
```

### 2. Deploy with Domain

```bash
sst deploy --stage production
```

SST will:

1. Create/use an SSL certificate
2. Set up CloudFront distribution
3. Configure DNS records (if using supported DNS provider)

## Monitoring and Logs

### View Lambda Logs

```bash
# View logs for a specific function
sst logs --function StipChaserApi --stage production

# Tail logs in real-time
sst logs --function StipChaserApi --stage production --tail
```

### CloudWatch Logs

All Lambda functions automatically log to CloudWatch. Access them via:

- AWS Console → CloudWatch → Log Groups
- Log group name format: `/aws/lambda/stipchaser-{stage}-{function-name}`

### Metrics

Monitor your application via:

- **API Gateway**: Request count, latency, errors
- **Lambda**: Invocations, duration, errors, throttles
- **DynamoDB**: Read/write capacity, throttled requests
- **S3**: Request count, bandwidth

Access metrics in AWS Console → CloudWatch → Metrics.

## Database Management

### Access DynamoDB Tables

Tables are named: `stipchaser-{stage}-{table-name}`

Access via:

- AWS Console → DynamoDB → Tables
- SST Console (when running `npm run console`)

### Backup Strategy

Consider setting up:

1. **Point-in-time Recovery**: Enable in DynamoDB settings
2. **On-demand Backups**: Create before major deployments
3. **Cross-region Replication**: For disaster recovery

## S3 Bucket Management

### Document Storage

Documents are stored in: `stipchaser-{stage}-documents`

### Backup and Lifecycle

Configure in S3 settings:

1. **Versioning**: Enable for document history
2. **Lifecycle Rules**: Archive old documents to Glacier
3. **Cross-region Replication**: For disaster recovery

## Cost Management

### Estimated Costs

Development/Low Traffic:

- Lambda: ~$0 (generous free tier)
- API Gateway: ~$1-5/month
- DynamoDB: ~$1-5/month (on-demand pricing)
- S3: ~$1-5/month
- Total: ~$5-15/month

Production/High Traffic:

- Costs scale with usage
- Monitor via AWS Cost Explorer

### Cost Optimization

1. **DynamoDB**: Use on-demand pricing for unpredictable traffic
2. **S3**: Use lifecycle policies to archive old documents
3. **Lambda**: Optimize function memory and execution time
4. **API Gateway**: Use caching for frequently accessed endpoints

## Removal/Cleanup

### Remove Development Stack

```bash
sst remove --stage dev
```

This deletes all resources for the dev stage.

### Remove Staging Stack

```bash
sst remove --stage staging
```

### Remove Production Stack

```bash
# Be very careful with production!
sst remove --stage production
```

**Note**: Production stage uses "retain" policy, so DynamoDB tables and S3 buckets will NOT be deleted automatically. You'll need to delete them manually if desired.

## Continuous Deployment (CI/CD)

### GitHub Actions with OIDC (Recommended)

We use **OIDC (OpenID Connect)** for secure authentication with AWS. This is more secure than storing AWS credentials as secrets.

**✅ Benefits:**

- No long-lived credentials stored in GitHub
- Automatic token rotation
- Better audit trail
- AWS best practice

**Workflows Included:**

1. **`.github/workflows/ci.yml`** - Runs on every PR

   - Type checking
   - Build verification
   - Security scanning

2. **`.github/workflows/deploy-dev.yml`** - Deploys to dev

   - Triggers on push to `develop` branch
   - Deploys to AWS dev environment

3. **`.github/workflows/deploy-production.yml`** - Deploys to production

   - Triggers on push to `main` branch
   - Deploys to AWS production environment
   - Requires manual approval

4. **`.github/workflows/remove-dev.yml`** - Removes dev environment
   - Manual trigger only
   - Requires confirmation

### Setup OIDC with AWS

**See `AWS_OIDC_SETUP.md` for complete setup guide.**

Quick steps:

1. **Create OIDC Provider in AWS:**

   ```bash
   aws iam create-open-id-connect-provider \
     --url https://token.actions.githubusercontent.com \
     --client-id-list sts.amazonaws.com \
     --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
   ```

2. **Create IAM Role with Trust Policy:**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:YOUR_USERNAME/stipchaser:*"
           }
         }
       }
     ]
   }
   ```

3. **Attach Permissions to Role:**

   - CloudFormation, Lambda, DynamoDB, S3, API Gateway, IAM, etc.

4. **Add Role ARN to GitHub Secrets:**
   - Go to: Settings → Secrets and variables → Actions
   - Add secret: `AWS_ROLE_ARN` with value: `arn:aws:iam::ACCOUNT_ID:role/RoleName`
   - For production, add: `AWS_ROLE_ARN_PROD`

### Trigger Deployment

**Automatic:**

```bash
# Deploy to dev
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git push origin main
```

**Manual:**

- Go to Actions tab in GitHub
- Select workflow
- Click "Run workflow"

## Troubleshooting

### Deployment Fails

1. Check AWS credentials: `aws sts get-caller-identity`
2. Check IAM permissions
3. Check CloudFormation stack events in AWS Console
4. Review error messages in terminal

### Function Errors

1. Check CloudWatch Logs
2. Use SST Console to view logs and test functions
3. Check environment variables in Lambda console

### DNS Issues

1. Verify domain ownership
2. Check DNS propagation (can take up to 48 hours)
3. Verify SSL certificate status in AWS Certificate Manager

## Support

- **SST Discord**: https://sst.dev/discord
- **SST Documentation**: https://sst.dev/docs
- **AWS Support**: https://console.aws.amazon.com/support

## Security Best Practices

1. **API Gateway**: Enable throttling and rate limiting
2. **Lambda**: Use least-privilege IAM roles
3. **S3**: Enable encryption at rest
4. **DynamoDB**: Enable encryption at rest
5. **Environment Variables**: Use AWS Secrets Manager for sensitive data
6. **CORS**: Configure appropriate origins (don't use "\*" in production)

Update CORS in `sst.config.ts`:

```typescript
const api = new sst.aws.ApiGatewayV2("StipChaserApi", {
  cors: {
    allowOrigins: ["https://stipchaser.com"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowCredentials: true,
  },
});
```
