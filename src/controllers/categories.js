import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/project.js';
import { getProjectDetails } from '../models/project.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        if (!/^\d+$/.test(categoryId)) {
            const err = new Error('Invalid Category ID Format. ID must be a number.');
            err.status = 400;
            return next(err);
        }

        const categoryDetails = await getCategoryDetails(categoryId);

        if (!categoryDetails) {
            const err = new Error('Requested Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = categoryDetails.name;

        res.render('category', { title, categoryDetails, projects });
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';
        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };
