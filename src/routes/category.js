const { Router } = require('express');
const router = Router();

const { getCategories, getCategoryById, getCategoryByName } = require('../controllers/category');

router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.get('/categories/:name', getCategoryByName);

module.exports = router;