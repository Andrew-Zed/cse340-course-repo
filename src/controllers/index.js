// Define controller functions
const showHomePage = async (requestAnimationFrame, res) => {
    const title = 'Home';

    res.render('home', {title});

};

// Export controller functions
export {showHomePage}