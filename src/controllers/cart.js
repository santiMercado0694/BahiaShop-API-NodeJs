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
            const cartItems = await pool.query('SELECT * FROM carts_items WHERE cart_id = $1', [cartId]);
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
        const { rows } = await pool.query('SELECT * FROM carts_items WHERE cart_item_id = $1', [cartItemId]);
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
        // Obtener la información del producto en el carrito
        const cartItemInfo = await pool.query('SELECT * FROM carts_items WHERE cart_item_id = $1', [cartItemId]);
        if (cartItemInfo.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el producto en el carrito' });
        }
        
        const { name, cart_id, stock: cartStock, quantity: oldQuantity } = cartItemInfo.rows[0];
        
        // Obtener el product_id a partir del nombre del producto
        const productInfo = await pool.query('SELECT id, stock FROM products WHERE name = $1', [name]);
        if (productInfo.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el producto' });
        }
        
        const { id: productId, stock: productStock } = productInfo.rows[0];
        
        // Verificar si hay suficiente stock para actualizar la cantidad
        const newQuantity = parseInt(quantity);
        if (newQuantity > productStock + oldQuantity) {
            return res.status(400).json({ error: 'No hay suficiente stock disponible' });
        }
        
        // Actualizar la cantidad en carts_items
        await pool.query('UPDATE carts_items SET quantity = $1 WHERE cart_item_id = $2', [newQuantity, cartItemId]);
        
        // Calcular la diferencia de stock en la tabla de productos
        const stockDifference = productStock + oldQuantity - newQuantity;
        
        // Actualizar el stock en la tabla de productos
        await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [stockDifference, productId]);

        // Actualizar el stock de todos los productos con el mismo nombre en carts_items
        await pool.query('UPDATE carts_items SET stock = stock - $1 WHERE name = $2', [stockDifference, name]);
        
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
        // Obtener la información del producto en el carrito
        const cartItemInfo = await pool.query('SELECT * FROM carts_items WHERE cart_item_id = $1', [cartItemId]);
        if (cartItemInfo.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el producto en el carrito' });
        }
        
        const { name, quantity } = cartItemInfo.rows[0];
        
        // Obtener el product_id a partir del nombre del producto
        const productInfo = await pool.query('SELECT id, stock FROM products WHERE name = $1', [name]);
        if (productInfo.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el producto' });
        }
        
        const { id: productId, stock: productStock } = productInfo.rows[0];
        
        // Actualizar el stock en la tabla de productos
        await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [productStock + quantity, productId]);
        
        // Eliminar el producto del carrito
        await pool.query('DELETE FROM carts_items WHERE cart_item_id = $1', [cartItemId]);
        
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
            const cartItems = await pool.query('SELECT * FROM carts_items WHERE cart_id = $1', [cartId]);
            if (cartItems.rows.length > 0) {
                // Recorrer todos los productos del carrito y actualizar el stock en la tabla products
                for (const item of cartItems.rows) {
                    const { name, quantity } = item;
                    const productInfo = await pool.query('SELECT id, stock FROM products WHERE name = $1', [name]);
                    if (productInfo.rows.length > 0) {
                        const { id: productId, stock: productStock } = productInfo.rows[0];
                        await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [productStock + quantity, productId]);
                    }
                }
            }
            await pool.query('DELETE FROM carts_items WHERE cart_id = $1', [cartId]);
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
