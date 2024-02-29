const pool = require('../database');

const getCategories = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categorias');

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron categorías' });
        }
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getCategoriesNames = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT nombre FROM categorias');

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron categorías' });
        }
    } catch (error) {
        console.error('Error al obtener nombres de categorías:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getCategoryById = async (req, res) => {
    const idCategoria = req.params.id;

    if (!isNaN(idCategoria)) {
        try {
            const { rows } = await pool.query('SELECT * FROM categorias WHERE id = $1', [idCategoria]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró categoría' });
            }
        } catch (error) {
            console.error('Error al obtener categoría por ID:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Categoría no encontrada bajo ese ID' });
    }
};

const getCategoryByName = async (req, res) => {
    const name = req.params.nombre;

    if (typeof name === 'string') {
        try {
            const { rows } = await pool.query('SELECT * FROM categorias WHERE nombre = $1', [name]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró categoría' });
            }
        } catch (error) {
            console.error('Error al obtener categoría por nombre:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Categoría no encontrada bajo ese nombre' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    getCategoryByName,
    getCategoriesNames
};
