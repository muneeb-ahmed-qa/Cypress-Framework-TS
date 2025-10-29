/**
 * Test Data Builder pattern for creating test data
 * 
 * @author Muneeb Ahmed - https://www.linkedin.com/in/muneeb-ahmed-0123
 * @version 1.0.0
 * @since 1.0.0
 */

import { generateRandomEmail, generateRandomString, generateRandomNumber } from '../support/utils/helpers';

export class TestDataBuilder {
  private data: Record<string, any> = {};

  /**
   * Build user data
   */
  static user(): TestDataBuilder {
    return new TestDataBuilder().withDefaults({
      name: `Test User ${generateRandomString(5)}`,
      email: generateRandomEmail(),
      age: generateRandomNumber(18, 65),
    });
  }

  /**
   * Build post data
   */
  static post(): TestDataBuilder {
    return new TestDataBuilder().withDefaults({
      title: `Test Post ${generateRandomString(10)}`,
      body: `This is a test post content. ${generateRandomString(50)}`,
      userId: generateRandomNumber(1, 10),
    });
  }

  /**
   * Set default values
   */
  withDefaults(defaults: Record<string, any>): this {
    this.data = { ...this.data, ...defaults };
    return this;
  }

  /**
   * Override specific field
   */
  with(property: string, value: any): this {
    this.data[property] = value;
    return this;
  }

  /**
   * Override multiple fields
   */
  withFields(fields: Record<string, any>): this {
    this.data = { ...this.data, ...fields };
    return this;
  }

  /**
   * Build final data object
   */
  build(): Record<string, any> {
    return { ...this.data };
  }
}

