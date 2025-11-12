# AWS Cognito Authentication Setup Guide

## Overview

This guide walks you through setting up AWS Cognito authentication for StipChaser with role-based access control and multi-tenant dealership isolation.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Database Initialization](#database-initialization)
3. [Creating First Dealer Manager](#creating-first-dealer-manager)
4. [Testing Authentication](#testing-authentication)
5. [User Invitation Flow](#user-invitation-flow)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Lambda function dependencies
cd packages/functions
npm install
cd ../..
```

### Step 2: Deploy Infrastructure

Deploy the application to create Cognito User Pool and other AWS resources:

```bash
npm run deploy:dev
```

This will:

- Create AWS Cognito User Pool
- Set up User Groups (DealerManager, DealerStaff, Consumer)
- Deploy Lambda functions with VPC and database access
- Output Cognito User Pool ID and Client ID

**Important:** Save the output values:

- `auth.userPoolId`
- `auth.userPoolClientId`
- `auth.region`

---

## Database Initialization

### Step 1: Access RDS Query Editor

1. Go to [AWS Console → RDS → Query Editor](https://console.aws.amazon.com/rds/)
2. Select your `StipChaserDB` cluster
3. Connect using the auto-generated credentials (stored in AWS Secrets Manager)

### Step 2: Run Database Schema

Copy and paste the contents of `packages/functions/src/schema.sql` into the Query Editor and execute.

This creates:

- `dealerships` table
- `users` table
- Updated `deals`, `documents`, `conversations` tables with dealership relationships

### Step 3: Create First Dealership

Create a dealership record that will be associated with your first Dealer Manager:

```sql
INSERT INTO dealerships (id, name, status, created_at, updated_at)
VALUES (
  'DEALERSHIP-UUID-HERE',  -- Generate a UUID
  'Your Dealership Name',
  'active',
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);
```

**Important:** Save the dealership UUID - you'll need it in the next step.

---

## Creating First Dealer Manager

### Option 1: AWS Console (Recommended)

1. **Go to Cognito Console**

   - Navigate to [AWS Console → Cognito → User Pools](https://console.aws.amazon.com/cognito/)
   - Select `StipChaserUserPool`

2. **Create User**

   - Click "Create user"
   - Set username to the user's email address
   - Set email to the same email address
   - Check "Mark email as verified"
   - Set a temporary password (user must change on first login)
   - Click "Create user"

3. **Set Custom Attributes**

   - Select the created user
   - Go to "User attributes"
   - Add custom attributes:
     - `custom:role` = `DealerManager`
     - `custom:dealership_id` = `YOUR-DEALERSHIP-UUID`

4. **Add to DealerManager Group**

   - Go to "Group memberships"
   - Add user to `DealerManager` group

5. **Create Database Record**

   Go back to RDS Query Editor and run:

   ```sql
   INSERT INTO users (id, cognito_user_id, email, role, dealership_id, invited_by, status, created_at, updated_at)
   VALUES (
     'USER-UUID-HERE',           -- Generate a new UUID
     'COGNITO-USER-ID',          -- The Cognito User ID (sub) from Cognito console
     'manager@yourdealership.com',
     'DealerManager',
     'YOUR-DEALERSHIP-UUID',     -- From Step 3 above
     NULL,                       -- No inviter for first user
     'active',
     EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
     EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
   );
   ```

### Option 2: AWS CLI

```bash
# Set variables
USER_POOL_ID="your-user-pool-id"
EMAIL="manager@yourdealership.com"
DEALERSHIP_ID="your-dealership-uuid"
TEMP_PASSWORD="TempPassword123!"

# Create user
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username $EMAIL \
  --user-attributes \
    Name=email,Value=$EMAIL \
    Name=email_verified,Value=true \
    Name=custom:role,Value=DealerManager \
    Name=custom:dealership_id,Value=$DEALERSHIP_ID \
  --temporary-password $TEMP_PASSWORD \
  --message-action SUPPRESS

# Add to DealerManager group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id $USER_POOL_ID \
  --username $EMAIL \
  --group-name DealerManager

# Then create database record as shown in Option 1
```

---

## Testing Authentication

### Step 1: First Login

1. Navigate to your application: `http://localhost:3000` (or your deployed URL)
2. You'll be redirected to the login page
3. Enter the Dealer Manager email and temporary password
4. You'll be prompted to set a new password
5. After setting a new password, you'll be logged in and redirected to the Dealer Dashboard

### Step 2: Verify Access

Once logged in, verify that:

- You can access the Dealer Dashboard (`/dealer-dashboard`)
- You can access User Management (`/user-management`)
- You can see the "Invite User" button in User Management
- API calls include the authentication token (check browser DevTools Network tab)

### Step 3: Test User Invitation

1. Go to User Management page
2. Click "Invite User"
3. Fill in the form:
   - Email address
   - First and last name (optional)
   - Role (DealerStaff or Consumer)
4. Click "Send Invitation"
5. Cognito will send an email with temporary credentials

---

## User Invitation Flow

### For Dealer Managers

Dealer Managers can invite:

- Other Dealer Managers
- Dealer Staff
- Consumers

### For Dealer Staff

Dealer Staff can invite:

- Consumers only

### Invitation Process

1. **Invitation Created**

   - User record created in Cognito
   - User added to appropriate group
   - Custom attributes set (role, dealership_id)
   - Database record created

2. **Email Sent**

   - Cognito sends email with temporary password
   - User receives invitation email

3. **User Accepts**

   - User navigates to login page
   - Enters email and temporary password
   - Sets new permanent password
   - Logged in and redirected based on role

4. **Role-Based Access**
   - **Consumer** → `/consumer-portal`
   - **Dealer Staff** → `/dealer-dashboard`
   - **Dealer Manager** → `/dealer-dashboard`

---

## Multi-Tenancy & Data Isolation

### How It Works

1. **User Authentication**

   - User signs in with email/password
   - Cognito returns JWT tokens
   - Tokens include `custom:dealership_id` attribute

2. **API Requests**

   - Frontend includes JWT token in Authorization header
   - Lambda functions verify token and extract dealership_id
   - All database queries filter by dealership_id

3. **Data Access**
   - Users can ONLY see data from their dealership
   - Deals, documents, and conversations are automatically filtered
   - Cross-dealership access is prevented at the database level

### Security Features

- **JWT Token Verification**: All API requests verify Cognito JWT tokens
- **Dealership Isolation**: Database-level filtering prevents cross-tenant access
- **Role-Based Permissions**:
  - Managers can delete deals and users
  - Staff can create deals and invite consumers
  - Consumers can only view their assigned deals
- **Foreign Key Constraints**: Ensure referential integrity

---

## Troubleshooting

### Issue: "Authentication required" on API calls

**Solution:**

1. Check that user is logged in (check browser localStorage)
2. Verify JWT token is being sent in Authorization header
3. Check CloudWatch logs for Lambda functions
4. Ensure User Pool ID is correctly configured

### Issue: User can't log in with temporary password

**Solution:**

1. Verify user exists in Cognito console
2. Check email is marked as verified
3. Try resetting password through Cognito console
4. Check that custom attributes are set correctly

### Issue: "User not found in database"

**Solution:**

1. Verify database record was created for the user
2. Check that `cognito_user_id` matches the Cognito sub
3. Ensure dealership_id is valid and exists in dealerships table

### Issue: User sees no data after login

**Solution:**

1. Verify user's dealership_id matches dealership in database
2. Check that deals/documents have correct dealership_id
3. Review Lambda function logs for query errors
4. Ensure database foreign keys are properly set

### Issue: Can't invite users

**Solution:**

1. Verify you have correct role (Manager for Staff, Staff/Manager for Consumers)
2. Check Lambda function permissions for Cognito
3. Review CloudWatch logs for invite-user Lambda
4. Ensure email doesn't already exist in Cognito

---

## Environment Variables

Ensure these environment variables are properly set:

### Frontend (Next.js)

- `NEXT_PUBLIC_API_URL` - API Gateway URL
- `NEXT_PUBLIC_USER_POOL_ID` - Cognito User Pool ID
- `NEXT_PUBLIC_USER_POOL_CLIENT_ID` - Cognito User Pool Client ID
- `NEXT_PUBLIC_AWS_REGION` - AWS Region (default: us-east-1)

### Backend (Lambda Functions)

- `USER_POOL_ID` - Cognito User Pool ID
- `USER_POOL_CLIENT_ID` - Cognito User Pool Client ID (for invitations)
- `AWS_REGION` - AWS Region
- Database connection variables (automatically set by SST)

---

## Architecture Summary

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend)     │
└────────┬────────┘
         │ JWT Token
         ▼
┌─────────────────┐
│  API Gateway    │
│   + Lambda      │
└────────┬────────┘
         │ Verify JWT
         │ Extract dealership_id
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (RDS Aurora)  │
└─────────────────┘
         │
         │ Filter by dealership_id
         ▼
    [Data Response]
```

### Authentication Flow

```
User Login
  ↓
Cognito Sign In
  ↓
JWT Tokens (Access + ID)
  ↓
Store in Memory (Amplify)
  ↓
API Requests with Bearer Token
  ↓
Lambda Verifies JWT
  ↓
Extract user info (dealership_id, role, groups)
  ↓
Query Database with Filters
  ↓
Return Filtered Data
```

---

## Next Steps

After completing setup:

1. **Test all user flows**

   - Manager login
   - Staff invitation
   - Consumer invitation
   - Password reset

2. **Create more dealerships** (for testing multi-tenancy)

   - Insert new dealership record
   - Create manager for that dealership
   - Verify data isolation

3. **Customize invitation emails**

   - Configure Cognito email templates
   - Add branding and custom messages

4. **Set up production environment**

   - Deploy to production stage
   - Configure custom domain
   - Set up monitoring and alerts

5. **Review security settings**
   - Configure MFA requirements
   - Set password policies
   - Review IAM permissions

---

## Support

For issues or questions:

- Check Lambda function logs in CloudWatch
- Review RDS query logs
- Check browser console for frontend errors
- Verify Cognito user attributes are correct

## Testing Checklist

- [ ] Dealer Manager can log in
- [ ] Dealer Manager can invite Dealer Staff
- [ ] Dealer Manager can invite Consumers
- [ ] Dealer Staff can log in
- [ ] Dealer Staff can invite Consumers (but not Staff or Managers)
- [ ] Consumer can log in
- [ ] Consumer is redirected to consumer portal
- [ ] Data is filtered by dealership (test with multiple dealerships)
- [ ] Cross-dealership access is prevented
- [ ] Users can only see their own dealership's data
- [ ] Password reset flow works
- [ ] Token refresh works correctly
- [ ] Logout works and clears session
