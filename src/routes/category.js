const { Router } = require('express');
const router = Router();

const { getCategories, getCategoryByName } = require('../controllers/category');

router.get('/categories', getCategories);
router.get('/categories/:name', getCategoryByName);

module.exports = router;