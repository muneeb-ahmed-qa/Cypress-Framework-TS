/**
 * Users API Tests
 * Demonstrates API testing, request/response validation, and error handling
 */

import { ApiHelper } from '@utils/api-helper';
import { TestDataBuilder } from '@utils/test-data-builder';

describe('Users API Tests', () => {
  const apiUrl = Cypress.env('apiUrl') || 'https://jsonplaceholder.typicode.com';

  beforeEach(() => {
    // Apply tag filtering
    cy.filterByTags(Cypress.env('TAGS')?.split(',') || []);
    // Intercept API calls if needed
    cy.intercept('GET', '**/users/**').as('getUser');
    cy.intercept('POST', '**/users/**').as('createUser');
    cy.intercept('PUT', '**/users/**').as('updateUser');
    cy.intercept('DELETE', '**/users/**').as('deleteUser');
  });

  describe('GET /users', () => {
    it('should fetch all users successfully', () => {
      cy.api(); // Mark as API test
      cy.apiRequest('GET', '/users').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Validate response structure
        const firstUser = response.body[0];
        ApiHelper.validateResponse(response, ['id', 'name', 'email', 'username']);
        
        expect(firstUser).to.have.property('id');
        expect(firstUser).to.have.property('name');
        expect(firstUser).to.have.property('email');
      });
    });

    it('should fetch single user by ID', () => {
      cy.smoke(); // Mark as smoke test
      const userId = 1;
      cy.apiRequest('GET', `/users/${userId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(userId);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('address');
      });
    });

    it('should handle invalid user ID', () => {
      cy.apiRequest('GET', '/users/999999').then((response) => {
        // API might return 404 or empty object, adjust based on actual API behavior
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });

    it('should have valid response time', () => {
      cy.tag('performance', 'slow'); // Mark as performance test
      const startTime = Date.now();
      cy.apiRequest('GET', '/users').then(() => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(3000); // 3 seconds max
      });
    });
  });

  describe('POST /users', () => {
    it('should create new user successfully', () => {
      const userData = TestDataBuilder.user()
        .with('name', 'John Doe')
        .with('email', 'john.doe@example.com')
        .build();

      cy.apiRequest('POST', '/users', userData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq(userData.name);
        expect(response.body.email).to.eq(userData.email);
      });
    });

    it('should create user with minimal required fields', () => {
      const userData = TestDataBuilder.user().build();

      cy.apiRequest('POST', '/users', userData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.id).to.exist;
      });
    });

    it('should handle duplicate email scenario', () => {
      const userData = TestDataBuilder.user()
        .with('email', 'duplicate@example.com')
        .build();

      // First creation
      cy.apiRequest('POST', '/users', userData);

      // Attempt duplicate (adjust expectations based on API behavior)
      cy.apiRequest('POST', '/users', userData).then((response) => {
        // API behavior may vary - adjust assertion accordingly
        expect([201, 400, 409]).to.include(response.status);
      });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update existing user', () => {
      const userId = 1;
      const updatedData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      cy.apiRequest('PUT', `/users/${userId}`, updatedData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedData.name);
        expect(response.body.email).to.eq(updatedData.email);
      });
    });

    it('should handle partial update with PATCH', () => {
      const userId = 1;
      const partialData = {
        name: 'Partially Updated Name',
      };

      cy.apiRequest('PATCH', `/users/${userId}`, partialData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(partialData.name);
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user successfully', () => {
      const userId = 1;

      cy.apiRequest('DELETE', `/users/${userId}`).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should handle deletion of non-existent user', () => {
      cy.apiRequest('DELETE', '/users/999999').then((response) => {
        // API behavior may vary
        expect([200, 404]).to.include(response.status);
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle 404 error gracefully', () => {
      cy.apiRequest('GET', '/users/nonexistent').then((response) => {
        if (response.status === 404) {
          expect(response.body).to.exist;
        }
      });
    });

    it('should handle network timeout', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users`,
        timeout: 100,
        failOnStatusCode: false,
      }).then((response) => {
        // Handle timeout scenario
        if (response.status === 0) {
          cy.log('Request timed out as expected');
        }
      });
    });
  });

  describe('API Response Validation', () => {
    it('should validate user data structure', () => {
      cy.apiRequest('GET', '/users/1').then((response) => {
        const user = response.body;
        
        // Type validation
        expect(user.id).to.be.a('number');
        expect(user.name).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.username).to.be.a('string');
        
        // Email format validation
        expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        
        // Value validation
        expect(user.id).to.be.greaterThan(0);
        expect(user.name.length).to.be.greaterThan(0);
      });
    });

    it('should extract nested data correctly', () => {
      cy.apiRequest('GET', '/users/1').then((response) => {
        const address = ApiHelper.extractData<Record<string, unknown>>(response, 'address');
        expect(address).to.have.property('street');
        expect(address).to.have.property('city');
        expect(address).to.have.property('zipcode');
      });
    });
  });
});

