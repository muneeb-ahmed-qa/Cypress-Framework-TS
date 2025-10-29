/**
 * Actions Page E2E Tests
 * Demonstrates form interactions, validations, and complex user workflows
 */

import { ActionsPage } from '@pages/ActionsPage';
import { generateRandomEmail } from '@support/utils/helpers';
import { getDecryptedPassword } from '@utils/password-encryption';

describe('Actions Page E2E Tests', () => {
  let actionsPage: ActionsPage;

  before(() => {
    actionsPage = new ActionsPage();
  });

  beforeEach(() => {
    actionsPage.visit();
    cy.waitForPageLoad();
  });

  it('should type email into input field', () => {
    const email = generateRandomEmail();
    actionsPage.typeEmail(email);
    cy.get('input[data-cy="email-input"]').should('have.value', email);
  });

  it('should type into textarea', () => {
    const message = 'This is a test message for the textarea field';
    actionsPage.typeIntoTexarea(message);
    cy.get('textarea[data-cy="textarea"]').should('contain.value', message);
  });

  it('should check checkbox', () => {
    actionsPage.checkCheckbox(0);
    cy.get('input[type="checkbox"]').first().should('be.checked');
  });

  it('should select from dropdown', () => {
    actionsPage.selectFromDropdown('Oranges');
    cy.get('select[data-cy="select"]').should('have.value', 'Oranges');
  });

  it('should fill complete form', () => {
    const formData = {
      email: generateRandomEmail(),
      textarea: 'Complete form test message',
      checkbox: true,
      dropdown: 'Apples',
    };

    actionsPage.fillForm(formData);
    
    cy.get('input[data-cy="email-input"]').should('have.value', formData.email);
    cy.get('textarea[data-cy="textarea"]').should('contain.value', formData.textarea);
    cy.get('input[type="checkbox"]').first().should('be.checked');
    cy.get('select[data-cy="select"]').should('have.value', formData.dropdown);
  });

  it('should handle authentication with encrypted password', () => {
    // This test demonstrates using encrypted passwords
    const testPassword = getDecryptedPassword('test');
    expect(testPassword).to.be.a('string');
    expect(testPassword.length).to.be.greaterThan(0);
    
    // In a real scenario, you would use this password for authentication
    cy.log('Using encrypted password for authentication');
  });

  it('should clear input field', () => {
    const email = generateRandomEmail();
    actionsPage.typeEmail(email);
    actionsPage.clearInput();
    cy.get('input[data-cy="email-input"]').should('have.value', '');
  });

  it('should verify disabled input is not editable', () => {
    actionsPage.verifyInputDisabled();
    cy.get('input[data-cy="disabled-input"]')
      .should('be.disabled')
      .type('test', { force: true })
      .should('have.value', '');
  });

  it('should handle multiple checkbox selections', () => {
    cy.get('input[type="checkbox"]').each(($checkbox, index) => {
      if (index < 3) {
        cy.wrap($checkbox).check();
      }
    });

    cy.get('input[type="checkbox"]:checked').should('have.length.at.least', 3);
  });

  it('should validate form inputs', () => {
    // Test email validation
    cy.get('input[data-cy="email-input"]').type('invalid-email');
    cy.get('input[data-cy="email-input"]')
      .blur()
      .then(($input) => {
        // Add validation check based on your app's implementation
        expect($input.val()).to.not.be.empty;
      });
  });
});

