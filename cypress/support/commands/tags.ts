/// <reference types="cypress" />

/**
 * Test tagging and filtering commands
 */

// Store tags for current test
let currentTestTags: string[] = [];

// Add tags to current test
Cypress.Commands.add('tag', (...tags: string[]) => {
  currentTestTags.push(...tags);
  cy.log(`Tags added: ${tags.join(', ')}`);
});

// Filter test by tags
Cypress.Commands.add('filterByTags', (allowedTags: string[]) => {
  const hasMatchingTag = currentTestTags.some(tag => allowedTags.includes(tag));
  
  if (!hasMatchingTag && currentTestTags.length > 0) {
    cy.log(`Skipping test - no matching tags. Test tags: ${currentTestTags.join(', ')}, Allowed: ${allowedTags.join(', ')}`);
    cy.wrap(null, { log: false }).then(() => {
      throw new Error('Test skipped due to tag filtering');
    });
  }
});

// Convenience methods for common tags
Cypress.Commands.add('smoke', () => {
  cy.tag('smoke', 'critical');
});

Cypress.Commands.add('regression', () => {
  cy.tag('regression', 'comprehensive');
});

Cypress.Commands.add('critical', () => {
  cy.tag('critical', 'high-priority');
});

Cypress.Commands.add('integration', () => {
  cy.tag('integration', 'e2e');
});

Cypress.Commands.add('api', () => {
  cy.tag('api', 'backend');
});

Cypress.Commands.add('ui', () => {
  cy.tag('ui', 'frontend');
});

Cypress.Commands.add('visual', () => {
  cy.tag('visual', 'screenshot');
});

Cypress.Commands.add('slow', () => {
  cy.tag('slow', 'performance');
});

Cypress.Commands.add('flaky', () => {
  cy.tag('flaky', 'unstable');
});

// Reset tags before each test
beforeEach(() => {
  currentTestTags = [];
});

// Global tag filtering based on environment variable
before(() => {
  const filterTags = Cypress.env('TAGS');
  if (filterTags) {
    const allowedTags = filterTags.split(',').map((tag: string) => tag.trim());
    cy.log(`Running tests with tags: ${allowedTags.join(', ')}`);
  }
});

export {};
