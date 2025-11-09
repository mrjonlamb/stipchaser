# Next Steps - PostgreSQL Migration

## ✅ Migration Complete!

Your StipChaser application has been successfully migrated from DynamoDB to Aurora PostgreSQL.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd packages/functions
npm install
cd ../..
```

### Step 2: Deploy Infrastructure

```bash
npm run deploy:dev
```

⏱️ This will take 10-15 minutes for the first deployment (VPC + Aurora setup)

### Step 3: Initialize Database Schema

After deployment completes:

1. Go to [AWS Console → RDS → Query Editor](https://console.aws.amazon.com/rds/)
2. Select your `StipChaserDB` cluster
3. Connect with the auto-generated credentials
4. Copy/paste the contents of `packages/functions/src/schema.sql`
5. Execute the SQL

## 🧪 Test Your Application

```bash
npm run dev
```

Then test the API endpoints:

- GET http://localhost:3000/api/deals
- POST http://localhost:3000/api/deals
- GET http://localhost:3000/api/documents
- GET http://localhost:3000/api/conversations

## 📚 Documentation

- **[POSTGRES_MIGRATION.md](./POSTGRES_MIGRATION.md)** - Complete migration guide with troubleshooting
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Technical details of all changes made
- **[README.md](./README.md)** - Updated project documentation

## 🔍 What Changed?

### Files Modified: 17

- `sst.config.ts` - Infrastructure configuration
- `packages/functions/package.json` - Dependencies
- All Lambda functions (13 files)
- `README.md` - Documentation

### Files Created: 3

- `packages/functions/src/schema.sql` - Database schema
- `packages/functions/src/db.ts` - Database utility
- Migration documentation files

## 💡 Key Benefits

✓ **Relational Data**: Foreign keys ensure data integrity  
✓ **Complex Queries**: Full SQL with JOINs and subqueries  
✓ **ACID Transactions**: Reliable multi-table operations  
✓ **Better Analytics**: Complex aggregations and reporting  
✓ **Flexible Schema**: JSONB for nested data with indexing

## 💰 Cost Estimate

**Development Environment:**

- Aurora Serverless v2: ~$43/month (minimum 0.5 ACU)
- NAT Gateway: ~$32/month
- Data Transfer: Varies
- **Total: ~$75/month minimum**

For production, consider Reserved Capacity or adjust ACU limits.

## ⚠️ Important Notes

1. **VPC Required**: Lambda functions now run in VPC for database access
2. **Cold Starts**: Slightly longer due to VPC ENI creation (~1-2 seconds)
3. **Connection Pooling**: Implemented in `db.ts` for performance
4. **Schema First**: Database schema must be initialized before use

## 🐛 Troubleshooting

### Lambda Timeout?

- Check NAT Gateway is running
- Verify security groups allow port 5432
- Check CloudWatch logs

### Connection Failed?

- Ensure database is active in SST console
- Verify Lambda VPC configuration
- Check database credentials

### Need Help?

Check the detailed troubleshooting section in `POSTGRES_MIGRATION.md`

## 🔄 Rollback (if needed)

If you encounter critical issues:

```bash
# Restore previous commit
git checkout <previous-commit-hash>

# Redeploy
npm run deploy:dev

# Remove PostgreSQL resources
npm run remove
```

Your DynamoDB tables remain unchanged as backup.

## ✨ You're All Set!

The migration is complete. Follow the 3 steps above to get your PostgreSQL-powered StipChaser running!

For detailed information, see [POSTGRES_MIGRATION.md](./POSTGRES_MIGRATION.md).
