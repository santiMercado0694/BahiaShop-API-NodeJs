const { Router } = require('express');
const router = Router();
const bodyParser = require("body-parser");
const authenticateToken = require('./middleware/authMiddleware.js');

const user = require('./controllers/user.js');
const product = require('./controllers/product.js');
const cart = require('./controllers/cart.js');
const category = require('./controllers/category.js');

router.use(bodyParser.json());

router.get('/', (request, response) => {
    response.json({
        message: 'API | BAHIASHOP'
    });
});

//User Routes
router.get('/users', user.getUsers);
router.get('/users/:name', user.getUserByName);
router.post('/users', user.addUser);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

// Autenticar usuario (Inicio de sesión)
router.post('/login', user.authenticateUser);
// Middleware de autenticación para proteger la ruta de autenticación
router.use('/login', authenticateToken);

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
router.get('/categories/names', category.getCategoriesNames);
router.get('/categories/:id', category.getCategoryById);
router.get('/categories/name/:nombre', category.getCategoryByName);

module.exports = router;