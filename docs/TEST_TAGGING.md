# Test Tagging and Filtering

A comprehensive test tagging system that allows you to run specific test suites based on tags like smoke, regression, critical, etc.

## 🏷️ Available Tags

### Core Tags
- **smoke** - Critical functionality tests that must pass
- **regression** - Comprehensive tests for existing functionality
- **critical** - High-priority tests that are essential
- **integration** - End-to-end integration tests
- **api** - Backend API tests
- **ui** - Frontend UI tests
- **visual** - Visual regression and screenshot tests

### Quality Tags
- **slow** - Tests that take longer to execute
- **flaky** - Tests that are known to be unstable
- **performance** - Performance and load tests
- **stable** - Reliable tests that rarely fail

### Feature Tags
- **responsive** - Mobile/tablet/desktop responsive tests
- **mobile** - Mobile-specific tests
- **desktop** - Desktop-specific tests
- **data-generation** - Test data generation tests
- **unit** - Unit-level tests

## 🚀 Usage

### Basic Tag Commands

```bash
# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run API tests
npm run test:api

# Run UI tests
npm run test:ui

# Run visual tests
npm run test:visual

# Run fast tests (exclude slow tests)
npm run test:fast

# Run stable tests (exclude flaky tests)
npm run test:stable
```

### Advanced Tag Filtering

```bash
# Run tests with specific tags
CYPRESS_TAGS=smoke,critical npm run cypress:run

# Exclude specific tags
CYPRESS_EXCLUDE_TAGS=slow,flaky npm run cypress:run

# Run tests with multiple tag conditions
CYPRESS_TAGS=api,backend CYPRESS_EXCLUDE_TAGS=slow npm run cypress:run

# Use the tagged test runner
npm run test:tagged -- --tags smoke,critical
npm run test:tagged -- --exclude-tags slow,flaky
npm run test:tagged -- --preset smoke
```

### Custom Tag Runner

```bash
# List all available tags and presets
npm run test:list-tags

# Run with specific browser
npm run test:tagged -- --tags smoke --browser firefox

# Run in headed mode
npm run test:tagged -- --tags regression --headed

# Run specific test files with tags
npm run test:tagged -- --tags api --spec "cypress/e2e/api/**/*.spec.ts"
```

## 🛠️ Adding Tags to Tests

### Using Convenience Methods

```typescript
describe('My Test Suite', () => {
  it('should perform critical functionality', () => {
    cy.smoke(); // Adds 'smoke' and 'critical' tags
    // Test implementation
  });

  it('should test API endpoints', () => {
    cy.api(); // Adds 'api' and 'backend' tags
    // Test implementation
  });

  it('should test UI components', () => {
    cy.ui(); // Adds 'ui' and 'frontend' tags
    // Test implementation
  });

  it('should test visual elements', () => {
    cy.visual(); // Adds 'visual' and 'screenshot' tags
    // Test implementation
  });

  it('should test performance', () => {
    cy.tag('performance', 'slow'); // Custom tags
    // Test implementation
  });
});
```

### Using Custom Tags

```typescript
describe('Feature Tests', () => {
  it('should handle user authentication', () => {
    cy.tag('auth', 'security', 'critical');
    // Test implementation
  });

  it('should test mobile responsiveness', () => {
    cy.tag('responsive', 'mobile', 'ui');
    // Test implementation
  });

  it('should generate test data', () => {
    cy.tag('data-generation', 'unit');
    // Test implementation
  });
});
```

### Tag Filtering in Tests

```typescript
describe('Filtered Test Suite', () => {
  beforeEach(() => {
    // Apply tag filtering
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
  });

  it('should run only if smoke tag is present', () => {
    cy.smoke();
    // Test implementation
  });
});
```

## ⚙️ Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Include specific tags
CYPRESS_TAGS=smoke,critical

# Exclude specific tags
CYPRESS_EXCLUDE_TAGS=slow,flaky

# Require all tags to match
CYPRESS_REQUIRE_ALL_TAGS=true
```

### Cypress Configuration

The tagging system is automatically configured in `cypress.config.ts`:

```typescript
env: {
  TAGS: process.env.CYPRESS_TAGS || '',
  EXCLUDE_TAGS: process.env.CYPRESS_EXCLUDE_TAGS || '',
  REQUIRE_ALL_TAGS: process.env.CYPRESS_REQUIRE_ALL_TAGS || 'false',
}
```

## 📋 Tag Presets

### Predefined Presets

```bash
# Smoke tests (smoke, critical)
npm run test:tagged -- --preset smoke

# Regression tests (regression, comprehensive)
npm run test:tagged -- --preset regression

# API tests (api, backend)
npm run test:tagged -- --preset api

# UI tests (ui, frontend)
npm run test:tagged -- --preset ui

# Visual tests (visual, screenshot)
npm run test:tagged -- --preset visual

# Fast tests (exclude slow, performance)
npm run test:tagged -- --preset fast

# Stable tests (exclude flaky, unstable)
npm run test:tagged -- --preset stable

# E2E tests (e2e, integration)
npm run test:tagged -- --preset e2e

# Performance tests (performance, slow)
npm run test:tagged -- --preset performance
```

## 🎯 Best Practices

### Tag Naming Conventions

1. **Use lowercase with hyphens**: `user-auth`, `api-integration`
2. **Be descriptive**: `critical`, `smoke`, `regression`
3. **Group related tags**: `ui`, `frontend`, `visual`
4. **Use consistent naming**: `api` not `API` or `Api`

### Tag Organization

```typescript
// Good: Clear, descriptive tags
cy.tag('user-authentication', 'critical', 'smoke');

// Good: Use convenience methods for common tags
cy.smoke();
cy.api();
cy.visual();

// Avoid: Vague or unclear tags
cy.tag('test', 'check', 'verify');
```

### Test Structure

```typescript
describe('User Management', () => {
  beforeEach(() => {
    // Apply tag filtering at suite level
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
  });

  it('should create new user', () => {
    cy.smoke(); // Critical functionality
    // Test implementation
  });

  it('should validate user input', () => {
    cy.regression(); // Comprehensive testing
    // Test implementation
  });

  it('should handle API errors gracefully', () => {
    cy.tag('api', 'error-handling', 'integration');
    // Test implementation
  });
});
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Tagged Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:smoke
        env:
          CYPRESS_TAGS: smoke,critical

  regression-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:regression
        env:
          CYPRESS_TAGS: regression,comprehensive
```

### Jenkins Pipeline

```groovy
pipeline {
  agent any
  stages {
    stage('Smoke Tests') {
      steps {
        sh 'npm run test:smoke'
      }
    }
    stage('Regression Tests') {
      steps {
        sh 'npm run test:regression'
      }
    }
    stage('API Tests') {
      steps {
        sh 'npm run test:api'
      }
    }
  }
}
```

## 📊 Test Reporting

### Tag-based Reports

The framework generates reports that include tag information:

```bash
# Generate reports with tag information
npm run report

# Reports will show which tests ran based on tags
# and include tag metadata in the results
```

### Custom Reporting

```typescript
// Add tag information to custom reports
afterEach(() => {
  const testTags = Cypress.env('CURRENT_TEST_TAGS') || [];
  cy.log(`Test tags: ${testTags.join(', ')}`);
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Tests not running**: Check if tags are correctly applied
2. **Wrong tests running**: Verify tag filtering logic
3. **Performance issues**: Use `--exclude-tags slow` for faster runs
4. **Flaky tests**: Use `--exclude-tags flaky` to skip unstable tests

### Debug Mode

```bash
# Run with debug logging
DEBUG=cypress:* npm run test:tagged -- --tags smoke

# Check which tests are being filtered
CYPRESS_TAGS=smoke npm run cypress:open
```

## 📚 Examples

### Complete Test Suite with Tags

```typescript
describe('E-commerce Application', () => {
  beforeEach(() => {
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
  });

  describe('User Authentication', () => {
    it('should login with valid credentials', () => {
      cy.smoke(); // Critical functionality
      // Test implementation
    });

    it('should handle invalid credentials', () => {
      cy.regression(); // Comprehensive testing
      // Test implementation
    });

    it('should validate password strength', () => {
      cy.tag('security', 'validation');
      // Test implementation
    });
  });

  describe('Product Catalog', () => {
    it('should display products', () => {
      cy.ui(); // UI testing
      // Test implementation
    });

    it('should filter products by category', () => {
      cy.tag('ui', 'filtering', 'regression');
      // Test implementation
    });

    it('should load product images', () => {
      cy.visual(); // Visual testing
      // Test implementation
    });
  });

  describe('API Endpoints', () => {
    it('should fetch product data', () => {
      cy.api(); // API testing
      // Test implementation
    });

    it('should handle API errors', () => {
      cy.tag('api', 'error-handling', 'integration');
      // Test implementation
    });
  });
});
```

---

The test tagging system provides powerful filtering capabilities for running specific test suites, making it easy to organize and execute tests based on their purpose, priority, and characteristics.
