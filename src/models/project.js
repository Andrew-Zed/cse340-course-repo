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

export { getAllProjects };