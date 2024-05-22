const { Router } = require('express');
const router = Router();

const { getProducts, getProductById, getProductByName, getProductsByCategory, addProductCart, updateProductStock } = require('../controllers/product');

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:name', getProductByName);
router.get('/products/category/:category_id', getProductsByCategory);
router.post('/products', addProductCart);
router.put('/products/update', updateProductStock);

module.exports = router;