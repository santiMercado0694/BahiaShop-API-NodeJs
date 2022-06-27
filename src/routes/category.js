const { Router } = require('express');
const router = Router();

const { getCategories, getCategoryById, getCategoryByName } = require('../controllers/category');

/**
 * @swagger
 * definitions:
 *   Category:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: "El id de la categoria generado automaticamente"
 *       name:
 *         type: string
 *         description: "Nombre de la categoria"
 *     example:
 *       id: "1"
 *       name: "Computadoras"
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     description: Ruta para obtener todas las categorias.
 *     tags:
 *       - Categorías
 *     responses:
 *       '200':
 *         description: Consulta exitosa
 *       '404':
 *         description: No se encontraron categorias
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     description: Ruta para obtener una categoría por ID.
 *     tags: 
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       '200':
 *         description: Exito en la consulta.
 *       '400':
 *         description: Categoria no encontrada bajo ese id.
 *       '404':
 *         description: No se encontro categoria.  
 */
router.get('/categories/:id', getCategoryById);

/**
 * @swagger
 * /categories/{name}:
 *   get:
 *     description: Ruta para obtener una categoría por nombre.
 *     tags: 
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la categoría
 *     responses:
 *       '200':
 *         description: Exito en la consulta.
 *       '400':
 *         description: Categoria no encontrada bajo ese nombre.
 *       '404':
 *         description: No se encontro categoria.  
 */
router.get('/categories/:name', getCategoryByName);

module.exports = router;