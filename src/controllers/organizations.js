import { getAllOrganizations } from "../models/organizations.js";

const showOrganizationsPage = async (req, res, next) => {

    try {
        const organizations = await getAllOrganizations();

        const title = 'Our Partner Organization';

        res.render('organizations', { title, organizations });
    } catch (error) {
        next(error);
    }

};

// Export controller functions
export { showOrganizationsPage };