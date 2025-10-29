# IntelliSense Support for Custom Commands

This document explains the comprehensive IntelliSense support implemented for all custom Cypress commands in this framework.

## 🎯 Overview

The framework provides full TypeScript IntelliSense support for all custom commands, including:
- Auto-completion for command names and parameters
- Type checking and validation
- JSDoc documentation in tooltips
- Return type inference
- Parameter hints and suggestions

## 📁 File Structure

```
cypress/support/
├── index.d.ts              # Main TypeScript declarations
├── commands.ts             # Basic utility commands
├── commands/
│   ├── api.ts             # API testing commands
│   ├── ui.ts              # UI interaction commands
│   ├── assertions.ts      # Custom assertion commands
│   ├── auth.ts            # Authentication commands
│   ├── data-generator.ts  # Data generation commands
│   ├── tags.ts            # Test tagging commands
│   └── README.md          # Commands documentation
├── e2e.ts                 # E2E support file
└── component.ts           # Component support file
```

## 🚀 Features

### 1. Auto-completion
All custom commands appear in IDE auto-completion with:
- Command names
- Parameter suggestions
- Type hints
- Return type information

### 2. Type Safety
- Full TypeScript support for all commands
- Compile-time error checking
- Return type inference
- Parameter type validation

### 3. Documentation
- Comprehensive JSDoc comments
- Usage examples for each command
- Parameter descriptions and types
- Return value documentation

## 🎨 Command Categories

### Authentication Commands
```typescript
// Full IntelliSense support
cy.loginWithEncrypted('admin'); // Shows: 'admin' | 'user' | 'test'
cy.getDecryptedPassword('user'); // Shows return type: Chainable<string>
cy.setupAuthenticatedSession('test'); // Shows parameter types
```

### API Commands
```typescript
// Type-safe API requests
cy.apiRequest('GET', '/users') // Shows method types: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  .then((response: Cypress.Response<any>) => { // Shows response type
    expect(response.status).to.eq(200);
  });

cy.apiRequest('POST', '/users', { name: 'John' }) // Shows body parameter
  .then((response) => {
    expect(response.status).to.eq(201);
  });
```

### UI Commands
```typescript
// UI interactions with type safety
cy.waitForElement('.button', 5000) // Shows timeout parameter
  .should('be.visible');

cy.clickWithRetry('.submit-btn', { timeout: 5000, retries: 3 }); // Shows options parameter

cy.fillForm({ 
  name: 'John', 
  email: 'john@example.com' 
}); // Shows fields parameter type: Record<string, string>
```

### Data Generation Commands
```typescript
// Data generation with full type safety
cy.generateUser({ count: 5, unique: true }) // Shows GenerationOptions
  .then((users: any[]) => { // Shows return type
    expect(users).to.have.length(5);
  });

cy.generateAndExport('user', 'test-users.json', { count: 10 })
  .then((data: any[]) => { // Shows return type
    expect(data).to.have.length(10);
  });
```

### Test Tagging Commands
```typescript
// Tagging commands with IntelliSense
cy.tag('smoke', 'critical', 'integration'); // Shows rest parameters: ...tags: string[]
cy.filterByTags(['smoke', 'critical']); // Shows parameter type: string[]

// Convenience methods
cy.smoke(); // Shows no parameters
cy.regression(); // Shows no parameters
cy.api(); // Shows no parameters
cy.ui(); // Shows no parameters
cy.visual(); // Shows no parameters
```

## 🔧 IDE Setup

### VS Code
1. Install TypeScript extension
2. Ensure `cypress/support/index.d.ts` is referenced
3. Restart VS Code if needed

### IntelliJ/WebStorm
1. Enable TypeScript support
2. Add `cypress/support/index.d.ts` to TypeScript configuration
3. Restart IDE

### Sublime Text
1. Install TypeScript package
2. Configure TypeScript settings
3. Restart editor

## 📚 Type Definitions

### Core Types
```typescript
interface GenerationOptions {
  count?: number;
  locale?: string;
  seed?: number;
  variations?: boolean;
  unique?: boolean;
}

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

### Command Signatures
```typescript
// Authentication
loginWithEncrypted(userType: 'admin' | 'user' | 'test'): Chainable<void>
getDecryptedPassword(userType: 'admin' | 'user' | 'test'): Chainable<string>
setupAuthenticatedSession(userType: 'admin' | 'user' | 'test'): Chainable<void>

// API Testing
apiRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', url: string, body?: unknown, headers?: Record<string, string>): Chainable<Cypress.Response<any>>
apiGet(url: string, options?: { retries?: number }): Chainable<Cypress.Response<any>>
apiPost(url: string, body: unknown): Chainable<Cypress.Response<any>>
validateSchema(response: any, schema: object): Chainable<void>

// UI Testing
waitForElement(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>
clickWithRetry(selector: string, options?: { timeout?: number; retries?: number }): Chainable<void>
fillForm(fields: Record<string, string>): Chainable<void>
scrollToElement(selector: string): Chainable<JQuery<HTMLElement>>
shouldContainText(selector: string, text: string): Chainable<void>
waitForPageLoad(): Chainable<void>
hoverWithWait(selector: string): Chainable<JQuery<HTMLElement>>

// Data Generation
generateData(templateName: string, options?: GenerationOptions): Chainable<any[]>
generateAndExport(templateName: string, filename: string, options?: GenerationOptions): Chainable<any[]>
loadGeneratedData(filename: string): Chainable<any[]>
generateUser(options?: GenerationOptions): Chainable<any[]>
generateProduct(options?: GenerationOptions): Chainable<any[]>
generateOrder(options?: GenerationOptions): Chainable<any[]>

// Test Tagging
tag(...tags: string[]): Chainable<void>
filterByTags(allowedTags: string[]): Chainable<void>
smoke(): Chainable<void>
regression(): Chainable<void>
critical(): Chainable<void>
integration(): Chainable<void>
api(): Chainable<void>
ui(): Chainable<void>
visual(): Chainable<void>
slow(): Chainable<void>
flaky(): Chainable<void>
```

## 🎯 Benefits

### 1. Developer Experience
- Faster development with auto-completion
- Reduced errors with type checking
- Better documentation with JSDoc
- Improved code navigation

### 2. Code Quality
- Compile-time error detection
- Consistent API usage
- Better refactoring support
- Enhanced maintainability

### 3. Team Collaboration
- Clear command interfaces
- Self-documenting code
- Consistent patterns
- Easier onboarding

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
    cy.filterByTags(['smoke', 'regression']); // IntelliSense shows parameter type
    cy.clearSession(); // IntelliSense shows no parameters
  });

  it('should create new user', () => {
    cy.smoke(); // IntelliSense shows available tags
    
    // Generate test data with type safety
    cy.generateUser({ count: 1, unique: true }) // IntelliSense shows GenerationOptions
      .then((users: any[]) => { // IntelliSense shows return type
        const user = users[0];
        
        // API request with type safety
        cy.apiRequest('POST', '/users', user) // IntelliSense shows all parameter types
          .then((response: Cypress.Response<any>) => { // IntelliSense shows response type
            expect(response.status).to.eq(201);
            
            // UI interaction with type safety
            cy.visit('/users');
            cy.waitForPageLoad(); // IntelliSense shows no parameters
            cy.waitForElement('.user-list', 10000) // IntelliSense shows timeout parameter
              .should('be.visible');
            cy.shouldContainText('.user-list', user.firstName); // IntelliSense shows parameter types
          });
      });
  });
});
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Open in IDE**
   - Open the project in VS Code, IntelliJ, or your preferred IDE
   - Ensure TypeScript support is enabled

3. **Start Writing Tests**
   - Begin typing `cy.` in any test file
   - See auto-completion suggestions
   - Use parameter hints and type checking

4. **Explore Commands**
   - Check `cypress/e2e/examples/intellisense-demo.spec.ts` for examples
   - Refer to `cypress/support/commands/README.md` for detailed documentation

The IntelliSense support makes the framework more professional and easier to use, providing an excellent developer experience for test automation.
