/**
 * Working IntelliSense Demo
 * This file demonstrates that IntelliSense is working for custom commands
 */

describe('IntelliSense Working Demo', () => {
  beforeEach(() => {
    // These commands now have full IntelliSense support
    cy.filterByTags(['smoke', 'regression']);
    cy.clearSession();
  });

  it('should demonstrate working IntelliSense for all command categories', () => {
    // Authentication commands with IntelliSense
    cy.smoke(); // Auto-completion works
    cy.loginWithEncrypted('admin'); // Parameter hints work
    cy.getDecryptedPassword('user'); // Return type inference works
    cy.setupAuthenticatedSession('test'); // Type checking works

    // API commands with IntelliSense
    cy.api(); // Auto-completion works
    cy.apiRequest('GET', '/users') // Method parameter shows options
      .then((response) => { // Response type is inferred
        expect(response.status).to.eq(200);
      });

    cy.apiRequest('POST', '/users', { name: 'John' }) // Body parameter type checked
      .then((response) => {
        expect(response.status).to.eq(201);
      });

    // UI commands with IntelliSense
    cy.ui(); // Auto-completion works
    cy.waitForElement('.button', 5000) // Timeout parameter shows type
      .should('be.visible');

    cy.clickWithRetry('.submit-btn', { timeout: 5000, retries: 3 }); // Options parameter shows structure

    cy.fillForm({ 
      name: 'John', 
      email: 'john@example.com' 
    }); // Fields parameter shows Record<string, string> type

    // Data generation commands with IntelliSense
    cy.generateUser({ count: 5, unique: true }) // Options parameter shows GenerationOptions
      .then((users) => { // Return type is inferred as any[]
        expect(users).to.have.length(5);
      });

    cy.generateAndExport('user', 'test-users.json', { count: 10 })
      .then((data) => { // Return type is inferred
        expect(data).to.have.length(10);
      });

    // Test tagging commands with IntelliSense
    cy.tag('smoke', 'critical', 'integration'); // Rest parameters work
    cy.filterByTags(['smoke', 'critical']); // Array parameter type checked

    // Convenience methods
    cy.smoke(); // No parameters
    cy.regression(); // No parameters
    cy.api(); // No parameters
    cy.ui(); // No parameters
    cy.visual(); // No parameters
    cy.slow(); // No parameters
    cy.flaky(); // No parameters

    // Utility commands with IntelliSense
    cy.waitForApi('/api/users'); // String parameter
    cy.setViewport('mobile'); // Union type parameter shows options
  });

  it('should demonstrate complex workflow with full IntelliSense', () => {
    cy.smoke(); // IntelliSense shows available tags
    
    // Complex workflow with full type safety
    cy.clearSession(); // No parameters
    
    cy.generateUser({ count: 1, unique: true }) // IntelliSense shows GenerationOptions
      .then((users) => { // IntelliSense shows return type
        const user = users[0];
        
        // API request with full type safety
        cy.apiRequest('POST', '/users', user) // IntelliSense shows all parameter types
          .then((response) => { // IntelliSense shows response type
            expect(response.status).to.eq(201);
            
            // UI interaction with full type safety
            cy.visit('/users');
            cy.waitForPageLoad(); // No parameters
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
