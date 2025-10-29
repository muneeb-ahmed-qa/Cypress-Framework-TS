/// <reference types="cypress" />

// ***********************************************
// This file contains custom commands for Cypress
// ***********************************************

/**
 * Login command (deprecated - use loginWithEncrypted)
 * @deprecated Use cy.loginWithEncrypted() instead
 */
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session(
    [username, password],
    () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: { username, password },
      }).then((response) => {
        expect(response.status).to.eq(200);
        window.localStorage.setItem('authToken', response.body.token);
      });
    },
    {
      cacheAcrossSpecs: true,
    }
  );
});

/**
 * Wait for API response with timeout
 * @param alias - API alias to wait for
 */
Cypress.Commands.add('waitForApi', (alias: string) => {
  cy.wait(`@${alias}`, { timeout: 10000 }).then((interception) => {
    expect(interception.response?.statusCode).to.be.oneOf([200, 201, 204]);
  });
});

/**
 * Clear all session data (cookies, localStorage, sessionStorage)
 */
Cypress.Commands.add('clearSession', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

/**
 * Set viewport size for responsive testing
 * @param size - Viewport size ('mobile' | 'tablet' | 'desktop')
 */
Cypress.Commands.add('setViewport', (size: 'mobile' | 'tablet' | 'desktop') => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  };

  cy.viewport(viewports[size].width, viewports[size].height);
});

export {};

