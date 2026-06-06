import { getAllProjects } from "../models/project.js";

const showProjectsPage = async (req, res, next) => {

    try {
        const projects = await getAllProjects();

        const title = 'Projects';

        res.render('projects', { title, projects });

    } catch (error) {
        next(error)
    }

}

export { showProjectsPage };
