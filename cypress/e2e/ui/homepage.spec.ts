/**
 * Homepage E2E Tests
 * Demonstrates Page Object Model, custom commands, and assertions
 */

import { HomePage } from '@pages/HomePage';

describe('Homepage E2E Tests', () => {
  let homePage: HomePage;

  before(() => {
    homePage = new HomePage();
  });

  beforeEach(() => {
    // Apply tag filtering
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
    homePage.visit();
    cy.waitForPageLoad();
  });

  it('should load homepage successfully', () => {
    cy.smoke(); // Mark as smoke test
    homePage.verifyNavigationVisible();
    homePage.getTitleText().should('contain', 'Cypress');
  });

  it('should navigate to Commands page', () => {
    cy.regression(); // Mark as regression test
    homePage.clickCommandsLink();
    cy.url().should('include', '/commands');
    cy.shouldHaveUrlPath('/commands');
  });

  it('should navigate to Actions page', () => {
    homePage.clickActionsLink();
    cy.url().should('include', '/actions');
  });

  it('should verify page title', () => {
    homePage.verifyTitle('Cypress');
  });

  it('should work on different viewport sizes', () => {
    cy.tag('responsive', 'visual'); // Mark with custom tags
    const viewports: Array<'mobile' | 'tablet' | 'desktop'> = ['mobile', 'tablet', 'desktop'];

    viewports.forEach((viewport) => {
      cy.setViewport(viewport);
      homePage.verifyNavigationVisible();
      homePage.getTitleText().should('be.visible');
    });
  });

  context('Navigation Tests', () => {
    it('should have working navigation links', () => {
      // Verify all navigation links are visible and clickable
      cy.get('nav a').each(($link) => {
        cy.wrap($link).should('be.visible');
        cy.wrap($link).should('have.attr', 'href');
      });
    });

    it('should maintain navigation state after page reload', () => {
      homePage.clickCommandsLink();
      cy.reload();
      cy.url().should('include', '/commands');
    });
  });
});

