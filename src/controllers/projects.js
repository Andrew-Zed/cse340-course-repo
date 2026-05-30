import { getUpcomingProjects, getProjectDetails } from '../models/project.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(5);
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        if (!/^\d+$/.test(projectId)) {
            const err = new Error('Invalid Project ID Format. ID must be a number.');
            err.status = 400;
            return next(err);
        }

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const err = new Error('Requested Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesByProjectId(projectId);
        const title = projectDetails.title;

        res.render('project', { title, projectDetails, categories });
    } catch (error) {
        next(error);
    }
};

export { showProjectsPage, showProjectDetailsPage };



// import db from "./db.js";

// const getAllProjects = async () => {
//     try {
//         const query = `
//             SELECT 
//                 sp.project_id,
//                 sp.organization_id,
//                 sp.title,
//                 sp.description,
//                 sp.location,
//                 sp.project_date,
//                 o.name AS organization_name
//             FROM service_project sp
//             JOIN organization o
//                 ON sp.organization_id = o.organization_id
//             ORDER BY sp.project_date ASC;
//         `;
//         const result = await db.query(query);
//         return result.rows;
//     } catch (error) {
//         console.error("Error getting service projects:", error);
//         throw error;
//     }
// };

// // NEW: Retrieve all service projects linked to a specific organization ID
// const getProjectsByOrganizationId = async (organizationId) => {
//     const query = `
//         SELECT
//             project_id,
//             organization_id,
//             title,
//             description,
//             location,
//             project_date
//         FROM service_project
//         WHERE organization_id = $1
//         ORDER BY project_date ASC;
//     `;
//     const queryParams = [organizationId];
//     const result = await db.query(query, queryParams);
//     return result.rows;
// };

// export { getAllProjects, getProjectsByOrganizationId };