const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const isAdmin = require('../middlewares/is-admin.middleware');

const authRoute = require('../routes/auth.route');
const authorsRoute = require('../routes/authors.route');
const newsRoute = require('../routes/news.route');
const adminRoute = require('../routes/admin.route');

const {homePage, registerPage, loginPage, adminLoginPage} = require('../pages');

const modules = (app, express) => {
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('uploads'));
    app.use(express.static('views'));
    app.use(cookieParser());
    app.use(cors());
    app.use(fileUpload());
    app.set('view engine', 'ejs');
    app.set('views', './views'); 

    app.use('/api/users', isAdmin, authRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/authors', isAdmin, authorsRoute);
    app.use('/api/news', newsRoute);
    app.use('/api/admin', adminRoute)

    app.get('/', homePage);
    app.get('/register', registerPage);
    app.get('/login', loginPage);
    app.get('/admin', adminLoginPage);
}

module.exports = modules;
