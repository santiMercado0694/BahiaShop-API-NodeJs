const { Router } = require('express');
const router = Router();

const { getCategories, getCategoriesNames, getCategoryById, getCategoryByName } = require('../controllers/category');

router.get('/categories', getCategories);
router.get('/categories/names', getCategoriesNames);
router.get('/categories/:id', getCategoryById);
router.get('/categories/name/:nombre', getCategoryByName);

module.exports = router;