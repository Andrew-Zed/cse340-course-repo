import db from "./db.js";

const getAllProjects = async () => {
    try {
        const query = `
            SELECT
                sp.project_id,
                sp.organization_id,
                sp.title,
                sp.description,
                sp.location,
                sp.project_date,
                o.name AS organization_name
            FROM service_project sp
            JOIN organization o
                ON sp.organization_id = o.organization_id
            ORDER BY sp.project_date ASC;
        `;

        const result = await db.query(query);

        return result.rows;
    } catch (error) {
        console.error("Error getting service projects:", error);
        throw error;
    }
};

const getUpcomingProjects = async (limit = 5) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;
    const queryParams = [limit];
    const result = await db.query(query, queryParams);
    return result.rows;
};


const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const getProjectDetails = async (projectId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        JOIN service_project_category spc
            ON sp.project_id = spc.service_project_id
        WHERE spc.category_id = $1
        ORDER BY sp.project_date ASC;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};


const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, projectDate, organizationId) => {
    const query = `
        UPDATE service_project
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, projectDate, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project or project not found');
    }

    return result.rows[0].project_id;
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectsByOrganizationId,
    getProjectDetails,
    getProjectsByCategoryId,
    createProject,
    updateProject
};