# Advanced Cypress Testing Framework

A comprehensive, enterprise-grade Cypress testing framework showcasing advanced automation skills and best practices for Upwork clients.

## 🚀 Features

### Core Framework
- **TypeScript Support**: Full TypeScript implementation for type safety and better developer experience
- **Page Object Model (POM)**: Scalable and maintainable test architecture
- **Custom Commands**: 50+ reusable commands for API, UI, and assertions
- **IntelliSense Support**: Full TypeScript IntelliSense for all custom commands
- **Type Safety**: Compile-time error checking and parameter validation

### Testing Capabilities
- **API Testing**: Comprehensive REST API testing with custom commands
- **Visual Regression Testing**: Screenshot-based visual testing with comparison
- **Cross-browser Testing**: Support for Chrome, Firefox, and Edge
- **Responsive Testing**: Test on multiple viewport sizes (mobile, tablet, desktop)
- **Data-Driven Testing**: JSON-based test data generation and management

### Advanced Features
- **Test Tagging**: Advanced test filtering with tags (smoke, regression, critical, etc.)
- **Tag-based Execution**: Run specific test suites based on tags and presets
- **Password Encryption**: Secure password storage using AES-256-GCM encryption
- **Environment Security**: Environment variables for sensitive data
- **JSON Data Generator**: Realistic test data generation using JSON templates
- **Data Templates**: Pre-built templates for users, products, orders, and more

### Reporting & CI/CD
- **Multiple Reporters**: JUnit XML and Mochawesome HTML reporting
- **CI/CD Integration**: GitHub Actions and Jenkins pipeline support
- **Advanced Reporting**: Interactive HTML reports with screenshots and videos
- **Test Result Tracking**: JUnit XML for CI/CD integration
- **Artifact Management**: Automated report generation and archiving

### Quality & Maintenance
- **Error Handling**: Robust error handling and retry mechanisms
- **Code Coverage**: Built-in code coverage support
- **Linting & Formatting**: ESLint and Prettier integration
- **Documentation**: Comprehensive guides and examples
- **Modular Architecture**: Easy to maintain and extend

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cypress-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   npm run setup-env
   ```

4. **Generate encrypted passwords**
   ```bash
   npm run encrypt-passwords
   ```

5. **Update .env file with your encrypted passwords**

6. **Verify Cypress installation**
   ```bash
   npx cypress verify
   ```

## 🎯 Quick Start

### Running Tests

#### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cypress:open
```

#### Run Tests Headlessly
```bash
npm run cypress:run
```

#### Run Tests in Specific Browser
```bash
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge
```

#### Run Specific Test Suites
```bash
# Run only API tests
npm run test:api

# Run only E2E UI tests
npm run test:e2e

# Run only visual regression tests
npm run test:visual
```

#### Generate Test Reports
```bash
npm run report
```

#### Encrypt Passwords
```bash
npm run encrypt-passwords
```

#### Setup Environment
```bash
npm run setup-env
```

#### Generate Test Data
```bash
# Generate users
npm run generate-users

# Generate products
npm run generate-products

# Generate orders
npm run generate-orders

# Custom generation
npm run generate-data user --count 50 --unique
```

#### Run Tests by Tags
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

# List all available tags
npm run test:list-tags

# Custom tag filtering
npm run test:tagged -- --tags smoke,critical
npm run test:tagged -- --exclude-tags slow,flaky
npm run test:tagged -- --preset smoke
```

Reports will be generated in `cypress/reports/html/`

## 📁 Project Structure

```
cypress-framework/
├── cypress/
│   ├── e2e/                    # E2E test files
│   │   ├── api/                # API tests
│   │   ├── ui/                 # UI tests
│   │   ├── visual/             # Visual regression tests
│   │   └── data/               # Data generation tests
│   ├── data/                   # Data generation templates
│   │   └── templates/          # JSON templates
│   │       ├── user.json
│   │       ├── product.json
│   │       └── order.json
│   ├── fixtures/               # Test data fixtures
│   │   ├── users.json
│   │   ├── api-responses.json
│   │   └── test-data.json
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── CommandsPage.ts
│   │   └── ActionsPage.ts
│   ├── support/                # Support files and custom commands
│   │   ├── e2e.ts
│   │   ├── commands.ts
│   │   ├── commands/
│   │   │   ├── api.ts
│   │   │   ├── ui.ts
│   │   │   └── assertions.ts
│   │   └── utils/
│   │       └── helpers.ts
│   └── utils/                  # Utility functions
│       ├── api-helper.ts
│       └── test-data-builder.ts
├── .github/
│   └── workflows/              # CI/CD workflows
│       ├── ci.yml
│       └── nightly.yml
├── cypress.config.ts           # Cypress configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
└── README.md
```

## 🏗️ Architecture

### Page Object Model (POM)

All page objects extend the `BasePage` class, providing common functionality:

```typescript
import { HomePage } from '@pages/HomePage';

const homePage = new HomePage();
homePage.visit();
homePage.clickCommandsLink();
```

### Custom Commands

#### API Commands
```typescript
cy.apiRequest('GET', '/users');
cy.apiGet('/users/1', { retries: 3 });
cy.apiPost('/users', { name: 'John', email: 'john@example.com' });
```

#### UI Commands
```typescript
cy.waitForElement('.button');
cy.clickWithRetry('.submit-btn');
cy.fillForm({ name: 'John', email: 'john@example.com' });
cy.setViewport('mobile');
```

#### Assertion Commands
```typescript
cy.shouldHaveStatus(200);
cy.shouldHaveClass('.button', 'active');
cy.shouldHaveUrlPath('/dashboard');
```

### Test Data Builders

Generate test data dynamically:

```typescript
import { TestDataBuilder } from '@utils/test-data-builder';

const userData = TestDataBuilder.user()
  .with('name', 'John Doe')
  .with('email', 'john@example.com')
  .build();
```

### Password Encryption

Secure password handling with AES-256-GCM encryption:

```typescript
import { getDecryptedPassword } from '@utils/password-encryption';

// Get decrypted password for authentication
const password = getDecryptedPassword('admin');

// Login with encrypted credentials
cy.loginWithEncrypted('admin');
```

### JSON Data Generator

Generate realistic test data using JSON templates:

```typescript
import { JSONDataGenerator } from '@utils/json-data-generator';

// Generate users
cy.generateUser({ count: 5, unique: true }).then((users) => {
  users.forEach(user => {
    cy.apiRequest('POST', '/users', user);
  });
});

// Generate and export data
cy.generateAndExport('product', 'test-products.json', { count: 20 });

// Load generated data
cy.loadGeneratedData('test-users.json').then((users) => {
  // Use the data in tests
});
```

### Test Tagging

Organize and filter tests using tags:

```typescript
// Mark tests with tags
it('should perform critical functionality', () => {
  cy.smoke(); // Adds 'smoke' and 'critical' tags
  // Test implementation
});

it('should test API endpoints', () => {
  cy.api(); // Adds 'api' and 'backend' tags
  // Test implementation
});

it('should test visual elements', () => {
  cy.visual(); // Adds 'visual' and 'screenshot' tags
  // Test implementation
});

// Custom tags
it('should handle authentication', () => {
  cy.tag('auth', 'security', 'critical');
  // Test implementation
});
```

## 🧪 Writing Tests

### E2E UI Test Example

```typescript
import { HomePage } from '@pages/HomePage';

describe('Homepage Tests', () => {
  let homePage: HomePage;

  before(() => {
    homePage = new HomePage();
  });

  beforeEach(() => {
    homePage.visit();
    cy.waitForPageLoad();
  });

  it('should load homepage successfully', () => {
    homePage.verifyNavigationVisible();
    homePage.getTitleText().should('contain', 'Cypress');
  });
});
```

### API Test Example

```typescript
describe('Users API Tests', () => {
  it('should fetch all users', () => {
    cy.apiRequest('GET', '/users').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should create new user', () => {
    const userData = TestDataBuilder.user().build();
    cy.apiRequest('POST', '/users', userData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.id).to.exist;
    });
  });
});
```

## 📊 Configuration

### Environment Variables

Create environment-specific configs in `cypress/config/`:

```json
{
  "baseUrl": "https://staging.example.com",
  "apiUrl": "https://api.staging.example.com",
  "environment": "staging"
}
```

Set environment variables in `.env` file:

```bash
# Application URLs
CYPRESS_BASE_URL=https://example.cypress.io
CYPRESS_API_URL=https://jsonplaceholder.typicode.com

# Encrypted Passwords
ENCRYPTED_ADMIN_PASSWORD=encrypted_password_here
ENCRYPTED_USER_PASSWORD=encrypted_password_here
ENCRYPTED_TEST_PASSWORD=encrypted_password_here

# Encryption Key
ENCRYPTION_KEY=your_secret_encryption_key_here
```

Environment variables are automatically loaded in `cypress.config.ts`.

### Browser Configuration

Modify `cypress.config.ts` to add browsers:

```typescript
e2e: {
  browsers: [
    { name: 'chrome', family: 'chromium' },
    { name: 'firefox', family: 'firefox' },
    { name: 'edge', family: 'chromium' }
  ]
}
```

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes two GitHub Actions workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on push/PR to main/develop
   - Tests across multiple browsers
   - Generates and uploads test reports

2. **Nightly Workflow** (`.github/workflows/nightly.yml`)
   - Runs daily at 2 AM UTC
   - Comprehensive test suite execution
   - Notifications on failure

### Local CI Simulation

```bash
# Run tests in CI-like environment
npm run cypress:run:headless
```

## 📈 Best Practices

1. **Use Page Object Model**: Keep selectors and page logic in page objects
2. **Custom Commands**: Create reusable commands for common operations
3. **Test Data**: Use fixtures and builders for test data management
4. **Error Handling**: Implement retry logic for flaky operations
5. **Assertions**: Use explicit assertions with meaningful error messages
6. **Wait Strategies**: Use custom wait commands instead of hard-coded delays
7. **Test Organization**: Group related tests using `describe` and `context`
8. **Cleanup**: Clean up test data in `after` hooks

## 🐛 Debugging

### Debug Mode

```bash
DEBUG=cypress:* npm run cypress:open
```

### Console Logs

Enable console logging in tests:

```typescript
cy.window().then((win) => {
  win.console.log('Debug message');
});
```

### Cypress Dashboard

For Cypress Dashboard integration, add to `cypress.config.ts`:

```typescript
{
  projectId: 'your-project-id',
  // ...
}
```

## 📝 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## 🔐 Security

- Never commit sensitive data (passwords, API keys)
- Use environment variables for secrets
- Keep `.gitignore` updated
- Use `.env` files for local development (not committed)

## 🔐 Security

- [Security Guide](SECURITY.md) - Password encryption and security best practices
- [Environment Variables](.env.example) - Template for environment configuration

## 📊 Data Generation

- [Data Generation Guide](DATA_GENERATION.md) - JSON-based test data generation
- [Data Templates](cypress/data/templates/) - Pre-built data templates

## 🏷️ Test Tagging

- [Test Tagging Guide](TEST_TAGGING.md) - Advanced test filtering and organization
- [Tag Presets](scripts/run-tagged-tests.js) - Predefined tag combinations

## 💡 IntelliSense Support

- [IntelliSense Guide](INTELLISENSE.md) - Complete IntelliSense documentation
- [Command Types](cypress/support/global.d.ts) - TypeScript declarations
- [Working Demo](cypress/e2e/examples/intellisense-working-demo.spec.ts) - Live examples

## 📊 Reporting

- [Reporting Guide](REPORTING.md) - Multiple reporters configuration
- [CI/CD Workflows](.github/workflows/) - GitHub Actions and Jenkins
- [Report Scripts](scripts/generate-reports.js) - Custom report generation

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use this framework for your projects.

## 👤 Author

Created to showcase advanced Cypress automation skills for Upwork clients.

---

**Note**: Update the `baseUrl` in `cypress.config.ts` and test URLs to match your application's URLs before running tests.

