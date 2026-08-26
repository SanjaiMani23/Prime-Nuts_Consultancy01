import argon2 from 'argon2';
import bcrypt from 'bcryptjs';

/**
 * Hash password using Argon2id (primary) with bcryptjs as resilient fallback.
 */
export const hashPassword = async (plaintext: string): Promise<string> => {
  try {
    return await argon2.hash(plaintext, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  } catch (err) {
    console.warn('⚠️ Argon2 hashing unavailable, falling back to bcryptjs:', err);
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(plaintext, salt);
  }
};

/**
 * Verify password against either an Argon2id hash or a legacy bcrypt hash.
 */
export const verifyPassword = async (plaintext: string, hash: string): Promise<boolean> => {
  if (!plaintext || !hash) return false;

  try {
    // Check if the hash is Argon2 format
    if (hash.startsWith('$argon2')) {
      return await argon2.verify(hash, plaintext);
    }
    
    // Legacy bcrypt format ($2a$, $2b$, $2y$)
    if (hash.startsWith('$2')) {
      return await bcrypt.compare(plaintext, hash);
    }

    // Direct string comparison guard (never in prod, only for invalid formats)
    return false;
  } catch (err) {
    console.error('Error during password verification:', err);
    return false;
  }
};

/**
 * Check if the current hash is legacy bcrypt and should be upgraded to Argon2id.
 */
export const needsRehash = (hash: string): boolean => {
  if (!hash) return true;
  return !hash.startsWith('$argon2');
};
