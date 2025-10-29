/**
 * Password encryption and decryption utilities
 * Uses AES encryption with a secret key
 */

import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Get encryption key from environment
 */
const getEncryptionKey = (): string => {
  const key = Cypress.env('ENCRYPTION_KEY') || process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY not found in environment variables');
  }
  return key;
};

/**
 * Derive key from password using PBKDF2
 */
const deriveKey = (password: string, salt: Buffer): Buffer => {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
};

/**
 * Encrypt a password
 * @param password - Plain text password to encrypt
 * @returns Encrypted password with salt and IV
 */
export const encryptPassword = (password: string): string => {
  const masterKey = getEncryptionKey();
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

/**
 * Decrypt a password
 * @param encryptedPassword - Encrypted password string
 * @returns Decrypted plain text password
 */
export const decryptPassword = (encryptedPassword: string): string => {
  const masterKey = getEncryptionKey();
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

/**
 * Get decrypted password from environment variable
 * @param envVarName - Environment variable name containing encrypted password
 * @returns Decrypted password
 */
export const getDecryptedPassword = (envVarName: string): string => {
  const encryptedPassword = Cypress.env(envVarName) || process.env[envVarName];
  
  if (!encryptedPassword) {
    throw new Error(`Environment variable ${envVarName} not found`);
  }
  
  try {
    return decryptPassword(encryptedPassword);
  } catch (error) {
    throw new Error(`Failed to decrypt password from ${envVarName}: ${error}`);
  }
};

/**
 * Validate password encryption/decryption
 * @param password - Password to test
 * @returns True if encryption/decryption works correctly
 */
export const validatePasswordEncryption = (password: string): boolean => {
  try {
    const encrypted = encryptPassword(password);
    const decrypted = decryptPassword(encrypted);
    return decrypted === password;
  } catch (error) {
    console.error('Password encryption validation failed:', error);
    return false;
  }
};

/**
 * Generate encrypted passwords for common test users
 * This is a utility function to help generate encrypted passwords
 */
export const generateEncryptedPasswords = (): Record<string, string> => {
  const passwords = {
    admin: 'admin123',
    user: 'user123',
    test: 'test123',
  };
  
  const encrypted: Record<string, string> = {};
  
  Object.entries(passwords).forEach(([user, password]) => {
    encrypted[`ENCRYPTED_${user.toUpperCase()}_PASSWORD`] = encryptPassword(password);
  });
  
  return encrypted;
};
