const database = require('../database');

const getProducts = async (req, res) => {
    try {
        const [rows] = await database.execute('SELECT * FROM products');

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron productos' });
        }
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getProductById = async (req, res) => {
    const idProducto = req.params.id;

    if (!isNaN(idProducto)) {
        try {
            const [rows] = await database.execute('SELECT * FROM products WHERE id = ?', [idProducto]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontro producto' });
            }
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

const getProductByName = async (req, res) => {
    const nombre = req.params.name;

    if (typeof nombre === 'string') {
        try {
            const [rows] = await database.execute('SELECT * FROM products WHERE name = ?', [nombre]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontro producto' });
            }
        } catch (error) {
            console.error('Error al obtener producto por nombre:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese nombre' });
    }
};

const getProductsByCategory = async (req, res) => {
    const categoria = req.params.category_id;

    if (!isNaN(categoria)) {
        try {
            const [rows] = await database.execute('SELECT * FROM products WHERE category_id = ?', [categoria]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontraron productos bajo esa categoría' });
            }
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Categoría no válida' });
    }
};

const addProductCart = async (req, res) => {
    const { id, name, price, stock, quantity, image_path, rating } = req.body;

    try {
        await database.execute('INSERT INTO cart (id, name, price, stock, quantity, image_path, rating) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, name, price, stock, quantity, image_path, rating]);
        res.status(200).json({ message: 'Producto añadido al carrito exitosamente' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error.message);
        res.status(400).json({ error: 'Error al añadir producto al carrito' });
    }
};

const updateProductStock = async (req, res) => {
    const { id, stock } = req.body;

    try {
        const [check_product] = await database.execute('SELECT * FROM products WHERE id = ?', [id]);

        if (check_product.length > 0) {
            await database.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
            res.status(200).json({ message: 'Stock del producto actualizado' });
        } else {
            res.status(404).json({ error: 'No se encontró el producto' });
        }
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error.message);
        res.status(400).json({ error: 'Error al actualizar el stock del producto' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    getProductsByCategory,
    addProductCart,
    updateProductStock
};
