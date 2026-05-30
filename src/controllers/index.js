// Define controller functions for the main landing page
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

export { showHomePage };