#!/usr/bin/env node

/**
 * CLI Script for Generating Test Data
 * 
 * @author Muneeb Ahmed - https://www.linkedin.com/in/muneeb-ahmed-0123
 * @version 1.0.0
 * @since 1.0.0
 * 
 * Usage:
 *   node scripts/generate-test-data.js user --count 10 --output users.json
 *   node scripts/generate-test-data.js product --count 5 --unique
 *   node scripts/generate-test-data.js order --count 3 --variations
 */

const fs = require('fs');
const path = require('path');

// Simple data generator for CLI (without TypeScript dependencies)
class SimpleDataGenerator {
  constructor(seed) {
    this.seed = seed || Math.random() * 1000000;
    this.random = this.createSeededRandom(this.seed);
  }

  createSeededRandom(seed) {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  randomInt(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  randomChoice(array) {
    return array[Math.floor(this.random() * array.length)];
  }

  randomString(length, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(this.random() * charset.length));
    }
    return result;
  }

  generateUser() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    const states = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];
    const roles = ['admin', 'user', 'moderator', 'guest'];
    const statuses = ['active', 'inactive', 'pending', 'suspended'];

    const firstName = this.randomChoice(firstNames);
    const lastName = this.randomChoice(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${this.randomInt(1, 999)}@example.com`;

    return {
      id: this.randomInt(1, 999999),
      firstName,
      lastName,
      email,
      phone: `(${this.randomInt(200, 999)}) ${this.randomInt(200, 999)}-${this.randomInt(1000, 9999)}`,
      dateOfBirth: this.generateDate(),
      address: {
        street: `${this.randomInt(1, 9999)} ${this.randomChoice(['Main', 'Oak', 'Pine', 'Elm', 'Cedar'])} St`,
        city: this.randomChoice(cities),
        state: this.randomChoice(states),
        zipCode: this.randomString(5, '0123456789'),
        country: this.randomChoice(countries)
      },
      profile: {
        bio: `Passionate about technology and innovation. Love exploring new ideas and creating meaningful solutions.`,
        avatar: `https://example.com/avatars/${this.randomString(8)}.jpg`,
        website: `https://${this.randomString(10)}.com`,
        socialMedia: {
          twitter: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
          linkedin: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          github: `github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`
        }
      },
      preferences: {
        theme: this.randomChoice(['light', 'dark', 'auto']),
        language: this.randomChoice(['en', 'es', 'fr', 'de', 'it']),
        notifications: this.random() < 0.5,
        newsletter: this.random() < 0.7
      },
      role: this.randomChoice(roles),
      status: this.randomChoice(statuses),
      createdAt: this.generateDateTime(),
      updatedAt: this.generateDateTime()
    };
  }

  generateProduct() {
    const names = [
      'Wireless Bluetooth Headphones', 'Smart Fitness Tracker', 'Organic Cotton T-Shirt',
      'Professional Camera Lens', 'Ergonomic Office Chair', 'Stainless Steel Water Bottle',
      'LED Desk Lamp', 'Wireless Charging Pad', 'Bluetooth Speaker', 'Gaming Mechanical Keyboard'
    ];
    const brands = ['Apple', 'Samsung', 'Sony', 'Bose', 'JBL', 'Logitech', 'Razer', 'Corsair'];
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'];
    const availabilities = ['in-stock', 'out-of-stock', 'pre-order', 'discontinued'];
    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

    const name = this.randomChoice(names);
    const brand = this.randomChoice(brands);
    const price = parseFloat((this.random() * 1000 + 10).toFixed(2));
    const rating = parseFloat((this.random() * 4 + 1).toFixed(1));

    return {
      id: this.randomInt(1, 999999),
      name,
      description: `High-quality ${name.toLowerCase()} designed for durability and performance. Perfect for everyday use.`,
      price,
      currency: this.randomChoice(currencies),
      category: this.randomChoice(categories),
      brand,
      sku: `${brand.toUpperCase()}-${this.randomString(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')}`,
      inStock: this.random() < 0.8,
      quantity: this.randomInt(0, 100),
      weight: parseFloat((this.random() * 10 + 0.1).toFixed(2)),
      dimensions: {
        length: this.randomInt(5, 50),
        width: this.randomInt(5, 50),
        height: this.randomInt(5, 50),
        unit: 'inches'
      },
      images: [
        `https://example.com/images/${this.randomString(8)}.jpg`,
        `https://example.com/images/${this.randomString(8)}.jpg`
      ],
      tags: this.randomChoice([
        ['wireless', 'bluetooth', 'portable'],
        ['smart', 'fitness', 'tracking'],
        ['organic', 'cotton', 'sustainable'],
        ['professional', 'high-quality', 'durable']
      ]),
      rating,
      reviews: this.randomInt(0, 1000),
      features: this.randomChoice([
        ['Wireless connectivity', 'Bluetooth 5.0', 'Fast charging'],
        ['Water resistant', 'Noise cancellation', 'Voice control'],
        ['App integration', 'Customizable settings', 'Long battery life']
      ]),
      specifications: {
        'Screen Size': `${this.randomInt(5, 15)} inches`,
        'Resolution': `${this.randomInt(720, 4)}K`,
        'Battery Life': `${this.randomInt(8, 24)} hours`,
        'Weight': `${this.randomInt(100, 500)}g`
      },
      availability: this.randomChoice(availabilities),
      shipping: {
        free: this.random() < 0.5,
        cost: this.random() < 0.5 ? parseFloat((this.random() * 20).toFixed(2)) : 0,
        time: this.randomChoice(['1-2 days', '3-5 days', '1 week', '2 weeks'])
      },
      createdAt: this.generateDateTime(),
      updatedAt: this.generateDateTime()
    };
  }

  generateOrder() {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const paymentMethods = ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer', 'cash'];
    const paymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled'];
    const shippingMethods = ['standard', 'express', 'overnight', 'pickup', 'international', 'free'];

    const itemCount = this.randomInt(1, 5);
    const items = Array.from({ length: itemCount }, () => ({
      productId: this.randomInt(1, 999999),
      quantity: this.randomInt(1, 3),
      price: parseFloat((this.random() * 100 + 10).toFixed(2))
    }));

    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = this.random() < 0.5 ? parseFloat((this.random() * 20).toFixed(2)) : 0;
    const tax = parseFloat((itemsTotal * 0.08).toFixed(2));
    const discount = this.random() < 0.3 ? parseFloat((this.random() * 20).toFixed(2)) : 0;
    const total = parseFloat((itemsTotal + shippingCost + tax - discount).toFixed(2));

    return {
      id: `ORD-${this.randomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')}`,
      customerId: this.randomInt(1, 999999),
      items,
      total,
      currency: 'USD',
      status: this.randomChoice(statuses),
      paymentMethod: this.randomChoice(paymentMethods),
      paymentStatus: this.randomChoice(paymentStatuses),
      shippingAddress: this.generateAddress(),
      billingAddress: this.generateAddress(),
      shippingMethod: this.randomChoice(shippingMethods),
      shippingCost,
      tax,
      discount,
      couponCode: this.random() < 0.2 ? this.randomChoice(['SAVE10', 'WELCOME20', 'SUMMER15']) : null,
      notes: this.random() < 0.3 ? this.randomChoice([
        'Please leave package at front door if no answer',
        'Deliver to back entrance',
        'Call before delivery',
        'Fragile - handle with care'
      ]) : null,
      trackingNumber: this.random() < 0.7 ? `1Z${this.randomString(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')}` : null,
      estimatedDelivery: this.generateFutureDate(),
      actualDelivery: this.random() < 0.8 ? this.generateFutureDate() : null,
      createdAt: this.generateDateTime(),
      updatedAt: this.generateDateTime()
    };
  }

  generateAddress() {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    const states = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];

    return {
      street: `${this.randomInt(1, 9999)} ${this.randomChoice(['Main', 'Oak', 'Pine', 'Elm', 'Cedar'])} St`,
      city: this.randomChoice(cities),
      state: this.randomChoice(states),
      zipCode: this.randomString(5, '0123456789'),
      country: this.randomChoice(countries)
    };
  }

  generateDate() {
    const now = new Date();
    const past = new Date(now.getFullYear() - 50, 0, 1);
    const future = new Date(now.getFullYear() - 18, 11, 31);
    const timestamp = past.getTime() + this.random() * (future.getTime() - past.getTime());
    return new Date(timestamp).toISOString().split('T')[0];
  }

  generateDateTime() {
    const now = new Date();
    const past = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
    const future = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const timestamp = past.getTime() + this.random() * (future.getTime() - past.getTime());
    return new Date(timestamp).toISOString();
  }

  generateFutureDate() {
    const now = new Date();
    const future = new Date(now.getTime() + (this.randomInt(1, 30) * 24 * 60 * 60 * 1000));
    return future.toISOString().split('T')[0];
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const template = args[0];
const options = {};

// Parse options
for (let i = 1; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  
  if (key === 'count') {
    options.count = parseInt(value);
  } else if (key === 'output') {
    options.output = value;
  } else if (key === 'unique') {
    options.unique = true;
  } else if (key === 'variations') {
    options.variations = true;
  } else if (key === 'seed') {
    options.seed = parseInt(value);
  }
}

// Default values
const count = options.count || 1;
const output = options.output || `${template}s.json`;
const unique = options.unique || false;
const seed = options.seed || Math.random() * 1000000;

// Generate data
const generator = new SimpleDataGenerator(seed);
const data = [];

for (let i = 0; i < count; i++) {
  let record;
  
  switch (template) {
    case 'user':
      record = generator.generateUser();
      break;
    case 'product':
      record = generator.generateProduct();
      break;
    case 'order':
      record = generator.generateOrder();
      break;
    default:
      console.error(`Unknown template: ${template}`);
      console.error('Available templates: user, product, order');
      process.exit(1);
  }
  
  if (unique && data.length > 0) {
    // Simple uniqueness check for emails/IDs
    const isUnique = template === 'user' 
      ? !data.some(item => item.email === record.email)
      : !data.some(item => item.id === record.id);
    
    if (!isUnique) {
      i--; // Retry this iteration
      continue;
    }
  }
  
  data.push(record);
}

// Write to file
const outputPath = path.join(__dirname, '..', 'cypress', 'fixtures', output);
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✅ Generated ${data.length} ${template} records`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`🔢 Seed: ${seed}`);

if (unique) {
  console.log(`🔒 All records are unique`);
}

if (options.variations) {
  console.log(`🎨 Variations enabled`);
}
