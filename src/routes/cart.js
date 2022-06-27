const { Router } = require('express');
const router = Router();

const { getContentCart, updateProductQuantity, deleteContentCart, deleteProduct } = require('../controllers/cart');

/**
 * @swagger
 * definitions:
 *   Cart:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: "El id del producto que se agrego al carrito"
 *       name:
 *         type: string
 *         description: "Nombre del producto"
 *       price:
 *         type: double
 *         description: "Precio del producto"
 *       stock:
 *         type: integer
 *         description: "Stock disponible del producto"
 *       quantity:
 *         type: integer
 *         description: "Cantidad de items del producto"
 *       image_path:
 *         type: string
 *         description: "Ruta de la imagen del producto"
 *     example:
 *       id: "1"
 *       name: "MacBook Pro"
 *       price: 250000
 *       stock: 4
 *       quantity: 2
 *       image_path: "MacBook.png"
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     description: Ruta para obtener todos los productos del carrito.
 *     tags:
 *       - Carrito
 *     responses:
 *       '200':
 *         description: Consulta exitosa
 *       '404':
 *         description: No se encontraron productos en el carrito
 */
router.get('/cart', getContentCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     description: Ruta para modificar la cantidad que se desea de un producto de tu carrito.
 *     tags: 
 *       - Carrito
 *     parameters:
 *       - in: body
 *         name: Product quantity
 *         description: Datos a modificar.
 *         schema:
 *           type: object
 *           required: 
 *             - id
 *             - quantity
 *           properties:
 *             id:
 *               type: string
 *             quantity:
 *               type: integer
 *     responses:
 *       '200':
 *         description: Cantidad del producto actualizado.
 *       '400':
 *         description: Error al modificar la cantidad deseada del producto.
 *       '404':
 *         description: No se encontró el Producto.
 */
router.put('/cart/update', updateProductQuantity);

/**
 * @swagger
 * /cart/delete:
 *   delete:
 *     description: Ruta para vaciar el contenido del carrito.
 *     tags: 
 *       - Carrito
 *     responses:
 *       '201':
 *         description: Carrito vaciado exitosamente.
 *       '404':
 *         description: Error al querer vaciar el carrito.
 */
router.delete('/cart/delete', deleteContentCart);

/**
 * @swagger
 * /cart/delete/{id}:
 *   delete:
 *     description: Ruta para eliminar un producto del carrito.
 *     tags: 
 *       - Carrito
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         description: ID del producto a eliminar.
 *     responses:
 *       '200':
 *         description: Producto eliminado del carrito.
 *       '400':
 *         description: Parámetro inválido.
 *       '404':
 *         description: No existe el producto en el carrito.
 */
router.delete('/cart/delete/:id', deleteProduct);

module.exports = router;