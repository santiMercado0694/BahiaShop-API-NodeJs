const pool = require('../database');

// Obtener todas las categorías
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

// Obtener nombres de todas las categorías
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

// Obtener categoría por ID
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

// Obtener categoría por nombre
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

// Crear una nueva categoría
const createCategory = async (req, res) => {
    const { nombre } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear categoría:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Editar una categoría
const updateCategory = async (req, res) => {
    const idCategoria = req.params.id;
    const { nombre } = req.body;
    if (!isNaN(idCategoria)) {
        try {
            const { rows } = await pool.query(
                'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
                [nombre, idCategoria]
            );
            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ error: 'No se encontró categoría' });
            }
        } catch (error) {
            console.error('Error al actualizar categoría:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Categoría no encontrada bajo ese ID' });
    }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    const idCategoria = req.params.id;
    if (!isNaN(idCategoria)) {
        try {
            const { rowCount } = await pool.query('DELETE FROM categorias WHERE id = $1', [idCategoria]);
            if (rowCount > 0) {
                res.status(200).json({ message: 'Categoría eliminada correctamente' });
            } else {
                res.status(404).json({ error: 'No se encontró categoría' });
            }
        } catch (error) {
            console.error('Error al eliminar categoría:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Categoría no encontrada bajo ese ID' });
    }
};

module.exports = {
    getCategories,
    getCategoriesNames,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory
};
