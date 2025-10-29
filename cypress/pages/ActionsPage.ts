import { BasePage } from './BasePage';

/**
 * Actions Page Object Model
 */
export class ActionsPage extends BasePage {
  // Selectors
  private readonly selectors = {
    emailInput: 'input[data-cy="email-input"]',
    disabledInput: 'input[data-cy="disabled-input"]',
    textarea: 'textarea[data-cy="textarea"]',
    clearInputButton: 'button[data-cy="clear"]',
    submitButton: 'button[data-cy="submit"]',
    checkbox: 'input[type="checkbox"]',
    radio: 'input[type="radio"]',
    selectDropdown: 'select[data-cy="select"]',
  };

  /**
   * Navigate to actions page
   */
  visit(): Cypress.Chainable<void> {
    return super.visit('/commands/actions');
  }

  /**
   * Type email
   */
  typeEmail(email: string): Cypress.Chainable<void> {
    return this.typeInto(this.selectors.emailInput, email);
  }

  /**
   * Type into textarea
   */
  typeIntoTexarea(text: string): Cypress.Chainable<void> {
    return this.typeInto(this.selectors.textarea, text);
  }

  /**
   * Clear input field
   */
  clearInput(): Cypress.Chainable<void> {
    return this.clickElement(this.selectors.clearInputButton);
  }

  /**
   * Submit form
   */
  submitForm(): Cypress.Chainable<void> {
    return this.clickElement(this.selectors.submitButton);
  }

  /**
   * Check checkbox
   */
  checkCheckbox(index: number = 0): Cypress.Chainable<void> {
    return this.getElement(this.selectors.checkbox).eq(index).check();
  }

  /**
   * Select radio button
   */
  selectRadio(value: string): Cypress.Chainable<void> {
    return this.getElement(this.selectors.radio).check(value);
  }

  /**
   * Select from dropdown
   */
  selectFromDropdown(option: string): Cypress.Chainable<void> {
    return this.getElement(this.selectors.selectDropdown).select(option);
  }

  /**
   * Verify input is disabled
   */
  verifyInputDisabled(): Cypress.Chainable<void> {
    return this.getElement(this.selectors.disabledInput).should('be.disabled');
  }

  /**
   * Fill entire form
   */
  fillForm(formData: {
    email?: string;
    textarea?: string;
    checkbox?: boolean;
    dropdown?: string;
  }): Cypress.Chainable<void> {
    if (formData.email) {
      this.typeEmail(formData.email);
    }
    if (formData.textarea) {
      this.typeIntoTexarea(formData.textarea);
    }
    if (formData.checkbox) {
      this.checkCheckbox();
    }
    if (formData.dropdown) {
      this.selectFromDropdown(formData.dropdown);
    }
    return cy.wrap(null);
  }
}

