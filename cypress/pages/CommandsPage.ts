import { BasePage } from './BasePage';

/**
 * Commands Page Object Model
 * 
 * @author Muneeb Ahmed - https://www.linkedin.com/in/muneeb-ahmed-0123
 * @version 1.0.0
 * @since 1.0.0
 */
export class CommandsPage extends BasePage {
  // Selectors
  private readonly selectors = {
    queryingSection: '[data-cy="querying"]',
    traversalSection: '[data-cy="traversal"]',
    actionsSection: '[data-cy="actions"]',
    assertionsSection: '[data-cy="assertions"]',
    queryButton: '.query-button',
    queryList: '.query-list',
    inputField: 'input[data-cy="query-input"]',
  };

  /**
   * Navigate to commands page
   */
  visit(): Cypress.Chainable<void> {
    return super.visit('/commands/querying');
  }

  /**
   * Query button by text
   */
  queryButtonByText(text: string): Cypress.Chainable<void> {
    return this.getElement(this.selectors.queryButton)
      .contains(text)
      .should('be.visible')
      .click();
  }

  /**
   * Type into query input
   */
  typeIntoQueryInput(text: string): Cypress.Chainable<void> {
    return this.typeInto(this.selectors.inputField, text);
  }

  /**
   * Verify query list is visible
   */
  verifyQueryListVisible(): Cypress.Chainable<void> {
    return this.waitForElement(this.selectors.queryList);
  }

  /**
   * Click on section
   */
  clickSection(sectionName: string): Cypress.Chainable<void> {
    const selector = this.selectors[`${sectionName}Section` as keyof typeof this.selectors];
    if (!selector) {
      throw new Error(`Section ${sectionName} not found`);
    }
    return this.clickElement(selector);
  }
}

