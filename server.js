import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import session from 'express-session';
import flash from './src/middleware/flash.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set engine configurations
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.json()); // Middleware to parse JSON bodies (for API requests)

// Set up session management 
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

// Public asset pipeline
app.use(express.static(path.join(__dirname, 'public')));

// Use flash middleware messages
app.use(flash);

// Middleware: Logger runtime trace
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware: Setup view layout global environment scope variables
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    res.locals.isAdmin = false;
    res.locals.user = null;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.isAdmin = req.session.user.role_name === 'admin';
        res.locals.user = req.session.user;
    }

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