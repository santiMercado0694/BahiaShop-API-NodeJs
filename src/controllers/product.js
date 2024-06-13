const pool = require('../database');

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
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

// Obtener producto por ID
const getProductById = async (req, res) => {
    const idProducto = req.params.id;
    if (!isNaN(idProducto)) {
        try {
            const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [idProducto]);
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

// Obtener producto por nombre
const getProductByName = async (req, res) => {
    const nombre = req.params.name;
    if (typeof nombre === 'string') {
        try {
            const { rows } = await pool.query('SELECT * FROM products WHERE name = $1', [nombre]);
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al obtener producto por nombre:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese nombre' });
    }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
    const categoria = req.params.category_id;
    if (!isNaN(categoria)) {
        try {
            const { rows } = await pool.query('SELECT * FROM products WHERE category_id = $1', [categoria]);
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
    const { user_id, product_id, quantity } = req.body;
    try {
        // Obtener el cart_id del usuario
        const cartInfo = await pool.query('SELECT cart_id FROM carts WHERE user_id = $1', [user_id]);
        
        if (cartInfo.rows.length === 0) {
            // Si no hay carrito para este usuario, devolvemos un error
            return res.status(404).json({ error: 'No se encontró el carrito del usuario' });
        }

        const cart_id = cartInfo.rows[0].cart_id;

        // Obtener el nombre del producto a partir del product_id
        const productInfo = await pool.query('SELECT name FROM products WHERE id = $1', [product_id]);
        const { name } = productInfo.rows[0];

        // Comprobar si el producto ya existe en carts_items
        const existingProduct = await pool.query('SELECT * FROM carts_items WHERE cart_id = $1 AND name = $2', [cart_id, name]);

        if (existingProduct.rows.length > 0) {
            // Si el producto ya existe, actualizar la cantidad
            await pool.query('UPDATE carts_items SET quantity = $1 WHERE cart_id = $2 AND name = $3', [quantity, cart_id, name]);
        } else {
            // Obtener el precio, el stock y la imagen del producto para agregar al carrito
            const productDetails = await pool.query('SELECT price, stock, image_path FROM products WHERE id = $1', [product_id]);
            const { price, stock, image_path } = productDetails.rows[0];

            // Verificar si hay suficiente stock para agregar al carrito
            if (stock < quantity) {
                return res.status(400).json({ error: 'No hay suficiente stock disponible para este producto' });
            }

            // Agregar el producto al carrito de usuario (carts_items)
            await pool.query(
                'INSERT INTO carts_items (cart_id, name, price, stock, quantity, image_path) VALUES ($1, $2, $3, $4, $5, $6)',
                [cart_id, name, price, stock, quantity, image_path]
            );
        }
        
        res.status(200).json({ message: 'Producto añadido al carrito exitosamente' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error.message);
        res.status(400).json({ error: 'Error al añadir producto al carrito' });
    }
};



const getProductStock = async (req, res) => {
    const idProducto = req.params.id;
    if (!isNaN(idProducto)) {
        try {
            const { rows } = await pool.query('SELECT stock FROM products WHERE id = $1', [idProducto]);
            if (rows.length > 0) {
                res.status(200).json({ stock: rows[0].stock });
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al obtener stock del producto:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

// Actualizar stock de un producto
const updateProductStock = async (req, res) => {
    const { id, stock } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length > 0) {
            await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [stock, id]);
            res.status(200).json({ message: 'Stock del producto actualizado' });
        } else {
            res.status(404).json({ error: 'No se encontró el producto' });
        }
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error.message);
        res.status(400).json({ error: 'Error al actualizar el stock del producto' });
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    const { name, details, description, price, stock, category_id, image_path } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO products (name, details, description, price, stock, category_id, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, details, description, price, stock, category_id, image_path]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateProduct = async (req, res) => {
    const idProducto = req.params.id;
    const { name, details, description, price, stock, category_id, image_path } = req.body;

    if (!isNaN(idProducto)) {
        try {
            // Obtener el nombre original del producto
            const { rows: originalRows } = await pool.query(
                'SELECT name FROM products WHERE id = $1',
                [idProducto]
            );

            if (originalRows.length > 0) {
                const originalName = originalRows[0].name;

                // Actualizar los productos en la tabla cart_items
                await pool.query(
                    'UPDATE carts_items SET name = $1, price = $2, stock = $3, image_path = $4 WHERE name = $5',
                    [name, price, stock, image_path, originalName]
                );

                // Actualizar el producto en la tabla products
                const { rows: updatedRows } = await pool.query(
                    'UPDATE products SET name = $1, details = $2, description = $3, price = $4, stock = $5, category_id = $6, image_path = $7 WHERE id = $8 RETURNING *',
                    [name, details, description, price, stock, category_id, image_path, idProducto]
                );

                if (updatedRows.length > 0) {
                    res.status(200).json(updatedRows[0]);
                } else {
                    res.status(404).json({ error: 'No se encontró producto' });
                }
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};


// Eliminar un producto
const deleteProduct = async (req, res) => {
    const idProducto = req.params.id;

    if (!isNaN(idProducto)) {
        try {
            // Obtener el nombre del producto a eliminar
            const { rows: originalRows } = await pool.query(
                'SELECT name FROM products WHERE id = $1',
                [idProducto]
            );

            if (originalRows.length > 0) {
                const productName = originalRows[0].name;

                // Eliminar los productos en la tabla cart_items con el mismo nombre
                await pool.query(
                    'DELETE FROM carts_items WHERE name = $1',
                    [productName]
                );

                // Eliminar el producto de la tabla products
                const { rowCount } = await pool.query(
                    'DELETE FROM products WHERE id = $1',
                    [idProducto]
                );

                if (rowCount > 0) {
                    res.status(200).json({ message: 'Producto eliminado correctamente' });
                } else {
                    res.status(404).json({ error: 'No se encontró producto' });
                }
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

export default deleteProduct;


module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    getProductsByCategory,
    addProductCart,
    getProductStock,
    updateProductStock,
    createProduct,
    updateProduct,
    deleteProduct
};
