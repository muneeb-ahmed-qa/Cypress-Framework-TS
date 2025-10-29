# JSON Test Data Generator

A comprehensive test data generation system using JSON templates and schemas for creating realistic test data.

## 🚀 Features

- **JSON-based Templates**: Define data schemas using JSON files
- **Realistic Data**: Generate realistic names, emails, addresses, and more
- **Constraints & Validation**: Apply business rules and data constraints
- **Variations**: Generate varied data to avoid duplicates
- **Unique Data**: Ensure uniqueness when needed
- **Export Capabilities**: Save generated data to JSON files
- **CLI Support**: Command-line interface for data generation
- **Cypress Integration**: Custom commands for test data generation

## 📁 Template Structure

### User Template (`cypress/data/templates/user.json`)

```json
{
  "schema": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "email",
    "phone": "phone",
    "dateOfBirth": "date",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    },
    "role": "enum",
    "status": "enum"
  },
  "constraints": {
    "firstName": { "minLength": 2, "maxLength": 50 },
    "dateOfBirth": { "minAge": 18, "maxAge": 100 }
  },
  "enums": {
    "role": ["admin", "user", "moderator", "guest"],
    "status": ["active", "inactive", "pending", "suspended"]
  },
  "data": {
    "firstName": ["John", "Jane", "Michael", "Sarah"],
    "lastName": ["Smith", "Johnson", "Williams", "Brown"]
  }
}
```

## 🛠️ Usage

### In Cypress Tests

```typescript
// Generate single user
cy.generateUser().then((users) => {
  expect(users).to.have.length(1);
  expect(users[0]).to.have.property('email');
});

// Generate multiple users with options
cy.generateUser({ 
  count: 5, 
  unique: true, 
  variations: true 
}).then((users) => {
  expect(users).to.have.length(5);
});

// Generate and export data
cy.generateAndExport('user', 'test-users.json', { count: 10 });

// Load generated data
cy.loadGeneratedData('test-users.json').then((users) => {
  // Use the data in tests
});
```

### Command Line Interface

```bash
# Generate 10 users
npm run generate-users

# Generate 20 products
npm run generate-products

# Generate 15 orders
npm run generate-orders

# Custom generation
node scripts/generate-test-data.js user --count 50 --unique --output my-users.json
node scripts/generate-test-data.js product --count 100 --variations --seed 12345
```

### Programmatic Usage

```typescript
import { JSONDataGenerator } from '@utils/json-data-generator';

const generator = new JSONDataGenerator();

// Generate data
const users = generator.generate('user', { count: 10, unique: true });

// Export to file
generator.exportToFile(users, 'generated-users.json');

// Generate and export in one step
const products = generator.generateAndExport('product', 'products.json', { count: 20 });
```

## 📊 Available Templates

### 1. User Template
- **Fields**: id, firstName, lastName, email, phone, dateOfBirth, address, profile, preferences, role, status
- **Constraints**: Name length, age limits, email format
- **Enums**: Role, status, theme, language
- **Data**: Realistic names, cities, states, countries

### 2. Product Template
- **Fields**: id, name, description, price, category, brand, sku, inStock, images, tags, rating, reviews
- **Constraints**: Price limits, rating range, quantity limits
- **Enums**: Category, availability, currency
- **Data**: Product names, brands, categories, features

### 3. Order Template
- **Fields**: id, customerId, items, total, status, paymentMethod, shippingAddress, trackingNumber
- **Constraints**: Total limits, item counts
- **Enums**: Status, payment method, shipping method
- **Data**: Coupon codes, tracking numbers, notes

## ⚙️ Configuration Options

### Generation Options

```typescript
interface GenerationOptions {
  count?: number;        // Number of records to generate
  locale?: string;       // Locale for data generation
  seed?: number;         // Seed for reproducible results
  variations?: boolean;  // Enable data variations
  unique?: boolean;      // Ensure unique records
}
```

### Field Types

- **string**: Text with length constraints
- **number**: Numeric values with min/max limits
- **boolean**: True/false values
- **email**: Valid email addresses
- **phone**: Formatted phone numbers
- **date**: Date strings (YYYY-MM-DD)
- **datetime**: ISO datetime strings
- **url**: Valid URLs
- **text**: Longer text content
- **enum**: Values from predefined list
- **object**: Nested objects
- **array**: Arrays of values

### Constraints

```json
{
  "constraints": {
    "firstName": {
      "minLength": 2,
      "maxLength": 50
    },
    "age": {
      "min": 18,
      "max": 100
    },
    "price": {
      "min": 0.01,
      "max": 10000,
      "decimal": 2
    }
  }
}
```

## 🎯 Advanced Features

### Data Variations

Enable variations to generate slightly different data:

```typescript
cy.generateUser({ variations: true }).then((users) => {
  // Names may have numbers or suffixes added
  // john.smith123@example.com
  // jane_doe_test@example.com
});
```

### Unique Data

Ensure all generated records are unique:

```typescript
cy.generateUser({ unique: true, count: 100 }).then((users) => {
  // All 100 users will have unique emails
  const emails = users.map(u => u.email);
  const uniqueEmails = new Set(emails);
  expect(uniqueEmails.size).to.eq(100);
});
```

### Seeded Generation

Use seeds for reproducible data:

```typescript
// Same seed = same data
cy.generateUser({ seed: 12345, count: 5 });
cy.generateUser({ seed: 12345, count: 5 }); // Identical data
```

### Custom Templates

Create your own templates:

1. Create `cypress/data/templates/my-template.json`
2. Define schema, constraints, enums, and data
3. Use in tests: `cy.generateData('my-template')`

## 📈 Performance

### Large Datasets

The generator is optimized for performance:

```typescript
// Generate 1000 users in ~2-3 seconds
cy.generateUser({ count: 1000 }).then((users) => {
  expect(users).to.have.length(1000);
});
```

### Memory Usage

- Efficient memory usage for large datasets
- Streaming support for very large files
- Garbage collection friendly

## 🔧 Customization

### Adding New Field Types

Extend the generator with custom field types:

```typescript
// In json-data-generator.ts
private generateFieldValue(field: string, type: any, template: DataTemplate, variations: boolean): any {
  switch (type) {
    case 'customType':
      return this.generateCustomType(field, template);
    // ... existing cases
  }
}
```

### Custom Data Sources

Add your own data sources:

```json
{
  "data": {
    "customField": ["value1", "value2", "value3"]
  }
}
```

## 🧪 Testing

### Test Data Generation

```typescript
describe('Data Generation Tests', () => {
  it('should generate valid user data', () => {
    cy.generateUser({ count: 10 }).then((users) => {
      users.forEach(user => {
        expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(user.firstName.length).to.be.at.least(2);
        expect(user.firstName.length).to.be.at.most(50);
      });
    });
  });
});
```

### Data Validation

```typescript
it('should respect constraints', () => {
  cy.generateProduct({ count: 20 }).then((products) => {
    products.forEach(product => {
      expect(product.price).to.be.at.least(0.01);
      expect(product.price).to.be.at.most(10000);
      expect(product.rating).to.be.at.least(1);
      expect(product.rating).to.be.at.most(5);
    });
  });
});
```

## 📚 Examples

### E-commerce Test Data

```typescript
// Generate complete e-commerce test scenario
const users = cy.generateUser({ count: 10, unique: true });
const products = cy.generateProduct({ count: 50 });
const orders = cy.generateOrder({ count: 25 });

// Use in tests
cy.wrap(users).then((userList) => {
  cy.wrap(products).then((productList) => {
    // Test user registration with generated data
    userList.forEach(user => {
      cy.visit('/register');
      cy.fillForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    });
  });
});
```

### API Testing

```typescript
// Generate test data for API testing
cy.generateUser({ count: 5 }).then((users) => {
  users.forEach(user => {
    cy.apiRequest('POST', '/users', user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.email).to.eq(user.email);
    });
  });
});
```

## 🚀 Best Practices

1. **Use Templates**: Define reusable data templates
2. **Apply Constraints**: Use constraints to ensure data validity
3. **Enable Variations**: Use variations to avoid duplicate data
4. **Seed for Reproducibility**: Use seeds for consistent test data
5. **Export for Reuse**: Export generated data for multiple test runs
6. **Validate Generated Data**: Always validate generated data in tests
7. **Performance Testing**: Test with large datasets to ensure performance

## 🔍 Troubleshooting

### Common Issues

1. **Template Not Found**: Ensure template file exists in `cypress/data/templates/`
2. **Invalid Schema**: Check JSON syntax and field type definitions
3. **Constraint Violations**: Verify constraint values are reasonable
4. **Memory Issues**: Reduce count for very large datasets
5. **Unique Data Failures**: Increase max attempts or reduce uniqueness requirements

### Debug Mode

Enable debug logging:

```typescript
const generator = new JSONDataGenerator();
generator.debug = true; // Enable debug logging
```

---

The JSON Test Data Generator provides a powerful, flexible way to create realistic test data for your Cypress tests. Use it to generate users, products, orders, and any other data your application needs.
