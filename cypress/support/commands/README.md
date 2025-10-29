# Custom Commands IntelliSense

This directory contains all custom Cypress commands with full TypeScript IntelliSense support.

## 📁 File Structure

```
cypress/support/commands/
├── index.d.ts          # Main TypeScript declarations
├── commands.ts         # Basic utility commands
├── api.ts             # API testing commands
├── ui.ts              # UI interaction commands
├── assertions.ts      # Custom assertion commands
├── auth.ts            # Authentication commands
├── data-generator.ts  # Data generation commands
├── tags.ts            # Test tagging commands
└── README.md          # This file
```

## 🎯 IntelliSense Features

### Auto-completion
- All custom commands appear in IDE auto-completion
- Parameter hints and type checking
- JSDoc documentation in tooltips

### Type Safety
- Full TypeScript support for all commands
- Compile-time error checking
- Return type inference

### Documentation
- Comprehensive JSDoc comments
- Usage examples for each command
- Parameter descriptions and types

## 🚀 Usage

### Basic Commands
```typescript
// Auto-completion will show all available commands
cy.loginWithEncrypted('admin');
cy.apiRequest('GET', '/users');
cy.waitForElement('.button');
cy.smoke();
```

### Data Generation
```typescript
// Type-safe data generation
cy.generateUser({ count: 5, unique: true }).then((users: UserData[]) => {
  // users is properly typed
  users.forEach(user => {
    expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
```

### API Testing
```typescript
// Type-safe API requests
cy.apiRequest('POST', '/users', { name: 'John', email: 'john@example.com' })
  .then((response: Cypress.Response<any>) => {
    expect(response.status).to.eq(201);
  });
```

## 🔧 Configuration

### VS Code Setup
1. Install TypeScript extension
2. Ensure `cypress/support/index.d.ts` is referenced
3. Restart VS Code if needed

### IntelliJ/WebStorm
1. Enable TypeScript support
2. Add `cypress/support/index.d.ts` to TypeScript configuration
3. Restart IDE

## 📚 Available Commands

### Authentication
- `cy.loginWithEncrypted(userType)` - Login with encrypted credentials
- `cy.getDecryptedPassword(userType)` - Get decrypted password
- `cy.setupAuthenticatedSession(userType)` - Setup authenticated session

### API Testing
- `cy.apiRequest(method, url, body?, headers?)` - Make API requests
- `cy.apiGet(url, options?)` - Get API data with retry
- `cy.apiPost(url, body)` - Post API data
- `cy.validateSchema(response, schema)` - Validate response schema

### UI Testing
- `cy.waitForElement(selector, timeout?)` - Wait for element
- `cy.clickWithRetry(selector, options?)` - Click with retry
- `cy.fillForm(fields)` - Fill form fields
- `cy.scrollToElement(selector)` - Scroll to element
- `cy.shouldContainText(selector, text)` - Assert text content
- `cy.waitForPageLoad()` - Wait for page load
- `cy.hoverWithWait(selector)` - Hover with wait

### Assertions
- `cy.shouldHaveStatus(statusCode)` - Assert status code
- `cy.shouldHaveClass(selector, className)` - Assert element class
- `cy.shouldHaveUrlPath(path)` - Assert URL path
- `cy.assertAll(assertions)` - Assert multiple conditions

### Data Generation
- `cy.generateData(templateName, options?)` - Generate test data
- `cy.generateAndExport(templateName, filename, options?)` - Generate and export
- `cy.loadGeneratedData(filename)` - Load generated data
- `cy.generateUser(options?)` - Generate user data
- `cy.generateProduct(options?)` - Generate product data
- `cy.generateOrder(options?)` - Generate order data

### Test Tagging
- `cy.tag(...tags)` - Add tags to test
- `cy.filterByTags(allowedTags)` - Filter by tags
- `cy.smoke()` - Mark as smoke test
- `cy.regression()` - Mark as regression test
- `cy.api()` - Mark as API test
- `cy.ui()` - Mark as UI test
- `cy.visual()` - Mark as visual test
- `cy.slow()` - Mark as slow test
- `cy.flaky()` - Mark as flaky test

### Utilities
- `cy.waitForApi(alias)` - Wait for API response
- `cy.clearSession()` - Clear session data
- `cy.setViewport(size)` - Set viewport size

## 🎨 Type Definitions

### Data Types
```typescript
interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // ... more properties
}

interface ProductData {
  id: number;
  name: string;
  price: number;
  // ... more properties
}

interface OrderData {
  id: string;
  customerId: number;
  items: Array<{...}>;
  // ... more properties
}
```

### Generation Options
```typescript
interface GenerationOptions {
  count?: number;
  locale?: string;
  seed?: number;
  variations?: boolean;
  unique?: boolean;
}
```

## 🔍 Troubleshooting

### IntelliSense Not Working
1. Check that `cypress/support/index.d.ts` exists
2. Verify TypeScript configuration
3. Restart your IDE
4. Check for TypeScript errors

### Type Errors
1. Ensure all command files reference `./index.d.ts`
2. Check for missing imports
3. Verify command implementations match declarations

### Missing Commands
1. Check that commands are properly exported
2. Verify command files are imported in `e2e.ts`
3. Ensure TypeScript declarations are complete

## 📖 Examples

### Complete Test with IntelliSense
```typescript
describe('User Management', () => {
  beforeEach(() => {
    cy.filterByTags(['smoke', 'regression']);
    cy.clearSession();
  });

  it('should create new user', () => {
    cy.smoke(); // IntelliSense shows available tags
    
    // Generate test data with type safety
    cy.generateUser({ count: 1, unique: true }).then((users: UserData[]) => {
      const user = users[0];
      
      // API request with type safety
      cy.apiRequest('POST', '/users', user).then((response: Cypress.Response<any>) => {
        expect(response.status).to.eq(201);
        
        // UI interaction with type safety
        cy.visit('/users');
        cy.waitForElement('.user-list');
        cy.shouldContainText('.user-list', user.firstName);
      });
    });
  });
});
```

This setup provides comprehensive IntelliSense support for all custom commands, making development faster and more reliable.
