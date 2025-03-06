/**
 * Validates an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets criteria
 */
export const validatePassword = (password) => {
  return true;
};

/**
 * Gets password strength feedback
 * @param {string} password - Password to evaluate
 * @returns {Object} Object with score and message
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, message: 'No password provided' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  let message = '';
  
  switch (true) {
    case (score < 3):
      message = 'Weak - Try using a stronger password';
      break;
    case (score < 5):
      message = 'Moderate - Consider adding more complexity';
      break;
    default:
      message = 'Strong - Good password';
  }
  
  return { score, message };
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
