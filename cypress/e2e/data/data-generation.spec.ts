/**
 * Data Generation Tests
 * Demonstrates JSON-based test data generation capabilities
 */

describe('Data Generation Tests', () => {
  beforeEach(() => {
    // Apply tag filtering
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
    // Clear any previous generated data
    cy.clearSession();
  });

  describe('User Data Generation', () => {
    it('should generate single user with default options', () => {
      cy.tag('data-generation', 'unit'); // Mark with custom tags
      cy.generateUser().then((users) => {
        expect(users).to.have.length(1);
        expect(users[0]).to.have.property('id');
        expect(users[0]).to.have.property('firstName');
        expect(users[0]).to.have.property('lastName');
        expect(users[0]).to.have.property('email');
        expect(users[0]).to.have.property('address');
        expect(users[0].email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should generate multiple users with unique data', () => {
      cy.regression(); // Mark as regression test
      cy.generateUser({ count: 5, unique: true }).then((users) => {
        expect(users).to.have.length(5);
        
        // Check that all users have unique emails
        const emails = users.map(user => user.email);
        const uniqueEmails = new Set(emails);
        expect(uniqueEmails.size).to.eq(5);
        
        // Validate user structure
        users.forEach(user => {
          expect(user).to.have.property('id');
          expect(user).to.have.property('firstName');
          expect(user).to.have.property('lastName');
          expect(user).to.have.property('email');
          expect(user).to.have.property('address');
          expect(user.address).to.have.property('city');
          expect(user.address).to.have.property('state');
          expect(user.address).to.have.property('country');
        });
      });
    });

    it('should generate users with variations', () => {
      cy.generateUser({ count: 3, variations: true }).then((users) => {
        expect(users).to.have.length(3);
        
        // Check that names have variations
        const firstNames = users.map(user => user.firstName);
        const lastNames = users.map(user => user.lastName);
        
        // At least some variation should exist
        expect(new Set(firstNames).size).to.be.greaterThan(1);
        expect(new Set(lastNames).size).to.be.greaterThan(1);
      });
    });

    it('should generate users with specific constraints', () => {
      cy.generateUser({ count: 10 }).then((users) => {
        users.forEach(user => {
          // Check age constraints (18-100 years)
          const birthYear = new Date(user.dateOfBirth).getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;
          
          expect(age).to.be.at.least(18);
          expect(age).to.be.at.most(100);
          
          // Check name length constraints
          expect(user.firstName.length).to.be.at.least(2);
          expect(user.firstName.length).to.be.at.most(50);
          expect(user.lastName.length).to.be.at.least(2);
          expect(user.lastName.length).to.be.at.most(50);
        });
      });
    });
  });

  describe('Product Data Generation', () => {
    it('should generate single product with all required fields', () => {
      cy.generateProduct().then((products) => {
        expect(products).to.have.length(1);
        
        const product = products[0];
        expect(product).to.have.property('id');
        expect(product).to.have.property('name');
        expect(product).to.have.property('description');
        expect(product).to.have.property('price');
        expect(product).to.have.property('category');
        expect(product).to.have.property('brand');
        expect(product).to.have.property('inStock');
        expect(product).to.have.property('images');
        expect(product).to.have.property('tags');
        
        // Validate price constraints
        expect(product.price).to.be.at.least(0.01);
        expect(product.price).to.be.at.most(10000);
        expect(Number.isInteger(product.price * 100)).to.be.true; // 2 decimal places
        
        // Validate rating constraints
        expect(product.rating).to.be.at.least(1);
        expect(product.rating).to.be.at.most(5);
        expect(Number.isInteger(product.rating * 10)).to.be.true; // 1 decimal place
      });
    });

    it('should generate multiple products with different categories', () => {
      cy.generateProduct({ count: 10 }).then((products) => {
        expect(products).to.have.length(10);
        
        // Check that we have products from different categories
        const categories = products.map(product => product.category);
        const uniqueCategories = new Set(categories);
        expect(uniqueCategories.size).to.be.greaterThan(1);
        
        // Validate each product
        products.forEach(product => {
          expect(product.category).to.be.oneOf([
            'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports',
            'Beauty', 'Toys', 'Automotive', 'Health', 'Food'
          ]);
          expect(product.availability).to.be.oneOf([
            'in-stock', 'out-of-stock', 'pre-order', 'discontinued'
          ]);
        });
      });
    });

    it('should generate products with realistic pricing', () => {
      cy.generateProduct({ count: 20 }).then((products) => {
        const prices = products.map(product => product.price);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        // Average price should be reasonable (not too high or too low)
        expect(avgPrice).to.be.at.least(10);
        expect(avgPrice).to.be.at.most(1000);
        
        // Should have a good distribution of prices
        const highPriceProducts = prices.filter(price => price > 500).length;
        const lowPriceProducts = prices.filter(price => price < 50).length;
        
        expect(highPriceProducts).to.be.greaterThan(0);
        expect(lowPriceProducts).to.be.greaterThan(0);
      });
    });
  });

  describe('Order Data Generation', () => {
    it('should generate single order with all required fields', () => {
      cy.generateOrder().then((orders) => {
        expect(orders).to.have.length(1);
        
        const order = orders[0];
        expect(order).to.have.property('id');
        expect(order).to.have.property('customerId');
        expect(order).to.have.property('items');
        expect(order).to.have.property('total');
        expect(order).to.have.property('status');
        expect(order).to.have.property('paymentMethod');
        expect(order).to.have.property('shippingAddress');
        expect(order).to.have.property('billingAddress');
        
        // Validate total constraints
        expect(order.total).to.be.at.least(0.01);
        expect(order.total).to.be.at.most(50000);
        expect(Number.isInteger(order.total * 100)).to.be.true; // 2 decimal places
        
        // Validate status enums
        expect(order.status).to.be.oneOf([
          'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
        ]);
        
        expect(order.paymentMethod).to.be.oneOf([
          'credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer', 'cash'
        ]);
      });
    });

    it('should generate orders with realistic item counts', () => {
      cy.generateOrder({ count: 15 }).then((orders) => {
        orders.forEach(order => {
          expect(order.items).to.be.an('array');
          expect(order.items.length).to.be.at.least(1);
          expect(order.items.length).to.be.at.most(10);
          
          // Each item should have required fields
          order.items.forEach((item: Record<string, unknown>) => {
            expect(item).to.have.property('productId');
            expect(item).to.have.property('quantity');
            expect(item).to.have.property('price');
          });
        });
      });
    });

    it('should generate orders with consistent totals', () => {
      cy.generateOrder({ count: 10 }).then((orders) => {
        orders.forEach(order => {
          // Calculate expected total from items
          const itemsTotal = order.items.reduce((sum: number, item: Record<string, unknown>) => 
            sum + (item.price * item.quantity), 0
          );
          const expectedTotal = itemsTotal + order.shippingCost + order.tax - order.discount;
          
          // Allow for small floating point differences
          expect(Math.abs(order.total - expectedTotal)).to.be.lessThan(0.01);
        });
      });
    });
  });

  describe('Data Export and Loading', () => {
    it('should generate and export data to file', () => {
      cy.generateAndExport('user', 'test-users-export.json', { count: 5 }).then((users) => {
        expect(users).to.have.length(5);
        
        // Verify the data was exported
        cy.readFile('cypress/fixtures/test-users-export.json').then((exportedData) => {
          expect(exportedData).to.have.length(5);
          expect(exportedData[0]).to.have.property('firstName');
        });
      });
    });

    it('should load previously generated data', () => {
      // First generate and export data
      cy.generateAndExport('product', 'test-products.json', { count: 3 });
      
      // Then load it
      cy.loadGeneratedData('test-products.json').then((products) => {
        expect(products).to.have.length(3);
        products.forEach(product => {
          expect(product).to.have.property('name');
          expect(product).to.have.property('price');
        });
      });
    });
  });

  describe('Custom Data Generation', () => {
    it('should generate data with custom options', () => {
      cy.generateData('user', { 
        count: 3, 
        unique: true, 
        variations: true,
        seed: 12345 
      }).then((users) => {
        expect(users).to.have.length(3);
        
        // With same seed, should get same results
        cy.generateData('user', { 
          count: 3, 
          unique: true, 
          variations: true,
          seed: 12345 
        }).then((users2) => {
          expect(users).to.deep.equal(users2);
        });
      });
    });

    it('should handle generation errors gracefully', () => {
      // Test with invalid template name
      cy.wrap(() => {
        cy.generateData('invalid-template');
      }).should('throw');
    });
  });

  describe('Performance Tests', () => {
    it('should generate large datasets efficiently', () => {
      cy.tag('performance', 'slow'); // Mark as performance test
      const startTime = Date.now();
      
      cy.generateUser({ count: 100 }).then((users) => {
        const endTime = Date.now();
        const generationTime = endTime - startTime;
        
        expect(users).to.have.length(100);
        expect(generationTime).to.be.lessThan(5000); // Should complete within 5 seconds
        
        // Verify all users are unique
        const emails = users.map(user => user.email);
        const uniqueEmails = new Set(emails);
        expect(uniqueEmails.size).to.eq(100);
      });
    });
  });
});
