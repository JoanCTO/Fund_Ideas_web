import { 
  databases, 
  DATABASE_ID, 
  BACKINGS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  REWARD_TIERS_COLLECTION_ID,
  Query, 
  ID 
} from '../appwrite.js';

/**
 * Backing API functions for project backing operations
 */

/**
 * Create new project backing
 * @param {Object} backingData - Backing data
 * @returns {Promise<Object>} Created backing
 */
export async function createBacking(backingData) {
  try {
    // Validate backing amount
    const validation = await validateBackingAmount(backingData.pledgeAmount, backingData.rewardTierId);
    if (!validation.success) {
      return validation;
    }
    
    // Check backing eligibility
    const eligibility = await checkBackingEligibility(backingData.backerId, backingData.projectId);
    if (!eligibility.success) {
      return eligibility;
    }
    
    // Calculate total amount
    const totalAmount = calculateBackingTotal(backingData.pledgeAmount, backingData.extraSupport || 0);
    
    const backing = {
      projectId: backingData.projectId,
      backerId: backingData.backerId,
      rewardTierId: backingData.rewardTierId || null,
      pledgeAmount: backingData.pledgeAmount,
      extraSupport: backingData.extraSupport || 0,
      totalAmount,
      backerName: backingData.backerName,
      backerEmail: backingData.backerEmail,
      shippingAddress: backingData.shippingAddress ? JSON.stringify(backingData.shippingAddress) : null,
      specialInstructions: backingData.specialInstructions || null,
      backingStatus: 'pending',
      isAnonymous: backingData.isAnonymous || false
    };
    
    const createdBacking = await databases.createDocument(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      ID.unique(),
      backing
    );
    
    // Update project funding and backer count
    await updateProjectFunding(backingData.projectId, totalAmount);
    
    // Claim reward tier if applicable
    if (backingData.rewardTierId) {
      await claimRewardTier(backingData.rewardTierId);
    }
    
    return {
      success: true,
      data: createdBacking,
      message: 'Backing created successfully'
    };
  } catch (error) {
    console.error('Error creating backing:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create backing'
    };
  }
}

/**
 * Get single backing details
 * @param {string} backingId - Backing ID
 * @returns {Promise<Object>} Backing data
 */
export async function getBacking(backingId) {
  try {
    const backing = await databases.getDocument(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      backingId
    );
    
    // Parse shipping address JSON
    if (backing.shippingAddress) {
      backing.shippingAddress = JSON.parse(backing.shippingAddress);
    }
    
    return {
      success: true,
      data: backing,
      message: 'Backing retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting backing:', error);
    return {
      success: false,
      data: null,
      error: error.message,
      message: 'Failed to get backing'
    };
  }
}

/**
 * Update backing information
 * @param {string} backingId - Backing ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateBacking(backingId, updateData) {
  try {
    // Prepare data for update
    const updatePayload = { ...updateData };
    
    // Convert shipping address to JSON string if provided
    if (updatePayload.shippingAddress) {
      updatePayload.shippingAddress = JSON.stringify(updatePayload.shippingAddress);
    }
    
    // Recalculate total if amounts changed
    if (updatePayload.pledgeAmount || updatePayload.extraSupport !== undefined) {
      const backing = await databases.getDocument(
        DATABASE_ID,
        BACKINGS_COLLECTION_ID,
        backingId
      );
      
      const pledgeAmount = updatePayload.pledgeAmount || backing.pledgeAmount;
      const extraSupport = updatePayload.extraSupport !== undefined ? updatePayload.extraSupport : backing.extraSupport;
      
      updatePayload.totalAmount = calculateBackingTotal(pledgeAmount, extraSupport);
    }
    
    const updatedBacking = await databases.updateDocument(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      backingId,
      updatePayload
    );
    
    // Parse shipping address for response
    if (updatedBacking.shippingAddress) {
      updatedBacking.shippingAddress = JSON.parse(updatedBacking.shippingAddress);
    }
    
    return {
      success: true,
      data: updatedBacking,
      message: 'Backing updated successfully'
    };
  } catch (error) {
    console.error('Error updating backing:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update backing'
    };
  }
}

/**
 * Cancel backing (if allowed)
 * @param {string} backingId - Backing ID
 * @returns {Promise<Object>} Cancel result
 */
export async function cancelBacking(backingId) {
  try {
    const backing = await databases.getDocument(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      backingId
    );
    
    // Check if backing can be cancelled
    if (backing.backingStatus === 'fulfilled') {
      return {
        success: false,
        error: 'Cannot cancel fulfilled backing',
        message: 'This backing has already been fulfilled and cannot be cancelled'
      };
    }
    
    // Update backing status
    const updatedBacking = await databases.updateDocument(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      backingId,
      { backingStatus: 'cancelled' }
    );
    
    // Refund project funding
    await updateProjectFunding(backing.projectId, -backing.totalAmount);
    
    // Release reward tier claim if applicable
    if (backing.rewardTierId) {
      await releaseRewardTierClaim(backing.rewardTierId);
    }
    
    return {
      success: true,
      data: updatedBacking,
      message: 'Backing cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling backing:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to cancel backing'
    };
  }
}

/**
 * Get all project backings
 * @param {string} projectId - Project ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Project backings
 */
export async function getProjectBackings(projectId, pagination = { limit: 10, offset: 0 }) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [
        Query.equal('projectId', projectId),
        Query.orderDesc('$createdAt'),
        Query.limit(pagination.limit),
        Query.offset(pagination.offset)
      ]
    );
    
    // Parse shipping addresses
    const backings = result.documents.map(backing => ({
      ...backing,
      shippingAddress: backing.shippingAddress ? JSON.parse(backing.shippingAddress) : null
    }));
    
    return {
      success: true,
      data: backings,
      total: result.total,
      message: 'Project backings retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting project backings:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get project backings'
    };
  }
}

/**
 * Get user's backing history
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} User's backings
 */
export async function getUserBackings(userId, pagination = { limit: 10, offset: 0 }) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [
        Query.equal('backerId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(pagination.limit),
        Query.offset(pagination.offset)
      ]
    );
    
    // Parse shipping addresses
    const backings = result.documents.map(backing => ({
      ...backing,
      shippingAddress: backing.shippingAddress ? JSON.parse(backing.shippingAddress) : null
    }));
    
    return {
      success: true,
      data: backings,
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
 * Validate backing amount
 * @param {number} amount - Pledge amount in cents
 * @param {string} tierId - Optional reward tier ID
 * @returns {Promise<Object>} Validation result
 */
export async function validateBackingAmount(amount, tierId = null) {
  try {
    // Check minimum amount
    if (amount < 100) { // $1.00 minimum
      return {
        success: false,
        error: 'Amount too low',
        message: 'Minimum backing amount is $1.00'
      };
    }
    
    // Check maximum amount
    if (amount > 10000000) { // $100,000 maximum
      return {
        success: false,
        error: 'Amount too high',
        message: 'Maximum backing amount is $100,000'
      };
    }
    
    // If tier is specified, validate against tier amount
    if (tierId) {
      const tier = await databases.getDocument(
        DATABASE_ID,
        REWARD_TIERS_COLLECTION_ID,
        tierId
      );
      
      if (amount < tier.pledgeAmount) {
        return {
          success: false,
          error: 'Amount below tier minimum',
          message: `Minimum amount for this tier is $${(tier.pledgeAmount / 100).toFixed(2)}`
        };
      }
    }
    
    return {
      success: true,
      message: 'Amount is valid'
    };
  } catch (error) {
    console.error('Error validating backing amount:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to validate backing amount'
    };
  }
}

/**
 * Check if user can back a project
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Eligibility result
 */
export async function checkBackingEligibility(userId, projectId) {
  try {
    // Check if project exists and is live
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    if (project.projectStatus !== 'live') {
      return {
        success: false,
        error: 'Project not available',
        message: 'This project is not currently accepting backings'
      };
    }
    
    // Check if project is not the user's own
    if (project.creatorId === userId) {
      return {
        success: false,
        error: 'Cannot back own project',
        message: 'You cannot back your own project'
      };
    }
    
    // Check if project deadline has passed
    if (project.deadline && new Date(project.deadline) < new Date()) {
      return {
        success: false,
        error: 'Project deadline passed',
        message: 'This project is no longer accepting backings'
      };
    }
    
    return {
      success: true,
      message: 'User is eligible to back this project'
    };
  } catch (error) {
    console.error('Error checking backing eligibility:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to check backing eligibility'
    };
  }
}

/**
 * Calculate total backing amount
 * @param {number} pledgeAmount - Pledge amount in cents
 * @param {number} extraSupport - Extra support amount in cents
 * @returns {number} Total amount in cents
 */
export function calculateBackingTotal(pledgeAmount, extraSupport) {
  return pledgeAmount + (extraSupport || 0);
}

/**
 * Update project funding and backer count
 * @param {string} projectId - Project ID
 * @param {number} amountChange - Amount to add/subtract
 * @returns {Promise<void>}
 */
async function updateProjectFunding(projectId, amountChange) {
  try {
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    const newFunding = Math.max(0, project.currentFunding + amountChange);
    const newBackerCount = amountChange > 0 ? project.backerCount + 1 : Math.max(0, project.backerCount - 1);
    
    await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
      {
        currentFunding: newFunding,
        backerCount: newBackerCount
      }
    );
  } catch (error) {
    console.error('Error updating project funding:', error);
  }
}

/**
 * Claim reward tier (increment claimed count)
 * @param {string} tierId - Tier ID
 * @returns {Promise<void>}
 */
async function claimRewardTier(tierId) {
  try {
    const tier = await databases.getDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    await databases.updateDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId,
      {
        claimedCount: tier.claimedCount + 1
      }
    );
  } catch (error) {
    console.error('Error claiming reward tier:', error);
  }
}

/**
 * Release reward tier claim (decrement claimed count)
 * @param {string} tierId - Tier ID
 * @returns {Promise<void>}
 */
async function releaseRewardTierClaim(tierId) {
  try {
    const tier = await databases.getDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    await databases.updateDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId,
      {
        claimedCount: Math.max(0, tier.claimedCount - 1)
      }
    );
  } catch (error) {
    console.error('Error releasing reward tier claim:', error);
  }
}

/**
 * Get backing statistics for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Backing statistics
 */
export async function getBackingStats(projectId) {
  try {
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [Query.equal('projectId', projectId)]
    );
    
    const confirmedBackings = backingsResult.documents.filter(
      backing => backing.backingStatus === 'confirmed' || backing.backingStatus === 'fulfilled'
    );
    
    const stats = {
      totalBackings: backingsResult.total,
      confirmedBackings: confirmedBackings.length,
      totalAmount: confirmedBackings.reduce((sum, backing) => sum + backing.totalAmount, 0),
      averageBacking: confirmedBackings.length > 0 ? 
        confirmedBackings.reduce((sum, backing) => sum + backing.totalAmount, 0) / confirmedBackings.length : 0,
      anonymousBackings: backingsResult.documents.filter(backing => backing.isAnonymous).length
    };
    
    return {
      success: true,
      data: stats,
      message: 'Backing statistics retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting backing stats:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get backing statistics'
    };
  }
}
