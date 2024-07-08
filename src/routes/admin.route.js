const { Router } = require('express');
const { createNews, updateNews, removeNews, updateUser, createAuthor, removeAuthor } = require('../controllers/admin.controller');
const router = Router();

router.post('/news', createNews);
router.delete('/news/:id', removeNews);
router.put('/users/:id', updateUser);
router.post('/authors', createAuthor);
router.delete('/authors/:id', removeAuthor);

module.exports = router;