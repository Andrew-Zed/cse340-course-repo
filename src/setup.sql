-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

SELECT * FROM organization;

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');






-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

SELECT * FROM service_project;



-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
-- Projects for BrightFuture Builders
(
    1,
    'Community Center Renovation',
    'Renovating an old community center to provide a safe space for youth programs and local events.',
    'Downtown Community Center',
    '2026-06-05'
),
(
    1,
    'School Fence Repair',
    'Repairing damaged fencing around a local school to improve student safety.',
    'Maple Grove Primary School',
    '2026-06-12'
),
(
    1,
    'Affordable Housing Painting Day',
    'Volunteers will paint newly constructed affordable housing units for low-income families.',
    'Sunrise Housing Estate',
    '2026-06-19'
),
(
    1,
    'Public Park Bench Installation',
    'Installing benches in a public park to improve comfort for families and elderly visitors.',
    'Greenfield Public Park',
    '2026-06-26'
),
(
    1,
    'Neighborhood Drainage Cleanup',
    'Clearing blocked drainage channels to reduce flooding during heavy rainfall.',
    'Oak Street Neighborhood',
    '2026-07-03'
),

-- Projects for GreenHarvest Growers
(
    2,
    'Urban Garden Planting',
    'Planting vegetables and herbs in a community garden to support local food sustainability.',
    'Eastside Community Garden',
    '2026-06-07'
),
(
    2,
    'Composting Workshop',
    'Teaching residents how to reduce waste and create compost for home gardens.',
    'GreenHarvest Learning Center',
    '2026-06-14'
),
(
    2,
    'School Garden Setup',
    'Helping a local school create a small garden for student learning and food education.',
    'Riverside Junior School',
    '2026-06-21'
),
(
    2,
    'Farmers Market Volunteer Day',
    'Supporting local growers by helping with setup, coordination, and cleanup at a farmers market.',
    'Central Farmers Market',
    '2026-06-28'
),
(
    2,
    'Tree Planting for Food Security',
    'Planting fruit trees in selected neighborhoods to promote long-term food access.',
    'Northview Estate',
    '2026-07-05'
),

-- Projects for UnityServe Volunteers
(
    3,
    'Charity Food Drive',
    'Collecting and distributing food items to families in need within the community.',
    'UnityServe Volunteer Hall',
    '2026-06-09'
),
(
    3,
    'Senior Home Support Visit',
    'Volunteers will visit a senior home to assist with cleaning, games, and companionship.',
    'Hope Senior Residence',
    '2026-06-16'
),
(
    3,
    'Back-to-School Supply Drive',
    'Collecting school supplies for children from low-income families.',
    'UnityServe Collection Center',
    '2026-06-23'
),
(
    3,
    'Community Health Awareness Day',
    'Organizing a health awareness event with basic health checks and educational materials.',
    'Town Hall Auditorium',
    '2026-06-30'
),
(
    3,
    'Neighborhood Cleanup Campaign',
    'Volunteers will clean streets, collect waste, and promote environmental responsibility.',
    'Westbrook Neighborhood',
    '2026-07-07'
);



SELECT 
    sp.project_id,
    sp.title,
    sp.description,
    sp.location,
    sp.project_date,
    o.name AS organization_name
FROM service_project sp
JOIN organization o
    ON sp.organization_id = o.organization_id
ORDER BY sp.project_date;



-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Service Project Category Junction Table
-- ========================================
CREATE TABLE service_project_category (
    service_project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT pk_service_project_category
        PRIMARY KEY (service_project_id, category_id),

    CONSTRAINT fk_spc_service_project
        FOREIGN KEY (service_project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_spc_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Associate Service Projects with Categories
-- ========================================
INSERT INTO service_project_category (service_project_id, category_id)
VALUES
(1, 3),
(2, 2),
(3, 3),
(4, 3),
(5, 1),
(6, 1),
(7, 2),
(7, 1),
(8, 2),
(8, 1),
(9, 3),
(10, 1),
(11, 3),
(12, 3),
(12, 4),
(13, 2),
(14, 4),
(15, 1),
(15, 3);


CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);


INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';