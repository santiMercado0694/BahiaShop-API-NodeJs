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
router.get('/users/id/:id', user.getUserById);
router.get('/users/email/:email', user.getUserByEmail);
router.post('/users', user.addUser);
router.put('/users/update', user.updateUser);
router.delete('/users/delete/:id', user.deleteUser);

// Autenticar usuario (Inicio de sesión)
router.post('/users/authenticate', user.authenticateUser);
// Middleware de autenticación para proteger la ruta de autenticación
router.use('/users/authenticate', authenticateToken);

//Products Routes
router.get('/products', product.getProducts);
router.get('/products/:id', product.getProductById);
router.get('/products/name/:name', product.getProductByName);
router.get('/products/category/:category_id', product.getProductsByCategory);
router.get('/products/:id/stock', product.getProductStock);
router.post('/products/cart', product.addProductCart);
router.put('/products/stock', product.updateProductStock);
router.post('/products', product.createProduct);
router.put('/products/:id', product.updateProduct);
router.delete('/products/:id', product.deleteProduct);

//Cart Routes
router.get('/cart/:user_id', cart.getCartByUserId);
router.put('/cart/:user_id/update/:cart_item_id', cart.updateCartItemQuantity);
router.delete('/cart/:user_id/remove/:cart_item_id', cart.removeProductFromCart);
router.delete('/cart/:user_id/clear', cart.clearCartByUserId);

//Category Routes
router.get('/categories', category.getCategories);
router.get('/categories/names', category.getCategoriesNames);
router.get('/categories/:id', category.getCategoryById);
router.get('/categories/name/:nombre', category.getCategoryByName);
router.post('/categories', category.createCategory);
router.put('/categories/:id', category.updateCategory);
router.delete('/categories/:id', category.deleteCategory);

module.exports = router;