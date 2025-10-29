/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mount React component
     * @example cy.mount(<Component />)
     */
    mount(component: React.ReactElement): Chainable<void>;
  }
}

