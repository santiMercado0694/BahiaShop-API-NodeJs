const { Router } = require('express');
const router = Router();

const { getProducts, getProductById, getProductByName, getProductsByCategory, addProductCart, updateProductStock } = require('../controllers/product');

/**
 * @swagger
 * definitions:
 *   Products:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: "El id del producto que se agrego al carrito"
 *       name:
 *         type: string
 *         description: "Nombre del producto"
 *       details:
 *         type: string
 *         description: "Breve descripcion del producto"
 *       description:
 *         type: string
 *         description: "Descripcion detallada del producto"
 *       price:
 *         type: double
 *         description: "Precio del producto"
 *       stock:
 *         type: integer
 *         description: "Stock disponible del producto"
 *       category_id:
 *         type: string
 *         description: "ID de la categoria asociada AL Producto"
 *       image_path:
 *         type: string
 *         description: "Ruta de la imagen del producto"
 *       rating:
 *         type: integer
 *         description: "Rating del producto"
 *     example:
 *       id: "1"
 *       name: "MacBook Pro"
 *       details: "13 pulgadas, 1TB SDD, 16GB RAM"
 *       description: "Descripcion detallada del producto"
 *       price: 250000
 *       stock: 4
 *       category_id: "2"
 *       image_path: "MacBook.png"
 */

/**
 * @swagger
 * /products:
 *   get:
 *     description: Ruta para obtener todos los productos de la tienda.
 *     tags:
 *       - Tienda
 *     responses:
 *       '200':
 *         description: Consulta exitosa
 *       '404':
 *         description: No se encontraron productos en la tienda
 */
router.get('/products', getProducts);


/**
 * @swagger
 * /products/{id}:
 *   get:
 *     description: Ruta para obtener un producto por ID.
 *     tags: 
 *       - Tienda
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       '200':
 *         description: Exito en la consulta.
 *       '400':
 *         description: Producto no encontrado bajo ese id.
 *       '404':
 *         description: No se encontro el producto.  
 */
router.get('/products/:id', getProductById);

/**
 * @swagger
 * /products/{name}:
 *   get:
 *     description: Ruta para obtener un producto por nombre.
 *     tags: 
 *       - Tienda
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del producto
 *     responses:
 *       '200':
 *         description: Exito en la consulta.
 *       '400':
 *         description: Producto no encontrado bajo ese nombre.
 *       '404':
 *         description: No se encontro el producto.  
 */
router.get('/products/:name', getProductByName);

/**
 * @swagger
 * /products/category/{category_id}:
 *   get:
 *     description: Ruta para obtener todos los productos de una categoria
 *     tags: 
 *       - Tienda
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoria
 *     responses:
 *       '200':
 *         description: Exito en la consulta.
 *       '404':
 *         description: No se encontraron productos bajo esa categoria.  
 */
router.get('/products/category/:category_id', getProductsByCategory);

/**
 * @swagger
 * /products:
 *   post:
 *     description: Ruta para agregar un producto al carrito.
 *     tags: 
 *       - Tienda
 *     parameters:
 *       - in: body
 *         name: cart_add
 *         description: Datos a cargar.
 *         schema:
 *           type: object
 *           required: 
 *             - id
 *             - name
 *             - price
 *             - stock
 *             - quantity
 *             - image_path
 *             - rating
 *           properties:
 *             id:
 *              type: string
 *             name:
 *              type: string
 *             price:
 *              type: double
 *             stock:
 *              type: integer
 *             quantity:
 *              type: integer
 *             image_path:
 *              type: string
 *             rating:
 *              type: integer
 *     responses:
 *       '200':
 *         description: Producto añadido al carrito exitosamente.
 *       '400':
 *         description: Error al agregar producto al carrito.
 * 
 */
router.post('/products', addProductCart);

/**
 * @swagger
 * /products/update:
 *   put:
 *     description: Ruta para modificar el stock de un producto de la tienda.
 *     tags: 
 *       - Tienda
 *     parameters:
 *       - in: body
 *         name: Product stock
 *         description: Dato a modificar.
 *         schema:
 *           type: object
 *           required: 
 *             - id
 *             - stock
 *           properties:
 *             id:
 *               type: string
 *             stock:
 *               type: integer
 *     responses:
 *       '200':
 *         description: Stock del producto actualizado.
 *       '400':
 *         description: Error al modificar el stock deseado del producto.
 *       '404':
 *         description: No se encontró el Producto.
 */
router.put('/products/update', updateProductStock);

module.exports = router;