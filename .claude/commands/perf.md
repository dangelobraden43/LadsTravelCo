1. Run: npm run build
2. Run: du -sh dist/assets/*.js | sort -rh | head -20
3. Run: du -sh dist/
4. Identify the 5 largest JS chunks by name and size
5. For each large chunk, identify what's inside it (which imports)
6. Report: current total, target (under 8MB), gap remaining
7. Suggest the single highest-impact next action to reduce bundle size
