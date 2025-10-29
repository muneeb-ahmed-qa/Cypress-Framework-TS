/**
 * IntelliSense Demo Tests
 * Demonstrates TypeScript IntelliSense support for custom commands
 */

describe('IntelliSense Demo', () => {
  beforeEach(() => {
    // Apply tag filtering
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
  });

  it('should demonstrate authentication commands with IntelliSense', () => {
    cy.smoke(); // IntelliSense shows: smoke(), regression(), api(), ui(), visual(), etc.
    
    // Authentication commands with full type safety
    cy.loginWithEncrypted('admin'); // IntelliSense shows: 'admin' | 'user' | 'test'
    cy.getDecryptedPassword('user'); // IntelliSense shows return type: Chainable<string>
    cy.setupAuthenticatedSession('test'); // IntelliSense shows parameter types
  });

  it('should demonstrate API commands with IntelliSense', () => {
    cy.api(); // Mark as API test
    
    // API commands with full type safety
    cy.apiRequest('GET', '/users') // IntelliSense shows method types: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      .then((response: Cypress.Response<any>) => { // IntelliSense shows response type
        expect(response.status).to.eq(200);
      });

    cy.apiRequest('POST', '/users', { name: 'John', email: 'john@example.com' }) // IntelliSense shows body parameter
      .then((response) => {
        expect(response.status).to.eq(201);
      });

    cy.apiGet('/users/1', { retries: 3 }) // IntelliSense shows options parameter
      .then((response) => {
        expect(response.status).to.eq(200);
      });

    cy.validateSchema({ id: 1, name: 'John' }, { id: 'number', name: 'string' }); // IntelliSense shows schema parameter
  });

  it('should demonstrate UI commands with IntelliSense', () => {
    cy.ui(); // Mark as UI test
    
    // UI commands with full type safety
    cy.waitForElement('.button', 5000) // IntelliSense shows timeout parameter
      .should('be.visible');

    cy.clickWithRetry('.submit-btn', { timeout: 5000, retries: 3 }); // IntelliSense shows options parameter

    cy.fillForm({ 
      name: 'John', 
      email: 'john@example.com' 
    }); // IntelliSense shows fields parameter type: Record<string, string>

    cy.scrollToElement('.footer') // IntelliSense shows return type: Chainable<JQuery<HTMLElement>>
      .should('be.visible');

    cy.shouldContainText('.title', 'Hello World'); // IntelliSense shows parameter types

    cy.waitForPageLoad(); // IntelliSense shows no parameters

    cy.hoverWithWait('.menu-item') // IntelliSense shows return type
      .should('be.visible');
  });

  it('should demonstrate assertion commands with IntelliSense', () => {
    cy.regression(); // Mark as regression test
    
    // Assertion commands with full type safety
    cy.shouldHaveStatus(200); // IntelliSense shows parameter type: number
    cy.shouldHaveClass('.btn', 'active'); // IntelliSense shows parameter types
    cy.shouldHaveUrlPath('/dashboard'); // IntelliSense shows parameter type

    // Complex assertion with type safety
    cy.assertAll([
      () => cy.get('.element').should('be.visible'),
      () => cy.url().should('include', 'test')
    ]); // IntelliSense shows assertions parameter type: Array<() => Cypress.Chainable<any>>
  });

  it('should demonstrate data generation commands with IntelliSense', () => {
    cy.tag('data-generation', 'unit'); // Custom tags
    
    // Data generation with full type safety
    cy.generateUser({ count: 5, unique: true }) // IntelliSense shows GenerationOptions
      .then((users: any[]) => { // IntelliSense shows return type
        expect(users).to.have.length(5);
        users.forEach(user => {
          expect(user).to.have.property('email');
        });
      });

    cy.generateProduct({ count: 3, locale: 'en' }) // IntelliSense shows all options
      .then((products: any[]) => {
        expect(products).to.have.length(3);
      });

    cy.generateOrder({ count: 2, seed: 12345 }) // IntelliSense shows seed option
      .then((orders: any[]) => {
        expect(orders).to.have.length(2);
      });

    // Generate and export with type safety
    cy.generateAndExport('user', 'test-users.json', { count: 10, unique: true })
      .then((data: any[]) => { // IntelliSense shows return type
        expect(data).to.have.length(10);
      });

    // Load generated data
    cy.loadGeneratedData('test-users.json')
      .then((data: any[]) => { // IntelliSense shows return type
        expect(data).to.be.an('array');
      });
  });

  it('should demonstrate test tagging commands with IntelliSense', () => {
    // Tagging commands with IntelliSense
    cy.tag('smoke', 'critical', 'integration'); // IntelliSense shows rest parameters: ...tags: string[]
    cy.filterByTags(['smoke', 'critical']); // IntelliSense shows parameter type: string[]

    // Convenience methods
    cy.smoke(); // IntelliSense shows no parameters
    cy.regression(); // IntelliSense shows no parameters
    cy.critical(); // IntelliSense shows no parameters
    cy.integration(); // IntelliSense shows no parameters
    cy.api(); // IntelliSense shows no parameters
    cy.ui(); // IntelliSense shows no parameters
    cy.visual(); // IntelliSense shows no parameters
    cy.slow(); // IntelliSense shows no parameters
    cy.flaky(); // IntelliSense shows no parameters
  });

  it('should demonstrate utility commands with IntelliSense', () => {
    cy.visual(); // Mark as visual test
    
    // Utility commands with IntelliSense
    cy.waitForApi('/api/users'); // IntelliSense shows parameter type: string
    cy.clearSession(); // IntelliSense shows no parameters
    cy.setViewport('mobile'); // IntelliSense shows parameter type: 'mobile' | 'tablet' | 'desktop'
  });

  it('should demonstrate environment variable access with IntelliSense', () => {
    // Environment variables with IntelliSense
    const tags = Cypress.env('TAGS'); // IntelliSense shows return type: string
    const apiUrl = Cypress.env('apiUrl'); // IntelliSense shows return type: string
    const environment = Cypress.env('environment'); // IntelliSense shows return type: string
    
    // Encrypted password access
    const adminPassword = Cypress.env('ENCRYPTED_ADMIN_PASSWORD'); // IntelliSense shows return type: string
    const userPassword = Cypress.env('ENCRYPTED_USER_PASSWORD'); // IntelliSense shows return type: string
    const testPassword = Cypress.env('ENCRYPTED_TEST_PASSWORD'); // IntelliSense shows return type: string

    cy.log(`Tags: ${tags}, API URL: ${apiUrl}, Environment: ${environment}`);
  });

  it('should demonstrate complex workflow with full IntelliSense', () => {
    cy.smoke(); // IntelliSense shows available tags
    
    // Complex workflow with full type safety
    cy.clearSession(); // IntelliSense shows no parameters
    
    cy.generateUser({ count: 1, unique: true }) // IntelliSense shows GenerationOptions
      .then((users: any[]) => {
        const user = users[0];
        
        // API request with full type safety
        cy.apiRequest('POST', '/users', user) // IntelliSense shows all parameter types
          .then((response: Cypress.Response<any>) => { // IntelliSense shows response type
            expect(response.status).to.eq(201);
            
            // UI interaction with full type safety
            cy.visit('/users');
            cy.waitForPageLoad(); // IntelliSense shows no parameters
            cy.waitForElement('.user-list', 10000) // IntelliSense shows timeout parameter
              .should('be.visible');
            cy.shouldContainText('.user-list', user.firstName); // IntelliSense shows parameter types
            
            // Form interaction
            cy.fillForm({ 
              search: user.email 
            }); // IntelliSense shows fields parameter type
            
            // Assertions
            cy.shouldHaveUrlPath('/users'); // IntelliSense shows parameter type
            cy.shouldHaveClass('.user-list', 'loaded'); // IntelliSense shows parameter types
          });
      });
  });
});
