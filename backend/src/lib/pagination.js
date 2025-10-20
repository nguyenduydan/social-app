/**
 * Creates pagination parameters from query parameters
 * @param {Object} query - Express query object 
 * @returns {Object} Pagination parameters
 */
export const getPaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, Math.min(parseInt(query.limit) || 10, 50));
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};

/**
 * Creates pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page number 
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const getPaginationMetadata = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        totalItems: total,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage
    };
};