import crypto from 'crypto';
import { logger } from './logger';

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  saltLength: number;
  iterations: number;
}

class EncryptionService {
  private static instance: EncryptionService;
  private config: EncryptionConfig;
  private masterKey: Buffer;

  private constructor() {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      saltLength: 32,
      iterations: 100000
    };

    // Get master key from environment or generate one
    const masterKeyString = process.env.ENCRYPTION_MASTER_KEY || this.generateMasterKey();
    this.masterKey = Buffer.from(masterKeyString, 'hex');
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Generate a master key for encryption
   */
  private generateMasterKey(): string {
    const key = crypto.randomBytes(this.config.keyLength);
    // // // console.warn('⚠️  Generated new master key. Set ENCRYPTION_MASTER_KEY environment variable for production.');
    return key.toString('hex');
  }

  /**
   * Derive a key from the master key using a salt
   */
  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      this.config.iterations,
      this.config.keyLength,
      'sha256'
    );
  }

  /**
   * Encrypt sensitive data
   */
  public encrypt(data: string): string {
    try {
      // Generate salt and IV
      const salt = crypto.randomBytes(this.config.saltLength);
      const iv = crypto.randomBytes(this.config.ivLength);

      // Derive key from master key and salt
      const key = this.deriveKey(salt);

      // Create cipher
      const cipher = crypto.createCipher(this.config.algorithm, key);
      cipher.setAAD(salt);

      // Encrypt data
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get auth tag
      const authTag = cipher.getAuthTag();

      // Combine salt + iv + authTag + encrypted data
      const result = Buffer.concat([salt, iv, authTag, Buffer.from(encrypted, 'hex')]);
      
      return result.toString('base64');
    } catch (error) {
      logger.error('Encryption failed:');
      throw new Error(`Failed to encrypt data - Context: throw new Error('Failed to encrypt data');...`);
    }
  }

  /**
   * Decrypt sensitive data
   */
  public decrypt(encryptedData: string): string {
    try {
      // Convert from base64
      const data = Buffer.from(encryptedData, 'base64');

      // Extract components
      const salt = data.subarray(0, this.config.saltLength);
      const iv = data.subarray(this.config.saltLength, this.config.saltLength + this.config.ivLength);
      const authTag = data.subarray(this.config.saltLength + this.config.ivLength, this.config.saltLength + this.config.ivLength + 16);
      const encrypted = data.subarray(this.config.saltLength + this.config.ivLength + 16);

      // Derive key from master key and salt
      const key = this.deriveKey(salt);

      // Create decipher
      const decipher = crypto.createDecipher(this.config.algorithm, key);
      decipher.setAAD(salt);
      decipher.setAuthTag(authTag);

      // Decrypt data
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption failed:');
      throw new Error(`Failed to decrypt data - Context: } catch (error) {
    console.error('Error occurred:', error);...`);
    }
  }

  /**
   * Hash sensitive data (one-way encryption)
   */
  public hash(data: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(data, generatedSalt, 100000, 64, 'sha512').toString('hex');
    
    return { hash, salt: generatedSalt };
  }

  /**
   * Verify hashed data
   */
  public verifyHash(data: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hash(data, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  }

  /**
   * Generate a secure random token
   */
  public generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a secure random password
   */
  public generatePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(crypto.randomInt(charset.length));
    }
    
    return password;
  }

  /**
   * Encrypt sensitive fields in an object
   */
  public encryptObject(obj: unknown, fieldsToEncrypt: string[]): unknown {
    const encrypted = { ...obj };
    
    for (const field of fieldsToEncrypt) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field]);
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypt sensitive fields in an object
   */
  public decryptObject(obj: unknown, fieldsToDecrypt: string[]): unknown {
    const decrypted = { ...obj };
    
    for (const field of fieldsToDecrypt) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          decrypted[field] = this.decrypt(decrypted[field]);
        } catch (error) {
          logger.error('Failed to decrypt field ${field}:');
          // Keep original value if decryption fails
        }
      }
    }
    
    return decrypted;
  }

  /**
   * Encrypt database fields for storage
   */
  public encryptForStorage(data: string, context: string = 'default'): string {
    // Add context to prevent reuse attacks
    const contextualData = `${context}:${data}`;
    return this.encrypt(contextualData);
  }

  /**
   * Decrypt database fields after retrieval
   */
  public decryptFromStorage(encryptedData: string, context: string = 'default'): string {
    const decrypted = this.decrypt(encryptedData);
    
    // Verify context
    if (!decrypted.startsWith(`${context}:`)) {
      throw new Error(`Invalid encryption context - Context: const decrypted = this.decrypt(encryptedData);...`);
    }
    
    return decrypted.substring(context.length + 1);
  }

  /**
   * Generate a secure API key
   */
  public generateApiKey(prefix: string = 'key'): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Encrypt sensitive configuration
   */
  public encryptConfig(config: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'secret', 'key', 'token', 'apiKey'];
    const encrypted = { ...config };
    
    for (const [key, value] of Object.entries(encrypted)) {
      if (typeof value === 'string' && sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        encrypted[key] = this.encrypt(value);
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypt sensitive configuration
   */
  public decryptConfig(config: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'secret', 'key', 'token', 'apiKey'];
    const decrypted = { ...config };
    
    for (const [key, value] of Object.entries(decrypted)) {
      if (typeof value === 'string' && sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        try {
          decrypted[key] = this.decrypt(value);
        } catch (error) {
          logger.error('Failed to decrypt config field ${key}:');
        }
      }
    }
    
    return decrypted;
  }
}

export const encryptionService = EncryptionService.getInstance();

// Convenience functions for common encryption tasks
export const encryption = {
  // Encrypt sensitive user data
  encryptUserData: (data: string) => encryptionService.encryptForStorage(data, 'user'),
  decryptUserData: (data: string) => encryptionService.decryptFromStorage(data, 'user'),
  
  // Encrypt payment data
  encryptPaymentData: (data: string) => encryptionService.encryptForStorage(data, 'payment'),
  decryptPaymentData: (data: string) => encryptionService.decryptFromStorage(data, 'payment'),
  
  // Encrypt API keys
  encryptApiKey: (data: string) => encryptionService.encryptForStorage(data, 'api'),
  decryptApiKey: (data: string) => encryptionService.decryptFromStorage(data, 'api'),
  
  // Hash passwords
  hashPassword: (password: string) => encryptionService.hash(password),
  verifyPassword: (password: string, hash: string, salt: string) => encryptionService.verifyHash(password, hash, salt),
  
  // Generate tokens
  generateToken: (length?: number) => encryptionService.generateToken(length),
  generatePassword: (length?: number) => encryptionService.generatePassword(length),
  generateApiKey: (prefix?: string) => encryptionService.generateApiKey(prefix)
};

// Field encryption decorators for Prisma models
export const encryptedFields = {
  // Fields that should be encrypted in user model
  user: ['ssn', 'passportNumber', 'driversLicense'],
  
  // Fields that should be encrypted in payment model
  payment: ['cardNumber', 'cvv', 'accountNumber', 'routingNumber'],
  
  // Fields that should be encrypted in institution model
  institution: ['taxId', 'bankAccountNumber', 'apiKey'],
  
  // Fields that should be encrypted in system settings
  settings: ['smtpPassword', 'apiSecret', 'encryptionKey']
};

// Helper function to encrypt model fields before saving
export function encryptModelFields(model: unknown, modelType: keyof typeof encryptedFields): unknown {
  const fields = encryptedFields[modelType];
  if (!fields) return model;
  
  return encryptionService.encryptObject(model, fields);
}

// Helper function to decrypt model fields after retrieval
export function decryptModelFields(model: unknown, modelType: keyof typeof encryptedFields): unknown {
  const fields = encryptedFields[modelType];
  if (!fields) return model;
  
  return encryptionService.decryptObject(model, fields);
} 