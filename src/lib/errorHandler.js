/**
 * Error handling utilities for API responses and client-side errors
 */

/**
 * Standard error response format
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error response
 */
export function createErrorResponse(
  message,
  code = "UNKNOWN_ERROR",
  details = {},
) {
  return {
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Error code classification system
 */
export const ERROR_CODES = {
  // Authentication errors
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID: "AUTH_INVALID",
  AUTH_EXPIRED: "AUTH_EXPIRED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // Resource errors
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",

  // Permission errors
  PERMISSION_DENIED: "PERMISSION_DENIED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  CONNECTION_ERROR: "CONNECTION_ERROR",

  // Server errors
  SERVER_ERROR: "SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  STORAGE_ERROR: "STORAGE_ERROR",

  // Business logic errors
  BUSINESS_RULE_VIOLATION: "BUSINESS_RULE_VIOLATION",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  RATE_LIMITED: "RATE_LIMITED",

  // File upload errors
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  UPLOAD_FAILED: "UPLOAD_FAILED",
};

/**
 * User-friendly error message mapping
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_REQUIRED]: "Please log in to continue",
  [ERROR_CODES.AUTH_INVALID]: "Invalid login credentials",
  [ERROR_CODES.AUTH_EXPIRED]: "Your session has expired. Please log in again",
  [ERROR_CODES.AUTH_FORBIDDEN]:
    "You do not have permission to perform this action",

  [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again",
  [ERROR_CODES.INVALID_INPUT]: "The information you entered is not valid",
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: "Please fill in all required fields",

  [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested item could not be found",
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: "This item already exists",
  [ERROR_CODES.RESOURCE_CONFLICT]: "This action conflicts with existing data",

  [ERROR_CODES.PERMISSION_DENIED]:
    "You do not have permission to perform this action",
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]:
    "You need additional permissions to perform this action",

  [ERROR_CODES.NETWORK_ERROR]:
    "Network connection failed. Please check your internet connection",
  [ERROR_CODES.TIMEOUT_ERROR]: "The request timed out. Please try again",
  [ERROR_CODES.CONNECTION_ERROR]: "Unable to connect to the server",

  [ERROR_CODES.SERVER_ERROR]: "A server error occurred. Please try again later",
  [ERROR_CODES.DATABASE_ERROR]:
    "A database error occurred. Please try again later",
  [ERROR_CODES.STORAGE_ERROR]:
    "A storage error occurred. Please try again later",

  [ERROR_CODES.BUSINESS_RULE_VIOLATION]: "This action violates business rules",
  [ERROR_CODES.QUOTA_EXCEEDED]: "You have exceeded your quota limit",
  [ERROR_CODES.RATE_LIMITED]:
    "Too many requests. Please wait before trying again",

  [ERROR_CODES.FILE_TOO_LARGE]:
    "The file is too large. Please choose a smaller file",
  [ERROR_CODES.INVALID_FILE_TYPE]: "This file type is not supported",
  [ERROR_CODES.UPLOAD_FAILED]: "File upload failed. Please try again",
};

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Processed error response
 */
export function handleApiError(error, context = {}) {
  console.error("API Error:", error, context);

  // Extract error information
  const errorCode = error.code || ERROR_CODES.SERVER_ERROR;
  const errorMessage = error.message || "An unexpected error occurred";

  // Determine user-friendly message
  const userMessage =
    ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];

  // Create error response
  const errorResponse = createErrorResponse(userMessage, errorCode, {
    originalError: errorMessage,
    context,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });

  return errorResponse;
}

/**
 * Handle network errors
 * @param {Error} error - Network error
 * @returns {Object} Error response
 */
export function handleNetworkError(error) {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return createErrorResponse(
      ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      ERROR_CODES.NETWORK_ERROR,
      { originalError: error.message },
    );
  }

  if (error.name === "AbortError") {
    return createErrorResponse(
      ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR],
      ERROR_CODES.TIMEOUT_ERROR,
      { originalError: "Request was aborted" },
    );
  }

  return handleApiError(error);
}

/**
 * Handle validation errors
 * @param {Object} validationErrors - Validation errors object
 * @returns {Object} Error response
 */
export function handleValidationError(validationErrors) {
  return createErrorResponse(
    ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
    ERROR_CODES.VALIDATION_ERROR,
    { validationErrors },
  );
}

/**
 * Handle authentication errors
 * @param {Error} error - Authentication error
 * @returns {Object} Error response
 */
export function handleAuthError(error) {
  const errorCode =
    error.code === 401 ? ERROR_CODES.AUTH_INVALID : ERROR_CODES.AUTH_FORBIDDEN;

  return createErrorResponse(ERROR_MESSAGES[errorCode], errorCode, {
    originalError: error.message,
  });
}

/**
 * Retry mechanism for transient failures
 * @param {Function} operation - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Operation result
 */
export async function withRetry(operation, options = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoffFactor = 2,
    retryCondition = (error) => {
      return (
        error.code === ERROR_CODES.NETWORK_ERROR ||
        error.code === ERROR_CODES.TIMEOUT_ERROR ||
        error.code === ERROR_CODES.SERVER_ERROR
      );
    },
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry if it's the last attempt or error is not retryable
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error;
      }

      // Wait before retrying
      const waitTime = delay * Math.pow(backoffFactor, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

/**
 * Error boundary for React components
 * @param {Error} error - Error object
 * @param {Object} errorInfo - Error info from React
 * @returns {Object} Error boundary state
 */
export function handleReactError(error, errorInfo) {
  console.error("React Error Boundary:", error, errorInfo);

  return {
    hasError: true,
    error: {
      message: ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR],
      code: ERROR_CODES.SERVER_ERROR,
      details: {
        originalError: error.message,
        componentStack: errorInfo.componentStack,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    },
  };
}

/**
 * Log error for monitoring
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    code: error.code,
    context,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
  };

  // In production, you would send this to your error monitoring service
  if (process.env.NODE_ENV === "production") {
    // Example: send to Sentry, LogRocket, etc.
    console.error("Error logged:", errorLog);
  } else {
    console.error("Development error:", errorLog);
  }
}

/**
 * Create success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Success response
 */
export function createSuccessResponse(
  data,
  message = "Operation completed successfully",
) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean} Whether error is retryable
 */
export function isRetryableError(error) {
  const retryableCodes = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.CONNECTION_ERROR,
    ERROR_CODES.SERVER_ERROR,
    ERROR_CODES.DATABASE_ERROR,
    ERROR_CODES.STORAGE_ERROR,
  ];

  return retryableCodes.includes(error.code);
}

/**
 * Format error for display
 * @param {Object} error - Error object
 * @returns {string} Formatted error message
 */
export function formatErrorForDisplay(error) {
  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.error && error.error.message) {
    return error.error.message;
  }

  return "An unexpected error occurred";
}
