1. Run: git status
2. Run: git diff --stat
3. Show every changed file and summarize what changed in each
4. Run: npm run build and report bundle size
5. Suggest a commit message in format: "feat: [what changed] | [bundle size]MB"
6. Wait for Brady to confirm or modify the message
7. Only then: git add . && git commit -m "[message]" && git push origin main
8. Report: "Pushed. Vercel is deploying. Check https://vercel.com/dashboard"
