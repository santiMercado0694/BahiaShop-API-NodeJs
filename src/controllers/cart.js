const pool = require('../database');

const getContentCart = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cart');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener contenido del carrito:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateProductQuantity = async (req, res) => {
    const { id, quantity } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM cart WHERE id = $1', [id]);

        if (rows.length > 0) {
            await pool.query('UPDATE cart SET quantity = $1 WHERE id = $2', [quantity, id]);
            res.status(200).json({ message: 'Cantidad del producto actualizado' });
        } else {
            res.status(404).json({ error: 'No se encontró el producto' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error.message);
        res.status(400).json({ error: 'Error al actualizar la cantidad del producto' });
    }
};

const deleteProduct = async (req, res) => {
    if (!isNaN(req.params.id)) {
        try {
            const { rows } = await pool.query('SELECT * FROM cart WHERE id = $1', [req.params.id]);

            if (rows.length > 0) {
                await pool.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
                res.status(200).json({ message: 'Producto eliminado del carrito' });
            } else {
                res.status(404).json({ error: 'No existe el producto en el carrito' });
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error.message);
            res.status(400).json({ error: 'Algo salió mal' });
        }
    } else {
        res.status(400).json({ error: 'Parámetro inválido' });
    }
};

const deleteContentCart = async (req, res) => {
    try {
        await pool.query('DELETE FROM cart');
        res.status(201).json({ success: 'Carrito vaciado exitosamente' });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error.message);
        res.status(404).json({ error: 'Error al querer vaciar el carrito' });
    }
};

module.exports = {
    getContentCart,
    updateProductQuantity,
    deleteProduct,
    deleteContentCart
};
