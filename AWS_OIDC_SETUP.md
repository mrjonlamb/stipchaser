# AWS OIDC Setup Guide for GitHub Actions

This guide will help you set up OpenID Connect (OIDC) authentication between GitHub Actions and AWS, which is more secure than using long-lived AWS credentials.

## Why OIDC?

✅ **More Secure**: No long-lived credentials stored in GitHub
✅ **Automatic Rotation**: Credentials are short-lived tokens
✅ **Audit Trail**: Better tracking of which workflow accessed AWS
✅ **Best Practice**: Recommended by both AWS and GitHub

## Prerequisites

- AWS Account with admin access
- GitHub repository created
- AWS CLI installed and configured

## Step 1: Create OIDC Provider in AWS

### Using AWS Console

1. **Go to IAM Console**

   - Navigate to: https://console.aws.amazon.com/iam/

2. **Add Identity Provider**

   - Click **Identity providers** in the left menu
   - Click **Add provider**
   - Select **OpenID Connect**

3. **Configure Provider**

   ```
   Provider URL: https://token.actions.githubusercontent.com
   Audience: sts.amazonaws.com
   ```

4. **Get Thumbprint**

   - Click **Get thumbprint** (AWS will auto-fetch it)

5. **Add Provider**
   - Click **Add provider**

### Using AWS CLI

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

**Note**: The thumbprint may change. Verify at: https://github.blog/changelog/2023-06-27-github-actions-update-on-oidc-integration-with-aws/

## Step 2: Create IAM Role for GitHub Actions

### Option A: Using AWS Console

1. **Create Role**

   - Go to IAM → Roles → Create role
   - Select **Web identity**
   - Identity provider: `token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. **Add Permissions**

   - Attach policies or create custom policy (see below)

3. **Name the Role**

   - Name: `GitHubActions-StipChaser-Dev`
   - Description: `Role for GitHub Actions to deploy StipChaser to dev`

4. **Edit Trust Policy**
   - After creation, edit the trust policy (see below)

### Option B: Using AWS CLI

Create a trust policy file `trust-policy.json`:

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
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/stipchaser:*"
        }
      }
    }
  ]
}
```

**Replace**:

- `YOUR_ACCOUNT_ID` with your AWS account ID
- `YOUR_GITHUB_USERNAME` with your GitHub username or organization

Create the role:

```bash
aws iam create-role \
  --role-name GitHubActions-StipChaser-Dev \
  --assume-role-policy-document file://trust-policy.json \
  --description "Role for GitHub Actions to deploy StipChaser"
```

## Step 3: Attach Permissions to the Role

### Required Permissions for SST Deployment

Create a policy file `sst-permissions.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "lambda:*",
        "dynamodb:*",
        "apigateway:*",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:PassRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "logs:CreateLogGroup",
        "logs:DeleteLogGroup",
        "logs:DescribeLogGroups",
        "logs:PutRetentionPolicy",
        "sts:GetCallerIdentity",
        "cloudfront:*",
        "acm:*",
        "route53:*",
        "ssm:GetParameter",
        "ssm:PutParameter",
        "ssm:DeleteParameter"
      ],
      "Resource": "*"
    }
  ]
}
```

**Create and attach the policy:**

```bash
# Create the policy
aws iam create-policy \
  --policy-name SSTDeploymentPolicy \
  --policy-document file://sst-permissions.json

# Attach to role
aws iam attach-role-policy \
  --role-name GitHubActions-StipChaser-Dev \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/SSTDeploymentPolicy
```

### Or use AWS Managed Policies (Less Restrictive)

```bash
aws iam attach-role-policy \
  --role-name GitHubActions-StipChaser-Dev \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

⚠️ **Warning**: `AdministratorAccess` gives full access. Use only for testing, then create a least-privilege policy.

## Step 4: Create Production Role (Optional)

For production, create a separate role:

```bash
aws iam create-role \
  --role-name GitHubActions-StipChaser-Prod \
  --assume-role-policy-document file://trust-policy-prod.json
```

Update `trust-policy-prod.json` to restrict to main branch:

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
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/stipchaser:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

## Step 5: Add Secrets to GitHub

1. **Go to GitHub Repository**

   - Navigate to: `https://github.com/YOUR_USERNAME/stipchaser`

2. **Add Repository Secrets**

   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**

3. **Add the following secrets:**

   **For Development:**

   ```
   Name: AWS_ROLE_ARN
   Value: arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActions-StipChaser-Dev
   ```

   **For Production:**

   ```
   Name: AWS_ROLE_ARN_PROD
   Value: arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActions-StipChaser-Prod
   ```

## Step 6: Test the Setup

1. **Push to develop branch:**

   ```bash
   git checkout -b develop
   git push origin develop
   ```

2. **Check GitHub Actions**

   - Go to **Actions** tab in GitHub
   - Watch the workflow run
   - Verify it successfully authenticates with AWS

3. **Check AWS CloudFormation**
   - Go to AWS Console → CloudFormation
   - Verify stack is created

## Troubleshooting

### Error: "Not authorized to perform sts:AssumeRoleWithWebIdentity"

**Solution**: Check trust policy in IAM role. Ensure:

- Repository name matches exactly
- OIDC provider is correctly configured
- Audience is `sts.amazonaws.com`

### Error: "Access Denied" during deployment

**Solution**: Role needs more permissions. Check:

- Attached policies include required services
- IAM role has PassRole permission
- CloudFormation can create resources

### Error: "Invalid identity token"

**Solution**:

- Verify OIDC provider thumbprint is correct
- Check provider URL is exactly: `https://token.actions.githubusercontent.com`

### Error: "Failed to assume role"

**Solution**: Check that:

- Role ARN in GitHub secrets is correct
- Trust policy allows your repository
- Branch name matches trust policy condition (if specified)

## Security Best Practices

1. **Least Privilege**: Only grant permissions needed for deployment
2. **Branch Restrictions**: Limit production role to main branch only
3. **Environment Restrictions**: Use GitHub environments for additional protection
4. **Audit Logs**: Enable CloudTrail to track all API calls
5. **Regular Review**: Periodically review and update IAM policies

## Verify Your Setup

Run this checklist:

- [ ] OIDC provider created in AWS IAM
- [ ] IAM role created with trust policy
- [ ] Permissions attached to role
- [ ] Role ARN added to GitHub secrets
- [ ] Workflow permissions include `id-token: write`
- [ ] Test deployment successful
- [ ] CloudFormation stack created
- [ ] Lambda functions deployed
- [ ] DynamoDB tables created

## Get Role ARN

To get your role ARN:

```bash
aws iam get-role --role-name GitHubActions-StipChaser-Dev --query 'Role.Arn' --output text
```

This will output something like:

```
arn:aws:iam::123456789012:role/GitHubActions-StipChaser-Dev
```

Copy this value to your GitHub secrets.

## Additional Resources

- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS IAM OIDC Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [SST Deployment Guide](https://sst.dev/docs/going-to-production)

## Support

If you encounter issues:

1. Check AWS CloudTrail logs for detailed error messages
2. Review GitHub Actions logs
3. Consult SST documentation
4. Open an issue in the repository

---

**Next Steps**: After setup is complete, any push to `develop` or `main` branch will automatically deploy to AWS! 🚀
