const { Router } = require('express');
const router = Router();

const { getProducts, getProductById, getProductByName, getProductsByCategory } = require('../controllers/product');

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:name', getProductByName);
router.get('/products/category/:name', getProductsByCategory);

module.exports = router;