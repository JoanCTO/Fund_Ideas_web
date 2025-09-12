import { account, databases, DATABASE_ID, USERS_COLLECTION_ID, ID } from '../appwrite.js';

/**
 * Authentication API functions for user management
 */

/**
 * Create a new user account
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User's full name
 * @param {string} username - URL-friendly username
 * @param {string} userType - 'creator' or 'backer'
 * @returns {Promise<Object>} User account and profile data
 */
export async function createUserAccount(email, password, fullName, username, userType = 'backer') {
  try {
    // Create Appwrite account
    const user = await account.create(ID.unique(), email, password, fullName);
    
    // Create user profile in database
    const profileData = {
      userId: user.$id,
      username,
      fullName,
      email,
      userType,
      bio: '',
      profilePictureUrl: null,
      socialLinks: JSON.stringify({}),
      isVerified: false,
      isActive: true
    };

    const profile = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      profileData
    );

    return {
      success: true,
      user,
      profile,
      message: 'Account created successfully'
    };
  } catch (error) {
    console.error('Error creating user account:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create account'
    };
  }
}

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result with user data
 */
export async function loginUser(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    
    // Get user profile data
    const profile = await getUserProfile(session.userId);
    
    return {
      success: true,
      session,
      user: session,
      profile: profile.data,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: false,
      error: error.message,
      message: 'Login failed'
    };
  }
}

/**
 * Logout current user
 * @returns {Promise<Object>} Logout result
 */
export async function logoutUser() {
  try {
    await account.deleteSession('current');
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Error logging out user:', error);
    return {
      success: false,
      error: error.message,
      message: 'Logout failed'
    };
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user data
 */
export async function getCurrentUser() {
  try {
    const user = await account.get();
    const profile = await getUserProfile(user.$id);
    
    return {
      success: true,
      user,
      profile: profile.data,
      message: 'User data retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get user data'
    };
  }
}

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password update result
 */
export async function updateUserPassword(currentPassword, newPassword) {
  try {
    await account.updatePassword(newPassword, currentPassword);
    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update password'
    };
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Password reset result
 */
export async function resetUserPassword(email) {
  try {
    await account.createRecovery(email, `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`);
    return {
      success: true,
      message: 'Password reset email sent'
    };
  } catch (error) {
    console.error('Error sending password reset:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send password reset email'
    };
  }
}

/**
 * Verify email address
 * @param {string} userId - User ID
 * @param {string} secret - Verification secret
 * @returns {Promise<Object>} Email verification result
 */
export async function verifyEmail(userId, secret) {
  try {
    await account.updateVerification(userId, secret);
    
    // Update user profile to mark as verified
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      { isVerified: true }
    );
    
    return {
      success: true,
      message: 'Email verified successfully'
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to verify email'
    };
  }
}

/**
 * Get user session status
 * @returns {Promise<Object>} Session status
 */
export async function getUserSession() {
  try {
    const session = await account.getSession('current');
    return {
      success: true,
      session,
      isAuthenticated: true,
      message: 'Session is valid'
    };
  } catch (error) {
    return {
      success: false,
      session: null,
      isAuthenticated: false,
      message: 'No valid session'
    };
  }
}

/**
 * Refresh user session
 * @returns {Promise<Object>} Session refresh result
 */
export async function refreshSession() {
  try {
    const session = await account.getSession('current');
    return {
      success: true,
      session,
      message: 'Session refreshed successfully'
    };
  } catch (error) {
    console.error('Error refreshing session:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to refresh session'
    };
  }
}

/**
 * Delete current session
 * @returns {Promise<Object>} Session deletion result
 */
export async function deleteSession() {
  try {
    await account.deleteSession('current');
    return {
      success: true,
      message: 'Session deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting session:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete session'
    };
  }
}

/**
 * Delete all user sessions
 * @returns {Promise<Object>} Sessions deletion result
 */
export async function deleteAllSessions() {
  try {
    await account.deleteSessions();
    return {
      success: true,
      message: 'All sessions deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete all sessions'
    };
  }
}

/**
 * Get user profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(userId) {
  try {
    const profile = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
    
    return {
      success: true,
      data: profile,
      message: 'Profile retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      data: null,
      error: error.message,
      message: 'Failed to get user profile'
    };
  }
}
