const { Router } = require('express');
const router = Router();

const { getContentCart } = require('../controllers/cart');

router.get('/cart', getContentCart);

module.exports = router;