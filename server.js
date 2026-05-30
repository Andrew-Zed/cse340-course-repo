// import express from 'express';

// import { fileURLToPath } from 'url';
// import path from 'path';
// import { testConnection } from './src/models/db.js';
// import { getAllOrganizations } from './src/models/organizations.js';
// import { getAllProjects } from "./src/models/project.js";
// import { getAllCategories } from "./src/models/categories.js";

// const NODE_ENV = process.env.NODE_ENV?.toLocaleLowerCase() || "production";
// const PORT = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.set('view engine', 'ejs');

// app.set('views', path.join(__dirname, 'src/views'));

// // Middleware to log all incoming requests
// app.use((req, res, next) => {
//     if (NODE_ENV === 'development') {
//         console.log(`${req.method} ${req.url}`);
//     }
//     next(); // Pass control to the next middleware or route
// });

// // Middleware to make NODE_ENV available to all templates
// app.use((req, res, next) => {
//     res.locals.NODE_ENV = NODE_ENV;
//     next();
// });

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     const title = 'Home';
//     res.render('home', { title });
// })

// app.get('/organizations', async (req, res) => {
//     const organizations = await getAllOrganizations();

//     const title = 'Our Partner Organizations';
//     res.render('organizations', { title, organizations });
// })

// app.get('/projects', async (req, res) => {

//     try {
//         const projects = await getAllProjects();

//         const title = 'Projects';

//         res.render('projects', { title, projects });
//     } catch (error) {
//         console.error('Error loading projects:', error);
//         res.status(500).send('An error occurred while loading projects.');
//     }
// })

// app.get('/categories', async (req, res) => {
    
//     try {
//         const categories = await getAllCategories();

//         const title = 'Categories'
        
//         res.render('categories', { title, categories });
//     } catch (error) {
//         console.error('Error loading categories:', error);
//         res.status(500).send('An error occured while loading categories.');
//     }
// });

// // Test route for 500 errors
// app.get('/test-error', (req, res, next) => {
//     const err = new Error('This is a test error');
//     err.status = 500;
//     next(err);
// });

// // Catch-all route for 404 errors
// app.use((req, res, next) => {
//     const err = new Error('Page Not Found');
//     err.status = 404;
//     next(err);
// });


// // Global error handler
// app.use((err, req, res, next) => {
//     // Log error details for debugging
//     console.error('Error occurred:', err.message);
//     console.error('Stack trace:', err.stack);
    
//     // Determine status and template
//     const status = err.status || 500;
//     const template = status === 404 ? '404' : '500';
    
//     // Prepare data for the template
//     const context = {
//         title: status === 404 ? 'Page Not Found' : 'Server Error',
//         error: err.message,
//         stack: err.stack
//     };
    
//     // Render the appropriate error template
//     res.status(status).render(`errors/${template}`, context);
// });

// app.listen(PORT, async () => {

//     try {
//         await testConnection();
//         console.log(`Server is running at http://127.0.0.1:${PORT}`);
//         console.log(`Environment: ${NODE_ENV}`); 
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         process.exit(1); // Exit with a failure code
//     }

// })




// import express from 'express';
// import { fileURLToPath } from 'url';
// import path from 'path';

// import { testConnection } from './src/models/db.js';
// import router from './src/routes.js';

// const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
// const PORT = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Set up UI template engines and directories
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'src/views'));

// // Serve static assets out of the public assets directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Middleware: Development console logs
// app.use((req, res, next) => {
//     if (NODE_ENV === 'development') {
//         console.log(`${req.method} ${req.url}`);
//     }
//     next();
// });

// // Middleware: Expose NODE_ENV globals cleanly to EJS files
// app.use((req, res, next) => {
//     res.locals.NODE_ENV = NODE_ENV;
//     next();
// });

// // Use the isolated MVC application router
// app.use(router);

// // Catch-all fall-through route handler for matching 404 errors
// app.use((req, res, next) => {
//     const err = new Error('Page Not Found');
//     err.status = 404;
//     next(err);
// });

// // Global centralized error handler middleware
// app.use((err, req, res, next) => {
//     console.error('Error occurred:', err.message);
//     console.error('Stack trace:', err.stack);
    
//     const status = err.status || 500;
//     const template = status === 404 ? '404' : '500';
    
//     const context = {
//         title: status === 404 ? 'Page Not Found' : 'Server Error',
//         error: err.message,
//         stack: err.stack
//     };
    
//     res.status(status).render(`errors/${template}`, context);
// });

// // Establish database pool communication and turn on listeners
// app.listen(PORT, async () => {
//     try {
//         await testConnection();
//         console.log(`Server is running at http://127.0.0.1:${PORT}`);
//         console.log(`Environment: ${NODE_ENV}`); 
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         process.exit(1);
//     }
// });




import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set engine configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Public asset pipeline
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: Logger runtime trace
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware: Setup view layout global environment scope variables
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Load App Router Groupings
app.use(router);

// Middleware: Catch-all Fallback Routing for unmapped endpoints
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Centered Global Error Management Middleware Instance (4-parameters)
app.use((err, req, res, next) => {
    console.error('Centralized Log Catch:', err.message);
    
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    res.status(status).render(`errors/${template}`, context);
});

// Validate DB Handshake and turn on listener
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment Tier: ${NODE_ENV}`); 
    } catch (error) {
        console.error('Critical Server Start Halted: Database handshaking failure:', error);
        process.exit(1);
    }
});