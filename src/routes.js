const { Router } = require('express');
const router = Router();
const bodyParser = require("body-parser");

const product = require('./controllers/product.js');
const cart = require('./controllers/cart.js');
const category = require('./controllers/category.js');

router.use(bodyParser.json());

router.get('/', (request, response) => {
    response.json({
        message: 'API | BAHIACOMPUTACION'
    });
});

//Products Routes
router.get('/products', product.getProducts);
router.get('/products/:id', product.getProductById);
router.get('/products/name/:name', product.getProductByName);
router.get('/products/category/:category_id', product.getProductsByCategory);
router.post('/products', product.addProductCart);
router.put('/products/update', product.updateProductStock);


//Cart Routes
router.get('/cart', cart.getContentCart);
router.put('/cart/update', cart.updateProductQuantity);
router.delete('/cart/delete', cart.deleteContentCart);
router.delete('/cart/delete/:id', cart.deleteProduct);

//Category Routes
router.get('/categories', category.getCategories);
router.get('/categories/:id', category.getCategoryById);
router.get('/categories/nombre/:nombre', category.getCategoryByName);

module.exports = router;