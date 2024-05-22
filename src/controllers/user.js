require('dotenv').config({ path: "../../.env" });
const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nombre, apellido, email, rol FROM users');

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron usuarios' });
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener usuario por nombre
const getUserByName = async (req, res) => {
    const nombre = req.params.name;

    if (typeof nombre === 'string') {
        try {
            const { rows } = await pool.query('SELECT id, nombre, apellido, email, rol FROM users WHERE nombre = $1', [nombre]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró el usuario' });
            }
        } catch (error) {
            console.error('Error al obtener usuario por nombre:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Usuario no encontrado bajo ese nombre' });
    }
};

// Añadir un nuevo usuario
const addUser = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;
    const rol = 'cliente'; 

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5)', 
            [nombre, apellido, email, hashedPassword, rol]);
        res.status(201).json({ message: 'Usuario añadido exitosamente' });
    } catch (error) {
        console.error('Error al añadir usuario:', error.message);
        res.status(400).json({ error: 'Error al añadir usuario' });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    const { id, nombre, apellido, email, rol } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (rows.length > 0) {
            await pool.query('UPDATE users SET nombre = $1, apellido = $2, email = $3, rol = $4 WHERE id = $5', 
                [nombre, apellido, email, rol, id]);
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'No se encontró el usuario' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(400).json({ error: 'Error al actualizar usuario' });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    const idUsuario = req.params.id;

    if (!isNaN(idUsuario)) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [idUsuario]);

            if (rows.length > 0) {
                await pool.query('DELETE FROM users WHERE id = $1', [idUsuario]);
                res.status(200).json({ message: 'Usuario eliminado exitosamente' });
            } else {
                res.status(404).json({ error: 'No se encontró el usuario' });
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'ID de usuario no válido' });
    }
};

// Autenticar usuario (Inicio de sesión)
const authenticateUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length > 0) {
            const user = rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ error: 'Credenciales inválidas' });
            }
        } else {
            res.status(404).json({ error: 'No se encontró el usuario' });
        }
    } catch (error) {
        console.error('Error al autenticar usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getUsers,
    getUserByName,
    addUser,
    updateUser,
    deleteUser,
    authenticateUser
};
