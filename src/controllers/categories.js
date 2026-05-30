import { getAllCategories, getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/project.js';

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

export { showCategoriesPage, showCategoryDetailsPage };


