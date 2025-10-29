# Advanced Examples

This document showcases advanced testing patterns and techniques used in this framework.

## Table of Contents

1. [Parallel Test Execution](#parallel-test-execution)
2. [Dynamic Test Data Generation](#dynamic-test-data-generation)
3. [Complex Assertions](#complex-assertions)
4. [API Mocking and Stubbing](#api-mocking-and-stubbing)
5. [Cross-browser Testing](#cross-browser-testing)
6. [Data-Driven Testing](#data-driven-testing)
7. [Test Retry Logic](#test-retry-logic)
8. [Custom Hooks](#custom-hooks)

## Parallel Test Execution

```typescript
// Run tests in parallel (CI only)
// cypress.config.ts already configured for parallel execution
// Use --parallel flag in CI
```

## Dynamic Test Data Generation

```typescript
import { TestDataBuilder } from '@utils/test-data-builder';
import { generateRandomEmail } from '@support/utils/helpers';

describe('Dynamic Test Data', () => {
  it('should create user with random data', () => {
    const user = TestDataBuilder.user()
      .with('email', generateRandomEmail())
      .build();
    
    cy.apiRequest('POST', '/users', user);
  });
});
```

## Complex Assertions

```typescript
describe('Complex Assertions', () => {
  it('should validate multiple conditions', () => {
    cy.assertAll([
      () => cy.get('.title').should('be.visible'),
      () => cy.url().should('include', '/dashboard'),
      () => cy.getCookie('session').should('exist'),
    ]);
  });
  
  it('should validate API response structure', () => {
    cy.apiRequest('GET', '/users/1').then((response) => {
      // Validate nested structure
      expect(response.body).to.have.nested.property('address.city');
      expect(response.body.address).to.include.keys('street', 'city', 'zipcode');
    });
  });
});
```

## API Mocking and Stubbing

```typescript
describe('API Mocking', () => {
  beforeEach(() => {
    // Intercept and mock API calls
    cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
    cy.intercept('POST', '/api/users', { statusCode: 201, body: { id: 123 } }).as('createUser');
  });
  
  it('should use mocked API response', () => {
    cy.visit('/users');
    cy.wait('@getUsers');
    cy.get('.user-list').should('contain', 'John Doe');
  });
});
```

## Cross-browser Testing

```typescript
describe('Cross-browser Tests', () => {
  ['chrome', 'firefox', 'edge'].forEach((browser) => {
    it(`should work in ${browser}`, { browser }, () => {
      cy.visit('/');
      cy.get('h1').should('be.visible');
    });
  });
});
```

## Data-Driven Testing

```typescript
describe('Data-Driven Tests', () => {
  const testCases = [
    { name: 'John Doe', email: 'john@example.com', expected: true },
    { name: 'Jane Smith', email: 'jane@example.com', expected: true },
    { name: '', email: 'invalid', expected: false },
  ];
  
  testCases.forEach(({ name, email, expected }) => {
    it(`should validate form for ${name || 'empty name'}`, () => {
      cy.fillForm({ name, email });
      if (expected) {
        cy.get('.submit-btn').should('not.be.disabled');
      } else {
        cy.get('.error-message').should('be.visible');
      }
    });
  });
});
```

## Test Retry Logic

```typescript
describe('Retry Logic', () => {
  it('should retry on failure', { retries: { runMode: 3, openMode: 1 } }, () => {
    cy.visit('/');
    cy.get('.flaky-element', { timeout: 5000 }).should('be.visible');
  });
  
  it('should use custom retry command', () => {
    cy.clickWithRetry('.submit-btn', { retries: 5 });
  });
});
```

## Custom Hooks

```typescript
describe('Custom Hooks', () => {
  before(() => {
    // Run once before all tests
    cy.log('Setting up test suite');
    // Seed database, create test users, etc.
  });
  
  beforeEach(() => {
    // Run before each test
    cy.clearSession();
    cy.login('testuser', 'password');
  });
  
  afterEach(() => {
    // Cleanup after each test
    cy.clearSession();
  });
  
  after(() => {
    // Cleanup after all tests
    cy.log('Cleaning up test suite');
  });
});
```

## Advanced Page Object Patterns

```typescript
// Fluent API pattern
class LoginPage extends BasePage {
  enterUsername(username: string) {
    this.typeInto('#username', username);
    return this;
  }
  
  enterPassword(password: string) {
    this.typeInto('#password', password);
    return this;
  }
  
  submit() {
    this.clickElement('#submit');
    return this;
  }
  
  // Usage: loginPage.enterUsername('user').enterPassword('pass').submit();
}

// Builder pattern
class FormBuilder {
  private data: Record<string, any> = {};
  
  withEmail(email: string) {
    this.data.email = email;
    return this;
  }
  
  withName(name: string) {
    this.data.name = name;
    return this;
  }
  
  build() {
    return this.data;
  }
}

// Usage: new FormBuilder().withEmail('test@example.com').withName('Test').build()
```

## Handling Async Operations

```typescript
describe('Async Operations', () => {
  it('should wait for async operations', () => {
    cy.intercept('GET', '/api/data').as('getData');
    
    cy.visit('/');
    cy.wait('@getData').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });
    
    cy.get('.data-loaded').should('be.visible');
  });
  
  it('should handle multiple async calls', () => {
    cy.intercept('GET', '/api/users').as('users');
    cy.intercept('GET', '/api/posts').as('posts');
    
    cy.visit('/dashboard');
    
    cy.wait(['@users', '@posts']).then((interceptions) => {
      interceptions.forEach((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
      });
    });
  });
});
```

## Visual Testing Patterns

```typescript
describe('Visual Testing', () => {
  it('should compare screenshots', () => {
    cy.visit('/');
    
    // Capture baseline
    cy.screenshot('baseline-homepage');
    
    // Perform action
    cy.get('.theme-toggle').click();
    
    // Capture after action
    cy.screenshot('after-theme-change');
  });
  
  it('should test responsive design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];
    
    viewports.forEach(({ name, width, height }) => {
      cy.viewport(width, height);
      cy.visit('/');
      cy.screenshot(`${name}-homepage`);
    });
  });
});
```

## Error Recovery

```typescript
describe('Error Recovery', () => {
  it('should recover from errors gracefully', () => {
    cy.on('uncaught:exception', (err) => {
      // Handle specific errors
      if (err.message.includes('ResizeObserver')) {
        return false; // Prevent test failure
      }
      return true; // Let other errors fail the test
    });
    
    cy.visit('/');
    // Test continues even if ResizeObserver errors occur
  });
  
  it('should retry on network errors', () => {
    cy.apiGet('/api/data', { retries: 3 }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
```

## Performance Testing

```typescript
describe('Performance Tests', () => {
  it('should load page within time limit', () => {
    const startTime = Date.now();
    
    cy.visit('/');
    cy.waitForPageLoad();
    
    cy.then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(3000); // 3 seconds
    });
  });
  
  it('should validate API response time', () => {
    cy.apiRequest('GET', '/api/users').then((response) => {
      const responseTime = response.duration;
      expect(responseTime).to.be.lessThan(1000); // 1 second
    });
  });
});
```

These examples demonstrate advanced Cypress testing patterns that showcase professional automation skills.

