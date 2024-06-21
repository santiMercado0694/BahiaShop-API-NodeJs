require('dotenv').config({ path: "../../.env" });
const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT user_id, nombre, apellido, email, rol FROM users');

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
            const { rows } = await pool.query('SELECT user_id, nombre, apellido, email, rol FROM users WHERE nombre = $1', [nombre]);

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

// Obtener usuario por id
const getUserById = async (req, res) => {
    const id = req.params.id;

    if (!isNaN(id)) {
        try {
            const { rows } = await pool.query('SELECT user_id, nombre, apellido, email, rol FROM users WHERE user_id = $1', [id]);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró el usuario' });
            }
        } catch (error) {
            console.error('Error al obtener usuario por id:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Usuario no encontrado con ese id' });
    }
};

// Obtener usuario por email
const getUserByEmail = async (req, res) => {
    const email = req.params.email;

    if (typeof email === 'string') {
        try {
            const { rows } = await pool.query('SELECT user_id, nombre, apellido, email, rol FROM users WHERE email = $1', [email]);

            if (rows.length > 0) {
                res.status(200).json(rows[0]); // Retorna solo el primer usuario encontrado
            } else {
                res.status(404).json({ error: 'No se encontró el usuario' });
            }
        } catch (error) {
            console.error('Error al obtener usuario por email:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Correo electrónico no válido' });
    }
};


const addUser = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;
    const rol = 'Cliente';

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const hashedPassword = await bcrypt.hash(password, 10);
            const userResult = await client.query(
                'INSERT INTO users (nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
                [nombre, apellido, email, hashedPassword, rol]
            );

            const userId = userResult.rows[0].user_id;

            await client.query(
                'INSERT INTO carts (user_id) VALUES ($1)',
                [userId]
            );

            await client.query('COMMIT');
            res.status(201).json({ message: 'Usuario y carrito añadidos exitosamente' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error al añadir usuario y carrito:', error.message);
            res.status(400).json({ error: 'Error al añadir usuario y carrito' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    const { user_id, rol } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

        if (rows.length > 0) {
            await pool.query('UPDATE users SET rol = $1 WHERE user_id = $2', [rol, user_id]);
            res.status(200).json({ message: 'Rol de usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'No se encontró el usuario' });
        }
    } catch (error) {
        console.error('Error al actualizar rol de usuario:', error.message);
        res.status(400).json({ error: 'Error al actualizar rol de usuario' });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    const idUsuario = req.params.user_id;

    if (!isNaN(idUsuario)) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [idUsuario]);

            if (rows.length > 0) {
                // Obtener el cart_id del usuario
                const { rows: cartRows } = await pool.query('SELECT cart_id FROM carts WHERE user_id = $1', [idUsuario]);

                if (cartRows.length > 0) {
                    const cartId = cartRows[0].cart_id;

                    // Eliminar los items del carrito
                    await pool.query('DELETE FROM carts_items WHERE cart_id = $1', [cartId]);

                    // Eliminar el carrito
                    await pool.query('DELETE FROM carts WHERE cart_id = $1', [cartId]);
                }

                // Eliminar el usuario
                await pool.query('DELETE FROM users WHERE user_id = $1', [idUsuario]);
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
                const token = jwt.sign({ user_id: user.user_id, email: user.email, rol: user.rol }, process.env.SECRET_KEY, { expiresIn: '1h' });
                const userData = {
                    user_id: user.user_id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    rol: user.rol,
                    token
                };
                res.status(200).json(userData);
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
    getUserById,
    getUserByName,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    authenticateUser
};
