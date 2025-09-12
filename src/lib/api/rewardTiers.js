import { 
  databases, 
  DATABASE_ID, 
  REWARD_TIERS_COLLECTION_ID,
  BACKINGS_COLLECTION_ID,
  Query, 
  ID 
} from '../appwrite.js';

/**
 * Reward Tier API functions for reward management
 */

/**
 * Create new reward tier
 * @param {string} projectId - Project ID
 * @param {Object} tierData - Reward tier data
 * @returns {Promise<Object>} Created reward tier
 */
export async function createRewardTier(projectId, tierData) {
  try {
    const tier = {
      projectId,
      tierTitle: tierData.tierTitle,
      tierDescription: tierData.tierDescription,
      pledgeAmount: tierData.pledgeAmount,
      estimatedDelivery: tierData.estimatedDelivery,
      isLimited: tierData.isLimited || false,
      quantityLimit: tierData.quantityLimit || null,
      claimedCount: 0,
      isDigital: tierData.isDigital || false,
      tierOrder: tierData.tierOrder
    };
    
    const createdTier = await databases.createDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      ID.unique(),
      tier
    );
    
    return {
      success: true,
      data: createdTier,
      message: 'Reward tier created successfully'
    };
  } catch (error) {
    console.error('Error creating reward tier:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create reward tier'
    };
  }
}

/**
 * Get all reward tiers for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Reward tiers
 */
export async function getRewardTiers(projectId) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      [
        Query.equal('projectId', projectId),
        Query.orderAsc('tierOrder')
      ]
    );
    
    return {
      success: true,
      data: result.documents,
      message: 'Reward tiers retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting reward tiers:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get reward tiers'
    };
  }
}

/**
 * Update reward tier information
 * @param {string} tierId - Tier ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateRewardTier(tierId, updateData) {
  try {
    const updatedTier = await databases.updateDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId,
      updateData
    );
    
    return {
      success: true,
      data: updatedTier,
      message: 'Reward tier updated successfully'
    };
  } catch (error) {
    console.error('Error updating reward tier:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update reward tier'
    };
  }
}

/**
 * Delete reward tier (if no backers)
 * @param {string} tierId - Tier ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteRewardTier(tierId) {
  try {
    // Check if tier has any backings
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [Query.equal('rewardTierId', tierId)]
    );
    
    if (backingsResult.total > 0) {
      return {
        success: false,
        error: 'Cannot delete tier with existing backers',
        message: 'Reward tier has backers and cannot be deleted'
      };
    }
    
    await databases.deleteDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    return {
      success: true,
      message: 'Reward tier deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting reward tier:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete reward tier'
    };
  }
}

/**
 * Check if reward tier is available
 * @param {string} tierId - Tier ID
 * @returns {Promise<Object>} Availability status
 */
export async function checkTierAvailability(tierId) {
  try {
    const tier = await databases.getDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    const isAvailable = !tier.isLimited || (tier.claimedCount < tier.quantityLimit);
    
    return {
      success: true,
      data: {
        isAvailable,
        claimedCount: tier.claimedCount,
        quantityLimit: tier.quantityLimit,
        remaining: tier.isLimited ? Math.max(0, tier.quantityLimit - tier.claimedCount) : null
      },
      message: 'Tier availability checked successfully'
    };
  } catch (error) {
    console.error('Error checking tier availability:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to check tier availability'
    };
  }
}

/**
 * Claim reward tier (increment claimed count)
 * @param {string} tierId - Tier ID
 * @returns {Promise<Object>} Claim result
 */
export async function claimRewardTier(tierId) {
  try {
    // Check availability first
    const availability = await checkTierAvailability(tierId);
    
    if (!availability.success || !availability.data.isAvailable) {
      return {
        success: false,
        error: 'Tier not available',
        message: 'Reward tier is not available for claiming'
      };
    }
    
    // Get current tier data
    const tier = await databases.getDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    // Increment claimed count
    const updatedTier = await databases.updateDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId,
      {
        claimedCount: tier.claimedCount + 1
      }
    );
    
    return {
      success: true,
      data: updatedTier,
      message: 'Reward tier claimed successfully'
    };
  } catch (error) {
    console.error('Error claiming reward tier:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to claim reward tier'
    };
  }
}

/**
 * Get reward tier by ID
 * @param {string} tierId - Tier ID
 * @returns {Promise<Object>} Reward tier data
 */
export async function getRewardTier(tierId) {
  try {
    const tier = await databases.getDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    return {
      success: true,
      data: tier,
      message: 'Reward tier retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting reward tier:', error);
    return {
      success: false,
      data: null,
      error: error.message,
      message: 'Failed to get reward tier'
    };
  }
}

/**
 * Get reward tiers by project with availability status
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Reward tiers with availability
 */
export async function getRewardTiersWithAvailability(projectId) {
  try {
    const tiersResult = await getRewardTiers(projectId);
    
    if (!tiersResult.success) {
      return tiersResult;
    }
    
    // Check availability for each tier
    const tiersWithAvailability = await Promise.all(
      tiersResult.data.map(async (tier) => {
        const availability = await checkTierAvailability(tier.$id);
        return {
          ...tier,
          availability: availability.success ? availability.data : null
        };
      })
    );
    
    return {
      success: true,
      data: tiersWithAvailability,
      message: 'Reward tiers with availability retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting reward tiers with availability:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get reward tiers with availability'
    };
  }
}

/**
 * Update reward tier order
 * @param {string} projectId - Project ID
 * @param {Array} tierOrders - Array of {tierId, tierOrder} objects
 * @returns {Promise<Object>} Update result
 */
export async function updateRewardTierOrder(projectId, tierOrders) {
  try {
    const updatePromises = tierOrders.map(({ tierId, tierOrder }) =>
      databases.updateDocument(
        DATABASE_ID,
        REWARD_TIERS_COLLECTION_ID,
        tierId,
        { tierOrder }
      )
    );
    
    await Promise.all(updatePromises);
    
    return {
      success: true,
      message: 'Reward tier order updated successfully'
    };
  } catch (error) {
    console.error('Error updating reward tier order:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update reward tier order'
    };
  }
}

/**
 * Get reward tier statistics
 * @param {string} tierId - Tier ID
 * @returns {Promise<Object>} Tier statistics
 */
export async function getRewardTierStats(tierId) {
  try {
    const tier = await databases.getDocument(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      tierId
    );
    
    // Get backings for this tier
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [Query.equal('rewardTierId', tierId)]
    );
    
    const stats = {
      tierId: tier.$id,
      tierTitle: tier.tierTitle,
      pledgeAmount: tier.pledgeAmount,
      claimedCount: tier.claimedCount,
      quantityLimit: tier.quantityLimit,
      isLimited: tier.isLimited,
      totalBackings: backingsResult.total,
      totalRevenue: backingsResult.documents.reduce((sum, backing) => sum + backing.totalAmount, 0),
      availability: tier.isLimited ? Math.max(0, tier.quantityLimit - tier.claimedCount) : 'unlimited'
    };
    
    return {
      success: true,
      data: stats,
      message: 'Reward tier statistics retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting reward tier stats:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get reward tier statistics'
    };
  }
}
