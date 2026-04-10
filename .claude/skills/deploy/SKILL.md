---
name: deploy
description: Deploy the Lads Travel Co site to GitHub and trigger Vercel deployment. Use when Brady says "deploy", "push", "go live", or "update the site".
---

# Deploy Workflow

## Steps
1. Stage all changed files: `git add .`
2. Show what's being committed: `git status`
3. Ask Brady for a commit message (or suggest one based on changes)
4. Commit: `git commit -m "message"`
5. Push: `git push origin main`
6. Confirm: Vercel auto-deploys on push. Check https://vercel.com/dashboard for build status.

## Rules
- Never force push
- Never push without showing the diff first
- Always confirm the commit message with Brady before committing
- If there are untracked files, list them and ask if they should be included
