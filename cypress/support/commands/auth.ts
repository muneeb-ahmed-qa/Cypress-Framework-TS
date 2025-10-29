/// <reference types="cypress" />

/**
 * Authentication-related custom commands
 */

import { getDecryptedPassword } from '@utils/password-encryption';

// Login with encrypted credentials
Cypress.Commands.add('loginWithEncrypted', (userType: 'admin' | 'user' | 'test') => {
  const username = Cypress.env(`${userType.toUpperCase()}_USERNAME`) || `${userType}@example.com`;
  const password = getDecryptedPassword(`ENCRYPTED_${userType.toUpperCase()}_PASSWORD`);

  cy.session(
    [userType, username],
    () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: { username, password },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          window.localStorage.setItem('authToken', response.body.token);
          window.localStorage.setItem('userType', userType);
        } else {
          throw new Error(`Login failed for ${userType}: ${response.status}`);
        }
      });
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        const token = window.localStorage.getItem('authToken');
        const storedUserType = window.localStorage.getItem('userType');
        return token && storedUserType === userType;
      },
    }
  );
});

// Get decrypted password
Cypress.Commands.add('getDecryptedPassword', (userType: 'admin' | 'user' | 'test') => {
  const password = getDecryptedPassword(`ENCRYPTED_${userType.toUpperCase()}_PASSWORD`);
  return cy.wrap(password);
});

// Setup authenticated session
Cypress.Commands.add('setupAuthenticatedSession', (userType: 'admin' | 'user' | 'test') => {
  cy.loginWithEncrypted(userType);
  cy.visit('/dashboard');
  cy.waitForPageLoad();
});

export {};
