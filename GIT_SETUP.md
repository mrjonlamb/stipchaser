# Git Setup and Push to GitHub

Quick guide to push your codebase to GitHub.

## Initial Setup

```bash
# Navigate to your project
cd /Users/arav/Desktop/codebases/stipchaser

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Next.js + SST migration complete"

# Add your GitHub repository as remote
git remote add origin git@github.com:mrjonlamb/stipchaser.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Create and Push Develop Branch

```bash
# Create develop branch from main
git checkout -b develop

# Push develop branch
git push -u origin develop
```

## Verify

```bash
# Check remote is set correctly
git remote -v

# Check current branch
git branch

# Check status
git status
```

## Set Up Branch Protection (Recommended)

After pushing, go to GitHub and set up branch protection:

1. Go to: https://github.com/mrjonlamb/stipchaser/settings/branches
2. Add rule for `main` branch:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass (CI workflow)
   - ✅ Require branches to be up to date
3. Add rule for `develop` branch (optional)

This prevents direct pushes and ensures CI passes before merging.

## Done! 🎉

Your code is now on GitHub and ready for CI/CD workflows.

