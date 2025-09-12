/**
 * Data validation and error handling utilities
 */

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  if (email.length > 255) {
    return {
      isValid: false,
      error: "Email address is too long",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Password validation
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export function validatePassword(password) {
  if (!password) {
    return {
      isValid: false,
      error: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password is too long",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Username validation
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export function validateUsername(username) {
  if (!username) {
    return {
      isValid: false,
      error: "Username is required",
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters long",
    };
  }

  if (username.length > 30) {
    return {
      isValid: false,
      error: "Username must be less than 30 characters",
    };
  }

  // Check for valid characters (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error:
        "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }

  // Check if starts with letter or number
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return {
      isValid: false,
      error: "Username must start with a letter or number",
    };
  }

  // Check if ends with letter or number
  if (!/[a-zA-Z0-9]$/.test(username)) {
    return {
      isValid: false,
      error: "Username must end with a letter or number",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Project title validation
 * @param {string} title - Project title to validate
 * @returns {Object} Validation result
 */
export function validateProjectTitle(title) {
  if (!title) {
    return {
      isValid: false,
      error: "Project title is required",
    };
  }

  if (title.length < 5) {
    return {
      isValid: false,
      error: "Project title must be at least 5 characters long",
    };
  }

  if (title.length > 80) {
    return {
      isValid: false,
      error: "Project title must be less than 80 characters",
    };
  }

  // Check for excessive whitespace
  if (title.trim().length !== title.length) {
    return {
      isValid: false,
      error: "Project title cannot start or end with spaces",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Funding goal validation
 * @param {number} amount - Funding amount in cents
 * @param {string} currency - Currency code
 * @returns {Object} Validation result
 */
export function validateFundingGoal(amount, currency = "USD") {
  if (!amount) {
    return {
      isValid: false,
      error: "Funding goal is required",
    };
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    return {
      isValid: false,
      error: "Funding goal must be a valid number",
    };
  }

  if (amount < 100) {
    // $1.00 minimum
    return {
      isValid: false,
      error: "Minimum funding goal is $1.00",
    };
  }

  if (amount > 100000000) {
    // $1,000,000 maximum
    return {
      isValid: false,
      error: "Maximum funding goal is $1,000,000",
    };
  }

  if (amount % 100 !== 0) {
    // Must be whole dollars
    return {
      isValid: false,
      error: "Funding goal must be in whole dollars",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Description validation
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {Object} Validation result
 */
export function validateDescription(text, minLength = 10, maxLength = 5000) {
  if (!text) {
    return {
      isValid: false,
      error: "Description is required",
    };
  }

  if (text.length < minLength) {
    return {
      isValid: false,
      error: `Description must be at least ${minLength} characters long`,
    };
  }

  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `Description must be less than ${maxLength} characters`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Project dates validation
 * @param {Date} startDate - Project start date
 * @param {Date} endDate - Project end date
 * @returns {Object} Validation result
 */
export function validateProjectDates(startDate, endDate) {
  const now = new Date();
  const minDuration = 1; // 1 day minimum
  const maxDuration = 365; // 1 year maximum

  if (!startDate || !endDate) {
    return {
      isValid: false,
      error: "Start date and end date are required",
    };
  }

  if (startDate < now) {
    return {
      isValid: false,
      error: "Start date cannot be in the past",
    };
  }

  if (endDate <= startDate) {
    return {
      isValid: false,
      error: "End date must be after start date",
    };
  }

  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  if (duration < minDuration) {
    return {
      isValid: false,
      error: `Project duration must be at least ${minDuration} day(s)`,
    };
  }

  if (duration > maxDuration) {
    return {
      isValid: false,
      error: `Project duration cannot exceed ${maxDuration} days`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Milestone percentages validation
 * @param {Array} milestones - Array of milestone objects with fundingPercentage
 * @returns {Object} Validation result
 */
export function validateMilestonePercentages(milestones) {
  if (!milestones || milestones.length === 0) {
    return {
      isValid: false,
      error: "At least one milestone is required",
    };
  }

  const totalPercentage = milestones.reduce((sum, milestone) => {
    return sum + (milestone.fundingPercentage || 0);
  }, 0);

  if (totalPercentage !== 100) {
    return {
      isValid: false,
      error: "Milestone percentages must sum to 100%",
    };
  }

  // Check for negative percentages
  const hasNegative = milestones.some(
    (milestone) => milestone.fundingPercentage < 0,
  );

  if (hasNegative) {
    return {
      isValid: false,
      error: "Milestone percentages cannot be negative",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Reward tier pricing validation
 * @param {Array} tiers - Array of reward tier objects
 * @returns {Object} Validation result
 */
export function validateRewardTierPricing(tiers) {
  if (!tiers || tiers.length === 0) {
    return {
      isValid: true, // No tiers is valid
      error: null,
    };
  }

  // Check for duplicate amounts
  const amounts = tiers.map((tier) => tier.pledgeAmount).filter(Boolean);
  const uniqueAmounts = new Set(amounts);

  if (amounts.length !== uniqueAmounts.size) {
    return {
      isValid: false,
      error: "Reward tiers cannot have duplicate pledge amounts",
    };
  }

  // Check for proper ordering (optional)
  const sortedAmounts = [...amounts].sort((a, b) => a - b);
  const isOrdered = amounts.every(
    (amount, index) => amount === sortedAmounts[index],
  );

  if (!isOrdered) {
    return {
      isValid: false,
      error:
        "Reward tiers should be ordered by pledge amount (lowest to highest)",
    };
  }

  // Check for valid amounts
  const hasInvalidAmount = amounts.some(
    (amount) => amount < 100 || amount > 10000000 || amount % 100 !== 0,
  );

  if (hasInvalidAmount) {
    return {
      isValid: false,
      error:
        "Reward tier amounts must be between $1.00 and $100,000 in whole dollars",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Backing amount validation
 * @param {number} amount - Backing amount in cents
 * @param {Object} tier - Optional reward tier object
 * @returns {Object} Validation result
 */
export function validateBackingAmount(amount, tier = null) {
  if (!amount) {
    return {
      isValid: false,
      error: "Backing amount is required",
    };
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    return {
      isValid: false,
      error: "Backing amount must be a valid number",
    };
  }

  if (amount < 100) {
    // $1.00 minimum
    return {
      isValid: false,
      error: "Minimum backing amount is $1.00",
    };
  }

  if (amount > 10000000) {
    // $100,000 maximum
    return {
      isValid: false,
      error: "Maximum backing amount is $100,000",
    };
  }

  if (amount % 100 !== 0) {
    // Must be whole dollars
    return {
      isValid: false,
      error: "Backing amount must be in whole dollars",
    };
  }

  // If tier is specified, validate against tier amount
  if (tier && amount < tier.pledgeAmount) {
    return {
      isValid: false,
      error: `Minimum amount for this tier is $${(tier.pledgeAmount / 100).toFixed(2)}`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export function validateUrl(url) {
  if (!url) {
    return {
      isValid: true, // URL is optional
      error: null,
    };
  }

  try {
    new URL(url);
    return {
      isValid: true,
      error: null,
    };
  } catch {
    return {
      isValid: false,
      error: "Please enter a valid URL",
    };
  }
}

/**
 * Phone number validation
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export function validatePhone(phone) {
  if (!phone) {
    return {
      isValid: true, // Phone is optional
      error: null,
    };
  }

  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
    return {
      isValid: false,
      error: "Please enter a valid phone number",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Form validation helper
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export function validateForm(data, rules) {
  const errors = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    const result = rule(value, data);

    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
  };
}

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeString(input) {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

/**
 * Format currency amount
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount, currency = "USD") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount / 100);
}

/**
 * Parse currency string to cents
 * @param {string} currencyString - Currency string (e.g., "$100.00")
 * @returns {number} Amount in cents
 */
export function parseCurrency(currencyString) {
  const numericValue = parseFloat(currencyString.replace(/[^0-9.-]/g, ""));
  return Math.round(numericValue * 100);
}
