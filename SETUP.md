# Setup Guide

This guide will help you set up the Cypress framework from scratch.

## Step 1: Install Node.js

Ensure you have Node.js v18 or higher installed:

```bash
node --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Cypress
- TypeScript
- All required plugins and dependencies

## Step 3: Verify Installation

```bash
npx cypress verify
```

You should see: "Cypress verified!"

## Step 4: Configure Environment

1. Update `cypress.config.ts` with your application's base URL:

```typescript
e2e: {
  baseUrl: 'https://your-app-url.com',
  // ...
}
```

2. Update API URL if needed:

```typescript
env: {
  apiUrl: 'https://your-api-url.com',
  // ...
}
```

3. Create environment-specific configs in `cypress/config/`:
   - `staging.json`
   - `production.json`
   - `local.json` (for local development)

## Step 5: Run Your First Test

```bash
# Open Cypress Test Runner
npm run cypress:open

# Or run headlessly
npm run cypress:run
```

## Step 6: Verify Test Reports

After running tests, generate reports:

```bash
npm run report
```

Reports will be available in `cypress/reports/html/`

## Troubleshooting

### Issue: Cypress not launching

**Solution**: Clear Cypress cache and reinstall:
```bash
npx cypress cache clear
npm install
```

### Issue: TypeScript errors

**Solution**: Verify TypeScript version:
```bash
npm list typescript
```

Update if needed:
```bash
npm install --save-dev typescript@latest
```

### Issue: Browser not found

**Solution**: Install browsers or use system browsers:
```bash
npx cypress install
```

### Issue: Tests timing out

**Solution**: Increase timeouts in `cypress.config.ts`:
```typescript
defaultCommandTimeout: 15000,
requestTimeout: 15000,
```

## Next Steps

- Review the [README.md](README.md) for usage examples
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Explore example tests in `cypress/e2e/`

## IDE Setup

### VS Code

Recommended extensions:
- ESLint
- Prettier
- Cypress Snippets
- TypeScript

### IntelliJ/WebStorm

Configure TypeScript:
- File → Settings → Languages & Frameworks → TypeScript
- Enable "Use TypeScript Service"

## CI/CD Setup

See `.github/workflows/` for GitHub Actions examples.

For other CI systems:
- CircleCI: Use `cypress/base` Docker images
- Jenkins: Use Node.js plugin with Cypress
- GitLab CI: Follow Cypress GitLab CI examples

