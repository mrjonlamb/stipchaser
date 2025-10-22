# CI/CD Quick Start Guide

This is a quick reference for setting up GitHub Actions with AWS OIDC authentication.

## TL;DR

1. Create OIDC provider in AWS
2. Create IAM role with trust policy
3. Add permissions to role
4. Add role ARN to GitHub secrets
5. Push to `develop` or `main` branch

## Complete Setup (5 minutes)

### Step 1: Create OIDC Provider

Run in terminal:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### Step 2: Create Trust Policy

Create `trust-policy.json` (replace YOUR_ACCOUNT_ID and YOUR_USERNAME):

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

### Step 3: Create IAM Role

```bash
aws iam create-role \
  --role-name GitHubActions-StipChaser-Dev \
  --assume-role-policy-document file://trust-policy.json
```

### Step 4: Attach Permissions

**Quick (for testing):**

```bash
aws iam attach-role-policy \
  --role-name GitHubActions-StipChaser-Dev \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

**Or create custom policy** (recommended - see `AWS_OIDC_SETUP.md`)

### Step 5: Get Role ARN

```bash
aws iam get-role \
  --role-name GitHubActions-StipChaser-Dev \
  --query 'Role.Arn' \
  --output text
```

Copy the output (looks like: `arn:aws:iam::123456789012:role/GitHubActions-StipChaser-Dev`)

### Step 6: Add to GitHub Secrets

1. Go to: `https://github.com/YOUR_USERNAME/stipchaser/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `AWS_ROLE_ARN`
4. Value: [paste role ARN from step 5]
5. Click "Add secret"

### Step 7: Test It!

```bash
# Create develop branch if it doesn't exist
git checkout -b develop

# Make a small change
echo "# CI/CD Test" >> test.txt
git add test.txt
git commit -m "test: CI/CD setup"

# Push to trigger workflow
git push origin develop
```

Go to: `https://github.com/YOUR_USERNAME/stipchaser/actions`

You should see the workflow running! 🎉

## Workflows Available

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: Every PR and push to main/develop
**Does**:

- Type checking
- Build verification
- Security scan

### 2. Deploy Dev (`.github/workflows/deploy-dev.yml`)

**Triggers**: Push to `develop` branch
**Does**:

- Deploys to AWS dev environment
- Comments on PR with deployment info

### 3. Deploy Production (`.github/workflows/deploy-production.yml`)

**Triggers**: Push to `main` branch
**Does**:

- Deploys to AWS production environment
- Creates deployment summary

### 4. Remove Dev (`.github/workflows/remove-dev.yml`)

**Triggers**: Manual only
**Does**:

- Removes dev environment from AWS

## Quick Commands

```bash
# Deploy to dev
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git push origin main

# Check deployment status
# Go to: https://github.com/YOUR_USERNAME/stipchaser/actions

# Manual trigger (for production deployment)
# Go to Actions tab → Deploy to Production → Run workflow
```

## Troubleshooting

### "Not authorized to perform sts:AssumeRoleWithWebIdentity"

**Fix**: Check trust policy. Make sure:

- Repository name matches exactly
- OIDC provider exists in AWS
- Role ARN in GitHub secrets is correct

```bash
# Verify OIDC provider
aws iam list-open-id-connect-providers

# Verify role
aws iam get-role --role-name GitHubActions-StipChaser-Dev
```

### "Access Denied" during deployment

**Fix**: Role needs more permissions

```bash
# Attach AdministratorAccess (for testing)
aws iam attach-role-policy \
  --role-name GitHubActions-StipChaser-Dev \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### Workflow doesn't trigger

**Fix**: Check branch names

- Dev deploys from `develop` branch
- Production deploys from `main` branch

```bash
# Check current branch
git branch

# Switch to develop
git checkout develop
```

## Production Setup

For production, create a separate role:

```bash
# 1. Create production trust policy (trust-policy-prod.json)
# Restrict to main branch only by using:
# "token.actions.githubusercontent.com:sub": "repo:YOUR_USERNAME/stipchaser:ref:refs/heads/main"

# 2. Create role
aws iam create-role \
  --role-name GitHubActions-StipChaser-Prod \
  --assume-role-policy-document file://trust-policy-prod.json

# 3. Attach permissions
aws iam attach-role-policy \
  --role-name GitHubActions-StipChaser-Prod \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# 4. Get role ARN
aws iam get-role \
  --role-name GitHubActions-StipChaser-Prod \
  --query 'Role.Arn' \
  --output text

# 5. Add to GitHub secrets as AWS_ROLE_ARN_PROD
```

## Security Best Practices

✅ **Do**:

- Use separate roles for dev and production
- Restrict production role to main branch only
- Use least-privilege permissions (not AdministratorAccess)
- Enable branch protection for main
- Require reviews before merging to main

❌ **Don't**:

- Use AdministratorAccess in production (only for testing)
- Store AWS credentials in GitHub secrets
- Allow direct pushes to main branch

## Need More Help?

See the complete guide: `AWS_OIDC_SETUP.md`

## Verification Checklist

- [ ] OIDC provider created in AWS
- [ ] IAM role created with correct trust policy
- [ ] Permissions attached to role
- [ ] Role ARN added to GitHub secret `AWS_ROLE_ARN`
- [ ] Pushed to develop branch
- [ ] Workflow ran successfully in GitHub Actions
- [ ] Resources created in AWS CloudFormation

## Success! 🎉

Once your workflow runs successfully, you have:

- ✅ Automated deployments on every push
- ✅ Secure OIDC authentication (no stored credentials)
- ✅ Separate dev and production environments
- ✅ CI/CD pipeline ready for your team

**Happy deploying!** 🚀
