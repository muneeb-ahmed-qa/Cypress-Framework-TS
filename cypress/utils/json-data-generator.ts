/**
 * JSON-based Test Data Generator
 * Generates realistic test data based on JSON templates and schemas
 * 
 * @author Muneeb Ahmed - https://www.linkedin.com/in/muneeb-ahmed-0123
 * @version 1.0.0
 * @since 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';

export interface DataTemplate {
  schema: Record<string, any>;
  constraints?: Record<string, any>;
  enums?: Record<string, string[]>;
  data?: Record<string, any[]>;
}

export interface GenerationOptions {
  count?: number;
  locale?: string;
  seed?: number;
  variations?: boolean;
  unique?: boolean;
}

export class JSONDataGenerator {
  private templates: Map<string, DataTemplate> = new Map();
  private random: () => number;

  constructor(seed?: number) {
    // Use seed for reproducible random numbers
    this.random = this.createSeededRandom(seed || Math.random() * 1000000);
  }

  /**
   * Load data template from JSON file
   */
  loadTemplate(templateName: string, templatePath?: string): DataTemplate {
    const templateFile = templatePath || path.join(__dirname, `../data/templates/${templateName}.json`);
    
    try {
      const templateData = fs.readFileSync(templateFile, 'utf8');
      const template: DataTemplate = JSON.parse(templateData);
      this.templates.set(templateName, template);
      return template;
    } catch (error) {
      throw new Error(`Failed to load template ${templateName}: ${error}`);
    }
  }

  /**
   * Generate data based on template
   */
  generate(templateName: string, options: GenerationOptions = {}): any[] {
    const template = this.templates.get(templateName) || this.loadTemplate(templateName);
    const { count = 1, variations = true, unique = false } = options;
    
    const results: any[] = [];
    const generatedValues = new Set<string>();

    for (let i = 0; i < count; i++) {
      let data: any;
      let attempts = 0;
      const maxAttempts = unique ? 100 : 1;

      do {
        data = this.generateSingleRecord(template, variations);
        attempts++;
      } while (unique && this.isDuplicate(data, generatedValues) && attempts < maxAttempts);

      if (unique && attempts >= maxAttempts) {
        console.warn(`Could not generate unique record after ${maxAttempts} attempts`);
      }

      if (unique) {
        generatedValues.add(JSON.stringify(data));
      }

      results.push(data);
    }

    return results;
  }

  /**
   * Generate a single record based on template
   */
  private generateSingleRecord(template: DataTemplate, variations: boolean = true): any {
    const record: any = {};

    for (const [field, type] of Object.entries(template.schema)) {
      record[field] = this.generateFieldValue(field, type, template, variations);
    }

    return record;
  }

  /**
   * Generate value for a specific field
   */
  private generateFieldValue(field: string, type: any, template: DataTemplate, variations: boolean): any {
    const constraints = template.constraints?.[field] || {};
    const enums = template.enums?.[field];
    const data = template.data?.[field];

    // Handle nested objects
    if (typeof type === 'object' && type !== null && !Array.isArray(type)) {
      const nestedRecord: any = {};
      for (const [nestedField, nestedType] of Object.entries(type)) {
        nestedRecord[nestedField] = this.generateFieldValue(nestedField, nestedType, template, variations);
      }
      return nestedRecord;
    }

    // Handle arrays
    if (Array.isArray(type)) {
      const arrayType = type[0];
      const arrayLength = this.randomInt(1, 5);
      return Array.from({ length: arrayLength }, () => 
        this.generateFieldValue(field, arrayType, template, variations)
      );
    }

    // Handle primitive types
    switch (type) {
      case 'string':
        return this.generateString(field, constraints, data, variations);
      
      case 'number':
        return this.generateNumber(constraints);
      
      case 'boolean':
        return this.randomBoolean();
      
      case 'email':
        return this.generateEmail(field, data, variations);
      
      case 'phone':
        return this.generatePhone(constraints);
      
      case 'date':
        return this.generateDate(constraints);
      
      case 'datetime':
        return this.generateDateTime();
      
      case 'url':
        return this.generateUrl();
      
      case 'text':
        return this.generateText(data, constraints);
      
      case 'enum':
        return this.generateEnum(enums, variations);
      
      default:
        if (enums) {
          return this.generateEnum(enums, variations);
        }
        return this.generateString(field, constraints, data, variations);
    }
  }

  /**
   * Generate string value
   */
  private generateString(field: string, constraints: any, data?: any[], variations: boolean = true): string {
    if (data && data.length > 0) {
      const value = this.randomChoice(data);
      return variations ? this.varyString(value) : value;
    }

    const minLength = constraints.minLength || 3;
    const maxLength = constraints.maxLength || 20;
    const length = this.randomInt(minLength, maxLength);
    
    return this.randomString(length);
  }

  /**
   * Generate number value
   */
  private generateNumber(constraints: any): number {
    const min = constraints.min || 0;
    const max = constraints.max || 100;
    const decimal = constraints.decimal || 0;
    
    const value = this.random() * (max - min) + min;
    return decimal > 0 ? parseFloat(value.toFixed(decimal)) : Math.floor(value);
  }

  /**
   * Generate boolean value
   */
  private randomBoolean(): boolean {
    return this.random() < 0.5;
  }

  /**
   * Generate email address
   */
  private generateEmail(field: string, data?: any[], variations: boolean = true): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
    const firstNames = ['john', 'jane', 'mike', 'sarah', 'david', 'emily', 'chris', 'lisa'];
    const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller'];
    
    const firstName = this.randomChoice(firstNames);
    const lastName = this.randomChoice(lastNames);
    const domain = this.randomChoice(domains);
    const number = this.randomInt(1, 999);
    
    return `${firstName}.${lastName}${number}@${domain}`;
  }

  /**
   * Generate phone number
   */
  private generatePhone(constraints: any): string {
    const format = constraints.format || 'us';
    
    if (format === 'us') {
      const areaCode = this.randomInt(200, 999);
      const exchange = this.randomInt(200, 999);
      const number = this.randomInt(1000, 9999);
      return `(${areaCode}) ${exchange}-${number}`;
    }
    
    return this.randomString(10, '0123456789');
  }

  /**
   * Generate date
   */
  private generateDate(constraints: any): string {
    const now = new Date();
    const minAge = constraints.minAge || 0;
    const maxAge = constraints.maxAge || 100;
    
    const minDate = new Date(now.getFullYear() - maxAge, 0, 1);
    const maxDate = new Date(now.getFullYear() - minAge, 11, 31);
    
    const timestamp = minDate.getTime() + this.random() * (maxDate.getTime() - minDate.getTime());
    return new Date(timestamp).toISOString().split('T')[0];
  }

  /**
   * Generate datetime
   */
  private generateDateTime(): string {
    const now = new Date();
    const past = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000)); // 1 year ago
    const future = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    
    const timestamp = past.getTime() + this.random() * (future.getTime() - past.getTime());
    return new Date(timestamp).toISOString();
  }

  /**
   * Generate URL
   */
  private generateUrl(): string {
    const protocols = ['https://', 'http://'];
    const domains = ['example.com', 'test.com', 'demo.org', 'sample.net'];
    const paths = ['', '/page', '/product', '/user', '/api', '/docs'];
    
    const protocol = this.randomChoice(protocols);
    const domain = this.randomChoice(domains);
    const path = this.randomChoice(paths);
    
    return `${protocol}${domain}${path}`;
  }

  /**
   * Generate text content
   */
  private generateText(data?: any[], constraints?: any): string {
    if (data && data.length > 0) {
      return this.randomChoice(data);
    }
    
    const minLength = constraints?.minLength || 50;
    const maxLength = constraints?.maxLength || 500;
    const length = this.randomInt(minLength, maxLength);
    
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
    const sentences: string[] = [];
    let currentLength = 0;
    
    while (currentLength < length) {
      const sentenceLength = this.randomInt(5, 15);
      const sentence = Array.from({ length: sentenceLength }, () => this.randomChoice(words)).join(' ');
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
      currentLength += sentence.length + 1;
    }
    
    return sentences.join(' ');
  }

  /**
   * Generate enum value
   */
  private generateEnum(enums?: string[], variations: boolean = true): string {
    if (!enums || enums.length === 0) {
      return 'unknown';
    }
    
    return this.randomChoice(enums);
  }

  /**
   * Generate random string
   */
  private randomString(length: number, charset: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(this.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate random integer
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Random choice from array
   */
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  /**
   * Vary string with random modifications
   */
  private varyString(str: string): string {
    if (this.random() < 0.3) {
      // Add random number
      return str + this.randomInt(1, 999);
    } else if (this.random() < 0.2) {
      // Add random suffix
      const suffixes = ['_test', '_demo', '_sample', '_v2', '_new'];
      return str + this.randomChoice(suffixes);
    }
    return str;
  }

  /**
   * Check if data is duplicate
   */
  private isDuplicate(data: any, generatedValues: Set<string>): boolean {
    return generatedValues.has(JSON.stringify(data));
  }

  /**
   * Create seeded random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  /**
   * Export generated data to JSON file
   */
  exportToFile(data: any[], filename: string, outputDir: string = './cypress/fixtures'): void {
    const filePath = path.join(outputDir, filename);
    const jsonData = JSON.stringify(data, null, 2);
    
    try {
      fs.writeFileSync(filePath, jsonData, 'utf8');
      console.log(`Data exported to ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to export data to ${filePath}: ${error}`);
    }
  }

  /**
   * Generate and export data
   */
  generateAndExport(templateName: string, filename: string, options: GenerationOptions = {}): any[] {
    const data = this.generate(templateName, options);
    this.exportToFile(data, filename);
    return data;
  }
}
