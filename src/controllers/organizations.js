import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/project.js';

const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        next(error);
    }
};

// NEW: Extract dynamic route params and process single organization configurations
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        
        // Input validation: verification that the ID pattern is purely numeric
        if (!/^\d+$/.test(organizationId)) {
            const err = new Error('Invalid Organization ID Format. ID must be a number.');
            err.status = 400;
            return next(err);
        }

        const organizationDetails = await getOrganizationDetails(organizationId);
        
        // Handle missing database resources cleanly
        if (!organizationDetails) {
            const err = new Error('Requested Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(organizationId);
        const title = organizationDetails.name;

        res.render('organization', { title, organizationDetails, projects });
    } catch (error) {
        next(error);
    }
};

export { showOrganizationsPage, showOrganizationDetailsPage };