import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 */
export class HomePage extends BasePage {
  // Selectors
  private readonly selectors = {
    commandsLink: 'a[href*="/commands"]',
    actionsLink: 'a[href*="/actions"]',
    utilitiesLink: 'a[href*="/utilities"]',
    cypressApiLink: 'a[href*="/cypress-api"]',
    queryingButton: '[data-cy="querying"]',
    title: 'h1',
    navigation: 'nav',
  };

  /**
   * Navigate to home page
   */
  visit(): Cypress.Chainable<void> {
    return super.visit('/');
  }

  /**
   * Click on Commands link
   */
  clickCommandsLink(): Cypress.Chainable<void> {
    return this.clickElement(this.selectors.commandsLink);
  }

  /**
   * Click on Actions link
   */
  clickActionsLink(): Cypress.Chainable<void> {
    return this.clickElement(this.selectors.actionsLink);
  }

  /**
   * Click on Querying button
   */
  clickQueryingButton(): Cypress.Chainable<void> {
    return this.clickElement(this.selectors.queryingButton);
  }

  /**
   * Verify page title
   */
  verifyTitle(expectedTitle: string): Cypress.Chainable<void> {
    return this.shouldContainText(this.selectors.title, expectedTitle);
  }

  /**
   * Verify navigation is visible
   */
  verifyNavigationVisible(): Cypress.Chainable<void> {
    return this.waitForElement(this.selectors.navigation);
  }

  /**
   * Get page title text
   */
  getTitleText(): Cypress.Chainable<string> {
    return this.getText(this.selectors.title);
  }
}

