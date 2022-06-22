const { Router } = require('express');
const router = Router();
const bodyParser = require("body-parser");

const product = require('./controllers/product.js');
const category = require('./controllers/category.js');

router.use(bodyParser.json());

router.get('/', (request, response) => {
    response.json({
        message: 'API | BAHIACOMPUTACION'
    });
});

router.get('/products', product.getProducts);
router.get('/products/:id', product.getProductById);
router.get('/products/:name', product.getProductByName);
router.get('/products/category/:name', product.getProductsByCategory);

router.get('/categories', category.getCategories);
router.get('/categories/:id', category.getCategoryById);
router.get('/categories/:name', category.getCategoryByName);

module.exports = router;