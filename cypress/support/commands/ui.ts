/// <reference types="cypress" />

/**
 * UI-related custom commands
 */

// Wait for element with custom timeout
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  return cy.get(selector, { timeout }).should('be.visible').should('not.be.disabled');
});

// Click with retry
Cypress.Commands.add('clickWithRetry', (selector, options = {}) => {
  const { timeout = 10000, retries = 3 } = options;

  const attemptClick = (attempt: number): Cypress.Chainable => {
    return cy
      .get(selector, { timeout })
      .should('be.visible')
      .click({ force: attempt === retries })
      .then(
        () => cy.log(`Successfully clicked ${selector}`),
        (error) => {
          if (attempt < retries) {
            cy.wait(500);
            return attemptClick(attempt + 1);
          }
          throw error;
        }
      );
  };

  return attemptClick(1);
});

// Fill form
Cypress.Commands.add('fillForm', (fields) => {
  Object.entries(fields).forEach(([key, value]) => {
    cy.get(`[name="${key}"], #${key}, .${key}`).clear().type(value);
  });
});

// Scroll to element
Cypress.Commands.add('scrollToElement', (selector) => {
  return cy.get(selector).scrollIntoView({ easing: 'swing', duration: 500 });
});

// Should contain text (case-insensitive)
Cypress.Commands.add('shouldContainText', (selector, text) => {
  return cy.get(selector).should('contain.text', text);
});

// Wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document').and('have.property', 'readyState', 'complete');
  cy.document().should('have.property', 'readyState', 'complete');
});

// Hover with wait
Cypress.Commands.add('hoverWithWait', (selector) => {
  return cy.get(selector).trigger('mouseover').wait(300);
});

export {};

