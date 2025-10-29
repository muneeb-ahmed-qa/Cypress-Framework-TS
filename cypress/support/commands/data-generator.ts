/// <reference types="cypress" />

/**
 * Data Generator custom commands
 */

import { JSONDataGenerator, GenerationOptions } from '@utils/json-data-generator';

// Global data generator instance
let dataGenerator: JSONDataGenerator;

// Initialize data generator
const getDataGenerator = (): JSONDataGenerator => {
  if (!dataGenerator) {
    dataGenerator = new JSONDataGenerator();
  }
  return dataGenerator;
};

// Generate test data
Cypress.Commands.add('generateData', (templateName: string, options: GenerationOptions = {}) => {
  const generator = getDataGenerator();
  const data = generator.generate(templateName, options);
  return cy.wrap(data);
});

// Generate and export data
Cypress.Commands.add('generateAndExport', (templateName: string, filename: string, options: GenerationOptions = {}) => {
  const generator = getDataGenerator();
  const data = generator.generateAndExport(templateName, filename, options);
  return cy.wrap(data);
});

// Load generated data
Cypress.Commands.add('loadGeneratedData', (filename: string) => {
  return cy.fixture(filename);
});

// Generate user data
Cypress.Commands.add('generateUser', (options: GenerationOptions = {}) => {
  const generator = getDataGenerator();
  const data = generator.generate('user', options);
  return cy.wrap(data);
});

// Generate product data
Cypress.Commands.add('generateProduct', (options: GenerationOptions = {}) => {
  const generator = getDataGenerator();
  const data = generator.generate('product', options);
  return cy.wrap(data);
});

// Generate order data
Cypress.Commands.add('generateOrder', (options: GenerationOptions = {}) => {
  const generator = getDataGenerator();
  const data = generator.generate('order', options);
  return cy.wrap(data);
});

export {};
