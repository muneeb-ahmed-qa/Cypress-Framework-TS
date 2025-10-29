/**
 * Authentication Tests with Encrypted Passwords
 * Demonstrates secure password handling in tests
 */

// import { getDecryptedPassword } from '@utils/password-encryption';

describe('Authentication with Encrypted Passwords', () => {
  beforeEach(() => {
    cy.clearSession();
  });

  it('should login with admin encrypted credentials', () => {
    cy.loginWithEncrypted('admin');
    
    // Verify authentication state
    cy.window().then((win) => {
      const token = (win as any).localStorage.getItem('authToken');
      const userType = (win as any).localStorage.getItem('userType');
      
      expect(token).to.exist;
      expect(userType).to.eq('admin');
    });
  });

  it('should login with user encrypted credentials', () => {
    cy.loginWithEncrypted('user');
    
    cy.window().then((win) => {
      const token = (win as any).localStorage.getItem('authToken');
      const userType = (win as any).localStorage.getItem('userType');
      
      expect(token).to.exist;
      expect(userType).to.eq('user');
    });
  });

  it('should setup authenticated session for admin', () => {
    cy.setupAuthenticatedSession('admin');
    
    // Verify we're on dashboard and authenticated
    cy.url().should('include', '/dashboard');
    cy.window().then((win) => {
      expect((win as any).localStorage.getItem('authToken')).to.exist;
    });
  });

  it('should get decrypted password for different user types', () => {
    // Test admin password
    cy.getDecryptedPassword('admin').then((adminPassword) => {
      expect(adminPassword).to.be.a('string');
      expect(adminPassword.length).to.be.greaterThan(0);
    });

    // Test user password
    cy.getDecryptedPassword('user').then((userPassword) => {
      expect(userPassword).to.be.a('string');
      expect(userPassword.length).to.be.greaterThan(0);
    });

    // Test test password
    cy.getDecryptedPassword('test').then((testPassword) => {
      expect(testPassword).to.be.a('string');
      expect(testPassword.length).to.be.greaterThan(0);
    });
  });

  it('should handle login failures gracefully', () => {
    // Mock a failed login scenario
    cy.intercept('POST', '/login', { statusCode: 401, body: { error: 'Invalid credentials' } }).as('failedLogin');
    
    try {
      cy.loginWithEncrypted('admin');
    } catch (error) {
      console.error('Login failed:', error as Error);
    }
  });

  it('should verify session persistence', () => {
    cy.loginWithEncrypted('admin');
    
    // Verify session is maintained
    cy.window().then((win) => {
      const token = (win as any).localStorage.getItem('authToken');
      const userType = (win as any).localStorage.getItem('userType');
      
      expect(token).to.exist;
      expect(userType).to.eq('admin');
    });
  });

  it('should handle session cleanup', () => {
    cy.loginWithEncrypted('admin');
    
    // Clear session
    cy.clearSession();
    
    // Verify session is cleared
    cy.window().then((win) => {
      const token = (win as any).localStorage.getItem('authToken');
      const userType = (win as any).localStorage.getItem('userType');
      
      expect(token).to.be.null;
      expect(userType).to.be.null;
    });
  });

  it('should verify different user types have different passwords', () => {
    let adminPassword: string;
    let userPassword: string;
    
    cy.getDecryptedPassword('admin').then((admin) => {
      adminPassword = admin;
      
      cy.getDecryptedPassword('user').then((user) => {
        userPassword = user;
        
        expect(adminPassword).to.not.eq(userPassword);
      });
    });
  });
});