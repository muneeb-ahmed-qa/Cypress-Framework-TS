# Security Guide

This document outlines security best practices for the Cypress testing framework.

## 🔐 Password Encryption

### Overview

The framework uses AES-256-GCM encryption to securely store passwords in environment variables. This ensures that sensitive credentials are never stored in plain text.

### Encryption Algorithm

- **Algorithm**: AES-256-GCM
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: 64 bytes random salt
- **IV**: 16 bytes random initialization vector
- **Authentication**: Built-in GCM authentication tag

### Usage

#### 1. Generate Encrypted Passwords

```bash
npm run encrypt-passwords
```

This will output encrypted versions of common test passwords:
- `admin123` → Encrypted string
- `user123` → Encrypted string  
- `test123` → Encrypted string

#### 2. Add to .env File

```bash
ENCRYPTED_ADMIN_PASSWORD=your_encrypted_password_here
ENCRYPTED_USER_PASSWORD=your_encrypted_password_here
ENCRYPTED_TEST_PASSWORD=your_encrypted_password_here
ENCRYPTION_KEY=your_secret_encryption_key_here
```

#### 3. Use in Tests

```typescript
import { getDecryptedPassword } from '@utils/password-encryption';

// Get decrypted password
const password = getDecryptedPassword('admin');

// Or use custom commands
cy.loginWithEncrypted('admin');
```

### Security Features

1. **No Plain Text Storage**: Passwords are never stored in plain text
2. **Environment Isolation**: Different encryption keys for different environments
3. **Key Rotation**: Easy to rotate encryption keys
4. **Error Handling**: Graceful handling of decryption failures

## 🛡️ Security Best Practices

### 1. Environment Variables

- ✅ Store sensitive data in `.env` files
- ✅ Never commit `.env` files to version control
- ✅ Use different keys for different environments
- ❌ Don't hardcode passwords in test files
- ❌ Don't log sensitive information

### 2. Encryption Key Management

```bash
# Development
ENCRYPTION_KEY=dev_secret_key_2024

# Staging  
ENCRYPTION_KEY=staging_secret_key_2024

# Production
ENCRYPTION_KEY=prod_secret_key_2024
```

### 3. File Security

Ensure these files are in `.gitignore`:
```
.env
.env.local
.env.production
.env.staging
*.key
secrets/
```

### 4. CI/CD Security

For GitHub Actions, use encrypted secrets:

```yaml
env:
  ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
  ENCRYPTED_ADMIN_PASSWORD: ${{ secrets.ENCRYPTED_ADMIN_PASSWORD }}
```

### 5. Test Data Security

- Use encrypted passwords for all test users
- Rotate test passwords regularly
- Use different passwords for different environments
- Never use production passwords in tests

## 🔄 Key Rotation

### Rotating Encryption Keys

1. **Generate new key**:
   ```bash
   # Generate new encryption key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Re-encrypt passwords**:
   ```bash
   # Update ENCRYPTION_KEY in .env
   # Run encryption script with new key
   npm run encrypt-passwords
   ```

3. **Update all environments**:
   - Development
   - Staging
   - Production
   - CI/CD secrets

### Emergency Key Rotation

If a key is compromised:

1. Immediately rotate the key
2. Re-encrypt all passwords
3. Update all environments
4. Revoke old key access

## 🚨 Security Incidents

### If Passwords Are Compromised

1. **Immediate Actions**:
   - Rotate encryption key
   - Re-encrypt all passwords
   - Update all environments

2. **Investigation**:
   - Check git history for plain text passwords
   - Review access logs
   - Audit environment variables

3. **Prevention**:
   - Implement key rotation schedule
   - Add security scanning to CI/CD
   - Regular security audits

## 🔍 Security Scanning

### Pre-commit Hooks

Add security scanning to prevent accidental commits:

```bash
# Install git-secrets
npm install --save-dev git-secrets

# Add to package.json scripts
"pre-commit": "git-secrets --scan"
```

### CI/CD Security Checks

```yaml
- name: Security Scan
  run: |
    # Check for hardcoded secrets
    grep -r "password.*=" cypress/ || true
    # Check for .env files
    find . -name ".env" -not -path "./.env.example" || true
```

## 📋 Security Checklist

- [ ] All passwords encrypted in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] Different encryption keys per environment
- [ ] No hardcoded passwords in test files
- [ ] CI/CD uses encrypted secrets
- [ ] Regular key rotation schedule
- [ ] Security scanning in CI/CD
- [ ] Team trained on security practices

## 🆘 Emergency Contacts

- Security Team: security@company.com
- DevOps Team: devops@company.com
- On-call Engineer: +1-XXX-XXX-XXXX

## 📚 Additional Resources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Cypress Security Best Practices](https://docs.cypress.io/guides/references/best-practices#Security)
- [Environment Variables Security](https://12factor.net/config)

---

**Remember**: Security is everyone's responsibility. When in doubt, ask the security team.
