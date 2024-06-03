const pool = require('../database');

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

// Agregar producto al carrito
const addProductToCart = async (req, res) => {
    const userId = req.params.user_id;
    const { name, price, quantity, image_path } = req.body;
    try {
        // Verificar si el usuario tiene un carrito
        const { rows: cartRows } = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
        let cartId;
        if (cartRows.length === 0) {
            // Si no tiene, crear un nuevo carrito
            const { rows: newCartRows } = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id', [userId]);
            cartId = newCartRows[0].cart_id;
        } else {
            cartId = cartRows[0].cart_id;
        }

        // Agregar el producto al carrito
        await pool.query('INSERT INTO cart_items (cart_id, name, price, quantity, image_path) VALUES ($1, $2, $3, $4, $5)', [cartId, name, price, quantity, image_path]);
        res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar cantidad de un producto en el carrito
const updateCartItemQuantity = async (req, res) => {
    const cartItemId = req.params.cart_item_id;
    const { quantity } = req.body;
    try {
        await pool.query('UPDATE cart_items SET quantity = $1 WHERE cart_items_id = $2', [quantity, cartItemId]);
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
        await pool.query('DELETE FROM cart_items WHERE cart_items_id = $1', [cartItemId]);
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
    getCartByUserId,
    addProductToCart,
    updateCartItemQuantity,
    removeProductFromCart,
    clearCartByUserId 
};
