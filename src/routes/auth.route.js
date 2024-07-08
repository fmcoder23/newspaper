const {Router} = require('express');
const router = Router();

const {register, login, getUsers, adminLogin} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/', getUsers);

module.exports = router;