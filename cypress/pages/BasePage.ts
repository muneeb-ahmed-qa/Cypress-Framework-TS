/**
 * Base Page Object Model class
 * All page objects should extend this class
 */

export abstract class BasePage {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || Cypress.config('baseUrl');
  }

  /**
   * Navigate to page
   */
  visit(path: string = ''): Cypress.Chainable<void> {
    const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
    return cy.visit(url);
  }

  /**
   * Get element by selector
   */
  protected getElement(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector);
  }

  /**
   * Click element
   */
  protected clickElement(selector: string): Cypress.Chainable<void> {
    return this.getElement(selector).click();
  }

  /**
   * Type into element
   */
  protected typeInto(selector: string, text: string): Cypress.Chainable<void> {
    return this.getElement(selector).clear().type(text);
  }

  /**
   * Wait for element to be visible
   */
  protected waitForElement(selector: string, timeout: number = 10000): Cypress.Chainable<void> {
    return this.getElement(selector).should('be.visible', { timeout });
  }

  /**
   * Check if element exists
   */
  protected elementExists(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then(($body) => {
      return $body.find(selector).length > 0;
    });
  }

  /**
   * Get text from element
   */
  protected getText(selector: string): Cypress.Chainable<string> {
    return this.getElement(selector).invoke('text');
  }

  /**
   * Assert element contains text
   */
  protected shouldContainText(selector: string, text: string): Cypress.Chainable<void> {
    return this.getElement(selector).should('contain.text', text);
  }

  /**
   * Scroll to element
   */
  protected scrollToElement(selector: string): Cypress.Chainable<void> {
    return this.getElement(selector).scrollIntoView();
  }

  /**
   * Wait for page to load
   */
  protected waitForPageLoad(): Cypress.Chainable<void> {
    return cy.waitForPageLoad();
  }

  /**
   * Take screenshot
   */
  protected takeScreenshot(name: string): Cypress.Chainable<void> {
    return cy.screenshot(name, { capture: 'viewport' });
  }
}

