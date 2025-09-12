import {
  databases,
  DATABASE_ID,
  MILESTONES_COLLECTION_ID,
  Query,
  ID,
} from "../appwrite.js";

/**
 * Milestone API functions for milestone management and tracking
 */

/**
 * Create new milestone
 * @param {string} projectId - Project ID
 * @param {Object} milestoneData - Milestone data
 * @returns {Promise<Object>} Created milestone
 */
export async function createMilestone(projectId, milestoneData) {
  try {
    const milestone = {
      projectId,
      milestoneTitle: milestoneData.milestoneTitle,
      milestoneDescription: milestoneData.milestoneDescription,
      milestoneOrder: milestoneData.milestoneOrder,
      targetDate: milestoneData.targetDate,
      completionDate: null,
      fundingPercentage: milestoneData.fundingPercentage,
      deliverables: JSON.stringify(milestoneData.deliverables || []),
      successCriteria: milestoneData.successCriteria,
      milestoneStatus: "pending",
      completionEvidence: null,
      backerFeedbackScore: null,
    };

    const createdMilestone = await databases.createDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      ID.unique(),
      milestone,
    );

    return {
      success: true,
      data: createdMilestone,
      message: "Milestone created successfully",
    };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to create milestone",
    };
  }
}

/**
 * Get all project milestones
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project milestones
 */
export async function getMilestones(projectId) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      [Query.equal("projectId", projectId), Query.orderAsc("milestoneOrder")],
    );

    // Parse deliverables JSON
    const milestones = result.documents.map((milestone) => ({
      ...milestone,
      deliverables: milestone.deliverables
        ? JSON.parse(milestone.deliverables)
        : [],
    }));

    return {
      success: true,
      data: milestones,
      message: "Milestones retrieved successfully",
    };
  } catch (error) {
    console.error("Error getting milestones:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to get milestones",
    };
  }
}

/**
 * Get single milestone details
 * @param {string} milestoneId - Milestone ID
 * @returns {Promise<Object>} Milestone data
 */
export async function getMilestone(milestoneId) {
  try {
    const milestone = await databases.getDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
    );

    // Parse deliverables JSON
    milestone.deliverables = milestone.deliverables
      ? JSON.parse(milestone.deliverables)
      : [];

    return {
      success: true,
      data: milestone,
      message: "Milestone retrieved successfully",
    };
  } catch (error) {
    console.error("Error getting milestone:", error);
    return {
      success: false,
      data: null,
      error: error.message,
      message: "Failed to get milestone",
    };
  }
}

/**
 * Update milestone
 * @param {string} milestoneId - Milestone ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateMilestone(milestoneId, updateData) {
  try {
    // Prepare data for update
    const updatePayload = { ...updateData };

    // Convert deliverables to JSON string if provided
    if (updatePayload.deliverables) {
      updatePayload.deliverables = JSON.stringify(updatePayload.deliverables);
    }

    const updatedMilestone = await databases.updateDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
      updatePayload,
    );

    // Parse deliverables for response
    updatedMilestone.deliverables = updatedMilestone.deliverables
      ? JSON.parse(updatedMilestone.deliverables)
      : [];

    return {
      success: true,
      data: updatedMilestone,
      message: "Milestone updated successfully",
    };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to update milestone",
    };
  }
}

/**
 * Delete milestone (if no progress)
 * @param {string} milestoneId - Milestone ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteMilestone(milestoneId) {
  try {
    const milestone = await databases.getDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
    );

    // Check if milestone has progress
    if (milestone.milestoneStatus !== "pending") {
      return {
        success: false,
        error: "Cannot delete milestone with progress",
        message: "Only pending milestones can be deleted",
      };
    }

    await databases.deleteDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
    );

    return {
      success: true,
      message: "Milestone deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete milestone",
    };
  }
}

/**
 * Mark milestone as complete
 * @param {string} milestoneId - Milestone ID
 * @param {string} evidence - Completion evidence
 * @returns {Promise<Object>} Completion result
 */
export async function markMilestoneComplete(milestoneId, evidence) {
  try {
    const now = new Date().toISOString();

    const updatedMilestone = await databases.updateDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
      {
        milestoneStatus: "completed",
        completionDate: now,
        completionEvidence: evidence,
      },
    );

    return {
      success: true,
      data: updatedMilestone,
      message: "Milestone marked as complete",
    };
  } catch (error) {
    console.error("Error marking milestone complete:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to mark milestone as complete",
    };
  }
}

/**
 * Get overall milestone progress for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Milestone progress
 */
export async function getMilestoneProgress(projectId) {
  try {
    const milestonesResult = await getMilestones(projectId);

    if (!milestonesResult.success) {
      return milestonesResult;
    }

    const milestones = milestonesResult.data;
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(
      (m) => m.milestoneStatus === "completed",
    ).length;
    const inProgressMilestones = milestones.filter(
      (m) => m.milestoneStatus === "in_progress",
    ).length;
    const overdueMilestones = milestones.filter((m) => {
      if (m.milestoneStatus === "completed") return false;
      return new Date(m.targetDate) < new Date();
    }).length;

    const progress = {
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      overdueMilestones,
      completionPercentage:
        totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
      averageFeedbackScore:
        milestones
          .filter((m) => m.backerFeedbackScore !== null)
          .reduce((sum, m) => sum + m.backerFeedbackScore, 0) /
          milestones.filter((m) => m.backerFeedbackScore !== null).length || 0,
    };

    return {
      success: true,
      data: progress,
      message: "Milestone progress retrieved successfully",
    };
  } catch (error) {
    console.error("Error getting milestone progress:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to get milestone progress",
    };
  }
}

/**
 * Get overdue milestones
 * @param {string} projectId - Optional project ID filter
 * @returns {Promise<Object>} Overdue milestones
 */
export async function getOverdueMilestones(projectId = null) {
  try {
    const queries = [
      Query.lessThan("targetDate", new Date().toISOString()),
      Query.notEqual("milestoneStatus", "completed"),
    ];

    if (projectId) {
      queries.push(Query.equal("projectId", projectId));
    }

    queries.push(Query.orderAsc("targetDate"));

    const result = await databases.listDocuments(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      queries,
    );

    // Parse deliverables JSON
    const milestones = result.documents.map((milestone) => ({
      ...milestone,
      deliverables: milestone.deliverables
        ? JSON.parse(milestone.deliverables)
        : [],
    }));

    return {
      success: true,
      data: milestones,
      message: "Overdue milestones retrieved successfully",
    };
  } catch (error) {
    console.error("Error getting overdue milestones:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to get overdue milestones",
    };
  }
}

/**
 * Get milestones by status
 * @param {string} status - Milestone status
 * @param {string} projectId - Optional project ID filter
 * @returns {Promise<Object>} Milestones by status
 */
export async function getMilestonesByStatus(status, projectId = null) {
  try {
    const queries = [Query.equal("milestoneStatus", status)];

    if (projectId) {
      queries.push(Query.equal("projectId", projectId));
    }

    queries.push(Query.orderAsc("milestoneOrder"));

    const result = await databases.listDocuments(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      queries,
    );

    // Parse deliverables JSON
    const milestones = result.documents.map((milestone) => ({
      ...milestone,
      deliverables: milestone.deliverables
        ? JSON.parse(milestone.deliverables)
        : [],
    }));

    return {
      success: true,
      data: milestones,
      message: "Milestones by status retrieved successfully",
    };
  } catch (error) {
    console.error("Error getting milestones by status:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to get milestones by status",
    };
  }
}

/**
 * Calculate milestone completion percentage
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Completion percentage
 */
export async function calculateMilestoneCompletion(projectId) {
  try {
    const progress = await getMilestoneProgress(projectId);

    if (!progress.success) {
      return progress;
    }

    return {
      success: true,
      data: {
        completionPercentage: progress.data.completionPercentage,
        completedMilestones: progress.data.completedMilestones,
        totalMilestones: progress.data.totalMilestones,
      },
      message: "Milestone completion calculated successfully",
    };
  } catch (error) {
    console.error("Error calculating milestone completion:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to calculate milestone completion",
    };
  }
}

/**
 * Update milestone status
 * @param {string} milestoneId - Milestone ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Update result
 */
export async function updateMilestoneStatus(milestoneId, status) {
  try {
    const validStatuses = [
      "pending",
      "in_progress",
      "review",
      "completed",
      "overdue",
    ];

    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: "Invalid status",
        message: "Status must be one of: " + validStatuses.join(", "),
      };
    }

    const updateData = { milestoneStatus: status };

    // Set completion date if marking as completed
    if (status === "completed") {
      updateData.completionDate = new Date().toISOString();
    }

    const updatedMilestone = await databases.updateDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
      updateData,
    );

    return {
      success: true,
      data: updatedMilestone,
      message: "Milestone status updated successfully",
    };
  } catch (error) {
    console.error("Error updating milestone status:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to update milestone status",
    };
  }
}

/**
 * Add backer feedback to milestone
 * @param {string} milestoneId - Milestone ID
 * @param {number} feedbackScore - Feedback score (1-5)
 * @returns {Promise<Object>} Update result
 */
export async function addMilestoneFeedback(milestoneId, feedbackScore) {
  try {
    if (feedbackScore < 1 || feedbackScore > 5) {
      return {
        success: false,
        error: "Invalid feedback score",
        message: "Feedback score must be between 1 and 5",
      };
    }

    const milestone = await databases.getDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
    );

    // Calculate new average feedback score
    const currentScore = milestone.backerFeedbackScore || 0;
    const newScore =
      currentScore === 0 ? feedbackScore : (currentScore + feedbackScore) / 2;

    const updatedMilestone = await databases.updateDocument(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      milestoneId,
      {
        backerFeedbackScore: newScore,
      },
    );

    return {
      success: true,
      data: updatedMilestone,
      message: "Milestone feedback added successfully",
    };
  } catch (error) {
    console.error("Error adding milestone feedback:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to add milestone feedback",
    };
  }
}
