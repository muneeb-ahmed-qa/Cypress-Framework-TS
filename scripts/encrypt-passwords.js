#!/usr/bin/env node

/**
 * Password Encryption Utility
 * Use this script to encrypt passwords for the .env file
 * 
 * Usage: node scripts/encrypt-passwords.js
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

// Default encryption key (change this in production!)
const DEFAULT_KEY = 'cypress_framework_secret_key_2024';

const deriveKey = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
};

const encryptPassword = (password, masterKey = DEFAULT_KEY) => {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const derivedKey = deriveKey(masterKey, salt);
  
  const cipher = crypto.createCipherGCM(ALGORITHM, derivedKey, iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  // Combine salt + iv + tag + encrypted
  const combined = Buffer.concat([
    salt,
    iv,
    tag,
    Buffer.from(encrypted, 'hex')
  ]);
  
  return combined.toString('base64');
};

const decryptPassword = (encryptedPassword, masterKey = DEFAULT_KEY) => {
  const combined = Buffer.from(encryptedPassword, 'base64');
  
  // Extract components
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = combined.subarray(TAG_POSITION, TAG_POSITION + TAG_LENGTH);
  const encrypted = combined.subarray(ENCRYPTED_POSITION);
  
  const derivedKey = deriveKey(masterKey, salt);
  
  const decipher = crypto.createDecipherGCM(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Test passwords to encrypt
const passwords = {
  admin: 'admin123',
  user: 'user123',
  test: 'test123',
};

console.log('🔐 Password Encryption Utility');
console.log('==============================\n');

console.log('Encrypting passwords...\n');

Object.entries(passwords).forEach(([user, password]) => {
  const encrypted = encryptPassword(password);
  console.log(`${user.toUpperCase()}_PASSWORD:`);
  console.log(`  Plain: ${password}`);
  console.log(`  Encrypted: ${encrypted}`);
  console.log(`  Decrypted: ${decryptPassword(encrypted)}`);
  console.log('');
});

console.log('📝 Add these to your .env file:');
console.log('===============================');
Object.entries(passwords).forEach(([user, password]) => {
  const encrypted = encryptPassword(password);
  console.log(`ENCRYPTED_${user.toUpperCase()}_PASSWORD=${encrypted}`);
});

console.log('\n🔑 Encryption Key (add to .env):');
console.log('ENCRYPTION_KEY=cypress_framework_secret_key_2024');

console.log('\n⚠️  Security Notes:');
console.log('- Change the ENCRYPTION_KEY in production');
console.log('- Never commit the .env file to version control');
console.log('- Use different encryption keys for different environments');
