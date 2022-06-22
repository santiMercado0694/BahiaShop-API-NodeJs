const { Router } = require('express');
const router = Router();

const { getProducts, getProductsByName, getProductsByCategory } = require('../controllers/product');

router.get('/products', getProducts);
router.get('/products/:name', getProductsByName);
router.get('/products/category/:name', getProductsByCategory);

module.exports = router;