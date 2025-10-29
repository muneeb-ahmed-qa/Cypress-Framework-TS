/// <reference types="cypress" />

/**
 * API-related custom commands
 */

const getAuthToken = (): string | null => {
  return window.localStorage.getItem('authToken');
};

// Authenticated API request
Cypress.Commands.add('apiRequest', (method, url, body, headers = {}) => {
  const token = getAuthToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: defaultHeaders,
    failOnStatusCode: false,
  });
});

// API GET with retry
Cypress.Commands.add('apiGet', (url, options = {}) => {
  const { retries = 3 } = options;

  const attemptRequest = (attempt: number): Cypress.Chainable => {
    return cy.apiRequest('GET', url).then((response) => {
      if (response.status >= 500 && attempt < retries) {
        cy.wait(1000);
        return attemptRequest(attempt + 1);
      }
      return cy.wrap(response);
    });
  };

  return attemptRequest(1);
});

// API POST
Cypress.Commands.add('apiPost', (url, body) => {
  return cy.apiRequest('POST', url, body);
});

// Validate schema (basic implementation)
Cypress.Commands.add('validateSchema', (response, schema) => {
  // This is a simplified schema validator
  // For production, consider using a library like ajv or joi
  const requiredFields = Object.keys(schema);
  const responseKeys = Object.keys(response);

  requiredFields.forEach((field) => {
    expect(responseKeys).to.include(field);
    if (schema[field as keyof typeof schema]) {
      expect(typeof response[field]).to.eq(typeof schema[field as keyof typeof schema]);
    }
  });
});

export {};

