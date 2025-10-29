/**
 * Utility helper functions
 */

/**
 * Generate random email
 */
export const generateRandomEmail = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test${timestamp}${random}@example.com`;
};

/**
 * Generate random string
 */
export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random number
 */
export const generateRandomNumber = (min: number = 0, max: number = 100): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Date formatting moved to date-helpers.ts for better organization

/**
 * Wait for condition
 */
export const waitForCondition = (
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Cypress.Chainable => {
  const startTime = Date.now();

  const checkCondition = (): Cypress.Chainable => {
    if (condition()) {
      return cy.wrap(true);
    }

    if (Date.now() - startTime > timeout) {
      throw new Error(`Condition not met within ${timeout}ms`);
    }

    return cy.wait(interval).then(() => checkCondition());
  };

  return checkCondition();
};

/**
 * Deep merge objects
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key as keyof T] = deepMerge(target[key], source[key] as Partial<T[keyof T]>);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item: any): item is Record<string, any> => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

