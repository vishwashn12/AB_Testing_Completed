/**
 * US-21: User ID Anonymization Utility
 * Hashes user IDs before storing in event logs for privacy
 */

const crypto = require('crypto');

/**
 * Hash user ID using SHA-256 with salt
 * @param {string} userId - Original user ID
 * @returns {string} Hashed user ID
 */
const hashUserId = (userId) => {
  const salt = process.env.HASH_SALT || 'default-salt-change-in-production';
  const algorithm = process.env.HASH_ALGORITHM || 'sha256';

  const hash = crypto
    .createHmac(algorithm, salt)
    .update(userId.toString())
    .digest('hex');

  return hash;
};

/**
 * US-08: Deterministic variant assignment using hash
 * @param {string} userId - User ID to hash
 * @param {string} experimentId - Experiment ID for consistency
 * @param {number} maxValue - Maximum value for modulo (typically 100 for percentages)
 * @returns {number} Hash value between 0 and maxValue-1
 */
const deterministicHash = (userId, experimentId, maxValue = 100) => {
  const combined = `${userId}-${experimentId}`;
  const hash = crypto.createHash('md5').update(combined).digest('hex');
  
  // Convert first 8 hex characters to integer
  const hashInt = parseInt(hash.substring(0, 8), 16);
  
  // Return value between 0 and maxValue-1
  return hashInt % maxValue;
};

/**
 * Assign user to variant based on traffic allocation
 * @param {string} userId - User ID
 * @param {string} experimentId - Experiment ID
 * @param {Array} variants - Array of variants with allocation percentages
 * @returns {Object} Assigned variant
 */
const assignVariant = (userId, experimentId, variants) => {
  if (!variants || variants.length === 0) {
    throw new Error('No variants available for assignment');
  }

  // Validate total allocation = 100%
  const totalAllocation = variants.reduce((sum, v) => sum + v.allocation, 0);
  if (totalAllocation !== 100) {
    throw new Error(`Total allocation must be 100%, got ${totalAllocation}%`);
  }

  // Get deterministic hash value (0-99)
  const hashValue = deterministicHash(userId, experimentId, 100);

  // Assign to variant based on allocation ranges
  let cumulativeAllocation = 0;
  for (const variant of variants) {
    cumulativeAllocation += variant.allocation;
    if (hashValue < cumulativeAllocation) {
      return variant;
    }
  }

  // Fallback to last variant (should never reach here if allocation = 100%)
  return variants[variants.length - 1];
};

module.exports = {
  hashUserId,
  deterministicHash,
  assignVariant,
};
