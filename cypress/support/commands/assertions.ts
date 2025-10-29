/// <reference types="cypress" />

/**
 * Custom assertion commands
 */

// Assert status code
Cypress.Commands.add('shouldHaveStatus', (statusCode) => {
  cy.then(() => {
    const alias = cy.state('subject');
    if (alias && alias.status) {
      expect(alias.status).to.eq(statusCode);
    }
  });
});

// Assert class
Cypress.Commands.add('shouldHaveClass', (selector, className) => {
  cy.get(selector).should('have.class', className);
});

// Assert URL path
Cypress.Commands.add('shouldHaveUrlPath', (path) => {
  cy.url().should('include', path);
});

// Assert all conditions
Cypress.Commands.add('assertAll', (assertions) => {
  assertions.forEach((assertion) => {
    assertion();
  });
});

export {};

