const { Router } = require('express');
const router = Router();

const { getProducts, getProductById, getProductByName, getProductsByCategory, addProductCart } = require('../controllers/product');

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:name', getProductByName);
router.get('/products/category/:name', getProductsByCategory);
router.post('/products', addProductCart);

module.exports = router;