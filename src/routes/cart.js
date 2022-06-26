const { Router } = require('express');
const router = Router();

const { getContentCart, updateProductQuantity, deleteContentCart, deleteProduct } = require('../controllers/cart');

router.get('/cart', getContentCart);
router.post('/cart/update/:id', updateProductQuantity);
router.delete('/cart/delete', deleteContentCart);
router.delete('/cart/delete/:id', deleteProduct);

module.exports = router;