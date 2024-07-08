const {checkToken} = require('../utils/jwt')

const isAuth = (req, res, next) => {
    if (!req.cookies.Token) {
        console.log('No token found, rendering register page');
        return res.render('register');
    }

    checkToken(req.cookies.Token, (err, data) => {
        if (err) {
            console.log('Token verification failed, rendering login page');
            return res.render('login');
        }

        req.user = data;
        next();
    });
};

module.exports = isAuth;
