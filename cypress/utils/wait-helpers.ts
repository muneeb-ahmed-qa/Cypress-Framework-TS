/**
 * Wait helper utilities for complex wait scenarios
 */

/**
 * Wait for network to be idle
 */
export const waitForNetworkIdle = (timeout: number = 2000): Cypress.Chainable => {
  let networkRequestCount = 0;
  let timeoutId: NodeJS.Timeout;

  return new Cypress.Promise((resolve) => {
    const checkIdle = () => {
      if (networkRequestCount === 0) {
        timeoutId = setTimeout(() => {
          if (networkRequestCount === 0) {
            resolve(undefined);
          }
        }, timeout);
      }
    };

    cy.window().then((win) => {
      // Monitor fetch requests
      const originalFetch = win.fetch;
      win.fetch = function (...args) {
        networkRequestCount++;
        return originalFetch.apply(this, args).finally(() => {
          networkRequestCount--;
          checkIdle();
        });
      };

      checkIdle();
    });
  });
};

/**
 * Wait for element count to match
 */
export const waitForElementCount = (
  selector: string,
  expectedCount: number,
  timeout: number = 10000
): Cypress.Chainable => {
  const startTime = Date.now();

  const checkCount = (): Cypress.Chainable => {
    return cy.get(selector, { timeout: 0 }).then(($elements) => {
      if ($elements.length === expectedCount) {
        return cy.wrap($elements);
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(
          `Expected ${expectedCount} elements but found ${$elements.length} for selector: ${selector}`
        );
      }

      return cy.wait(200).then(() => checkCount());
    });
  };

  return checkCount();
};

/**
 * Wait for text to appear in element
 */
export const waitForTextInElement = (
  selector: string,
  text: string,
  timeout: number = 10000
): Cypress.Chainable => {
  return cy.get(selector, { timeout }).should('contain.text', text);
};

/**
 * Wait for URL to match pattern
 */
export const waitForUrl = (urlPattern: string | RegExp, timeout: number = 10000): Cypress.Chainable => {
  return cy.url({ timeout }).should('satisfy', (url: string) => {
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
};

