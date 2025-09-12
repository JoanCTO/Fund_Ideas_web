import { 
  databases, 
  DATABASE_ID, 
  PROJECTS_COLLECTION_ID,
  BACKINGS_COLLECTION_ID,
  Query, 
  ID 
} from '../appwrite.js';

/**
 * Project API functions for project management and operations
 */

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project
 */
export async function createProject(projectData) {
  try {
    // Calculate deadline based on funding duration
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + projectData.fundingDuration);
    
    const project = {
      creatorId: projectData.creatorId,
      title: projectData.title,
      shortDescription: projectData.shortDescription,
      fullDescription: projectData.fullDescription,
      category: projectData.category,
      fundingGoal: projectData.fundingGoal,
      currentFunding: 0,
      currency: projectData.currency || 'USD',
      fundingDuration: projectData.fundingDuration,
      projectStatus: 'draft',
      mainImageUrl: projectData.mainImageUrl,
      additionalImages: projectData.additionalImages || [],
      videoUrl: projectData.videoUrl || null,
      developmentStage: projectData.developmentStage || 'concept',
      backerCount: 0,
      publishedAt: null,
      deadline: deadline.toISOString(),
      completedAt: null
    };
    
    const createdProject = await databases.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      project
    );
    
    return {
      success: true,
      data: createdProject,
      message: 'Project created successfully'
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create project'
    };
  }
}

/**
 * Get single project with full details
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project data
 */
export async function getProject(projectId) {
  try {
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    return {
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting project:', error);
    return {
      success: false,
      data: null,
      error: error.message,
      message: 'Failed to get project'
    };
  }
}

/**
 * Update project information
 * @param {string} projectId - Project ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateProject(projectId, updateData) {
  try {
    // Recalculate deadline if funding duration changed
    if (updateData.fundingDuration) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + updateData.fundingDuration);
      updateData.deadline = deadline.toISOString();
    }
    
    const updatedProject = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
      updateData
    );
    
    return {
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to update project'
    };
  }
}

/**
 * Delete project (draft only)
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteProject(projectId) {
  try {
    // Check if project is in draft status
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    if (project.projectStatus !== 'draft') {
      return {
        success: false,
        error: 'Cannot delete published project',
        message: 'Only draft projects can be deleted'
      };
    }
    
    await databases.deleteDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    return {
      success: true,
      message: 'Project deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete project'
    };
  }
}

/**
 * Publish draft project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Publish result
 */
export async function publishProject(projectId) {
  try {
    const now = new Date().toISOString();
    
    const updatedProject = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
      {
        projectStatus: 'live',
        publishedAt: now
      }
    );
    
    return {
      success: true,
      data: updatedProject,
      message: 'Project published successfully'
    };
  } catch (error) {
    console.error('Error publishing project:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to publish project'
    };
  }
}

/**
 * Cancel active project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Cancel result
 */
export async function cancelProject(projectId) {
  try {
    const updatedProject = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
      {
        projectStatus: 'cancelled'
      }
    );
    
    return {
      success: true,
      data: updatedProject,
      message: 'Project cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling project:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to cancel project'
    };
  }
}

/**
 * Get filtered project list
 * @param {Object} filters - Filter options
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Projects list
 */
export async function getProjects(filters = {}, pagination = { limit: 10, offset: 0 }) {
  try {
    const queries = [];
    
    // Apply filters
    if (filters.category) {
      queries.push(Query.equal('category', filters.category));
    }
    
    if (filters.status) {
      queries.push(Query.equal('projectStatus', filters.status));
    }
    
    if (filters.creatorId) {
      queries.push(Query.equal('creatorId', filters.creatorId));
    }
    
    if (filters.minFunding) {
      queries.push(Query.greaterThanEqual('currentFunding', filters.minFunding));
    }
    
    if (filters.maxFunding) {
      queries.push(Query.lessThanEqual('currentFunding', filters.maxFunding));
    }
    
    // Only show published projects by default
    if (!filters.includeDrafts) {
      queries.push(Query.notEqual('projectStatus', 'draft'));
    }
    
    // Apply sorting
    const sortField = filters.sortBy || 'publishedAt';
    const sortOrder = filters.sortOrder || 'desc';
    queries.push(Query.orderDesc(sortField));
    
    // Apply pagination
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
      message: 'Projects retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting projects:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get projects'
    };
  }
}

/**
 * Get projects by category
 * @param {string} category - Project category
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Projects by category
 */
export async function getProjectsByCategory(category, pagination = { limit: 10, offset: 0 }) {
  return getProjects({ category }, pagination);
}

/**
 * Get projects by creator
 * @param {string} creatorId - Creator ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Creator's projects
 */
export async function getProjectsByCreator(creatorId, pagination = { limit: 10, offset: 0 }) {
  return getProjects({ creatorId, includeDrafts: true }, pagination);
}

/**
 * Search projects
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Search results
 */
export async function searchProjects(query, filters = {}, pagination = { limit: 10, offset: 0 }) {
  try {
    const searchQueries = [
      Query.search('title', query),
      Query.search('shortDescription', query),
      Query.search('fullDescription', query)
    ];
    
    // Apply additional filters
    if (filters.category) {
      searchQueries.push(Query.equal('category', filters.category));
    }
    
    if (filters.status) {
      searchQueries.push(Query.equal('projectStatus', filters.status));
    }
    
    // Only show published projects
    searchQueries.push(Query.notEqual('projectStatus', 'draft'));
    
    // Apply sorting
    searchQueries.push(Query.orderDesc('publishedAt'));
    
    // Apply pagination
    searchQueries.push(Query.limit(pagination.limit));
    searchQueries.push(Query.offset(pagination.offset));
    
    const result = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      searchQueries
    );
    
    return {
      success: true,
      data: result.documents,
      total: result.total,
      message: 'Search completed successfully'
    };
  } catch (error) {
    console.error('Error searching projects:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to search projects'
    };
  }
}

/**
 * Get featured projects
 * @param {number} limit - Number of projects to return
 * @returns {Promise<Object>} Featured projects
 */
export async function getFeaturedProjects(limit = 5) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [
        Query.equal('projectStatus', 'live'),
        Query.greaterThan('currentFunding', 0),
        Query.orderDesc('currentFunding'),
        Query.limit(limit)
      ]
    );
    
    return {
      success: true,
      data: result.documents,
      message: 'Featured projects retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting featured projects:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get featured projects'
    };
  }
}

/**
 * Get trending projects
 * @param {number} limit - Number of projects to return
 * @returns {Promise<Object>} Trending projects
 */
export async function getTrendingProjects(limit = 5) {
  try {
    // Get projects with most backers in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const result = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [
        Query.equal('projectStatus', 'live'),
        Query.greaterThan('publishedAt', sevenDaysAgo.toISOString()),
        Query.orderDesc('backerCount'),
        Query.limit(limit)
      ]
    );
    
    return {
      success: true,
      data: result.documents,
      message: 'Trending projects retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting trending projects:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get trending projects'
    };
  }
}

/**
 * Get project statistics
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project statistics
 */
export async function getProjectStats(projectId) {
  try {
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    // Get backers count
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [Query.equal('projectId', projectId)]
    );
    
    const stats = {
      currentFunding: project.currentFunding,
      fundingGoal: project.fundingGoal,
      fundingProgress: project.fundingGoal > 0 ? (project.currentFunding / project.fundingGoal) * 100 : 0,
      backerCount: project.backerCount,
      daysRemaining: project.deadline ? Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
      totalBackings: backingsResult.total,
      averageBacking: backingsResult.total > 0 ? project.currentFunding / backingsResult.total : 0
    };
    
    return {
      success: true,
      data: stats,
      message: 'Project statistics retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting project stats:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get project statistics'
    };
  }
}

/**
 * Get project backers list
 * @param {string} projectId - Project ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Project backers
 */
export async function getProjectBackers(projectId, pagination = { limit: 10, offset: 0 }) {
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
    
    return {
      success: true,
      data: result.documents,
      total: result.total,
      message: 'Project backers retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting project backers:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get project backers'
    };
  }
}

/**
 * Get project activity timeline
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project timeline
 */
export async function getProjectTimeline(projectId) {
  try {
    // Get project backings
    const backingsResult = await databases.listDocuments(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      [
        Query.equal('projectId', projectId),
        Query.orderDesc('$createdAt')
      ]
    );
    
    // Get project milestones (if any)
    // This would require milestones collection implementation
    
    const timeline = backingsResult.documents.map(backing => ({
      type: 'backing',
      data: backing,
      timestamp: backing.$createdAt
    }));
    
    return {
      success: true,
      data: timeline,
      message: 'Project timeline retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting project timeline:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get project timeline'
    };
  }
}

/**
 * Calculate project funding progress
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Funding progress
 */
export async function calculateProjectProgress(projectId) {
  try {
    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
    
    const progress = {
      currentFunding: project.currentFunding,
      fundingGoal: project.fundingGoal,
      percentage: project.fundingGoal > 0 ? (project.currentFunding / project.fundingGoal) * 100 : 0,
      remaining: Math.max(0, project.fundingGoal - project.currentFunding),
      isFunded: project.currentFunding >= project.fundingGoal
    };
    
    return {
      success: true,
      data: progress,
      message: 'Project progress calculated successfully'
    };
  } catch (error) {
    console.error('Error calculating project progress:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to calculate project progress'
    };
  }
}
