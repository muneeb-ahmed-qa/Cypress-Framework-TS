// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import global type definitions
import './global';

// Import utility functions
import './utils/helpers';

// Import custom commands
import './commands/api';
import './commands/ui';
import './commands/assertions';
import './commands/auth';
import './commands/data-generator';
import './commands/tags';

// Real events support (for hover, mouse events, etc.)
import 'cypress-real-events';

// Code coverage support
import '@cypress/code-coverage/support';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
// Note: Cypress.Server is deprecated, using cy.intercept instead

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let it fail the test
  return true;
});

// Global before hook
before(() => {
  // Setup logic that runs once before all tests
  cy.log('Starting test suite execution');
});

// Global beforeEach hook
beforeEach(() => {
  // Setup logic that runs before each test
  cy.log(`Running test: ${Cypress.currentTest.title}`);
});

// Global after hook
after(() => {
  // Cleanup logic that runs once after all tests
  cy.log('Test suite execution completed');
});

// XHR/Fetch logging
cy.on('window:before:load', (win) => {
  const originalFetch = win.fetch;
  win.fetch = function(...args: any[]) {
    console.log('Fetch request:', args);
    return originalFetch.apply(this, args);
  };
});

// Log XHR requests
cy.on('request', (xhr: any) => {
  console.log('XHR Request:', xhr.method, xhr.url);
});

