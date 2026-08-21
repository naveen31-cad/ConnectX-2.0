// src/utils/verification.js

/**
 * Validates a national ID or standard identification number.
 * Modify the regex or logic based on your specific requirements.
 */
export function validateNationalID(id) {
  if (!id) return false;
  // Example validation: checks if the ID is alphanumeric and at least 6 characters long
  const cleanId = id.trim();
  const idRegex = /^[A-Za-z0-9]{6,20}$/;
  return idRegex.test(cleanId);
}