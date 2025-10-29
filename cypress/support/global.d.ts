/// <reference types="cypress" />

/**
 * Global type definitions for custom Cypress commands
 * This file provides IntelliSense support for all custom commands
 * 
 * @author Muneeb Ahmed - https://www.linkedin.com/in/muneeb-ahmed-0123
 * @version 1.0.0
 * @since 1.0.0
 */

declare global {
  namespace Cypress {
    interface Chainable {
      // ===========================================
      // Authentication Commands
      // ===========================================
      
      /**
       * Login with encrypted credentials
       * @param userType - Type of user to login as ('admin' | 'user' | 'test')
       * @example cy.loginWithEncrypted('admin')
       */
      loginWithEncrypted(userType: 'admin' | 'user' | 'test'): Chainable<void>;

      /**
       * Get decrypted password for user type
       * @param userType - Type of user ('admin' | 'user' | 'test')
       * @example cy.getDecryptedPassword('admin')
       */
      getDecryptedPassword(userType: 'admin' | 'user' | 'test'): Chainable<string>;

      /**
       * Setup authenticated session
       * @param userType - Type of user ('admin' | 'user' | 'test')
       * @example cy.setupAuthenticatedSession('admin')
       */
      setupAuthenticatedSession(userType: 'admin' | 'user' | 'test'): Chainable<void>;

      /**
       * Login with credentials (deprecated - use loginWithEncrypted)
       * @param username - Username for login
       * @param password - Password for login
       * @deprecated Use cy.loginWithEncrypted() instead
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<void>;

      // ===========================================
      // API Commands
      // ===========================================

      /**
       * Make authenticated API request
       * @param method - HTTP method
       * @param url - API endpoint URL
       * @param body - Request body (optional)
       * @param headers - Additional headers (optional)
       * @example cy.apiRequest('GET', '/users')
       * @example cy.apiRequest('POST', '/users', { name: 'John' })
       */
      apiRequest(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        url: string,
        body?: unknown,
        headers?: Record<string, string>
      ): Chainable<Cypress.Response<any>>;

      /**
       * Get API data with retry logic
       * @param url - API endpoint URL
       * @param options - Retry options
       * @example cy.apiGet('/users/1', { retries: 3 })
       */
      apiGet(url: string, options?: { retries?: number }): Chainable<Cypress.Response<any>>;

      /**
       * Post API data
       * @param url - API endpoint URL
       * @param body - Request body
       * @example cy.apiPost('/users', { name: 'John' })
       */
      apiPost(url: string, body: unknown): Chainable<Cypress.Response<any>>;

      /**
       * Validate API response schema
       * @param response - API response to validate
       * @param schema - Schema object for validation
       * @example cy.validateSchema(response, { id: 'number', name: 'string' })
       */
      validateSchema(response: any, schema: object): Chainable<void>;

      // ===========================================
      // UI Commands
      // ===========================================

      /**
       * Wait for element to be visible and interactable
       * @param selector - CSS selector for the element
       * @param timeout - Timeout in milliseconds (default: 10000)
       * @example cy.waitForElement('.button')
       * @example cy.waitForElement('.button', 5000)
       */
      waitForElement(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;

      /**
       * Click element with retry logic
       * @param selector - CSS selector for the element
       * @param options - Retry options
       * @example cy.clickWithRetry('.submit-btn')
       * @example cy.clickWithRetry('.submit-btn', { timeout: 5000, retries: 5 })
       */
      clickWithRetry(selector: string, options?: { timeout?: number; retries?: number }): Chainable<void>;

      /**
       * Fill form fields from object
       * @param fields - Object with field names and values
       * @example cy.fillForm({ name: 'John', email: 'john@example.com' })
       */
      fillForm(fields: Record<string, string>): Chainable<void>;

      /**
       * Scroll element into view
       * @param selector - CSS selector for the element
       * @example cy.scrollToElement('.footer')
       */
      scrollToElement(selector: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Assert element contains text (case-insensitive)
       * @param selector - CSS selector for the element
       * @param text - Text to check for
       * @example cy.shouldContainText('.title', 'Hello World')
       */
      shouldContainText(selector: string, text: string): Chainable<void>;

      /**
       * Wait for page to load completely
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;

      /**
       * Hover and wait for submenu
       * @param selector - CSS selector for the element
       * @example cy.hoverWithWait('.menu-item')
       */
      hoverWithWait(selector: string): Chainable<JQuery<HTMLElement>>;

      // ===========================================
      // Assertion Commands
      // ===========================================

      /**
       * Assert response status code
       * @param statusCode - Expected HTTP status code
       * @example cy.shouldHaveStatus(200)
       */
      shouldHaveStatus(statusCode: number): Chainable<void>;

      /**
       * Assert element has class
       * @param selector - CSS selector for the element
       * @param className - Class name to check for
       * @example cy.shouldHaveClass('.btn', 'active')
       */
      shouldHaveClass(selector: string, className: string): Chainable<void>;

      /**
       * Assert URL contains path
       * @param path - Path to check for in URL
       * @example cy.shouldHaveUrlPath('/dashboard')
       */
      shouldHaveUrlPath(path: string): Chainable<void>;

      /**
       * Assert multiple conditions
       * @param assertions - Array of assertion functions
       * @example cy.assertAll([() => cy.get('.el').should('be.visible'), () => cy.url().should('include', 'test')])
       */
      assertAll(assertions: Array<() => Cypress.Chainable<any>>): Chainable<void>;

      // ===========================================
      // Data Generator Commands
      // ===========================================

      /**
       * Generate test data using JSON templates
       * @param templateName - Name of the data template
       * @param options - Generation options
       * @example cy.generateData('user', { count: 5 })
       */
      generateData(templateName: string, options?: {
        count?: number;
        locale?: string;
        seed?: number;
        variations?: boolean;
        unique?: boolean;
      }): Chainable<any[]>;

      /**
       * Generate and export test data
       * @param templateName - Name of the data template
       * @param filename - Output filename
       * @param options - Generation options
       * @example cy.generateAndExport('user', 'test-users.json', { count: 10 })
       */
      generateAndExport(templateName: string, filename: string, options?: {
        count?: number;
        locale?: string;
        seed?: number;
        variations?: boolean;
        unique?: boolean;
      }): Chainable<any[]>;

      /**
       * Load data from generated fixture
       * @param filename - Fixture filename
       * @example cy.loadGeneratedData('test-users.json')
       */
      loadGeneratedData(filename: string): Chainable<any[]>;

      /**
       * Generate user data
       * @param options - Generation options
       * @example cy.generateUser({ count: 3, unique: true })
       */
      generateUser(options?: {
        count?: number;
        locale?: string;
        seed?: number;
        variations?: boolean;
        unique?: boolean;
      }): Chainable<any[]>;

      /**
       * Generate product data
       * @param options - Generation options
       * @example cy.generateProduct({ count: 5 })
       */
      generateProduct(options?: {
        count?: number;
        locale?: string;
        seed?: number;
        variations?: boolean;
        unique?: boolean;
      }): Chainable<any[]>;

      /**
       * Generate order data
       * @param options - Generation options
       * @example cy.generateOrder({ count: 2 })
       */
      generateOrder(options?: {
        count?: number;
        locale?: string;
        seed?: number;
        variations?: boolean;
        unique?: boolean;
      }): Chainable<any[]>;

      // ===========================================
      // Test Tagging Commands
      // ===========================================

      /**
       * Add tags to current test
       * @param tags - Tags to add to the test
       * @example cy.tag('smoke', 'regression')
       * @example cy.tag('api', 'critical', 'integration')
       */
      tag(...tags: string[]): Chainable<void>;

      /**
       * Skip test if tags don't match filter
       * @param allowedTags - Array of allowed tags
       * @example cy.filterByTags(['smoke', 'critical'])
       */
      filterByTags(allowedTags: string[]): Chainable<void>;

      /**
       * Mark test as smoke test
       * @example cy.smoke()
       */
      smoke(): Chainable<void>;

      /**
       * Mark test as regression test
       * @example cy.regression()
       */
      regression(): Chainable<void>;

      /**
       * Mark test as critical test
       * @example cy.critical()
       */
      critical(): Chainable<void>;

      /**
       * Mark test as integration test
       * @example cy.integration()
       */
      integration(): Chainable<void>;

      /**
       * Mark test as API test
       * @example cy.api()
       */
      api(): Chainable<void>;

      /**
       * Mark test as UI test
       * @example cy.ui()
       */
      ui(): Chainable<void>;

      /**
       * Mark test as visual test
       * @example cy.visual()
       */
      visual(): Chainable<void>;

      /**
       * Mark test as slow test
       * @example cy.slow()
       */
      slow(): Chainable<void>;

      /**
       * Mark test as flaky test
       * @example cy.flaky()
       */
      flaky(): Chainable<void>;

      // ===========================================
      // Utility Commands
      // ===========================================

      /**
       * Wait for API response
       * @param alias - API alias to wait for
       * @example cy.waitForApi('/api/users')
       */
      waitForApi(alias: string): Chainable<void>;

      /**
       * Clear all cookies and localStorage
       * @example cy.clearSession()
       */
      clearSession(): Chainable<void>;

      /**
       * Set viewport size
       * @param size - Viewport size ('mobile' | 'tablet' | 'desktop')
       * @example cy.setViewport('desktop')
       * @example cy.setViewport('mobile')
       */
      setViewport(size: 'mobile' | 'tablet' | 'desktop'): Chainable<void>;
    }
  }
}

export {};
