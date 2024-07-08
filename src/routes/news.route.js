const { Router } = require('express');
const router = Router();

const isAuth = require('../middlewares/is-auth.middleware');

const { create, update, remove, displayAll, displayOne } = require('../controllers/news.controller');

router.post('/', create);
router.put('/:id', update);
router.get('/', displayAll);
router.get('/:id', isAuth, displayOne);
router.delete('/:id', remove);

module.exports = router;