/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements
 */
export const validatePassword = (password) => {
  // At least 8 characters with at least one letter, one number, and one special character
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates name format (no special characters or numbers)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if name is valid
 */
export const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  return nameRegex.test(name);
};
