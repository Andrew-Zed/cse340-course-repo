import db from "./db.js";

const getAllCategories = async () => {
    try {
        const query = `
            SELECT 
                category_id,
                name
            FROM category
            ORDER BY name ASC;
        `;

        const result = await db.query(query);

        return result.rows;
    } catch (error) {
        console.error("Error getting categories:", error);
        throw error;
    }
};

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN service_project_category spc
            ON c.category_id = spc.category_id
        WHERE spc.service_project_id = $1
        ORDER BY c.name ASC;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO service_project_category (category_id, service_project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM service_project_category
        WHERE service_project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments };