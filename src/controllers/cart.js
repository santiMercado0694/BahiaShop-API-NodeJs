const pool = require('../database');

const getCart = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const { rows } = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
        }
    } catch (error) {
        console.error('Error al obtener carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener carrito por usuario
const getCartByUserId = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const { rows } = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
        if (rows.length > 0) {
            const cartId = rows[0].cart_id;
            const cartItems = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
            res.status(200).json(cartItems.rows);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
        }
    } catch (error) {
        console.error('Error al obtener carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getCartItemById = async (req, res) => {
    const cartItemId = req.params.cart_item_id;
    try {
        const { rows } = await pool.query('SELECT * FROM cart_items WHERE cart_item_id = $1', [cartItemId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al obtener producto del carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Actualizar cantidad de un producto en el carrito
const updateCartItemQuantity = async (req, res) => {
    const cartItemId = req.params.cart_item_id;
    const { quantity } = req.body;
    try {
        await pool.query('UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2', [quantity, cartItemId]);
        res.status(200).json({ message: 'Cantidad del producto en el carrito actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar cantidad de producto en el carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar producto del carrito
const removeProductFromCart = async (req, res) => {
    const cartItemId = req.params.cart_item_id;
    try {
        await pool.query('DELETE FROM cart_items WHERE cart_item_id = $1', [cartItemId]);
        res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const clearCartByUserId = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const { rows } = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
        if (rows.length > 0) {
            const cartId = rows[0].cart_id;
            await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
            res.status(200).json({ message: 'Carrito vaciado exitosamente' });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
        }
    } catch (error) {
        console.error('Error al vaciar carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCart,
    getCartByUserId,
    getCartItemById,
    updateCartItemQuantity,
    removeProductFromCart,
    clearCartByUserId 
};
