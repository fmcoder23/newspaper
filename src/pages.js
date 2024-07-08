const homePage = (req, res) => {
    res.redirect('/api/news');
}

const registerPage = (req, res) => {
    res.render('register');
}

const loginPage = (req, res) => {
    res.render('login');
}

const adminLoginPage = (req, res) => {
    res.render('admin-login');
}

module.exports = {
    homePage,
    registerPage,
    loginPage,
    adminLoginPage
}