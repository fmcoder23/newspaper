const {Router} = require('express');
const router = Router();

const {create, update, display, remove} = require('../controllers/authors.controller');

router.post('/', create);
router.put('/:id', update);
router.get('/', display);
router.delete('/:id', remove);

module.exports = router;