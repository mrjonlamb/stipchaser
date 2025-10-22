# Migration Guide: React (Vite) to Next.js with SST

This guide documents the migration from a React app using Vite to a Next.js app with SST (Serverless Stack) infrastructure.

## What Changed

### 1. Framework Migration

- **From**: React with Vite
- **To**: Next.js 15 with App Router

### 2. Infrastructure

- **Added**: SST for infrastructure as code
- **Added**: AWS Lambda functions for API endpoints
- **Added**: DynamoDB for data storage
- **Added**: S3 for document storage
- **Added**: API Gateway for RESTful APIs

### 3. Project Structure

```
Old Structure                    New Structure
├── src/                         ├── app/                    (Next.js pages)
│   ├── App.jsx                  │   ├── layout.jsx
│   ├── Routes.jsx               │   ├── page.jsx
│   ├── index.jsx                │   ├── login/
│   ├── pages/          →        │   ├── dealer-dashboard/
│   ├── components/     →        │   └── ...
│   └── styles/         →        ├── src/                    (Shared code)
├── public/             →        │   ├── components/
├── index.html                   │   ├── pages/
├── vite.config.mjs              │   └── styles/
└── package.json                 ├── packages/
                                 │   └── functions/          (Lambda handlers)
                                 ├── lib/
                                 │   └── api-client.ts       (API client)
                                 ├── sst.config.ts           (Infrastructure)
                                 ├── next.config.mjs
                                 └── package.json
```

## Breaking Changes

### 1. Routing

**Old (React Router):**

```jsx
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/path", { state: { data } });
```

**New (Next.js):**

```jsx
"use client";
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/path?data=" + encodeURIComponent(JSON.stringify(data)));
```

### 2. Client Components

All components using hooks or browser APIs must have `'use client'` directive:

```jsx
"use client";

import { useState } from "react";
// ... component code
```

### 3. Image Components

**Old:**

```jsx
<img src="/assets/image.png" alt="Image" />
```

**New (with optimization):**

```jsx
import Image from "next/image";
<Image src="/assets/image.png" alt="Image" width={500} height={300} />;
```

### 4. Environment Variables

- Must be prefixed with `NEXT_PUBLIC_` for client-side access
- `NEXT_PUBLIC_API_URL` instead of `VITE_API_URL`

### 5. Metadata

**Old (react-helmet):**

```jsx
import { Helmet } from "react-helmet";
<Helmet>
  <title>Page Title</title>
</Helmet>;
```

**New (Next.js metadata):**

```jsx
export const metadata = {
  title: "Page Title",
  description: "Description",
};
```

## New Features

### 1. API Routes with Lambda

The application now has serverless API endpoints:

- **Deals API**: `/deals/*`
- **Documents API**: `/documents/*`
- **Conversations API**: `/conversations/*`

### 2. Infrastructure as Code

All AWS resources are defined in `sst.config.ts`:

- DynamoDB tables
- S3 buckets
- Lambda functions
- API Gateway routes

### 3. API Client Library

Use the new API client in `lib/api-client.ts`:

```typescript
import { dealsAPI, documentsAPI, conversationsAPI } from "@/lib/api-client";

// List deals
const { deals } = await dealsAPI.list({ status: "pending" });

// Create deal
const { deal } = await dealsAPI.create(dealData);

// Upload document
const { uploadUrl, document } = await documentsAPI.initiateUpload({
  dealId: "deal-123",
  fileName: "document.pdf",
  fileType: "application/pdf",
});
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install main dependencies
npm install

# Install Lambda function dependencies
cd packages/functions
npm install
cd ../..
```

### 2. Configure AWS

```bash
# Install AWS CLI if not already installed
# Configure AWS credentials
aws configure
```

### 3. Run Development Server

```bash
npm run dev
```

This will:

- Start Next.js dev server on http://localhost:3000
- Deploy temporary SST stack
- Create AWS resources (DynamoDB, S3, etc.)

### 4. Deploy to Production

```bash
# Deploy to production
npm run deploy

# Or deploy to dev stage
npm run deploy:dev
```

## Files to Remove (Old Vite Setup)

After confirming everything works, you can remove:

- `vite.config.mjs`
- `index.html`
- `src/index.jsx` (replaced by app/layout.jsx)
- `src/App.jsx` (replaced by app structure)
- `src/Routes.jsx` (Next.js handles routing)

## Testing the Migration

1. **Test Pages**: Visit all pages to ensure they render correctly
2. **Test Navigation**: Click through the app to test routing
3. **Test API Calls**: Test CRUD operations with deals, documents, conversations
4. **Test Styles**: Verify Tailwind CSS works correctly
5. **Test Build**: Run `npm run build` to ensure production build works

## Common Issues

### Issue: "use client" directive missing

**Solution**: Add `'use client';` at the top of components using hooks or browser APIs

### Issue: Navigation state not working

**Solution**: Use query parameters instead of navigation state, or use localStorage for complex state

### Issue: API calls failing

**Solution**: Ensure `NEXT_PUBLIC_API_URL` is set in `.env.local` and SST is running (`npm run dev`)

### Issue: Images not loading

**Solution**: Images in `public/` folder should be referenced as `/image.png` (without public prefix)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [SST Documentation](https://sst.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [SST AWS Resources](https://sst.dev/docs/component/aws)

## Support

For issues or questions about the migration, refer to:

- Next.js Discord: https://nextjs.org/discord
- SST Discord: https://sst.dev/discord
