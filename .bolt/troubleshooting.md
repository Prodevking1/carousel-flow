# Troubleshooting

## Dev Server Issues

If you see import errors like "Failed to resolve import react-router-dom":

1. Stop the dev server (Ctrl+C)
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart the dev server

The build process works correctly - this is typically just a hot-reload caching issue.

## Quick Fixes

**Module resolution errors:**
```bash
rm -rf node_modules/.vite
npm install
```

**TypeScript errors:**
```bash
npm run typecheck
```

**Build verification:**
```bash
npm run build
```
