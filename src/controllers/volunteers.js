import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const processAddVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        if (!/^\d+$/.test(projectId)) {
            const err = new Error('Invalid Project ID Format. ID must be a number.');
            err.status = 400;
            return next(err);
        }

        const userId = req.session.user.user_id;
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have signed up to volunteer for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

const processRemoveVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        if (!/^\d+$/.test(projectId)) {
            const err = new Error('Invalid Project ID Format. ID must be a number.');
            err.status = 400;
            return next(err);
        }

        const userId = req.session.user.user_id;
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export { processAddVolunteer, processRemoveVolunteer };
