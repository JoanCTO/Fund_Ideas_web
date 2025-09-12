import { 
  databases, 
  storage, 
  DATABASE_ID, 
  USERS_COLLECTION_ID, 
  PROJECTS_COLLECTION_ID,
  BACKINGS_COLLECTION_ID,
  PROFILE_PICTURES_BUCKET_ID,
  Query, 
  ID 
} from '../appwrite.js';

/**
 * User Profile API functions for profile management and statistics
 */

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile(userId) {
  try {
    const profile = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
    
    // Parse social links JSON
    if (profile.socialLinks) {
      profile.socialLinks = JSON.parse(profile.socialLinks);
    }
    
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

/**
 * Update user profile information
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateUserProfile(userId, profileData) {
  try {
    // Prepare data for update
    const updateData = { ...profileData };
    
    // Convert social links to JSON string if provided
    if (updateData.socialLinks) {
      updateData.socialLinks = JSON.stringify(updateData.socialLinks);
    }
    
    const updatedProfile = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      updateData
    );
    
    // Parse social links for response
    if (updatedProfile.socialLinks) {
      updatedProfile.socialLinks = JSON.parse(updatedProfile.socialLinks);
    }
    
    return {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update profile'
    };
  }
}

/**
 * Upload and set profile picture
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<Object>} Upload result
 */
export async function uploadProfilePicture(userId, file) {
  try {
    // Upload file to storage
    const fileId = ID.unique();
    const uploadedFile = await storage.createFile(
      PROFILE_PICTURES_BUCKET_ID,
      fileId,
      file
    );
    
    // Get file URL
    const fileUrl = storage.getFileView(PROFILE_PICTURES_BUCKET_ID, fileId);
    
    // Update user profile with new picture URL
    const updatedProfile = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      { profilePictureUrl: fileUrl }
    );
    
    return {
      success: true,
      data: {
        fileId,
        fileUrl,
        profile: updatedProfile
      },
      message: 'Profile picture uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to upload profile picture'
    };
  }
}

/**
 * Delete profile picture
 * @param {string} userId - User ID
 * @param {string} fileId - File ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteProfilePicture(userId, fileId) {
  try {
    // Delete file from storage
    await storage.deleteFile(PROFILE_PICTURES_BUCKET_ID, fileId);
    
    // Update user profile to remove picture URL
    const updatedProfile = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      { profilePictureUrl: null }
    );
    
    return {
      success: true,
      data: updatedProfile,
      message: 'Profile picture deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete profile picture'
    };
  }
}

/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object>} User profile data
 */
export async function getUserByUsername(username) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('username', username)]
    );
    
    if (result.documents.length === 0) {
      return {
        success: false,
        data: null,
        message: 'User not found'
      };
    }
    
    const profile = result.documents[0];
    
    // Parse social links JSON
    if (profile.socialLinks) {
      profile.socialLinks = JSON.parse(profile.socialLinks);
    }
    
    return {
      success: true,
      data: profile,
      message: 'User found successfully'
    };
  } catch (error) {
    console.error('Error finding user by username:', error);
    return {
      success: false,
      data: null,
      error: error.message,
      message: 'Failed to find user'
    };
  }
}

/**
 * Check if username is available
 * @param {string} username - Username to check
 * @returns {Promise<Object>} Availability result
 */
export async function checkUsernameAvailability(username) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('username', username)]
    );
    
    const isAvailable = result.documents.length === 0;
    
    return {
      success: true,
      data: { isAvailable },
      message: isAvailable ? 'Username is available' : 'Username is taken'
    };
  } catch (error) {
    console.error('Error checking username availability:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to check username availability'
    };
  }
}

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
export async function getUserStats(userId) {
  try {
    // Get user's projects count
    const projectsResult = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [Query.equal('creatorId', userId)]
    );
    
    // Get user's backings count
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [Query.equal('backerId', userId)]
    );
    
    // Calculate total funding received
    const totalFundingReceived = projectsResult.documents.reduce((sum, project) => {
      return sum + (project.currentFunding || 0);
    }, 0);
    
    // Calculate total funding given
    const totalFundingGiven = backingsResult.documents.reduce((sum, backing) => {
      return sum + (backing.totalAmount || 0);
    }, 0);
    
    // Count successful projects
    const successfulProjects = projectsResult.documents.filter(
      project => project.projectStatus === 'funded' || project.projectStatus === 'completed'
    ).length;
    
    const stats = {
      projectsCreated: projectsResult.total,
      projectsBacked: backingsResult.total,
      totalFundingReceived,
      totalFundingGiven,
      successfulProjects,
      successRate: projectsResult.total > 0 ? (successfulProjects / projectsResult.total) * 100 : 0
    };
    
    return {
      success: true,
      data: stats,
      message: 'User statistics retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get user statistics'
    };
  }
}

/**
 * Get user's created projects
 * @param {string} userId - User ID
 * @param {string} status - Optional status filter
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} User's projects
 */
export async function getUserProjects(userId, status = null, pagination = { limit: 10, offset: 0 }) {
  try {
    const queries = [Query.equal('creatorId', userId)];
    
    if (status) {
      queries.push(Query.equal('projectStatus', status));
    }
    
    queries.push(Query.orderDesc('$createdAt'));
    queries.push(Query.limit(pagination.limit));
    queries.push(Query.offset(pagination.offset));
    
    const result = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      queries
    );
    
    return {
      success: true,
      data: result.documents,
      total: result.total,
      message: 'User projects retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user projects:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get user projects'
    };
  }
}

/**
 * Get user's backed projects
 * @param {string} userId - User ID
 * @param {string} status - Optional status filter
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} User's backings
 */
export async function getUserBackings(userId, status = null, pagination = { limit: 10, offset: 0 }) {
  try {
    const queries = [Query.equal('backerId', userId)];
    
    if (status) {
      queries.push(Query.equal('backingStatus', status));
    }
    
    queries.push(Query.orderDesc('$createdAt'));
    queries.push(Query.limit(pagination.limit));
    queries.push(Query.offset(pagination.offset));
    
    const result = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      queries
    );
    
    return {
      success: true,
      data: result.documents,
      total: result.total,
      message: 'User backings retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user backings:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get user backings'
    };
  }
}

/**
 * Get recent user activity
 * @param {string} userId - User ID
 * @param {number} limit - Number of activities to retrieve
 * @returns {Promise<Object>} User activity
 */
export async function getUserActivity(userId, limit = 20) {
  try {
    // Get recent projects created
    const projectsResult = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [
        Query.equal('creatorId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );
    
    // Get recent backings
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [
        Query.equal('backerId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );
    
    // Combine and sort activities
    const activities = [
      ...projectsResult.documents.map(project => ({
        type: 'project_created',
        data: project,
        timestamp: project.$createdAt
      })),
      ...backingsResult.documents.map(backing => ({
        type: 'project_backed',
        data: backing,
        timestamp: backing.$createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
    
    return {
      success: true,
      data: activities,
      message: 'User activity retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user activity:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get user activity'
    };
  }
}
