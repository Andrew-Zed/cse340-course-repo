import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from "./src/models/project.js";

const NODE_ENV = process.env.NODE_ENV?.toLocaleLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const title = 'Home';
    res.render('home', { title });
})

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();

    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
})

app.get('/projects', async (req, res) => {

    try {
        const projects = await getAllProjects();

        const title = 'Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).send('An error occurred while loading projects.');
    }
})

app.get('/categories', (req, res) => {
    const title = 'Categories.'
    res.render('categories', { title });
})

app.listen(PORT, async () => {

    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`); 
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit with a failure code
    }

})
