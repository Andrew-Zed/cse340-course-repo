import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

const getVolunteerProjectsByUser = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        JOIN project_volunteer pv ON sp.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export { addVolunteer, removeVolunteer, getVolunteerProjectsByUser, isVolunteering };
